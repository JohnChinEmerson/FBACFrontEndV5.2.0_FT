import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { KitchenQueueService } from 'src/app/services/Sales/kitchen-queue.service';
import { _kitchenNoticeSeconds, _kitchenRefreshMs } from 'src/global-variables';
import { KitchenOrderCardsComponent } from '../../../shared/kitchen-order-cards/kitchen-order-cards.component';
import { HomeComponent } from '../../home.component';

// Sales > Kitchen Queue: assembler screen for the lines sent with SEND (QUEUE: one card per order,
// READY TO SERVE: one card per table, HISTORY: every line sent between the dates).
@Component({
  selector: 'app-kitchen-queue',
  templateUrl: './kitchen-queue.component.html',
  styleUrls: ['./kitchen-queue.component.css']
})
export class KitchenQueueComponent implements OnInit, OnDestroy {
  static readonly SUBMENU_ID = '329';
  static readonly REFRESH_MS = _kitchenRefreshMs;

  view        : string = 'active';
  views       = [
    { 'Value': 'active',  'Label': 'QUEUE' },
    { 'Value': 'ready',   'Label': 'READY TO SERVE' },
    { 'Value': 'history', 'Label': 'HISTORY' },
  ];
  statusLabels = KitchenOrderCardsComponent.statusLabels;
  historyStatuses = [
    { 'Value': 'all', 'Label': 'All' },
    ...Object.keys(KitchenOrderCardsComponent.statusLabels).map(s => ({ 'Value': s, 'Label': KitchenOrderCardsComponent.statusLabels[s] })),
  ];
  lines       : any[] = [];
  cards       : any[] = [];
  historyLines: any[] = [];
  searchKey   : string = '';
  historyStatus : string = 'all';
  dateFrom    : any = new Date();
  dateTo      : any = new Date();
  isLoading   : boolean = false;
  isSaving    : boolean = false;
  canPrepare  : boolean = false;
  canReady    : boolean = false;
  canServe    : boolean = false;
  now         : number = Date.now();
  private timer: any;
  private subscription = new Subscription();
  // cancelled lines already announced (null until the first load of the QUEUE)
  private knownCancelledIds: Set<number> | null = null;

  constructor(
    private kitchenQueueService : KitchenQueueService,
    private dateTimesService    : DateTimesService,
    private notificationService : NotificationService,
    private auth_service        : AuthService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
  ) { }

  async ngOnInit(): Promise<void> {
    // the page can also be opened by its URL, so the buttons are always the Kitchen Queue's
    this.homeTs.onSelectSubMenu(KitchenQueueComponent.SUBMENU_ID);
    await this.homeTs.getButtons();
    this.canPrepare = this.auth_service.HasButton('PREPARING');
    this.canReady   = this.auth_service.HasButton('READY TO SERVE');
    this.canServe   = this.auth_service.HasButton('SERVED');
    // the cashier mostly serves, the assembler mostly prepares
    if (this.canServe && !this.canPrepare && !this.canReady) this.view = 'ready';

    this.subscription.add(this.kitchenQueueService.requiredRefresh.subscribe(() => this.loadQueue(true)));
    await this.loadQueue();
    this.timer = setInterval(() => {
      this.now = Date.now();
      if (this.view != 'history' && !this.isSaving) this.loadQueue(true);
    }, KitchenQueueComponent.REFRESH_MS);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    this.subscription.unsubscribe();
  }

  async selectView(view: string){
    this.view = view;
    this.lines = [];
    this.cards = [];
    this.historyLines = [];
    await this.loadQueue();
  }

  async loadQueue(silent: boolean = false){
    if (!silent) this.isLoading = true;
    const view = this.view;
    try {
      var lines: any[] = await firstValueFrom(this.kitchenQueueService.getKitchenQueue(
        view,
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      ));
      if (view != this.view) return;  // the tab changed while loading
      // MySQL "yyyy-MM-dd HH:mm:ss" -> ISO, so the date pipe parses it the same in every browser
      for (const line of lines)
        for (const col of ['SentDateTime', 'PreparingDateTime', 'ReadyDateTime', 'ServedDateTime', 'CancelledDateTime'])
          if (line[col]) line[col] = String(line[col]).replace(' ', 'T');
      this.lines = lines;
      if (view == 'active') this.announceCancelled(lines);
      this.groupOrders();
    } catch (err: any) {
      if (!silent) this.notificationService.toastrError(err?.error?.message || 'Unable to load the kitchen queue.');
    }
    this.isLoading = false;
  }

