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
import { OrderConfigService } from 'src/app/services/Orders/order-config.service';
import { OrderDetailsService } from 'src/app/services/Orders/order-details.service';
import { OrderHeadersService } from 'src/app/services/Orders/order-headers.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { OrderDetailUIComponent } from '../order-detail-ui/order-detail-ui.component';
import { NotificationService } from 'src/app/services/notification.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-order-details-ui',
  templateUrl: './order-details-ui.component.html',
  styleUrls: ['./order-details-ui.component.css']
})
export class OrderDetailsUIComponent implements OnInit {
  orderHeader      : any;
  orderConfig      : any;
  orderDetails     : any[];
  transNo         : any;
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
  ];
  
  defaultColumns      = ['TransDate','TransNo', 'CustomerName','UM', 'ItemName', 'Qty','Price', 'Discount', 'Amount','RecordStatus', 'ReadingNo'];

  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Qty', 'Price', 'Discount', 'Amount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate']
  };
  columnTypeMap: { [key: string]: string } = {};

  constructor(
    private dialog              : MatDialog,
    private orderHeadersService  : OrderHeadersService,
    private orderDetailsService  : OrderDetailsService,
    private orderConfigService   : OrderConfigService,
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
    this.onClickView();
    this.getOrderConfig();
  }
  

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async getOrderConfig(){
    this.orderConfig = await firstValueFrom(this.orderConfigService.getOrderConfig());
  }

  async getOrderHeader(transNo){
    this.orderHeader = await firstValueFrom(this.orderHeadersService.getOrderHeaderByTransNo(transNo));
  }

  async onClickView(){
    this.isLoading = true;
    if(this.transNo == 'all'){
      this.orderDetails = await firstValueFrom(this.orderDetailsService.getOrderDetailsByDateFromByDateTo(
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      ));
    }else{
      this.orderDetails = await firstValueFrom(this.orderDetailsService.getOrderDetailsByTransNo(
      this.transNo
    ));
    }
    
    if(this.orderDetails)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.orderDetails;
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

    var stock:any = await firstValueFrom(this.stocksService.getItemByItemId(this.selectedData.ItemId));
    var orderDetail:any = await firstValueFrom(this.orderDetailsService.getOrderDetailById(this.selectedData.id));

    
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = ([orderDetail,stock, 'editorderrecord']);
    this.dialog.open(OrderDetailUIComponent,dialogConfig).beforeClosed().subscribe(orderDetail => {
      if(orderDetail){
        const orderDetailIndex = this.orderDetails.findIndex(detail => detail.id === orderDetail.id);
        if (orderDetailIndex !== -1) {
          this.orderDetails[orderDetailIndex] = orderDetail;  
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
          this.orderDetailsService.updateOrderDetailRecordStatus(this.selectedId, action).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.populateChanges(res.orderDetail);
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
          });
      }
    });
  }

  populateChanges(orderDetail){
    this.selectedId  = null;
    this.selectedData = null;
    const orderDetailIndex = this.orderDetails.findIndex(detail => detail.id === orderDetail.id);
    if (orderDetailIndex !== -1) {
      this.orderDetails[orderDetailIndex] = orderDetail;  
    }
    this.displayRecords();
  }

  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printorderdetails']));
    var data  = this.listData.filteredData;
    var title = 'ORDER DETAILS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'OrderDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify([]));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('OrderConfig', JSON.stringify(this.orderConfig));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', this.transNo);
  }

  async onClickPrintDetails(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    await this.getOrderHeader(this.selectedData.TransNo);

    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printorderdetails']));
    var data  = this.listData.filteredData.filter(x =>x.TransNo == this.selectedData.TransNo && x.RecordStatus == 'open');
    var title = 'ORDERS RECEIPT OF  - ' + this.orderHeader.TransNo ;
    
    this.printService.popupWindow(url, 'orderDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(this.orderHeader));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('OrderConfig', JSON.stringify(this.orderConfig));
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
