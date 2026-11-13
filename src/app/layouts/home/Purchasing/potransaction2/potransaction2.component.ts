import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { SuppliersService } from 'src/app/services/Files/suppliers.service';
import { StocksService } from 'src/app/services/Inventory/stocks.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { PODetailsService } from 'src/app/services/Purchasing/podetails.service';
import { POHeadersService } from 'src/app/services/Purchasing/poheaders.service';
import { POTransactionService } from 'src/app/services/Purchasing/potransaction.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { CanvassForPOUIComponent } from '../../Canvassing/canvass-for-poui/canvass-for-poui.component';
import { BarcodeUIComponent } from '../../Files/barcode-ui/barcode-ui.component';
import { ItemUIComponent } from '../../Files/item-ui/item-ui.component';
import { SupplierUIComponent } from '../../Files/supplier-ui/supplier-ui.component';
import { HomeComponent } from '../../home.component';
import { LoadItemsForPOUIComponent } from '../load-items-for-poui/load-items-for-poui.component';
import { PODetailUIComponent } from '../podetail-ui/podetail-ui.component';
import { POHeaderUIComponent } from '../poheader-ui/poheader-ui.component';
import { POPendingTransactionsUIComponent } from '../popending-transactions-ui/popending-transactions-ui.component';
import { StockSuppliersService } from 'src/app/services/Inventory/stock-suppliers.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { POConfigService } from 'src/app/services/Purchasing/poconfig.service';

@Component({
  selector: 'app-potransaction2',
  templateUrl: './potransaction2.component.html',
  styleUrls: ['./potransaction2.component.css']
})
export class POTransaction2Component implements OnInit {

  stocks            : any=[];
  filteredStocks    : any=[];
  suppliers         : any=[];
  supplierId        : string;
  itemId            : string ="";
  selectedItem      : any;
  selectedRowIndex  : number = 0;
  selectedSupplier  : any;
  previousSupplierId: any;  
  qty               :  number;

