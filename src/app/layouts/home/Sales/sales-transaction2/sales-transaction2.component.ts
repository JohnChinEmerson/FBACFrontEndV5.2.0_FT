import { AfterViewInit, Component, ElementRef, HostListener, Input, NgZone, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { _url } from 'src/global-variables';
import { fitTilePageSize } from 'src/app/layouts/shared/tile-pager';
import { OnScreenKeyboardService } from 'src/app/services/on-screen-keyboard.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { SalesConfigPerMachineService } from 'src/app/services/Sales/sales-config-per-machine.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DateZReadingsService } from 'src/app/services/BIR/date-zreadings.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { CustomersService } from 'src/app/services/Files/customers.service';
import { ItemPriceCategorysService } from 'src/app/services/Files/item-price-categorys.service';
import { StocksService } from 'src/app/services/Inventory/stocks.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { OrderHeadersService } from 'src/app/services/Orders/order-headers.service';
import { SaleConfigAccessRightsService } from 'src/app/services/Sales/sale-config-access-rights.service';
import { SaleConfigService } from 'src/app/services/Sales/sale-config.service';
import { SaleDetailsService } from 'src/app/services/Sales/sale-details.service';
import { SaleHeadersService } from 'src/app/services/Sales/sale-headers.service';
import { SalesTransactionService } from 'src/app/services/Sales/sales-transaction.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { CustomerPointsUIComponent } from '../../Files/customer-points-ui/customer-points-ui.component';
import { CustomerUIComponent } from '../../Files/customer-ui/customer-ui.component';
import { HomeComponent } from '../../home.component';
import { PendingSaleOrdersUIComponent } from '../../Orders/pending-sale-orders-ui/pending-sale-orders-ui.component';
import { LoadItemsForSaleUIComponent } from '../load-items-for-sale-ui/load-items-for-sale-ui.component';
import { PasswordUIComponent } from '../password-ui/password-ui.component';
import { SetUpgradeUIComponent } from '../set-upgrade-ui/set-upgrade-ui.component';
import { PendingTransactionsUIComponent } from '../pending-transactions-ui/pending-transactions-ui.component';
import { SaleDetailUIComponent } from '../sale-detail-ui/sale-detail-ui.component';
import { SaleHeaderUIComponent } from '../sale-header-ui/sale-header-ui.component';
import { UseForTaggingsService } from 'src/app/services/Files/use-for-taggings.service';
import { ItemCategorysService } from 'src/app/services/Files/item-categorys.service';
import { MultipleUMsComponent } from '../../Files/multiple-ums/multiple-ums.component';
import { ItemPriceCategorysUIComponent } from '../../Files/item-price-categorys-ui/item-price-categorys-ui.component';
import { BarcodeUIComponent } from '../../Files/barcode-ui/barcode-ui.component';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { SaleSerialNosUIComponent } from '../sale-serial-nos-ui/sale-serial-nos-ui.component';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ItemsService } from 'src/app/services/Files/items.service';
import { RowClassesPipe, RowDisplayPipe } from 'src/app/services/mat-table.pipes';
import { SaleRestaurantService } from 'src/app/services/Sales/sale-restaurant.service';
import { PrintService } from 'src/app/services/print.service';
import { Router } from '@angular/router';
import { KitchenQueueService } from 'src/app/services/Sales/kitchen-queue.service';
import { KitchenReadyUIComponent } from '../kitchen-ready-ui/kitchen-ready-ui.component';
import { _kitchenNoticeSeconds, _kitchenRefreshMs } from 'src/global-variables';

// phones (portrait and landscape) get the phone layout; tablets keep the Desktop layout in both orientations
const PHONE_QUERY = '(max-width: 767.98px), (max-height: 500px) and (orientation: landscape)';

@Component({
  selector: 'app-sales-transaction2',
  templateUrl: './sales-transaction2.component.html',
  styleUrls: ['./sales-transaction2.component.css'],
})
export class SalesTransaction2Component implements OnInit, AfterViewInit, OnDestroy {
  @Input() action: any; // This will receive `indexTables` from SalesJournalComponent

  stocks          : any=[];
  filteredStocks  : any=[];
  customers       : any=[];
  customerId      : string = 'CASH';
  itemId          : string ="";
  selectedItem    : any;
  selectedRowIndex : number = 0;
  selectedCustomer: any;
  previousCustomerId: any;  
  qty               :  number;
  amountPaid: number;
  change: any;
  amountPaidFocus : boolean = false;


  saleDetails     : any=[];
  saleHeader      : any=[];
  oHeader         : any=[];

  listData1        : MatTableDataSource<any>;
  searchKey1       : string;
  isLoading1       : boolean = false;
  
  listData2        : MatTableDataSource<any>;
  searchKey2       : string;
  isLoading2       : boolean = false;

  rightClickType  : string = 'saledetails';
  transNo         : string  = null;  // the pending sale (temporary TransNo, Desktop TmpNo) or the paid one
  totalAmount     : number = 0;
  selectedId      : string;
  selectedData    : any;
  saleConfig      : any=[];
  saleConfigAccessright: any=[];
  saleConfigPerMachine : any = null;
  disableSave     : boolean = false;
  disableAmountPaid     : boolean = false;
  recordStatusCashiering : string = 'open';
  isColorOutOfStock : boolean = true;
  defaultColumns  = ['ItemId', 'ItemName','UM','Price','Available'];
  defaultColumns2: any[] = [
    'Qty',
    'UM',
    'ItemName',
    'Price',
    'Discount',
    'DiscountValue',
    'Amount',
  ];
  // order grid headings that are too long for their column (the others show the column name)
  columnLabels2: { [key: string]: string } = { Discount: 'Disc.', DiscountValue: 'Disc. Value' };

  
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Price','Available', 'Qty', 'Discount', 'DiscountValue', 'Amount',],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};
  

  pageIndex        : number = 0;
  pageSize         : number = 24;
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('dataTable', { static: false }) dataTable!: ElementRef;
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;
  @ViewChild('amountpd') amountpd: ElementRef;
  @ViewChild('customerSelect') customerSelect!: NgSelectComponent;
  @ViewChildren('rowElement', { read: ElementRef }) rows!: QueryList<ElementRef>;
  @ViewChild('tableContainer', { static: false }) tableContainer!: ElementRef;

  toolButtons     = [
    {'Label'   : 'New Customer','Function'             : () => this.onClickNewCustomer(),'Disabled': true,}, 
  ];

