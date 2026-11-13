import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { CustomersService } from 'src/app/services/Files/customers.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { PrintService } from 'src/app/services/print.service';
import { PaymentDetailsService } from 'src/app/services/Receivables/payment-details.service';
import { PaymentHeadersService } from 'src/app/services/Receivables/payment-headers.service';
import { PaymentTransactionService } from 'src/app/services/Receivables/payment-transaction.service';
import { ReceivableOldReceiptsService } from 'src/app/services/Receivables/receivable-old-receipts.service';
import { ReceivableStatementsService } from 'src/app/services/Receivables/receivable-statements.service';
import { SaleConfigService } from 'src/app/services/Sales/sale-config.service';
import { SaleDetailsService } from 'src/app/services/Sales/sale-details.service';
import { SaleHeadersService } from 'src/app/services/Sales/sale-headers.service';
import { StockAdjustmentDetailsService } from 'src/app/services/StockAdjustments/stock-adjustment-details.service';
import { StockAdjustmentHeadersService } from 'src/app/services/StockAdjustments/stock-adjustment-headers.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { LoadReceiptsForPaymentUIComponent } from '../load-receipts-for-payment-ui/load-receipts-for-payment-ui.component';
import { PaymentDetailUIComponent } from '../payment-detail-ui/payment-detail-ui.component';
import { PaymentHeaderUIComponent } from '../payment-header-ui/payment-header-ui.component';
import { ReceivableOldReceiptsUIComponent } from '../receivable-old-receipts-ui/receivable-old-receipts-ui.component';

@Component({
  selector: 'app-payment-transaction2',
  templateUrl: './payment-transaction2.component.html',
  styleUrls: ['./payment-transaction2.component.css']
})
export class PaymentTransaction2Component implements OnInit {
  receipts            : any=[];
  freceipts           : any=[];
  customers           : any=[];
  customerId          : string;
  sourceTransNo       : any;
  selectedReceipt     : any;
  selectedRowIndex    : number = 0;
  selectedCustomer    : any;

