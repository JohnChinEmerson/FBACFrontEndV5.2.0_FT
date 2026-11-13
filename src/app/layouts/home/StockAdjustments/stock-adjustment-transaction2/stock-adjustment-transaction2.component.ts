import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { StocksService } from 'src/app/services/Inventory/stocks.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { ReasonsService } from 'src/app/services/StockAdjustments/reasons.service';
import { StockAdjustmentDetailsService } from 'src/app/services/StockAdjustments/stock-adjustment-details.service';
import { StockAdjustmentHeadersService } from 'src/app/services/StockAdjustments/stock-adjustment-headers.service';
import { StockAdjustmentTransactionService } from 'src/app/services/StockAdjustments/stock-adjustment-transaction.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { BarcodeUIComponent } from '../../Files/barcode-ui/barcode-ui.component';
import { ItemUIComponent } from '../../Files/item-ui/item-ui.component';
import { HomeComponent } from '../../home.component';
import { LoadItemsForStockAdjustmentUIComponent } from '../load-items-for-stock-adjustment-ui/load-items-for-stock-adjustment-ui.component';
import { LoadStocksTransferUIComponent } from '../load-stocks-transfer-ui/load-stocks-transfer-ui.component';
import { ReasonsUIComponent } from '../reasons-ui/reasons-ui.component';
import { StockAdjustmentDetailUIComponent } from '../stock-adjustment-detail-ui/stock-adjustment-detail-ui.component';
import { StockAdjustmentHeaderUIComponent } from '../stock-adjustment-header-ui/stock-adjustment-header-ui.component';
import { StockAdjustmentPendingTransactionsUIComponent } from '../stock-adjustment-pending-transactions-ui/stock-adjustment-pending-transactions-ui.component';
import { InSerialNosUIComponent } from '../in-serial-nos-ui/in-serial-nos-ui.component';
import { OutSerialNosUIComponent } from '../out-serial-nos-ui/out-serial-nos-ui.component';
import { StockAdjustmentConfigService } from 'src/app/services/StockAdjustments/stock-adjustment-config.service';
@Component({
  selector: 'app-stock-adjustment-transaction2',
  templateUrl: './stock-adjustment-transaction2.component.html',
  styleUrls: ['./stock-adjustment-transaction2.component.css']
})
export class StockAdjustmentTransaction2Component implements OnInit {
  stocks                  : any=[];
  filteredStocks          : any=[];
  reasons                 : any=[];
  reasonId                : string;
  itemId                  : string ="";
  selectedItem            : any;
  selectedRowIndex        : number = 0;
  selectedReason          : any;
  previousReasonId        : any;  
  qty                     : number;
  adjustmentTypes         : any=['StockIn', 'StockOut'];
  adjustmentType          : string = 'StockIn';
  
  stockAdjustmentDetails     : any=[];
  stockAdjustmentHeader      : any=[];
  stockadjustmentConfig : any;

  listData1        : MatTableDataSource<any>;
  searchKey1       : string;
  isLoading1       : boolean = false;
  
  listData2        : MatTableDataSource<any>;
  searchKey2       : string;
  isLoading2       : boolean = false;

  rightClickType  : string = 'stockadjustmentdetails';
  transCode       : string  = null;
  totalAmount     : number = 0;
  selectedId      : string;
  selectedData    : any;
  disableSave     : boolean = false;
  isColorOutOfStock : boolean = true;
  recordStatus : string = 'open';
  defaultColumns  = ['ItemId', 'ItemName','UM','Price','Available'];
  defaultColumns2: any[] = [
    'Qty',
    'UM',
    'ItemName',
    'Price',
    'Amount',
  ];
  
columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Price','Available','Qty','Amount',],
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
 
  toolButtons     = [
    {'Label'   : 'New Reason','Function'             : () => this.onClickNewReason(),'Disabled': true,}, 
  ];

  toolButtons2     = [
    {'Label'   : 'New Item','Function'             : () => this.onClickNewItem(),'Disabled': true,}, 
  ];

  toggleButtons     = [
    {'Label'   : 'SAVE TRANSACTION-F2','Function'    : () => this.onClickSaveTransaction(),'Disabled': true,}, 
  ];

