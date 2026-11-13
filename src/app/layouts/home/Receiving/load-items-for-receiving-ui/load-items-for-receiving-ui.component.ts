import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ReceivingDetailUIComponent } from '../receiving-detail-ui/receiving-detail-ui.component';
import { ReceivingTransactionService } from 'src/app/services/Receiving/receiving-transaction.service';
import { ReceivingHeadersService } from 'src/app/services/Receiving/receiving-headers.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { StocksService } from 'src/app/services/Inventory/stocks.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { StockSuppliersService } from 'src/app/services/Inventory/stock-suppliers.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';

@Component({
  selector: 'app-load-items-for-receiving-ui',
  templateUrl: './load-items-for-receiving-ui.component.html',
  styleUrls: ['./load-items-for-receiving-ui.component.css']
})
export class LoadItemsForReceivingUIComponent implements OnInit {

  stocks           : any=[];
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  selectedItem : any;
  type :string;
  isColorOutOfStock : boolean = true;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Save To Receiving','Function'   : () => this.onClickSaveToReceiving(),'Disabled': true,}, 
  ];  
  contextButtons     = [];
  defaultColumns  = ['ItemName','UM','Category','Cost','Available'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Cost','Available'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};
  transCode: string;
  supplierId: string;
  receivingDetails: any=[];
  receivingHeader: any;
  stock: any;
  ui: any;
  dateFrom: string | number | Date;
  dateTo: string | number | Date;
  constructor(
    private dialog                      : MatDialog,
    private dialogRef                   : MatDialogRef<LoadItemsForReceivingUIComponent>,
    private stocksService        : StocksService,
    private stockSuppliersService        : StockSuppliersService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService      : DateTimesService,
    public matTableService     : MatTableService,
    private receivingTransactionService : ReceivingTransactionService,
    private receivingHeadersService : ReceivingHeadersService,
    private globalConfigService         : GlobalConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.isColorOutOfStock = await this.globalConfigService.isColorOutOfStock();
    this.transCode = this.data[0];
    this.supplierId    = this.data[1];
    this.receivingDetails = this.data[2];
    this.receivingHeader = this.data[2];
    this.ui = this.data[3];
    this.type = this.data[4];
    this.onClickView();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async onClickView(){
    this.isLoading = true;
    if(this.type.toLocaleLowerCase() == 'stocks')
      this.stocks = await firstValueFrom(this.stocksService.getStocks());
    if(this.type.toLocaleLowerCase() == 'supplieritems')
      this.stocks = await firstValueFrom(this.stockSuppliersService.getStockSuppliersBySupplierId(this.supplierId));
    if(this.stocks)
      this.isLoading = false;
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
    if(this.ui == 'receivingtransaction'){
      this.dialogRef.close(this.receivingDetails);
    }
    if(this.ui == 'receivingreceipts'){
      this.dialogRef.close(this.receivingHeader);
    }
  }

  applyFilter2(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
    this.selectedId = this.listData.filteredData[0].ItemId;
    this.onClickSaveToReceiving();
  }

  onClickSaveToReceiving(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    this.selectedItem  = this.stocks.filter(x => x.ItemId == this.selectedId);
    this.selectedItem = this.selectedItem[0];

    if(this.ui == 'receivingreceipts')
      this.PopupQtyUI2();
    else{
      this.receivingTransactionService.saveToReceivingHeaders(this.selectedId,1,  this.transCode, this.supplierId, this.selectedItem.Cost, this.selectedItem.UM, 'open').subscribe({
        next: (res)=>{
          this.transCode = res.receivingDetail?.TransNo ?? this.transCode;  // the first line gets the temporary TransNo
          this.notificationService.toastrSuccess(res.message);
          this.receivingDetails = [ res.receivingDetail,...this.receivingDetails]; 
          this.selectedId = undefined;
        },
        error: (err)=>{
          this.notificationService.toastrError(err.error.message);
        }
      }); 
    }
  }

  async PopupQtyUI2()
  {
    var stock:any     = await firstValueFrom(this.stocksService.getItemByItemId(this.selectedId));
    stock.TransCode   = this.transCode;
    stock.SupplierId  = this.supplierId;
    
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    if(this.ui == 'receivingtransaction'){
      dialogConfig.data = (['',stock, 'additemreceivingtransaction']);
    }
    if(this.ui == 'receivingreceipts'){
      stock.TransNo   = this.receivingHeader.TransNo;
      dialogConfig.data = (['',stock, 'additemreceivingreceipts'
      ]);
    }
    this.dialog.open(ReceivingDetailUIComponent,dialogConfig).beforeClosed().subscribe(async receivingDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(receivingDetail) ? receivingDetail[0] : receivingDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo
      if(this.ui == 'receivingtransaction'){
        this.receivingDetails = [ receivingDetail,...this.receivingDetails]; 
        this.selectedId = undefined;
      }
      if(this.ui == 'receivingreceipts'){
        this.receivingHeader = await firstValueFrom(this.receivingHeadersService.getReceivingHeaderByTransNo(receivingDetail.TransNo));
      }
    });
   
  }

}
