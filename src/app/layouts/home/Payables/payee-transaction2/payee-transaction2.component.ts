import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { ExpenseDetailsService } from 'src/app/services/Expenses/expense-details.service';
import { ExpenseHeadersService } from 'src/app/services/Expenses/expense-headers.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { PayableOldReceiptsService } from 'src/app/services/Payables/payable-old-receipts.service';
import { PayableStatementsService } from 'src/app/services/Payables/payable-statements.service';
import { PayeeTransactionService } from 'src/app/services/Payables/payee-transaction.service';
import { SupplierPaymentDetailsService } from 'src/app/services/Payables/supplier-payment-details.service';
import { SupplierPaymentHeadersService } from 'src/app/services/Payables/supplier-payment-headers.service';
import { PrintService } from 'src/app/services/print.service';
import { ReceivingDetailsService } from 'src/app/services/Receiving/receiving-details.service';
import { ReceivingHeadersService } from 'src/app/services/Receiving/receiving-headers.service';
import { SaleReturnConfigService } from 'src/app/services/SaleReturn/sale-return-config.service';
import { SaleReturnDetailsService } from 'src/app/services/SaleReturn/sale-return-details.service';
import { SaleReturnHeadersService } from 'src/app/services/SaleReturn/sale-return-headers.service';
import { StockAdjustmentDetailsService } from 'src/app/services/StockAdjustments/stock-adjustment-details.service';
import { StockAdjustmentHeadersService } from 'src/app/services/StockAdjustments/stock-adjustment-headers.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { LoadReceiptsForSupplierPaymentUIComponent } from '../load-receipts-for-supplier-payment-ui/load-receipts-for-supplier-payment-ui.component';
import { PayableOldReceiptsUIComponent } from '../payable-old-receipts-ui/payable-old-receipts-ui.component';
import { SupplierPaymentDetailUIComponent } from '../supplier-payment-detail-ui/supplier-payment-detail-ui.component';
import { SupplierPaymentHeaderUIComponent } from '../supplier-payment-header-ui/supplier-payment-header-ui.component';

@Component({
  selector: 'app-payee-transaction2',
  templateUrl: './payee-transaction2.component.html',
  styleUrls: ['./payee-transaction2.component.css']
})
export class PayeeTransaction2Component implements OnInit {
  freceipts             : any=[];
  receipts              : any=[];
  suppliers             : any=[];
  supplierId            : string;
  sourceTransNo         : any;
  selectedReceipt       : any;
  selectedRowIndex      : number = 0;
  selectedSupplier      : any;

  supplierPaymentDetails     : any=[];
  supplierPaymentHeader      : any=[];

  listData1         : MatTableDataSource<any>;
  searchKey1        : string;
  isLoading1        : boolean = false;
  
  listData2         : MatTableDataSource<any>;
  searchKey2        : string;
  isLoading2        : boolean = false;
  