  toggleButtons2     = [
    {'Label'   : 'LOAD ITEMS-F1','Function'          : () => this.onClickLoadItems(),'Disabled': true,}, 
  ];
  contextButtons1  =  [
  ];
  contextButtons2  =  [
    {'Label'   : 'Edit','Function'            : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Remove','Function'          : () => this.onClickRemove(),'Disabled': true,}, 
    {'Label'   : 'Remove All','Function'      : () => this.onClickRemoveAll(),'Disabled': true,}, 
    {'Label'   : 'SerialNos','Function'       : () => this.onClickSerialNos(),'Disabled': true,}, 
    {'Label'   : 'Save As Pending','Function' : () => this.onClickSaveAsPending(),'Disabled': true,}, 
    {'Label'   : 'Show Pending','Function'    : () => this.onClickShowPending(),'Disabled': true,}, 
    {'Label'   : 'Load Stock Transfer','Function'    : () => this.onClickLoadStockTransfer(),'Disabled': true,}, // show only if this.adjustmentType.toLowerCase() == 'stockin'
  ];
  constructor(
    private dialog          : MatDialog,
    private stocksService    : StocksService,
    private reasonsService     : ReasonsService,
    private stockAdjustmentTransactionService      : StockAdjustmentTransactionService,
    private stockAdjustmentHeadersService      : StockAdjustmentHeadersService,
    private stockAdjustmentDetailsService      : StockAdjustmentDetailsService,
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
    private stockadjustementconfigService : StockAdjustmentConfigService,
     private viewContainerRef : ViewContainerRef,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    this.getReasons();
    this.getStocks();
    this.stockadjustmentConfig = await this.stockadjustementconfigService.getStockAdjustmentConfig();
    this.isColorOutOfStock = await this.globalConfigService.isColorOutOfStock();
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.toolButtons, this.toolButtons2, this.toggleButtons, this.toggleButtons2);
    this.toolBoxService.disableButtons( this.contextButtons1,this.contextButtons2, null, null);
    this.getStockAdjustmentDetails();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }


  async getReasons(){
    this.reasons = await firstValueFrom(this.reasonsService.getCBOReasonsByAdjustmentType(this.adjustmentType.toLowerCase()));
    this.reasonId = undefined;
  }

  async getTransCode(){
    this.transCode = null;   // Desktop: no number until the first line is saved (it then gets its temporary TransNo)
  }

  async getStockAdjustmentDetails(){
    this.isLoading2 = true;
    try{
      this.stockAdjustmentHeader = await firstValueFrom(this.stockAdjustmentHeadersService.getStockAdjustmentHeaderByRecordStatusByInputByByAdjustmentType('ongoing',this.auth_service.User, this.adjustmentType));

      if (!this.stockAdjustmentHeader) {
        this.stockAdjustmentDetails = [];
        this.reasonId = this.reasons[0].ReasonId;
        this.transCode = null;
      }
      else{
        this.stockAdjustmentDetails = await firstValueFrom(this.stockAdjustmentDetailsService.getStockAdjustmentDetailsByTransCode(this.stockAdjustmentHeader.TransCode));
        this.reasonId = this.stockAdjustmentHeader.ReasonId;
        this.transCode = this.stockAdjustmentHeader.TransCode;
      }
    }
    finally{
      this.isLoading2 = false;
      this.displayStockAdjustmentDetails();
    }
  } 


  // async getStockAdjustmentDetails(){
  //   if(this.transCode == null){
  //     await this.getTransCode();
  //   }
  //   this.isLoading2 = true;
  //   this.stockAdjustmentHeader  = await firstValueFrom(this.stockAdjustmentHeadersService.getStockAdjustmentHeaderByTransCode(this.transCode));
  //   this.stockAdjustmentDetails =  await firstValueFrom(this.stockAdjustmentDetailsService.getStockAdjustmentDetailsByTransCode(this.transCode));

  //   if(this.stockAdjustmentHeader){
  //     if(this.stockAdjustmentHeader.ReasonId){
  //         this.reasonId = this.stockAdjustmentHeader.ReasonId
  //     }
  //   }else{
  //     this.reasonId = this.reasons[0].ReasonId;
  //     if(!this.reasonId){
  //       this.reasonId = this.reasons[0].ReasonId;
  //     }
  //   }
    
  //   if(this.stockAdjustmentDetails)
  //     this.isLoading2 = false;
  //   this.displayStockAdjustmentDetails();
  // } 


  async getStocks(){
    this.isLoading1 = true;
    this.stocks = await firstValueFrom(this.stocksService.getCBOStocksForTransaction());
    this.filteredStocks = this.stocks;
    this.isLoading1 = false;
    this.displayStocks();
  }

