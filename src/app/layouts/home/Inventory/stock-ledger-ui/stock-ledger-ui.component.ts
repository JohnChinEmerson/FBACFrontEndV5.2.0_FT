import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { InventoryStocksService } from 'src/app/services/Inventory/inventory-stocks.service';
import { StocksEndingBalanceService } from 'src/app/services/Inventory/stocks-ending-balance.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-stock-ledger-ui',
  templateUrl: './stock-ledger-ui.component.html',
  styleUrls: ['./stock-ledger-ui.component.css']
})
export class StockLedgerUIComponent implements OnInit {

  stock           : any=[];
  stockLedger     : any[];
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  dateFrom        : any = new Date();
  dateTo          : any = new Date();
  withDate        : boolean = false;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
  ];  
  contextButtons     = [];
  defaultColumns  = ['InputDate','TransNo','TransName','ExpiryDate','BatchLotNo','UM','QtyIn','QtyOut','Conversion','RunningQty'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['QtyIn','QtyOut','Conversion','RunningQty'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};

  constructor(
    private dialog                      : MatDialog,
    private dialogRef                   : MatDialogRef<StockLedgerUIComponent>,
    private stocksEndingBalanceService        : StocksEndingBalanceService,
    private inventoryStocksService        : InventoryStocksService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService      : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  ngOnInit(): void {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.withDate = this.data[0];
    this.stock    = this.data[1];
    this.dateFrom = this.data[2];
    this.dateTo   = this.data[3];
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
    this.stockLedger = await firstValueFrom(this.stocksEndingBalanceService.getStocksLedgerByItemId(
      this.stock.ItemId,
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      this.withDate
    ));
    if(this.stock)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.stockLedger;
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
    this.selectedId = data.TransNo;
    this.selectedData = data;
  }

  async onClickLedger(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    var data = await firstValueFrom(this.inventoryStocksService.getInventoryRecordByItemId(this.selectedId));
    if (data == null)
    {
      return this.notificationService.toastrWarning("Item can no longer be found in the master list.");
    }

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data         = ([this.withDate, data,this.dateFrom, this.dateTo]);
    this.dialog.open(StockLedgerUIComponent,dialogConfig);

  }

  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printstockledger']));
    var data  = this.listData.filteredData;
    var title = this.stock.ItemName.toUpperCase()+' LEDGER';
    if(this.withDate){
      title = this.stock.ItemName.toUpperCase()+' LEDGER FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    }
    this.printService.popupWindow(url, 'Items', window, 800, 800);
    localStorage.setItem('Items', JSON.stringify(data));
    localStorage.setItem('Title', title);
  }
  
  onContextMenu(event: MouseEvent, data: any) {
    if(this.contextButtons.length > 0){
      this.getRecord(data);
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { 'data': data };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }

}
