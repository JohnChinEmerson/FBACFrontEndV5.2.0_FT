import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ExpenseDetailsService } from 'src/app/services/Expenses/expense-details.service';
import { ExpenseHeadersService } from 'src/app/services/Expenses/expense-headers.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PayableOldReceiptsService } from 'src/app/services/Payables/payable-old-receipts.service';
import { PayableStatementsService } from 'src/app/services/Payables/payable-statements.service';
import { PayeeTransactionService } from 'src/app/services/Payables/payee-transaction.service';
import { PrintService } from 'src/app/services/print.service';
import { ReceivingDetailsService } from 'src/app/services/Receiving/receiving-details.service';
import { ReceivingHeadersService } from 'src/app/services/Receiving/receiving-headers.service';
import { SaleReturnConfigService } from 'src/app/services/SaleReturn/sale-return-config.service';
import { SaleReturnDetailsService } from 'src/app/services/SaleReturn/sale-return-details.service';
import { SaleReturnHeadersService } from 'src/app/services/SaleReturn/sale-return-headers.service';
import { StockAdjustmentDetailsService } from 'src/app/services/StockAdjustments/stock-adjustment-details.service';
import { StockAdjustmentHeadersService } from 'src/app/services/StockAdjustments/stock-adjustment-headers.service';

@Component({
  selector: 'app-load-receipts-for-supplier-payment-ui',
  templateUrl: './load-receipts-for-supplier-payment-ui.component.html',
  styleUrls: ['./load-receipts-for-supplier-payment-ui.component.css']
})
export class LoadReceiptsForSupplierPaymentUIComponent implements OnInit {
  receipts           : any=[];
   header           : any=[];
   config           : any=[];
   details : any=[];
   selectedData    : any;
   selectedId      : number = 0;
   searchKey       : string = "";
   listData        : MatTableDataSource<any>;
   pageSizeOptions :any = this.matTableService.pageSizeOptions();
   isLoading       : boolean = false;
   selectedItem : any;
   @ViewChild(MatSort) sort              : MatSort;
   @ViewChild(MatPaginator) paginator    : MatPaginator;  
 
