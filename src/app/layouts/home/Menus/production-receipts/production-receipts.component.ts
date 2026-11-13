import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MenuReportsService } from 'src/app/services/Menus/menu-reports.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { ColumnTypeConfig, MatTableService } from 'src/app/services/mat-table.service';
import { HomeComponent } from '../../home.component';
import { ProductionDetailsUIComponent } from '../production-details-ui/production-details-ui.component';
import { ProductionEntryUIComponent } from '../production-entry-ui/production-entry-ui.component';

// Desktop Mariosoft.Costing.UI ProductionReceiptsUI (Go / View Details; context Edit, Void, Add Item),
// laid out like Sales Receipts.
@Component({
  selector: 'app-production-receipts',
  templateUrl: './production-receipts.component.html',
  styleUrls: ['../../Sales/sales-receipts/sales-receipts.component.css']
})
export class ProductionReceiptsComponent implements OnInit {
  dateFrom        : any = new Date();
  dateTo          : any = new Date();
  listData        : MatTableDataSource<any>;
  searchKey       : string = '';
  selectedId      : string;
  selectedData    : any = null;
  isLoading       : boolean = false;
  pageSizeOptions : any = this.matTableService.pageSizeOptions();
  defaultColumns  = ['TransDate', 'ProductionNo', 'TransNo', 'ReasonName', 'ReportAs', 'TotalAmount', 'InputByDateTime', 'InputBy', 'RecordStatus'];
  labels          : { [key: string]: string } = { 'TransNo': 'StockIn No.' };
  columnConfig    : ColumnTypeConfig = { decimalColumns: ['TotalAmount'], intColumns: [], dateTimeColumns: ['InputByDateTime'], dateColumns: ['TransDate'] };
  columnTypeMap   : { [key: string]: string } = {};
  contextMenuPosition = { x: '0px', y: '0px' };
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  toolButtons   = [
    {'Label'   : 'View','Function'          : () => this.onClickView(),'Disabled': true},
    {'Label'   : 'Print','Function'         : () => this.onClickPrint(),'Disabled': true},
  ];
  toolButtons2  = [
    {'Label'   : 'View Details','Function'  : () => this.onClickDetails(),'Disabled': true},
  ];
  contextButtons = [
    {'Label'   : 'Edit','Function'          : () => this.onClickEdit(),'Disabled': true},
    {'Label'   : 'Void','Function'          : () => this.onClickVoid(),'Disabled': true},
    {'Label'   : 'Add Item','Function'      : () => this.onClickAddItem(),'Disabled': true},
  ];

  constructor(
    private dialog              : MatDialog,
    private menuReportsService  : MenuReportsService,
    private dateTimesService    : DateTimesService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    private matTableService     : MatTableService,
    private router              : Router,
    private printService        : PrintService,
    private homeTs              : HomeComponent,
  ) { }