  // Desktop SaleTransUI has no Qty box / New Item / LOAD ITEMS / USE FOR / CATEGORY / REBATES buttons:
  // a product tile adds qty 1 (or opens the qty popup when Sales Config PopupQty = yes).
  toggleButtons     = [
    {'Label'   : 'SAVE TRANSACTION-F4','Function'    : () => this.onClickSaveTransaction(),'Disabled': true,},
  ];
  contextButtons1  =  [
   {'Label'   : 'Add Barcode','Function'  : () => this.onClickAddBarcode(),'Disabled': true,}, 
   {'Label'   : 'Multiple UMs','Function'  : () => this.onClickMultipleUMs(),'Disabled': true,}, 
    {'Label'   : 'Price Categories','Function'  : () => this.onClickOtherPriceCategories(),'Disabled': true,}, 
  ];
  contextButtons2  =  [
    {'Label'   : 'Edit','Function'            : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Remove','Function'          : () => this.onClickRemove(),'Disabled': true,}, 
    {'Label'   : 'Remove All','Function'      : () => this.onClickRemoveAll(),'Disabled': true,},
    {'Label'   : 'Cancel Order','Function'    : () => this.onClickCancelOrder(),'Disabled': true,},
  ];

  // ===== Desktop SaleTransUI layout / restaurant workflow =====
  hasTable            : boolean = false;   // Sales Config HasTable
  multipleTable       : boolean = false;   // Files Config MultipleTable
  activeTab           : string = 'category';  // tablecategory | table | category | product
  tableCategorys      : any[] = [];
  selectedTableCategory : string = 'All';
  tables              : any[] = [];
  currentTable        : any = null;
  orderType           : string = 'Dine in';
  tableMode           : string = null;     // 'transfer' | 'merge' while picking the target table
  currentOrderPaid    : boolean = false;   // table order already paid, waiting for COMPLETE
  completeAfterPay    : boolean = false;
  splitMode           : boolean = false;
  splitBy             : 'items' | 'amount' = 'items';
  splitAmount         : number = null;     // SPLIT by amount: what the new bill takes
  splitIds            : Set<number> = new Set<number>();
  splitOriginalTransNo : string = null;
  upgradeVisible      : boolean = false;
  setComponents       : any[] = [];
  upgradeLine         : any = null;
  showPrice           : boolean = true;
  categoryTiles       : string[] = [];
  selectedCategory    : string = 'All';
  tilePageIndex       : number = 0;
  tilePageSize        : number = 24;
  isLoadingTables     : boolean = false;
  private subscriptions = new Subscription();

  // Desktop toolButtons strip (LOAD S.O / POINTS / SHOW PRICE). The Label is the access right button name
  // ("Load S.O"; the screen shows it in capitals): with "LOAD S.O" HasButton never matched and it stayed disabled.
  toolButtons3     = [
    {'Label'   : 'Load S.O','Function'          : () => this.onClickLoadSO(),'Disabled': true,},
    {'Label'   : 'POINTS','Function'            : () => this.onClickPoints(),'Disabled': true,},
  ];
  // Desktop panel12: SEND / SERVE / UPGRADE / TRANSFER / SPLIT / MERGE
  restaurantButtons1 = [
    {'Label'   : 'SEND','Function'              : () => this.onClickSendOrder(),'Disabled': true,},
    {'Label'   : 'SERVE','Function'             : () => this.onClickServe(),'Disabled': true,},
    {'Label'   : 'UPGRADE','Function'           : () => this.onClickUpgrade(),'Disabled': true,},
    {'Label'   : 'TRANSFER','Function'          : () => this.onClickTransfer(),'Disabled': true,},
    {'Label'   : 'SPLIT','Function'             : () => this.onClickSplit(),'Disabled': true,},
    {'Label'   : 'MERGE','Function'             : () => this.onClickMerge(),'Disabled': true,},
  ];
  // Desktop panel15: BILL OUT / PAY / DINE IN / TAKE OUT / COMPLETE
  restaurantButtons2 = [
    {'Label'   : 'BILL OUT','Function'          : () => this.onClickBillOut(),'Disabled': true,},
    {'Label'   : 'PAY','Function'               : () => this.onClickPay(),'Disabled': true,},
    {'Label'   : 'DINE IN','Function'           : () => this.onClickOrderType('Dine in'),'Disabled': true,},
    {'Label'   : 'TAKE OUT','Function'          : () => this.onClickOrderType('Take out'),'Disabled': true,},
    {'Label'   : 'COMPLETE','Function'          : () => this.onClickComplete(),'Disabled': true,},
  ];
  constructor(
    private dialog          : MatDialog,
    public osk              : OnScreenKeyboardService,
    private stocksService    : StocksService,
    private customersService     : CustomersService,
    private salesTransactionService      : SalesTransactionService,
    private saleHeadersService      : SaleHeadersService,
    private saleDetailsService      : SaleDetailsService,
    private saleConfigService     : SaleConfigService,
    private saleConfigAccessRightsService     : SaleConfigAccessRightsService,
    private notif           : NotificationService,
    private auth_service    : AuthService,
    public toolBoxService : ToolBoxService,
    public matTableService : MatTableService,
    private numbersService : NumbersService,
    private orderHeadersService : OrderHeadersService,
    private stringHelperService : StringHelperService,
    private useForTaggingsService : UseForTaggingsService,
    private itemsService : ItemsService,
    private itemCategorysService : ItemCategorysService,
    private itemPriceCategorysService : ItemPriceCategorysService,
    private homeTs : HomeComponent,
    private notificationService : NotificationService,
    private dateZReadingsService : DateZReadingsService,
    private dateTimesService : DateTimesService,
    private globalConfigService : GlobalConfigService,
     private viewContainerRef : ViewContainerRef,
    private saleRestaurantService : SaleRestaurantService,
    private printService : PrintService,
    private router : Router,
    private ngZone : NgZone,
    private salesConfigPerMachineService : SalesConfigPerMachineService,
    private breakpointObserver : BreakpointObserver,
    private kitchenQueueService : KitchenQueueService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    if(!this.action){
      this.action = 'Sales';
    }
    if(this.action.toLowerCase() == 'ordering'){
      this.recordStatusCashiering = 'pending';
    }
    // 1. what decides the first screen, in parallel: config, button rights, HasTable / MultipleTable
    await Promise.all([this.getSaleConfig(), this.homeTs.getButtons(), this.loadRestaurantConfig()]);
    this.toolBoxService.disableButtons(this.toolButtons, null, this.toggleButtons, this.contextButtons2);
    this.toolBoxService.disableButtons(this.contextButtons1, null, null, null);
    this.toolBoxService.disableButtons(this.toolButtons3, this.restaurantButtons1, this.restaurantButtons2, null);

    if (this.hasTable) {
      // 2. restaurant: TABLE CATEGORY / TABLE first; an order loads only when its table is selected
      await this.selectTab(this.multipleTable ? 'tablecategory' : 'table');
      // 3. categories / items / customers in the background
      this.loadInBackground(true);
    } else {
      // retail: the category tiles and the ongoing sale are the first screen
      this.activeTab = 'category';
      this.loadInBackground(false);
      await this.getStocks();
      await this.getSaleDetails();
    }

    // unsubscribed in ngOnDestroy (each visit of the screen used to add subscribers that outlived it)
    this.subscriptions.add(this.useForTaggingsService.requiredRefresh.subscribe(()=>{
      this.displayStocks();
    }));
    this.subscriptions.add(this.itemCategorysService.requiredRefresh.subscribe(()=>{
      this.displayStocks();
    }));
    // restaurant: kitchen statuses and "ready to serve" notices, only while this screen is open
    if (this.hasTable) this.watchKitchen();

   
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

  async getSaleConfig(){
    this.saleConfig = await firstValueFrom(this.saleConfigService.getSaleConfig());
    this.osk.setEnabled(this, this.onScreenKeyboard);
    this.saleConfigAccessright = await firstValueFrom(this.saleConfigAccessRightsService.getSaleConfigAccessRightByAccessRightName(this.auth_service.UserAccount.AccessRightName));
  }

  // Desktop: like on the Desktop a sale has no number until the first item; the first line saved gets a
  // temporary TransNo (TmpNo) from the server and the next lines join it
  newSale(){
    this.transNo = null;
    this.saleHeader = null;
    this.saleDetails = [];
  }
  // Reloads the order on screen. With no order open: Desktop LoadPendingTransaction for counter sales (the
  // cashier's pending sale of his current reading comes back); a table order is only opened from its table, so a
  // reload never brings another (counter) cart onto the selected table.
  async getSaleDetails(){
    if (this.currentOrderPaid) return this.displaySaleDetails();   // a paid table order does not change
    this.isLoading2 = true;
    try{
      var transNo: any = this.transNo || (this.hasTable ? null : await firstValueFrom(this.salesTransactionService.getPendingSaleTransNo()));
      if (typeof transNo != 'string' || !transNo) transNo = null;   // no pending sale
      var res: any = transNo ? await firstValueFrom(this.salesTransactionService.resumePendingSale(transNo)).catch(() => null) : null;

      if (!res) {
        this.newSale();
        if (!this.hasTable) this.customerId = 'CASH';
      }
      else{
        this.saleHeader = res.saleHeader;
        this.saleDetails = res.saleDetails;
        this.customerId = this.saleHeader.CustomerId;
        this.transNo = res.transNo;

        this.rePriceStocks();

      }
    }
    finally{
      this.isLoading2 = false;
      this.displaySaleDetails();
    }
  }
  
  //old code
  // async getSaleDetails(){
  //   if(this.transNo == null){
  //     await this.getTransCode();
  //   }
  //   this.isLoading2 = true;
  //   this.saleHeader  = await firstValueFrom(this.saleHeadersService.getSaleHeaderByTransCode(this.transNo));
  //   this.saleDetails =  await firstValueFrom(this.saleDetailsService.getSaleDetailsByTransCode(this.transNo));
  //   if(this.saleHeader){
  //     if(this.saleHeader.CustomerId){
  //       if(this.customerId  != 'CASH'){
  //         this.customerId = this.customerId
  //       }else{
  //         this.customerId = this.saleHeader.CustomerId
  //       }
  //     }
  //   }else{
  //     if(!this.customerId){
  //       this.customerId = 'CASH';
  //     }
  //   }
    
  //   if(this.saleDetails)
  //     this.isLoading2 = false;
  //   this.displaySaleDetails();
  // } 

  // not awaited: none of it is needed to show the first screen
  private loadInBackground(withStocks: boolean){
    this.getCustomers().catch(() => {});
    this.globalConfigService.isColorOutOfStock().then(v => this.isColorOutOfStock = v).catch(() => {});
    if (this.hasTable)
      firstValueFrom(this.salesConfigPerMachineService.getSaleConfigPerMachineByComputerName(this.auth_service.UserAccount.ComputerName))
        .then(c => this.saleConfigPerMachine = c).catch(() => {});
    if (withStocks) this.getStocks().catch(() => this.isLoading1 = false);
  }

  // one request at a time: a second call (e.g. customer change while loading) waits for the running one
  private stocksRequest: Promise<void> = null;
  getStocks(): Promise<void> {
    if (this.stocksRequest) return this.stocksRequest;
    this.stocksRequest = this.loadStocks().finally(() => this.stocksRequest = null);
    return this.stocksRequest;
  }

  private async loadStocks(){
    localStorage.removeItem('Category');
    localStorage.removeItem('UseFor');
    this.isLoading1 = true;

    if(this.saleConfig.HideZeroItemQty.toLowerCase() == 'yes')
      this.stocks = await firstValueFrom(this.stocksService.getCBOStocksForSaleByItemType('hide zero item qty'));
    else
      this.stocks = await firstValueFrom(this.stocksService.getCBOStocksForSaleByItemType('all'));
    await this.rePriceStocks();
    this.buildCategoryTiles();
    if (this.activeTab == 'category' || this.activeTab == 'product') this.scheduleFitTiles();
  }

async adjustQty() {
    // items by ItemId once, instead of a search of the whole stock list per line and per grid row
    const stocksById = new Map<string, any[]>();
    for (const stock of this.stocks || []) {
      if (!stocksById.has(stock.ItemId)) stocksById.set(stock.ItemId, []);
      stocksById.get(stock.ItemId).push(stock);
    }
    for (const data of this.saleDetails) {
      if (data.ValidateQty?.toLowerCase() === 'no' && data.HasInventory?.toLowerCase() === 'yes') {
        const newQty = data.Qty * data.Conversion;
        (stocksById.get(data.ItemId) || []).forEach(i => i.Available = +i.Available - +newQty);
      }
    }

    // BUG SA AVAILABLE DILI MO DEDUCT UNLESS E LOAD ITEMS
    this.listData1.data = this.listData1.data.map(row => {
      const stock = stocksById.get(row.ItemId)?.[0];
      return stock ? { ...row, Available: stock.Available } : row;
    });

    this.listData1._updateChangeSubscription();
  }

  async rePopulateQty(itemId){
    var current:any = await firstValueFrom(this.stocksService.getItemByItemId(itemId));
    this.setAvailable(itemId, current.Available);
  }

  private setAvailable(itemId, available){
    this.stocks
      .filter(w => w.ItemId === itemId)
      .forEach(i => {
        i.Available = available;
      });
  }

  async rePriceStocks(){
    if (this.customerId.toLowerCase() != "" && this.customerId.toLowerCase( ) != "cash")
    {
      //refresh list
      this.listData1 = new MatTableDataSource([]);

      this.stocks = await firstValueFrom(this.stocksService.repriceStocksByCustomerId(this.customerId, this.stocks));
      this.filteredStocks = this.stocks;
    }else{
      this.filteredStocks = this.stocks;
    }
    this.isLoading1 = false;
    this.displayStocks();
  }

  
  displayStocks(){
    var data = this.filteredStocks; 

    var useFor = localStorage.getItem('UseFor') ?? null;
    if(useFor && useFor.toLowerCase() != 'all'){
      data = data.filter(x=> x.UseFor.toLowerCase() == useFor.toLowerCase())
    }

    var category = localStorage.getItem('Category') ?? null;
    if(category && category.toLowerCase() != 'all'){
      data = data.filter(x=> x.Category.toLowerCase() == category.toLowerCase())
    }

    this.resetSearchBoxes();
    this.listData1 = new MatTableDataSource(data);
    this.pageIndex = 0;
    this.focusSearch();
  }

  displaySaleDetails(){
    // component lines of a Set (SetId) are zero-priced and shown only in the UPGRADE panel, like the Desktop
    this.saleDetails = (this.saleDetails || []).filter(x => !x.SetId || x.SetId == 'NA');
    var data = this.saleDetails;
    this.totalAmount = this.saleDetails.reduce((sum, x) => sum + +x.Amount, 0);
    this.selectedId = undefined;
    this.selectedData = undefined;
    this.listData2 = new MatTableDataSource(data);
    this.listData2.paginator = this.paginator2;
  }

  async onChangeCustomer(data){
    // with tables the pending order belongs to the table, not to the customer (Desktop: customer changes never load
    // another pending sale): a table's loaded order keeps its customer; a new order just takes the new one
    if (this.hasTable) {
      if (this.customerLocked) {
        this.customerId = this.saleHeader?.CustomerId || this.saleDetails[0]?.CustomerId || 'CASH';
        return this.notificationService.toastrWarning('This table\'s order keeps its customer.');
      }
      if (this.transNo && this.saleDetails.length > 0 && data?.CustomerId) {
        try {
          await firstValueFrom(this.salesTransactionService.overrideSaleCustomer(this.transNo, data.CustomerId));
        } catch (err: any) {
          this.notificationService.toastrHttpError(err, 'Unable to change the customer.');
        }
      }
      await this.getStocks();
      return;
    }
    if(this.saleDetails.length > 0){
      return this.notificationService.popupWarning3Buttons('Ongoing Transaction', 'Transaction for '+this.saleDetails[0].CustomerName+' is ongoing. Save transaction as pending first to avoid data loss. CONTINUE?', 'Override Customer', 'Save as Pending', 'Cancel').then(async (result) => {
        if (result.isConfirmed) {
          // the lines are already saved as pending (Desktop): the screen just starts a new sale
          await this.getStocks();
          this.notificationService.toastrSuccess('Saved as pending.');
          this.customerId = data.CustomerId;
          this.newSale();
          this.displaySaleDetails();
        }
        else if (result.isDenied) {
          await this.getStocks();
          this.salesTransactionService.overrideSaleCustomer(this.transNo, data.CustomerId).subscribe({
            next:async (res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.customerId = data.CustomerId;
              this.getSaleDetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error?.message ?? err.error);
            },
        });
        }else{
          this.customerId = this.saleDetails[0].CustomerId;
        }
      });
    }else{
        await this.getStocks();
    }
  }
  
  get pagedItems(): any[] {
    const data = this.listData1?.filteredData ?? [];
    const start = this.pageIndex * this.pageSize;
    return data.slice(start, start + this.pageSize);
  }

  failedPhotos: { [itemId: string]: boolean } = {};
  private readonly foodEmojis: [RegExp, string][] = [
    [/burger/i, '🍔'], [/pizza/i, '🍕'], [/fries|fry/i, '🍟'], [/hot ?dog/i, '🌭'],
    [/chicken|wings?/i, '🍗'], [/pork|bbq|barbecue|sisig|lechon/i, '🍖'], [/beef|steak/i, '🥩'],
    [/fish|tuna|bangus|tilapia/i, '🐟'], [/shrimp|prawn/i, '🍤'], [/rice|fried rice/i, '🍚'],
    [/pasta|spaghetti|carbonara|noodle|pancit|ramen/i, '🍝'], [/soup|sinigang|tinola/i, '🍲'],
    [/salad/i, '🥗'], [/sandwich|club/i, '🥪'], [/egg/i, '🍳'], [/bread|toast|pan de/i, '🍞'],
    [/cake|brownie|cupcake/i, '🍰'], [/ice ?cream|halo/i, '🍨'], [/donut|doughnut/i, '🍩'],
    [/coffee|latte|espresso|cappuccino|americano/i, '☕'], [/tea/i, '🍵'], [/milk/i, '🥛'],
    [/beer/i, '🍺'], [/wine/i, '🍷'], [/juice|lemonade|shake|smoothie/i, '🥤'],
    [/coke|cola|sprite|royal|soda|water|mineral/i, '🥤'], [/fruit|apple/i, '🍎'], [/banana/i, '🍌'],
  ];

  // called by every tile on every change detection: the regex scan is done once per item name
  private emojiCache = new Map<string, string>();
  getItemEmoji(name: string): string {
    var key = name ?? '';
    var emoji = this.emojiCache.get(key);
    if (emoji === undefined) {
      emoji = this.foodEmojis.find(([re]) => re.test(key))?.[1] ?? '🍽️';
      this.emojiCache.set(key, emoji);
    }
    return emoji;
  }

  // ngFor / mat-table keep the existing elements when the lists are rebuilt
  trackById(index: number, row: any) { return row?.id ?? index; }
  trackByItem(index: number, row: any) { return row?.ItemId + '|' + row?.UM; }

  // the item's uploaded photo (Files > Items > Photo, stored under img/files/items)
  getItemPhoto(row: any): string {
    return (_url + 'img/files/items/' + row.Photo).replace('/api', '');
  }

  // Sales Config (Desktop SaleConfigUI): Item Photo and dynamic button size
  get hasPhoto(): boolean {
    return (this.saleConfig?.HasPhoto || 'no').toLowerCase() == 'yes';
  }
  get buttonWidth(): string {
    return +this.saleConfig?.ButtonWidth > 0 ? +this.saleConfig.ButtonWidth + 'px' : null;
  }
  get buttonHeight(): string {
    return +this.saleConfig?.ButtonHeight > 0 ? +this.saleConfig.ButtonHeight + 'px' : null;
  }

  onPageChange(event: PageEvent){
    this.pageIndex = event.pageIndex;
    this.pageSize  = event.pageSize;
  }

  async onClickItemTile(row: any){
    this.getRecord1(row);
    await this.onFocusQty();
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
          const table = document.querySelector('.item-grid') as HTMLElement;
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
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      const step = event.key === 'ArrowRight' ? 1 : -1;
      this.selectedRowIndex = (this.selectedRowIndex + step + data.length) % data.length;
      this.getRecord1(data[this.selectedRowIndex]);
      event.preventDefault();
    }
    this.pageIndex = Math.floor(this.selectedRowIndex / this.pageSize);

    // Scroll logic (same as before)
    setTimeout(() => {
      const rowElems = this.rows?.toArray();
      const selectedRow = rowElems?.[this.selectedRowIndex - this.pageIndex * this.pageSize];
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

@HostListener('document:keydown', ['$event'])
handleKeyboardEvent(event: KeyboardEvent) {
   if (event.key === 'F4') {
    event.preventDefault();
    // while splitting, F4 pays the split part (PAY), never the whole bill
    if (this.splitMode) this.onClickPay();
    else this.onClickSaveTransaction();
  }
   if (event.key === 'F5') {
    event.preventDefault(); 
    this.amountpd.nativeElement.focus();
  }
   if (event.key === 'F6') {
    event.preventDefault();
    this.onClickPoints();
  }
   if (event.key === 'F7') {
    this.customerSelect.focus();
    this.customerSelect.open();
  }
   if (event.key === 'F8') {
    if (this.isPhone) { if (this.itemSearchVisible) this.searchInput?.nativeElement?.focus(); }
    else this.onF8Search();
  }
}
  async onFocusQty(){
    if (this.currentOrderPaid) {
      return this.notificationService.toastrWarning('This table order is already paid. COMPLETE it first.');
    }
    if (this.tableMode) {
      return this.notificationService.toastrWarning('Select the table to ' + this.tableMode + ' first.');
    }
    if(!this.selectedItem || this.selectedItem == undefined){
      this.getFirstRecord();
    }
    if (!this.selectedItem) return;

    // Desktop PopupQtyUI: a tap adds qty 1 straight away; the qty popup only opens when Sales Config
    // PopupQty = yes or the item has other UMs. The tile's stock row already carries the price/UM/cost,
    // so the full item is fetched only for the popup.
    const usePopup = !!this.selectedItem.Multiple || this.saleConfig.PopupQty.toLowerCase() == 'yes'
                     || (this.selectedItem.HasMultipleUMs || 'no').toLowerCase() == 'yes';
    var stock:any = this.selectedItem;
    if (usePopup) {
      var oldPrice = this.selectedItem.Price;
      var oldPriceCategory = this.selectedItem.PriceCategory;
      var origUM = this.selectedItem.UM;
      stock = await firstValueFrom(this.stocksService.getItemByItemId(this.selectedItem.ItemId));
      stock.Price = oldPrice;
      stock.PriceCategory = oldPriceCategory;
      if(this.selectedItem.Multiple){
          stock.UM = origUM;
      }
    }

    if (this.saleConfig.ValidatePrice.toLowerCase() == "yes")
    {
        if (+stock.Price <= 0)
        {
            return this.notificationService.toastrWarning("Price should be greater than zero.");
        }
        if (+stock.Price <= +stock.Cost)
        {
            return this.notificationService.toastrWarning("Price should be greater than cost.");
        }
    }

    if (usePopup) {
      stock.TransNo = this.transNo;
      stock.CustomerId = this.customerId;
      stock.RecordStatusCashiering = this.recordStatusCashiering;
      return this.PopupQtyUI(stock);
    }
    return this.saveToSaleHeaders();
  }
  

  // one request per item: the line is saved, tagged for the restaurant and the item's available qty comes back
  // (it used to be saveToSaleHeaders + afterAddSaleDetail + getItemByItemId)
  // Adds run one after the other. The first add of an order creates its TransNo; an add sent before that answer is
  // back would start a second order, and the lines of that order are not part of the one SEND / PAY works on (they
  // stayed NEW). SEND and PAY wait for the adds in progress (waitForAdds).
  private addChain: Promise<any> = Promise.resolve();

  waitForAdds(): Promise<any> {
    return this.addChain;
  }

  saveToSaleHeaders()
  {
    // the item is read now: the search boxes are cleared by the answer of the add before it
    var item = this.selectedItem;
    var qty = this.qty ?? 1;
    var restaurant = { 'TableId': this.hasTable && this.currentTable ? this.currentTable.id : '', 'OrderType': this.orderType };
    this.addChain = this.addChain.then(() => new Promise<void>(resolve => {
      this.salesTransactionService.saveToSaleHeaders(item.ItemId, qty, this.transNo, this.customerId, item.Price, item.UM, item.PriceCategory, this.recordStatusCashiering, restaurant).subscribe({
        next: (res)=>{
          this.notif.toastrSuccess(res.message);
          this.transNo = res.transNo;
          this.saleDetails = res.saleDetails ?? [ res.saleDetail,...this.saleDetails];
          if (this.saleConfig.ValidateQty.toLowerCase() == "yes" && res.available != null)
              this.setAvailable(res.saleDetail.ItemId, res.available);
          this.displaySaleDetails();
          this.resetSearchBoxes();
          resolve();
        },
        error: (err)=>{
          this.notif.toastrError(err.error.message);
          this.itemId = undefined;
          resolve();
        }
      });
    }));
  }

  async PopupQtyUI(stock)
  {
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = (['',stock, 'additemsalestransaction']);
    this.dialog.open(SaleDetailUIComponent,dialogConfig).beforeClosed().subscribe(saleDetail => {
      if(saleDetail){
        this.transNo = saleDetail.TransNo;
        this.saleDetails = [ saleDetail,...this.saleDetails];
        this.displaySaleDetails();
        if (this.saleConfig.ValidateQty.toLowerCase() == "yes")
            this.rePopulateQty(saleDetail.ItemId);
        this.resetSearchBoxes();
        this.afterAddSaleDetail(saleDetail);
      }
     
    });
  }
  
  async onClickSaveTransaction(){
    await this.waitForAdds();
    if (!this.matTableService.CommonTransaction()) {
      return;
    }
    if(this.saleDetails.length == 0)
      return this.notificationService.toastrWarning('Empty Transaction');

    // the Z-Reading check, the header and the customer are independent: fetched together
    var isBIR = this.auth_service.Edition.toLowerCase()=="pos/bir";
    var [isClose, saleHeader, customer]: any[] = await Promise.all([
      isBIR ? firstValueFrom(this.dateZReadingsService.isZReadingClose(this.auth_service.UserAccount.ComputerName, this.dateTimesService.ConvertToDateFormat(new Date()))) : Promise.resolve(false),
      firstValueFrom(this.saleHeadersService.getSaleOrPending(this.transNo)),
      firstValueFrom(this.customersService.getCustomerByCustomerId(this.customerId)),
    ]);
    if (isClose)
    {
      this.resetPaymentState();
      return this.notificationService.toastrWarning(this.auth_service.UserAccount.ComputerName+" can no longer accept sales.ZReading is already Closed.");
    }
    this.disableAmountPaid = true;
    this.saleHeader = saleHeader;
    // only a sale loaded from a Sales Order (LOAD S.O) carries its order header (advance payment)
    this.oHeader = null;
    var orderNo = (this.saleHeader?.OrderNo ?? '').toString();
    if(orderNo != '' && orderNo != '0' && orderNo.toLowerCase() != 'na' && orderNo != '-'){
      this.oHeader = await firstValueFrom(this.orderHeadersService.getOrderHeaderByTransNo(orderNo));
    }
    this.disableSave = true;
    const paidTransNo       = this.transNo;
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';

    if (this.amountPaidFocus)
    {
      this.toggleButtons[0].Label = 'SAVING....'
      dialogConfig.data = ([customer,this.saleHeader, this.transNo, this.totalAmount,this.oHeader, this.recordStatusCashiering,'savesalestransaction', this.amountPaid]);
      const dialogRef = this.dialog.open(SaleHeaderUIComponent, {
                    ...dialogConfig,
                    hasBackdrop: false, // no dark overlay
                    panelClass: 'hidden-dialog' // custom class to hide it
                  });

      // the dialog is invisible: on a failed save it must close itself, or the screen stays blocked
      dialogRef.componentInstance.closeOnError = true;
      dialogRef.componentInstance.formReady.subscribe(() => {
        dialogRef.componentInstance.onSubmit();
      });

      dialogRef.beforeClosed().subscribe(async x => {
        if (x) {
          this.transNo = null;
          // await this.getStocks();
          this.adjustQty();
          this.saleHeader = null;
          // this.customerId = 'CASH';
          this.saleDetails = [];
          this.displaySaleDetails();
          this.resetSearchBoxes();
        } else {
          // the hidden save failed (its error was shown): give the cashier the screen back
          this.resetPaymentState();
        }
        this.afterPayment(!!x, x?.TransNo || paidTransNo);  // paid: the SaleNo, else the temporary TransNo
      });


    }else{
      //open the dialog
      dialogConfig.data = ([customer,this.saleHeader, this.transNo, this.totalAmount,this.oHeader, this.recordStatusCashiering,'savesalestransaction', '']);
      this.dialog.open(SaleHeaderUIComponent,dialogConfig).beforeClosed().subscribe(async x => {
        if(x){
          this.transNo = null;
          // await this.getStocks();
          this.adjustQty();
          this.saleHeader = null;
          // this.customerId = 'CASH';
          this.saleDetails= [];
          this.displaySaleDetails();
          this.resetSearchBoxes();
        }else{
          this.resetPaymentState();
        }
        this.afterPayment(!!x, x?.TransNo || paidTransNo);  // paid: the SaleNo, else the temporary TransNo
      });
    }
  }

  // payment cancelled or failed: Save and Amount Paid usable again
  private resetPaymentState(){
    this.disableSave = false;
    this.disableAmountPaid = false;
    this.amountPaidFocus = false;
    this.toggleButtons[0].Label = 'SAVE TRANSACTION-F4';
  }

  // Desktop IsPasswordMatch: no password when PasswordEditRemovePending is empty or "na"
  needsPassword(): boolean {
    var password = (this.saleConfigAccessright?.PasswordEditRemovePending ?? '').toString().trim().toLowerCase();
    return password != '' && password != 'na';
  }

  // runs action, asking the Edit/Remove/Pending password first when one is set
  withPassword(action: () => void){
    if (!this.needsPassword()) return action();
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    dialogConfig.data = this.saleConfigAccessright.PasswordEditRemovePending;
    this.dialog.open(PasswordUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      if(x) action();
    });
  }

 async onClickEdit(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    if(this.needsPassword() ){
       const dialogConfig        = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus    = true;
        dialogConfig.width        = '500px';
        dialogConfig.data = this.saleConfigAccessright.PasswordEditRemovePending;
        this.dialog.open(PasswordUIComponent,dialogConfig).beforeClosed().subscribe(x => {
          if(x){
            this.onClickEdit2();
          }
        });
    }else{
      this.onClickEdit2();
    }
  }

  async onClickEdit2(){
    var [saleDetail, stock]: any[] = await Promise.all([
      firstValueFrom(this.saleDetailsService.getSaleDetailById(this.selectedData.id)),
      firstValueFrom(this.stocksService.getItemByItemId(this.selectedData.ItemId)),
    ]);
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = ([saleDetail,stock, 'updatesalestransaction']);
    this.dialog.open(SaleDetailUIComponent,dialogConfig).beforeClosed().subscribe(saleDetail => {
      if(saleDetail){
        const saleDetailIndex = this.saleDetails.findIndex(detail => detail.id === saleDetail.id);
        if (saleDetailIndex !== -1) {
          this.saleDetails[saleDetailIndex] = saleDetail;  
        }
        this.displaySaleDetails();
        if (this.saleConfig.ValidateQty.toLowerCase() == "yes")
            this.rePopulateQty(saleDetail.ItemId);
        this.syncSetComponents(saleDetail.id);
      }

    });
  }

  onClickRemove(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    if(this.needsPassword() ){
       const dialogConfig        = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus    = true;
        dialogConfig.width        = '500px';
        dialogConfig.data = this.saleConfigAccessright.PasswordEditRemovePending;
        this.dialog.open(PasswordUIComponent,dialogConfig).beforeClosed().subscribe(x => {
          if(x){
            this.onClickRemove2();
          }
        });
    }else{
      this.onClickRemove2();
    }
  }

  onClickRemove2(){
   this.notificationService.popupWarning("Delete Record",this.selectedData.ItemName+ " will be remove. Continue?").then((result) => {
      if (result.value) {
        // also removes the component lines when the line is a Set (falls back to deleteSaleDetailById on the API)
        var removedId = this.selectedData.id;
        this.saleRestaurantService.deleteRestaurantSaleDetail(removedId).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              // a Set takes its upgrade lines with it
              this.saleDetails = this.saleDetails.filter(x => x.id != removedId && x.SetDetailId != removedId);
              if (this.saleConfig.ValidateQty.toLowerCase() == "yes")
                this.rePopulateQty(this.selectedData.ItemId);
              this.displaySaleDetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error.message);
            },
        });
      }
    });
  }

  onClickRemoveAll(){
    if(this.saleDetails.length == 0)
      return this.notificationService.toastrWarning('Empty Transaction');

    if(this.needsPassword() ){
       const dialogConfig        = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus    = true;
        dialogConfig.width        = '500px';
        dialogConfig.data = this.saleConfigAccessright.PasswordEditRemovePending;
        this.dialog.open(PasswordUIComponent,dialogConfig).beforeClosed().subscribe(x => {
          if(x){
            this.onClickRemoveAll2();
          }
        });
    }else{
      this.onClickRemoveAll2();
    }
  }
  

  onClickRemoveAll2(){
    this.notificationService.popupWarning("Delete Record","All Items will be REMOVED. Continue?").then((result) => {
      if (result.value) {
        // Desktop Remove All: the pending lines of the temporary TransNo are deleted
        this.salesTransactionService.cancelPendingSale(this.transNo).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              // one stock refresh per item, not per line
              if(this.saleConfig.ValidateQty.toLowerCase() == "yes")
                new Set<string>(this.saleDetails.map(x => x.ItemId)).forEach(itemId => this.rePopulateQty(itemId));
              this.newSale();
              this.displaySaleDetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error.message);
            },
        });
      }
    });
  }
  
  // Desktop btnCancelOrder_Click: the line stays on record as cancelled (stock returned). A line already sent
  // prints its CANCELLED slip now (Send Kitchen POS / Both) and shows CANCELLED on the Kitchen Queue.
  onClickCancelOrder(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    const line = this.selectedData;
    this.withPassword(() => {
      this.notificationService.popupWarning("Cancel Order", line.ItemName + " will be CANCELLED. Continue?").then((result) => {
        if (!result.value) return;
        this.saleRestaurantService.cancelOrder(line.id).subscribe({
          next:(res) => this.afterCancelOrder(res, [line.ItemId]),
          error:(err) => this.notificationService.toastrError(err.error.message)
        });
      });
    });
  }

  // Cancel Order of the whole order (phone layout: no row to select first)
  onClickCancelWholeOrder(){
    if (!this.requireOrder()) return;
    if (this.currentOrderPaid) return this.notificationService.toastrWarning('Order is already paid.');
    const itemIds = (this.saleDetails || []).map(x => x.ItemId);
    this.withPassword(() => {
      this.notificationService.popupWarning("Cancel Order", "All items of this order will be CANCELLED. Continue?").then((result) => {
        if (!result.value) return;
        this.saleRestaurantService.cancelWholeOrder(this.transNo).subscribe({
          next:(res) => this.afterCancelOrder(res, itemIds),
          error:(err) => this.notificationService.toastrError(err.error.message)
        });
      });
    });
  }

  private afterCancelOrder(res: any, itemIds: string[]){
    this.notificationService.toastrInfo(res.message);
    this.printSlips(res.slips);
    this.saleDetails = res.saleDetails;
    if (this.saleConfig.ValidateQty.toLowerCase() == "yes")
      new Set<string>(itemIds).forEach(itemId => this.rePopulateQty(itemId));
    this.upgradeVisible = false;
    this.displaySaleDetails();
  }

  async onClickSerialNos(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    var sDetail:any = await firstValueFrom(this.saleDetailsService.getSaleDetailById(this.selectedId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data         = ([sDetail, 'salestransaction', '']);
    this.dialog.open(SaleSerialNosUIComponent,dialogConfig).beforeClosed().subscribe(saleDetail => {
      this.getSaleDetails();
    });
  }

  onClickSaveAsPending(){
    if(this.saleDetails.length == 0)
      return this.notificationService.toastrWarning('Empty Transaction');

    if(this.needsPassword() ){
       const dialogConfig        = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus    = true;
        dialogConfig.width        = '500px';
        dialogConfig.data = this.saleConfigAccessright.PasswordEditRemovePending;
        this.dialog.open(PasswordUIComponent,dialogConfig).beforeClosed().subscribe(x => {
          if(x){
            this.onClickSaveAsPending2();
          }
        });
    }else{
      this.onClickSaveAsPending2();
    }
  }

  onClickSaveAsPending2(){
    this.notificationService.popupWarning("Pending Sales","All Items will be save as pending. Continue?").then((result) => {
      if (result.value) {
        // Desktop: the lines are already saved as pending; the screen starts a new sale
        this.notificationService.toastrSuccess('Saved as pending.');
        this.newSale();
        this.displaySaleDetails();
      }
    });
  }

  onClickShowPending(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data        = this.transNo;
    dialogConfig.viewContainerRef = this.viewContainerRef; 
    this.dialog.open(PendingTransactionsUIComponent,dialogConfig).beforeClosed().subscribe(async res => {
      // the sale on screen was deleted in Show Pending: start a new one (else every item would go to a deleted sale)
      if (res?.deleted) {
        if (this.transNo && (res.deleted.includes('*') || res.deleted.includes(this.transNo))) {
          this.newSale();
          this.displaySaleDetails();
        }
        return;
      }
      if(res){
        this.transNo = res.transNo;
        this.saleDetails = res.saleDetails; 
        this.saleHeader = res.saleHeader; 
        
        if( res.saleHeader.CustomerId !=  this.customerId){
          this.customerId = res.saleHeader.CustomerId; 
          await this.rePriceStocks();
        }

        this.customerId = res.saleHeader.CustomerId; 
        this.displaySaleDetails();
        }
    });
  }

  onClickLoadSO(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '2000px';
    dialogConfig.data        = ([this.transNo, this.action,this.recordStatusCashiering]);
    dialogConfig.viewContainerRef = this.viewContainerRef; 
    this.dialog.open(PendingSaleOrdersUIComponent,dialogConfig).beforeClosed().subscribe(async res=>{
      if(res){
        this.saleHeader = res.saleHeader;
        this.saleDetails = res.saleDetails;
        this.transNo = res.transNo;

        if( res.saleHeader.CustomerId !=  this.customerId){
          this.customerId = res.saleHeader.CustomerId; 
          await this.rePriceStocks();
        }
        
        this.customerId = res.saleHeader.CustomerId;
        this.displaySaleDetails();
      }
    });
  }

  onClickPoints(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '800px';
    this.dialog.open(CustomerPointsUIComponent,dialogConfig);
  }

  onClickNewCustomer(){
          if (!this.matTableService.CommonTransaction()) {
      return;
    }
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = (['','sales',[]]);
    this.dialog.open(CustomerUIComponent,dialogConfig).beforeClosed().subscribe(customer => {
      if(customer){
        this.customers = [customer,...this.customers]; 
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

  onClickMultipleUMs(){
    if (!this.matTableService.checkNull(this.itemId)) return;

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data        = ([this.selectedItem, 'inventory']);
    this.dialog.open(MultipleUMsComponent,dialogConfig).beforeClosed().subscribe(stock => {
      if(stock){
        console.log(stock)
        stock.ItemId = this.selectedItem.ItemId;
        stock.PriceCategory = this.selectedItem.PriceCategory;
        if(stock.BaseUM != stock.UM){
          this.selectedItem = stock;
          this.selectedItem.Multiple = true;

        }else{
          this.selectedItem.Multiple = false;
        }
        this.onFocusQty();
      }
     
    });
  }
  
  onClickOtherPriceCategories(){
    if (!this.matTableService.checkNull(this.itemId)) return;

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '800px';
    dialogConfig.data        = ([this.selectedItem, 'inventory', this.selectedItem.UM]);
    this.dialog.open(ItemPriceCategorysUIComponent,dialogConfig);
  }

  updateElementSaleDetail(event: any, id: number, Column: string) {
    let Value: any;

    if (Column === 'DiscountType') {
      Value = event.checked ? 'percent' : 'amount';
    } else {
      // the cell shows thousand separators (1,000.00): they are not part of the number
      Value = String(event.target.value ?? '').replace(/,/g, '').trim();

      if (!this.numbersService.isNumber(Value)) {
         this.notif.toastrWarning(`${Value} is not a number.`);
         // the invalid value is not sent; the line is shown again as saved
         setTimeout(() => this.getSaleDetails(), 1000);
         return;
      }
    }
    if (Column === 'Price' && this.needsPassword()) {
      const originalValue = this.saleDetails.find(detail => detail.id === id)?.[Column];

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '500px';
      dialogConfig.data = this.saleConfigAccessright.PasswordEditRemovePending;

      this.dialog.open(PasswordUIComponent, dialogConfig).beforeClosed().subscribe(result => {
        if (result) { 
            this.sendUpdateRequest(id, Column, Value);
        }else{
          this.notif.toastrWarning(`Price Not Changed.`);
            setTimeout(() => this.getSaleDetails(), 1000);
        }
      });
      
    }else{
      this.sendUpdateRequest(id, Column, Value);
    }
  }

  sendUpdateRequest(id: number, Column: string, Value: any) {
     this.salesTransactionService.updateElementSaleDetail(id, Column, Value).subscribe({
      next: (res) => {
        this.notif.toastrSuccess(res.message);
        const index = this.saleDetails.findIndex(detail => detail.id === id);
        if (index !== -1) {
          this.saleDetails[index] = res.saleDetail;
        }
        if (this.saleConfig.ValidateQty.toLowerCase() == "yes" && Column  === 'Qty')
              this.rePopulateQty(res.saleDetail.ItemId);
        if (Column === 'Qty')
          this.syncSetComponents(id);
        this.displaySaleDetails();
      },
      error: (err) => {
        this.notif.toastrError(err.error.message);
      }
    });
  }

  // by name: the phone layout has its own menu button (⋮), which must not be taken for the right-click menu
  @ViewChild('contextMenuTrigger', { read: MatMenuTrigger })
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
    this.pageIndex = 0;
  }

  clearSearch(){
    this.searchKey1 =  this.matTableService.clearSearch(this.listData1);
  }
  
  async applyFilter2(){
    this.matTableService.applyFilter(this.listData1, this.searchKey1);
    this.selectedItem = this.listData1.filteredData[0];

    if(!this.selectedItem || this.selectedItem == undefined){
       this.selectedItem = await firstValueFrom(this.stocksService.getItemByBarcodeId(this.searchKey1));
        if (!this.selectedItem) {
          return this.notificationService.toastrWarning("Item Not Found.");
        }
        // Desktop lists only items for sale (StocksBAL.GetDataByCategory) here: a scanned barcode of another item is refused
        // (a multiple-UM barcode has no flags of its own: its base item decides)
        const flags: any = this.selectedItem.ForSale !== undefined ? this.selectedItem : await firstValueFrom(this.stocksService.getItemByItemId(this.selectedItem.ItemId));
        if ((flags?.ForSale ?? 'yes').toLowerCase() == 'no') {
          const itemName = this.selectedItem.ItemName ?? flags?.ItemName;
          this.selectedItem = null;
          return this.notificationService.toastrWarning(itemName + ' is not for sale.');
        }
        this.selectedItem.Multiple = true;
    }
    this.onFocusQty();
  }

  // Desktop keeps the search box focused for the barcode scanner; a phone would pop up its keyboard
  // after every item, so the phone layout leaves the focus alone
  focusSearch(){
    if (!this.isPhone && this.desktopSearchVisible) this.searchInput?.nativeElement?.focus();
  }

  // Desktop ShowTables hides the item search: with tables, items come after a table is selected
  get itemSearchVisible(): boolean {
    if (!this.hasTable) return true;
    return !!this.currentTable && this.activeTab != 'table' && this.activeTab != 'tablecategory';
  }

  // Desktop layout: the search box (and HIDE PRICE) belong to the PRODUCT tab; the phone layout keeps its search
  get desktopSearchVisible(): boolean {
    return this.itemSearchVisible && this.activeTab == 'product';
  }

  // F8: go to the PRODUCT tab and search there
  async onF8Search(){
    if (!this.itemSearchVisible) return;
    if (this.activeTab != 'product') await this.selectTab('product');
    setTimeout(() => this.searchInput?.nativeElement?.focus());
  }

  // with tables there is no order (and no item) before a table is selected
  private needsTable(): boolean {
    if (this.hasTable && !this.currentTable && !this.tableMode) {
      this.notificationService.toastrWarning('Select a table first.');
      return true;
    }
    return false;
  }

  // the customer of an order loaded from its table is kept (Desktop takes it from the order); a new order is free
  customerLocked: boolean = false;

  resetSearchBoxes(){
    this.itemId = undefined;
    this.qty = undefined;
    this.selectedItem = undefined;
    this.searchKey1 = undefined;
    this.focusSearch();
    if(this.listData1?.filteredData){
      this.clearSearch();
    }
    this.amountPaid = undefined;
    this.change = '';
    this.amountPaidFocus = false;
    this.disableSave = false;
    this.disableAmountPaid = false;
    this.toggleButtons[0].Label = 'SAVE TRANSACTION-F4'

  }
  calculateChange() {
    const paid = this.amountPaid || 0;
    const total = this.totalAmount || 0;
    this.change = +paid - +total;
    this.change = this.numbersService.Convert2Decimal(this.change);
  }

  get onScreenKeyboard(): boolean {
    return (this.saleConfig?.OnScreenKeyboard || 'no').toLowerCase() == 'yes';
  }

  // Desktop txtAmountPaid_Click: with On Screen Keyboard the amount is cleared and the number pad opens
  // (the shared keyboard: ENTER on it is Enter on AMOUNT PAID)
  onClickAmountPaid(){
    if (!this.onScreenKeyboard || this.disableAmountPaid || this.currentOrderPaid) return;
    if (this.saleDetails.length == 0) return this.notificationService.toastrWarning('Empty Transaction');
    this.amountPaid = undefined;
    this.amountpd.nativeElement.value = '';
    this.calculateChange();
    this.osk.open(this.amountpd.nativeElement, 'numbers');
  }

  onEnterAmountPaid(){
    if (this.splitMode) return this.notificationService.toastrInfo('Press PAY to pay the split bill.');
    if (this.numbersService.isNotNumeric((this.amountPaid ?? '').toString()))
    {
      return this.notificationService.toastrWarning("Invalid AmountPaid.");
    }

    const amountPaid = this.numbersService.Convert2Decimal(this.amountPaid);
    const change = this.numbersService.Convert2Decimal(this.change);
      if (change < 0)
      {
        return this.notificationService.toastrWarning("AmountPaid should be Greater Than or Equal TotalAmount.");
      }
      this.amountPaidFocus = true;
      this.onClickSaveTransaction();
  }
  getTotal(column){
    let sum = 0;
    this.listData2?.filteredData.forEach(x => {
            sum += +x[column];
    });
    return sum;
  }

  // =====================================================================================
  // Desktop SaleTransUI: TABLE CATEGORY / TABLE / CATEGORY / PRODUCT tabs and restaurant workflow
  // =====================================================================================

  async loadRestaurantConfig(){
    try {
      var config: any = await firstValueFrom(this.saleRestaurantService.getRestaurantConfig());
      this.hasTable = config?.HasTable == 'yes';
      this.multipleTable = config?.MultipleTable == 'yes';
    } catch {
      this.hasTable = false;
    }
    // Desktop ShowTabs: no table tabs without HasTable, no TABLE CATEGORY tab without MultipleTable
    this.buildTabs();
  }

  // built once (loadRestaurantConfig): new tab objects on every change detection made *ngFor re-create the tab
  // buttons, and a button replaced between mousedown and mouseup never receives the click
  tabs: any[] = [{ key: 'category', label: 'CATEGORY' }, { key: 'product', label: 'PRODUCT' }];
  private buildTabs(){
    var tabs = [];
    if (this.hasTable && this.multipleTable) tabs.push({ key: 'tablecategory', label: 'TABLE CATEGORY' });
    if (this.hasTable) tabs.push({ key: 'table', label: 'TABLE' });
    tabs.push({ key: 'category', label: 'CATEGORY' });
    tabs.push({ key: 'product', label: 'PRODUCT' });
    this.tabs = tabs;
  }

  trackByKey(index: number, item: any){
    return item.key;
  }

  async selectTab(tab: string){
    if ((tab == 'category' || tab == 'product') && this.needsTable()) return;
    this.activeTab = tab;
    this.tilePageIndex = 0;
    if (tab == 'tablecategory') {
      // table categories rarely change: load once per visit of the screen
      if (this.tableCategorys.length == 0) {
        var categorys: any = await firstValueFrom(this.saleRestaurantService.getTableCategorys());
        this.tableCategorys = [{ TableCategory: 'All' }, ...categorys];
      }
    }
    if (tab == 'table') await this.loadTables();
    if (tab == 'category') this.buildCategoryTiles();
    if (tab == 'product') {
      // Desktop tabControl_Click (tabProduct): category = "All"
      this.selectedCategory = 'All';
      localStorage.setItem('Category', 'All');
      this.displayStocks();
    }
    this.scheduleFitTiles();
  }

  buildCategoryTiles(){
    // Desktop ShowCategorys: only categories that have saleable items
    var categories = Array.from(new Set((this.stocks || []).map(x => x.Category).filter(x => !!x))) as string[];
    this.categoryTiles = ['All', ...categories.sort((a, b) => a.localeCompare(b))];
  }

  onClickCategoryTile(category: string){
    this.selectedCategory = category;
    localStorage.setItem('Category', category);
    this.displayStocks();
    this.activeTab = 'product';
    this.scheduleFitTiles();
  }

  // Tables of the selected category with their live status. The cached tiles stay on screen while the
  // status refreshes (no progress bar after the first load); overlapping refreshes share one request.
  private tablesRequest: Promise<any> = null;
  private tablesRequestKey: string = null;
  private tablesCacheKey: string = null;
  async loadTables(){
    var key = this.multipleTable ? this.selectedTableCategory : 'all';
    if (this.tablesCacheKey != key) this.tables = [];
    if (this.tablesRequest && this.tablesRequestKey == key) return this.tablesRequest;
    this.isLoadingTables = this.tables.length == 0;
    this.tablesRequestKey = key;
    this.tablesRequest = firstValueFrom(this.saleRestaurantService.getTablesWithStatus(key))
      .then((tables: any) => {
        if (this.tablesRequestKey == key) {
          for (const t of tables) this.stampBilledOut(t, t.BilledOutMinutes);
          this.tables = tables;
          this.tablesCacheKey = key;
          this.scheduleFitTiles();
        }
      })
      .finally(() => {
        if (this.tablesRequestKey == key) { this.tablesRequest = null; this.isLoadingTables = false; }
      });
    // only the first load is waited for; later refreshes update the tiles in place
    if (this.isLoadingTables) return this.tablesRequest;
  }

  async onClickTableCategoryTile(category: any){
    this.selectedTableCategory = category.TableCategory;
    await this.selectTab('table');
  }

  tableStatus(table: any): string {
    if (!table.IsOccupied) return 'vacant';
    if (table.PaidStatus == 'paid') return 'paid';
    return (table.OrderStatus || 'occupied').toLowerCase();
  }

  // billed-out timer on the table tile: the server gives the minutes (its clock), the tile counts on from there
  // between refreshes; cleared once the table is paid or vacant
  private stampBilledOut(table: any, minutes: number){
    table.BilledOutSince = minutes == null ? null : Date.now() - minutes * 60000;
  }
  billedOutMinutes(table: any): number {
    if (table.BilledOutSince == null || !table.IsOccupied || table.PaidStatus == 'paid') return null;
    return Math.max(0, Math.floor((Date.now() - table.BilledOutSince) / 60000));
  }

  get headerTitle(): string {
    if (!this.hasTable) return '';
    var table = this.currentTable ? this.currentTable.TableName : 'NO TABLE';
    return table + ' (' + this.orderType + ')' + (this.currentOrderPaid ? ' - PAID' : '');
  }

  // ===== Desktop SharedRoutines.GenerateDynamicButtons: a page holds as many buttons as fit in the panel =====
  private tilesResizeObserver: any = null;
  private fitTilesTimer: any = null;

  ngAfterViewInit(){
    // phones get their own layout (same logic); tablets and laptops keep the Desktop layout
    this.subscriptions.add(this.breakpointObserver.observe(PHONE_QUERY).subscribe(state => {
      if (this.isPhone == state.matches) return;
      this.isPhone = state.matches;
      this.phoneSheet = null;
      // the desktop tile panel is re-created: watch the new one
      setTimeout(() => this.attachTilesObserver());
    }));
    this.attachTilesObserver();
  }

  private attachTilesObserver(){
    var RO = (window as any).ResizeObserver;
    if (this.tilesResizeObserver) this.tilesResizeObserver.disconnect();
    this.tilesResizeObserver = null;
    if (RO && this.tableContainer) {
      // ResizeObserver runs outside Angular's zone: re-enter it so the new page size renders
      this.tilesResizeObserver = new RO(() => this.ngZone.run(() => this.scheduleFitTiles()));
      this.tilesResizeObserver.observe(this.tableContainer.nativeElement);
    }
    this.scheduleFitTiles();
  }

  // ===== Phone layout (layout only: every action calls the same methods as the Desktop layout) =====
  isPhone        : boolean = typeof window != 'undefined' && window.matchMedia ? window.matchMedia(PHONE_QUERY).matches : false;
  phoneSheet     : 'cart' | 'pay' | 'more' | null = null;
  phoneLimit     : number = 40;
  private phoneCategoriesSource: any = null;
  private phoneCategoriesCache: string[] = [];

  get phoneCategories(): string[] {
    if (this.phoneCategoriesSource !== this.stocks) {
      this.phoneCategoriesSource = this.stocks;
      var categories = Array.from(new Set((this.stocks || []).map(x => x.Category).filter(x => !!x))) as string[];
      this.phoneCategoriesCache = ['All', ...categories.sort((a, b) => a.localeCompare(b))];
    }
    return this.phoneCategoriesCache;
  }

  // the whole filtered list, shown in steps (Load more) instead of pages
  get phoneItems(): any[] {
    return (this.listData1?.filteredData ?? []).slice(0, this.phoneLimit);
  }

  get phoneHasMore(): boolean {
    return (this.listData1?.filteredData?.length ?? 0) > this.phoneLimit;
  }

  get phoneItemCount(): number {
    return (this.saleDetails || []).reduce((sum, x) => sum + (+x.Qty || 0), 0);
  }

  async onPhoneCategory(category: string){
    if (this.needsTable()) return;
    this.phoneLimit = 40;
    if (this.activeTab != 'product' && this.activeTab != 'category') this.activeTab = 'product';
    this.onClickCategoryTile(category);
  }

  openPhoneCart(){
    this.osk.close();
    this.phoneSheet = 'cart';
  }

  // restaurant actions on the phone: a fixed bar (never scrolls) with SEND / BILL OUT / PAY + MORE; MORE opens
  // a sheet with every action in a grid
  private readonly phoneMainLabels = ['SEND', 'BILL OUT', 'PAY'];
  private readonly phoneActionIcons = {
    'SEND': 'send', 'SERVE': 'room_service', 'UPGRADE': 'upgrade', 'TRANSFER': 'swap_horiz', 'SPLIT': 'call_split',
    'MERGE': 'merge_type', 'BILL OUT': 'receipt', 'PAY': 'payments', 'DINE IN': 'restaurant', 'TAKE OUT': 'takeout_dining',
    'COMPLETE': 'task_alt',
  };
  get phoneMainActions(): any[] {
    var all = [...this.restaurantButtons1, ...this.restaurantButtons2];
    return this.phoneMainLabels.map(l => all.find(b => b.Label == l)).filter(b => !!b);
  }
  // the MORE sheet: every restaurant action (Desktop panel12 + panel15)
  get phoneMoreActions(): any[] {
    return [...this.restaurantButtons1, ...this.restaurantButtons2];
  }
  openPhoneMore(){
    this.osk.close();
    this.phoneSheet = 'more';
  }
  phoneActionKey(button: any): string {
    return button.Label.toLowerCase().replace(/\s+/g, '-');
  }
  phoneActionIcon(button: any): string {
    return this.phoneActionIcons[button.Label] || 'chevron_right';
  }
  // same rules as the Desktop layout buttons
  phoneActionDisabled(button: any): boolean {
    return !button.Disabled || (button.Label == 'PAY' && (this.disableSave || this.currentOrderPaid)) || (button.Label == 'SEND' && this.isSending);
  }
  phoneActionActive(button: any): boolean {
    return (button.Label == 'SPLIT' && this.splitMode) || (button.Label == 'MERGE' && this.tableMode == 'merge')
        || (button.Label == 'TRANSFER' && this.tableMode == 'transfer')
        || (button.Label == 'DINE IN' && this.orderType == 'Dine in') || (button.Label == 'TAKE OUT' && this.orderType == 'Take out');
  }
  onPhoneAction(button: any){
    this.osk.close();
    this.phoneSheet = null;
    button.Function();
  }

  async onPhoneTables(){
    await this.selectTab(this.multipleTable ? 'tablecategory' : 'table');
  }

  onPhoneSearch(){
    if (this.needsTable()) { this.searchKey1 = ''; return; }
    this.phoneLimit = 40;
    if (this.activeTab != 'product') this.activeTab = 'product';
    this.applyFilter();
  }

  // the cart line actions of the Desktop right-click menu, on every row (no row to select first on a phone):
  // Edit / Remove, and Cancel for a line already sent to the kitchen (restaurant)
  private readonly phoneLineIcons = { 'Edit': 'edit', 'Remove': 'delete', 'Cancel Order': 'block' };
  get phoneLineActions(): any[] {
    return this.contextButtons2.filter(b => b.Disabled && ['Edit', 'Remove'].includes(b.Label));
  }
  phoneRowActions(row: any): any[] {
    var actions = this.phoneLineActions;
    var cancel = this.contextButtons2.find(b => b.Label == 'Cancel Order' && b.Disabled);
    if (this.hasTable && cancel && (row.IsPrinted || '').toLowerCase() == 'yes') actions = [...actions, cancel];
    return actions;
  }
  phoneLineIcon(action: any): string {
    return this.phoneLineIcons[action.Label] || 'chevron_right';
  }
  // Remove All / Cancel Order (whole order) at the top of the cart
  get phoneCanRemoveAll(): boolean {
    return this.contextButtons2.some(b => b.Label == 'Remove All' && b.Disabled);
  }
  get phoneCanCancelOrder(): boolean {
    return this.hasTable && this.contextButtons2.some(b => b.Label == 'Cancel Order' && b.Disabled);
  }
  onPhoneCartAction(action: 'removeAll' | 'cancelOrder'){
    this.phoneSheet = null;   // its dialog / confirmation opens on the page
    if (action == 'removeAll') this.onClickRemoveAll();
    else this.onClickCancelWholeOrder();
  }

  onPhoneLineAction(row: any, action: any){
    this.getRecord2(row);
    this.phoneSheet = null;   // its dialog / confirmation opens on the page
    action.Function();
  }

  // phones: the bottom bar is fixed; the page keeps its height free at the bottom (--ph-bottom-h) so the last
  // tables / items are never under it
  private phoneBottomObserver: any = null;
  @ViewChild('phoneBottom', { static: false }) set phoneBottomRef(ref: ElementRef) {
    if (this.phoneBottomObserver) this.phoneBottomObserver.disconnect();
    this.phoneBottomObserver = null;
    var RO = (window as any).ResizeObserver;
    if (!ref || !RO) return;
    var el = ref.nativeElement as HTMLElement;
    this.phoneBottomObserver = new RO(() => {
      var page = el.closest('.ph') as HTMLElement;
      if (page) page.style.setProperty('--ph-bottom-h', Math.ceil(el.getBoundingClientRect().height) + 'px');
    });
    this.phoneBottomObserver.observe(el);
  }

  // full-screen payment step (retail); restaurants pay with their PAY button
  openPhonePay(){
    if (!this.saleDetails?.length) return this.notificationService.toastrWarning('Empty Transaction');
    this.osk.close();
    this.phoneSheet = 'pay';
    setTimeout(() => this.amountpd?.nativeElement?.focus(), 50);
  }

  // quick cash: exact amount and the next round bills
  get phoneQuickCash(): number[] {
    var total = Math.max(0, +this.totalAmount || 0);
    var amounts = [total];
    [50, 100, 500, 1000].forEach(bill => {
      var rounded = Math.ceil(total / bill) * bill;
      if (rounded > total && !amounts.includes(rounded)) amounts.push(rounded);
    });
    return amounts.slice(0, 4);
  }

  setPhoneAmount(amount: number){
    this.amountPaid = this.numbersService.Convert2Decimal(amount) as any;
    this.calculateChange();
  }

  onPhonePay(){
    if (this.amountPaid === undefined || this.amountPaid === null || (this.amountPaid as any) === '')
      this.setPhoneAmount(+this.totalAmount || 0);
    this.phoneSheet = null;
    this.onEnterAmountPaid();
  }

  private isDestroyed : boolean = false;
  ngOnDestroy(){
    this.isDestroyed = true;
    this.osk.setEnabled(this, false);
    if (this.tilesResizeObserver) this.tilesResizeObserver.disconnect();
    if (this.phoneBottomObserver) this.phoneBottomObserver.disconnect();
    clearTimeout(this.fitTilesTimer);
    this.stopKitchenWatch();
    this.subscriptions.unsubscribe();
  }

  // ===== Kitchen Queue updates (restaurant; only while Sales Transaction is open) =====
  // Every _kitchenRefreshMs: the ready to serve lines (READY TO SERVE button badge + dialog), the ready notices
  // (a toast that closes after _kitchenNoticeSeconds) and the kitchen status of the order on screen / the tables.
  readyLines      : any[] = [];
  readyDialog     : MatDialogRef<KitchenReadyUIComponent> | null = null;
  private kitchenTimer : any = null;
  private kitchenPolling : boolean = false;
  private kitchenStopped : boolean = false;

  // Sales Transaction status of a line: what the kitchen set in the Kitchen Queue (never "preparing" by itself)
  static readonly orderStatusLabels = {
    'pending': 'New', 'sent': 'Sent', 'preparing': 'Preparing', 'ready': 'Ready to Serve', 'served': 'Served', 'completed': 'Completed',
  };
  orderStatusLabel(status: string): string {
    return SalesTransaction2Component.orderStatusLabels[(status || '').toLowerCase()] || status;
  }

  get readyCount(): number {
    return this.readyLines.filter(l => !l.SetId || l.SetId == 'NA').length;
  }

  // tables (or orders without a table) with something ready to serve: the laptop / tablet icon badge
  get readyTableCount(): number {
    return new Set(this.readyLines.map(l => l.TableName && l.TableName != 'NA' ? 'T' + (l.TableId || l.TableName) : 'O' + l.TransCode)).size;
  }

  watchKitchen(){
    // ngOnInit is async: the screen may already be closed
    if (this.isDestroyed) return;
    this.kitchenStopped = false;
    this.subscriptions.add(this.kitchenQueueService.requiredRefresh.subscribe(() => this.pollKitchen()));
    this.pollKitchen();
    this.kitchenTimer = setInterval(() => this.pollKitchen(), _kitchenRefreshMs);
  }

  stopKitchenWatch(){
    this.kitchenStopped = true;
    clearInterval(this.kitchenTimer);
    this.kitchenTimer = null;
    if (this.readyDialog) this.readyDialog.close();
  }

  async pollKitchen(){
    if (this.kitchenPolling || this.kitchenStopped || (typeof document != 'undefined' && document.hidden)) return;
    this.kitchenPolling = true;
    try {
      var res: any = await firstValueFrom(this.kitchenQueueService.getSalesKitchenUpdates(this.transNo));
      if (this.kitchenStopped) return;
      // MySQL "yyyy-MM-dd HH:mm:ss" -> ISO, so the date pipe parses it the same in every browser
      for (const line of res.ReadyLines || [])
        for (const col of ['SentDateTime', 'PreparingDateTime', 'ReadyDateTime', 'ServedDateTime', 'CancelledDateTime'])
          if (line[col]) line[col] = String(line[col]).replace(' ', 'T');
      this.readyLines = res.ReadyLines || [];
      if (this.readyDialog) this.readyDialog.componentInstance.setLines(this.readyLines);
      this.showReadyNotices(res.Notices || []);
      this.applyKitchenStatuses(res.OrderLines || []);
      if (this.activeTab == 'table' && !this.tableMode) this.loadTables();
    } catch (e) {
      // no Kitchen Queue on this branch / server busy: try again on the next round
    } finally {
      this.kitchenPolling = false;
    }
  }

  // the order on screen: each line shows the status the kitchen set
  private applyKitchenStatuses(lines: any[]){
    if (!lines.length || !this.saleDetails?.length) return;
    var statuses = new Map(lines.map(l => [String(l.id), l.OrderStatus]));
    for (const row of this.saleDetails) {
      var status = statuses.get(String(row.id));
      if (status !== undefined && status != row.OrderStatus) row.OrderStatus = status;
    }
  }

  // one toast per READY TO SERVE click in the Kitchen Queue, e.g. "Table 5 - 2 item(s) ready to serve";
  // a notice is shown once on this machine (NoticeKey), tapping it opens the Ready to Serve dialog
  private showReadyNotices(notices: any[]){
    var read: string[] = this.readKitchenNoticeKeys();
    var fresh = notices.filter(n => !read.includes(n.NoticeKey));
    if (fresh.length == 0) return;
    var tableName = (n) => n.TableName && n.TableName != 'NA' ? n.TableName : (n.OrderType || n.TransCode);
    // many at once (e.g. the screen was closed for a while): one toast for all
    var toasts = fresh.length > 3
      ? [{ 'title': fresh.length + ' orders ready to serve', 'msg': fresh.map(tableName).join(', ') }]
      : fresh.map(n => ({ 'title': tableName(n) + ' - Ready to Serve', 'msg': n.ItemCount + ' item(s) ready to serve: ' + n.Items.filter(i => !i.SetId || i.SetId == 'NA').map(i => +i.Qty + ' ' + i.ItemName).join(', ') }));
    toasts.forEach(t => {
      var toast = this.notificationService.toastrTimed(t.msg + ' (tap to view)', t.title, _kitchenNoticeSeconds);
      toast.onTap.subscribe(() => this.ngZone.run(() => this.onClickReadyToServe()));
    });
    this.notificationService.playAlert('notice');
    read.push(...fresh.map(n => n.NoticeKey));
    try { localStorage.setItem('KitchenNoticeKeys', JSON.stringify(read.slice(-200))); } catch (e) { }
  }

  private readKitchenNoticeKeys(): string[] {
    try { return JSON.parse(localStorage.getItem('KitchenNoticeKeys') || '[]'); } catch (e) { return []; }
  }

  // READY TO SERVE: the Kitchen Queue READY TO SERVE cards per table, Served / Serve All
  onClickReadyToServe(){
    if (this.readyDialog) return;
    this.osk.close();
    this.phoneSheet = null;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = this.isPhone ? '100vw' : '640px';
    dialogConfig.maxWidth = this.isPhone ? '100vw' : '95vw';
    dialogConfig.data = [this.readyLines];
    const dialogRef = this.dialog.open(KitchenReadyUIComponent, dialogConfig);
    this.readyDialog = dialogRef;
    dialogRef.afterClosed().subscribe(() => {
      this.readyDialog = null;
      this.pollKitchen();
    });
  }

  // after the tiles of the current tab are rendered
  private fitPasses = 0;
  scheduleFitTiles(){
    this.fitPasses = 0;
    this.queueFitTiles();
  }
  private queueFitTiles(){
    clearTimeout(this.fitTilesTimer);
    this.fitTilesTimer = setTimeout(() => this.fitTiles(), 0);
  }

  fitTiles(){
    var size = fitTilePageSize(this.tableContainer?.nativeElement);
    if (size <= 0) return;

    // keep the first visible tile on the page shown
    if (this.activeTab == 'product') {
      if (size == this.pageSize) return;
      var first = this.pageIndex * this.pageSize;
      this.pageSize = size;
      this.pageIndex = Math.floor(first / size);
    } else {
      if (size == this.tilePageSize) return;
      var firstTile = this.tilePageIndex * this.tilePageSize;
      this.tilePageSize = size;
      this.tilePageIndex = Math.floor(firstTile / size);
    }
    // tiles have fixed heights, so one re-check confirms the new page; capped so it can never loop
    if (++this.fitPasses < 3) this.queueFitTiles();
  }

  // generic paging for the non-product tabs (Desktop PREV / NEXT)
  get tileSource(): any[] {
    if (this.activeTab == 'tablecategory') return this.tableCategorys;
    if (this.activeTab == 'table') return this.tables;
    if (this.activeTab == 'category') return this.categoryTiles;
    return [];
  }

  get pagedTiles(): any[] {
    var start = this.tilePageIndex * this.tilePageSize;
    return this.tileSource.slice(start, start + this.tilePageSize);
  }

  get pageLabel(): string {
    var total = this.activeTab == 'product' ? (this.listData1?.filteredData?.length || 0) : this.tileSource.length;
    var size = this.activeTab == 'product' ? this.pageSize : this.tilePageSize;
    var index = this.activeTab == 'product' ? this.pageIndex : this.tilePageIndex;
    var pages = Math.max(1, Math.ceil(total / size));
    return 'Page ' + (Math.min(index, pages - 1) + 1) + ' of ' + pages;
  }

  onClickPrevPage(){
    if (this.activeTab == 'product') {
      if (this.pageIndex > 0) this.pageIndex--;
    } else if (this.tilePageIndex > 0) {
      this.tilePageIndex--;
    }
  }

  onClickNextPage(){
    if (this.activeTab == 'product') {
      var total = this.listData1?.filteredData?.length || 0;
      if ((this.pageIndex + 1) * this.pageSize < total) this.pageIndex++;
    } else if ((this.tilePageIndex + 1) * this.tilePageSize < this.tileSource.length) {
      this.tilePageIndex++;
    }
  }

  onClickShowPrice(){
    this.showPrice = !this.showPrice;
  }

  // Lines added through the existing flow are tagged with the table, kitchen printer and Set components
  afterAddSaleDetail(saleDetail: any){
    if (!saleDetail || !this.transNo) return;
    this.saleRestaurantService.afterAddSaleDetail({
      'TransNo'       : this.transNo,
      'SaleDetailId'  : saleDetail.id,
      'TableId'       : this.hasTable && this.currentTable ? this.currentTable.id : null,
      'OrderType'     : this.orderType,
    }).subscribe({
      next:(res) => {
        this.saleDetails = res.saleDetails;
        this.displaySaleDetails();
      },
      error:(err) => this.notif.toastrError(err.error.message)
    });
  }

  syncSetComponents(saleDetailId: any){
    if (!saleDetailId) return;
    this.saleRestaurantService.syncSetComponents(saleDetailId).subscribe({
      // a Set's upgrade lines follow its quantity: the order shows their new quantity
      next: (res) => { if (res?.saleDetails) { this.saleDetails = res.saleDetails; this.displaySaleDetails(); } },
      error: () => {}
    });
  }

  // an UPGRADE line: the item a Set's component was swapped for, linked to its Set line
  isUpgradeLine(row: any): boolean {
    return !!row?.SetDetailId && (!row.SetId || row.SetId == 'NA');
  }

  // Keeps the order on its table as "pending" before switching to another table (Desktop ResetTrans)
  // (its lines are already saved as pending with the table: nothing to do on the server)
  async parkCurrentOrder(){
  }

  async resetToTables(){
    this.setCustomer('CASH', false);
    this.transNo = null;
    this.saleHeader = null;
    this.saleDetails = [];
    this.currentTable = null;
    this.currentOrderPaid = false;
    this.completeAfterPay = false;
    this.resetSplit();
    this.upgradeVisible = false;
    this.orderType = 'Dine in';
    this.displaySaleDetails();
    if (this.hasTable) await this.selectTab('table');
  }

  async onClickTableTile(table: any){
    if (this.tableMode == 'transfer') return this.transferToTable(table);
    if (this.tableMode == 'merge') return this.mergeWithTable(table);

    await this.parkCurrentOrder();
    this.currentOrderPaid = false;
    this.resetSplit();
    this.upgradeVisible = false;
    this.currentTable = table;

    const startNewOrder = async () => {
      // vacant: start a new order for this table (Desktop: goes to CATEGORY); nothing of the previous table's
      // order is carried over, the customer is free again
      this.transNo = null;
      this.saleHeader = null;
      this.saleDetails = [];
      this.orderType = 'Dine in';
      this.setCustomer('CASH', false);
      this.displaySaleDetails();
      await this.selectTab('category');
    };
    if (!table.IsOccupied) return startNewOrder();

    // occupied: load its unpaid order, or the paid one waiting for COMPLETE (Desktop LoadPendingOrder)
    var orders: any[] = await firstValueFrom(this.saleRestaurantService.getTableOrders(table.id));
    if (!orders || orders.length == 0) {
      // the table counts unpaid orders of every cashier / reading but only the cashier's own can be opened: an order
      // left by another cashier or an earlier reading keeps the table occupied with nothing to open. Never start a
      // second order on it; offer to release it (decided from the server now, not from the cached tiles)
      var others: any[] = await firstValueFrom(this.saleRestaurantService.getTableOtherOrders(table.id));
      if (others && others.length > 0) return this.offerReleaseTable(table, others);
      // the tile status was stale (order completed elsewhere / a moment ago): the table is free
      table.IsOccupied = false;
      this.loadTables();
      return startNewOrder();
    }
    var unpaidOrders = orders.filter(o => o.IsPending);
    var unpaid = unpaidOrders[0];
    // Desktop LoadPendingOrder shows every pending order of the table: a second unpaid order (e.g. a split
    // bill left unpaid) is put back on the first one so none of its items is hidden
    for (const extra of unpaidOrders.slice(1)) {
      try {
        await firstValueFrom(this.saleRestaurantService.unsplitBill(extra.TransNo, unpaid.TransNo));
      } catch (err: any) {
        this.notificationService.toastrError(err?.error?.message || 'Unable to load ' + extra.TransNo);
      }
    }
    if (unpaid) {
      var res: any = await firstValueFrom(this.salesTransactionService.resumePendingSale(unpaid.TransNo));
      this.transNo = res.transNo;
      this.saleHeader = res.saleHeader;
      this.saleDetails = res.saleDetails;
      this.setCustomer(res.saleHeader?.CustomerId || 'CASH', true);
      this.orderType = unpaid.OrderType || 'Dine in';
    } else if (orders.length > 0) {
      var paid = orders[0];
      this.transNo = paid.TransNo;
      this.saleHeader = paid;
      this.saleDetails = orders.reduce((all, o) => all.concat(o.Details || []), []);
      this.setCustomer(paid.CustomerId || 'CASH', true);
      this.orderType = paid.OrderType || 'Dine in';
      this.currentOrderPaid = true;
    }
    this.displaySaleDetails();
  }

  // An occupied table whose open order(s) belong to another cashier / reading: nothing is opened, the cashier is told
  // who, when and how much, and can release the table (the items are cancelled like Cancel Order, with the same
  // Edit / Remove / Pending password as Remove All).
  private async offerReleaseTable(table: any, others: any[]){
    this.currentTable = null;
    this.transNo = null;
    this.saleHeader = null;
    this.saleDetails = [];
    this.displaySaleDetails();
    var orders = others.map(o => (o.CashierName || 'a cashier') + ', reading ' + (o.ReadingNo || '-') + ', since ' + (o.EnteredAt || '-') +
                                 ', ' + o.LineCount + ' item(s), ₱' + (+o.TotalAmount || 0).toFixed(2)).join('; ');
    var result = await this.notificationService.popupWarning2('Table in use', table.TableName + ' has an open order that cannot be opened from this session (' + orders +
                                 '). Release the table? Its items will be CANCELLED.', 'Release table', 'Keep');
    if (!result.value) return;
    this.withPassword(() => this.releaseTable(table));
  }

  private async releaseTable(table: any){
    try {
      var res: any = await firstValueFrom(this.saleRestaurantService.releaseTable(table.id));
      this.notificationService.toastrSuccess(res.message);
      this.printSlips(res.slips);
      this.markTable(table.id, false);
    } catch (err: any) {
      this.notificationService.toastrHttpError(err, 'Unable to release ' + table.TableName + '.');
    }
    this.loadTables();
  }

  // the order's customer; the item prices follow it (Regular / customer price category)
  private setCustomer(customerId: string, locked: boolean){
    var changed = (this.customerId || 'CASH') != customerId;
    this.customerId = customerId;
    this.customerLocked = this.hasTable && locked;
    if (changed) this.getStocks().catch(() => {});
  }

  private requireOrder(): boolean {
    if (!this.transNo || this.saleDetails.length == 0) {
      this.notificationService.toastrWarning('Empty Transaction');
      return false;
    }
    return true;
  }

  private openSlipWindow(data: any){
    // Sales Config per machine: OrderSlipPOSPrinterFontSize for kitchen slips, POSPrinterFontSize for the bill
    var fontSize = data.Type == 'bill' ? this.saleConfigPerMachine?.POSPrinterFontSize : this.saleConfigPerMachine?.OrderSlipPOSPrinterFontSize;
    data.FontSize = +fontSize || 0;
    localStorage.setItem('OrderSlip', JSON.stringify(data));
    var url = this.router.serializeUrl(this.router.createUrlTree(['print/printorderslip']));
    this.printService.popupWindow(url, 'OrderSlip', window, 420, 700);
  }

  private printSlips(slips: any[]){
    if (slips && slips.length > 0) this.openSlipWindow({ 'Type': 'slips', 'Slips': slips });
  }

  // SEND: unsent lines go to the kitchen slip printers and / or the Kitchen Queue (Sales Config Send Kitchen) and
  // become "sent" (the kitchen sets preparing / ready); the screen goes back to the tables
  // one SEND at a time: a double click used to send twice (the kitchen got every item twice and two slips printed)
  isSending: boolean = false;

  async onClickSendOrder(){
    if (this.isSending) return;
    this.isSending = true;
    try {
      // an item tapped a moment ago may still be on its way: it goes with this SEND
      await this.waitForAdds();
      if (!this.requireOrder()) return;
      if (this.currentOrderPaid) return this.notificationService.toastrWarning('Order is already paid.');
      var res: any = await firstValueFrom(this.saleRestaurantService.sendOrder(this.transNo));
      if (res.sentCount == 0) this.notificationService.toastrInfo('All items were already sent.');
      else this.notificationService.toastrSuccess(res.message);
      this.printSlips(res.slips);
      this.markTable(this.currentTable?.id, true, 'sent');
      await this.parkCurrentOrder();
      await this.resetToTables();
    } catch (err: any) {
      this.notificationService.toastrHttpError(err, 'Unable to send the order.');
    } finally {
      this.isSending = false;
    }
  }

  onClickServe(){
    if (!this.requireOrder()) return;
    this.saleRestaurantService.serveOrder(this.transNo).subscribe({
      next: async (res) => {
        this.notificationService.toastrSuccess(res.message);
        await this.parkCurrentOrder();
        await this.resetToTables();
      },
      error:(err) => this.notificationService.toastrError(err.error.message)
    });
  }

  // UPGRADE: shows the components of the selected Set so one can be dropped (Desktop dtg3)
  async onClickUpgrade(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    // Desktop btnUpgrade_Click: only a Set item has components to upgrade
    if (this.selectedData.IsSet && this.selectedData.IsSet.toLowerCase() != 'yes') return this.notificationService.toastrWarning('Select Set item.');
    var components: any[] = await firstValueFrom(this.saleRestaurantService.getSetComponents(this.selectedData.id));
    if (!components || components.length == 0) return this.notificationService.toastrWarning('Select Set item.');
    this.upgradeLine = this.selectedData;
    this.setComponents = components;
    this.upgradeVisible = true;
    // the phone shows the panel in the order sheet
    if (this.isPhone) this.phoneSheet = 'cart';
  }

  // the phone's Set row button: select the line, then the same UPGRADE as the toolbar
  onPhoneUpgrade(row: any){
    this.getRecord2(row);
    this.onClickUpgrade();
  }

  // UPGRADE of a component: pick the item and the upgrade price (the Set price does not change)
  async onClickUpgradeSetComponent(component: any){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '480px';
    // the fourth value locks the upgrade price at its default when the cashier may not edit prices (grid rule)
    dialogConfig.data         = [component, this.upgradeLine, this.stocks, (this.saleConfigAccessright?.EditPrice ?? '').toString().toLowerCase() == 'no'];
    var choice: any = await firstValueFrom(this.dialog.open(SetUpgradeUIComponent, dialogConfig).beforeClosed());
    if (!choice) return;
    try {
      var res: any = await firstValueFrom(this.saleRestaurantService.upgradeSetComponent({ 'ComponentId': component.id, 'ItemId': choice.ItemId, 'Price': choice.Price }));
      this.notificationService.toastrSuccess(res.message);
      this.printSlips(res.slips);
      this.saleDetails = res.saleDetails;
      this.displaySaleDetails();
      this.setComponents = await firstValueFrom(this.saleRestaurantService.getSetComponents(this.upgradeLine.id));
      if ((this.saleConfig.ValidateQty || '').toLowerCase() == 'yes') {
        this.rePopulateQty(component.ItemId);
        this.rePopulateQty(choice.ItemId);
      }
    } catch (err: any) {
      this.notificationService.toastrHttpError(err, 'Unable to upgrade.');
    }
  }

  // remove an upgrade line (the replaced component is not brought back); a priced line, so it asks for the same
  // Edit / Remove / Pending password as the grid's Remove
  onClickRemoveUpgrade(upgrade: any){
    this.withPassword(() => {
      this.notificationService.popupWarning('Remove', upgrade.ItemName + ' (upgrade) will be REMOVED. Continue?').then((result) => {
        if (!result.value) return;
        this.saleRestaurantService.deleteRestaurantSaleDetail(upgrade.id).subscribe({
          next:(res) => {
            this.notificationService.toastrSuccess(res.message);
            this.saleDetails = this.saleDetails.filter(x => x.id != upgrade.id);
            this.displaySaleDetails();
            this.setComponents = this.setComponents.filter(x => x.id != upgrade.id);
            if ((this.saleConfig.ValidateQty || '').toLowerCase() == 'yes') this.rePopulateQty(upgrade.ItemId);
          },
          error:(err) => this.notificationService.toastrHttpError(err, 'Unable to remove.')
        });
      });
    });
  }

  onClickRemoveSetComponent(component: any){
    this.notificationService.popupWarning('Remove', component.ItemName + ' will be REMOVED. Continue?').then((result) => {
      if (!result.value) return;
      this.saleRestaurantService.deleteSetComponent(component.id).subscribe({
        next:(res) => {
          this.notificationService.toastrSuccess(res.message);
          this.setComponents = this.setComponents.filter(x => x.id != component.id);
          if (this.setComponents.length == 0) this.upgradeVisible = false;
        },
        error:(err) => this.notificationService.toastrError(err.error.message)
      });
    });
  }

  onClickTransfer(){
    if (!this.requireOrder()) return;
    if (!this.hasTable) return;
    this.tableMode = 'transfer';
    this.selectTab('table');
    this.notificationService.toastrInfo('Select table to transfer.');
  }

  onClickMerge(){
    if (!this.requireOrder()) return;
    if (!this.hasTable) return;
    this.tableMode = this.tableMode == 'merge' ? null : 'merge';
    if (this.tableMode) {
      this.selectTab('table');
      this.notificationService.toastrInfo('Select table to merge bill.');
    }
  }

  onClickCancelTableMode(){
    this.tableMode = null;
  }

  transferToTable(table: any){
    if (table.IsOccupied) return this.notificationService.toastrWarning('Already occupied. Select another table.');
    this.saleRestaurantService.transferTable(this.transNo, table.id).subscribe({
      next:(res) => {
        this.notificationService.toastrSuccess(res.message);
        this.currentTable = res.table;
        this.tableMode = null;
        this.loadTables();
      },
      error:(err) => this.notificationService.toastrError(err.error.message)
    });
  }

  mergeWithTable(table: any){
    if (!table.IsOccupied) return this.notificationService.toastrWarning('Cannot select no transaction Table.');
    if (this.currentTable && table.id == this.currentTable.id) return this.notificationService.toastrWarning('Select another table to merge.');
    this.saleRestaurantService.mergeTable(this.transNo, table.id).subscribe({
      next:(res) => {
        this.notificationService.toastrSuccess(res.message);
        this.saleDetails = res.saleDetails;
        this.tableMode = null;
        this.displaySaleDetails();
        // the tiles show the result at once: the merged table is vacant, this one holds everything
        this.markTable(table.id, false);
        var current = this.tables.find(t => t.id == this.currentTable?.id);
        if (current) current.TotalAmount = this.totalAmount;
        this.loadTables();
      },
      error:(err) => this.notificationService.toastrError(err.error.message)
    });
  }

  // SPLIT: tick the items (Desktop isSplitBill) or enter an amount, then PAY bills only that part
  onClickSplit(){
    if (!this.requireOrder()) return;
    if (this.currentOrderPaid) return this.notificationService.toastrWarning('Order is already paid.');
    var on = !this.splitMode;
    this.resetSplit();
    this.splitMode = on;
    if (on) {
      this.notificationService.toastrInfo('Select items to split, or enter an amount, then PAY.');
      // the phone ticks the items in the order sheet
      if (this.isPhone) this.phoneSheet = 'cart';
    }
  }

  resetSplit(){
    this.splitMode = false;
    this.splitBy = 'items';
    this.splitAmount = null;
    this.splitIds.clear();
  }

  onChangeSplitBy(by: 'items' | 'amount'){
    this.splitBy = by;
    this.splitIds.clear();
    this.splitAmount = null;
  }

  // the phone rows toggle on a tap anywhere on the row
  toggleSplitItem(row: any, event?: any){
    if (event) event.stopPropagation();
    this.setSplitItem(row, !this.splitIds.has(row.id));
  }

  // the checkbox reports its own new state: the set follows it, so the box and the amount always agree
  setSplitItem(row: any, checked: boolean){
    checked ? this.splitIds.add(row.id) : this.splitIds.delete(row.id);
  }

  // what the new bill will be, for the bar above the order
  get splitTotal(): number {
    if (this.splitBy == 'amount') return Math.round((+this.splitAmount || 0) * 100) / 100;
    return this.saleDetails.filter(x => this.splitIds.has(x.id)).reduce((sum, x) => sum + +x.Amount, 0);
  }

  get displayColumns2(): string[] {
    return this.splitMode && this.splitBy == 'items' ? ['Split', ...this.defaultColumns2] : this.defaultColumns2;
  }

  async onClickPay(){
    // an item tapped a moment ago may still be on its way: it is part of what is paid
    await this.waitForAdds();
    if (this.currentOrderPaid) return this.notificationService.toastrWarning('Order is already paid. Click COMPLETE.');
    if (this.splitMode) {
      var byAmount = this.splitBy == 'amount';
      if (byAmount) {
        if (this.splitTotal <= 0) return this.notificationService.toastrWarning('Enter the amount to split.');
        if (this.splitTotal >= Math.round(this.totalAmount * 100) / 100)
          return this.notificationService.toastrWarning('The amount must be less than the bill. To pay all of it, turn off SPLIT and press PAY.');
      } else {
        if (this.splitIds.size == 0) return this.notificationService.toastrWarning('Select items to split');
        if (this.splitIds.size >= this.saleDetails.length) {
          // every item ticked is the whole bill: nothing to split
          this.resetSplit();
          this.notificationService.toastrInfo('All items are selected: paying the whole bill.');
          return this.onClickSaveTransaction();
        }
      }
      try {
        var res: any = byAmount
          ? await firstValueFrom(this.saleRestaurantService.splitBillByAmount(this.transNo, this.splitTotal))
          : await firstValueFrom(this.saleRestaurantService.splitBill(this.transNo, Array.from(this.splitIds)));
        this.notificationService.toastrInfo(res.message);
        this.splitOriginalTransNo = res.originalTransNo;
        this.transNo = res.transNo;
        this.saleDetails = res.saleDetails;
        this.resetSplit();
        this.phoneSheet = null;
        this.displaySaleDetails();
      } catch (err: any) {
        return this.notificationService.toastrHttpError(err, 'Unable to split the bill.');
      }
    }
    this.onClickSaveTransaction();
  }

  // Runs after the existing payment dialog closes (paid = sale saved with a receipt no.)
  async afterPayment(paid: boolean, paidTransNo: string){
    if (this.splitOriginalTransNo) {
      var original = this.splitOriginalTransNo;
      this.splitOriginalTransNo = null;
      // COMPLETE pressed while splitting must not complete the remaining bill later by itself
      this.completeAfterPay = false;
      try {
        // paid: the split bill is completed (Desktop) and the original bill is reopened; not paid: lines go back
        var res: any = paid
          ? await firstValueFrom(this.saleRestaurantService.finishSplitBill(paidTransNo, original))
          : await firstValueFrom(this.saleRestaurantService.unsplitBill(paidTransNo, original));
        this.transNo = original;
        this.saleDetails = res.saleDetails;
        this.displaySaleDetails();
      } catch (err: any) {
        this.notificationService.toastrError(err?.error?.message || 'Unable to restore the original bill.');
      }
      this.loadTables();
      return;
    }
    if (!paid) {
      this.completeAfterPay = false;
      return;
    }
    if (!this.hasTable) return;

    if (this.completeAfterPay) {
      this.completeAfterPay = false;
      this.completeOrder(paidTransNo);
      return;
    }
    if (this.currentTable) {
      // the table stays occupied until COMPLETE (Desktop: paid orders keep the table)
      this.notificationService.toastrInfo('Paid. Click COMPLETE on ' + this.currentTable.TableName + ' when the guests leave.');
    }
    await this.resetToTables();
  }

  onClickBillOut(){
    if (!this.requireOrder()) return;
    this.saleRestaurantService.billOut(this.transNo).subscribe({
      next:(res) => {
        this.notificationService.toastrSuccess(res.message);
        var tile = this.tables.find(t => t.id == this.currentTable?.id);
        if (tile && tile.BilledOutSince == null) this.stampBilledOut(tile, 0);
        this.openSlipWindow({ 'Type': 'bill', 'BillOut': res.billOut, 'Details': res.saleDetails, 'Reprint': res.reprint,
                              'Discounts': res.discountApplications, 'MachinePermit': res.machinePermit, 'VendorPermit': res.vendorPermit, 'Config': this.saleConfig });
      },
      error:(err) => this.notificationService.toastrError(err.error.message)
    });
  }

  onClickOrderType(orderType: string){
    this.orderType = orderType;
    if (this.transNo && this.saleDetails.length > 0) {
      this.saleRestaurantService.setOrderType(this.transNo, orderType).subscribe({
        next:() => this.notificationService.toastrSuccess(orderType.toUpperCase()),
        error:(err) => this.notificationService.toastrError(err.error.message)
      });
    }
  }

  // COMPLETE: paid order -> close it and free the table; unpaid -> PAY first, then complete
  onClickComplete(){
    if (!this.requireOrder()) return;
    if (this.currentOrderPaid) return this.completeOrder(this.transNo);
    this.completeAfterPay = true;
    this.onClickPay();
  }

  // shows the new table status at once; the background refresh confirms it
  private markTable(tableId: any, occupied: boolean, orderStatus: string = null){
    var tile = this.tables.find(t => t.id == tableId);
    if (!tile) return;
    tile.IsOccupied = occupied;
    tile.OrderStatus = orderStatus;
    if (!occupied) { tile.TotalAmount = 0; tile.PaidStatus = 'unpaid'; tile.BilledOutSince = null; }
  }

  completeOrder(transNo: string){
    var tableId = this.currentTable?.id;
    this.saleRestaurantService.completeOrder(transNo).subscribe({
      next: async (res) => {
        this.notificationService.toastrSuccess(res.message);
        this.markTable(tableId, false);
        await this.resetToTables();
      },
      error:(err) => this.notificationService.toastrError(err.error.message)
    });
  }

}
