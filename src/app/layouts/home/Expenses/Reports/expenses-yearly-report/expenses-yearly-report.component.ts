import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { YearlyExpensesReportService } from 'src/app/services/Expenses/yearly-expenses-report.service';
import { ItemCategorysService } from 'src/app/services/Files/item-categorys.service';
import { HelperService } from 'src/app/services/helper.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { _url } from 'src/global-variables';
import { HomeComponent } from '../../../home.component';
import * as Highcharts from 'highcharts';
import  HighchartsExporting from 'highcharts/modules/exporting';
import  HighchartsExportData from 'highcharts/modules/export-data';
import  HighchartsOfflineExporting from 'highcharts/modules/offline-exporting';


HighchartsExporting(Highcharts);
HighchartsExportData(Highcharts);
HighchartsOfflineExporting(Highcharts);

@Component({
  selector: 'app-expenses-yearly-report',
  templateUrl: './expenses-yearly-report.component.html',
  styleUrls: ['./expenses-yearly-report.component.css']
})
export class ExpensesYearlyReportComponent implements OnInit {
  years :any; 
  months :any; 
  year :any = new Date().getFullYear(); 
  filterBys:any;
  filterBy:string = 'SUMMARY';
  viewBys:any;
  viewBy:string = 'TABULATED';
  data : any;
  searchKey       : string = "";
  
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;

  listData2        : MatTableDataSource<any>;
  pageSizeOptions2 :any = this.matTableService.pageSizeOptions();
  isLoading2       : boolean = false;

  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  @ViewChild(MatSort) sort2              : MatSort;
  @ViewChild(MatPaginator) paginator2    : MatPaginator;  
  
  contextMenuPosition = { x: '0px', y: '0px' };
  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
  ];
  contextButtons  =  [];
  defaultColumns  = ['Description'];
  defaultColumns2  = ['Month','TotalAmount', 'VATableAmount', 'VATAmount', 'DiscountAmount', 'WHTaxAmount', 'DeliveryFee', 'TotalDue'];
  numberColumns   = [];

  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};


  Highcharts: typeof Highcharts = Highcharts;
  chartRef!: Highcharts.Chart; // Reference to the Highcharts instance
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'column',
      backgroundColor: 'white',  
    },
    title: {
      text: 'Monthly Data',
    },
    xAxis: {
      categories: [], // X-axis categories (months)
      title: {
        text: 'Months',
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Total Amount',
      },
    },
    tooltip: {
      valueDecimals: 2,
    },
    series: [], // Initialize with empty series
    exporting: {
      enabled: true,
    },
  };

  constructor(
    private helperService : HelperService,
    private yearlyExpensesReportService : YearlyExpensesReportService,
    private stringHelperService : StringHelperService,
    private itemCategorysService : ItemCategorysService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getMonths();
    this.defaultColumns = this.defaultColumns.concat(this.numberColumns);
    this.columnConfig.decimalColumns = this.numberColumns.concat(['TotalAmount', 'VATableAmount', 'VATAmount', 'DiscountAmount', 'WHTaxAmount', 'DeliveryFee', 'TotalDue']);
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.contextButtons, this.toolButtons, null, null);
    this.getYears();
    this.getfilterBys();
    this.getviewBys();
  }

    private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async getMonths(){
    this.numberColumns = await firstValueFrom(this.helperService.getMonths());
    this.numberColumns.push('Total')
  }

  async getYears(){
    this.years = await firstValueFrom(this.helperService.getYears());
  }

  async getfilterBys(){
    this.filterBys = ['SUMMARY', 'DETAILED'];
  }
  async getviewBys(){
    this.viewBys = ['TABULATED', 'GRAPH'];
  }

  async onClickView(){
    this.isLoading = true;
    this.data = await firstValueFrom(this.yearlyExpensesReportService.getYearlyExpensesReportByYearByFilterByViewBy(this.year, this.filterBy, this.viewBy));
    if(this.data)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.data;
    if(this.filterBy.toLowerCase() == 'detailed'){
      this.listData =  new MatTableDataSource(data);
      this.listData.paginator = this.paginator;
      this.listData.sort = this.sort;
    }else{
      this.listData2 =  new MatTableDataSource(data);
      this.listData2.paginator = this.paginator2;
      this.listData2.sort = this.sort2;
      if(this.viewBy.toLowerCase() == 'graph')
         this.assignColumm(this.data);
    }
  
  }

  chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
    this.chartRef = chart; // Save the chart reference
  };

  assignColumm(data: any[]) {
    if (!this.chartRef) {
      console.error('Chart instance is not initialized.');
      return;
    }

    // Remove existing series
    while (this.chartRef.series.length > 0) {
      this.chartRef.series[0].remove(true);
    }

    // Extract months and total amounts
    const months = data.map((d) => d.Month);
    const amounts = data.map((d) => (d.TotalAmount ? parseFloat(d.TotalAmount) : 0));

    // Update the categories and series
    this.chartRef.xAxis[0].setCategories(months, true);
    this.chartRef.addSeries(
      {
        name: 'Total Amount',
        type: 'column',
        data: amounts,
        // color: 'green',
      },
      true
    );
  }

applyFilter() {
  if (this.filterBy.toLowerCase() === 'detailed') {
    this.matTableService.applyFilter(this.listData, this.searchKey);
  } else {
    this.matTableService.applyFilter(this.listData2, this.searchKey);
  }
}

clearSearch() {
  this.searchKey = '';
  this.applyFilter();
}
  getTotal(column){
    let sum = 0;
    if(this.filterBy.toLowerCase() == 'detailed'){
      this.listData?.filteredData.forEach(x => {
        sum += +x[column];
      });
    }else{
      this.listData2?.filteredData.forEach(x => {
            sum += +x[column];
      });
    }

  
    return sum;
  }

  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printyearlyexpensesreport']));
    if(this.filterBy.toLowerCase() == 'detailed'){
      var data  = this.listData.filteredData;
      localStorage.setItem('NumberColumns', JSON.stringify(this.numberColumns));

    }else{
       data  = this.listData2.filteredData;
       localStorage.setItem('NumberColumns', JSON.stringify(null));
    }
    
    var title  = this.filterBy.toUpperCase()+' EXPENSES FOR THE YEAR '+this.year;
    this.printService.popupWindow(url, 'YearlyExpensesReport', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data));
    if(this.filterBy.toLowerCase() == 'detailed')
      localStorage.setItem('NumberColumns', JSON.stringify(this.numberColumns));
    if(this.filterBy.toLowerCase() == 'summary')
      localStorage.setItem('NumberColumns', JSON.stringify(null));

    localStorage.setItem('Title', title);
    localStorage.setItem('FilterBy', this.filterBy.toLowerCase());
    localStorage.setItem('ViewBy', this.viewBy.toLowerCase());
  }

}
