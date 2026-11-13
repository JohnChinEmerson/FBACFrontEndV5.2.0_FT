import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CanvassDetailSuppliersService } from 'src/app/services/Canvassing/canvass-detail-suppliers.service';
import { CanvassDetailsService } from 'src/app/services/Canvassing/canvass-details.service';
import { CanvassHeadersService } from 'src/app/services/Canvassing/canvass-headers.service';
import { CanvassReasonsService } from 'src/app/services/Canvassing/canvass-reasons.service';
import { CanvassTransactionService } from 'src/app/services/Canvassing/canvass-transaction.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { StocksService } from 'src/app/services/Inventory/stocks.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { BarcodeUIComponent } from '../../Files/barcode-ui/barcode-ui.component';
import { ItemUIComponent } from '../../Files/item-ui/item-ui.component';
import { HomeComponent } from '../../home.component';
import { CanvassDetailUIComponent } from '../canvass-detail-ui/canvass-detail-ui.component';
import { CanvassHeaderUIComponent } from '../canvass-header-ui/canvass-header-ui.component';
import { CanvassPendingTransactionUIComponent } from '../canvass-pending-transaction-ui/canvass-pending-transaction-ui.component';
import { CanvassReasonsUIComponent } from '../canvass-reasons-ui/canvass-reasons-ui.component';
import { CanvassSuppliersUIComponent } from '../canvass-suppliers-ui/canvass-suppliers-ui.component';
import { StockSupplierUIComponent } from '../stock-supplier-ui/stock-supplier-ui.component';
import { GlobalConfigService } from 'src/app/services/global-config.service';

@Component({
  selector: 'app-canvass-transaction2',
  templateUrl: './canvass-transaction2.component.html',
  styleUrls: ['./canvass-transaction2.component.css']
})
export class CanvassTransaction2Component implements OnInit {

  stocks              : any=[];
  filteredStocks      : any=[];
  reasons             : any=[];
  reasonId            : string;
  itemId              : string ="";
  selectedItem        : any;
  selectedRowIndex    : number = 0;
  selectedReason      : any;  
  previousReasonId    : any;  
  qty                 : number;

  canvassDetails          : any=[];
  canvassDetailSuppliers  : any=[];
  canvassHeader           : any=[];

  listData1        : MatTableDataSource<any>;
  searchKey1       : string;
  isLoading1       : boolean = false;
  
  listData2        : MatTableDataSource<any>;
  searchKey2       : string;
  isLoading2       : boolean = false;

  listData3        : MatTableDataSource<any>;
  searchKey3       : string;
  isLoading3       : boolean = false;

  rightClickType    : string = 'canvassdetails';
  transCode         : string  = null;
  totalQty          : number = 0;
  selectedId1        : string;
  selectedData1      : any;
  disableSave       : boolean = false;
  isColorOutOfStock : boolean = true;
  selectedId2       : string;
  selectedData2     : any;
 
