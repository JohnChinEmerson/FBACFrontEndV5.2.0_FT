import { Component, Input,OnInit, ViewChild } from '@angular/core';
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
import { DailySalesReportService } from 'src/app/services/Sales/daily-sales-report.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { _url } from 'src/global-variables';
import { HomeComponent } from '../../../home.component';
import { DateTimesService } from 'src/app/services/date-times.service';

@Component({
  selector: 'app-sales-daily-report',
  templateUrl: './sales-daily-report.component.html',
  styleUrls: ['./sales-daily-report.component.css']
})
export class SalesDailyReportComponent implements OnInit {
  @Input() branchId: any = [];
  years :any; 
  months :any; 
  year :any = new Date().getFullYear();
  month:any = new Date().getMonth() +1; 
  items:any;
  itemId:string = 'all';
  data : any;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  photoUrl        : string = _url+"img/items/";
  dateFrom        : any = new Date();
  dateTo          : any = new Date();
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
  ];
  contextButtons  =  [];
  defaultColumns = ['Date', 'Qty', 'Amount', 'AveCostAmount', 'Profit'];
  defaultColumns2 = ['ItemName', 'UM', 'Category', 'Price','Qty','Discount', 'Amount', 'AveCostAmount', 'Profit'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: [ 'Price','Discount','Qty', 'Amount', 'AveCostAmount', 'Profit'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};

  constructor(
    private helperService : HelperService,
    private dailySalesReportService : DailySalesReportService,
    private stringHelperService : StringHelperService,
    private stocksService : StocksService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
    private dateTimesService              : DateTimesService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.contextButtons, this.toolButtons, null, null);
    // this.getYears();
    // this.getMonths();
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
    this.items.push(this.stringHelperService.allItemNameCBO());
    this.itemId = 'All';
  }


  async onClickView(){
    if(!this.itemId)
        return this.notificationService.toastrWarning("No Record Selected!");

    this.isLoading = true;
    this.data = await firstValueFrom(this.dailySalesReportService.getDailySalesReportByDateFromByDateToByItemName(this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)), this.itemId,this.branchId));
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

  getDisplayedColumn(){
    if(this.itemId.toLowerCase() != 'all'){
      return this.defaultColumns;
    }else{
      return this.defaultColumns2;
    }
  }

  async onClickPrint(){
    var url     = this.router.serializeUrl(this.router.createUrlTree(['print/printdailysalesreport']));
    var data    = this.listData.filteredData;

    var item:any = this.items.filter(x => x.ItemId == this.itemId);
    if(this.itemId.toLowerCase() != 'all'){
      var title =  item[0].ItemName.toUpperCase()+ " SALES | PROFIT FROM " + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + " - " + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo));
    }else{
       title =  "ALL SALES | PROFIT FROM " + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + " - " + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo));
    }
    // var monthName:any = await firstValueFrom(this.helperService.getMonthName(this.month));
    // var item:any = this.items.filter(x => x.ItemId == this.itemId);
    // var title   = item[0].ItemName.toUpperCase()+' SALES FOR '+monthName.toUpperCase()+' '+this.year;

    this.printService.popupWindow(url, 'DailySalesReport', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data)); 
    localStorage.setItem('Title', title);
    localStorage.setItem('ItemId', this.itemId);
  }


}
