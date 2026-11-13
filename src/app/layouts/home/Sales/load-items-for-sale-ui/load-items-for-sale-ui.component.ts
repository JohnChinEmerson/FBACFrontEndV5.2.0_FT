import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { StocksService } from 'src/app/services/Inventory/stocks.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SalesTransactionService } from 'src/app/services/Sales/sales-transaction.service';
import { SaleConfigService } from 'src/app/services/Sales/sale-config.service';
import { SaleDetailUIComponent } from '../sale-detail-ui/sale-detail-ui.component';
import { SaleHeadersService } from 'src/app/services/Sales/sale-headers.service';
import { CustomersService } from 'src/app/services/Files/customers.service';
import { ItemPriceCategorysService } from 'src/app/services/Files/item-price-categorys.service';
import { UseForTaggingsService } from 'src/app/services/Files/use-for-taggings.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';

@Component({
  selector: 'app-load-items-for-sale-ui',
  templateUrl: './load-items-for-sale-ui.component.html',
  styleUrls: ['./load-items-for-sale-ui.component.css']
})
export class LoadItemsForSaleUIComponent implements OnInit {
  stocks           : any=[];
  useForTaggings           : any=[];
  useFor : string = 'All';
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  selectedItem : any;
  isColorOutOfStock : boolean = true;

  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Save To Sales','Function'   : () => this.onClickSaveToSales(),'Disabled': true,}, 
  ];  
  contextButtons     = [];
  defaultColumns  = ['ItemName','UM','Category','Price','Available'];

  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Price','Available'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};
  transNo: string;
  customerId: string;
  saleDetails: any=[];
  saleHeader: any;
  saleConfig: any=[];
  stock: any;
  ui: any;
  customer: any=[];
  constructor(
    private dialog                      : MatDialog,
    private dialogRef                   : MatDialogRef<LoadItemsForSaleUIComponent>,
    private stocksService        : StocksService,
    private useForTaggingsService        : UseForTaggingsService,
    private notificationService : NotificationService,
    private customersService      : CustomersService,
    private itemPriceCategorysService      : ItemPriceCategorysService,
    public matTableService     : MatTableService,
    private saleConfigService        : SaleConfigService,
    private salesTransactionService : SalesTransactionService,
    private saleHeadersService : SaleHeadersService,
    private globalConfigService         : GlobalConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.isColorOutOfStock = await this.globalConfigService.isColorOutOfStock();
    this.transNo = this.data[0];
    this.customerId    = this.data[1];
    this.saleDetails = this.data[2];
    this.saleHeader = this.data[2];
    this.ui = this.data[3];
    this.getSaleConfig();
    this.getUseForTaggings();
    this.onClickView();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }


  async getUseForTaggings(){
    this.useForTaggings = await firstValueFrom(this.useForTaggingsService.getUseForTaggings());
    var a:any = {
      'UseFor' : 'All'
    };
    this.useForTaggings.push(a);
  }
  async getSaleConfig(){
    this.saleConfig = await firstValueFrom(this.saleConfigService.getSaleConfig());
  }

  async onClickView(){
    this.isLoading = true;
    this.stocks = await firstValueFrom(this.stocksService.getStocksForSaleByItemType('all'));
    if(this.stocks)
      this.isLoading = false;
    this.rePriceStocks();
  }

  async rePriceStocks(){
    if (this.customerId.toLowerCase() != "" && this.customerId.toLowerCase( ) != "cash")
    {
      this.stocks = await firstValueFrom(this.stocksService.repriceStocksByCustomerId(this.customerId, this.stocks));
    }
    this.displayRecords();
  }

  displayRecords(){
    var data = this.stocks;
    if(this.useFor.toLowerCase() != 'all')
        data = data.filter(x => x.UseFor.toLowerCase() == this.useFor.toLowerCase());
    this.listData =  new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }


  applyFilter(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch(){
    this.searchKey =  this.matTableService.clearSearch(this.listData);
  }

  getRecord(data : any){
    this.selectedId = data.ItemId;
    this.selectedData = data;
  }

  onClose(){
    if(this.ui == 'salestransaction'){
      this.dialogRef.close(this.saleDetails);
    }
    if(this.ui == 'salereceipts'){
      this.dialogRef.close(this.saleHeader);
    }
  }

  applyFilter2(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
    this.selectedId = this.listData.filteredData[0].ItemId;
    this.onClickSaveToSales();
  }

  async onClickSaveToSales(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    this.selectedItem  = this.stocks.filter(x => x.ItemId == this.selectedId);
    this.selectedItem = this.selectedItem[0];

    var oldPrice = this.selectedItem.Price;
    var oldPriceCategory = this.selectedItem.PriceCategory;
    var stock:any  = await firstValueFrom(this.stocksService.getItemByItemId(this.selectedItem.ItemId));
        stock.Price = oldPrice;
        stock.PriceCategory = oldPriceCategory;
        stock.TransNo = this.transNo;
        stock.CustomerId = this.customerId;
        stock.RecordStatusCashiering = 'open';
        
    if(this.saleConfig.PopupQty.toLowerCase() == 'yes' || this.ui == 'salereceipts' ||  this.selectedItem.HasMultipleUMs.toLowerCase() == 'yes')
      this.PopupQtyUI2(stock);
    else{
      this.salesTransactionService.saveToSaleHeaders(this.selectedId, 1,  this.transNo, this.customerId, this.selectedItem.Price, this.selectedItem.UM, this.selectedItem.PriceCategory,'open').subscribe({
        next: (res)=>{
          this.notificationService.toastrSuccess(res.message);
          this.saleDetails = [ res.saleDetail,...this.saleDetails]; 
          this.selectedId = undefined;
        },
        error: (err)=>{
          this.notificationService.toastrError(err.error.message);
        }
      }); 
    }
  }

  async PopupQtyUI2(stock)
  {
    
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    if(this.ui == 'salestransaction'){
      dialogConfig.data = (['',stock, 'additemsalestransaction']);
    }
    if(this.ui == 'salereceipts'){
      stock.TransNo   = this.saleHeader.TransNo;
      dialogConfig.data = (['',stock, 'additemsalereceipts'
      ]);
    }
    this.dialog.open(SaleDetailUIComponent,dialogConfig).beforeClosed().subscribe(async saleDetail => {
      if(this.ui == 'salestransaction'){
        this.saleDetails = [ saleDetail,...this.saleDetails]; 
        this.selectedId = undefined;
      }
      if(this.ui == 'salereceipts'){
        this.saleHeader = await firstValueFrom(this.saleHeadersService.getSaleHeaderByTransNo(saleDetail.TransNo));
      }
    });
   
  }

}
