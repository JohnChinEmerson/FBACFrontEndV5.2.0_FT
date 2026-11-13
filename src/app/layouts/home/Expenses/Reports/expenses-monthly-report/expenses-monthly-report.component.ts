import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MonthlyExpensesReportService } from 'src/app/services/Expenses/monthly-expenses-report.service';
import { ItemCategorysService } from 'src/app/services/Files/item-categorys.service';
import { HelperService } from 'src/app/services/helper.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { _url } from 'src/global-variables';
import { HomeComponent } from '../../../home.component';
import { AccountTitlesService } from 'src/app/services/Accounting/account-titles.service';

@Component({
  selector: 'app-expenses-monthly-report',
  templateUrl: './expenses-monthly-report.component.html',
  styleUrls: ['./expenses-monthly-report.component.css']
})
export class ExpensesMonthlyReportComponent implements OnInit {
  years :any; 
  months :any; 
  year :any = new Date().getFullYear();
  month:string = 'All'; 
  categorys:any;
  category:string = 'All';
  filterBys:any;
  filterBy:string = 'PARTICULAR';
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
  defaultColumns  = ['Category','Amount'];

  defaultColumns2  = ['ParticularName', 'Category','Amount'];

  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Amount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};

  constructor(
    private helperService : HelperService,
    private monthlyExpensesReportService : MonthlyExpensesReportService,
    private stringHelperService : StringHelperService,
    private accountTitlesService : AccountTitlesService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.contextButtons, this.toolButtons, null, null);
    this.getYears();
    this.getMonths();
    this.getCategorys();
    this.getTypes();
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
    this.months.push(this.stringHelperService.all())
  }

  async getYears(){
    this.years = await firstValueFrom(this.helperService.getYears());
  }

  async getCategorys(){
    this.categorys = await firstValueFrom(this.accountTitlesService.getAccountTitlesByAccountType('expense'));
    this.categorys.push(this.stringHelperService.allAccountTitleCBO());
  }

  async getTypes(){
    this.filterBys = ['PARTICULAR', 'CATEGORY'];
  }

  async onClickView(){
    this.isLoading = true;
    this.data = await firstValueFrom(this.monthlyExpensesReportService.getMonthlyExpensesReportByMonthByYearByCategoryByFilter(this.month, this.year, this.category, this.filterBy));
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

  getDisplayedColumns(){
    if(this.filterBy.toLowerCase() == 'itemname'){
      return this.defaultColumns2;
    }else{
      return this.defaultColumns;
    }
  }

  async onClickPrint(){
    var url     = this.router.serializeUrl(this.router.createUrlTree(['print/printmonthlyexpensesreport']));
    var data    = this.listData.filteredData;
    var title   =  this.category.toUpperCase()+' '+this.filterBy.toUpperCase()+' EXPENSES FOR '+this.year;

    if(this.month.toString().toLowerCase() != 'all'){
      var monthName:any = await firstValueFrom(this.helperService.getMonthName(this.month));
      title   = this.category.toUpperCase()+' '+this.filterBy.toUpperCase()+' EXPENSES FOR '+monthName.toUpperCase()+' '+this.year;
    }
    this.printService.popupWindow(url, 'MonthlyExpensesReport', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data)); 
    localStorage.setItem('Title', title);
    localStorage.setItem('FilterBy', this.filterBy);
  }
}
