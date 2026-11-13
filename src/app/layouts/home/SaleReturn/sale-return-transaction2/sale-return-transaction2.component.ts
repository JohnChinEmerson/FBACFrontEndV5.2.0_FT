import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { CustomersService } from 'src/app/services/Files/customers.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { SaleReturnConfigService } from 'src/app/services/SaleReturn/sale-return-config.service';
import { SaleReturnDetailsService } from 'src/app/services/SaleReturn/sale-return-details.service';
import { SaleReturnHeadersService } from 'src/app/services/SaleReturn/sale-return-headers.service';
import { SaleReturnTransactionService } from 'src/app/services/SaleReturn/sale-return-transaction.service';
import { SaleDetailsService } from 'src/app/services/Sales/sale-details.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { LoadItemsForSaleReturnUIComponent } from '../load-items-for-sale-return-ui/load-items-for-sale-return-ui.component';
import { SaleReturnDetailUIComponent } from '../sale-return-detail-ui/sale-return-detail-ui.component';
import { SaleReturnHeaderUIComponent } from '../sale-return-header-ui/sale-return-header-ui.component';
import { SaleReturnPendingTransactionsUIComponent } from '../sale-return-pending-transactions-ui/sale-return-pending-transactions-ui.component';
import { SRSerialNosUIComponent } from '../srserial-nos-ui/srserial-nos-ui.component';

@Component({
  selector: 'app-sale-return-transaction2',
  templateUrl: './sale-return-transaction2.component.html',
  styleUrls: ['./sale-return-transaction2.component.css']
})
export class SaleReturnTransaction2Component implements OnInit {
  saleDetails           : any=[];
  customers             : any=[];
  customerId            : string = 'CASH';
  saleDetailId          : string ="";
  selectedItem          : any;
  selectedRowIndex      : number = 0;
  selectedCustomer      : any;
  previousCustomerId    : any;  
  qty                   :  number;

  saleReturnDetails     : any=[];
  saleReturnHeader      : any=[];

  listData1             : MatTableDataSource<any>;
  searchKey1            : string;
  isLoading1            : boolean = false;
  
  listData2             : MatTableDataSource<any>;
  searchKey2            : string;
  isLoading2            : boolean = false;

  rightClickType        : string = 'salereturndetails';
  transCode             : string  = null;
  totalAmount           : number = 0;
  selectedId            : string;
  selectedData          : any;
  saleReturnConfig      : any=[];
  disableSave           : boolean = false;
  dateFrom              : any = new Date();
  dateTo                : any = new Date();
  withDate              : boolean = false;
  defaultColumns  = ['TransDate','TransNo', 'ItemName','UM','Qty','Price','Discount', 'Amount'];
  defaultColumns2: any[] = [
    'Qty',
    'UM',
    'ItemName',
    'Price',
    'Discount',
    'Amount',
    'Reason',
  ];

  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Qty','Price','Discount', 'Amount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate']
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
  toggleButtons     = [
    {'Label'   : 'SAVE TRANSACTION-F4','Function'    : () => this.onClickSaveTransaction(),'Disabled': true,}, 
  ];

