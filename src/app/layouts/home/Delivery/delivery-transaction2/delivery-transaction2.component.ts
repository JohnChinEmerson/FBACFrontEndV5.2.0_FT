import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { DeliveryConfigService } from 'src/app/services/Delivery/delivery-config.service';
import { DeliveryDetailsService } from 'src/app/services/Delivery/delivery-details.service';
import { DeliveryHeadersService } from 'src/app/services/Delivery/delivery-headers.service';
import { DeliveryTransactionService } from 'src/app/services/Delivery/delivery-transaction.service';
import { CustomersService } from 'src/app/services/Files/customers.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { SaleDetailsService } from 'src/app/services/Sales/sale-details.service';
import { SaleHeadersService } from 'src/app/services/Sales/sale-headers.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { DeliveryDetailUIComponent } from '../delivery-detail-ui/delivery-detail-ui.component';
import { DeliveryHeaderUIComponent } from '../delivery-header-ui/delivery-header-ui.component';
import { LoadReceiptsForDeliveryUIComponent } from '../load-receipts-for-delivery-ui/load-receipts-for-delivery-ui.component';
import { SaleConfigService } from 'src/app/services/Sales/sale-config.service';
import { PrintService } from 'src/app/services/print.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delivery-transaction2',
  templateUrl: './delivery-transaction2.component.html',
  styleUrls: ['./delivery-transaction2.component.css']
})
export class DeliveryTransaction2Component implements OnInit {
  sHeaders          : any=[];
  receiptNo         : string ="";
  selecteReceipt    : any;
  selectedRowIndex  : number = 0;

  deliveryDetails     : any=[];
  deliveryHeader      : any=[];

  listData1        : MatTableDataSource<any>;
  searchKey1       : string;
  isLoading1       : boolean = false;
  
  listData2        : MatTableDataSource<any>;
  searchKey2       : string;
  isLoading2       : boolean = false;

