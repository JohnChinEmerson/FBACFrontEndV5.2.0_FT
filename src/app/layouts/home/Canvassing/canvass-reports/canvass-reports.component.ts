import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CanvassDetailsService } from 'src/app/services/Canvassing/canvass-details.service';
import { CanvassReasonsService } from 'src/app/services/Canvassing/canvass-reasons.service';
import { HelperService } from 'src/app/services/helper.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-canvass-reports',
  templateUrl: './canvass-reports.component.html',
  styleUrls: ['./canvass-reports.component.css']
})
export class CanvassReportsComponent implements OnInit {
  years :any; 
  year :any = new Date().getFullYear(); 
  reasons:any;
  reason:string;
  data : any;
  searchKey       : string = "";
  listData        : MatTableDataSource<any[]>;
  listData2        : MatTableDataSource<any[]>;
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
    private canvassDetailsService : CanvassDetailsService,
    private stringHelperService : StringHelperService,
    private reasonsService : CanvassReasonsService,
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
    this.getReasons();
   
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
    this.numberColumns.push('Total');
  }

  async getYears(){
    this.years = await firstValueFrom(this.helperService.getYears());
  }

  async getReasons(){
    this.reasons = await firstValueFrom(this.reasonsService.getCBOCanvassReasons());
    this.reason  =  this.reasons[0].ReasonName;
  }

  async onClickView(){
    this.isLoading = true;
    this.data = await firstValueFrom(this.canvassDetailsService.getCanvassDetailsReportByYearByReason(this.year,  this.reason));
    this.displayRecords();
    this.isLoading = false;
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
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printcanvassreports']));
    var data  = this.listData.filteredData;
    var title  = this.reason.toUpperCase()+' CANVASS ITEMS FOR THE YEAR '+this.year;
  
    this.printService.popupWindow(url, 'printcanvassreports', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data));
    localStorage.setItem('NumberColumns', JSON.stringify(this.numberColumns));
    localStorage.setItem('Title', title);
    localStorage.setItem('ReasonName', this.reason);
  }
}
