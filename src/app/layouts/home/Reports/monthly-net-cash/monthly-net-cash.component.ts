import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { HelperService } from 'src/app/services/helper.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { MonthlyNetCashService } from 'src/app/services/Reports/monthly-net-cash.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { _url } from 'src/global-variables';
import { HomeComponent } from '../../home.component';
import * as Highcharts from 'highcharts';
import  HighchartsExporting from 'highcharts/modules/exporting';
import  HighchartsExportData from 'highcharts/modules/export-data';
import  HighchartsOfflineExporting from 'highcharts/modules/offline-exporting';
import { BranchesService } from 'src/app/services/Config/branches.service';

HighchartsExporting(Highcharts);
HighchartsExportData(Highcharts);
HighchartsOfflineExporting(Highcharts);
@Component({
  selector: 'app-monthly-net-cash',
  templateUrl: './monthly-net-cash.component.html',
  styleUrls: ['./monthly-net-cash.component.css']
})
export class MonthlyNetCashComponent implements OnInit {

    years :any; 
   year :any = new Date().getFullYear();
   profitLoss : any;
   total : any;
   searchKey       : string = "";
   listData        : MatTableDataSource<any>;
   pageSizeOptions :any = this.matTableService.pageSizeOptions();
   isLoading       : boolean = false;
   empty  : MatTableDataSource<any>;
   viewBys:any;
   viewBy:string = 'TABULATED';
   title : any;
   @ViewChild(MatSort) sort              : MatSort;
   @ViewChild(MatPaginator) paginator    : MatPaginator;  
   @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
 
   contextMenuPosition = { x: '0px', y: '0px' };
   toolButtons     = [
     {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
     {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
   ];
   contextButtons  =  [];
   defaultColumn      = ['Month'];
   numberColumns1  : any= [
                      {
                          Label : 'SO PMT',
                          Data : 'SalesDownPayments',
                      },
                      {
                        Label : 'RCVBL PMT',
                        Data : 'ReceivablePayments',
                      },
                      {
                        Label : 'ITM SLS PMT',
                        Data : 'ItemSalesPayments',
                      },
                      {
                        Label : 'TOTAL IN',
                        Data : 'TotalAmountIn',
                      },
                      {
                        Label : 'PO D.PMT',
                        Data : 'PODownPayments',
                      },
                      {
                        Label : 'ITM RCVD PMT',
                        Data : 'ItemReceivedPayments',
                      },
                      {
                        Label : 'PYBL PMT',
                        Data : 'PayablePayments',
                      },
                      {
                        Label : 'EXP PMT',
                        Data : 'ExpensePayments',
                      },
                      {
                        Label : 'TOTAL OUT',
                        Data : 'TotalAmountOut',
                      },
                      {
                        Label : 'NETCASH',
                        Data : 'NetIncome',
                      },
                   ];
   mergeColumns1 = this.defaultColumn.concat(this.numberColumns1.map(col => col.Data));
   displayedColumns3: string[] = [
     'GrandTotal',
     'CashIn',
     'CashOut',
     'NetH',
   ];

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
           text: 'Net Income',
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
     branches : any;
     branchId : any;
   constructor(
     private helperService : HelperService,
     private monthlyNetCashService : MonthlyNetCashService,
     private stringHelperService : StringHelperService,
     private notificationService : NotificationService,
     private toolBoxService      : ToolBoxService,
     public matTableService     : MatTableService,
     private printService        : PrintService,
     private router              : Router,
     private homeTs              : HomeComponent,
    private branchesService : BranchesService,
   ) { }
 
   async ngOnInit(): Promise<void> {
    await this.getCBOBranches();
     await this.homeTs.getButtons();
     this.toolBoxService.disableButtons(this.contextButtons, this.toolButtons, null, null);
     this.getYears();
     this.getviewBys();
   }

   async getCBOBranches(){
    this.branches = await firstValueFrom(this.branchesService.getBranchesCBO());
    this.branchId = this.branches[0].BranchId;
  }
   async getYears(){
     this.years = await firstValueFrom(this.helperService.getYears());
   }
   async getviewBys(){
    this.viewBys = ['TABULATED', 'GRAPH'];
  }

   async onClickView(){
     this.isLoading = true;
     var data:any = await firstValueFrom(this.monthlyNetCashService.getMonthlyNetCashReportByYearByView( this.year,this.viewBy, this.branchId));
     this.profitLoss = data.profitLoss;
     this.total = data.total;
     if(this.profitLoss)
       this.isLoading = false;
     this.displayRecords();
   }
 
   async displayRecords(){
     this.title   = this.getBranchName()+' MONTHLY NET CASH AS OF YEAR '+this.year;
     var data = this.profitLoss;
     this.listData =  new MatTableDataSource(data);
     this.listData.paginator = this.paginator;
     this.listData.sort = this.sort;

     if(this.viewBy.toLowerCase() == 'graph')
       this.assignColumm(this.profitLoss);

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
       const amounts = data.map((d) => (d.NetIncome ? parseFloat(d.NetIncome) : 0));
   
       // Update the categories and series
       this.chartRef.xAxis[0].setCategories(months, true);
       this.chartRef.addSeries(
         {
           name: 'Net Income',
           type: 'column',
           data: amounts,
           // color: 'green',
         },
         true
       );
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
             sum += +x[column] ? +x[column] : 0;
     });
     return sum;
   }

   getBranchName(){
    var branch = this.branches.find(x => x.BranchId.toLowerCase() == this.branchId.toLowerCase());
    return branch.BranchName.toUpperCase()+' BRANCH';
   }
 
   async onClickPrint(){
     var url     = this.router.serializeUrl(this.router.createUrlTree(['print/printmonthlynetcash']));
     var data    = this.listData.filteredData;
     this.printService.popupWindow(url, 'printmonthlynetcash', window, 800, 800);
     localStorage.setItem('Data', JSON.stringify(data)); 
     localStorage.setItem('Title', this.title);
   }
}