  paymentDetails     : any=[];
  paymentHeader      : any=[];

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
      private paymentTransactionService          : PaymentTransactionService,
      private paymentHeadersService          : PaymentHeadersService,
      private paymentDetailsService          : PaymentDetailsService,
      private receivableStatementsService          : ReceivableStatementsService,
      private notif           : NotificationService,
      private auth_service    : AuthService,
      private toolBoxService : ToolBoxService,
      public matTableService : MatTableService,
      private numbersService : NumbersService,
      private dateTimesService : DateTimesService,
      private stringHelperService : StringHelperService,
      private homeTs : HomeComponent,
      private notificationService : NotificationService,
      private customersService : CustomersService,
      private saleHeadersService : SaleHeadersService,
      private saleDetailsService : SaleDetailsService,
      private saleConfigService : SaleConfigService,
      private stockAdjustmentHeadersService : StockAdjustmentHeadersService,
      private stockAdjustmentDetailsService : StockAdjustmentDetailsService,
      private receivableOldReceiptsService : ReceivableOldReceiptsService,
      private router : Router, 
      private printService : PrintService, 
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.contextButtons1, this.contextButtons2,this.toggleButtons, null);
    await this.loadCustomers();
    await this.getPaymentDetails();
    await this.getReceivableReceipts();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async loadCustomers(){
    this.customers = await firstValueFrom(this.receivableStatementsService.loadCustomerWithAllWithBalance(false, true));
  }
  async getPaymentDetails(){
    this.isLoading2 = true;
    try{
      this.paymentHeader = await firstValueFrom(this.paymentHeadersService.getPaymentHeaderByRecordStatusByInputBy('ongoing',this.auth_service.User));

      if (!this.paymentHeader) {
        this.paymentDetails = [];
        this.customerId = undefined;
        this.transCode = null;
      }
      else{
        this.paymentDetails = await firstValueFrom(this.paymentDetailsService.getPaymentDetailsByTransCode(this.paymentHeader.TransCode));
        this.customerId = this.paymentHeader.CustomerId;
        this.customerId = this.paymentHeader.CustomerId;
        var selectedCustomer:any = this.customers.filter(x => x.CustomerId == this.customerId);
        this.onChangeCustomer(selectedCustomer[0]);
        this.transCode = this.paymentHeader.TransCode;
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
  //   this.paymentHeader  = await firstValueFrom(this.paymentHeadersService.getPaymentHeaderByTransCode(this.transCode));
  //   this.paymentDetails =  await firstValueFrom(this.paymentDetailsService.getPaymentDetailsByTransCode(this.transCode));
  //   if(this.paymentHeader){
  //     if(this.paymentHeader.CustomerId){
  //       this.customerId = this.paymentHeader.CustomerId;
  //       var selectedCustomer:any = this.customers.filter(x => x.CustomerId == this.customerId);
  //       this.onChangeCustomer(selectedCustomer[0]);
  //     }
  //   }
    
  //   if(this.paymentDetails)
  //     this.isLoading2 = false;
  //   this.displayPaymentDetails();
  // }

  async getTransCode(){
    this.transCode = null;   // Desktop: no number until the first line is saved (it then gets its temporary TransNo)
  }

  async getReceivableReceipts()
  {
    this.isLoading1 = true;
    if (this.customerId)
      this.receipts = await firstValueFrom(this.receivableStatementsService.getReceiptsByCustomerId(this.customerId));
    else
    this.receipts = [];

    this.isLoading1 = false;
    this.displayReceipts();
  }

  displayReceipts(){
    this.totalBalance = 0;
    if(this.paymentDetails.length != 0){
      var existingReceipts = this.receipts.filter(receipt =>
        this.paymentDetails.every(payment => payment.SourceTransNo !== receipt.SourceTransNo)
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
    var data = this.paymentDetails; 
    this.totalAmount = this.paymentDetails.reduce((sum, x) => sum + +x.Amount, 0);
    this.selectedId = undefined;
    this.selectedData = undefined;
    this.listData2 = new MatTableDataSource(data);
    this.listData2.paginator = this.paginator2;
  }

  onChangeCustomer(data){
    this.getReceivableReceipts();
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
      this.paymentTransactionService.saveToPaymentHeaders(this.sourceTransNo, this.amount ?? 0, this.transCode, this.customerId, this.selectedReceipt.Balance,data).subscribe({
        next: (res)=>{
          this.transCode = (res.paymentDetail ?? res.paymentDetails?.[0])?.TransNo ?? this.transCode;  // the first line gets the temporary TransNo
          this.notif.toastrSuccess(res.message);
          this.paymentDetails =res.paymentDetails; 
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

    }else{
      this.selectedReceipt  = this.freceipts.filter(x => x.SourceTransNo == this.sourceTransNo);
      this.selectedReceipt = this.selectedReceipt[0];
      this.saveToPaymentHeaders();
    }
  }

  async saveToPaymentHeaders(){
    if(this.transCode == null){
      await this.getTransCode();
    }


    var data:any = {
      'selectedReceipt' : this.selectedReceipt,
    }

    this.paymentTransactionService.saveToPaymentHeaders(this.sourceTransNo, this.amount ?? 0, this.transCode, this.customerId, this.selectedReceipt.Balance,data).subscribe({
      next: (res)=>{
        this.transCode = (res.paymentDetail ?? res.paymentDetails?.[0])?.TransNo ?? this.transCode;  // the first line gets the temporary TransNo
        this.notif.toastrSuccess(res.message);
        this.paymentDetails = [ res.paymentDetail,...this.paymentDetails]; 
        this.displayPaymentDetails();
        this.displayReceipts();
        this.resetSearchBoxes();
      },
      error: (err)=>{
        this.notif.toastrError(err.error.message);
        this.sourceTransNo = undefined;
      }
    }); 
  }

  async onClickEdit(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
      
      var paymentDetail:any = await firstValueFrom(this.paymentDetailsService.getPaymentDetailById(this.selectedData.id));
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '600px';
      dialogConfig.data = ([paymentDetail,'updatepaymenttransaction']);
      this.dialog.open(PaymentDetailUIComponent,dialogConfig).beforeClosed().subscribe(paymentDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(paymentDetail) ? paymentDetail[0] : paymentDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo

        const paymentDetailIndex = this.paymentDetails.findIndex(detail => detail.id === paymentDetail.id);
        if (paymentDetailIndex !== -1) {
          this.paymentDetails[paymentDetailIndex] = paymentDetail;  
        }
        this.displayPaymentDetails();
      });
  }

  onClickRemove(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notificationService.popupWarning("Delete Record",this.selectedData.SourceTransNo+ " will be remove. Continue?").then((result) => {
      if (result.value) {
        this.paymentTransactionService.deletePaymentDetailById(this.selectedData.id).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.paymentDetails = this.paymentDetails.filter(x => x.id != this.selectedData.id);
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
    if(this.paymentDetails.length == 0)
      return this.notificationService.toastrWarning('Empty Transaction');

    this.notificationService.popupWarning("Delete Record","All Items will be REMOVED. Continue?").then((result) => {
      if (result.value) {
        this.paymentTransactionService.deletePaymentDetailsByTransCode(this.transCode).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.paymentDetails = [];
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

    if(this.selectedReceipt.SourceType.toLowerCase() == 'sales'){
     this.printSaleReceipt();
    }
    if(this.selectedReceipt.SourceType.toLowerCase() == 'adjustment'){
     this.printAdjustmentReceipt();
    }
    if(this.selectedReceipt.SourceType.toLowerCase() == 'old receipt'){
      this.printReceivableOldReceipt();
     }
  }

  async printSaleReceipt(){
    var header = await firstValueFrom(this.saleHeadersService.getSaleHeaderByTransNo(this.sourceTransNo));
    var details = await firstValueFrom(this.saleDetailsService.getSaleDetailsByTransNo(this.sourceTransNo));
    var config = await firstValueFrom(this.saleConfigService.getSaleConfig());


    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsaledetails']));
    var data  = details.filter(x => x.RecordStatus == 'open');
    var title = 'SALES INVOICE OF  - ' + header.TransNo ;
    
    this.printService.popupWindow(url, 'saleDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(header));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('SaleConfig', JSON.stringify(config));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', this.sourceTransNo);
  }
 
  async printAdjustmentReceipt(){
    var header = await firstValueFrom(this.stockAdjustmentHeadersService.getStockAdjustmentHeaderByTransNo(this.sourceTransNo));
    var details = await firstValueFrom(this.stockAdjustmentDetailsService.getStockAdjustmentDetailsByTransNo(this.sourceTransNo));


    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printstockadjustmentdetails']));
    var data  = details.filter(x =>x.RecordStatus == 'open');
    var title = 'STOCK ADJUSTMENT RECEIPT OF  - ' + header.TransNo ;
    
    this.printService.popupWindow(url, 'printstockadjustmentdetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(header));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', this.sourceTransNo);
  }

  async printReceivableOldReceipt(){
    var header = await firstValueFrom(this.receivableOldReceiptsService.getReceivableOldReceiptByTransNo(this.sourceTransNo));
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printreceivableoldreceipt']));
    var title = 'RECEIVABLE OLD RECEIPT';
    this.printService.popupWindow(url, 'printreceivableoldreceipt', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(header));
    localStorage.setItem('Title', title);
  }

  onClickOldReceipts(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '2000px';
    this.dialog.open(ReceivableOldReceiptsUIComponent,dialogConfig);
  }

  onClickViewReceipts(){
    if(!this.customerId)
      return this.notificationService.toastrWarning('Please Select CustomerName');

     const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1500px';
      dialogConfig.data         = ([this.transCode, this.customerId,this.paymentDetails, 'paymenttransaction']);
      this.dialog.open(LoadReceiptsForPaymentUIComponent,dialogConfig).beforeClosed().subscribe(paymentDetails => {
      if (!this.transCode) this.transCode = (Array.isArray(paymentDetails) ? paymentDetails[0] : paymentDetails)?.TransNo ?? null;  // the first line gets the temporary TransNo
        this.paymentDetails = paymentDetails; 
        this.displayPaymentDetails();
      });

  }

 async onClickSaveTransaction(){
    if (!this.matTableService.CommonTransaction()) {
      return;
    }
     if(this.paymentDetails.length == 0)
          return this.notificationService.toastrWarning('Empty Transaction');

      this.paymentHeader  = await firstValueFrom(this.paymentHeadersService.getPaymentHeaderByTransCode(this.transCode));
      var customer:any = await firstValueFrom(this.customersService.getCustomerByCustomerId(this.customerId));
      
        this.disableSave = true;
        const dialogConfig        = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus    = true;
        dialogConfig.width        = '1000px';
        dialogConfig.data = ([this.paymentHeader, this.transCode, this.totalAmount, 'savepaymenttransaction', customer]);
        this.dialog.open(PaymentHeaderUIComponent,dialogConfig).beforeClosed().subscribe(async x => {
          if(x){
            await this.getTransCode();
            this.paymentHeader = null;
            this.customerId = undefined;
            this.paymentDetails= [];
            await this.loadCustomers();
            await this.getPaymentDetails();
            await this.getReceivableReceipts();
          }
        });
  }

  updateElementPaymentDetail(event: any, id, Column){
   
    var Value = event.target.value ;
    if (!this.numbersService.isNumber(Value)) {
      return this.notif.toastrWarning(Value+' is not a number.');
    } 
    this.paymentTransactionService.updateElementPaymentDetail(id, Column, Value).subscribe({
      next:(res) =>{
        this.notif.toastrSuccess(res.message);

        //update paymentDetailsDisplay
        const paymentDetailIndex = this.paymentDetails.findIndex(detail => detail.id === id);
        if (paymentDetailIndex !== -1) {
          this.paymentDetails[paymentDetailIndex] = res.paymentDetail;  
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
    this.saveToPaymentHeaders();
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
