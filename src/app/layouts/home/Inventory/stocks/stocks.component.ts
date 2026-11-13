import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { StocksService } from 'src/app/services/Inventory/stocks.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { _url } from 'src/global-variables';
import { HomeComponent } from '../../home.component';
import { InventoryStocksService } from 'src/app/services/Inventory/inventory-stocks.service';
import { StockLedgerUIComponent } from '../stock-ledger-ui/stock-ledger-ui.component';
import { MultipleUMUIComponent } from '../../Files/multiple-umui/multiple-umui.component';
import { MultipleUMsComponent } from '../../Files/multiple-ums/multiple-ums.component';
import { ItemPriceCategorysUIComponent } from '../../Files/item-price-categorys-ui/item-price-categorys-ui.component';
import { GlobalConfigService } from 'src/app/services/global-config.service';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {

  items           : any[];
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  type            : string = 'stocks';
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  isColorOutOfStock : boolean = true;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
    {'Label'   : 'Ledger','Function'          : () => this.onClickLedger(),'Disabled': true,}, 
  ];
  contextButtons  =  [
    {'Label'   : 'Ledger','Function'       : () => this.onClickLedger(),'Disabled': true,}, 
    {'Label'   : 'RecomputeAll','Function'       : () => this.onClickRecomputeAll(),'Disabled': true,}, 
    {'Label'   : 'MultipleUMs','Function'       : () => this.onClickMultipleUMs(),'Disabled': true,}, 
    {'Label'   : 'Price Categories','Function'  : () => this.onClickOtherPriceCategories(),'Disabled': true,}, 
  ];
  defaultColumns  = ['ItemName','UM','Category', 'ItemType','Price', 'Available','AlertQty'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Price', 'Available','AlertQty'],
    intColumns: [''],
    dateTimeColumns: [],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};
  
  uploadedCount: number;
  progress: number;
  loading: boolean;
  recomputing : boolean = false;
  btnText: string;
  totalItems: any;
  constructor(
    private dialog              : MatDialog,
    private stocksService        : StocksService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
    private inventoryStocksService : InventoryStocksService,
    private notif : NotificationService,
    private globalConfigService         : GlobalConfigService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.homeTs.getButtons();
    this.isColorOutOfStock = await this.globalConfigService.isColorOutOfStock();
    this.toolBoxService.disableButtons(this.contextButtons, this.toolButtons, null, null);
    this.stocksService.requiredRefresh.subscribe(()=>{
      this.onClickView();
    });
  }
  
  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  DisplayTab(type){
    this.type = type.toLowerCase();
    this.matTableService.clearList(this.listData);
  }

  async onClickView(){
    this.isLoading = true;
    this.items = await firstValueFrom(this.stocksService.getStocks());
    if(this.items)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.items;

    // if(this.type == 'stocks'){
    //   data = data.filter(x => +x.Available >= +x.AlertQty && +x.Available > 0);
    // }

    if(this.type == 'out of stocks'){
      data = data.filter(x => +x.Available <= +x.AlertQty || +x.Available <= 0);
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
        dialogConfig.data         = ([false, data,new Date(), new Date()]);
        this.dialog.open(StockLedgerUIComponent,dialogConfig);
      }
  }

  async onClickRecomputeAll(){
    this.uploadedCount = 0;
    this.progress = 0;
    this.recomputing = true;
    this.btnText = 'Recomputing...';
    this.totalItems  = this.listData.filteredData.length;
    let success = true; // Track success status
    for (const x of this.listData.filteredData) {
        try {
        const res = await this.stocksService.recomputeStockByItemId(x.ItemId).toPromise();
        this.uploadedCount++;
        this.progress = Math.round((this.uploadedCount / this.totalItems) * 100);
      } catch (err) {
        success = false;
        this.notif.toastrError(x.ItemName + ' - ' + err.error.message);
        break
      }
    }

    if (success) {
      this.recomputing = false;
      this.btnText = '';
      this.notif.toastrSuccess('All items recomputed successfully!');
    }
  }

  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printstocks']));
    var data  = this.listData.filteredData;
    this.printService.popupWindow(url, 'Items', window, 800, 800);
    
    localStorage.setItem('HasPrintItems', 'no');
    localStorage.setItem('Items', JSON.stringify(data));
    localStorage.setItem('Title', this.type.toUpperCase()+ ' ITEMS');
    localStorage.setItem('Title1', this.type.toUpperCase()+ ' ITEMS');
    localStorage.setItem('Type1', 'Title');

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


  onClickMultipleUMs(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data        = ([this.selectedData, 'inventory']);
    this.dialog.open(MultipleUMsComponent,dialogConfig);
  }

  onClickOtherPriceCategories(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '800px';
    dialogConfig.data        = ([this.selectedData, 'inventory', this.selectedData.UM]);
    this.dialog.open(ItemPriceCategorysUIComponent,dialogConfig);
  }
}
