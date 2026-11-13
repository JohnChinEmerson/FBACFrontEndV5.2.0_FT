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
import { DailyNetCashService } from 'src/app/services/Reports/daily-net-cash.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { _url } from 'src/global-variables';
import { HomeComponent } from '../../home.component';
import { BranchesService } from 'src/app/services/Config/branches.service';

@Component({
  selector: 'app-daily-net-cash',
  templateUrl: './daily-net-cash.component.html',
  styleUrls: ['./daily-net-cash.component.css']
})
export class DailyNetCashComponent implements OnInit {

  years :any; 
  months :any; 
  year :any = new Date().getFullYear();
  month:any = new Date().getMonth() + 1;
  profitLoss : any;
  total : any;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  photoUrl        : string = _url+"img/items/";
  empty  : MatTableDataSource<any>;
  monthName : any;
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
  dateColumn      = ['TransDate'];
  numberColumns1  : any= [
                      {
                          Label : 'SO PMT',
                          Data : 'OrderDownPayments',
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
  mergeColumns1 = this.dateColumn.concat(this.numberColumns1.map(col => col.Data));
  displayedColumns3: string[] = [
    'GrandTotal',
    'CashIn',
    'CashOut',
    'NetH',
  ];
  branches : any;
  branchId : any;
  constructor(
    private helperService : HelperService,
    private dailyNetCashService : DailyNetCashService,
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
    this.getMonths();
  }
  async getCBOBranches(){
    this.branches = await firstValueFrom(this.branchesService.getBranchesCBO());
    this.branchId = this.branches[0].BranchId;
  }
  async getMonths(){
    this.months = await firstValueFrom(this.helperService.getMonthsWithValue());
  }

  async getYears(){
    this.years = await firstValueFrom(this.helperService.getYears());
  }
  async onClickView(){
    this.isLoading = true;
    var data:any = await firstValueFrom(this.dailyNetCashService.getDailyNetCashReportByMonthByYear(this.month, this.year, this.branchId));
    this.profitLoss = data.profitLoss;
    this.total = data.total;
    if(this.profitLoss)
      this.isLoading = false;
    this.displayRecords();
  }

  async displayRecords(){
    this.monthName = await firstValueFrom(this.helperService.getMonthName(this.month));
    this.title   = this.getBranchName()+' DAILY NET CASH AS OF '+this.monthName.toUpperCase()+' '+this.year;
    var data = this.profitLoss;
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
            sum += +x[column] ? +x[column] : 0;
    });
    return sum;
  }
  getBranchName(){
    var branch = this.branches.find(x => x.BranchId.toLowerCase() == this.branchId.toLowerCase());
    return branch.BranchName.toUpperCase()+' BRANCH';
   }
  async onClickPrint(){
    var url     = this.router.serializeUrl(this.router.createUrlTree(['print/printdailynetcash']));
    var data    = this.listData.filteredData;
    this.printService.popupWindow(url, 'printdailynetcash', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data)); 
    localStorage.setItem('Title', this.title);
  }


}
