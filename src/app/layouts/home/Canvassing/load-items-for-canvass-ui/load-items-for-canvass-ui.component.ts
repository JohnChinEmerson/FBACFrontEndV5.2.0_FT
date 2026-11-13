import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { CanvassHeadersService } from 'src/app/services/Canvassing/canvass-headers.service';
import { CanvassTransactionService } from 'src/app/services/Canvassing/canvass-transaction.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { StockSuppliersService } from 'src/app/services/Inventory/stock-suppliers.service';
import { StocksService } from 'src/app/services/Inventory/stocks.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { CanvassDetailUIComponent } from '../canvass-detail-ui/canvass-detail-ui.component';
import { GlobalConfigService } from 'src/app/services/global-config.service';

@Component({
  selector: 'app-load-items-for-canvass-ui',
  templateUrl: './load-items-for-canvass-ui.component.html',
  styleUrls: ['./load-items-for-canvass-ui.component.css']
})
export class LoadItemsForCanvassUIComponent implements OnInit {
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
    {'Label'   : 'Save To Canvass','Function'   : () => this.onClickSaveToCanvass(),'Disabled': true,}, 
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
  reasonId: string;
  canvassDetails: any=[];
  canvassHeader: any;
  stock: any;
  ui: any;
  dateFrom: string | number | Date;
  dateTo: string | number | Date;
  constructor(
    private dialog                      : MatDialog,
    private dialogRef                   : MatDialogRef<LoadItemsForCanvassUIComponent>,
    private stocksService        : StocksService,
    private stockSuppliersService        : StockSuppliersService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService      : DateTimesService,
    public matTableService     : MatTableService,
    private canvassTransactionService : CanvassTransactionService,
    private canvassHeadersService : CanvassHeadersService,
    private globalConfigService         : GlobalConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.isColorOutOfStock = await this.globalConfigService.isColorOutOfStock();
    this.transCode = this.data[0];
    this.reasonId    = this.data[1];
    this.canvassDetails = this.data[2];
    this.canvassHeader = this.data[2];
    this.ui = this.data[3];
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
    this.stocks =  await firstValueFrom(this.stocksService.getStocks());
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
    if(this.ui == 'canvasstransaction'){
      this.dialogRef.close(this.canvassDetails);
    }
    if(this.ui == 'canvassreceipts'){
      this.dialogRef.close(this.canvassHeader);
    }
  }

  applyFilter2(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
    this.selectedId = this.listData.filteredData[0].ItemId;
    this.onClickSaveToCanvass();
  }

  onClickSaveToCanvass(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    this.selectedItem  = this.stocks.filter(x => x.ItemId == this.selectedId);
    this.selectedItem = this.selectedItem[0];

    if(this.ui == 'canvassreceipts')
      this.PopupQtyUI2();
    else{
      if(this.reasonId == undefined)
        return this.notificationService.toastrWarning("Reason Not Found.");
      else{
        this.canvassTransactionService.saveToCanvassHeaders(this.selectedId,1,  this.transCode, this.reasonId, this.selectedItem.UM).subscribe({
          next: (res)=>{
          this.transCode = res.canvassDetail?.TransNo ?? this.transCode;  // the first line gets the temporary TransNo
            this.notificationService.toastrSuccess(res.message);
            this.canvassDetails = [ res.canvassDetail,...this.canvassDetails]; 
            this.selectedId = undefined;
          },
          error: (err)=>{
            this.notificationService.toastrError(err.error.message);
          }
        }); 
      }
      
    }
  }

  async PopupQtyUI2()
  {
    var stock:any     = await firstValueFrom(this.stocksService.getItemByItemId(this.selectedId));
    stock.TransCode   = this.transCode;
    stock.SupplierId  = this.reasonId;
    
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    if(this.ui == 'canvasstransaction'){
      dialogConfig.data = (['',stock, 'additemcanvasstransaction']);
    }
    if(this.ui == 'canvassreceipts'){
      stock.TransNo   = this.canvassHeader.TransNo;
      dialogConfig.data = (['',stock, 'additemcanvassreceipts']);
    }
    this.dialog.open(CanvassDetailUIComponent,dialogConfig).beforeClosed().subscribe(async canvassDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(canvassDetail) ? canvassDetail[0] : canvassDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo
      if(this.ui == 'canvasstransaction'){
        this.canvassDetails = [ canvassDetail,...this.canvassDetails]; 
        this.selectedId = undefined;
      }
      if(this.ui == 'canvassreceipts'){
        this.canvassHeader = await firstValueFrom(this.canvassHeadersService.getCanvassHeaderByTransNo(canvassDetail.TransNo));
      }
    });
   
  }

}
