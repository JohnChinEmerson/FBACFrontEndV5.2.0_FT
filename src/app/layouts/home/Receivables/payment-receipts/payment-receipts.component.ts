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
import { PaymentDetailsService } from 'src/app/services/Receivables/payment-details.service';
import { PaymentHeadersService } from 'src/app/services/Receivables/payment-headers.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { AccountingEntryUIComponent } from '../../Accounting/accounting-entry-ui/accounting-entry-ui.component';
import { HomeComponent } from '../../home.component';
import { VoidReasonUIComponent } from '../../Sales/void-reason-ui/void-reason-ui.component';
import { PaymentDetailsUIComponent } from '../payment-details-ui/payment-details-ui.component';
import { PaymentHeaderUIComponent } from '../payment-header-ui/payment-header-ui.component';
import { MultiplePaymentUIComponent } from '../../MultiplePayments/multiple-payment-ui/multiple-payment-ui.component';
import { MultiplePaymentHeadersService } from 'src/app/services/MultiplePayments/multiple-payment-headers.service';
import { CustomersService } from 'src/app/services/Files/customers.service';

@Component({
  selector: 'app-payment-receipts',
  templateUrl: './payment-receipts.component.html',
  styleUrls: ['./payment-receipts.component.css']
})
export class PaymentReceiptsComponent implements OnInit {

