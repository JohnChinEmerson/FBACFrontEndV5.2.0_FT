import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { StocksService } from 'src/app/services/Inventory/stocks.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { PrintService } from 'src/app/services/print.service';
import { StockAdjustmentDetailsService } from 'src/app/services/StockAdjustments/stock-adjustment-details.service';
import { StockAdjustmentHeadersService } from 'src/app/services/StockAdjustments/stock-adjustment-headers.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { StockAdjustmentDetailUIComponent } from '../stock-adjustment-detail-ui/stock-adjustment-detail-ui.component';
import { NotificationService } from 'src/app/services/notification.service';
import { InSerialNosUIComponent } from '../in-serial-nos-ui/in-serial-nos-ui.component';
import { OutSerialNosUIComponent } from '../out-serial-nos-ui/out-serial-nos-ui.component';
import { HomeComponent } from '../../home.component';
@Component({
  selector: 'app-stock-adjustment-details-ui',
  templateUrl: './stock-adjustment-details-ui.component.html',
  styleUrls: ['./stock-adjustment-details-ui.component.css']
})
export class StockAdjustmentDetailsUIComponent implements OnInit {

  stockAdjustmentHeader      : any;
  stockAdjustmentDetails     : any[];
  transNo         : any;
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  dateFrom        : any = new Date();
  dateTo          : any = new Date();
  adjustmentType        : string;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
  ];  
  toolButtons2     = [
    {'Label'   : 'Print Details','Function'  : () => this.onClickPrintDetails(),'Disabled': true,}, 
  ];  
  contextButtons      = [
    {'Label'   : 'Edit','Function'            : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Void/Open','Function'       : () => this.onClickVoid(),'Disabled': true,}, 
    {'Label'   : 'SerialNos','Function'       : () => this.onClickSerialNos(),'Disabled': true,}, 
  ];
  dateColumns         = [];
  defaultColumns      = ['TransDate','TransNo', 'ReasonName','Qty','UM', 'ItemName','Price',  'Amount','RecordStatus', 'ExpiryDate', 'BatchLotNo'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Qty','Price',  'Amount',],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate']
  };
  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private stockAdjustmentHeadersService  : StockAdjustmentHeadersService,
    private stockAdjustmentDetailsService  : StockAdjustmentDetailsService,
    private stocksService      : StocksService,
    private dateTimesService    : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    private homeTs              : HomeComponent,
    @Inject(MAT_DIALOG_DATA) public data: any, 

  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.toolButtons, this.toolButtons2, this.contextButtons, null);
    this.dateFrom = this.data[0];
    this.dateTo   = this.data[1];
    this.transNo = this.data[2];
    this.adjustmentType = this.data[3];
    this.onClickView();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async getStockAdjustmentHeader(transNo){
    this.stockAdjustmentHeader = await firstValueFrom(this.stockAdjustmentHeadersService.getStockAdjustmentHeaderByTransNo(transNo));
  }

  async onClickView(){
    this.isLoading = true;
    if(this.transNo == 'all'){
      this.stockAdjustmentDetails = await firstValueFrom(this.stockAdjustmentDetailsService.getStockAdjustmentDetailsByDateFromByDateTo(
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      ));
    }else{
      this.stockAdjustmentDetails = await firstValueFrom(this.stockAdjustmentDetailsService.getStockAdjustmentDetailsByTransNo(
      this.transNo
    ));
    }
    
    if(this.stockAdjustmentDetails)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.stockAdjustmentDetails.filter(x => x.AdjustmentType.toLowerCase() == this.adjustmentType.toLowerCase());
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
    this.selectedId = data.id;
    this.selectedData = data;
  }
  async onClickEdit(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    var stockAdjustmentDetail:any = await firstValueFrom(this.stockAdjustmentDetailsService.getStockAdjustmentDetailById(this.selectedData.id));
    var stock:any = await firstValueFrom(this.stocksService.getItemByItemId(this.selectedData.ItemId));

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = ([stockAdjustmentDetail,stock, 'editstockadjustmentrecord', stockAdjustmentDetail.AdjustmentType]);
    this.dialog.open(StockAdjustmentDetailUIComponent,dialogConfig).beforeClosed().subscribe(stockAdjustmentDetail => {
      if(stockAdjustmentDetail){
        const stockAdjustmentDetailIndex = this.stockAdjustmentDetails.findIndex(detail => detail.id === stockAdjustmentDetail.id);
        if (stockAdjustmentDetailIndex !== -1) {
          this.stockAdjustmentDetails[stockAdjustmentDetailIndex] = stockAdjustmentDetail;  
        }
        this.displayRecords();
        this.selectedId = undefined;
      }
    
    });
  }

  onClickVoid(){
    if(!this.matTableService.checkNull(this.selectedId)) return;
  
    var action = this.selectedData?.RecordStatus == 'open' ? 'void' : 'open';
    this.notificationService.popupWarning(action.toUpperCase()+" Record",this.selectedData.ItemName + " under " + this.selectedData.TransNo + " will be " + action + ". Continue?").then(async (result) => {
      if (result.value) {
          this.stockAdjustmentDetailsService.updateStockAdjustmentDetailRecordStatus(this.selectedId, action).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.populateChanges(res.stockAdjustmentDetail);
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
          });
      }
    });
  }

  async onClickSerialNos(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    var iNDetail:any = await firstValueFrom(this.stockAdjustmentDetailsService.getStockAdjustmentDetailById(this.selectedId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data         = ([iNDetail, 'stockadjustmentdetails', '']);
    if(this.adjustmentType.toLowerCase() == 'stockin'){
      this.dialog.open(InSerialNosUIComponent,dialogConfig).beforeClosed().subscribe(stockAdjustmentDetail => {
        this.onClickView();
      });
    }else{
      this.dialog.open(OutSerialNosUIComponent,dialogConfig).beforeClosed().subscribe(stockAdjustmentDetail => {
        this.onClickView();
      });
    }
  }

  populateChanges(stockAdjustmentDetail){
    this.selectedId  = null;
    this.selectedData = null;
    const stockAdjustmentDetailIndex = this.stockAdjustmentDetails.findIndex(detail => detail.id === stockAdjustmentDetail.id);
    if (stockAdjustmentDetailIndex !== -1) {
      this.stockAdjustmentDetails[stockAdjustmentDetailIndex] = stockAdjustmentDetail;  
    }
    this.displayRecords();
  }

  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printstockadjustmentdetails']));
    var data  = this.listData.filteredData;
    var title = this.adjustmentType.toUpperCase()+' DETAILS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'printstockadjustmentdetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify([]));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', this.transNo);
  }

  async onClickPrintDetails(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    await this.getStockAdjustmentHeader(this.selectedData.TransNo);

    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printstockadjustmentdetails']));
    var data  = this.listData.filteredData.filter(x =>x.TransNo == this.selectedData.TransNo && x.RecordStatus == 'open');
    var title = 'STOCK ADJUSTMENT RECEIPT OF  - ' + this.stockAdjustmentHeader.TransNo ;
    
    this.printService.popupWindow(url, 'printstockadjustmentdetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(this.stockAdjustmentHeader));
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
