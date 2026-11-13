import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { PaymentHeadersService } from 'src/app/services/Receivables/payment-headers.service';
import { PaymentTransactionService } from 'src/app/services/Receivables/payment-transaction.service';
import { ReceivableOldReceiptsService } from 'src/app/services/Receivables/receivable-old-receipts.service';
import { ReceivableStatementsService } from 'src/app/services/Receivables/receivable-statements.service';
import { SaleConfigService } from 'src/app/services/Sales/sale-config.service';
import { SaleDetailsService } from 'src/app/services/Sales/sale-details.service';
import { SaleHeadersService } from 'src/app/services/Sales/sale-headers.service';
import { StockAdjustmentDetailsService } from 'src/app/services/StockAdjustments/stock-adjustment-details.service';
import { StockAdjustmentHeadersService } from 'src/app/services/StockAdjustments/stock-adjustment-headers.service';

@Component({
  selector: 'app-load-receipts-for-payment-ui',
  templateUrl: './load-receipts-for-payment-ui.component.html',
  styleUrls: ['./load-receipts-for-payment-ui.component.css']
})
export class LoadReceiptsForPaymentUIComponent implements OnInit {

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
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate','DueDate']
  };
  columnTypeMap: { [key: string]: string } = {};
  transCode: string;
  customerId: string;
  paymentDetails: any=[];
  paymentHeader: any;
  paymentConfig: any=[];
  stock: any;
  ui: any;
  customer: any=[];
  constructor(
    private dialogRef                   : MatDialogRef<LoadReceiptsForPaymentUIComponent>,
    private receivableStatementsService        : ReceivableStatementsService,
    private notificationService : NotificationService,
    public matTableService     : MatTableService,
    private paymentTransactionService : PaymentTransactionService,
    private router : Router,
    private printService                      : PrintService,
    private saleHeadersService : SaleHeadersService,
    private saleDetailsService : SaleDetailsService,
    private saleConfigService : SaleConfigService,
    private stockAdjustmentHeadersService : StockAdjustmentHeadersService,
    private stockAdjustmentDetailsService : StockAdjustmentDetailsService,
    private receivableOldReceiptsService : ReceivableOldReceiptsService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  ngOnInit(): void {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.transCode = this.data[0];
    this.customerId    = this.data[1];
    this.paymentDetails = this.data[2];
    this.paymentHeader = this.data[2];
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
    this.receipts = await firstValueFrom(this.receivableStatementsService.getReceiptsByCustomerId(this.customerId));
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
    if(this.ui == 'paymenttransaction'){
      this.dialogRef.close(this.paymentDetails);
    }
    if(this.ui == 'paymentreceipts'){
      this.dialogRef.close(this.paymentHeader);
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
      this.paymentTransactionService.saveToPaymentHeaders(this.selectedId,0,  this.transCode, this.customerId, this.selectedItem.Balance, data).subscribe({
      next: (res)=>{
          this.transCode = (res.paymentDetail ?? res.paymentDetails?.[0])?.TransNo ?? this.transCode;  // the first line gets the temporary TransNo
        this.notificationService.toastrSuccess(res.message);
        this.paymentDetails = [ res.paymentDetail,...this.paymentDetails]; 
        this.selectedId = undefined;
      },
      error: (err)=>{
        this.notificationService.toastrError(err.error.message);
      }
    }); 
  }

   onClickViewDetails(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    if(this.selectedData.SourceType.toLowerCase() == 'sales'){
     this.printSaleReceipt();
    }
    if(this.selectedData.SourceType.toLowerCase() == 'adjustment'){
     this.printAdjustmentReceipt();
    }
    if(this.selectedData.SourceType.toLowerCase() == 'old receipt'){
      this.printReceivableOldReceipt();
     }
    
  }

  async printSaleReceipt(){
    this.header = await firstValueFrom(this.saleHeadersService.getSaleHeaderByTransNo(this.selectedData.SourceTransNo));
    this.details = await firstValueFrom(this.saleDetailsService.getSaleDetailsByTransNo(this.selectedData.SourceTransNo));
    this.config = await firstValueFrom(this.saleConfigService.getSaleConfig());


    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsaledetails']));
    var data  = this.details.filter(x => x.RecordStatus == 'open');
    var title = 'SALES INVOICE OF  - ' + this.header.TransNo ;
    
    this.printService.popupWindow(url, 'saleDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(this.header));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('SaleConfig', JSON.stringify(this.config));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', this.selectedData.TransNo);
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
    localStorage.setItem('TransNo', this.selectedData.TransNo);
  }

  async printReceivableOldReceipt(){
    this.header = await firstValueFrom(this.receivableOldReceiptsService.getReceivableOldReceiptByTransNo(this.selectedData.SourceTransNo));
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printreceivableoldreceipt']));
    var title = 'RECEIVABLE OLD RECEIPT';
    this.printService.popupWindow(url, 'printreceivableoldreceipt', window, 800, 800);
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
