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
import { ReasonsService } from 'src/app/services/StockAdjustments/reasons.service';
import { StockAdjustmentDetailsService } from 'src/app/services/StockAdjustments/stock-adjustment-details.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-stock-adjustment-report-yearly',
  templateUrl: './stock-adjustment-report-yearly.component.html',
  styleUrls: ['./stock-adjustment-report-yearly.component.css']
})
export class StockAdjustmentReportYearlyComponent implements OnInit {
  years :any; 
  months :any; 
  year :any = new Date().getFullYear(); 
  reasons:any;
  reason:string = 'All';
  data : any;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  adjustmentTypes : any=['stockin', 'stockout'];
  adjustmentType  : string = 'stockin';
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
    private stockAdjustmentDetailsService : StockAdjustmentDetailsService,
    private stringHelperService : StringHelperService,
    private reasonsService : ReasonsService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnConfig.decimalColumns = this.numberColumns;
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.getMonths();
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.contextButtons, this.toolButtons, null, null);
    this.getYears();
    this.getReasons();
    this.defaultColumns = this.defaultColumns.concat(this.numberColumns);
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

  async getReasons(){
    this.reasons = await firstValueFrom(this.reasonsService.getCBOReasonsByAdjustmentType(this.adjustmentType));
    this.reasons.push(this.stringHelperService.allReasonNameCBO());
    this.reason  = 'All';
  }


  async onChangeAdjustmentType(){
    await this.getReasons();
  }
  async onClickView(){

  

    this.isLoading = true;

    if (this.reason.toLowerCase() == "all")
      this.data = await firstValueFrom(this.stockAdjustmentDetailsService.getStockAdjustmentDetailsReportByYearByReasonsByAdjustmentType(this.year,  this.adjustmentType));
  else
      this.data = await firstValueFrom(this.stockAdjustmentDetailsService.getStockAdjustmentDetailsReportByYearByReasonNameByAdjustmentType(this.year, this.reason, this.adjustmentType));

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
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printstockadjustmentreport']));
    var data  = this.listData.filteredData;
    var title  = this.adjustmentType.toUpperCase()+' '+this.reason.toUpperCase()+' FOR THE YEAR '+this.year;
    if(this.reason.toLowerCase() == 'all'){
       title  = this.adjustmentType.toUpperCase()+' FOR THE YEAR '+this.year;
    }
    this.printService.popupWindow(url, 'printstockadjustmentreport', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data));
    localStorage.setItem('NumberColumns', JSON.stringify(this.numberColumns));
    localStorage.setItem('Title', title);
  }

}
