import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { StockAdjustmentDetailsService } from 'src/app/services/StockAdjustments/stock-adjustment-details.service';
import { StockAdjustmentHeadersService } from 'src/app/services/StockAdjustments/stock-adjustment-headers.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { AccountingEntryUIComponent } from '../../Accounting/accounting-entry-ui/accounting-entry-ui.component';
import { HomeComponent } from '../../home.component';
import { StockAdjustmentHeaderUIComponent } from '../stock-adjustment-header-ui/stock-adjustment-header-ui.component';
import { StockAdjustmentDetailsUIComponent } from '../stock-adjustment-details-ui/stock-adjustment-details-ui.component';
import { LoadItemsForStockAdjustmentUIComponent } from '../load-items-for-stock-adjustment-ui/load-items-for-stock-adjustment-ui.component';
import { ReasonsService } from 'src/app/services/StockAdjustments/reasons.service';

@Component({
  selector: 'app-stock-adjustment-receipts',
  templateUrl: './stock-adjustment-receipts.component.html',
  styleUrls: ['./stock-adjustment-receipts.component.css']
})
export class StockAdjustmentReceiptsComponent implements OnInit {
  stockAdjustmentHeaders : any=[];
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  dateFrom        : any = new Date();
  dateTo          : any = new Date();
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  adjustmentTypes : any=['stockin', 'stockout'];
  adjustmentType  : string = 'stockin';
  contextMenuPosition = { x: '0px', y: '0px' };
  toolButtons     = [
    {'Label'   : 'View','Function'                : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'               : () => this.onClickPrint(),'Disabled': true,}, 
  ];  
  toolButtons2     = [
    {'Label'   : 'View Details','Function'        : () => this.onClickViewDetails(),'Disabled': true,}, 
    {'Label'   : 'Print Receipt','Function'               : () => this.onClickPrintReceipt(),'Disabled': true,}, 
    {'Label'   : 'View All Details','Function'    : () => this.onClickViewAllDetails(),'Disabled': true,}, 
  ];  
  contextButtons     = [
    {'Label'   : 'Edit','Function'                : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Void/Open','Function'           : () => this.onClickVoid(),'Disabled': true,},
    {'Label'   : 'Add Item','Function'            : () => this.onClickAddItem(),'Disabled': true,}, 
    {'Label'   : 'Accounting Entry','Function'    : () => this.onClickAccountingEntry(),'Disabled': true,}, 
  ];
  defaultColumns    = ['TransDate','TransNo', 'AdjustmentType', 'ReasonName','TotalAmount','ReferenceNo', 'ProductionNo', 'Notes', 'RecordStatus', 'InputBy','InputByDateTime'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['TotalAmount'],
    intColumns: [],
    dateTimeColumns: ['InputByDateTime'],
    dateColumns: ['TransDate']
  };

  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private stockAdjustmentHeadersService        : StockAdjustmentHeadersService,
    private stockAdjustmentDetailsService        : StockAdjustmentDetailsService,
    private reasonsService        : ReasonsService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService      : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
    private notificationService : NotificationService,
    private viewContainerRef : ViewContainerRef,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.toolButtons, this.toolButtons2, this.contextButtons, null);
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }
  async onClickView(){
    this.isLoading = true;
    this.stockAdjustmentHeaders = await firstValueFrom(this.stockAdjustmentHeadersService.getStockAdjustmentHeadersByDateFromByDateTo(
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))
    ));
    if(this.stockAdjustmentHeaders)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.stockAdjustmentHeaders.filter(x => x.AdjustmentType.toLowerCase() == this.adjustmentType.toLowerCase());
    this.listData =  new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }

  applyFilter(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch(){
    this.searchKey =  this.matTableService.clearSearch(this.listData);
  }

  getRecord(data : any){
    this.selectedId = data.TransNo;
    this.selectedData = data;
  }

  onClickViewDetails(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1500px';
    dialogConfig.data         = ([this.dateFrom, this.dateTo, this.selectedData.TransNo, this.adjustmentType]);
    dialogConfig.viewContainerRef = this.viewContainerRef; 
    this.dialog.open(StockAdjustmentDetailsUIComponent,dialogConfig).beforeClosed().subscribe(x => {
        this.onClickView();
    });
  }

  onClickViewAllDetails(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1500px';
    dialogConfig.data         = ([this.dateFrom, this.dateTo, 'all', this.adjustmentType]);
    dialogConfig.viewContainerRef = this.viewContainerRef; 
    this.dialog.open(StockAdjustmentDetailsUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      this.onClickView();
  });
  }

  async onClickEdit(){
    if(!this.matTableService.checkNull(this.selectedId)) return;


    var data = await firstValueFrom(this.stockAdjustmentHeadersService.getStockAdjustmentHeaderByTransNo(this.selectedId));
    var reason = await firstValueFrom(this.reasonsService.getReasonByReasonId(this.selectedData.ReasonId));

    if(data && reason){
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '800px';
      dialogConfig.data = ([reason,data, data.TransNo,data.TotalAmount,data.AdjustmentType, 'update','updatestockadjustmentheader']);
      this.dialog.open(StockAdjustmentHeaderUIComponent,dialogConfig).beforeClosed().subscribe(x => {
        if(x){
          this.populateChanges(x);
        }
      });
    }
  }

  onClickVoid(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var action = this.selectedData?.RecordStatus == 'open' ? 'void' : 'open';
    this.notificationService.popupWarning(action.toUpperCase()+" Record","All Items  under " + this.selectedId + " will be " + action.toUpperCase () + ". Continue?").then(async (result) => {
      if (result.value) {
        var data = await firstValueFrom(this.stockAdjustmentHeadersService.getStockAdjustmentHeaderByTransNo(this.selectedId));

          this.stockAdjustmentHeadersService.updateStockAdjustmentRecordStatus(this.selectedId, action).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.populateChanges(res.stockAdjustmentHeader);
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error.message);
            },
          });
      
      }
    });
  }

  populateChanges(stockAdjustmentHeader){
    this.selectedId  = null;
    this.selectedData = null;
    const stockAdjustmentHeaderIndex = this.stockAdjustmentHeaders.findIndex(detail => detail.TransNo === stockAdjustmentHeader.TransNo);
    if (stockAdjustmentHeaderIndex !== -1) {
      this.stockAdjustmentHeaders[stockAdjustmentHeaderIndex] = stockAdjustmentHeader;  
    }
    this.displayRecords();
  }

  async onClickAddItem(){
     if (!this.matTableService.CommonTransaction()) {
      return;
    }
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var data = await firstValueFrom(this.stockAdjustmentHeadersService.getStockAdjustmentHeaderByTransNo(this.selectedId));

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1500px';
    dialogConfig.data         = ([data.TransCode, data.ReasonId,data, 'stockadjustmentreceipts', 'stocks', this.adjustmentType]);
    this.dialog.open(LoadItemsForStockAdjustmentUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      if(x){
        this.populateChanges(x);
      } 
    });
  }

  onClickAccountingEntry(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var indexTables: any ={
      'AccountTitleTable' : 'stockadjustmentaccounttitles',
      'TransactionTable' : 'stockadjustmentheaders',
      'TransName' : null,
    } ;
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data         = ([indexTables, this.selectedId]);
    this.dialog.open(AccountingEntryUIComponent,dialogConfig);

  }
  
  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printstockadjustmentreceipts']));
    var data  = this.listData.filteredData;
    var title = this.adjustmentType.toUpperCase()+' RECEIPTS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'printstockadjustmentreceipts', window, 800, 800);
    localStorage.setItem('Headers', JSON.stringify(data));
    localStorage.setItem('Title', title);
  }

  async onClickPrintReceipt(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var stockAdjustmentHeader = await firstValueFrom(this.stockAdjustmentHeadersService.getStockAdjustmentHeaderByTransNo(this.selectedData.TransNo));
    var stockAdjustmentDetails = await firstValueFrom(this.stockAdjustmentDetailsService.getStockAdjustmentDetailsByTransNo(this.selectedData.TransNo));

    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printstockadjustmentdetails']));
    var data  = stockAdjustmentDetails.filter(x =>x.TransNo == this.selectedData.TransNo && x.RecordStatus == 'open');
    var title = 'STOCK ADJUSTMENT RECEIPT OF  - ' + stockAdjustmentHeader.TransNo ;
    
    this.printService.popupWindow(url, 'printstockadjustmentdetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(stockAdjustmentHeader));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', this.selectedData.TransNo);
  }
  
  onContextMenu(event: MouseEvent, data: any) {
    if(this.contextButtons.length > 0){
      this.getRecord(data);
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { 'data': data };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }

}