  defaultColumns  = ['ItemId', 'ItemName','UM','AveCost','Available'];
  defaultColumns2: any[] = [
    'Qty',
    'UM',
    'ItemName',
    'Category',
  ];
  defaultColumns3: any[] = [
    'SupplierName',
    'Cost',
    'TermDays',
    'DiscountPercent',
    'MinimumQty',
    'ContactNo',
  ];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['AveCost','Available','Qty','Cost', 'DiscountPercent','MinimumQty',],
    intColumns: ['TermDays'],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};
  columnTypeMap3: { [key: string]: string } = {};
  @ViewChild('qtyInput') qtyInputRef: ElementRef;
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('paginator3') paginator3: MatPaginator;
  @ViewChild('dataTable', { static: false }) dataTable!: ElementRef;
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;
  @ViewChildren('rowElement', { read: ElementRef }) rows!: QueryList<ElementRef>;
  @ViewChild('tableContainer', { static: true }) tableContainer!: ElementRef;

  toolButtons     = [
    {'Label'   : 'New Reason','Function'             : () => this.onClickNewReason(),'Disabled': true,}, 
  ];

  toolButtons2     = [
    {'Label'   : 'New Item','Function'             : () => this.onClickNewItem(),'Disabled': true,}, 
  ];

  toggleButtons     = [
    {'Label'   : 'SAVE TRANSACTION-F4','Function'    : () => this.onClickSaveTransaction(),'Disabled': true,}, 
  ];

  toggleButtons3     = [
    {'Label'   : 'LOAD ITEMS-F1','Function'          : () => this.onClickLoadItems(),'Disabled': true,}, 
  ];
  contextButtons1  =  [
      {'Label'   : 'Add Barcode','Function'  : () => this.onClickAddBarcode(),'Disabled': true,}, 
  ];
  contextButtons2  =  [
    {'Label'   : 'Canvass','Function'         : () => this.onClickCanvass(),'Disabled': true,}, 
    {'Label'   : 'Edit','Function'            : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Remove','Function'          : () => this.onClickRemove(),'Disabled': true,}, 
    {'Label'   : 'Remove All','Function'      : () => this.onClickRemoveAll(),'Disabled': true,}, 
    {'Label'   : 'Save As Pending','Function' : () => this.onClickSaveAsPending(),'Disabled': true,}, 
    {'Label'   : 'Show Pending','Function'    : () => this.onClickShowPending(),'Disabled': true,}, 
  ];
  contextButtons3  =  [
    {'Label'   : 'Edit','Function'            : () => this.onClickEdit2(),'Disabled': true,}, 
    {'Label'   : 'Remove','Function'          : () => this.onClickRemove2(),'Disabled': true,}, 
  ];
  constructor(
    private dialog          : MatDialog,
    private stocksService    : StocksService,
    private canvassReasonsService     : CanvassReasonsService,
    private canvassTransactionService      : CanvassTransactionService,
    private canvassHeadersService      : CanvassHeadersService,
    private canvassDetailsService      : CanvassDetailsService,
    private canvassDetailSuppliersService      : CanvassDetailSuppliersService,
    private notif           : NotificationService,
    private auth_service    : AuthService,
    private toolBoxService : ToolBoxService,
    public matTableService : MatTableService,
    private numbersService : NumbersService,
    private dateTimesService : DateTimesService,
    private stringHelperService : StringHelperService,
    private homeTs : HomeComponent,
    private notificationService : NotificationService,
    private globalConfigService : GlobalConfigService,
    private viewContainerRef : ViewContainerRef,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    this.columnTypeMap3 = this.buildColumnTypeMap(this.defaultColumns3);
    this.getCanvassReasons();
    this.getStocks();
    this.isColorOutOfStock = await this.globalConfigService.isColorOutOfStock();
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.toolButtons, this.toolButtons2, this.toggleButtons, this.contextButtons1);
    this.toolBoxService.disableButtons(this.toggleButtons3,this.contextButtons2,this.contextButtons3, null);
    this.getCanvassDetails();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }


  async getCanvassReasons(){
    this.reasons = await firstValueFrom(this.canvassReasonsService.getCBOCanvassReasons());
  }

  async getTransCode(){
    this.transCode = null;   // Desktop: no number until the first line is saved (it then gets its temporary TransNo)
  }

  async getCanvassDetails(){
     this.isLoading2 = true;
    try{
      this.canvassHeader = await firstValueFrom(this.canvassHeadersService.getCanvassHeaderByRecordStatusByInputBy('ongoing',this.auth_service.User));

      if (!this.canvassHeader) {
        this.canvassDetails = [];
        this.reasonId = null;
        this.transCode = null;
      }
      else{
        this.canvassDetails = await firstValueFrom(this.canvassDetailsService.getCanvassDetailsByTransCode(this.canvassHeader.TransCode));
        this.reasonId = this.canvassHeader.ReasonId;
        this.transCode = this.canvassHeader.TransCode;
      }
    }
    finally{
      this.isLoading2 = false;
      this.displayCanvassDetails();
    }
  } 

  // async getCanvassDetails(){
  //   if(this.transCode == null){
  //     await this.getTransCode();
  //   }
  //   this.isLoading2 = true;
  //   this.canvassHeader  = await firstValueFrom(this.canvassHeadersService.getCanvassHeaderByTransCode(this.transCode));
  //   this.canvassDetails =  await firstValueFrom(this.canvassDetailsService.getCanvassDetailsByTransCode(this.transCode));

  //   if(this.canvassHeader){
  //     if(this.canvassHeader.ReasonId){
  //       this.reasonId = this.canvassHeader.ReasonId
  //     }
  //   }
    
  //   if(this.canvassDetails)
  //     this.isLoading2 = false;
  //   this.displayCanvassDetails();
  // } 
  async getCanvassDetailSuppliers(){
  
    this.isLoading3 = true;
    this.canvassDetailSuppliers =  await firstValueFrom(this.canvassDetailSuppliersService.getCanvassDetailSuppliersByTransDetailId(this.selectedId1));
    if(this.canvassDetailSuppliers)
      this.isLoading3 = false;
    this.displayCanvassDetailSuppliers();
  } 

  async getStocks(){
    this.isLoading1 = true;
    this.stocks = await firstValueFrom(this.stocksService.getCBOStocksForTransaction());
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

  displayCanvassDetails(){
    var data = this.canvassDetails; 
    this.totalQty = 0;
    if(data.length > 0){
      data.forEach(x => {
        this.totalQty += +x.Qty;
      });
    }
    this.selectedId1 = undefined;
    this.selectedData1 = undefined;
    this.listData2 = new MatTableDataSource(data);
    this.listData2.paginator = this.paginator2;
  }

  displayCanvassDetailSuppliers(){
    var data = this.canvassDetailSuppliers; 
    this.selectedId2 = undefined;
    this.selectedData2 = undefined;
    this.listData3 = new MatTableDataSource(data);
    this.listData3.paginator = this.paginator3;
  }

  async onChangeReason(data){
    if(this.canvassDetails.length > 0){
      return this.notificationService.popupWarning3Buttons('Ongoing Transaction', 'Transaction for '+this.canvassDetails[0].ReasonName+' is ongoing. Save transaction as pending first to avoid data loss. CONTINUE?', 'Override Reason', 'Save as Pending', 'Cancel').then((result) => {
        if (result.isConfirmed) {
          this.canvassTransactionService.saveAsPendingCanvassByTransCode(this.transCode).subscribe({
            next:async (res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.reasonId = data.ReasonId;
              await this.getTransCode();
              this.canvassHeader = null;   // Save As Pending: start a new transaction (the saved one stays in Show Pending, Desktop)
              this.canvassDetails = [];
              this.displayCanvassDetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
        }
        else if (result.isDenied) {
          this.canvassTransactionService.overrideCanvassReasonByTransCode(this.transCode, data.ReasonId).subscribe({
            next:async (res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.reasonId = data.ReasonId;
              await this.getTransCode();
              this.getCanvassDetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
        }
        else{
          this.reasonId = this.canvassDetails[0].ReasonId;
        }
        
      });
    }
  
  }

  getRecord2(data : any){
    this.selectedId1 = data.id;
    this.selectedData1 = data;
    this.getCanvassDetailSuppliers();
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
    this.selectedItem.ReasonId = this.reasonId;
    if(this.selectedItem.HasMultipleUMs.toLowerCase() == 'yes'){
      this.PopupQtyUI(this.selectedItem);
    }
    else{
      this.saveToCanvassHeaders();
    }
  }

  getRecord3(data : any){
    this.selectedId2 = data.id;
    this.selectedData2 = data;
  }

  saveToCanvassHeaders()
  {
    if(this.reasonId == undefined)
        return this.notif.toastrWarning("Reason Not Found.");
    else {
      this.canvassTransactionService.saveToCanvassHeaders(this.selectedItem.ItemId, this.qty ?? 1, this.transCode, this.reasonId, this.selectedItem.UM).subscribe({
        next: (res)=>{
        this.transCode = res.canvassDetail?.TransNo ?? this.transCode;  // the first line gets the temporary TransNo
          this.notif.toastrSuccess(res.message);
          this.canvassDetails = [ res.canvassDetail,...this.canvassDetails]; 
          this.displayCanvassDetails();
          this.resetSearchBoxes();
        },
        error: (err)=>{
          this.notif.toastrError(err.error.message);
          this.itemId = undefined;
        }
      }); 
    }
  }

  async PopupQtyUI(stock)
  {
    stock.TransCode   = this.transCode;
    stock.ReasonId  = this.reasonId;
    
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = (['',stock, 'additemcanvasstransaction']);
    
    this.dialog.open(CanvassDetailUIComponent,dialogConfig).beforeClosed().subscribe(async canvassDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(canvassDetail) ? canvassDetail[0] : canvassDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo
      if(canvassDetail){
        this.transCode = canvassDetail.TransNo ?? this.transCode;  // the first line gets the temporary TransNo
        this.canvassDetails = [ canvassDetail,...this.canvassDetails]; 
        this.displayCanvassDetails();
        this.resetSearchBoxes();
      }
     
    });
  }


  async onClickSaveTransaction() {
          if (!this.matTableService.CommonTransaction()) {
      return;
    }
    if (this.canvassDetails.length === 0) {
      return this.notificationService.toastrWarning('Empty Transaction');
    }
  
    for (const x of this.canvassDetails) {
      const suppliers: any = await firstValueFrom(
        this.canvassDetailSuppliersService.getCanvassDetailSuppliersByTransDetailId(x.id)
      );
  
      if (suppliers.length === 0) {
        return this.notificationService.toastrWarning(x.ItemName+" has no canvass supplier yet.");
      }
    }
  
    // This block will execute only if all items have suppliers
    const reason: any = await firstValueFrom(
      this.canvassReasonsService.getCanvassReasonByReasonId(this.reasonId)
    );
  
    this.disableSave = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '800px';
    dialogConfig.data = [reason, this.canvassHeader, this.transCode, 'savecanvasstransaction'];
    this.dialog.open(CanvassHeaderUIComponent, dialogConfig).beforeClosed().subscribe(async (x) => {
      if (x) {
        await this.getTransCode();
        this.canvassHeader = null;
        this.reasonId = 'CASH';
        this.canvassDetails = [];
        this.canvassDetailSuppliers = [];
        this.displayCanvassDetails();
        this.displayCanvassDetailSuppliers();
        this.resetSearchBoxes();
      }
    });
  }
  

  async onClickCanvass(){
    if (!this.matTableService.checkNull(this.selectedId1)) return;

    var canvassDetail:any = await firstValueFrom(this.canvassDetailsService.getCanvassDetailById(this.selectedData1.id));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data = ([canvassDetail, 'addcanvasssuppliers']); 
     dialogConfig.viewContainerRef = this.viewContainerRef;  
    this.dialog.open(CanvassSuppliersUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      this.getCanvassDetailSuppliers();
    });


  }
 async onClickEdit(){
    if (!this.matTableService.checkNull(this.selectedId1)) return;
    
    var canvassDetail:any = await firstValueFrom(this.canvassDetailsService.getCanvassDetailById(this.selectedData1.id));
    var stock:any = await firstValueFrom(this.stocksService.getItemByItemId(this.selectedData1.ItemId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = ([canvassDetail,stock, 'updatecanvasstransaction']);  
    this.dialog.open(CanvassDetailUIComponent,dialogConfig).beforeClosed().subscribe(canvassDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(canvassDetail) ? canvassDetail[0] : canvassDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo
      if(canvassDetail){
        const canvassDetailIndex = this.canvassDetails.findIndex(detail => detail.id === canvassDetail.id);
        if (canvassDetailIndex !== -1) {
          this.canvassDetails[canvassDetailIndex] = canvassDetail;  
        }
        this.displayCanvassDetails();
      }
    
    });
  }

  onClickRemove(){
    if (!this.matTableService.checkNull(this.selectedId1)) return;
    this.notificationService.popupWarning("Delete Record",this.selectedData1.ItemName+ " will be remove. Continue?").then((result) => {
      if (result.value) {
        this.canvassTransactionService.deleteCanvassDetailById(this.selectedData1.id).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.canvassDetails = this.canvassDetails.filter(x => x.id != this.selectedData1.id);
              this.canvassDetailSuppliers = this.canvassDetailSuppliers.filter(x => x.TransDetailId != this.selectedData1.id);
              this.displayCanvassDetails();
              this.displayCanvassDetailSuppliers();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error.message);
            },
        });
      }
    });
  }

  onClickRemoveAll(){
    if(this.canvassDetails.length == 0)
      return this.notificationService.toastrWarning('Empty Transaction');

    this.notificationService.popupWarning("Delete Record","All Items will be REMOVED. Continue?").then((result) => {
      if (result.value) {
        this.canvassTransactionService.deleteCanvassDetailsByTransCode(this.transCode).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.canvassDetails = [];
              this.canvassDetailSuppliers = [];
              this.displayCanvassDetails();
              this.displayCanvassDetailSuppliers();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error.message);
            },
        });
      }
    });
  }
  
  async onClickEdit2(){
    if (!this.matTableService.checkNull(this.selectedId2)) return;

    var stock:any = await firstValueFrom(this.stocksService.getItemByItemId(this.selectedData1.ItemId));
    var canvassDetailSupplier:any = await firstValueFrom(this.canvassDetailSuppliersService.getCanvassDetailSupplierById(this.selectedId2));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = ([stock,this.selectedData1, 'updatestocksupplierfromcanvasstransaction', canvassDetailSupplier]);  
    this.dialog.open(StockSupplierUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      if(x){
        this.getCanvassDetailSuppliers();
      }
    });

  }

  onClickRemove2(){
    if (!this.matTableService.checkNull(this.selectedId2)) return;

    this.notificationService.popupWarning("Delete Record",this.selectedData2.SupplierName+ " will be remove. Continue?").then((result) => {
      if (result.value) {
        this.canvassDetailSuppliersService.deleteCanvassDetailSuppliersById(this.selectedData2.id).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.canvassDetailSuppliers = this.canvassDetailSuppliers.filter(x => x.id != this.selectedData2.id);
              this.displayCanvassDetailSuppliers();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
      }
    });

  }

  onClickSaveAsPending(){
    if(this.canvassDetails.length == 0)
      return this.notificationService.toastrWarning('Empty Transaction');

    this.notificationService.popupWarning("Pending Canvass","All Items will be save as pending. Continue?").then((result) => {
      if (result.value) {
        this.canvassTransactionService.saveAsPendingCanvassByTransCode(this.transCode).subscribe({
            next:async (res)=>{
              this.notificationService.toastrSuccess(res.message);
              await this.getTransCode();
              this.canvassHeader = null;   // Save As Pending: start a new transaction (the saved one stays in Show Pending, Desktop)
              this.canvassDetails = [];
              this.displayCanvassDetails();
              this.getCanvassDetailSuppliers();
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
    this.dialog.open(CanvassPendingTransactionUIComponent,dialogConfig).beforeClosed().subscribe(res => {
      if(res){
        this.transCode = res.transCode; 
        this.canvassDetails = res.canvassDetails; 
        this.canvassHeader = res.canvassHeader; 
        this.canvassDetailSuppliers = res.canvassDetailSuppliers; 
        this.reasonId = res.canvassHeader.ReasonId; 
        this.displayCanvassDetails();
      }
    });
  }


  onClickLoadItems(){
    this.getStocks();
    // const dialogConfig        = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus    = true;
    // dialogConfig.width        = '1500px';
    // dialogConfig.data         = ([this.transCode, this.reasonId,this.canvassDetails, 'canvasstransaction', 'stocks']);
    // this.dialog.open(LoadItemsForCanvassUIComponent,dialogConfig).beforeClosed().subscribe(canvassDetails => {
    //   this.canvassDetails = canvassDetails; 
    //   this.displayCanvassDetails();
    // });
  }

  onClickNewReason(){
     if (!this.matTableService.CommonTransaction()) {
      return;
    }
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = (['','canvass', []]);
    this.dialog.open(CanvassReasonsUIComponent,dialogConfig).beforeClosed().subscribe(reason => {
      if(reason){
        this.reasons = reason; 
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
    dialogConfig.data        = (['', 'canvass',[]]);
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
  

  updateElementCanvassDetail(event: any, id, Column){
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
    this.canvassTransactionService.updateElementCanvassDetail(id, Column, Value).subscribe({
      next:(res) =>{
        this.notif.toastrSuccess(res.message);

        //update canvassDetailsDisplay
        const canvassDetailIndex = this.canvassDetails.findIndex(detail => detail.id === id);
        if (canvassDetailIndex !== -1) {
          this.canvassDetails[canvassDetailIndex] = res.canvassDetail;  
        }
        this.displayCanvassDetails();
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
      if(type == 'canvassdetails'){
        this.getRecord2(data);
      }
      else if(type == 'canvassdetailsuppliers'){
        this.getRecord3(data);
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