   toolButtons     = [
     {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
     {'Label'   : 'Save To Payment','Function'   : () => this.onClickSaveToPaymentTransaction(),'Disabled': true,}, 
   ];  
   contextButtons     = [
     {'Label'   : 'View Details','Function'            : () => this.onClickViewDetails(),'Disabled': true,}, 
   ];
   defaultColumns  = ['TransDate','DueDate','SourceId','SourceName','SourceTransNo','TotalDue','AmountPaid', 'Balance'];
   columnConfig: ColumnTypeConfig = {
    decimalColumns: ['TotalDue','AmountPaid', 'Balance'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate','DueDate']
  };
  columnTypeMap: { [key: string]: string } = {};
   transCode: string;
   supplierId: string;
   supplierPaymentDetails: any=[];
   supplierPaymentHeader: any;
   paymentConfig: any=[];
   stock: any;
   ui: any;
   customer: any=[];
   constructor(
     private dialogRef                   : MatDialogRef<LoadReceiptsForSupplierPaymentUIComponent>,
     private payableStatementsService        : PayableStatementsService,
     private notificationService : NotificationService,
     public matTableService     : MatTableService,
     private payeeTransactionService : PayeeTransactionService,
     private router : Router,
     private printService                      : PrintService,
     private saleReturnHeadersService : SaleReturnHeadersService,
     private saleReturnDetailsService : SaleReturnDetailsService,
     private saleReturnConfigService : SaleReturnConfigService,
     private stockAdjustmentHeadersService : StockAdjustmentHeadersService,
     private stockAdjustmentDetailsService : StockAdjustmentDetailsService,
     private receivingHeadersService : ReceivingHeadersService,
     private receivingDetailsService : ReceivingDetailsService,
     private expenseHeadersService : ExpenseHeadersService,
     private expenseDetailsService : ExpenseDetailsService,
     private payableOldReceiptsService : PayableOldReceiptsService,
     @Inject(MAT_DIALOG_DATA) public data: any, 
   ) { }
 
   ngOnInit(): void {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
     this.transCode = this.data[0];
     this.supplierId    = this.data[1];
     this.supplierPaymentDetails = this.data[2];
     this.supplierPaymentHeader = this.data[2];
     this.ui = this.data[3];
     this.onClickView();
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
     this.receipts = await firstValueFrom(this.payableStatementsService.getReceiptsBySupplierId(this.supplierId));
     if(this.receipts)
       this.isLoading = false;
     this.displayRecords();
   }
 
   displayRecords(){
     var data = this.receipts;
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
     this.selectedId = data.SourceTransNo;
     this.selectedData = data;
   }
 
   onClose(){
     if(this.ui == 'supplierpaymenttransaction'){
       this.dialogRef.close(this.supplierPaymentDetails);
     }
     if(this.ui == 'paymentreceipts'){
       this.dialogRef.close(this.supplierPaymentHeader);
     }
   }
 
   applyFilter2(){
     this.matTableService.applyFilter(this.listData, this.searchKey);
     this.selectedId = this.listData.filteredData[0].SourceTransNo;
     this.onClickSaveToPaymentTransaction();
   }
 
   onClickSaveToPaymentTransaction(){
     if (!this.matTableService.checkNull(this.selectedId)) return;
 
       this.selectedItem  = this.receipts.filter(x => x.SourceTransNo == this.selectedId);
       this.selectedItem = this.selectedItem[0];
 
       var data:any = {
         'selectedReceipt' : this.selectedItem,
       }
       this.payeeTransactionService.saveToSupplierPaymentHeaders(this.selectedId,0,  this.transCode, this.supplierId, this.selectedItem.Balance, data).subscribe({
       next: (res)=>{
          this.transCode = (res.supplierPaymentDetail ?? res.supplierPaymentDetails?.[0])?.TransNo ?? this.transCode;  // the first line gets the temporary TransNo
         this.notificationService.toastrSuccess(res.message);
         this.supplierPaymentDetails = [ res.supplierPaymentDetail,...this.supplierPaymentDetails]; 
         this.selectedId = undefined;
       },
       error: (err)=>{
         this.notificationService.toastrError(err.error.message);
       }
     }); 
   }
 
    onClickViewDetails(){
     if (!this.matTableService.checkNull(this.selectedId)) return;
 
     if(this.selectedData.SourceType.toLowerCase() == 'sales return'){
      this.printSaleReturnReceipt();
     }
     if(this.selectedData.SourceType.toLowerCase() == 'receiving'){
      this.printReceivingReceipt();
     }
     if(this.selectedData.SourceType.toLowerCase() == 'expenses'){
      this.printExpenseReceipt();
     }
     if(this.selectedData.SourceType.toLowerCase() == 'adjustment'){
      this.printAdjustmentReceipt();
     }
     if(this.selectedData.SourceType.toLowerCase() == 'old receipt'){
       this.printReceivableOldReceipt();
      }
     
   }
 
   async printSaleReturnReceipt(){
     this.header = await firstValueFrom(this.saleReturnHeadersService.getSaleReturnHeaderByTransNo(this.selectedData.SourceTransNo));
     this.details = await firstValueFrom(this.saleReturnDetailsService.getSaleReturnDetailsByTransNo(this.selectedData.SourceTransNo));
     this.config = await firstValueFrom(this.saleReturnConfigService.getSaleReturnConfig());
 
 
     var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsalereturndetails']));
     var data  = this.details.filter(x => x.RecordStatus == 'open');
     var title = 'SALES RETURN RECEIPT OF  - ' + this.header.TransNo ;
     
     this.printService.popupWindow(url, 'printsalereturndetails', window, 800, 800);
     localStorage.setItem('Header', JSON.stringify(this.header));
     localStorage.setItem('Details', JSON.stringify(data));
     localStorage.setItem('SaleReturnConfig', JSON.stringify(this.config));
     localStorage.setItem('Title', title);
     localStorage.setItem('TransNo', this.header.TransNo);
   }

   async printReceivingReceipt(){
      this.header = await firstValueFrom(this.receivingHeadersService.getReceivingHeaderByTransNo(this.selectedData.SourceTransNo));
      this.details = await firstValueFrom(this.receivingDetailsService.getReceivingDetailsByTransNo(this.selectedData.SourceTransNo));


      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printreceivingdetails']));
      var data  = this.details.filter(x => x.RecordStatus == 'open');
      var title = 'RECEIVING RECEIPT OF  - ' + this.header.TransNo ;
      
      this.printService.popupWindow(url, 'printreceivingdetails', window, 800, 800);
      localStorage.setItem('Header', JSON.stringify(this.header));
      localStorage.setItem('Details', JSON.stringify(data));
      localStorage.setItem('Title', title);
      localStorage.setItem('TransNo', this.header.TransNo);
    }

    async printExpenseReceipt(){
      this.header = await firstValueFrom(this.expenseHeadersService.getExpenseHeaderByTransNo(this.selectedData.SourceTransNo));
      this.details = await firstValueFrom(this.expenseDetailsService.getExpenseDetailsByTransNo(this.selectedData.SourceTransNo));


      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printexpensedetails']));
      var data  = this.details.filter(x => x.RecordStatus == 'open');
      var title = 'EXPENSE RECEIPT OF  - ' + this.header.TransNo ;
      
      this.printService.popupWindow(url, 'printexpensedetails', window, 800, 800);
      localStorage.setItem('Header', JSON.stringify(this.header));
      localStorage.setItem('Details', JSON.stringify(data));
      localStorage.setItem('Title', title);
      localStorage.setItem('TransNo', this.header.TransNo);
    }
 
   async printAdjustmentReceipt(){
     this.header = await firstValueFrom(this.stockAdjustmentHeadersService.getStockAdjustmentHeaderByTransNo(this.selectedData.SourceTransNo));
     this.details = await firstValueFrom(this.stockAdjustmentDetailsService.getStockAdjustmentDetailsByTransNo(this.selectedData.SourceTransNo));
 
 
     var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printstockadjustmentdetails']));
     var data  = this.details.filter(x =>x.RecordStatus == 'open');
     var title = 'STOCK ADJUSTMENT RECEIPT OF  - ' + this.header.TransNo ;
     
     this.printService.popupWindow(url, 'printstockadjustmentdetails', window, 800, 800);
     localStorage.setItem('Header', JSON.stringify(this.header));
     localStorage.setItem('Details', JSON.stringify(data));
     localStorage.setItem('Title', title);
     localStorage.setItem('TransNo', this.header.TransNo);
   }
 
   async printReceivableOldReceipt(){
     this.header = await firstValueFrom(this.payableOldReceiptsService.getPayableOldReceiptByTransNo(this.selectedData.SourceTransNo));
     var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printpayableoldreceipt']));
     var title = 'PAYABALE OLD RECEIPT';
     this.printService.popupWindow(url, 'printpayableoldreceipt', window, 800, 800);
     localStorage.setItem('Data', JSON.stringify(this.header));
     localStorage.setItem('Title', title);
   }
 
   @ViewChild(MatMenuTrigger)
   contextMenu: MatMenuTrigger;
   contextMenuPosition = { x: '0px', y: '0px' };
   onContextMenu(event: MouseEvent, data: any) {
     if(data)
       this.getRecord(data);
       event.preventDefault();
       this.contextMenuPosition.x = event.clientX + 'px';
       this.contextMenuPosition.y = event.clientY + 'px';
       this.contextMenu.menuData = { 'data': data };
       this.contextMenu.menu.focusFirstItem('mouse');
       this.contextMenu.openMenu();
   }
}