  rightClickType  : string = 'deliverydetails';
  transCode       : string  = null;
  totalAmount     : number = 0;
  selectedId      : string;
  selectedData    : any;
  deliveryConfig      : any=[];
  disableSave     : boolean = false;
  dateFrom        : any = new Date();
  dateTo          : any = new Date();
  withDate        : boolean = false;
  defaultColumns = ['TransDate','DeliveryDate','TransNo', 'CustomerName','TotalDue'];
  defaultColumns2: any[] = [
    'Qty',
    'UM',
    'ItemName',
    'Price',
    'Discount',
    'Amount',
    'QtyDelivered',
    'TobeDelivered',
  ];

  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['TotalDue','Qty', 'Price', 'Discount', 'Amount', 'QtyDelivered', 'TobeDelivered',],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate','DeliveryDate']
  };

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};

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
    {'Label'   : 'GO','Function'             : () => this.getReceipts(),'Disabled': true,}, 
  ];

  contextButtons2  =  [
    {'Label'   : 'Edit','Function'            : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Remove','Function'          : () => this.onClickRemove(),'Disabled': true,}, 
    {'Label'   : 'Remove All','Function'          : () => this.onClickRemoveAll(),'Disabled': true,}, 
  ];
  contextButtons1  =  [
    {'Label'   : 'View Details','Function'            : () => this.onClickViewDetails(),'Disabled': true,}, 
  ];
  constructor(
    private dialog          : MatDialog,
    private dateTimesService     : DateTimesService,
    private deliveryTransactionService      : DeliveryTransactionService,
    private deliveryHeadersService      : DeliveryHeadersService,
    private deliveryDetailsService      : DeliveryDetailsService,
    private deliveryConfigService     : DeliveryConfigService,
    private notif           : NotificationService,
    private auth_service    : AuthService,
    public toolBoxService : ToolBoxService,
    public matTableService : MatTableService,
    private numbersService : NumbersService,
    private saleHeadersService : SaleHeadersService,
    private saleDetailsService : SaleDetailsService,
    private saleConfigService : SaleConfigService, 
    private customersService : CustomersService,
    private homeTs : HomeComponent,
    private notificationService : NotificationService,
    private printService : PrintService,
    private router : Router,
  ) { }

  async ngOnInit(): Promise<void> {
     this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    this.getReceipts();
    this.getDeliveryConfig();
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.toggleButtons, this.toggleButtons2, this.contextButtons2, this.contextButtons1);
    this.getDeliveryDetails();
   
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async getReceipts(){
    this.isLoading1 = true;
    this.sHeaders = await firstValueFrom(this.saleHeadersService.getSaleHeadersToBeDeliveredByDateFromByDateToByWithDate(
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      this.withDate
    ));
    this.isLoading1 = false;
    this.displayReceipts();
  }

  displayReceipts(){
    var data = this.sHeaders; 
    this.resetSearchBoxes();
    this.listData1 = new MatTableDataSource(data);
    this.listData1.paginator = this.paginator1;
    this.searchInput.nativeElement.focus();
  }

  async getDeliveryConfig(){
    this.deliveryConfig = await firstValueFrom(this.deliveryConfigService.getDeliveryConfig());
  }

  async getTransCode(){
    this.transCode = await firstValueFrom(this.deliveryTransactionService.getDeliveryTransCode(this.auth_service.LoginId));
    var wLoginId = this.auth_service.LoginId+'-';
    this.transCode = (!this.transCode.includes(wLoginId)) ? this.auth_service.LoginId+'-'+this.transCode :this.transCode ;
  }

  async getDeliveryDetails(){
    this.isLoading2 = true;
    try{
      this.deliveryHeader = await firstValueFrom(this.deliveryHeadersService.getDeliveryHeaderByRecordStatusByInputBy('ongoing',this.auth_service.User));

      if (!this.deliveryHeader) {
        this.deliveryDetails = [];
        this.transCode = null;
        this.receiptNo = null;

      }
      else{
        this.deliveryDetails = await firstValueFrom(this.deliveryDetailsService.getDeliveryDetailsByTransCode(this.deliveryHeader.TransCode));
        this.transCode = this.deliveryHeader.TransCode;
        this.receiptNo = this.deliveryHeader.SaleNo;
      }
    }
    finally{
      this.isLoading2 = false;
      this.displayDeliveryDetails();
    }
  } 

  // async getDeliveryDetails(){
  //   if(this.transCode == null){
  //     await this.getTransCode();
  //   }
  //   this.isLoading2 = true;
  //   this.deliveryHeader  = await firstValueFrom(this.deliveryHeadersService.getDeliveryHeaderByTransCode(this.transCode));
  //   this.deliveryDetails =  await firstValueFrom(this.deliveryDetailsService.getDeliveryDetailsByTransCode(this.transCode));
  //   if(this.deliveryHeader){
  //     if(this.deliveryHeader.CustomerId){
  //       this.receiptNo = this.deliveryHeader.SaleNo;
  //     }
  //   }
    
  //   if(this.deliveryDetails)
  //     this.isLoading2 = false;
  //   this.displayDeliveryDetails();
  // } 


  displayDeliveryDetails(){
    var data = this.deliveryDetails; 
    this.totalAmount = this.deliveryDetails.reduce((sum, x) => sum + +x.Amount, 0);
    this.selectedId = undefined;
    this.selectedData = undefined;
    this.listData2 = new MatTableDataSource(data);
    this.listData2.paginator = this.paginator2;
  }


  getRecord2(data : any){
    this.selectedId = data.id;
    this.selectedData = data;
  }

  getRecord1(data : any){
    this.receiptNo = data.TransNo;
    this.selecteReceipt = data;

    const filtered = this.listData1?.filteredData;
    if (filtered) {
      const index = filtered.findIndex((item: any) => item.TransNo === data.TransNo);
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
      const index = this.listData1.data.findIndex((x: any) => x.TransNo === data.TransNo);
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


  async saveToDeliveryHeaders()
  {
    if(this.transCode == null){
      await this.getTransCode();
    }

    // this.selecteReceipt  = this.sHeaders.filter(x => x.TransNo == this.receiptNo);
    // this.selecteReceipt = this.selecteReceipt[0];
    this.deliveryTransactionService.saveToDeliveryHeaders(this.selecteReceipt.TransNo, this.transCode).subscribe({
      next: (res)=>{
        var receiptNo = this.selecteReceipt.TransNo;
        this.notif.toastrSuccess(res.message);
        this.deliveryDetails = res.deliveryDetails; 
        this.displayDeliveryDetails();
        this.resetSearchBoxes();
        this.receiptNo = receiptNo;
      },
      error: (err)=>{
        this.notif.toastrError(err.error.message);
        this.receiptNo = undefined;
      }
    }); 
  }
 
  async onClickSaveTransaction(){
          if (!this.matTableService.CommonTransaction()) {
      return;
    }
    if(this.deliveryDetails.length == 0)
      return this.notificationService.toastrWarning('Empty Transaction');

    var saleHeader:any = await firstValueFrom(this.saleHeadersService.getSaleHeaderByTransNo(this.receiptNo));
    var customer:any = await firstValueFrom(this.customersService.getCustomerByCustomerId(saleHeader.CustomerId));
   
    this.disableSave = true;
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data = ([this.deliveryHeader,saleHeader,  customer,this.transCode, this.totalAmount,'savedeliverytransaction']);
    this.dialog.open(DeliveryHeaderUIComponent,dialogConfig).beforeClosed().subscribe(async x => {
      if(x){
        await this.getTransCode();
        await this.getReceipts();
        this.deliveryHeader = null;
        this.deliveryDetails= [];
        this.receiptNo= undefined;
        this.displayDeliveryDetails();
      }
    });
    
  }

 async onClickEdit(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    
    var deliveryDetail:any = await firstValueFrom(this.deliveryDetailsService.getDeliveryDetailById(this.selectedData.id));
    var saleDetail:any = await firstValueFrom(this.saleDetailsService.getSaleDetailById(this.selectedData.SaleDetailId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = ([deliveryDetail,saleDetail, 'updatedeliverytransaction']);
    this.dialog.open(DeliveryDetailUIComponent,dialogConfig).beforeClosed().subscribe(deliveryDetail => {
      if(deliveryDetail){
        const deliveryDetailIndex = this.deliveryDetails.findIndex(detail => detail.id === deliveryDetail.id);
        if (deliveryDetailIndex !== -1) {
          this.deliveryDetails[deliveryDetailIndex] = deliveryDetail;  
        }
        this.displayDeliveryDetails();
      }
     
    });
  }

  onClickRemove(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notificationService.popupWarning("Delete Record",this.selectedData.ItemName+ " will be remove. Continue?").then((result) => {
      if (result.value) {
        this.deliveryTransactionService.deleteDeliveryDetailById(this.selectedData.id).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.deliveryDetails = this.deliveryDetails.filter(x => x.id != this.selectedData.id);
              this.displayDeliveryDetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error.message);
            },
        });
      }
    });
  }

  onClickRemoveAll(){
     if(this.deliveryDetails.length == 0)
      return this.notificationService.toastrWarning('Empty Transaction');

    this.notificationService.popupWarning("Delete Record","All Items will be REMOVED. Continue?").then((result) => {
      if (result.value) {
        this.deliveryTransactionService.deleteDeliveryDetailsByTransCode(this.transCode).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.deliveryDetails = [];
              this.displayDeliveryDetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error.message);
            },
        });
      }
    });
  }
  
  onClickSerialNos(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

  }

  onClickLoadReceipts(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1500px';
    dialogConfig.data         = ([this.transCode, this.receiptNo, this.dateFrom, this.dateTo, this.withDate]);
    this.dialog.open(LoadReceiptsForDeliveryUIComponent,dialogConfig).beforeClosed().subscribe(data => {
      if(data){
        this.receiptNo = data.receiptNo; 
        this.deliveryDetails = data.deliveryDetails; 
        this.displayDeliveryDetails();
      }
    });
  }

 onClickViewDetails(){
    if (!this.matTableService.checkNull(this.receiptNo)) return;
    this.printSaleReceipt();
  }

  async printSaleReceipt(){
    var sheader = await firstValueFrom(this.saleHeadersService.getSaleHeaderByTransNo(this.receiptNo));
    var sdetails = await firstValueFrom(this.saleDetailsService.getSaleDetailsByTransNo(this.receiptNo));
    var saleconfig = await firstValueFrom(this.saleConfigService.getSaleConfig());


    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsaledetails']));
    var data  = sdetails.filter(x => x.RecordStatus == 'open');
    var title = 'SALES INVOICE OF  - ' + sheader.TransNo ;
    
    this.printService.popupWindow(url, 'saleDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(sheader));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('SaleConfig', JSON.stringify(saleconfig));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', this.selectedData.TransNo);
  }


  updateElementDeliveryDetail(event: any, id, Column){
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

    this.deliveryTransactionService.updateElementDeliveryDetail(id, Column, Value).subscribe({
      next:(res) =>{
        this.notif.toastrSuccess(res.message);
        const deliveryDetailIndex = this.deliveryDetails.findIndex(detail => detail.id === id);
        if (deliveryDetailIndex !== -1) {
          this.deliveryDetails[deliveryDetailIndex] = res.deliveryDetail;  
        }
        this.displayDeliveryDetails();
      },
      error:(err) => {
        this.notif.toastrError(err.error.message);
        const deliveryDetailIndex = this.deliveryDetails.findIndex(detail => detail.id === id);
        if (deliveryDetailIndex !== -1) {
          this.deliveryDetails[deliveryDetailIndex] = err.error.deliveryDetail;  
        }
        this.displayDeliveryDetails();
      },
    });
  }

  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  onContextMenu(event: MouseEvent, data: any, type) {
    this.rightClickType = type;
    if(data)
     if(type == 'deliverydetails'){
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
    this.selecteReceipt = this.listData1.filteredData[0];

    if(!this.selecteReceipt || this.selecteReceipt == undefined){
      return this.notificationService.toastrWarning("Receipt Not Found.");
    }
    this.saveToDeliveryHeaders();
  }

  resetSearchBoxes(){
    this.receiptNo = undefined;
    this.selecteReceipt = undefined;
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
