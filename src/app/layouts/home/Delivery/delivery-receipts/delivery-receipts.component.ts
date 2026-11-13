import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { DeliveryHeadersService } from 'src/app/services/Delivery/delivery-headers.service';
import { CustomersService } from 'src/app/services/Files/customers.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { SaleHeadersService } from 'src/app/services/Sales/sale-headers.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { VoidReasonUIComponent } from '../../Sales/void-reason-ui/void-reason-ui.component';
import { DeliveryDetailsUIComponent } from '../delivery-details-ui/delivery-details-ui.component';
import { DeliveryHeaderUIComponent } from '../delivery-header-ui/delivery-header-ui.component';
import { LoadItemsForDeliveryUIComponent } from '../load-items-for-delivery-ui/load-items-for-delivery-ui.component';
import { DeliveryDetailsService } from 'src/app/services/Delivery/delivery-details.service';
import { DeliveryConfigService } from 'src/app/services/Delivery/delivery-config.service';

@Component({
  selector: 'app-delivery-receipts',
  templateUrl: './delivery-receipts.component.html',
  styleUrls: ['./delivery-receipts.component.css']
})
export class DeliveryReceiptsComponent implements OnInit {

  deliveryHeaders : any=[];
   saleHeader:any;
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
     {'Label'   : 'Print Receipt','Function'               : () => this.onClickPrintReceipt(),'Disabled': true,}, 
     {'Label'   : 'View All Details','Function'    : () => this.onClickViewAllDetails(),'Disabled': true,}, 
   ];  
   contextButtons     = [
     {'Label'   : 'Edit','Function'                : () => this.onClickEdit(),'Disabled': true,}, 
     {'Label'   : 'Void/Open','Function'           : () => this.onClickVoid(),'Disabled': true,},
     {'Label'   : 'Add Item','Function'            : () => this.onClickAddItem(),'Disabled': true,}, 
   ];

   defaultColumns = ['TransDate','TransNo','ReferenceNo', 'CustomerName','TotalDue','PaymentType','InputByDateTime','InputBy', 'RecordStatus',];
   columnConfig: ColumnTypeConfig = {
    decimalColumns: ['TotalDue'],
    intColumns: [],
    dateTimeColumns: ['InputByDateTime'],
    dateColumns: ['TransDate']
  };
  columnTypeMap: { [key: string]: string } = {};

   constructor(
     private dialog              : MatDialog,
     private deliveryHeadersService        : DeliveryHeadersService,
     private deliveryDetailsService        : DeliveryDetailsService,
     private deliveryConfigService        : DeliveryConfigService,
     private saleHeadersService        : SaleHeadersService,
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
     this.deliveryHeaders = await firstValueFrom(this.deliveryHeadersService.getDeliveryHeadersByDateFromByDateTo(
       this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
       this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))
     ));
     if(this.deliveryHeaders)
       this.isLoading = false;
     this.displayRecords();
   }
 
   displayRecords(){
     var data = this.deliveryHeaders;
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
     this.dialog.open(DeliveryDetailsUIComponent,dialogConfig).beforeClosed().subscribe(x => {
        if(x){
          this.onClickView();
        }
      });
   }
 
   onClickViewAllDetails(){
     const dialogConfig        = new MatDialogConfig();
     dialogConfig.disableClose = true;
     dialogConfig.autoFocus    = true;
     dialogConfig.width        = '1500px';
     dialogConfig.data         = ([this.dateFrom, this.dateTo, 'all']);
      dialogConfig.viewContainerRef = this.viewContainerRef; 
     this.dialog.open(DeliveryDetailsUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      if(x){
        this.onClickView();
      }
    });
   }
 
   async onClickEdit(){
     if(!this.matTableService.checkNull(this.selectedId)) return;
 
 
     var data = await firstValueFrom(this.deliveryHeadersService.getDeliveryHeaderByTransNo(this.selectedId));
     var customer = await firstValueFrom(this.customersService.getCustomerByCustomerId(this.selectedData.CustomerId));
      this.saleHeader = await firstValueFrom(this.saleHeadersService.getSaleHeaderByTransNo(this.selectedData.SaleNo));
 
     if(data && customer){
       const dialogConfig        = new MatDialogConfig();
       dialogConfig.disableClose = true;
       dialogConfig.autoFocus    = true;
       dialogConfig.width        = '1000px';
      dialogConfig.data = ([data,this.saleHeader,  customer,data.TransCode, data.TotalAmount,'updatedeliveryheader']);
       this.dialog.open(DeliveryHeaderUIComponent,dialogConfig).beforeClosed().subscribe(x => {
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
         var data = await firstValueFrom(this.deliveryHeadersService.getDeliveryHeaderByTransNo(this.selectedId));
 
           this.deliveryHeadersService.updateDeliveryRecordStatus(this.selectedId, action).subscribe({
             next:(res)=>{
               this.notificationService.toastrSuccess(res.message);
               this.populateChanges(res.deliveryHeader);
             },
             error:(err)=>{
               this.notificationService.toastrError(err.error);
             },
           });
       }
     });
   }
 
   populateChanges(deliveryHeader){
     this.selectedId  = null;
     this.selectedData = null;
     const deliveryHeaderIndex = this.deliveryHeaders.findIndex(detail => detail.TransNo === deliveryHeader.TransNo);
     if (deliveryHeaderIndex !== -1) {
       this.deliveryHeaders[deliveryHeaderIndex] = deliveryHeader;  
     }
     this.displayRecords();
   }
 
   async onClickAddItem(){
     if (!this.matTableService.CommonTransaction()) {
      return;
    }
     if(!this.matTableService.checkNull(this.selectedId)) return;
 
     var data = await firstValueFrom(this.deliveryHeadersService.getDeliveryHeaderByTransNo(this.selectedId));
 
     const dialogConfig        = new MatDialogConfig();
     dialogConfig.disableClose = true;
     dialogConfig.autoFocus    = true;
     dialogConfig.width        = '1500px';
     dialogConfig.data         = ([data.TransCode, data.CustomerId,data, 'deliveryreceipts']);
     this.dialog.open(LoadItemsForDeliveryUIComponent,dialogConfig).beforeClosed().subscribe(x => {
       if(x){
         this.populateChanges(x);
       } 
     });
   }
 
   
   
  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printdeliveryreceipts']));
    var data  = this.listData.filteredData;
    var title = 'DELIVERY RECEIPTS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'PrintDeliveryReceipts', window, 800, 800);
    localStorage.setItem('Headers', JSON.stringify(data));
    localStorage.setItem('Title', title);
  }

  async onClickPrintReceipt(){
  if(!this.matTableService.checkNull(this.selectedId)) return;

    var deliveryHeader = await firstValueFrom(this.deliveryHeadersService.getDeliveryHeaderByTransNo(this.selectedData.TransNo));
    var deliveryDetails = await firstValueFrom(this.deliveryDetailsService.getDeliveryDetailsByTransNo(this.selectedData.TransNo));
    var deliveryConfig = await firstValueFrom(this.deliveryConfigService.getDeliveryConfig());

    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printdeliverydetails']));
    var data  = deliveryDetails.filter(x =>x.TransNo == this.selectedData.TransNo && x.RecordStatus == 'open');
    var title = 'DELIVERY RECEIPT OF  - ' + deliveryHeader.TransNo ;
    
    this.printService.popupWindow(url, 'deliveryDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(deliveryHeader));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('DeliveryConfig', JSON.stringify(deliveryConfig));
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
