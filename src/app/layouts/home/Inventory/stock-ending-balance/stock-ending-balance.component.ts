import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { StocksEndingBalanceService } from 'src/app/services/Inventory/stocks-ending-balance.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { _url } from 'src/global-variables';
import { HomeComponent } from '../../home.component';
import { DateTimesService } from 'src/app/services/date-times.service';
import { InventoryStocksService } from 'src/app/services/Inventory/inventory-stocks.service';
import { StockLedgerUIComponent } from '../stock-ledger-ui/stock-ledger-ui.component';
import { MultipleUMsComponent } from '../../Files/multiple-ums/multiple-ums.component';

@Component({
  selector: 'app-stock-ending-balance',
  templateUrl: './stock-ending-balance.component.html',
  styleUrls: ['./stock-ending-balance.component.css']
})
export class StockEndingBalanceComponent implements OnInit {

  items           : any[];
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
    {'Label'   : 'Ledger','Function'       : () => this.onClickLedger(),'Disabled': true,}, 
  ];  
  contextButtons     = [
     {'Label'   : 'MultipleUMs','Function'       : () => this.onClickMultipleUMs(),'Disabled': true,}, 
];
  defaultColumns  = ['ItemName','UM','BegBalance','StockIn','StockOut','EndBalance'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['BegBalance','StockIn','StockOut','EndBalance'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private stocksEndingBalanceService        : StocksEndingBalanceService,
    private inventoryStocksService        : InventoryStocksService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService      : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.contextButtons, this.toolButtons, null, null);
    this.stocksEndingBalanceService.requiredRefresh.subscribe(()=>{
      this.onClickView();
    });
  }
isMultipleUMs(): boolean {
  return this.selectedData.HasMultipleUMs === true;
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
    this.items = await firstValueFrom(this.stocksEndingBalanceService.getStocksEndingBalance(
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      this.withDate
    ));
    if(this.items)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.items;
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
getRecord(data: any) {
  this.selectedId = data.ItemId;
  this.selectedData = data;
  this.contextButtons[0].Disabled = this.isMultipleUMs();
}
  async onClickLedger(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    var data = await firstValueFrom(this.inventoryStocksService.getInventoryRecordByItemId(this.selectedId));
    if (data == null)
    {
      return this.notificationService.toastrWarning("Item can no longer be found in the master list.");
    }
    else{
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1500px';
      dialogConfig.data         = ([this.withDate, data,this.dateFrom, this.dateTo]);
      this.dialog.open(StockLedgerUIComponent,dialogConfig);
    }
  }
onClickMultipleUMs() {
  if (!this.matTableService.checkNull(this.selectedId)) return;
  if (!this.isMultipleUMs()) return;
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.width = '1000px';
  const item = {...this.selectedData,Available: this.selectedData.EndBalance};
  dialogConfig.data = [item, 'inventory'];
  this.dialog.open(MultipleUMsComponent, dialogConfig);
}
  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printstocksendingbalance']));
    var data  = this.listData.filteredData;
    var title = 'STOCKS ENDING BALANCE';
    if(this.withDate){
      title = 'STOCKS ENDING BALANCE FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    }
    this.printService.popupWindow(url, 'Items', window, 800, 800);
    localStorage.setItem('Items', JSON.stringify(data));
    localStorage.setItem('Title', title);
  }
  
onContextMenu(event: MouseEvent, data: any) {
  this.getRecord(data);
  event.preventDefault();

  this.contextMenuPosition.x = event.clientX + 'px';
  this.contextMenuPosition.y = event.clientY + 'px';

  this.contextMenu.menuData = { 'data': data };
  this.contextMenu.menu.focusFirstItem('mouse');
  this.contextMenu.openMenu();
}
}
