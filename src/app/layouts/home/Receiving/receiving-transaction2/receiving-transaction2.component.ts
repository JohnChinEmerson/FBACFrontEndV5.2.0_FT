import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { SuppliersService } from 'src/app/services/Files/suppliers.service';
import { StockSuppliersService } from 'src/app/services/Inventory/stock-suppliers.service';
import { StocksService } from 'src/app/services/Inventory/stocks.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { POHeadersService } from 'src/app/services/Purchasing/poheaders.service';
import { ReceivingConfigAccessRightsService } from 'src/app/services/Receiving/receiving-config-access-rights.service';
import { ReceivingDetailsService } from 'src/app/services/Receiving/receiving-details.service';
import { ReceivingHeadersService } from 'src/app/services/Receiving/receiving-headers.service';
import { ReceivingTransactionService } from 'src/app/services/Receiving/receiving-transaction.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { ItemUIComponent } from '../../Files/item-ui/item-ui.component';
import { SupplierUIComponent } from '../../Files/supplier-ui/supplier-ui.component';
import { HomeComponent } from '../../home.component';
import { POForDeliveryUIComponent } from '../../Purchasing/pofor-delivery-ui/pofor-delivery-ui.component';
import { ReceivingDetailUIComponent } from '../receiving-detail-ui/receiving-detail-ui.component';
import { ReceivingHeaderUIComponent } from '../receiving-header-ui/receiving-header-ui.component';
import { ReceivingPendingTransactionsUIComponent } from '../receiving-pending-transactions-ui/receiving-pending-transactions-ui.component';
import { BarcodeUIComponent } from '../../Files/barcode-ui/barcode-ui.component';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { RRSerialNosUIComponent } from '../rrserial-nos-ui/rrserial-nos-ui.component';

@Component({
  selector: 'app-receiving-transaction2',
  templateUrl: './receiving-transaction2.component.html',
  styleUrls: ['./receiving-transaction2.component.css']
})
export class ReceivingTransaction2Component implements OnInit {

  stocks            : any=[];
  filteredStocks    : any=[];
  suppliers         : any=[];
  supplierId        : string = 'CASH';
  itemId            : string ="";
  selectedItem      : any;
  selectedRowIndex  : number = 0;
  selectedSupplier  : any;
  previousSupplierId: any;  
  qty               :  number;

  receivingDetails      : any=[];
  receivingHeader       : any=[];
  poHeader              : any=[];

 listData1        : MatTableDataSource<any>;
  searchKey1       : string;
  isLoading1       : boolean = false;
  
  listData2        : MatTableDataSource<any>;
  searchKey2       : string;
  isLoading2       : boolean = false;

  rightClickType  : string = 'podetails';
  transCode       : string  = null;
  totalAmount     : number = 0;
  selectedId      : string;
  selectedData    : any;
  poConfig        : any=[];
  disableSave     : boolean = false;
  isColorOutOfStock : boolean = true;
  receivingConfigAccessright      : any=[];
  recordStatus : string = 'open';
  defaultColumns  = ['ItemId', 'ItemName','UM','Cost','Available'];
  defaultColumns2: any[] = [
    'Qty',
    'UM',
    'ItemName',
    'Cost',
    'Discount',
    'DiscountValue',
    'Amount',
    'ExpiryDate',
    'BatchLotNo',
  ];
  defaultColumns3: any[] = [
    'Qty',
    'UM',
    'ItemName',
    'ExpiryDate',
    'BatchLotNo',
  ];

  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Cost','Available', 'Qty', 'Discount', 'DiscountValue', 'Amount',],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};
  columnTypeMap3: { [key: string]: string } = {};

  @ViewChild('qtyInput') qtyInputRef: ElementRef;
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('dataTable', { static: false }) dataTable!: ElementRef;
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;
  @ViewChildren('rowElement', { read: ElementRef }) rows!: QueryList<ElementRef>;
  @ViewChild('tableContainer', { static: true }) tableContainer!: ElementRef;
  toolButtons     = [
    {'Label'   : 'New Supplier','Function'             : () => this.onClickNewSupplier(),'Disabled': true,}, 
  ];

