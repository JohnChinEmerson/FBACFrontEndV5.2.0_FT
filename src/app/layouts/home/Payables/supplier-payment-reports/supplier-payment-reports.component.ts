import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { firstValueFrom } from 'rxjs';
import { HelperService } from 'src/app/services/helper.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { SupplierPaymentReportsService } from 'src/app/services/Payables/supplier-payment-reports.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-supplier-payment-reports',
  templateUrl: './supplier-payment-reports.component.html',
  styleUrls: ['./supplier-payment-reports.component.css']
})
export class SupplierPaymentReportsComponent implements OnInit {
    years :any; 
     months :any; 
     year :any = new Date().getFullYear(); 
     viewBys:any;
     viewBy:string = 'TABULATED';
     data : any;
     searchKey       : string = "";
     
     listData        : MatTableDataSource<any>;
     pageSizeOptions :any = this.matTableService.pageSizeOptions();
     isLoading       : boolean = false;
   
     @ViewChild(MatSort) sort              : MatSort;
     @ViewChild(MatPaginator) paginator    : MatPaginator;  
     @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
     
     contextMenuPosition = { x: '0px', y: '0px' };
     toolButtons     = [
       {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
       {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
     ];
     contextButtons  =  [];
     defaultColumns  = ['Month','TotalAmount', 'VATableAmount', 'VATAmount', 'DiscountAmount', 'WHTaxAmount',  'TotalDue'];
    columnConfig: ColumnTypeConfig = {
      decimalColumns: ['TotalAmount', 'VATableAmount', 'VATAmount', 'DiscountAmount', 'WHTaxAmount',  'TotalDue'],
      intColumns: [],
      dateTimeColumns: [],
      dateColumns: []
    };

    columnTypeMap: { [key: string]: string } = {};
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
       private supplierPaymentReportsService : SupplierPaymentReportsService,
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
       this.getviewBys();
     }

    private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
      const map: { [key: string]: string } = {};
      for (const col of columns) {
        map[col] = this.matTableService.getColumnType(col, this.columnConfig);
      }
      return map;
    }
   
     async getYears(){
       this.years = await firstValueFrom(this.helperService.getYears());
     }
  
     async getviewBys(){
       this.viewBys = ['TABULATED', 'GRAPH'];
     }
   
     async onClickView(){
       this.isLoading = true;
       this.data = await firstValueFrom(this.supplierPaymentReportsService.getSupplierPaymentReportByYearByViewBy(this.year, this.viewBy));
       if(this.data)
         this.isLoading = false;
       this.displayRecords();
     }
   
     displayRecords(){
       var data = this.data;
        this.listData =  new MatTableDataSource(data);
        this.listData.paginator = this.paginator;
        this.listData.sort = this.sort;
      
        if(this.viewBy.toLowerCase() == 'graph')
          this.assignColumm(this.data);
     
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
       var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printpaymentreports']));
        var data  = this.listData.filteredData;
  
       var title  = 'RECEIVABLE PAYMENTS FOR THE YEAR '+this.year;
       this.printService.popupWindow(url, 'printpaymentreports', window, 800, 800);
       localStorage.setItem('Data', JSON.stringify(data));
       localStorage.setItem('NumberColumns', JSON.stringify(null));
       localStorage.setItem('Title', title);
       localStorage.setItem('ViewBy', this.viewBy.toLowerCase());
     }

}
