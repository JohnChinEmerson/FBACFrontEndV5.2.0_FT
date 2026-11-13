import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ProfitPerformanceService } from 'src/app/services/Accounting/profit-performance.service';
import { BranchesService } from 'src/app/services/Config/branches.service';
import { HelperService } from 'src/app/services/helper.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-profit-performance',
  templateUrl: './profit-performance.component.html',
  styleUrls: ['./profit-performance.component.css']
})
export class ProfitPerformanceComponent implements OnInit {
  years :any; 
  year :any = new Date().getFullYear(); 
  data : any;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  branches : any;
  branchId : any; 
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
  ];
  contextButtons  =  [];
  defaultColumns  = ['Quarter', 'NetRevenue', 'NetExpense', 'NetProfit', 'Percent'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: [ 'NetRevenue', 'NetExpense', 'NetProfit', 'Percent'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};
  Highcharts: typeof Highcharts = Highcharts;
  chartRef: Highcharts.Chart;
 chart2: Highcharts.Options = {
  title: {
    text: 'Profit Performance',
  },
  accessibility: {
    enabled: false
  },
  credits: {
    enabled: false
  },
  exporting: {
    enabled: true
  },
  xAxis: {
    categories: [], // will be set dynamically
  },
  yAxis: {
    title: {
      text: 'Amount',
    },
  },
  series: [],
  chart: {
    type: 'column',
  }
};

  constructor(
    private helperService : HelperService,
    private profitPerformanceService : ProfitPerformanceService,
    private branchesService : BranchesService,
    private toolBoxService      : ToolBoxService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.homeTs.getButtons();
    await this.getCBOBranches();
    this.toolBoxService.disableButtons(this.contextButtons, this.toolButtons, null, null);
    this.getYears();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async getCBOBranches(){
    this.branches = await firstValueFrom(this.branchesService.getBranchesCBO());
    this.branchId = this.branches[0].BranchId;
  }

  async getYears(){
    this.years = await firstValueFrom(this.helperService.getYears());
  }
  async onClickView(){
    this.isLoading = true;
    this.data = await firstValueFrom(this.profitPerformanceService.getProfitPerformanceByYear(this.year,this.branchId));
    if(this.data)
      this.isLoading = false;
    this.displayRecords();
    this.assignColumm(this.data);
  }

  displayRecords(){
    var data = this.data;
    this.listData =  new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }

    chartCallback: Highcharts.ChartCallbackFunction = chart => {
      this.chartRef = chart;
    };

  private assignColumm(data: any) {
    const chart = this.chartRef;

    // Clear previous series
    while (chart.series.length > 0) {
      chart.series[0].remove(false);
    }

    const categories = data.map(d => d.Quarter);
    const netRevenue = data.map(d => d.NetRevenue);
    const netExpense = data.map(d => d.NetExpense);
    const netProfit = data.map(d => d.NetProfit);

    chart.xAxis[0].setCategories(categories);

    chart.addSeries({
      name: 'Net Revenue',
      type: 'column',
      data: netRevenue,
      color: '#7CB5EC', // blue
    }, false);

    chart.addSeries({
      name: 'Net Expense',
      type: 'column',
      data: netExpense,
      color: '#CD5C5C', // indianred
    }, false);

    chart.addSeries({
      name: 'Net Profit',
      type: 'column',
      data: netProfit,
      color: '#90ED7D', // green
    }, false);

    chart.redraw();
  }

  applyFilter(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch(){
    this.searchKey =  this.matTableService.clearSearch(this.listData);
  }

  getTotal(column){
    let sum = 0;
    this.listData?.filteredData.forEach(x => {
            sum += +x[column];
    });
    return sum;
  }

  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printprofitperformance']));
    var data  = this.listData.filteredData;
    var title  = this.getBranchName()+' - '+'PROFIT PERFORMANCE FOR THE YEAR '+this.year;

    this.printService.popupWindow(url, 'printprofitperformance', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data));
    localStorage.setItem('Title', title);
  }

   getBranchName(){
    var branch = this.branches.find(x => x.BranchId.toLowerCase() == this.branchId.toLowerCase());
    return branch.BranchName.toUpperCase()+' BRANCH';
   }

}
