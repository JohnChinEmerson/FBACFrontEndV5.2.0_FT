import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { MenuReportsService } from 'src/app/services/Menus/menu-reports.service';
import { FileConfigsService } from 'src/app/services/Files/file-configs.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { ColumnTypeConfig, MatTableService } from 'src/app/services/mat-table.service';
import { HomeComponent } from '../../home.component';
import { ProductionEntryUIComponent } from '../production-entry-ui/production-entry-ui.component';

// Desktop Mariosoft.Costing.UI ProductionTransUI + ProductionHeaderUI:
// produced items are a Stock In "From Production"; their recipe components are deducted as a Stock Out "To Production".
@Component({
  selector: 'app-production-transaction',
  templateUrl: './production-transaction.component.html',
  styleUrls: ['../../Receiving/receiving-transaction2/receiving-transaction2.component.css', './production-transaction.component.css']
})
export class ProductionTransactionComponent implements OnInit {
  listData1       : MatTableDataSource<any> = null;
  listData2       : MatTableDataSource<any> = new MatTableDataSource([]);
  searchKey       : string = '';
  qty             : any = '';
  selectedItem    : any = null;
  selectedDetail  : any = null;
  hasProduction   : boolean = true;
  isLoading1      : boolean = false;
  isLoading2      : boolean = false;
  isSaving        : boolean = false;
  defaultColumns  = ['ItemId', 'ItemName', 'UM', 'Category', 'Available'];
  defaultColumns2 = ['ItemName', 'UM', 'Qty'];    // Desktop FormatDtg2: ShowColumns("ItemName,UM,Qty")
  columnConfig    : ColumnTypeConfig = { decimalColumns: ['Available', 'Qty'], intColumns: [], dateTimeColumns: [], dateColumns: [] };
  columnTypeMap   : { [key: string]: string } = {};
  columnTypeMap2  : { [key: string]: string } = {};
  contextMenuPosition = { x: '0px', y: '0px' };
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  toggleButtons2  = [
    {'Label'   : 'LOAD ITEMS-F1','Function'     : () => this.loadItems(),'Disabled': true},
  ];
  toggleButtons   = [
    {'Label'   : 'SAVE-F2','Function'           : () => this.onClickSave(),'Disabled': true},
  ];
  contextButtons  = [
    {'Label'   : 'Edit','Function'              : () => this.onClickEdit(),'Disabled': true},
    {'Label'   : 'Remove','Function'            : () => this.onClickRemove(),'Disabled': true},
    {'Label'   : 'Remove All','Function'        : () => this.onClickRemoveAll(),'Disabled': true},
  ];

  constructor(
    private dialog              : MatDialog,
    private menuReportsService  : MenuReportsService,
    private fileConfigsService  : FileConfigsService,
    private dateTimesService    : DateTimesService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    private matTableService     : MatTableService,
    private homeTs              : HomeComponent,
  ) { }

  async ngOnInit(): Promise<void> {
    this.defaultColumns.forEach(c => this.columnTypeMap[c] = this.matTableService.getColumnType(c, this.columnConfig));
    this.defaultColumns2.forEach(c => this.columnTypeMap2[c] = this.matTableService.getColumnType(c, this.columnConfig));
    await this.homeTs.getButtons();
    // Desktop: Production Transaction has no access-right buttons registered (submenubuttons), so they all stay enabled.
    // (toolBoxService.disableButtons checks labels across all screens and disabled SAVE-F2, so production could never be saved)
    var config = await firstValueFrom(this.fileConfigsService.getFileConfig());
    this.hasProduction = config?.HasProduction?.toLowerCase() != 'no';
    if (!this.hasProduction) return;
    // Desktop: only the pending transaction loads on open; items load on LOAD ITEMS or when searching
    await this.loadDetails();
  }

  onKeyDown(event: KeyboardEvent){
    if (event.key == 'F1') { event.preventDefault(); this.loadItems(); }
    if (event.key == 'F2') { event.preventDefault(); this.onClickSave(); }
  }

  // Desktop btnLoadItems_Click (StocksBAL.GetDataForProduction)
  async loadItems(){
    this.isLoading1 = true;
    try {
      var items: any = await firstValueFrom(this.menuReportsService.getItemsForProduction());
      this.listData1 = new MatTableDataSource(items);
      // Desktop txtSearch_TextChanged: ItemName or Category
      this.listData1.filterPredicate = (data: any, key: string) =>
        (data.ItemName || '').toLowerCase().includes(key) || (data.Category || '').toLowerCase().includes(key);
      this.applyFilter();
    } finally {
      this.isLoading1 = false;
    }
  }

  async loadDetails(){
    this.isLoading2 = true;
    try {
      this.setDetails(await firstValueFrom(this.menuReportsService.getPendingProductionDetails()));
    } finally {
      this.isLoading2 = false;
    }
  }

  setDetails(details: any){
    this.listData2 = new MatTableDataSource(details || []);
    this.selectedDetail = null;
  }

  async applyFilter(){
    if (!this.listData1) {
      if (!this.searchKey || this.isLoading1) return;
      await this.loadItems();     // Desktop: searching before LOAD ITEMS loads them
      return;
    }
    this.matTableService.applyFilter(this.listData1, this.searchKey || '');
  }

