import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { HelperService } from 'src/app/services/helper.service';
import { StocksService } from 'src/app/services/Inventory/stocks.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { DailyStockAdjustmentReportService } from 'src/app/services/StockAdjustments/daily-stock-adjustment-report.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { _url } from 'src/global-variables';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-stock-adjustment-report-daily',
  templateUrl: './stock-adjustment-report-daily.component.html',
  styleUrls: ['./stock-adjustment-report-daily.component.css']
})
export class StockAdjustmentReportDailyComponent implements OnInit {
  years :any; 
  months :any; 
  year :any = new Date().getFullYear();
  month:any = new Date().getMonth() +1; 
  items:any;
  itemId:string;
  data : any;
  adjustmentTypes : any=['stockin', 'stockout'];
  adjustmentType  : string = 'stockin';
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  photoUrl        : string = _url+"img/items/";

  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
  ];
  contextButtons  =  [];
  defaultColumns  = ['Date','Price','Qty', 'Amount'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Price','Qty', 'Amount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private helperService : HelperService,
    private dailyStockAdjustmentReportService : DailyStockAdjustmentReportService,
    private stringHelperService : StringHelperService,
    private stocksService : StocksService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.contextButtons, this.toolButtons, null, null);
    this.getYears();
    this.getMonths();
    this.getItems();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }
  async getMonths(){
    this.months = await firstValueFrom(this.helperService.getMonthsWithValue());
  }

  async getYears(){
    this.years = await firstValueFrom(this.helperService.getYears());
  }

  async getItems(){
    this.items = await firstValueFrom(this.stocksService.getStocksForSaleByItemType('all'));
  }

  async onClickView(){
    if(!this.itemId)
        return this.notificationService.toastrWarning("No Record Selected!");

    this.isLoading = true;
    this.data = await firstValueFrom(this.dailyStockAdjustmentReportService.getDailyStockAdjustmentReportByMonthByYearByItemNameByAdjustmentType(this.month, this.year, this.itemId, this.adjustmentType));
    if(this.data)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.data;
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

  emptyTable(){
    this.listData =  new MatTableDataSource([]);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }

  getTotal(column){
    let sum = 0;
    this.listData?.filteredData.forEach(x => {
            sum += +x[column];
    });
    return sum;
  }

  async onClickPrint(){
    var url     = this.router.serializeUrl(this.router.createUrlTree(['print/printdailystockadjustmentreport']));
    var data    = this.listData.filteredData;

    var monthName:any = await firstValueFrom(this.helperService.getMonthName(this.month));
    var item:any = this.items.filter(x => x.ItemId == this.itemId);
    var title   = item[0].ItemName.toUpperCase()+ ' ' + this.adjustmentType.toLocaleUpperCase()+' ADJUSTMENT FOR '+monthName.toUpperCase()+' '+this.year;

    this.printService.popupWindow(url, 'DailyStockAdjustmentReport', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data)); 
    localStorage.setItem('Title', title);
  }

}