  rightClickType    : string = 'paymentdetails';
  transCode         : string  = null;
  totalAmount       : number = 0;
  selectedId        : string;
  selectedData      : any;
  totalBalance      : number = 0;
  amount            : number;
  disableSave       : boolean = false;
  defaultColumns  = ['SourceTransNo','TotalDue','AmountPaid', 'Balance'];
  defaultColumns2  : any[] = [
    'SourceTransNo',
    'Amount',
  ];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['TotalDue','AmountPaid', 'Balance','Amount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};

  @ViewChild('qtyInput') qtyInputRef: ElementRef;
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('dataTable', { static: false }) dataTable!: ElementRef;
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;
  @ViewChildren('rowElement', { read: ElementRef }) rows!: QueryList<ElementRef>;
  @ViewChild('tableContainer', { static: true }) tableContainer!: ElementRef;

  contextButtons1  =  [
    {'Label'   : 'Receipt Details','Function' : () => this.onClickViewDetails(),'Disabled': true,}, 
    {'Label'   : 'Old Receipts','Function'    : () => this.onClickOldReceipts(),'Disabled': true,}, 
  ];

  contextButtons2  =  [
    {'Label'   : 'Edit','Function'            : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Remove','Function'          : () => this.onClickRemove(),'Disabled': true,}, 
    {'Label'   : 'Remove All','Function'      : () => this.onClickRemoveAll(),'Disabled': true,}, 
  ];
  toggleButtons     = [
    {'Label'   : 'SAVE TRANSACTION-F4','Function'    : () => this.onClickSaveTransaction(),'Disabled': true,}, 
  ];
  constructor(
      private dialog          : MatDialog,
      private payeeTransactionService          : PayeeTransactionService,
      private supplierPaymentHeadersService          : SupplierPaymentHeadersService,
      private supplierPaymentDetailsService          : SupplierPaymentDetailsService,
      private payableStatementsService          : PayableStatementsService,
      private notif           : NotificationService,
      private auth_service    : AuthService,
      private toolBoxService : ToolBoxService,
      public matTableService : MatTableService,
      private numbersService : NumbersService,
      private dateTimesService : DateTimesService,
      private stringHelperService : StringHelperService,
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
      private homeTs : HomeComponent,
      private notificationService : NotificationService,
      private router : Router, 
      private printService : PrintService, 
  ) { }

  async ngOnInit(): Promise<void> {
     this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2)
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.contextButtons1, this.contextButtons2,this.toggleButtons, null);
    await this.loadSuppliers();
    await this.getPaymentDetails();
    await this.getPayableReceipts();
   ;
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async loadSuppliers(){
    this.suppliers = await firstValueFrom(this.payableStatementsService.loadSupplierWithAllWithBalance(false, true));
  }

  async getPaymentDetails(){
    this.isLoading2 = true;
    try{
      this.supplierPaymentHeader = await firstValueFrom(this.supplierPaymentHeadersService.getSupplierPaymentHeaderByRecordStatusByInputBy('ongoing',this.auth_service.User));

      if (!this.supplierPaymentHeader) {
        this.supplierPaymentDetails = [];
        this.supplierId = undefined;
        this.transCode = null;
      }
      else{
        this.supplierPaymentDetails = await firstValueFrom(this.supplierPaymentDetailsService.getSupplierPaymentDetailsByTransCode(this.supplierPaymentHeader.TransCode));
        this.supplierId = this.supplierPaymentHeader.SupplierId;
        this.supplierId = this.supplierPaymentHeader.SupplierId;
        var selectedSupplier:any = this.suppliers.filter(x => x.SupplierId == this.supplierId);
        this.onChangeSupplier(selectedSupplier[0]);
        this.transCode = this.supplierPaymentHeader.TransCode;
      }
    }
    finally{
      this.isLoading2 = false;
      this.displayPaymentDetails();
    }
  }

  // async getPaymentDetails(){
  //   if(this.transCode == null){
  //     await this.getTransCode();
  //   }
  //   this.isLoading2 = true;
  //   this.supplierPaymentHeader  = await firstValueFrom(this.supplierPaymentHeadersService.getSupplierPaymentHeaderByTransCode(this.transCode));
  //   this.supplierPaymentDetails =  await firstValueFrom(this.supplierPaymentDetailsService.getSupplierPaymentDetailsByTransCode(this.transCode));
  //   if(this.supplierPaymentHeader){
  //     if(this.supplierPaymentHeader.SupplierId){
  //       this.supplierId = this.supplierPaymentHeader.SupplierId;
  //       var selectedSupplier:any = this.suppliers.filter(x => x.SupplierId == this.supplierId);
  //       this.onChangeSupplier(selectedSupplier[0]);
  //     }
  //   }
    
  //   if(this.supplierPaymentDetails)
  //     this.isLoading2 = false;
  //   this.displayPaymentDetails();
  // }

  async getTransCode(){
    this.transCode = null;   // Desktop: no number until the first line is saved (it then gets its temporary TransNo)
  }

  async getPayableReceipts()
  {
    if (this.supplierId)
      this.receipts = await firstValueFrom(this.payableStatementsService.getReceiptsBySupplierId(this.supplierId));
    else
    this.receipts = [];

  this.displayReceipts();
  }

  displayReceipts(){
    this.totalBalance = 0;
    if(this.supplierPaymentDetails.length != 0){
      var existingReceipts = this.receipts.filter(receipt =>
        this.supplierPaymentDetails.every(payment => payment.SourceTransNo !== receipt.SourceTransNo)
    );
    }else{
       existingReceipts = this.receipts;
    }

    existingReceipts.forEach(receipt => {
      const formattedDate = new Date(receipt.TransDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    
        receipt.ReceiptLabel =
            `${receipt.SourceTransNo} - ` +
            `${formattedDate} - ` + 
            `AmountPaid: ${Number(receipt.AmountPaid).toFixed(2)} - ` +
            `Balance: ${Number(receipt.Balance).toFixed(2)}`;
    
        this.totalBalance += Number(receipt.Balance);
    });
    this.freceipts = existingReceipts;

    var data = this.freceipts; 
    this.resetSearchBoxes();
    this.listData1 = new MatTableDataSource(data);
    this.listData1.paginator = this.paginator1;
    this.searchInput.nativeElement.focus();
  }

  displayPaymentDetails(){
    var data = this.supplierPaymentDetails; 
    this.totalAmount = this.supplierPaymentDetails.reduce((sum, x) => sum + +x.Amount, 0);
    this.selectedId = undefined;
    this.selectedData = undefined;
    this.listData2 = new MatTableDataSource(data);
    this.listData2.paginator = this.paginator2;
  }

  onChangeSupplier(data){
    this.getPayableReceipts();
  }

  async PopupQtyUI()
  { 
    if(this.transCode == null){
      await this.getTransCode();
    }

      if(this.amount){
        this.selectedReceipt = this.receipts[0];

        var data:any = {
          'selectedReceipt' : this.selectedReceipt,
        }
        this.payeeTransactionService.saveToSupplierPaymentHeaders(this.sourceTransNo, this.amount ?? 0, this.transCode, this.supplierId, this.selectedReceipt.Balance,data).subscribe({
          next: (res)=>{
            this.transCode = (res.supplierPaymentDetail ?? res.supplierPaymentDetails?.[0])?.TransNo ?? this.transCode;  // the first line gets the temporary TransNo
            this.notif.toastrSuccess(res.message);
            this.supplierPaymentDetails =res.supplierPaymentDetails; 
            this.displayPaymentDetails();
            this.displayReceipts();
            this.resetSearchBoxes();
          },
          error: (err)=>{
            this.notif.toastrError(err.error.message);
            this.sourceTransNo = undefined;
          }
        }); 

      }else{
        this.selectedReceipt  = this.freceipts.filter(x => x.SourceTransNo == this.sourceTransNo);
        this.selectedReceipt = this.selectedReceipt[0];
        this.saveToSupplierPaymentHeaders();
      }
  }

  async saveToSupplierPaymentHeaders(){
    if(this.transCode == null){
      await this.getTransCode();
    }
    var data:any = {
      'selectedReceipt' : this.selectedReceipt,
    }
    this.payeeTransactionService.saveToSupplierPaymentHeaders(this.sourceTransNo, this.amount ?? 0, this.transCode, this.supplierId, this.selectedReceipt.Balance,data).subscribe({
      next: (res)=>{
        this.transCode = (res.supplierPaymentDetail ?? res.supplierPaymentDetails?.[0])?.TransNo ?? this.transCode;  // the first line gets the temporary TransNo
        this.notif.toastrSuccess(res.message);
        this.supplierPaymentDetails = [ res.supplierPaymentDetail,...this.supplierPaymentDetails]; 
        this.displayPaymentDetails();
        this.displayReceipts();
        this.sourceTransNo = undefined;
        this.amount = undefined;
      },
      error: (err)=>{
        this.notif.toastrError(err.error.message);
        this.sourceTransNo = undefined;
      }
    }); 
  }

  async onClickEdit(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
      
      var supplierPaymentDetail:any = await firstValueFrom(this.supplierPaymentDetailsService.getSupplierPaymentDetailById(this.selectedData.id));
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '600px';
      dialogConfig.data = ([supplierPaymentDetail,'updatesupplierpaymenttransaction']);
      this.dialog.open(SupplierPaymentDetailUIComponent,dialogConfig).beforeClosed().subscribe(supplierPaymentDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(supplierPaymentDetail) ? supplierPaymentDetail[0] : supplierPaymentDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo

        const supplierPaymentDetailIndex = this.supplierPaymentDetails.findIndex(detail => detail.id === supplierPaymentDetail.id);
        if (supplierPaymentDetailIndex !== -1) {
          this.supplierPaymentDetails[supplierPaymentDetailIndex] = supplierPaymentDetail;  
        }
        this.displayPaymentDetails();
      });
  }

  onClickRemove(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notificationService.popupWarning("Delete Record",this.selectedData.SourceTransNo+ " will be remove. Continue?").then((result) => {
      if (result.value) {
        this.payeeTransactionService.deleteSupplierPaymentDetailById(this.selectedData.id).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.supplierPaymentDetails = this.supplierPaymentDetails.filter(x => x.id != this.selectedData.id);
              this.displayPaymentDetails();
              this.displayReceipts();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error.message);
            },
        });
      }
    });
  }

  onClickRemoveAll(){
    if(this.supplierPaymentDetails.length == 0)
      return this.notificationService.toastrWarning('Empty Transaction');
    
    this.notificationService.popupWarning("Delete Record","All Items will be REMOVED. Continue?").then((result) => {
      if (result.value) {
        this.payeeTransactionService.deleteSupplierPaymentDetailsByTransCode(this.transCode).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.supplierPaymentDetails = [];
              this.displayPaymentDetails();
              this.displayReceipts();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error.message);
            },
        });
      }
    });
  }

  onClickViewDetails(){
    if (!this.matTableService.checkNull(this.sourceTransNo)) return;
 
    if(this.selectedReceipt.SourceType.toLowerCase() == 'sales return'){
     this.printSaleReturnReceipt();
    }
    if(this.selectedReceipt.SourceType.toLowerCase() == 'receiving'){
     this.printReceivingReceipt();
    }
    if(this.selectedReceipt.SourceType.toLowerCase() == 'expenses'){
     this.printExpenseReceipt();
    }
    if(this.selectedReceipt.SourceType.toLowerCase() == 'adjustment'){
     this.printAdjustmentReceipt();
    }
    if(this.selectedReceipt.SourceType.toLowerCase() == 'old receipt'){
      this.printReceivableOldReceipt();
     }
    
  }

  async printSaleReturnReceipt(){
    var header = await firstValueFrom(this.saleReturnHeadersService.getSaleReturnHeaderByTransNo(this.sourceTransNo));
    var details = await firstValueFrom(this.saleReturnDetailsService.getSaleReturnDetailsByTransNo(this.sourceTransNo));
    var config = await firstValueFrom(this.saleReturnConfigService.getSaleReturnConfig());


    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsalereturndetails']));
    var data  = details.filter(x => x.RecordStatus == 'open');
    var title = 'SALES RETURN RECEIPT OF  - ' + header.TransNo ;
    
    this.printService.popupWindow(url, 'printsalereturndetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(header));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('SaleReturnConfig', JSON.stringify(config));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo',  this.sourceTransNo);
  }

  async printReceivingReceipt(){
     var header = await firstValueFrom(this.receivingHeadersService.getReceivingHeaderByTransNo(this.sourceTransNo));
     var details = await firstValueFrom(this.receivingDetailsService.getReceivingDetailsByTransNo(this.sourceTransNo));


     var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printreceivingdetails']));
     var data  = details.filter(x => x.RecordStatus == 'open');
     var title = 'RECEIVING RECEIPT OF  - ' + header.TransNo ;
     
     this.printService.popupWindow(url, 'printreceivingdetails', window, 800, 800);
     localStorage.setItem('Header', JSON.stringify(header));
     localStorage.setItem('Details', JSON.stringify(data));
     localStorage.setItem('Title', title);
     localStorage.setItem('TransNo',  this.sourceTransNo);
   }

   async printExpenseReceipt(){
     var header = await firstValueFrom(this.expenseHeadersService.getExpenseHeaderByTransNo(this.sourceTransNo));
     var details = await firstValueFrom(this.expenseDetailsService.getExpenseDetailsByTransNo(this.sourceTransNo));


     var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printexpensedetails']));
     var data  = details.filter(x => x.RecordStatus == 'open');
     var title = 'EXPENSE RECEIPT OF  - ' + header.TransNo ;
     
     this.printService.popupWindow(url, 'printexpensedetails', window, 800, 800);
     localStorage.setItem('Header', JSON.stringify(header));
     localStorage.setItem('Details', JSON.stringify(data));
     localStorage.setItem('Title', title);
     localStorage.setItem('TransNo',  this.sourceTransNo);
   }

  async printAdjustmentReceipt(){
    var header = await firstValueFrom(this.stockAdjustmentHeadersService.getStockAdjustmentHeaderByTransNo(this.sourceTransNo));
    var details = await firstValueFrom(this.stockAdjustmentDetailsService.getStockAdjustmentDetailsByTransNo(this.sourceTransNo));


    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printstockadjustmentdetails']));
    var data  =  details.filter(x =>x.RecordStatus == 'open');
    var title = 'STOCK ADJUSTMENT RECEIPT OF  - ' + header.TransNo ;
    
    this.printService.popupWindow(url, 'printstockadjustmentdetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(header));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo',  this.sourceTransNo);
  }

  async printReceivableOldReceipt(){
    var header = await firstValueFrom(this.payableOldReceiptsService.getPayableOldReceiptByTransNo(this.sourceTransNo));
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printpayableoldreceipt']));
    var title = 'PAYABALE OLD RECEIPT';
    this.printService.popupWindow(url, 'printpayableoldreceipt', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(header));
    localStorage.setItem('Title', title);
  }

  onClickOldReceipts(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '2000px';
    this.dialog.open(PayableOldReceiptsUIComponent,dialogConfig);
  }

  onClickViewReceipts(){
     if(!this.supplierId)
        return this.notificationService.toastrWarning('Please Select SupplierName');

      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1500px';
      dialogConfig.data         = ([this.transCode, this.supplierId,this.supplierPaymentDetails, 'supplierpaymenttransaction']);
      this.dialog.open(LoadReceiptsForSupplierPaymentUIComponent,dialogConfig).beforeClosed().subscribe(supplierPaymentDetails => {
      if (!this.transCode) this.transCode = (Array.isArray(supplierPaymentDetails) ? supplierPaymentDetails[0] : supplierPaymentDetails)?.TransNo ?? null;  // the first line gets the temporary TransNo
        this.supplierPaymentDetails = supplierPaymentDetails; 
        this.displayPaymentDetails();
      });
  }

 async onClickSaveTransaction(){
    if (!this.matTableService.CommonTransaction()) {
      return;
    }
     if(this.supplierPaymentDetails.length == 0)
          return this.notificationService.toastrWarning('Empty Transaction');

      this.supplierPaymentHeader  = await firstValueFrom(this.supplierPaymentHeadersService.getSupplierPaymentHeaderByTransCode(this.transCode));
      
        this.disableSave = true;
        const dialogConfig        = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus    = true;
        dialogConfig.width        = '1000px';
        dialogConfig.data = ([this.supplierPaymentHeader, this.transCode, this.totalAmount, 'savesupplierpaymenttransaction']);
        this.dialog.open(SupplierPaymentHeaderUIComponent,dialogConfig).beforeClosed().subscribe(async x => {
          if(x){
            await this.getTransCode();
            this.supplierPaymentHeader = null;
            this.supplierId = undefined;
            this.supplierPaymentDetails= [];
            await this.loadSuppliers();
            await this.getPaymentDetails();
            await this.getPayableReceipts();
          }
        });
  }

  updateElementPaymentDetail(event: any, id, Column){
   
    var Value = event.target.value ;
    if (!this.numbersService.isNumber(Value)) {
      return this.notif.toastrWarning(Value+' is not a number.');
    } 
    this.payeeTransactionService.updateElementSupplierPaymentDetail(id, Column, Value).subscribe({
      next:(res) =>{
        this.notif.toastrSuccess(res.message);

        //update supplierPaymentDetailsDisplay
        const supplierPaymentDetailIndex = this.supplierPaymentDetails.findIndex(detail => detail.id === id);
        if (supplierPaymentDetailIndex !== -1) {
          this.supplierPaymentDetails[supplierPaymentDetailIndex] = res.supplierPaymentDetail;  
        }
        this.displayPaymentDetails();
      },
      error:(err) => {
        this.notif.toastrError(err.error.message);
      },
    });
  }

  

  getRecord(data : any){
    this.selectedId = data.id;
    this.selectedData = data;
  }

   
  getRecord2(data : any){
    this.selectedId = data.id;
    this.selectedData = data;
  }

  getRecord1(data : any){
    this.sourceTransNo = data.SourceTransNo;
    this.selectedReceipt = data;

    const filtered = this.listData1?.filteredData;
    if (filtered) {
      const index = filtered.findIndex((item: any) => item.SourceTransNo === data.SourceTransNo);
      if (index !== -1) {
        this.selectedRowIndex = index;
      }
    }
  }

  getFirstRecordItem() {
    const data = this.listData1?.filteredData[0];
    if (data) {
      this.getRecord1(data);
    }
  }

  getFirstRecord() {
    const data = this.listData1?.filteredData[0];
    if (data) {
      const index = this.listData1.data.findIndex((x: any) => x.SourceTransNo === data.SourceTransNo);
      this.selectedRowIndex = index;
      this.getRecord1(data);

      setTimeout(() => {
          if (this.searchInput) {
            this.searchInput.nativeElement.blur();
          }
          const table = document.querySelector('mat-table') as HTMLElement;
          if (table) {
            table.focus();
          } else {
            console.warn('mat-table not found in DOM');
          }
        }, 100);
    }
  }

  onKeyDown(event: KeyboardEvent) {
    const data = this.listData1?.filteredData;
    if (!data || data.length === 0) return;

    if (event.key === 'ArrowDown') {
      this.selectedRowIndex = (this.selectedRowIndex + 1) % data.length;
      this.getRecord1(data[this.selectedRowIndex]);
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      this.selectedRowIndex = (this.selectedRowIndex - 1 + data.length) % data.length;
      this.getRecord1(data[this.selectedRowIndex]);
      event.preventDefault();
    }

    // Scroll logic (same as before)
    setTimeout(() => {
      const rowElems = this.rows?.toArray();
      const selectedRow = rowElems?.[this.selectedRowIndex];
      if (selectedRow) {
        const rowElement = selectedRow.nativeElement;
        const container = this.tableContainer.nativeElement;

        const rowTop = rowElement.offsetTop;
        const rowBottom = rowTop + rowElement.offsetHeight;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.clientHeight;

        if (rowTop < containerTop || rowBottom > containerBottom) {
          rowElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  }



  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  onContextMenu(event: MouseEvent, data: any, type) {
    this.rightClickType = type;
    if(data)
     if(type == 'saledetails'){
        this.getRecord2(data);
      }else{
        this.getRecord1(data);
      }
    
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { 'data': data };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
  }

  applyFilter(){
    this.matTableService.applyFilter(this.listData1, this.searchKey1);
  }

  clearSearch(){
    this.searchKey1 =  this.matTableService.clearSearch(this.listData1);
  }
  
  async applyFilter2(){
    this.matTableService.applyFilter(this.listData1, this.searchKey1);
    this.selectedReceipt = this.listData1.filteredData[0];

    if(!this.selectedReceipt || this.selectedReceipt == undefined){
      return this.notificationService.toastrWarning("Item Not Found.");
    }
    this.saveToSupplierPaymentHeaders();
  }

  resetSearchBoxes(){
    this.sourceTransNo = undefined;
    this.amount = undefined;
    this.selectedReceipt = undefined;
    this.searchKey1 = undefined;
    this.searchInput.nativeElement.focus();
    if(this.listData1?.filteredData){
      this.clearSearch();
    }
  }

  @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'F4') {
      event.preventDefault();
      this.onClickSaveTransaction();
    }
    
  }

}