  async ngOnInit(): Promise<void> {
    this.defaultColumns.forEach(c => this.columnTypeMap[c] = this.matTableService.getColumnType(c, this.columnConfig));
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.toolButtons, this.toolButtons2, this.contextButtons, null);
    this.menuReportsService.requiredRefresh.subscribe(() => this.onClickView());
    this.onClickView();
  }

  private fmt(date: any){
    return this.dateTimesService.ConvertToDateFormat(new Date(date));
  }

  async onClickView(){
    this.isLoading = true;
    try {
      var rows: any = await firstValueFrom(this.menuReportsService.getProductionReceipts(this.fmt(this.dateFrom), this.fmt(this.dateTo)));
      this.listData = new MatTableDataSource(rows);
      this.listData.paginator = this.paginator;
      this.applyFilter();
    } finally {
      this.isLoading = false;
    }
    this.selectedId = undefined;
    this.selectedData = null;
  }

  applyFilter(){
    if (this.listData) this.matTableService.applyFilter(this.listData, this.searchKey || '');
  }

  clearSearch(){
    if (this.listData) this.searchKey = this.matTableService.clearSearch(this.listData);
  }

  getRecord(row: any){
    this.selectedId = row.TransNo;
    this.selectedData = row;
  }

  onContextMenu(event: MouseEvent, row: any){
    this.getRecord(row);
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'data': row };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  // Desktop dtg_CellDoubleClick: an open production opens ProductionHeaderUI (Update)
  onDoubleClick(){
    if (this.selectedData?.RecordStatus == 'open') this.onClickEdit();
  }

  onClickDetails(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = false;
    dialogConfig.width        = '1000px';
    dialogConfig.maxWidth     = '98vw';
    dialogConfig.data         = ([this.selectedData]);
    this.dialog.open(ProductionDetailsUIComponent, dialogConfig);
  }

  private isOpen(): boolean {
    if (!this.matTableService.checkNull(this.selectedId)) return false;
    if (this.selectedData.RecordStatus != 'open') {
      this.notificationService.toastrWarning(this.selectedData.ProductionNo + ' is already ' + this.selectedData.RecordStatus + '.');
      return false;
    }
    return true;
  }

  // Desktop btnEdit_Click -> ProductionHeaderUI(data) Update
  onClickEdit(){
    if (!this.isOpen()) return;
    var row = this.selectedData;
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '550px';
    dialogConfig.data         = (['header', row]);
    this.dialog.open(ProductionEntryUIComponent, dialogConfig).beforeClosed().subscribe(header => {
      if (!header) return;
      this.menuReportsService.updateProductionHeader(row.TransNo, {
        'TransDate' : this.fmt(header.TransDate),
        'ReportAs'  : header.ReportAs,
      }).subscribe({
        next:(res) => this.notificationService.toastrSuccess(res.message),
        error:(err) => this.notificationService.toastrHttpError(err)
      });
    });
  }

  onClickVoid(){
    if (!this.isOpen()) return;
    var row = this.selectedData;
    this.notificationService.popupWarning('Void', 'Productions under ' + row.ProductionNo + ' will be VOID. Produced items are removed from stock and components put back. Continue?').then((result) => {
      if (result.value) {
        this.menuReportsService.voidProduction(row.ProductionNo).subscribe({
          next:(res) => this.notificationService.toastrSuccess(res.message),
          error:(err) => this.notificationService.toastrHttpError(err)
        });
      }
    });
  }

  // Desktop btnAdd_Click -> AddItemToReceiptUI
  async onClickAddItem(){
    if (!this.isOpen()) return;
    var row = this.selectedData;
    var items: any = await firstValueFrom(this.menuReportsService.getItemsForProduction());
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = false;
    dialogConfig.width        = '550px';
    dialogConfig.data         = (['additem', items]);
    this.dialog.open(ProductionEntryUIComponent, dialogConfig).beforeClosed().subscribe(res => {
      if (!res) return;
      this.menuReportsService.addProductionReceiptItem({ 'ProductionNo': row.ProductionNo, 'ItemId': res.ItemId, 'Qty': res.Qty }).subscribe({
        next:(r) => this.notificationService.toastrSuccess(r.message),
        error:(err) => this.notificationService.toastrHttpError(err)
      });
    });
  }

  onClickPrint(){
    var url = this.router.serializeUrl(this.router.createUrlTree(['print/printdatalist']));
    var data = (this.listData?.filteredData || []).filter(x => x.RecordStatus == 'open');
    localStorage.setItem('PrintDataList', JSON.stringify({
      'Title'   : 'PRODUCTION RECEIPTS FROM ' + this.fmt(this.dateFrom) + ' TO ' + this.fmt(this.dateTo),
      'Columns' : [
        { 'Key': 'ProductionNo', 'Label': 'ProductionNo' },
        { 'Key': 'TransNo', 'Label': 'StockIn No.' },
        { 'Key': 'TransDate', 'Label': 'TransDate', 'Type': 'date' },
        { 'Key': 'ReportAs', 'Label': 'ReportAs' },
        { 'Key': 'InputBy', 'Label': 'InputBy' },
        { 'Key': 'TotalAmount', 'Label': 'TotalAmount', 'Type': 'decimal' },
      ],
      'Data'    : data,
      'Totals'  : { 'TotalAmount': data.reduce((t, r) => t + (+r.TotalAmount || 0), 0) },
    }));
    this.printService.popupWindow(url, 'ProductionReceipts', window, 1000, 800);
  }
}
