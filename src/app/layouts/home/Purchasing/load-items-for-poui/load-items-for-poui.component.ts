import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { StockSuppliersService } from 'src/app/services/Inventory/stock-suppliers.service';
import { StocksService } from 'src/app/services/Inventory/stocks.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { POHeadersService } from 'src/app/services/Purchasing/poheaders.service';
import { POTransactionService } from 'src/app/services/Purchasing/potransaction.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { PODetailUIComponent } from '../podetail-ui/podetail-ui.component';
import { GlobalConfigService } from 'src/app/services/global-config.service';

@Component({
  selector: 'app-load-items-for-poui',
  templateUrl: './load-items-for-poui.component.html',
  styleUrls: ['./load-items-for-poui.component.css']
})
export class LoadItemsForPOUIComponent implements OnInit {

  stocks           : any=[];
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  selectedItem : any;
  type :string;
  stockType :string;
  isColorOutOfStock : boolean = true;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Save To PO','Function'   : () => this.onClickSaveToPO(),'Disabled': true,}, 
  ];  
  contextButtons     = [];
  defaultColumns  = ['ItemName','UM','Category','Cost','Available', 'AlertQty'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Cost','Available', 'AlertQty'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  transCode: string;
  supplierId: string;
  poDetails: any=[];
  poHeader: any;
  stock: any;
  ui: any;
  dateFrom: string | number | Date;
  dateTo: string | number | Date;
  constructor(
    private dialog                      : MatDialog,
    private dialogRef                   : MatDialogRef<LoadItemsForPOUIComponent>,
    private stocksService        : StocksService,
    private stockSuppliersService        : StockSuppliersService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService      : DateTimesService,
    public matTableService     : MatTableService,
    private poTransactionService : POTransactionService,
    private poHeadersService : POHeadersService,
    private globalConfigService         : GlobalConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.isColorOutOfStock = await this.globalConfigService.isColorOutOfStock();
    this.transCode = this.data[0];
    this.supplierId    = this.data[1];
    this.poDetails = this.data[2];
    this.poHeader = this.data[2];
    this.ui = this.data[3];
    this.type = this.data[4];
    this.DisplayTab('stocks');
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  DisplayTab(type){
    this.stockType = type.toLowerCase();
    this.matTableService.clearList(this.listData);
    this.onClickView();
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

    // if(this.stockType == 'stocks'){
    //   data = data.filter(x => +x.Available >= +x.AlertQty && +x.Available > 0);
    // }
    if(this.stockType == 'out of stocks'){
      data = data.filter(x => +x.Available <= 0);
    }
    if(this.stockType == 'alert qty'){
      data = data.filter(x => +x.Available <= +x.AlertQty);
    }
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
    if(this.ui == 'potransaction'){
      this.dialogRef.close(this.poDetails);
    }
    if(this.ui == 'poreceipts'){
      this.dialogRef.close(this.poHeader);
    }
  }

  applyFilter2(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
    this.selectedId = this.listData.filteredData[0].ItemId;
    this.onClickSaveToPO();
  }

  onClickSaveToPO(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    this.selectedItem  = this.stocks.filter(x => x.ItemId == this.selectedId);
    this.selectedItem = this.selectedItem[0];

    if(this.ui == 'poreceipts')
      this.PopupQtyUI2();
    else{
      this.poTransactionService.saveToPOHeaders(this.selectedId,1,  this.transCode, this.supplierId, this.selectedItem.Cost, this.selectedItem.UM).subscribe({
        next: (res)=>{
          this.transCode = res.poDetail?.TransNo ?? this.transCode;  // the first line gets the temporary TransNo
          this.notificationService.toastrSuccess(res.message);
          this.poDetails = [ res.poDetail,...this.poDetails]; 
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
    if(this.ui == 'potransaction'){
      dialogConfig.data = (['',stock, 'additempotransaction']);
    }
    if(this.ui == 'poreceipts'){
      stock.TransNo   = this.poHeader.TransNo;
      dialogConfig.data = (['',stock, 'additemporeceipts'
      ]);
    }
    this.dialog.open(PODetailUIComponent,dialogConfig).beforeClosed().subscribe(async poDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(poDetail) ? poDetail[0] : poDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo
      if(this.ui == 'potransaction'){
        this.poDetails = [ poDetail,...this.poDetails]; 
        this.selectedId = undefined;
      }
      if(this.ui == 'poreceipts'){
        this.poHeader = await firstValueFrom(this.poHeadersService.getPOHeaderByTransNo(poDetail.TransNo));
      }
    });
   
  }

}
