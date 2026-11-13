import { AfterViewInit, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { _url } from 'src/global-variables';
import { fitTilePageSize } from 'src/app/layouts/shared/tile-pager';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { SaleConfigService } from 'src/app/services/Sales/sale-config.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { OnScreenKeyboardService } from 'src/app/services/on-screen-keyboard.service';
import { CustomersService } from 'src/app/services/Files/customers.service';
import { ItemPriceCategorysService } from 'src/app/services/Files/item-price-categorys.service';
import { StocksService } from 'src/app/services/Inventory/stocks.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { OrderConfigService } from 'src/app/services/Orders/order-config.service';
import { OrderDetailsService } from 'src/app/services/Orders/order-details.service';
import { OrderHeadersService } from 'src/app/services/Orders/order-headers.service';
import { OrderTransactionService } from 'src/app/services/Orders/order-transaction.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { CustomerUIComponent } from '../../Files/customer-ui/customer-ui.component';
import { HomeComponent } from '../../home.component';
import { OrderDetailUIComponent } from '../order-detail-ui/order-detail-ui.component';
import { OrderHeaderUIComponent } from '../order-header-ui/order-header-ui.component';
import { OrderPendingTransactionsUIComponent } from '../order-pending-transactions-ui/order-pending-transactions-ui.component';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { ItemCategorysService } from 'src/app/services/Files/item-categorys.service';
import { ItemsService } from 'src/app/services/Files/items.service';

// phones (portrait and landscape) get the phone layout, same as Sales Transaction; tablets keep the Desktop layout
const PHONE_QUERY = '(max-width: 767.98px), (max-height: 500px) and (orientation: landscape)';

@Component({
  selector: 'app-order-transaction2',
  templateUrl: './order-transaction2.component.html',
  // same look as Sales Transaction
  styleUrls: ['../../Sales/sales-transaction2/sales-transaction2.component.css', './order-transaction2.component.css']
})
export class OrderTransaction2Component implements OnInit, AfterViewInit, OnDestroy {
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
 
  listData1        : MatTableDataSource<any>;
  searchKey1       : string;
  isLoading1       : boolean = false;
  
  listData2        : MatTableDataSource<any>;
  searchKey2       : string;
  isLoading2       : boolean = false;

  orderDetails     : any=[];
  orderHeader      : any=[];
  transCode        : string  = null;
  totalAmount      : number = 0;
  selectedId       : string;
  selectedData     : any;
  orderConfig      : any=[];
  disableSave     : boolean = false;
  isColorOutOfStock : boolean = true;

  defaultColumns1  = ['ItemId', 'ItemName','UM','Price','Available'];
  defaultColumns2  = [ 'Qty','UM','ItemName','Price','Discount','DiscountValue', 'Amount',];
  
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Available','Qty','Price','Discount','DiscountValue','Amount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };
  
  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};

  toolButtons     = [
    {'Label'   : 'New Customer','Function'             : () => this.onClickNewCustomer(),'Disabled': true,}, 
  ];

  // Desktop OrderTransUI has no Qty box / New Item / LOAD ITEMS: products are picked from CATEGORY / PRODUCT buttons
  toggleButtons     = [
    {'Label'   : 'SAVE TRANSACTION-F4','Function'    : () => this.onClickSaveTransaction(),'Disabled': true,},
  ];

  // ===== Desktop OrderTransUI tabs (CATEGORY / PRODUCT) and dynamic buttons =====
  tabs              = [{ key: 'category', label: 'CATEGORY' }, { key: 'product', label: 'PRODUCT' }];
  activeTab         : string = 'category';
  categoryTiles     : string[] = [];
  selectedCategory  : string = 'All';
  showPrice         : boolean = true;
  saleConfig        : any = {};
  pageIndex         : number = 0;
  pageSize          : number = 24;
  tilePageIndex     : number = 0;
  tilePageSize      : number = 24;
  failedPhotos      : { [itemId: string]: boolean } = {};

  contextButtons  =  [
    {'Label'   : 'Edit','Function'            : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Remove','Function'          : () => this.onClickRemove(),'Disabled': true,}, 
    {'Label'   : 'Remove All','Function'      : () => this.onClickRemoveAll(),'Disabled': true,}, 
    {'Label'   : 'Save As Pending','Function' : () => this.onClickSaveAsPending(),'Disabled': true,}, 
    {'Label'   : 'Show Pending','Function'    : () => this.onClickShowPending(),'Disabled': true,}, 
  ];
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('dataTable', { static: false }) dataTable!: ElementRef;
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;
  @ViewChildren('rowElement', { read: ElementRef }) rows!: QueryList<ElementRef>;
  @ViewChild('tableContainer', { static: false }) tableContainer!: ElementRef;
  constructor(
    private dialog          : MatDialog,
    private osk             : OnScreenKeyboardService,
    private stocksService    : StocksService,
    private customersService     : CustomersService,
    private orderTransactionService      : OrderTransactionService,
    private orderHeadersService      : OrderHeadersService,
    private orderDetailsService      : OrderDetailsService,
    private orderConfigService     : OrderConfigService,
    private notif           : NotificationService,
    private auth_service    : AuthService,
    private toolBoxService : ToolBoxService,
    public matTableService : MatTableService,
    private numbersService : NumbersService,
    private dateTimesService : DateTimesService,
    private stringHelperService : StringHelperService,
    private itemsService : ItemsService,
    private itemCategorysService : ItemCategorysService,
    private itemPriceCategorysService : ItemPriceCategorysService,
    private homeTs : HomeComponent,
    private notificationService : NotificationService,
    private globalConfigService : GlobalConfigService,
    private saleConfigService : SaleConfigService,
    private ngZone : NgZone,
    private breakpointObserver : BreakpointObserver,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns1);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    // config + button rights first (in parallel); customers / out-of-stock colour in the background
    await Promise.all([this.getOrderConfig(), this.getSaleConfig(), this.homeTs.getButtons()]);
    this.toolBoxService.disableButtons(this.toolButtons, null, this.toggleButtons, this.contextButtons);
    this.getCustomers().catch(() => {});
    this.globalConfigService.isColorOutOfStock().then(v => this.isColorOutOfStock = v).catch(() => {});
    // Desktop LoadButtons: CATEGORY buttons of the items for sale, then the ongoing order
    await this.getStocks();
    await this.getOrderDetails();
  }

  // Desktop OrderTransUI uses the Sales Config Item Photo / ButtonWidth / ButtonHeight for its buttons
  async getSaleConfig(){
    try {
      this.saleConfig = await firstValueFrom(this.saleConfigService.getSaleConfig()) || {};
    } catch {
      this.saleConfig = {};
    }
    this.osk.setEnabled(this, (this.saleConfig?.OnScreenKeyboard || 'no').toLowerCase() == 'yes');
  }

  get hasPhoto(): boolean {
    return (this.saleConfig?.HasPhoto || 'no').toLowerCase() == 'yes';
  }
  get buttonWidth(): string {
    return +this.saleConfig?.ButtonWidth > 0 ? +this.saleConfig.ButtonWidth + 'px' : null;
  }
  get buttonHeight(): string {
    return +this.saleConfig?.ButtonHeight > 0 ? +this.saleConfig.ButtonHeight + 'px' : null;
  }
  getItemPhoto(row: any): string {
    return (_url + 'img/files/items/' + row.Photo).replace('/api', '');
  }
  // the photo to show (Sales Config Item Photo = yes and the item has one); else the placeholder
  photoUrl(row: any): string | null {
    return this.hasPhoto && row?.Photo ? this.getItemPhoto(row) : null;
  }
  // cart lines carry no photo / category: they come from the item list
  private stocksById: Map<string, any> = new Map();
  private stocksByIdSource: any = null;
  itemFor(itemId: string): any {
    if (this.stocksByIdSource !== this.stocks) {
      this.stocksByIdSource = this.stocks;
      this.stocksById = new Map((this.stocks || []).map(s => [s.ItemId, s]));
    }
    return this.stocksById.get(itemId) || {};
  }

  // ---------- CATEGORY / PRODUCT (Desktop ShowCategorys / ShowProducts / tabControl_Click) ----------
  trackByKey(index: number, item: any){
    return item.key;
  }

  buildCategoryTiles(){
    // Desktop ShowCategorys: only categories that have saleable items
    var categories = Array.from(new Set((this.stocks || []).map(x => x.Category).filter(x => !!x))) as string[];
    this.categoryTiles = ['All', ...categories.sort((a, b) => a.localeCompare(b))];
  }

  selectTab(tab: string){
    this.activeTab = tab;
    this.tilePageIndex = 0;
    if (tab == 'category') this.buildCategoryTiles();
    if (tab == 'product') {
      this.selectedCategory = 'All';
      this.displayStocks();
    }
    this.scheduleFitTiles();
  }

  onClickCategoryTile(category: string){
    this.selectedCategory = category;
    this.displayStocks();
    this.activeTab = 'product';
    this.scheduleFitTiles();
  }

  // Desktop dtgProduct_Click: the tapped product is added (qty 1 or the qty popup)
  onClickItemTile(row: any){
    this.getRecord1(row);
    this.onFocusQty();
  }

  get pagedItems(): any[] {
    var data = this.listData1?.filteredData ?? [];
    var start = this.pageIndex * this.pageSize;
    return data.slice(start, start + this.pageSize);
  }

  get pagedTiles(): any[] {
    var start = this.tilePageIndex * this.tilePageSize;
    return this.categoryTiles.slice(start, start + this.tilePageSize);
  }

  get pageLabel(): string {
    var product = this.activeTab == 'product';
    var total = product ? (this.listData1?.filteredData?.length || 0) : this.categoryTiles.length;
    var size = product ? this.pageSize : this.tilePageSize;
    var index = product ? this.pageIndex : this.tilePageIndex;
    var pages = Math.max(1, Math.ceil(total / size));
    return 'Page ' + (Math.min(index, pages - 1) + 1) + ' of ' + pages;
  }

  onClickPrevPage(){
    if (this.activeTab == 'product') { if (this.pageIndex > 0) this.pageIndex--; }
    else if (this.tilePageIndex > 0) this.tilePageIndex--;
  }

  onClickNextPage(){
    if (this.activeTab == 'product') {
      if ((this.pageIndex + 1) * this.pageSize < (this.listData1?.filteredData?.length || 0)) this.pageIndex++;
    } else if ((this.tilePageIndex + 1) * this.tilePageSize < this.categoryTiles.length) {
      this.tilePageIndex++;
    }
  }

  // ---------- a page holds as many buttons as fit (Desktop GenerateDynamicButtons) ----------
  private tilesResizeObserver: any = null;
  private fitTilesTimer: any = null;
  private fitPasses = 0;

  ngAfterViewInit(){
    // phones get their own layout (same logic); tablets and laptops keep the Desktop layout
    this.breakpointSubscription = this.breakpointObserver.observe(PHONE_QUERY).subscribe(state => {
      if (this.isPhone == state.matches) return;
      this.isPhone = state.matches;
      this.phoneSheet = null;
      // the desktop tile panel is re-created: watch the new one
      setTimeout(() => this.attachTilesObserver());
    });
    this.attachTilesObserver();
  }

  private attachTilesObserver(){
    var RO = (window as any).ResizeObserver;
    if (this.tilesResizeObserver) this.tilesResizeObserver.disconnect();
    this.tilesResizeObserver = null;
    if (RO && this.tableContainer) {
      this.tilesResizeObserver = new RO(() => this.ngZone.run(() => this.scheduleFitTiles()));
      this.tilesResizeObserver.observe(this.tableContainer.nativeElement);
    }
  }

  // ===== Phone layout (layout only: every action calls the same methods as the Desktop layout) =====
  isPhone        : boolean = typeof window != 'undefined' && window.matchMedia ? window.matchMedia(PHONE_QUERY).matches : false;
  phoneSheet     : 'cart' | null = null;
  phoneLimit     : number = 40;
  private breakpointSubscription: Subscription;

  get phoneItems(): any[] {
    return (this.listData1?.filteredData ?? []).slice(0, this.phoneLimit);
  }
  get phoneHasMore(): boolean {
    return (this.listData1?.filteredData?.length ?? 0) > this.phoneLimit;
  }
  get phoneItemCount(): number {
    return (this.orderDetails || []).reduce((sum, x) => sum + (+x.Qty || 0), 0);
  }
  onPhoneCategory(category: string){
    this.phoneLimit = 40;
    this.onClickCategoryTile(category);
  }
  onPhoneSearch(){
    this.phoneLimit = 40;
    if (this.activeTab != 'product') this.activeTab = 'product';
    this.applyFilter();
  }
  openPhoneCart(){
    this.osk.close();
    this.phoneSheet = 'cart';
  }
  // the order line actions of the Desktop right-click menu
  get phoneLineActions(): any[] {
    return this.contextButtons.filter(b => b.Disabled && ['Edit', 'Remove'].includes(b.Label));
  }
  get phoneMenuActions(): any[] {
    return this.contextButtons.filter(b => b.Disabled && !['Edit', 'Remove'].includes(b.Label));
  }
  onPhoneLineAction(row: any, action: any){
    this.getRecord2(row);
    this.phoneSheet = null;   // its dialog / confirmation opens on the page
    action.Function();
  }
  onPhoneSave(){
    this.osk.close();
    this.phoneSheet = null;
    this.onClickSaveTransaction();
  }
  // Desktop keeps the search box focused for the barcode scanner; a phone would pop up its keyboard
  focusSearch(){
    if (!this.isPhone) this.searchInput?.nativeElement?.focus();
  }

  ngOnDestroy(){
    this.osk.setEnabled(this, false);
    this.breakpointSubscription?.unsubscribe();
    if (this.tilesResizeObserver) this.tilesResizeObserver.disconnect();
    clearTimeout(this.fitTilesTimer);
  }

  scheduleFitTiles(){
    this.fitPasses = 0;
    this.queueFitTiles();
  }

  private queueFitTiles(){
    clearTimeout(this.fitTilesTimer);
    this.fitTilesTimer = setTimeout(() => this.fitTiles(), 0);
  }

  private fitTiles(){
    var size = fitTilePageSize(this.tableContainer?.nativeElement);
    if (size <= 0) return;
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
    if (++this.fitPasses < 3) this.queueFitTiles();
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

  async getOrderConfig(){
    this.orderConfig = await firstValueFrom(this.orderConfigService.getOrderConfig());
  }

  async getTransCode(){
    this.transCode = null;   // Desktop: no number until the first line is saved (it then gets its temporary TransNo)
  }

  async getOrderDetails(){
    this.isLoading2 = true;
    try{
      this.orderHeader = await firstValueFrom(this.orderHeadersService.getOrderHeaderByRecordStatusByInputBy('ongoing',this.auth_service.User));

      if (!this.orderHeader) {
        this.orderDetails = [];
        this.customerId = 'CASH';
        this.transCode = null;
      }
      else{
        this.orderDetails = await firstValueFrom(this.orderDetailsService.getOrderDetailsByTransCode(this.orderHeader.TransCode));
        this.customerId = this.orderHeader.CustomerId;
        this.transCode = this.orderHeader.TransCode;
        this.rePriceStocks();
      }
    }
    finally{
      this.isLoading2 = false;
      this.displayOrderDetails();
    }
    // if(this.transCode == null){
    //   await this.getTransCode();
    // }
    // this.isLoading2 = true;
    // this.orderHeader  = await firstValueFrom(this.orderHeadersService.getOrderHeaderByTransCode(this.transCode));
    // this.orderDetails =  await firstValueFrom(this.orderDetailsService.getOrderDetailsByTransCode(this.transCode));
    // if(this.orderHeader){
    //   if(this.orderHeader.CustomerId){
    //     if(this.customerId  != 'CASH'){
    //       this.customerId = this.customerId
    //     }else{
    //       this.customerId = this.orderHeader.CustomerId
    //     }
    //   }
    // }else{
    //   if(!this.customerId){
    //     this.customerId = 'CASH';
    //   }
    // }
    
    // if(this.orderDetails)
    //   this.isLoading2 = false;
    // this.displayOrderDetails();
  } 

  // async getOrderDetails(){
  //   if(this.transCode == null){
  //     await this.getTransCode();
  //   }
  //   this.isLoading2 = true;
  //   this.orderHeader  = await firstValueFrom(this.orderHeadersService.getOrderHeaderByTransCode(this.transCode));
  //   this.orderDetails =  await firstValueFrom(this.orderDetailsService.getOrderDetailsByTransCode(this.transCode));
  //   if(this.orderHeader){
  //     if(this.orderHeader.CustomerId){
  //       if(this.customerId  != 'CASH'){
  //         this.customerId = this.customerId
  //       }else{
  //         this.customerId = this.orderHeader.CustomerId
  //       }
  //     }
  //   }else{
  //     if(!this.customerId){
  //       this.customerId = 'CASH';
  //     }
  //   }
    
  //   if(this.orderDetails)
  //     this.isLoading2 = false;
  //   this.displayOrderDetails();
  // } 

  async getStocks(){
    this.isLoading1 = true;
    this.stocks = await firstValueFrom(this.stocksService.getCBOStocksForSaleByItemType('all'));
    this.rePriceStocks();
  }

  async rePriceStocks(){
    if (this.customerId.toLowerCase() != "" && this.customerId.toLowerCase( ) != "cash")
    {
      //refresh list
      this.listData1 = new MatTableDataSource([]);
      this.listData1.paginator = this.paginator1;
      
      this.stocks = await firstValueFrom(this.stocksService.repriceStocksByCustomerId(this.customerId, this.stocks));
      this.filteredStocks = this.stocks;
    }else{
      this.filteredStocks = this.stocks;
    }
    this.isLoading1 = false;
    this.displayStocks();
  }

  displayStocks(){
    var data = this.filteredStocks || [];
    if (this.selectedCategory && this.selectedCategory != 'All')
      data = data.filter(x => x.Category == this.selectedCategory);
    this.resetSearchBoxes();
    this.listData1 = new MatTableDataSource(data);
    // Desktop PerformSearch: Alias or ItemName (and the barcode)
    this.listData1.filterPredicate = (d: any, key: string) =>
      (d.Alias || '').toLowerCase().includes(key) || (d.ItemName || '').toLowerCase().includes(key) || (d.Barcode || '').toLowerCase().includes(key);
    this.pageIndex = 0;
    this.buildCategoryTiles();
    this.focusSearch();
  }
  displayOrderDetails(){
    var data = this.orderDetails; 
    this.totalAmount = this.orderDetails.reduce((sum, x) => sum + +x.Amount, 0);
    this.selectedId = undefined;
    this.selectedData = undefined;
    this.listData2 = new MatTableDataSource(data);
    this.listData2.paginator = this.paginator2;
  }

  async onChangeCustomer(data){
    if(this.orderDetails.length > 0){
      return this.notificationService.popupWarning3Buttons('Ongoing Transaction', 'Transaction for '+this.orderDetails[0].CustomerName+' is ongoing. Save transaction as pending first to avoid data loss. CONTINUE?', 'Override Customer', 'Save as Pending', 'Cancel').then(async (result) => {
        if (result.isConfirmed) {
          await this.getStocks();
          this.orderTransactionService.saveAsPendingOrderByTransCode(this.transCode).subscribe({
            next:async (res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.customerId = data.CustomerId;
              await this.getTransCode();
              this.orderHeader = null;   // Save As Pending: start a new transaction (the saved one stays in Show Pending, Desktop)
              this.orderDetails = [];
              this.displayOrderDetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
        }
        else if (result.isDenied) {
          await this.getStocks();
          this.orderTransactionService.overrideOrderCustomerByTransCode(this.transCode, data.CustomerId).subscribe({
            next:async (res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.customerId = data.CustomerId;
              await this.getTransCode();
              this.getOrderDetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
        }else{
          this.customerId = this.orderDetails[0].CustomerId;
        }
        
      });
    }else{
        await this.getStocks();
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
    if(this.transCode === null){
      await this.getTransCode();
    }

    if(!this.selectedItem || this.selectedItem == undefined){
      this.getFirstRecord();
    }
    if (!this.selectedItem) return;

    // Desktop PopupQtyUI: qty 1 straight away, the qty popup only with Order Config PopupQty or other UMs.
    // The tile's stock row already has the price / UM, so the full item is fetched only for the popup.
    const usePopup = !!this.selectedItem.Multiple || (this.orderConfig.PopupQty || '').toLowerCase() == 'yes'
                     || (this.selectedItem.HasMultipleUMs || 'no').toLowerCase() == 'yes';
    if (!usePopup) return this.saveToOrderHeaders();

    var oldPrice = this.selectedItem.Price;
    var oldPriceCategory = this.selectedItem.PriceCategory;
    var origUM = this.selectedItem.UM;
    var stock:any  = await firstValueFrom(this.stocksService.getItemByItemId(this.selectedItem.ItemId));
    stock.Price = oldPrice;
    stock.PriceCategory = oldPriceCategory;
    if(this.selectedItem.Multiple){
      stock.UM = origUM;
    }
    stock.TransCode = this.transCode;
    stock.CustomerId = this.customerId;
    return this.PopupQtyUI(stock);
  }

  saveToOrderHeaders()
  {
    this.orderTransactionService.saveToOrderHeaders(this.selectedItem.ItemId, this.qty ?? 1, this.transCode, this.customerId, this.selectedItem.Price, this.selectedItem.UM, this.selectedItem.PriceCategory).subscribe({
      next: (res)=>{
        this.transCode = res.orderDetail?.TransNo ?? this.transCode;  // the first line gets the temporary TransNo
        this.notif.toastrSuccess(res.message);
        this.orderDetails = [ res.orderDetail,...this.orderDetails]; 
        this.displayOrderDetails();
        this.resetSearchBoxes();
      },
      error: (err)=>{
        this.notif.toastrError(err.error.message);
        this.itemId = undefined;
      }
    }); 
  }

  async PopupQtyUI(stock)
  {
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = (['',stock, 'additemordertransaction']);
    this.dialog.open(OrderDetailUIComponent,dialogConfig).beforeClosed().subscribe(orderDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(orderDetail) ? orderDetail[0] : orderDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo
      if(orderDetail){
        this.transCode = orderDetail.TransNo ?? this.transCode;  // the first line gets the temporary TransNo
        this.orderDetails = [ orderDetail,...this.orderDetails]; 
        this.displayOrderDetails();
        this.resetSearchBoxes();
      }
    });
  }
  
  async onClickSaveTransaction(){
    if (!this.matTableService.CommonTransaction()) {
      return;
    }
    if(this.orderDetails.length == 0)
      return this.notificationService.toastrWarning('Empty Transaction');

    var customer:any = await firstValueFrom(this.customersService.getCustomerByCustomerId(this.customerId));

    this.disableSave = true;
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data = ([customer,this.orderHeader, this.transCode, this.totalAmount,'saveordertransaction']);
    this.dialog.open(OrderHeaderUIComponent,dialogConfig).beforeClosed().subscribe(async x => {
      if(x){
        await this.getTransCode();
        this.orderHeader = null;
        this.customerId = 'CASH';
        this.orderDetails= [];
        this.displayOrderDetails();
        this.resetSearchBoxes();
      }
    });
    
  }

 async onClickEdit(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    
    var orderDetail:any = await firstValueFrom(this.orderDetailsService.getOrderDetailById(this.selectedData.id));
    var stock:any = await firstValueFrom(this.stocksService.getItemByItemId(this.selectedData.ItemId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = ([orderDetail,stock, 'updateordertransaction']);
    this.dialog.open(OrderDetailUIComponent,dialogConfig).beforeClosed().subscribe(orderDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(orderDetail) ? orderDetail[0] : orderDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo
      if(orderDetail){
        const orderDetailIndex = this.orderDetails.findIndex(detail => detail.id === orderDetail.id);
        if (orderDetailIndex !== -1) {
          this.orderDetails[orderDetailIndex] = orderDetail;  
        }
        this.displayOrderDetails();
      }
    });
  }

  onClickRemove(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notificationService.popupWarning("Delete Record",this.selectedData.ItemName+ " will be remove. Continue?").then((result) => {
      if (result.value) {
        this.orderTransactionService.deleteOrderDetailById(this.selectedData.id).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.orderDetails = this.orderDetails.filter(x => x.id != this.selectedData.id);
              this.displayOrderDetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error.message);
            },
        });
      }
    });
  }

  onClickRemoveAll(){
    if(this.orderDetails.length == 0)
      return this.notificationService.toastrWarning('Empty Transaction');

    this.notificationService.popupWarning("Delete Record","All Items will be REMOVED. Continue?").then((result) => {
      if (result.value) {
        this.orderTransactionService.deleteOrderDetailsByTransCode(this.transCode).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.orderDetails = [];
              this.displayOrderDetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error.message);
            },
        });
      }
    });
  }

  onClickSaveAsPending(){
    if(this.orderDetails.length == 0)
      return this.notificationService.toastrWarning('Empty Transaction');

    this.notificationService.popupWarning("Pending Order","All Items will be save as pending. Continue?").then((result) => {
      if (result.value) {
        this.orderTransactionService.saveAsPendingOrderByTransCode(this.transCode).subscribe({
          next:async (res)=>{
            this.notificationService.toastrSuccess(res.message);
            await this.getTransCode();
            this.orderHeader = null;   // Save As Pending: start a new transaction (the saved one stays in Show Pending, Desktop)
            this.orderDetails = [];
            this.displayOrderDetails();
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
    this.dialog.open(OrderPendingTransactionsUIComponent,dialogConfig).beforeClosed().subscribe(async res => {
      if(res){
        this.transCode = res.transCode; 
        this.orderDetails = res.orderDetails; 
        this.orderHeader = res.orderHeader; 
         if( res.orderHeader.CustomerId !=  this.customerId){
          this.customerId = res.orderHeader.CustomerId; 
          await this.rePriceStocks();
        }
        

        this.customerId = res.orderHeader.CustomerId; 
        this.displayOrderDetails();
      }
    });
  }


  onClickNewCustomer(){
      if (!this.matTableService.CommonTransaction()) {
      return;
    }
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = (['','order',[]]);
    this.dialog.open(CustomerUIComponent,dialogConfig).beforeClosed().subscribe(customer => {
      if(customer){
        this.customers = [customer,...this.customers]; 
      }
    });
  }


  updateElementOrderDetail(event: any, id, Column){
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
    this.orderTransactionService.updateElementOrderDetail(id, Column, Value).subscribe({
      next:(res) =>{
        this.notif.toastrSuccess(res.message);

        //update orderDetailsDisplay
        const orderDetailIndex = this.orderDetails.findIndex(detail => detail.id === id);
        if (orderDetailIndex !== -1) {
          this.orderDetails[orderDetailIndex] = res.orderDetail;  
        }
        this.displayOrderDetails();
      },
      error:(err) => {
        this.notif.toastrError(err.error.message);
      },
    });
  }


  // by name: the phone layout has its own menu button (⋮), which must not be taken for the right-click menu
  @ViewChild('contextMenuTrigger', { read: MatMenuTrigger })
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  onContextMenu(event: MouseEvent, data: any) {
    if(data)
      this.getRecord2(data);
    
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { 'data': data };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
  }

  applyFilter(){
    if (!this.listData1) return;
    this.matTableService.applyFilter(this.listData1, this.searchKey1 || '');
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

  resetSearchBoxes(){
    this.itemId = undefined;
    this.qty = undefined;
    this.selectedItem = undefined;
    this.searchKey1 = undefined;
    this.focusSearch();
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
