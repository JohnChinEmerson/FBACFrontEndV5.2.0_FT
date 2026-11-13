import { AfterViewChecked, Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

// Kitchen Queue cards: one card per order (QUEUE) or per table (READY TO SERVE, Sales Transaction Ready to Serve
// dialog). A card shows as many lines as fit in about half the screen height (less on phones); the rest open with
// "See more (+N items)". Cancelled lines and the lines of the newest SEND are pinned on top and never collapse.
// The header and the card actions are always visible. The parent saves the statuses (statusChange / acknowledge).
@Component({
  selector: 'app-kitchen-order-cards',
  templateUrl: './kitchen-order-cards.component.html',
  styleUrls: ['./kitchen-order-cards.component.css']
})
export class KitchenOrderCardsComponent implements AfterViewChecked {
  // cards made by KitchenOrderCardsComponent.group
  @Input() cards      : any[] = [];
  // active = QUEUE (sent / preparing / cancelled), ready = READY TO SERVE
  @Input() view       : 'active' | 'ready' = 'active';
  @Input() canPrepare : boolean = false;
  @Input() canReady   : boolean = false;
  @Input() canServe   : boolean = false;
  @Input() isSaving   : boolean = false;
  @Input() now        : number = Date.now();
  @Input() emptyText  : string = '';
  // every line shown, no See more (one card on its own, e.g. a table's details in the Ready to Serve dialog)
  @Input() expandAll  : boolean = false;
  @Output() statusChange = new EventEmitter<{ Ids: any[], Status: string }>();
  @Output() acknowledge  = new EventEmitter<any[]>();

  static readonly LATE_MINUTES = 15;
  static readonly statusLabels = { 'pending': 'Sent', 'preparing': 'Preparing', 'ready': 'Ready to Serve', 'served': 'Served', 'cancelled': 'Cancelled' };
  // expanded cards while the app is open (cleared by a reload)
  private static expandedKeys = new Set<string>();

  statusLabels = KitchenOrderCardsComponent.statusLabels;
  // height of one line as rendered (its buttons included); measured after each render
  private lineHeight = 96;
  visibleCount = this.fitCount();

  constructor(private host: ElementRef) { }

  // lines that fit in a collapsed card: the lines of about 38% of the screen height (30% on phones), so a row of
  // cards fits on a laptop screen and more on larger ones
  fitCount(): number {
    if (typeof window == 'undefined') return 4;
    var phone = window.matchMedia ? window.matchMedia('(max-width: 767.98px)').matches : false;
    return Math.max(2, Math.floor(window.innerHeight * (phone ? 0.30 : 0.38) / this.lineHeight));
  }

  ngAfterViewChecked(){
    var lines = Array.from((this.host.nativeElement as HTMLElement).querySelectorAll('.koc-line')).slice(0, 30);
    var heights = lines.map(l => l.getBoundingClientRect().height).filter(h => h > 0);
    if (heights.length == 0) return;
    var average = Math.round(heights.reduce((a, b) => a + b, 0) / heights.length);
    // only a real change (font size, phone / desktop): the count does not flip on small differences
    if (Math.abs(average - this.lineHeight) <= 8) return;
    this.lineHeight = average;
    setTimeout(() => this.visibleCount = this.fitCount());
  }

  // Queue lines -> cards. by order: one card per TransCode; by table: the orders of a table in one card.
  static group(lines: any[], by: 'order' | 'table'): any[] {
    const map = new Map<string, any>();
    for (const line of lines) {
      const hasTable = line.TableName && line.TableName != 'NA';
      const key = by == 'table' && hasTable ? 'T' + (line.TableId || line.TableName) : 'O' + line.TransCode;
      if (!map.has(key)) {
        map.set(key, {
          'Key': key,
          'TableName': hasTable ? line.TableName : line.OrderType || 'No table',
          'OrderType': line.OrderType,
          'TransCodes': [],
          'SentDateTime': line.SentDateTime,
          'Lines': [],
        });
      }
      const card = map.get(key);
      card.Lines.push(line);
      if (!card.TransCodes.includes(line.TransCode)) card.TransCodes.push(line.TransCode);
      if (line.SentDateTime < card.SentDateTime) card.SentDateTime = line.SentDateTime;
    }
    const cards = Array.from(map.values());
    cards.forEach(card => KitchenOrderCardsComponent.arrange(card));
    return cards;
  }

  // pinned lines first (cancelled, then the newest SEND when the order was sent more than once), the rest as sent
  private static arrange(card: any){
    const rounds = new Set(card.Lines.filter(l => l.KitchenStatus != 'cancelled').map(l => l.SentDateTime));
    const newest = rounds.size > 1 ? card.Lines.reduce((max, l) => l.KitchenStatus != 'cancelled' && l.SentDateTime > max ? l.SentDateTime : max, '') : null;
    for (const line of card.Lines) {
      line.IsCancelledPin = line.KitchenStatus == 'cancelled';
      line.IsNewPin = !line.IsCancelledPin && newest != null && line.SentDateTime == newest;
    }
    card.Pinned = [...card.Lines.filter(l => l.IsCancelledPin), ...card.Lines.filter(l => l.IsNewPin)];
    card.Others = card.Lines.filter(l => !l.IsCancelledPin && !l.IsNewPin);
    card.ItemCount = card.Lines.filter(l => !KitchenOrderCardsComponent.isComponent(l) && l.KitchenStatus != 'cancelled').length;
    const counts = {};
    card.Lines.forEach(l => counts[l.KitchenStatus] = (counts[l.KitchenStatus] || 0) + 1);
    card.Summary = ['pending', 'preparing', 'ready', 'cancelled']
      .filter(s => counts[s])
      .map(s => counts[s] + ' ' + KitchenOrderCardsComponent.statusLabels[s])
      .join(' · ');
  }

  static isComponent(line: any){
    return line.SetId && line.SetId != 'NA';
  }

  // an UPGRADE: a main row that names a Set (a Set component swapped for another item, SaleRestaurantUI.upgradeSetComponent)
  static isUpgrade(line: any){
    return (!line.SetId || line.SetId == 'NA') && !!line.SetName;
  }

  @HostListener('window:resize')
  onResize(){
    this.visibleCount = this.fitCount();
  }

  isComponent(line: any){
    return KitchenOrderCardsComponent.isComponent(line);
  }

  isUpgrade(line: any){
    return KitchenOrderCardsComponent.isUpgrade(line);
  }

  isExpanded(card: any){
    return this.expandAll || KitchenOrderCardsComponent.expandedKeys.has(this.view + card.Key);
  }

  toggleExpanded(card: any){
    const key = this.view + card.Key;
    if (KitchenOrderCardsComponent.expandedKeys.has(key)) KitchenOrderCardsComponent.expandedKeys.delete(key);
    else KitchenOrderCardsComponent.expandedKeys.add(key);
  }

  // the not-pinned lines shown: all when expanded, else what is left of the visible count (at least one)
  shownOthers(card: any){
    if (this.isExpanded(card)) return card.Others;
    return card.Others.slice(0, Math.max(1, this.visibleCount - card.Pinned.length));
  }

  hiddenCount(card: any){
    return card.Others.length - this.shownOthers(card).length;
  }

  canCollapse(card: any){
    return !this.expandAll && card.Others.length > Math.max(1, this.visibleCount - card.Pinned.length);
  }

  minutesSince(dateTime: string){
    if (!dateTime) return 0;
    return Math.max(0, Math.floor((this.now - new Date(dateTime).getTime()) / 60000));
  }

  isLate(card: any){
    return this.view == 'active' && this.minutesSince(card.SentDateTime) >= KitchenOrderCardsComponent.LATE_MINUTES;
  }

  idsOf(card: any, statuses: string[]){
    return card.Lines.filter(l => statuses.includes(l.KitchenStatus)).map(l => l.id);
  }

  onStatus(ids: any[], status: string){
    if (ids.length == 0 || this.isSaving) return;
    this.statusChange.emit({ 'Ids': ids, 'Status': status });
  }

  onAcknowledge(ids: any[]){
    if (ids.length == 0 || this.isSaving) return;
    this.acknowledge.emit(ids);
  }

  trackByKey(index: number, card: any){
    return card.Key;
  }

  trackById(index: number, line: any){
    return line.id;
  }
}
