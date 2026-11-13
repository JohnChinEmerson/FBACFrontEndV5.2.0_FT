import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { CustomersService } from 'src/app/services/Files/customers.service';
import { ItemPriceCategorysService } from 'src/app/services/Files/item-price-categorys.service';
import { StocksService } from 'src/app/services/Inventory/stocks.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { OrderConfigService } from 'src/app/services/Orders/order-config.service';
import { OrderHeadersService } from 'src/app/services/Orders/order-headers.service';
import { OrderTransactionService } from 'src/app/services/Orders/order-transaction.service';
import { OrderDetailUIComponent } from '../order-detail-ui/order-detail-ui.component';
import { GlobalConfigService } from 'src/app/services/global-config.service';

@Component({
  selector: 'app-load-items-for-order-ui',
  templateUrl: './load-items-for-order-ui.component.html',
  styleUrls: ['./load-items-for-order-ui.component.css']
})
export class LoadItemsForOrderUIComponent implements OnInit {
  stocks           : any=[];
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
    {'Label'   : 'Save To Order','Function'   : () => this.onClickSaveToOrder(),'Disabled': true,}, 
  ];  
  contextButtons     = [];
  defaultColumns  = ['ItemName','UM','Category','Price','Available'];
  transCode: string;
  customerId: string;
  orderDetails: any=[];
  orderHeader: any;
  orderConfig: any=[];
  stock: any;
  ui: any;
  customer: any=[];

  
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Price','Available'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};

  constructor(
    private dialog                      : MatDialog,
    private dialogRef                   : MatDialogRef<LoadItemsForOrderUIComponent>,
    private stocksService        : StocksService,
    private notificationService : NotificationService,
    private customersService      : CustomersService,
    private itemPriceCategorysService      : ItemPriceCategorysService,
    public matTableService     : MatTableService,
    private orderConfigService        : OrderConfigService,
    private orderTransactionService : OrderTransactionService,
    private orderHeadersService : OrderHeadersService,
    private globalConfigService         : GlobalConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.isColorOutOfStock = await this.globalConfigService.isColorOutOfStock();
    this.transCode = this.data[0];
    this.customerId    = this.data[1];
    this.orderDetails = this.data[2];
    this.orderHeader = this.data[2];
    this.ui = this.data[3];
    this.getOrderConfig();
    this.onClickView();
  }
  
  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }


  async getOrderConfig(){
    this.orderConfig = await firstValueFrom(this.orderConfigService.getOrderConfig());
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
    if(this.ui == 'ordertransaction'){
      this.dialogRef.close(this.orderDetails);
    }
    if(this.ui == 'orderreceipts'){
      this.dialogRef.close(this.orderHeader);
    }
  }

  applyFilter2(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
    this.selectedId = this.listData.filteredData[0].ItemId;
    this.onClickSaveToOrder();
  }

  async onClickSaveToOrder(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    this.selectedItem  = this.stocks.filter(x => x.ItemId == this.selectedId);
    this.selectedItem = this.selectedItem[0];

    var oldPrice = this.selectedItem.Price;
    var oldPriceCategory = this.selectedItem.PriceCategory;
    var stock:any  = await firstValueFrom(this.stocksService.getItemByItemId(this.selectedItem.ItemId));
        stock.Price = oldPrice;
        stock.PriceCategory = oldPriceCategory;
        stock.TransCode = this.transCode;
        stock.CustomerId = this.customerId;

    if(this.orderConfig.PopupQty.toLowerCase() == 'yes' || this.ui == 'orderreceipts' ||  this.selectedItem.HasMultipleUMs.toLowerCase() == 'yes')
      this.PopupQtyUI2(stock);
    else{
      this.orderTransactionService.saveToOrderHeaders(this.selectedId, 1,  this.transCode, this.customerId, this.selectedItem.Price, this.selectedItem.UM, this.selectedItem.PriceCategory).subscribe({
        next: (res)=>{
          this.transCode = res.orderDetail?.TransNo ?? this.transCode;  // the first line gets the temporary TransNo
          this.notificationService.toastrSuccess(res.message);
          this.orderDetails = [ res.orderDetail,...this.orderDetails]; 
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
    if(this.ui == 'ordertransaction'){
      dialogConfig.data = (['',stock, 'additemordertransaction']);
    }
    if(this.ui == 'orderreceipts'){
      stock.TransNo   = this.orderHeader.TransNo;
      dialogConfig.data = (['',stock, 'additemorderreceipts'
      ]);
    }
    this.dialog.open(OrderDetailUIComponent,dialogConfig).beforeClosed().subscribe(async orderDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(orderDetail) ? orderDetail[0] : orderDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo
      if(this.ui == 'ordertransaction'){
        this.orderDetails = [ orderDetail,...this.orderDetails]; 
        this.selectedId = undefined;
      }
      if(this.ui == 'orderreceipts'){
        this.orderHeader = await firstValueFrom(this.orderHeadersService.getOrderHeaderByTransNo(orderDetail.TransNo));
      }
    });
   
  }
}