  async adjustQty() {
    for (const data of this.stockAdjustmentDetails) {
      if (this.stocks && this.stocks.length > 0) {
        const newQty = data.Qty * data.Conversion;

        if (this.adjustmentType.toLowerCase() == "stockout")
        {
          this.stocks
          .filter(w => w.ItemId === data.ItemId)
          .forEach(i => {
            i.Available = +i.Available - +newQty;
          });
        }else{
          this.stocks
          .filter(w => w.ItemId === data.ItemId)
          .forEach(i => {
            i.Available = +i.Available + +newQty;
          });
        }
       
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

    this.listData1._updateChangeSubscription();
  }

  displayStocks(){
    var data = this.filteredStocks; 
    this.resetSearchBoxes();
    this.listData1 = new MatTableDataSource(data);
    this.listData1.paginator = this.paginator1;
    this.searchInput.nativeElement.focus();
  }

  displayStockAdjustmentDetails(){
    var data = this.stockAdjustmentDetails; 
    this.totalAmount = this.stockAdjustmentDetails.reduce((sum, x) => sum + +x.Amount, 0);
    this.selectedId = undefined;
    this.selectedData = undefined;
    this.listData2 = new MatTableDataSource(data);
    this.listData2.paginator = this.paginator2;
  }

  async onChangeReason(data){
    if(this.stockAdjustmentDetails.length > 0){
      return this.notificationService.popupWarning3Buttons('Ongoing Transaction', 'Transaction for '+this.stockAdjustmentDetails[0].ReasonName+' is ongoing. Save transaction as pending first to avoid data loss. CONTINUE?', 'Override Reason', 'Save as Pending', 'Cancel').then((result) => {
        if (result.isConfirmed) {
          this.stockAdjustmentTransactionService.saveAsPendingStockAdjustmentByTransCode(this.transCode).subscribe({
            next:async (res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.reasonId = data.ReasonId;
              await this.getTransCode();
              this.stockAdjustmentHeader = null;   // Save As Pending: start a new transaction (the saved one stays in Show Pending, Desktop)
              this.stockAdjustmentDetails = [];
              this.displayStockAdjustmentDetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
        }
        else if (result.isDenied) {
          this.stockAdjustmentTransactionService.overrideStockAdjustmentReasonByTransCode(this.transCode, data.ReasonId).subscribe({
            next:async (res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.reasonId = data.ReasonId;
              await this.getTransCode();
              this.getStockAdjustmentDetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
        }
        else{
          this.reasonId = this.stockAdjustmentDetails[0].ReasonId;
        }
        
      });
    }
  
  }
 getTotalQtyInTransaction(itemId: string): number {
  return this.stockAdjustmentDetails
    .filter(d => d.ItemId === itemId)
    .reduce((sum, x) => sum + (+x.Qty || 0), 0);
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
    this.selectedItem.ReasonId = this.reasonId;

    this.saveToStockAdjustmentHeaders();
  }

  saveToStockAdjustmentHeaders()
  {
    if(this.reasonId == undefined)
      return this.notif.toastrWarning("Reason Not Found.");

    else {
      this.stockAdjustmentTransactionService.saveToStockAdjustmentHeaders(this.adjustmentType.toLowerCase(),  this.selectedItem.ItemId, this.qty ?? 1, this.transCode, this.reasonId, this.selectedItem.Price, this.selectedItem.UM, this.recordStatus).subscribe({
        next: (res)=>{
        this.transCode = res.stockAdjustmentDetail?.TransNo ?? this.transCode;  // the first line gets the temporary TransNo
          this.notif.toastrSuccess(res.message);
          this.stockAdjustmentDetails = [ res.stockAdjustmentDetail,...this.stockAdjustmentDetails]; 
          this.displayStockAdjustmentDetails();
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
    if(this.stockAdjustmentDetails.length == 0)
      return this.notificationService.toastrWarning('Empty Transaction');

    var reason:any = await firstValueFrom(this.reasonsService.getReasonByReasonId(this.reasonId));

    this.disableSave = true;
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '800px';
    dialogConfig.data = ([reason,this.stockAdjustmentHeader, this.transCode, this.totalAmount,this.adjustmentType.toLowerCase(), this.recordStatus,'savestockadjustmenttransaction']);
    this.dialog.open(StockAdjustmentHeaderUIComponent,dialogConfig).beforeClosed().subscribe(async x => {
      if(x){
        await this.getTransCode();
        // this.getStocks();
        this.adjustQty();
        this.stockAdjustmentHeader = null;
        // this.reasonId = 'CASH';
        this.stockAdjustmentDetails= [];
        this.displayStockAdjustmentDetails();
        this.resetSearchBoxes();
      }
    });
    
  }

 async onClickEdit(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    
    var stockAdjustmentDetail:any = await firstValueFrom(this.stockAdjustmentDetailsService.getStockAdjustmentDetailById(this.selectedData.id));
    var stock:any = await firstValueFrom(this.stocksService.getItemByItemId(this.selectedData.ItemId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = ([stockAdjustmentDetail,stock, 'updatestockadjustmenttransaction', stockAdjustmentDetail.AdjustmentType]);
    this.dialog.open(StockAdjustmentDetailUIComponent,dialogConfig).beforeClosed().subscribe(stockAdjustmentDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(stockAdjustmentDetail) ? stockAdjustmentDetail[0] : stockAdjustmentDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo
      if(stockAdjustmentDetail){
        const stockAdjustmentDetailIndex = this.stockAdjustmentDetails.findIndex(detail => detail.id === stockAdjustmentDetail.id);
        if (stockAdjustmentDetailIndex !== -1) {
          this.stockAdjustmentDetails[stockAdjustmentDetailIndex] = stockAdjustmentDetail;  
        }
        this.displayStockAdjustmentDetails();
      }
    });
  }

  onClickRemove(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notificationService.popupWarning("Delete Record",this.selectedData.ItemName+ " will be remove. Continue?").then((result) => {
      if (result.value) {
        this.stockAdjustmentTransactionService.deleteStockAdjustmentDetailById(this.selectedData.id).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.stockAdjustmentDetails = this.stockAdjustmentDetails.filter(x => x.id != this.selectedData.id);
              this.displayStockAdjustmentDetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error.message);
            },
        });
      }
    });
  }

  onClickRemoveAll(){
    if(this.stockAdjustmentDetails.length == 0)
      return this.notificationService.toastrWarning('Empty Transaction');

    this.notificationService.popupWarning("Delete Record","All Items will be REMOVED. Continue?").then((result) => {
      if (result.value) {
        this.stockAdjustmentTransactionService.deleteStockAdjustmentDetailsByTransCode(this.transCode).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.stockAdjustmentDetails = [];
              this.displayStockAdjustmentDetails();
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

    var iNDetail:any = await firstValueFrom(this.stockAdjustmentDetailsService.getStockAdjustmentDetailById(this.selectedId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data         = ([iNDetail, 'stockadjustmenttransaction', '']);
    dialogConfig.viewContainerRef = this.viewContainerRef; 

    if(this.adjustmentType.toLowerCase() == 'stockin'){
      this.dialog.open(InSerialNosUIComponent,dialogConfig).beforeClosed().subscribe(stockAdjustmentDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(stockAdjustmentDetail) ? stockAdjustmentDetail[0] : stockAdjustmentDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo
        this.getStockAdjustmentDetails();
      });
    }else{
      this.dialog.open(OutSerialNosUIComponent,dialogConfig).beforeClosed().subscribe(stockAdjustmentDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(stockAdjustmentDetail) ? stockAdjustmentDetail[0] : stockAdjustmentDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo
        this.getStockAdjustmentDetails();
      });
    }
    
  }

  onClickSaveAsPending(){
    if(this.stockAdjustmentDetails.length == 0)
      return this.notificationService.toastrWarning('Empty Transaction');

    this.notificationService.popupWarning("Pending StockAdjustment","All Items will be save as pending. Continue?").then((result) => {
      if (result.value) {
        this.stockAdjustmentTransactionService.saveAsPendingStockAdjustmentByTransCode(this.transCode).subscribe({
            next:async (res)=>{
              this.notificationService.toastrSuccess(res.message);
              await this.getTransCode();
              this.stockAdjustmentHeader = null;   // Save As Pending: start a new transaction (the saved one stays in Show Pending, Desktop)
              this.stockAdjustmentDetails = [];
              this.displayStockAdjustmentDetails();
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
    dialogConfig.data        = ([this.transCode,this.adjustmentType.toLowerCase()]);
    dialogConfig.viewContainerRef = this.viewContainerRef; 
    this.dialog.open(StockAdjustmentPendingTransactionsUIComponent,dialogConfig).beforeClosed().subscribe(res => {
      if(res){
        this.transCode = res.transCode; 
        this.stockAdjustmentDetails = res.stockAdjustmentDetails; 
        this.stockAdjustmentHeader = res.stockAdjustmentHeader; 
        this.reasonId = res.stockAdjustmentHeader.ReasonId; 
        this.displayStockAdjustmentDetails();
      }
    });
  }

  onClickLoadStockTransfer(){
    if(this.adjustmentType.toLowerCase() != 'stockin')
        return this.notif.toastrWarning("Action Allowed For StockIn Only.");
      
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '2000px';
    dialogConfig.data        = ([this.transCode,this.adjustmentType.toLowerCase()]);
    dialogConfig.viewContainerRef = this.viewContainerRef; 
    this.dialog.open(LoadStocksTransferUIComponent,dialogConfig).beforeClosed().subscribe(async res => {
      if(res){
        await this.getReasons();
        this.transCode = res.transCode; 
        this.stockAdjustmentDetails = res.stockAdjustmentDetails; 
        this.stockAdjustmentHeader = res.stockAdjustmentHeader; 
        this.reasonId = res.stockAdjustmentHeader.ReasonId; 
        this.displayStockAdjustmentDetails();
      }
    });
  }

  onClickLoadItems(){
    this.getStocks();

    // const dialogConfig        = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus    = true;
    // dialogConfig.width        = '1500px';
    // dialogConfig.data         = ([this.transCode, this.reasonId,this.stockAdjustmentDetails, 'stockadjustmenttransaction', 'stocks', this.adjustmentType.toLowerCase()]);
    // this.dialog.open(LoadItemsForStockAdjustmentUIComponent,dialogConfig).beforeClosed().subscribe(stockAdjustmentDetails => {
    //   this.stockAdjustmentDetails = stockAdjustmentDetails; 
    //   this.displayStockAdjustmentDetails();
    // });
  }

  onClickReasonItems(){
    if(this.reasonId.toLowerCase() == 'cash')
        return this.notif.toastrWarning("Please Select Reason.")
    else{
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1500px';
      dialogConfig.data         = ([this.transCode, this.reasonId,this.stockAdjustmentDetails, 'stockAdjustmenttransaction', 'reasonitems']);
      this.dialog.open(LoadItemsForStockAdjustmentUIComponent,dialogConfig).beforeClosed().subscribe(stockAdjustmentDetails => {
      if (!this.transCode) this.transCode = (Array.isArray(stockAdjustmentDetails) ? stockAdjustmentDetails[0] : stockAdjustmentDetails)?.TransNo ?? null;  // the first line gets the temporary TransNo
        this.stockAdjustmentDetails = stockAdjustmentDetails; 
        this.displayStockAdjustmentDetails();
      });
    }
  }

  onClickNewReason(){
          if (!this.matTableService.CommonTransaction()) {
      return;
    }
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = this.adjustmentType.toLowerCase();
    this.dialog.open(ReasonsUIComponent,dialogConfig).beforeClosed().subscribe(reasons => {
      if(reasons){
        this.reasons = reasons; 
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
    dialogConfig.data        = (['', 'stockadjustment',[], this.adjustmentType]);
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

  updateElementStockAdjustmentDetail(event: any, id, Column){
     const stockAdjustmentDetailIndex =
    this.stockAdjustmentDetails.findIndex(detail => detail.id === id);

  if (stockAdjustmentDetailIndex === -1) return;

  const oldValue = this.stockAdjustmentDetails[stockAdjustmentDetailIndex][Column];

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
        event.target.value = oldValue;
        return this.notif.toastrWarning(Value+' is not a number.');
      } 
    }
    this.stockAdjustmentTransactionService.updateElementStockAdjustmentDetail(id, Column, Value).subscribe({
      next:(res) =>{
        this.notif.toastrSuccess(res.message);

        //update stockAdjustmentDetailsDisplay
        const stockAdjustmentDetailIndex = this.stockAdjustmentDetails.findIndex(detail => detail.id === id);
        if (stockAdjustmentDetailIndex !== -1) {
          this.stockAdjustmentDetails[stockAdjustmentDetailIndex] = res.stockAdjustmentDetail;  
        }
        this.displayStockAdjustmentDetails();
      },
      error:(err) => {
        this.notif.toastrError(err.error.message);
        this.stockAdjustmentDetails[stockAdjustmentDetailIndex][Column] = oldValue;
        event.target.value = oldValue;
        this.displayStockAdjustmentDetails();
      },
    });
  }

  async onChangeAdjustmentType(){
    await this.getReasons();
    await this.getTransCode();
    await this.getStockAdjustmentDetails();
  }


  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  onContextMenu(event: MouseEvent, data: any, type) {
    this.rightClickType = type;
    if(data)
     if(type == 'stockadjustmentdetails'){
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