  // a line cancelled after it was sent: visible + audible notice once (the card keeps it as CANCELLED)
  private announceCancelled(lines: any[]){
    const cancelled = lines.filter(l => l.KitchenStatus == 'cancelled');
    const known = this.knownCancelledIds;
    const fresh = known ? cancelled.filter(l => !known.has(l.id)) : cancelled;
    this.knownCancelledIds = new Set(cancelled.map(l => l.id));
    if (fresh.length == 0) return;
    const byOrder = KitchenOrderCardsComponent.group(fresh, 'order');
    byOrder.forEach(card => {
      const items = card.Lines.filter(l => !KitchenOrderCardsComponent.isComponent(l)).map(l => +l.Qty + ' ' + l.ItemName);
      this.notificationService.toastrTimed((items.length ? items : card.Lines.map(l => +l.Qty + ' ' + l.ItemName)).join(', '),
        card.TableName + ' - CANCELLED', _kitchenNoticeSeconds * 2, 'error');
    });
    this.notificationService.playAlert('cancelled');
  }

  // QUEUE: one card per order; READY TO SERVE: one card per table (Serve All per table); HISTORY: the rows
  groupOrders(){
    const key = this.searchKey.trim().toLowerCase();
    const lines = this.lines.filter(l => !key
      || (l.TableName || '').toLowerCase().includes(key)
      || (l.ItemName || '').toLowerCase().includes(key)
      || (l.Area || '').toLowerCase().includes(key));
    if (this.view == 'history') {
      this.historyLines = lines.filter(l => this.historyStatus == 'all' || l.KitchenStatus == this.historyStatus);
      this.cards = [];
    } else {
      this.cards = KitchenOrderCardsComponent.group(lines, this.view == 'ready' ? 'table' : 'order');
    }
  }

  applyFilter(){
    this.groupOrders();
  }

  clearSearch(){
    this.searchKey = '';
    this.groupOrders();
  }

  isComponent(line: any){
    return KitchenOrderCardsComponent.isComponent(line);
  }

  isUpgrade(line: any){
    return KitchenOrderCardsComponent.isUpgrade(line);
  }

  tableName(line: any){
    return line.TableName && line.TableName != 'NA' ? line.TableName : line.OrderType || 'No table';
  }

  statusTime(line: any){
    return { 'preparing': line.PreparingDateTime, 'ready': line.ReadyDateTime, 'served': line.ServedDateTime, 'cancelled': line.CancelledDateTime }[line.KitchenStatus] || line.SentDateTime;
  }

  onClickStatus(event: { Ids: any[], Status: string }){
    if (event.Ids.length == 0 || this.isSaving) return;
    this.isSaving = true;
    this.kitchenQueueService.updateKitchenStatus(event.Ids, event.Status).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.notificationService.toastrSuccess(res.message);
      },
      error: (err) => {
        this.isSaving = false;
        this.notificationService.toastrError(err.error.message);
        this.loadQueue(true);
      }
    });
  }

  onClickAcknowledge(ids: any[]){
    if (ids.length == 0 || this.isSaving) return;
    this.isSaving = true;
    this.kitchenQueueService.acknowledgeCancelled(ids).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.notificationService.toastrSuccess(res.message);
      },
      error: (err) => {
        this.isSaving = false;
        this.notificationService.toastrError(err.error.message);
        this.loadQueue(true);
      }
    });
  }

  // HISTORY print: the rows on screen (dates, status and search applied)
  onClickPrint(){
    if (this.historyLines.length == 0) return this.notificationService.toastrWarning('No data to print.');
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printkitchenqueuehistory']));
    var status = this.historyStatuses.find(s => s.Value == this.historyStatus)?.Label || 'All';
    var title = 'KITCHEN QUEUE HISTORY FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo));
    var filters = 'Status: ' + status + (this.searchKey.trim() ? ' · Search: ' + this.searchKey.trim() : '');
    var rows = this.historyLines.map(l => ({
      'SentDateTime': l.SentDateTime,
      'TableName': this.tableName(l),
      'ItemName': (this.isComponent(l) ? '↳ ' : '') + l.ItemName + (this.isUpgrade(l) ? ' (UPGRADE)' : ''),
      'Qty': l.Qty,
      'UM': l.UM,
      'Area': l.Area,
      'Status': this.statusLabels[l.KitchenStatus] || l.KitchenStatus,
      'StatusTime': this.statusTime(l),
      'StatusBy': l.StatusBy,
    }));
    localStorage.setItem('KitchenQueueHistory', JSON.stringify(rows));
    localStorage.setItem('KitchenQueueHistoryFilters', filters);
    localStorage.setItem('Title', title);
    this.printService.popupWindow(url, 'KitchenQueueHistory', window, 900, 800);
  }

  trackById(index: number, line: any){
    return line.id;
  }
}
