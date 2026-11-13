import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AccountingEntryUIComponent } from 'src/app/layouts/home/Accounting/accounting-entry-ui/accounting-entry-ui.component';
import { HomeComponent } from 'src/app/layouts/home/home.component';
import { VoidReasonUIComponent } from 'src/app/layouts/home/Sales/void-reason-ui/void-reason-ui.component';
import { DateTimesService } from 'src/app/services/date-times.service';
import { CustomersService } from 'src/app/services/Files/customers.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { OrderHeadersService } from 'src/app/services/Orders/order-headers.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { LoadItemsForOrderUIComponent } from '../load-items-for-order-ui/load-items-for-order-ui.component';
import { OrderDetailsUIComponent } from '../order-details-ui/order-details-ui.component';
import { OrderHeaderUIComponent } from '../order-header-ui/order-header-ui.component';
import { OrderDetailsService } from '../../../../services/Orders/order-details.service';
import { OrderConfigService } from 'src/app/services/Orders/order-config.service';


@Component({
  selector: 'app-order-receipts',
  templateUrl: './order-receipts.component.html',
  styleUrls: ['./order-receipts.component.css']
})
export class OrderReceiptsComponent implements OnInit {
   orderHeaders : any=[];
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
     {'Label'   : 'View','Function'                : () => this.onClickView(),'Disabled': true,}, 
     {'Label'   : 'Print','Function'               : () => this.onClickPrint(),'Disabled': true,}, 
   ];  
   toolButtons2     = [
     {'Label'   : 'View Details','Function'        : () => this.onClickViewDetails(),'Disabled': true,}, 
     {'Label'   : 'Print Receipt','Function'        : () => this.onClickPrintReceipt(),'Disabled': true,}, 
     {'Label'   : 'View All Details','Function'    : () => this.onClickViewAllDetails(),'Disabled': true,}, 
   ];  
   contextButtons     = [
     {'Label'   : 'Edit','Function'                : () => this.onClickEdit(),'Disabled': true,}, 
     {'Label'   : 'Void/Open','Function'           : () => this.onClickVoid(),'Disabled': true,},
     {'Label'   : 'Add Item','Function'            : () => this.onClickAddItem(),'Disabled': true,}, 
     {'Label'   : 'Accounting Entry','Function'    : () => this.onClickAccountingEntry(),'Disabled': true,}, 
   ];
   defaultColumns    = ['TransDate','TransNo', 'CustomerName','TotalDue', 'DownPayment', 'Balance','PaymentType','InputByDateTime','InputBy', 'RecordStatus',];
  
   columnConfig: ColumnTypeConfig = {
    decimalColumns: ['TotalDue', 'DownPayment', 'Balance'],
    intColumns: [],
    dateTimeColumns: ['InputByDateTime'],
    dateColumns: ['TransDate']
  };
   columnTypeMap: { [key: string]: string } = {};

   constructor(
     private dialog              : MatDialog,
     private orderHeadersService        : OrderHeadersService,
     private orderDetailsService        : OrderDetailsService,
     private orderConfigService        : OrderConfigService,
     private customersService        : CustomersService,
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
     this.orderHeaders = await firstValueFrom(this.orderHeadersService.getOrderHeadersByDateFromByDateTo(
       this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
       this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))
     ));
     if(this.orderHeaders)
       this.isLoading = false;
     this.displayRecords();
   }
 
   displayRecords(){
     var data = this.orderHeaders;
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
     dialogConfig.data         = ([this.dateFrom, this.dateTo, this.selectedData.TransNo]);
      dialogConfig.viewContainerRef = this.viewContainerRef; 
     this.dialog.open(OrderDetailsUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      this.onClickView();
    });
   }
 
   onClickViewAllDetails(){
     const dialogConfig        = new MatDialogConfig();
     dialogConfig.disableClose = true;
     dialogConfig.autoFocus    = true;
     dialogConfig.width        = '1500px';
     dialogConfig.data         = ([this.dateFrom, this.dateTo, 'all']);
     dialogConfig.viewContainerRef = this.viewContainerRef; 
     this.dialog.open(OrderDetailsUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      this.onClickView();
    });
   }
 
   async onClickEdit(){
     if(!this.matTableService.checkNull(this.selectedId)) return;
 
 
     var data = await firstValueFrom(this.orderHeadersService.getOrderHeaderByTransNo(this.selectedId));
     var customer = await firstValueFrom(this.customersService.getCustomerByCustomerId(this.selectedData.CustomerId));
 
     if(data && customer){
       const dialogConfig        = new MatDialogConfig();
       dialogConfig.disableClose = true;
       dialogConfig.autoFocus    = true;
       dialogConfig.width        = '1000px';
       dialogConfig.data = ([customer,data, data.TransNo,data.TotalAmount ,'updateorderheader']);
       this.dialog.open(OrderHeaderUIComponent,dialogConfig).beforeClosed().subscribe(x => {
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
           this.orderHeadersService.updateOrderRecordStatus(this.selectedId, action).subscribe({
             next:(res)=>{
               this.notificationService.toastrSuccess(res.message);
               this.populateChanges(res.orderHeader);
             },
             error:(err)=>{
               this.notificationService.toastrError(err.error);
             },
           });
       }
     });
   }
 
   populateChanges(orderHeader){
     this.selectedId  = null;
     this.selectedData = null;
     const orderHeaderIndex = this.orderHeaders.findIndex(detail => detail.TransNo === orderHeader.TransNo);
     if (orderHeaderIndex !== -1) {
       this.orderHeaders[orderHeaderIndex] = orderHeader;  
     }
     this.displayRecords();
   }
 
   async onClickAddItem(){
     if (!this.matTableService.CommonTransaction()) {
      return;
    }
     if(!this.matTableService.checkNull(this.selectedId)) return;
 
     var data = await firstValueFrom(this.orderHeadersService.getOrderHeaderByTransNo(this.selectedId));
 
     const dialogConfig        = new MatDialogConfig();
     dialogConfig.disableClose = true;
     dialogConfig.autoFocus    = true;
     dialogConfig.width        = '1500px';
     dialogConfig.data         = ([data.TransCode, data.CustomerId,data, 'orderreceipts']);
     this.dialog.open(LoadItemsForOrderUIComponent,dialogConfig).beforeClosed().subscribe(x => {
       if(x){
         this.populateChanges(x);
       } 
     });
   }
 
   onClickAccountingEntry(){
     if(!this.matTableService.checkNull(this.selectedId)) return;
 
     var indexTables: any ={
       'AccountTitleTable' : 'orderaccounttitles',
       'TransactionTable' : 'orderheaders',
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
       var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printorderreceipts']));
       var data  = this.listData.filteredData;
       var title = 'ORDER RECEIPTS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
       this.printService.popupWindow(url, 'PrintOrderReceipts', window, 800, 800);
       localStorage.setItem('Headers', JSON.stringify(data));
       localStorage.setItem('Title', title);
     }

    async onClickPrintReceipt(){
      if(!this.matTableService.checkNull(this.selectedId)) return;

      var orderHeader = await firstValueFrom(this.orderHeadersService.getOrderHeaderByTransNo(this.selectedData.TransNo));
      var orderHeaderDetails = await firstValueFrom(this.orderDetailsService.getOrderDetailsByTransNo(this.selectedData.TransNo));
      var orderConfig = await firstValueFrom(this.orderConfigService.getOrderConfig());

      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printorderdetails']));
      var data  = orderHeaderDetails.filter(x =>x.TransNo == this.selectedData.TransNo && x.RecordStatus == 'open');
      var title = 'ORDERS RECEIPT OF  - ' + orderHeader.TransNo ;
      
      this.printService.popupWindow(url, 'orderDetails', window, 800, 800);
      localStorage.setItem('Header', JSON.stringify(orderHeader));
      localStorage.setItem('Details', JSON.stringify(data));
      localStorage.setItem('OrderConfig', JSON.stringify(orderConfig));
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