  toggleButtons2     = [
    {'Label'   : 'GO','Function'             : () => this.getCustomerSaleDetails(),'Disabled': true,}, 
  ];
  contextButtons1 = [
  ];
  contextButtons2  =  [
    {'Label'   : 'Edit','Function'            : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Remove','Function'          : () => this.onClickRemove(),'Disabled': true,}, 
    {'Label'   : 'Remove All','Function'      : () => this.onClickRemoveAll(),'Disabled': true,}, 
    {'Label'   : 'SerialNos','Function'       : () => this.onClickSerialNos(),'Disabled': true,}, 
    {'Label'   : 'Save As Pending','Function' : () => this.onClickSaveAsPending(),'Disabled': true,}, 
    {'Label'   : 'Show Pending','Function'    : () => this.onClickShowPending(),'Disabled': true,}, 
  ];
  constructor(
    private dialog          : MatDialog,
    private saleDetailsService    : SaleDetailsService,
    private customersService     : CustomersService,
    private saleReturnTransactionService      : SaleReturnTransactionService,
    private saleReturnHeadersService      : SaleReturnHeadersService,
    private saleReturnDetailsService      : SaleReturnDetailsService,
    private saleReturnConfigService     : SaleReturnConfigService,
    private notif           : NotificationService,
    private auth_service    : AuthService,
    private toolBoxService : ToolBoxService,
    public matTableService : MatTableService,
    private numbersService : NumbersService,
    private dateTimesService : DateTimesService,
    private stringHelperService : StringHelperService,
    private homeTs : HomeComponent,
    private notificationService : NotificationService,
    private viewContainerRef : ViewContainerRef,
    
  ) { }

  async ngOnInit(): Promise<void> {
     this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    this.getCustomers();
    this.getSaleReturnConfig();
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.toggleButtons, this.toggleButtons2, this.contextButtons2, null);
    this.getSaleReturnDetails();
   
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async getCustomers(){
    this.customers = await firstValueFrom(this.customersService.getCBOCustomers());
    this.customers.push(this.stringHelperService.withCASHCustomerCBO());
  }

  async getSaleReturnConfig(){
    this.saleReturnConfig = await firstValueFrom(this.saleReturnConfigService.getSaleReturnConfig());
  }

  async getTransCode(){
    this.transCode = null;   // Desktop: no number until the first line is saved (it then gets its temporary TransNo)
  }

  async getSaleReturnDetails(){
    this.isLoading2 = true;
    try{
      this.saleReturnHeader = await firstValueFrom(this.saleReturnHeadersService.getSaleReturnHeaderByRecordStatusByInputBy('ongoing',this.auth_service.User));

      if (!this.saleReturnHeader) {
        this.saleReturnDetails = [];
        this.customerId = 'CASH';
        this.transCode = null;
      }
      else{
        this.saleReturnDetails = await firstValueFrom(this.saleReturnDetailsService.getSaleReturnDetailsByTransCode(this.saleReturnHeader.TransCode));
        this.customerId = this.saleReturnHeader.CustomerId;
        this.transCode = this.saleReturnHeader.TransCode;
      }
    }
    finally{
      this.isLoading2 = false;
      this.displaySaleReturnDetails();
    }
  } 

  // async getSaleReturnDetails(){
  //   if(this.transCode == null){
  //     await this.getTransCode();
  //   }
  //   this.isLoading2 = true;
  //   this.saleReturnHeader  = await firstValueFrom(this.saleReturnHeadersService.getSaleReturnHeaderByTransCode(this.transCode));
  //   this.saleReturnDetails =  await firstValueFrom(this.saleReturnDetailsService.getSaleReturnDetailsByTransCode(this.transCode));

  //   if(this.saleReturnHeader){
  //     if(this.saleReturnHeader.CustomerId){
  //       if(this.customerId  != 'CASH'){
  //         this.customerId = this.customerId
  //       }else{
  //         this.customerId = this.saleReturnHeader.CustomerId
  //       }
  //     }
  //   }else{
  //     this.customerId = 'CASH';
  //   }
    
  //   if(this.saleReturnDetails)
  //     this.isLoading2 = false;
  //   this.displaySaleReturnDetails();
  // } 


  async getCustomerSaleDetails(){
    this.isLoading1 = true;
    this.saleDetails = await firstValueFrom(this.saleDetailsService.getSaleDetailsForSalesReturnByDateFromByDateToByCustomerIdWDate(
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      this.customerId,
      this.withDate
    ));

    if(this.saleReturnDetails.length != 0){
        this.saleDetails= this.saleDetails.filter(y =>
          this.saleReturnDetails.every(x => x.SaleDetailId !== y.id)
      );
    }
    this.isLoading1 = false;
    this.displaySaleDetails();
  }

  displaySaleDetails(){
    var data = this.saleDetails; 
    this.resetSearchBoxes();
    this.listData1 = new MatTableDataSource(data);
    this.listData1.paginator = this.paginator1;
    this.searchInput.nativeElement.focus();
  }


  displaySaleReturnDetails(){
    var data = this.saleReturnDetails; 
    this.totalAmount = this.saleReturnDetails.reduce((sum, x) => sum + +x.Amount, 0);
    this.selectedId = undefined;
    this.selectedData = undefined;
    this.listData2 = new MatTableDataSource(data);
    this.listData2.paginator = this.paginator2;

    this.getCustomerSaleDetails();
  }

  
  getRecord2(data : any){
    this.selectedId = data.id;
    this.selectedData = data;
  }

  getRecord1(data : any){
    this.saleDetailId = data.id;
    this.selectedItem = data;

    const filtered = this.listData1?.filteredData;
    if (filtered) {
      const index = filtered.findIndex((item: any) => item.id === data.id);
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
      const index = this.listData1.data.findIndex((x: any) => x.id === data.id);
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

  async onFocusQty(){
    if(this.transCode == null){
      await this.getTransCode();
    }
    this.selectedItem.TransCode = this.transCode;
    this.selectedItem.CustomerId = this.customerId;

    this.saveToSaleReturnHeaders();
  }

  saveToSaleReturnHeaders(){
    this.saleReturnTransactionService.saveToSaleReturnHeaders(this.selectedItem.id, this.transCode, this.customerId, this.selectedItem.Price, 'open').subscribe({
      next: (res)=>{
        this.transCode = res.saleReturnDetail?.TransNo ?? this.transCode;  // the first line gets the temporary TransNo
        this.notif.toastrSuccess(res.message);
        this.saleReturnDetails = [ res.saleReturnDetail,...this.saleReturnDetails]; 
        this.displaySaleReturnDetails();
        this.resetSearchBoxes();
      },
      error: (err)=>{
        this.notif.toastrError(err.error.message);
        this.saleDetailId = undefined;
      }
    }); 
  }

  async PopupQtyUI(saleDetail)
  {
    saleDetail.TransCode = this.transCode;
    saleDetail.CustomerId = this.customerId;
    
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = (['',saleDetail, 'additemsalereturntransaction']);
    this.dialog.open(SaleReturnDetailUIComponent,dialogConfig).beforeClosed().subscribe(saleReturnDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(saleReturnDetail) ? saleReturnDetail[0] : saleReturnDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo
      if(saleReturnDetail){
        this.transCode = saleReturnDetail.TransNo ?? this.transCode;  // the first line gets the temporary TransNo
        this.saleReturnDetails = [ saleReturnDetail,...this.saleReturnDetails]; 
        this.displaySaleReturnDetails();
        this.resetSearchBoxes();
      }
    });
  }
  
  async onClickSaveTransaction(){
    if (!this.matTableService.CommonTransaction()) {
      return;
    }
    if(this.saleReturnDetails.length == 0)
      return this.notificationService.toastrWarning('Empty Transaction');

    var customer:any = await firstValueFrom(this.customersService.getCustomerByCustomerId(this.customerId));
    var refundable:any = await firstValueFrom(this.saleReturnHeadersService.computeRefundable(this.transCode));
    this.disableSave = true;
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data = ([customer,this.saleReturnHeader, this.transCode, this.totalAmount, 'open','savesalereturntransaction', refundable]);
    this.dialog.open(SaleReturnHeaderUIComponent,dialogConfig).beforeClosed().subscribe(async x => {
      if(x){
        await this.getTransCode();
        this.saleReturnHeader = null;
        this.customerId = 'CASH';
        this.saleReturnDetails= [];
        this.displaySaleReturnDetails();
        this.resetSearchBoxes();
      }
    });
    
  }

 async onClickEdit(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    
    var saleReturnDetail:any = await firstValueFrom(this.saleReturnDetailsService.getSaleReturnDetailById(this.selectedData.id));
    var saleDetail:any = await firstValueFrom(this.saleDetailsService.getSaleDetailById(this.selectedData.SaleDetailId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = ([saleReturnDetail,saleDetail, 'updatesalereturntransaction']);
    this.dialog.open(SaleReturnDetailUIComponent,dialogConfig).beforeClosed().subscribe(saleReturnDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(saleReturnDetail) ? saleReturnDetail[0] : saleReturnDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo
      if(saleReturnDetail){
        const saleReturnDetailIndex = this.saleReturnDetails.findIndex(detail => detail.id === saleReturnDetail.id);
        if (saleReturnDetailIndex !== -1) {
          this.saleReturnDetails[saleReturnDetailIndex] = saleReturnDetail;  
        }
        this.displaySaleReturnDetails();
      }
      
    });
  }

  onClickRemove(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notificationService.popupWarning("Delete Record",this.selectedData.ItemName+ " will be remove. Continue?").then((result) => {
      if (result.value) {
        this.saleReturnTransactionService.deleteSaleReturnDetailById(this.selectedData.id).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.saleReturnDetails = this.saleReturnDetails.filter(x => x.id != this.selectedData.id);
              this.displaySaleReturnDetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error.message);
            },
        });
      }
    });
  }

  onClickRemoveAll(){
    if(this.saleReturnDetails.length == 0)
      return this.notificationService.toastrWarning('Empty Transaction');

    this.notificationService.popupWarning("Delete Record","All Items will be REMOVED. Continue?").then((result) => {
      if (result.value) {
        this.saleReturnTransactionService.deleteSaleReturnDetailsByTransCode(this.transCode).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.saleReturnDetails = [];
              this.displaySaleReturnDetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error.message);
            },
        });
      }
    });
  }
  
  async onClickSerialNos(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    var sRDetail:any = await firstValueFrom(this.saleReturnDetailsService.getSaleReturnDetailById(this.selectedId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data         = ([sRDetail, 'salereturntransaction', '']);
    dialogConfig.viewContainerRef = this.viewContainerRef; 
    this.dialog.open(SRSerialNosUIComponent,dialogConfig).beforeClosed().subscribe(sRDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(sRDetail) ? sRDetail[0] : sRDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo
      this.getSaleReturnDetails();
    });
  }

  onClickSaveAsPending(){
    if(this.saleReturnDetails.length == 0)
      return this.notificationService.toastrWarning('Empty Transaction');

    this.notificationService.popupWarning("Pending SaleReturn","All Items will be save as pending. Continue?").then((result) => {
      if (result.value) {
        this.saleReturnTransactionService.saveAsPendingSaleReturnByTransCode(this.transCode).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.transCode = null;
              this.saleReturnHeader = null;   // Save As Pending: start a new transaction (the saved one stays in Show Pending, Desktop)
              this.saleReturnDetails = [];
              this.displaySaleReturnDetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
      }
    });
  }

  onClickShowPending(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data        = this.transCode;
     dialogConfig.viewContainerRef = this.viewContainerRef; 
    this.dialog.open(SaleReturnPendingTransactionsUIComponent,dialogConfig).beforeClosed().subscribe(res => {
      if(res){
        this.transCode = res.transCode; 
        this.saleReturnDetails = res.saleReturnDetails; 
        this.saleReturnHeader = res.saleReturnHeader; 
        this.customerId = res.saleReturnHeader.CustomerId; 
        this.displaySaleReturnDetails();
      }
    });
  }




  onClickLoadItems(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1500px';
    dialogConfig.data         = ([this.transCode, this.customerId,this.saleReturnDetails, 'salereturntransaction']);
    this.dialog.open(LoadItemsForSaleReturnUIComponent,dialogConfig).beforeClosed().subscribe(saleReturnDetails => {
      if (!this.transCode) this.transCode = (Array.isArray(saleReturnDetails) ? saleReturnDetails[0] : saleReturnDetails)?.TransNo ?? null;  // the first line gets the temporary TransNo
      this.saleReturnDetails = saleReturnDetails; 
      this.displaySaleReturnDetails();
    });
  }


  updateElementSaleReturnDetail(event: any, id, Column){
    if(Column == 'DiscountType'){
      var Value = event.checked;
      if(Value == true){
        Value = 'percent';
      }else{
        Value = 'amount';
      }
    }else{
      var Value = event.target.value ;
      if (!this.numbersService.isNumber(Value)) {
        return this.notif.toastrWarning(Value+' is not a number.');
      } 
    }
    this.saleReturnTransactionService.updateElementSaleReturnDetail(id, Column, Value).subscribe({
      next:(res) =>{
        this.notif.toastrSuccess(res.message);

        //update saleReturnDetailsDisplay
        const saleReturnDetailIndex = this.saleReturnDetails.findIndex(detail => detail.id === id);
        if (saleReturnDetailIndex !== -1) {
          this.saleReturnDetails[saleReturnDetailIndex] = res.saleReturnDetail;  
        }
        this.displaySaleReturnDetails();
      },
      error:(err) => {
        this.notif.toastrError(err.error.message);
      },
    });
  }


  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  onContextMenu(event: MouseEvent, data: any, type) {
    this.rightClickType = type;
    if(data)
     if(type == 'salereturndetails'){
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
    this.selectedItem = this.listData1.filteredData[0];

    if(!this.selectedItem || this.selectedItem == undefined){
      this.getFirstRecord();
      return this.notificationService.toastrWarning("Item Not Found.");
    }
    this.onFocusQty();
  }

  resetSearchBoxes(){
    this.saleDetailId = undefined;
    this.qty = undefined;
    this.selectedItem = undefined;
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
  getTotal(column){
    let sum = 0;
    this.listData2?.filteredData.forEach(x => {
            sum += +x[column];
    });
    return sum;
  }
}