  toolButtons2     = [
    {'Label'   : 'New Item','Function'             : () => this.onClickNewItem(),'Disabled': true,}, 
  ];

  toggleButtons     = [
    {'Label'   : 'SAVE TRANSACTION-F4','Function'    : () => this.onClickSaveTransaction(),'Disabled': true,}, 
  ];

  toggleButtons2     = [
    {'Label'   : 'LOAD ITEMS-F1','Function'          : () => this.onClickLoadItems(),'Disabled': true,}, 
    {'Label'   : 'SUPPLIER ITEMS-F2','Function'          : () => this.onClickSupplierItems(),'Disabled': true,}, 
  ];
  contextButtons1  =  [
   {'Label'   : 'Add Barcode','Function'  : () => this.onClickAddBarcode(),'Disabled': true,}, 
  ];
  contextButtons2  =  [
    {'Label'   : 'Edit','Function'            : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Remove','Function'          : () => this.onClickRemove(),'Disabled': true,}, 
    {'Label'   : 'Remove All','Function'      : () => this.onClickRemoveAll(),'Disabled': true,}, 
    {'Label'   : 'SerialNos','Function'       : () => this.onClickSerialNos(),'Disabled': true,}, 
    {'Label'   : 'Save As Pending','Function' : () => this.onClickSaveAsPending(),'Disabled': true,}, 
    {'Label'   : 'Show Pending','Function'    : () => this.onClickShowPending(),'Disabled': true,}, 
    {'Label'   : 'Load P.O','Function'        : () => this.onClickLoadPO(),'Disabled': true,}, 
  ];

  constructor(
    private dialog          : MatDialog,
    private stocksService    : StocksService,
    private suppliersService     : SuppliersService,
    private receivingTransactionService      : ReceivingTransactionService,
    private receivingHeadersService      : ReceivingHeadersService,
    private receivingDetailsService      : ReceivingDetailsService,
    private receivingConfigAccessRightsService      : ReceivingConfigAccessRightsService,
    private pOHeadersService      : POHeadersService,
    private notif           : NotificationService,
    private auth_service    : AuthService,
    private toolBoxService : ToolBoxService,
    public matTableService : MatTableService,
    private numbersService : NumbersService,
    private dateTimesService : DateTimesService,
    private stringHelperService : StringHelperService,
    private homeTs : HomeComponent,
    private notificationService : NotificationService,
    private stockSuppliersService :  StockSuppliersService,
    private globalConfigService : GlobalConfigService,
     private viewContainerRef : ViewContainerRef,

  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    this.columnTypeMap3 = this.buildColumnTypeMap(this.defaultColumns3);
    await this.getReceivingConfigAccessRights();
    this.getSuppliers();
    this.getStocks();
    this.isColorOutOfStock = await this.globalConfigService.isColorOutOfStock();
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.toolButtons, this.toolButtons2, this.toggleButtons, this.toggleButtons2);
    this.toolBoxService.disableButtons(this.contextButtons1, this.contextButtons2,null, null);
    this.getReceivingDetails();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async getReceivingConfigAccessRights(){
    this.receivingConfigAccessright = await firstValueFrom(this.receivingConfigAccessRightsService.getReceivingConfigAccessRightByAccessRightName(this.auth_service.UserAccount.AccessRightName));
  }

  async getSuppliers(){
    this.suppliers = await firstValueFrom(this.suppliersService.getCBOSuppliers());
    this.suppliers.push(this.stringHelperService.withCASHSupplierCBO());
  }

  async getTransCode(){
    this.transCode = null;   // Desktop: no number until the first line is saved (it then gets its temporary TransNo)
  }

  async getReceivingDetails(){
    this.isLoading2 = true;
    try{
      this.receivingHeader = await firstValueFrom(this.receivingHeadersService.getReceivingHeaderByRecordStatusByInputBy('ongoing',this.auth_service.User));

      if (!this.receivingHeader) {
        this.receivingDetails = [];
        this.supplierId = 'CASH';
        this.transCode = null;
      }
      else{
        this.receivingDetails = await firstValueFrom(this.receivingDetailsService.getReceivingDetailsByTransCode(this.receivingHeader.TransCode));
        this.supplierId = this.receivingHeader.SupplierId
        this.transCode = this.receivingHeader.TransCode;
      }
    }
    finally{
      this.isLoading2 = false;
      this.displayReceivingDetails();
    }
  } 

  // async getReceivingDetails(){
  //   if(this.transCode == null){
  //     await this.getTransCode();
  //   }
  //   this.isLoading2 = true;
  //   this.receivingHeader  = await firstValueFrom(this.receivingHeadersService.getReceivingHeaderByTransCode(this.transCode));
  //   this.receivingDetails =  await firstValueFrom(this.receivingDetailsService.getReceivingDetailsByTransCode(this.transCode));

  //   if(this.receivingHeader){
  //     if(this.receivingHeader.SupplierId){
  //       if(this.supplierId  != 'CASH'){
  //         this.supplierId = this.supplierId
  //       }else{
  //         this.supplierId = this.receivingHeader.SupplierId
  //       }
  //     }
  //   }else{
  //     if(!this.supplierId){
  //       this.supplierId = 'CASH';
  //     }
  //   }
    
  //   if(this.receivingDetails)
  //     this.isLoading2 = false;
  //   this.displayReceivingDetails();
  // } 


  async getStocks(){
     this.isLoading1 = true;
     this.stocks = await firstValueFrom(this.stocksService.getCBOStocksForTransaction());
     this.filteredStocks = this.stocks;
     this.isLoading1 = false;
     this.displayStocks();
  }

  async adjustQty() {
    for (const data of this.receivingDetails) {
      if (this.stocks && this.stocks.length > 0) {
        const newQty = data.Qty * data.Conversion;

        this.stocks
          .filter(w => w.ItemId === data.ItemId)
          .forEach(i => {
            i.Available = +i.Available + +newQty;
            if (data.Conversion === 1) {
              i.Cost = data.Cost;
            }
          });
      }
    }
     // BUG SA AVAILABLE DILI MO DEDUCT UNLESS E LOAD ITEMS
    this.listData1.data = this.listData1.data.map(row => {
      const stock = this.stocks.find(x => x.ItemId === row.ItemId);

      if (stock) {
        return {
          ...row,
          Available: stock.Available
        };
      }

      return row;
    });
  }


  displayStocks(){
    var data = this.filteredStocks; 
    this.resetSearchBoxes();
    this.listData1 = new MatTableDataSource(data);
    this.listData1.paginator = this.paginator1;
    this.searchInput.nativeElement.focus();
  }

  displayReceivingDetails(){
    var data = this.receivingDetails; 
    this.totalAmount = this.receivingDetails.reduce((sum, x) => sum + +x.Amount, 0);
    this.selectedId = undefined;
    this.selectedData = undefined;
    this.listData2 = new MatTableDataSource(data);
    this.listData2.paginator = this.paginator2;
  }

  async onChangeSupplier(data){
    if(this.receivingDetails.length > 0){
      return this.notificationService.popupWarning3Buttons('Ongoing Transaction', 'Transaction for '+this.receivingDetails[0].SupplierName+' is ongoing. Save transaction as pending first to avoid data loss. CONTINUE?', 'Override Supplier', 'Save as Pending', 'Cancel').then((result) => {
        if (result.isConfirmed) {
          this.receivingTransactionService.saveAsPendingReceivingByTransCode(this.transCode).subscribe({
            next:async (res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.supplierId = data.SupplierId;
              await this.getTransCode();
              this.receivingHeader = null;   // Save As Pending: start a new transaction (the saved one stays in Show Pending, Desktop)
              this.receivingDetails = [];
              this.displayReceivingDetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
        }
        else if (result.isDenied) {
          this.receivingTransactionService.overrideReceivingSupplierByTransCode(this.transCode, data.SupplierId).subscribe({
            next:async (res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.supplierId = data.SupplierId;
              await this.getTransCode();
              this.getReceivingDetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
        }else{
          this.supplierId = this.receivingDetails[0].SupplierId;
        }
        
      });
    }
  }

   
  getRecord2(data : any){
    this.selectedId = data.id;
    this.selectedData = data;
  }

  getRecord1(data : any){
    this.itemId = data.ItemId;
    this.selectedItem = data;

    const filtered = this.listData1?.filteredData;
    if (filtered) {
      const index = filtered.findIndex((item: any) => item.ItemId === data.ItemId);
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
      const index = this.listData1.data.findIndex((x: any) => x.ItemId === data.ItemId);
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

    if(!this.selectedItem || this.selectedItem == undefined){
      this.getFirstRecord();
    }
    if(this.qty > 0){
      this.selectedItem.Qty = this.qty;
    }

    this.selectedItem.TransCode = this.transCode;
    this.selectedItem.SupplierId = this.supplierId;

    if(this.selectedItem.HasMultipleUMs.toLowerCase() == 'yes'){
      this.PopupQtyUI(this.selectedItem);
    }
    else{
      this.saveToReceivingHeaders();
    }
  }

  async PopupQtyUI(stock)
  {
    stock.TransCode   = this.transCode;
    stock.SupplierId  = this.supplierId;
    
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = (['',stock, 'additemreceivingtransaction']);
    
    this.dialog.open(ReceivingDetailUIComponent,dialogConfig).beforeClosed().subscribe(async receivingDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(receivingDetail) ? receivingDetail[0] : receivingDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo
      if(receivingDetail){
        this.transCode = receivingDetail.TransNo ?? this.transCode;  // the first line gets the temporary TransNo
         this.receivingDetails = [ receivingDetail,...this.receivingDetails]; 
        this.displayReceivingDetails();
        this.resetSearchBoxes();
      }
    });
    
  }

  saveToReceivingHeaders()
  {
      this.receivingTransactionService.saveToReceivingHeaders(this.selectedItem.ItemId, this.qty ?? 1, this.transCode, this.supplierId, this.selectedItem.Cost,this.selectedItem.UM, this.recordStatus).subscribe({
        next: (res)=>{
        this.transCode = res.receivingDetail?.TransNo ?? this.transCode;  // the first line gets the temporary TransNo
          this.notif.toastrSuccess(res.message);
          this.receivingDetails = [ res.receivingDetail,...this.receivingDetails]; 
          this.displayReceivingDetails();
          this.resetSearchBoxes();
        },
        error: (err)=>{
          this.notif.toastrError(err.error.message);
          this.itemId = undefined;
        }
      }); 
  }

  async onClickSaveTransaction(){
    if (!this.matTableService.CommonTransaction()) {
      return;
    }
    if(this.receivingDetails.length == 0)
      return this.notificationService.toastrWarning('Empty Transaction');

    this.receivingHeader = await firstValueFrom(this.receivingHeadersService.getReceivingHeaderByTransCode(this.transCode));
    var supplier:any = await firstValueFrom(this.suppliersService.getSupplierBySupplierId(this.supplierId));
    if(this.receivingHeader.PONo != null || this.receivingHeader.PONo != 0){
      this.poHeader = await firstValueFrom(this.pOHeadersService.getPOHeaderByTransNo(this.receivingHeader.PONo));
    }
    this.disableSave = true;
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data = ([supplier,this.receivingHeader, this.transCode, this.totalAmount,this.poHeader, this.recordStatus,'savereceivingtransaction']);
    this.dialog.open(ReceivingHeaderUIComponent,dialogConfig).beforeClosed().subscribe(async x => {
      if(x){
        await this.getTransCode();
        // this.getStocks();
        this.adjustQty();
        this.receivingHeader = null;
        // this.supplierId = 'CASH';
        this.receivingDetails= [];
        this.displayReceivingDetails();
        this.resetSearchBoxes();
      }
    });
    
  }

 async onClickEdit(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    
    var receivingDetail:any = await firstValueFrom(this.receivingDetailsService.getReceivingDetailById(this.selectedData.id));
    var stock:any = await firstValueFrom(this.stocksService.getItemByItemId(this.selectedData.ItemId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = ([receivingDetail,stock, 'updatereceivingtransaction']);
    this.dialog.open(ReceivingDetailUIComponent,dialogConfig).beforeClosed().subscribe(receivingDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(receivingDetail) ? receivingDetail[0] : receivingDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo
      if(receivingDetail){
        const receivingDetailIndex = this.receivingDetails.findIndex(detail => detail.id === receivingDetail.id);
        if (receivingDetailIndex !== -1) {
          this.receivingDetails[receivingDetailIndex] = receivingDetail;  
        }
        this.displayReceivingDetails();
      }
    });
  }

  onClickRemove(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notificationService.popupWarning("Delete Record",this.selectedData.ItemName+ " will be remove. Continue?").then((result) => {
      if (result.value) {
        this.receivingTransactionService.deleteReceivingDetailById(this.selectedData.id).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.receivingDetails = this.receivingDetails.filter(x => x.id != this.selectedData.id);
              this.displayReceivingDetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error.message);
            },
        });
      }
    });
  }

  onClickRemoveAll(){
    if(this.receivingDetails.length == 0)
      return this.notificationService.toastrWarning('Empty Transaction');

    this.notificationService.popupWarning("Delete Record","All Items will be REMOVED. Continue?").then((result) => {
      if (result.value) {
        this.receivingTransactionService.deleteReceivingDetailsByTransCode(this.transCode).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.receivingDetails = [];
              this.displayReceivingDetails();
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

    var rDetail:any = await firstValueFrom(this.receivingDetailsService.getReceivingDetailById(this.selectedId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data         = ([rDetail, 'receivingtransaction', '']);
     dialogConfig.viewContainerRef = this.viewContainerRef; 
    this.dialog.open(RRSerialNosUIComponent,dialogConfig).beforeClosed().subscribe(saleDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(saleDetail) ? saleDetail[0] : saleDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo
      this.getReceivingDetails();
    });
  }


  onClickSaveAsPending(){
    if(this.receivingDetails.length == 0)
      return this.notificationService.toastrWarning('Empty Transaction');

    this.notificationService.popupWarning("Pending Receiving","All Items will be save as pending. Continue?").then((result) => {
      if (result.value) {
        this.receivingTransactionService.saveAsPendingReceivingByTransCode(this.transCode).subscribe({
            next:async (res)=>{
              this.notificationService.toastrSuccess(res.message);
              await this.getTransCode();
              this.receivingHeader = null;   // Save As Pending: start a new transaction (the saved one stays in Show Pending, Desktop)
              this.receivingDetails = [];
              this.displayReceivingDetails();
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
    this.dialog.open(ReceivingPendingTransactionsUIComponent,dialogConfig).beforeClosed().subscribe(res => {
      if(res){
        this.transCode = res.transCode; 
        this.receivingDetails = res.receivingDetails; 
        this.receivingHeader = res.receivingHeader; 
        this.supplierId = res.receivingHeader.SupplierId; 
        this.displayReceivingDetails();
      }
    });
  }

  onClickLoadPO(){
  const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1500px';
    dialogConfig.data         = ([this.transCode, this.supplierId, 'receivingtransaction']);
     dialogConfig.viewContainerRef = this.viewContainerRef; 
    this.dialog.open(POForDeliveryUIComponent,dialogConfig).beforeClosed().subscribe(res => {
      if(res){
        this.receivingHeader = res.receivingHeader;
        this.receivingDetails = res.receivingDetails;
        this.transCode = res.receivingHeader.TransCode;
        this.supplierId = res.receivingHeader.SupplierId;
        this.displayReceivingDetails();
      }
    });
  }

  onClickLoadItems(){
    this.getStocks();

    // const dialogConfig        = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus    = true;
    // dialogConfig.width        = '1500px';
    // dialogConfig.data         = ([this.transCode, this.supplierId,this.receivingDetails, 'receivingtransaction', 'stocks']);
    // this.dialog.open(LoadItemsForReceivingUIComponent,dialogConfig).beforeClosed().subscribe(receivingDetails => {
    //   this.receivingDetails = receivingDetails; 
    //   this.displayReceivingDetails();
    // });
  }

  async onClickSupplierItems(){
    if(this.supplierId.toLowerCase() == 'cash')
        return this.notif.toastrWarning("Please Select Supplier.")
    else{
      this.isLoading1 = true;
      this.stocks = await firstValueFrom(this.stockSuppliersService.getStockSuppliersBySupplierId(this.supplierId));
      this.filteredStocks = this.stocks;
      this.isLoading1 = false;
      this.displayStocks();

      // const dialogConfig        = new MatDialogConfig();
      // dialogConfig.disableClose = true;
      // dialogConfig.autoFocus    = true;
      // dialogConfig.width        = '1500px';
      // dialogConfig.data         = ([this.transCode, this.supplierId,this.receivingDetails, 'receivingtransaction', 'supplieritems']);
      // this.dialog.open(LoadItemsForReceivingUIComponent,dialogConfig).beforeClosed().subscribe(receivingDetails => {
      //   this.receivingDetails = receivingDetails; 
      //   this.displayReceivingDetails();
      // });
    }
  }

  onClickNewSupplier(){
          if (!this.matTableService.CommonTransaction()) {
      return;
    }
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = (['','receiving', []]);
    this.dialog.open(SupplierUIComponent,dialogConfig).beforeClosed().subscribe(supplier => {
      if(supplier){
        this.suppliers = [supplier,...this.suppliers]; 
      }
    });
  }

  onClickNewItem(){
          if (!this.matTableService.CommonTransaction()) {
      return;
    }
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data        = (['', 'receiving',[]]);
    this.dialog.open(ItemUIComponent,dialogConfig).beforeClosed().subscribe(item => {
      // Desktop reloads the inventory list after New Item: a no-inventory item does not show here
      if(item && (item.HasInventory ?? 'yes').toLowerCase() != 'no'){
        this.stocks = [item,...this.stocks]; 
        this.filteredStocks = this.stocks;
        this.displayStocks();
      }
    });
  }

  onClickAddBarcode(){
    if (!this.matTableService.checkNull(this.itemId)) return;

    this.selectedItem.IsBaseUM = 'yes';
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    dialogConfig.data         = this.selectedItem;
    this.dialog.open(BarcodeUIComponent,dialogConfig);
  }
  
  updateElementReceivingDetail(event: any, id, Column){
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
    this.receivingTransactionService.updateElementReceivingDetail(id, Column, Value).subscribe({
      next:(res) =>{
        this.notif.toastrSuccess(res.message);

        //update receivingDetailsDisplay
        const receivingDetailIndex = this.receivingDetails.findIndex(detail => detail.id === id);
        if (receivingDetailIndex !== -1) {
          this.receivingDetails[receivingDetailIndex] = res.receivingDetail;  
        }
        this.displayReceivingDetails();
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
     if(type == 'podetails'){
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
       this.selectedItem = await firstValueFrom(this.stocksService.getItemByBarcodeId(this.searchKey1));
        if (this.selectedItem == null) {
          return this.notificationService.toastrWarning("Item Not Found.");
        } 
        // Desktop lists only inventory items (StocksBAL.GetData) here: a scanned barcode of another item is refused
        // (a multiple-UM barcode has no flags of its own: its base item decides)
        const flags: any = this.selectedItem.HasInventory !== undefined ? this.selectedItem : await firstValueFrom(this.stocksService.getItemByItemId(this.selectedItem.ItemId));
        if ((flags?.HasInventory ?? 'yes').toLowerCase() == 'no') {
          const itemName = this.selectedItem.ItemName ?? flags?.ItemName;
          this.selectedItem = null;
          return this.notificationService.toastrWarning(itemName + ' is not an inventory item.');
        }
    }
    this.onFocusQty();
  }

  resetSearchBoxes(){
    this.itemId = undefined;
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
  if (event.key === 'F1') {
    event.preventDefault();
    this.onClickLoadItems();
  }
    if (event.key === 'F2') {
    event.preventDefault();
    this.onClickSupplierItems();
  }
 
   if (event.key === 'F4') {
    event.preventDefault();
    this.onClickSaveTransaction();
  }
  
}

  getDisplayedColumn(){
    if(this.receivingConfigAccessright?.HideCost?.toLowerCase() == 'yes')
        return this.defaultColumns3;
      else
        return this.defaultColumns2;
  }
  getTotal(column){
    let sum = 0;
    this.listData2?.filteredData.forEach(x => {
            sum += +x[column];
    });
    return sum;
  }
}