  paymentHeaders : any=[];
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
    {'Label'   : 'Multiple Payment','Function'            : () => this.onClickMultiplePayment(),'Disabled': true,}, 
     {'Label'   : 'Accounting Entry','Function'    : () => this.onClickAccountingEntry(),'Disabled': true,}, 
   ];
   defaultColumns    = ['TransDate','TransNo', 'CustomerName', 'ContactNo', 'Adddress', 'CustomerTIN','BusinessStyle','TotalDue','PaymentType','InputByDateTime','InputBy', 'RecordStatus', 'ReadingNo','AmountPaid', 'Change'];
   columnConfig: ColumnTypeConfig = {
    decimalColumns: ['TotalDue','AmountPaid', 'Change'],
    intColumns: [],
    dateTimeColumns: ['InputByDateTime'],
    dateColumns: ['TransDate']
  };

  columnTypeMap: { [key: string]: string } = {};
   constructor(
     private dialog              : MatDialog,
     private paymentHeadersService        : PaymentHeadersService,
     private paymentDetailsService        : PaymentDetailsService,
     private toolBoxService      : ToolBoxService,
     private dateTimesService      : DateTimesService,
     public matTableService     : MatTableService,
     private printService        : PrintService,
     private router              : Router,
     private homeTs              : HomeComponent,
     private notificationService : NotificationService,
    private multiplePaymentHeadersService : MultiplePaymentHeadersService,
     private customersService : CustomersService, 
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
     this.paymentHeaders = await firstValueFrom(this.paymentHeadersService.getPaymentHeadersByDateFromByDateTo(
       this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
       this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))
     ));
     if(this.paymentHeaders)
       this.isLoading = false;
     this.displayRecords();
   }
 
   displayRecords(){
     var data = this.paymentHeaders;
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
     this.dialog.open(PaymentDetailsUIComponent,dialogConfig).beforeClosed().subscribe(x => {
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
      this.dialog.open(PaymentDetailsUIComponent,dialogConfig).beforeClosed().subscribe(x => {
        this.onClickView();
    });
   }
 
   async onClickEdit(){
     if(!this.matTableService.checkNull(this.selectedId)) return;
 
     var data = await firstValueFrom(this.paymentHeadersService.getPaymentHeaderByTransNo(this.selectedId));
      var customer:any = await firstValueFrom(this.customersService.getCustomerByCustomerId(this.selectedData.CustomerId));
     if(data){
       const dialogConfig        = new MatDialogConfig();
       dialogConfig.disableClose = true;
       dialogConfig.autoFocus    = true;
       dialogConfig.width        = '1000px';
       dialogConfig.data = ([data, data.TransNo,data.TotalAmount,'updatepaymentheader',customer]);
       this.dialog.open(PaymentHeaderUIComponent,dialogConfig).beforeClosed().subscribe(x => {
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
          this.paymentHeadersService.updatePaymentRecordStatus(this.selectedId, action).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.populateChanges(res.paymentHeader);
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
          });
       }
     });
   }
 
   populateChanges(paymentHeader){
     this.selectedId  = null;
     this.selectedData = null;
     const paymentHeaderIndex = this.paymentHeaders.findIndex(detail => detail.TransNo === paymentHeader.TransNo);
     if (paymentHeaderIndex !== -1) {
       this.paymentHeaders[paymentHeaderIndex] = paymentHeader;  
     }
     this.displayRecords();
   }

   async onClickMultiplePayment(){
       if(!this.matTableService.checkNull(this.selectedId)) return;
   
       if(this.selectedData.PaymentType.toLowerCase() != 'multiple') 
        return this.notificationService.toastrWarning("PaymentType is not MULTIPLE.");
      
       var paymentHeadeer:any = await firstValueFrom(this.paymentHeadersService.getPaymentHeaderByTransNo(this.selectedId));
       var data:any = {
         'CustomerId' : paymentHeadeer.CustomerId,
         'CustomerName' : paymentHeadeer.CustomerName,
         'ContactNo' : paymentHeadeer.ContactNo,
         'Address' : paymentHeadeer.Address,
         'CustomerTIN' : paymentHeadeer.CustomerTIN,
         'BusinessStyle' : paymentHeadeer.BusinessStyle,
         'TransName' : "Customer Payments",
         'SourceTransName' : "Customer Payments",
         'TransNo' : paymentHeadeer.TransNo,
         'TransCode' : paymentHeadeer.TransCode,
         'TransDate' : this.dateTimesService.ConvertToDateFormat(new Date( paymentHeadeer.TransDate)),
         'VATType' : paymentHeadeer.VATType,
         'TotalDue' : paymentHeadeer.TotalDue,
         'AmountPaid' : paymentHeadeer.AmountPaid,
       };
   
       const dialogConfig        = new MatDialogConfig();
       dialogConfig.disableClose = true;
       dialogConfig.autoFocus    = true;
       dialogConfig.width        = '600px'; 
       dialogConfig.data = ([data, 'paymentreceipts', 'Save', null, 'Update']);
       this.dialog.open(MultiplePaymentUIComponent,dialogConfig).beforeClosed().subscribe(x => {
         if(x){
          this.multiplePaymentHeadersService.updateMultiplePaymentHeaderFromReceipt(paymentHeadeer.TransCode, paymentHeadeer.TransNo, 'customer payments').subscribe({
            next:(res)=>{
            
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
          });
         }
       });
   
     }
   
 
   onClickAccountingEntry(){
     if(!this.matTableService.checkNull(this.selectedId)) return;
 
     var indexTables: any ={
       'AccountTitleTable' : 'paymentaccounttitles',
       'TransactionTable' : 'paymentheaders',
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
      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printpaymentreceipts']));
      var data  = this.listData.filteredData;
      var title = 'PAYMENT RECEIPTS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
      this.printService.popupWindow(url, 'printpaymentreceipts', window, 800, 800);
      localStorage.setItem('Headers', JSON.stringify(data));
      localStorage.setItem('Title', title);
    }

    async onClickPrintReceipt(){
      if(!this.matTableService.checkNull(this.selectedId)) return;

      var paymentHeader = await firstValueFrom(this.paymentHeadersService.getPaymentHeaderByTransNo(this.selectedData.TransNo));
      var paymentDetails = await firstValueFrom(this.paymentDetailsService.getPaymentDetailsByTransNo(this.selectedData.TransNo));

      if(paymentHeader.PaymentType.toLowerCase() == 'multiple')
        var mpHeaders= await firstValueFrom(this.multiplePaymentHeadersService.getMultiplePaymentsBySourceTransCode(paymentHeader.TransCode));
      else
        mpHeaders = null;

      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printpaymentdetails']));
      var data  = paymentDetails.filter(x =>x.TransNo == this.selectedData.TransNo && x.RecordStatus == 'open');
      var title = 'PAYMENT RECEIPT OF  - ' + paymentHeader.TransNo ;
      
      this.printService.popupWindow(url, 'paymentDetails', window, 800, 800);
      localStorage.setItem('Header', JSON.stringify(paymentHeader));
      localStorage.setItem('MPHeader', JSON.stringify(mpHeaders));
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