  getRecord1(row: any){ this.selectedItem = row; }
  getRecord2(row: any){ this.selectedDetail = row; }

  getFirstRecord(){
    var first = this.listData1?.filteredData?.[0];
    if (first) this.selectedItem = first;
  }

  onKeyDownItems(event: KeyboardEvent){
    var rows = this.listData1?.filteredData || [];
    if (rows.length == 0) return;
    var index = Math.max(0, rows.indexOf(this.selectedItem));
    if (event.key == 'ArrowDown') { this.selectedItem = rows[Math.min(index + 1, rows.length - 1)]; event.preventDefault(); }
    if (event.key == 'ArrowUp') { this.selectedItem = rows[Math.max(index - 1, 0)]; event.preventDefault(); }
    if (event.key == 'Enter') { this.popupQty(this.selectedItem); event.preventDefault(); }
  }

  getTotal(column: string){
    return (this.listData2?.data || []).reduce((total, d) => total + (+d[column] || 0), 0);
  }

  // Desktop txtSearch_KeyPress / txtQty_KeyPress (Enter): QuantityUI for the selected (or first) item
  onEnterSearch(){
    var rows = this.listData1?.filteredData || [];
    this.popupQty(this.selectedItem && rows.includes(this.selectedItem) ? this.selectedItem : rows[0]);
  }

  // Desktop PopupQtyUI -> QuantityUI("StockIn") -> AddItem
  popupQty(item: any){
    if (!item) return;
    var typed = parseFloat(String(this.qty || '').replace(/,/g, ''));
    this.openQtyDialog({ 'ItemName': item.ItemName, 'UM': item.UM, 'Qty': isNaN(typed) || typed <= 0 ? 1 : typed }, (qty) => {
      this.menuReportsService.addProductionItem(item.ItemId, qty).subscribe({
        next:(res) => {
          this.setDetails(res);
          this.notificationService.toastrSuccess('Successfully Saved!');
          // Desktop ResetForm
          this.qty = '';
          this.searchKey = '';
          this.applyFilter();
          this.searchInput?.nativeElement?.focus();
        },
        error:(err) => this.notificationService.toastrHttpError(err)
      });
    });
  }

  private openQtyDialog(item: any, done: (qty: number) => void){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '450px';
    dialogConfig.data         = (['qty', item]);
    this.dialog.open(ProductionEntryUIComponent, dialogConfig).beforeClosed().subscribe(res => {
      if (res) done(res.Qty);
    });
  }

  onContextMenu(event: MouseEvent, row: any){
    event.preventDefault();
    if (row) this.getRecord2(row);
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  // Desktop btnEdit_Click: QuantityUI(sADetail)
  onClickEdit(){
    if (!this.matTableService.checkNull(this.selectedDetail)) return;
    var detail = this.selectedDetail;
    this.openQtyDialog({ 'ItemName': detail.ItemName, 'UM': detail.UM, 'Qty': +detail.Qty }, (qty) => {
      this.menuReportsService.updateProductionItemQty(detail.id, qty).subscribe({
        next:(res) => { this.setDetails(res); this.notificationService.toastrSuccess('Successfully Updated!'); },
        error:(err) => this.notificationService.toastrHttpError(err)
      });
    });
  }

  onClickRemove(){
    if (!this.matTableService.checkNull(this.selectedDetail)) return;
    var detail = this.selectedDetail;
    this.notificationService.popupWarning('Remove', detail.ItemName + ' will be REMOVED. Continue?').then((result) => {
      if (result.value) {
        this.menuReportsService.deleteProductionItem(detail.id).subscribe({
          next:(res) => { this.setDetails(res); this.notificationService.toastrSuccess('Successfully Deleted!'); },
          error:(err) => this.notificationService.toastrHttpError(err)
        });
      }
    });
  }

  onClickRemoveAll(){
    if (this.listData2.data.length == 0) return this.notificationService.toastrWarning('Empty Transaction');
    this.notificationService.popupWarning('Remove All', 'All Items will be REMOVED. Continue?').then((result) => {
      if (result.value) {
        this.menuReportsService.deleteProductionItems().subscribe({
          next:(res) => { this.setDetails(res); this.notificationService.toastrSuccess('Successfully Deleted!'); },
          error:(err) => this.notificationService.toastrHttpError(err)
        });
      }
    });
  }

  // Desktop btnSaveAdjustment_Click -> ProductionHeaderUI
  onClickSave(){
    if (this.isSaving) return;
    if (this.listData2.data.length == 0) return this.notificationService.toastrWarning('Empty Transaction');
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '550px';
    dialogConfig.data         = (['header']);
    this.dialog.open(ProductionEntryUIComponent, dialogConfig).beforeClosed().subscribe(header => {
      if (!header) return;
      this.isSaving = true;
      this.menuReportsService.saveProduction({
        'TransDate' : this.dateTimesService.ConvertToDateFormat(new Date(header.TransDate)),
        'ReportAs'  : header.ReportAs,
      }).subscribe({
        next:(res) => {
          this.isSaving = false;
          this.notificationService.toastrSuccess(res.message + ' Production No. ' + res.productionNo);
          this.loadDetails();
          if (this.listData1) this.loadItems();   // available qty changed
        },
        error:(err) => {
          this.isSaving = false;
          this.notificationService.toastrHttpError(err);
        }
      });
    });
  }
}
