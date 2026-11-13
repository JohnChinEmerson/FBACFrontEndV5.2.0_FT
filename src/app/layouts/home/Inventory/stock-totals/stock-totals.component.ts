import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { StocksTotalsService } from 'src/app/services/Inventory/stocks-totals.service';
import { AdjustPriceUIComponent } from '../adjust-price-ui/adjust-price-ui.component';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { StocksService } from 'src/app/services/Inventory/stocks.service';
  
@Component({
  selector: 'app-stock-totals',
  templateUrl: './stock-totals.component.html',
  styleUrls: ['./stock-totals.component.css']
})
export class StockTotalsComponent implements OnInit {

  items           : any[];
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
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
    {'Label'   : 'Adjust Price','Function'    : () => this.onClickAdjustPrice(),'Disabled': true,}, 
    {'Label'   : 'Recompute Inventory','Function'    : () => this.onClickRecomputeInventory(),'Disabled': true,}, 
  ];
  contextButtons  =  [
  ];
  defaultColumns  = ['ItemName','UM','Category','AveCost','Price', 'MarkUp','Available','TotalAveCost', 'TotalPrice','ExpectedProfit','Barcode'];
  
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['AveCost','Price', 'MarkUp','Available','TotalAveCost', 'TotalPrice','ExpectedProfit'],
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
    private stocksTotalsService        : StocksTotalsService,
    private stocksService : StocksService, 
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
    private globalConfigService         : GlobalConfigService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.homeTs.getButtons();
    this.isColorOutOfStock = await this.globalConfigService.isColorOutOfStock();
    this.toolBoxService.disableButtons(this.contextButtons, this.toolButtons, null, null);
    this.stocksTotalsService.requiredRefresh.subscribe(()=>{
      this.onClickView();
    });
    localStorage.removeItem('Category');
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
    this.items = await firstValueFrom(this.stocksTotalsService.getStockTotals());
    if(this.items)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.items;
    var category = localStorage.getItem('Category') ?? null;
    if(category && category.toLowerCase() != 'all'){
      data = data.filter(x=> x.Category.toLowerCase() == category.toLowerCase())
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

  onClickAdjustPrice(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    this.dialog.open(AdjustPriceUIComponent,dialogConfig).beforeClosed().subscribe(()=>{
      localStorage.removeItem('Category');
      this.onClickView();
    });
  }

  async onClickRecomputeInventory(){
     this.notificationService.popupWarning("Recompute Inventory","NewAvailableQty = ReadBack AllQtyIn-AllQtyOut Transactions for all DisplayedStocks. Continue?").then(async (result) => {
      if (result.value) {
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
            this.notificationService.toastrError(x.ItemName + ' - ' + err.error.message);
            break
          }
        }

        if (success) {
          this.recomputing = false;
          this.btnText = '';
          this.notificationService.toastrSuccess('All items recomputed successfully!');
          this.onClickView();
        }
      }
    });
  }

  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printstockstotals']));
    var data  = this.listData.filteredData;
    this.printService.popupWindow(url, 'Items', window, 800, 800);
    localStorage.setItem('Items', JSON.stringify(data));
    localStorage.setItem('Title', ' STOCK TOTALS EXPECTED PROFIT');
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
