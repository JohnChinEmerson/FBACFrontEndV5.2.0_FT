import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ItemCategorysService } from 'src/app/services/Files/item-categorys.service';
import { HelperService } from 'src/app/services/helper.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { YearlyReceivingReportService } from 'src/app/services/Receiving/yearly-receiving-report.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { _url } from 'src/global-variables';
import { HomeComponent } from '../../../home.component';

@Component({
  selector: 'app-receiving-yearly-report',
  templateUrl: './receiving-yearly-report.component.html',
  styleUrls: ['./receiving-yearly-report.component.css']
})
export class ReceivingYearlyReportComponent implements OnInit {

  years :any; 
  months :any; 
  year :any = new Date().getFullYear(); 
  categorys:any;
  category:string = 'All';
  data : any;
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
  defaultColumns  = ['Description'];
  numberColumns   = [];
    columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private helperService : HelperService,
    private yearlyReceivingReportService : YearlyReceivingReportService,
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
    this.columnConfig.decimalColumns = this.numberColumns;
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.contextButtons, this.toolButtons, null, null);
    this.getYears();
    this.getCategorys();
    
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

  async getCategorys(){
    this.categorys = await firstValueFrom(this.itemCategorysService.getCBOCategorys());
    this.categorys.push(this.stringHelperService.allCategoryCBO());
  }


  async onClickView(){
    this.isLoading = true;
    this.data = await firstValueFrom(this.yearlyReceivingReportService.getYearlyReceivingReportByYearByCategory(this.year, this.category));
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

  getTotal(column){
    let sum = 0;
    this.listData?.filteredData.forEach(x => {
            sum += +x[column];
    });
    return sum;
  }

  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printyearlyreceivingreport']));
    var data  = this.listData.filteredData;
    var title  = this.category.toUpperCase()+' ITEMS QTY RECEIVED FOR THE YEAR '+this.year;
    this.printService.popupWindow(url, 'YearlyReceivingReport', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data));
    localStorage.setItem('NumberColumns', JSON.stringify(this.numberColumns));
    localStorage.setItem('Title', title);
  }
}