  poDetails     : any=[];
  poHeader      : any=[];

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
  defaultColumns  = ['ItemId', 'ItemName','UM','Cost','Available'];
  defaultColumns2: any[] = [
    'Qty',
    'UM',
    'ItemName',
    'Cost',
    'Discount',
    'DiscountValue',
    'Amount',
  ];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Cost','Available','Qty',  'Cost', 'Discount','DiscountValue','Amount'],
    intColumns: ['TermDays'],
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
    {'Label'   : 'OUT OF STOCKS-F3','Function'          : () => this.onClickLoadOutOfStocks(),'Disabled': true,}, 
  ];
  contextButtons1  =  [
   {'Label'   : 'Add Barcode','Function'  : () => this.onClickAddBarcode(),'Disabled': true,}, 
  ];
  contextButtons2  =  [
    {'Label'   : 'Edit','Function'            : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Remove','Function'          : () => this.onClickRemove(),'Disabled': true,}, 
    {'Label'   : 'Remove All','Function'      : () => this.onClickRemoveAll(),'Disabled': true,}, 
    {'Label'   : 'Save As Pending','Function' : () => this.onClickSaveAsPending(),'Disabled': true,}, 
    {'Label'   : 'Show Pending','Function'    : () => this.onClickShowPending(),'Disabled': true,}, 
    {'Label'   : 'Load Canvass','Function'    : () => this.onClickLoadCanvass(),'Disabled': true,}, 
  ];
  constructor(
    private dialog          : MatDialog,
    private stocksService    : StocksService,
    private suppliersService     : SuppliersService,
    private poTransactionService      : POTransactionService,
    private poHeadersService      : POHeadersService,
    private poDetailsService      : PODetailsService,
    private notif           : NotificationService,
    private auth_service    : AuthService,
    private toolBoxService : ToolBoxService,
    public matTableService : MatTableService,
    private numbersService : NumbersService,
    private pOConfigService : POConfigService,
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
    await this.getSuppliers();
    await this.getPOConfig();
    await this.getStocks();
    this.isColorOutOfStock = await this.globalConfigService.isColorOutOfStock();
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.toolButtons, this.toolButtons2, this.toggleButtons, this.toggleButtons2);
    this.toolBoxService.disableButtons(this.contextButtons1, this.contextButtons2,null, null);
    this.getPODetails();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }


  async getSuppliers(){
    this.suppliers = await firstValueFrom(this.suppliersService.getCBOSuppliers());
    this.supplierId = this.suppliers[0].SupplierId;
  }

  async getPOConfig(){
    this.poConfig = await firstValueFrom(this.pOConfigService.getPOConfig());
  }

  async getTransCode(){
    this.transCode = null;   // Desktop: no number until the first line is saved (it then gets its temporary TransNo)
  }

  async getPODetails(){
    this.isLoading2 = true;
    try{
      this.poHeader = await firstValueFrom(this.poHeadersService.getPOHeaderByRecordStatusByInputBy('ongoing',this.auth_service.User));

      if (!this.poHeader) {
        this.poDetails = [];
        this.supplierId = this.suppliers[0].SupplierId;
        this.transCode = null;
      }
      else{
        this.poDetails = await firstValueFrom(this.poDetailsService.getPODetailsByTransCode(this.poHeader.TransCode));
        this.supplierId = this.poHeader.SupplierId;
        this.transCode = this.poHeader.TransCode;
      }
    }
    finally{
      this.isLoading2 = false;
      this.displayPODetails();
    }
  } 


  // async getPODetails(){
  //   if(this.transCode == null){
  //     await this.getTransCode();
  //   }
  //   this.isLoading2 = true;
  //   this.poHeader  = await firstValueFrom(this.poHeadersService.getPOHeaderByTransCode(this.transCode));
  //   this.poDetails =  await firstValueFrom(this.poDetailsService.getPODetailsByTransCode(this.transCode));

  //   if(this.poHeader){
  //     if(this.poHeader.SupplierId){
  //       this.supplierId = this.poHeader.SupplierId
  //     }
  //   }else{
  //     if(!this.supplierId){
  //       this.supplierId = this.suppliers[0].SupplierId;
  //     }
  //   }
    
  //   if(this.poDetails)
  //     this.isLoading2 = false;
  //   this.displayPODetails();
  // } 


  async getStocks(){
    this.isLoading1 = true;
    this.stocks = await firstValueFrom(this.stocksService.getCBOStocksForTransaction());
    if (this.poConfig.SortByAvailable.toLowerCase() === 'yes') {
      this.stocks.sort(
        (a, b) =>  (Number(a.Available) - (Number(b.Available) || 0) || 0)
      );
    }
    this.filteredStocks = this.stocks;
    this.isLoading1 = false;
    this.displayStocks();
  }

   async getOutStocks(){
    this.isLoading1 = true;
    this.stocks = await firstValueFrom(this.stocksService.getCBOOutOfStocksForTransaction());
    this.filteredStocks = this.stocks;
    this.isLoading1 = false;
    this.displayStocks();
  }

  displayStocks(){
    var data = this.filteredStocks; 
    this.resetSearchBoxes();
    this.listData1 = new MatTableDataSource(data);
    this.listData1.paginator = this.paginator1;
    this.searchInput.nativeElement.focus();
  }

  displayPODetails(){
    var data = this.poDetails; 
    this.totalAmount = this.poDetails.reduce((sum, x) => sum + +x.Amount, 0);
    this.selectedId = undefined;
    this.selectedData = undefined;
    this.listData2 = new MatTableDataSource(data);
    this.listData2.paginator = this.paginator2;
  }

  async onChangeSupplier(data){
    if(this.poDetails.length > 0){
      return this.notificationService.popupWarning3Buttons('Ongoing Transaction', 'Transaction for '+this.poDetails[0].SupplierName+' is ongoing. Save transaction as pending first to avoid data loss. CONTINUE?', 'Override Supplier', 'Save as Pending', 'Cancel').then((result) => {
        if (result.isConfirmed) {
          this.poTransactionService.saveAsPendingPOByTransCode(this.transCode).subscribe({
            next:async (res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.supplierId = data.SupplierId;
              await this.getTransCode();
              this.poHeader = null;   // Save As Pending: start a new transaction (the saved one stays in Show Pending, Desktop)
              this.poDetails = [];
              this.displayPODetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
        }
        else if (result.isDenied) {
          this.poTransactionService.overridePOSupplierByTransCode(this.transCode, data.SupplierId).subscribe({
            next:async (res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.supplierId = data.SupplierId;
              await this.getTransCode();
              this.getPODetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
        }else{
          this.supplierId = this.poDetails[0].SupplierId;
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
      this.saveToPOHeaders();
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
    dialogConfig.data = (['',stock, 'additempotransaction']);
   
    this.dialog.open(PODetailUIComponent,dialogConfig).beforeClosed().subscribe(async poDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(poDetail) ? poDetail[0] : poDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo
      if(poDetail){
        this.transCode = poDetail.TransNo ?? this.transCode;  // the first line gets the temporary TransNo
        this.poDetails = [ poDetail,...this.poDetails]; 
        this.displayPODetails();
        this.resetSearchBoxes();
      }
    });
   
  }

  saveToPOHeaders()
  {
     if(this.supplierId == undefined)
        return this.notif.toastrWarning("Supplier Not Found.");
    else {
      this.poTransactionService.saveToPOHeaders(this.selectedItem.ItemId, this.qty ?? 1, this.transCode, this.supplierId, this.selectedItem.Cost, this.selectedItem.UM).subscribe({
        next: (res)=>{
        this.transCode = res.poDetail?.TransNo ?? this.transCode;  // the first line gets the temporary TransNo
          this.notif.toastrSuccess(res.message);
          this.poDetails = [ res.poDetail,...this.poDetails]; 
          this.displayPODetails();
          this.resetSearchBoxes();

        },
        error: (err)=>{
          this.notif.toastrError(err.error.message);
          this.itemId = undefined;
        }
      }); 
    }
  }

  async onClickSaveTransaction(){
    if (!this.matTableService.CommonTransaction()) {
      return;
    }
    if(this.poDetails.length == 0)
      return this.notificationService.toastrWarning('Empty Transaction');

    var supplier:any = await firstValueFrom(this.suppliersService.getSupplierBySupplierId(this.supplierId));

    this.disableSave = true;
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data = ([supplier,this.poHeader, this.transCode, this.totalAmount,'savepotransaction']);
    this.dialog.open(POHeaderUIComponent,dialogConfig).beforeClosed().subscribe(async x => {
      if(x){
        await this.getTransCode();
        this.poHeader = null;
        this.supplierId = undefined;
        this.poDetails= [];
        this.displayPODetails();
        this.resetSearchBoxes();
      }
    });
    
  }

 async onClickEdit(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    
    var poDetail:any = await firstValueFrom(this.poDetailsService.getPODetailById(this.selectedData.id));
    var stock:any = await firstValueFrom(this.stocksService.getItemByItemId(this.selectedData.ItemId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = ([poDetail,stock, 'updatepotransaction']);
    this.dialog.open(PODetailUIComponent,dialogConfig).beforeClosed().subscribe(poDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(poDetail) ? poDetail[0] : poDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo
      if(poDetail){
        const poDetailIndex = this.poDetails.findIndex(detail => detail.id === poDetail.id);
        if (poDetailIndex !== -1) {
          this.poDetails[poDetailIndex] = poDetail;  
        }
        this.displayPODetails();
      }
    });
  }

  onClickRemove(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notificationService.popupWarning("Delete Record",this.selectedData.ItemName+ " will be remove. Continue?").then((result) => {
      if (result.value) {
        this.poTransactionService.deletePODetailById(this.selectedData.id).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.poDetails = this.poDetails.filter(x => x.id != this.selectedData.id);
              this.displayPODetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error.message);
            },
        });
      }
    });
  }

  onClickRemoveAll(){
    if(this.poDetails.length == 0)
      return this.notificationService.toastrWarning('Empty Transaction');

    this.notificationService.popupWarning("Delete Record","All Items will be REMOVED. Continue?").then((result) => {
      if (result.value) {
        this.poTransactionService.deletePODetailsByTransCode(this.transCode).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.poDetails = [];
              this.displayPODetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error.message);
            },
        });
      }
    });
  }
  

  onClickSaveAsPending(){
    if(this.poDetails.length == 0)
      return this.notificationService.toastrWarning('Empty Transaction');

    this.notificationService.popupWarning("Pending PO","All Items will be save as pending. Continue?").then((result) => {
      if (result.value) {
        this.poTransactionService.saveAsPendingPOByTransCode(this.transCode).subscribe({
            next:async (res)=>{
              this.notificationService.toastrSuccess(res.message);
              await this.getTransCode();
              this.poHeader = null;   // Save As Pending: start a new transaction (the saved one stays in Show Pending, Desktop)
              this.poDetails = [];
              this.displayPODetails();
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

    this.dialog.open(POPendingTransactionsUIComponent,dialogConfig).beforeClosed().subscribe(res => {
      if(res){
        this.transCode = res.transCode; 
        this.poDetails = res.poDetails; 
        this.poHeader = res.poHeader; 
        this.supplierId = res.poHeader.SupplierId; 
        this.displayPODetails();
      }
    });
  }

  onClickLoadCanvass(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1500px';
    dialogConfig.data         = ([this.transCode, this.supplierId, 'potransaction']);
     dialogConfig.viewContainerRef = this.viewContainerRef; 
    this.dialog.open(CanvassForPOUIComponent,dialogConfig).beforeClosed().subscribe(res => {
      if(res){
        this.poHeader = res.poHeader;
        this.poDetails = res.poDetails;
        this.transCode = res.poHeader.TransCode;
        this.supplierId = res.poHeader.SupplierId;
        this.displayPODetails();
      }
    });
  }

  onClickLoadItems(){
    this.getStocks();

    // const dialogConfig        = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus    = true;
    // dialogConfig.width        = '1500px';
    // dialogConfig.data         = ([this.transCode, this.supplierId,this.poDetails, 'potransaction', 'stocks']);
    // this.dialog.open(LoadItemsForPOUIComponent,dialogConfig).beforeClosed().subscribe(poDetails => {
    //   this.poDetails = poDetails; 
    //   this.displayPODetails();
    // });
  }

  onClickLoadOutOfStocks(){
    this.getOutStocks();
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
      // dialogConfig.data         = ([this.transCode, this.supplierId,this.poDetails, 'potransaction', 'supplieritems']);
      // this.dialog.open(LoadItemsForPOUIComponent,dialogConfig).beforeClosed().subscribe(poDetails => {
      //   this.poDetails = poDetails; 
      //   this.displayPODetails();
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
    dialogConfig.data = (['','po', []]);
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
    dialogConfig.data        = (['', 'po',[]]);
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

  updateElementPODetail(event: any, id, Column){
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
    this.poTransactionService.updateElementPODetail(id, Column, Value).subscribe({
      next:(res) =>{
        this.notif.toastrSuccess(res.message);

        //update poDetailsDisplay
        const poDetailIndex = this.poDetails.findIndex(detail => detail.id === id);
        if (poDetailIndex !== -1) {
          this.poDetails[poDetailIndex] = res.poDetail;  
        }
        this.displayPODetails();
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
    if (event.key === 'F3') {
    event.preventDefault();
    this.onClickLoadOutOfStocks();
  }
 
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
