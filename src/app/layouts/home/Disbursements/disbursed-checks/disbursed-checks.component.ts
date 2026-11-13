import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DisbursedChecksService } from 'src/app/services/Disbursements/disbursed-checks.service';
import { HelperService } from 'src/app/services/helper.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { CashAccountsService } from 'src/app/services/Cashflow/cash-accounts.service';

@Component({
  selector: 'app-disbursed-checks',
  templateUrl: './disbursed-checks.component.html',
  styleUrls: ['./disbursed-checks.component.css']
})
export class DisbursedChecksComponent implements OnInit {
  years :any; 
  months :any; 
  year :any = new Date().getFullYear();
  month:any =new Date().getMonth()+1; 
  bankAccounts:any = [];
  bankAccount:string = 'All';
  disbursedChecks : any;
  selectedId: any;
  selectedData: any;
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
  contextButtons     = [];
  defaultColumns  = ['TransDate', 'CheckDate','CheckNo','CashAccount', 'DisburseNo', 'VoucherNo', 'PayToName', 'TransName', 'AmountPaid'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['AmountPaid'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate', 'CheckDate']
  };

  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private helperService : HelperService,
    private disbursedChecksService : DisbursedChecksService,
    private dialog : MatDialog,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
    private cashAccountsService              : CashAccountsService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.contextButtons, this.toolButtons, null, null);
    this.getYears();
    this.getMonths();
    this.getBankAccounts();
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
  }

  async getYears(){
    this.years = await firstValueFrom(this.helperService.getYears());
  }

  async getBankAccounts(){
    this.bankAccounts = await firstValueFrom(this.cashAccountsService.loadCashAccounts('check'));
    var a:any = {
      'id' : 0, 'CashAccount' : "All", 'CashAccountType' : "All"
    };
    this.bankAccounts.push(a);
  }

  async onClickView(){
    this.isLoading = true;
    this.disbursedChecks = await firstValueFrom(this.disbursedChecksService.getDisbursedChecksByBankAccountByYearByMonth(this.bankAccount, this.year, this.month));
    if(this.disbursedChecks)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.disbursedChecks;
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
  getRecord(data : any){
    this.selectedId = data.CheckId+'-'+data.CheckNo;
    this.selectedData = data;
  }

  getTotal(column){
    let sum = 0;
    this.listData?.filteredData.forEach(x => {
            sum += +x[column];
    });
    return sum;
  }

  onContextMenu(event: MouseEvent, data: any) {
    if(this.contextButtons.length > 0){
      this.getRecord(data);
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { 'data': data };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }

  async onClickPrint(){
    var url     = this.router.serializeUrl(this.router.createUrlTree(['print/printdisbursedchecks']));
    var data    = this.listData.filteredData;
    var title   =  this.bankAccount.toUpperCase()+' CHECKS ISSUED FOR '+this.month+'/'+this.year;
    this.printService.popupWindow(url, 'printdisbursedchecks', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data)); 
    localStorage.setItem('Title', title);
  }
}
