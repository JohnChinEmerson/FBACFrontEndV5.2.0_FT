import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { CustomerSaleReturnsService } from 'src/app/services/Reports/customer-sale-returns.service';

@Component({
  selector: 'app-customer-sale-returns-report',
  templateUrl: './customer-sale-returns-report.component.html',
  styleUrls: ['./customer-sale-returns-report.component.css']
})
export class CustomerSaleReturnsReportComponent implements OnInit {

  @Input() filteredData: any = [];
  data :any ;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  toolButtons     = [
    {'Label'   : 'Print','Function'               : () => this.onClickPrint(),'Disabled': true,}, 
  ];  
  
  //summary and all items
  defaultColumns    = ['ItemId', 'ItemName', 'Reason','Qty', 'Discount','Amount'];
  defaultColumns2    = ['TransDate','TransNo', 'CustomerName','Reason', 'ItemName', 'UM','Qty', 'Price', 'Discount', 'Amount'];
  defaultColumns3   = ['TransDate','TransNo', 'ItemName', 'UM','Qty', 'Price', 'Discount', 'Amount'];

  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Qty','Price', 'Discount','Amount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate',]
  };

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};
  columnTypeMap3: { [key: string]: string } = {};

  constructor(
    private customerSaleReturnsService        : CustomerSaleReturnsService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService      : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
    private notificationService : NotificationService,
  ) { }

  ngOnInit(): void {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    this.columnTypeMap3 = this.buildColumnTypeMap(this.defaultColumns3);
    this.onClickView();
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
    if(this.filteredData.filterType?.toLowerCase() == 'summary'){
      this.data = await firstValueFrom(this.customerSaleReturnsService.getCustomerSaleReturnsByDateFromByDateToByWithDateByCustomerId(
        this.dateTimesService.ConvertToDateFormat(new Date(this.filteredData.dateFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(this.filteredData.dateTo)),
        this.filteredData.withDate,
        this.filteredData.customerName,
        this.filteredData.branchId,
      ));
    }
    if(this.filteredData.filterType?.toLowerCase() == 'details'){
      this.data = await firstValueFrom(this.customerSaleReturnsService.getCustomerSaleReturnDetailsByDateFromByDateToByWithDateByCustomerId(
        this.dateTimesService.ConvertToDateFormat(new Date(this.filteredData.dateFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(this.filteredData.dateTo)),
        this.filteredData.withDate,
        this.filteredData.customerName,
        this.filteredData.branchId,
      ));
    }
   
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
  


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filteredData'] && changes['filteredData'].currentValue) {
      this.onClickView();
    }
  }
  getTotal(column){
    let sum = 0;
    this.listData?.filteredData.forEach(x => {
      sum += +x[column];
    });
    return sum;
  }


  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printcustomersalereturns']));
    var data  = this.listData.filteredData;
    var title = this.filteredData.branchName +' '+this.filteredData.customerName.toUpperCase() +' SALE RETURNS -  ' +this.filteredData.filterType.toUpperCase() ;
    if(this.filteredData.withDate )
      title = this.filteredData.branchName +' '+this.filteredData.customerName.toUpperCase() +' SALE RETURNS -  ' +this.filteredData.filterType.toUpperCase()  + this.dateTimesService.ConvertToDateFormat(new Date(this.filteredData.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.filteredData.dateTo))  ;
    this.printService.popupWindow(url, 'printcustomersalereturns', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data));
    localStorage.setItem('Title', title);
    localStorage.setItem('FilteredData', JSON.stringify(this.filteredData));
  }
}
