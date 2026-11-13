import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { IndexTablesService } from 'src/app/services/Accounting/index-tables.service';
import { TransAccountTitlesService } from 'src/app/services/Accounting/trans-account-titles.service';
import { CashAccountLedgersService } from 'src/app/services/Cashflow/cash-account-ledgers.service';
import { CashAccountsService } from 'src/app/services/Cashflow/cash-accounts.service';
import { BranchesService } from 'src/app/services/Config/branches.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { SaleHeadersService } from 'src/app/services/Sales/sale-headers.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';

@Component({
  selector: 'app-cash-account-ledger',
  templateUrl: './cash-account-ledger.component.html',
  styleUrls: ['./cash-account-ledger.component.css']
})
export class CashAccountLedgerComponent implements OnInit {

  searchKey     : string = "";
  selectedId    :any;
  selectedData  : any;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  listData      : MatTableDataSource<any>;
  isLoading     : boolean = false;
  indexTables      : any;
  transNo      : string;
  dateFrom        : any = new Date();
  dateTo          : any = new Date();
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'View','Function'           : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
  ];
  contextButtons  =  [];
  defaultColumns  = ['TransDate','TransName','ReferenceNo','Description','CashIn','CashOut', 'RunningBalance'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate']
  };
  columnTypeMap: { [key: string]: string } = {};

  ledger: any[];
  previousBalance : number = 0;
  cashAccounts: any[];
  cashAccount: any;
  branches : any;
  branchId : any; 
  constructor(
    private dialog          : MatDialog,
    private cashAccountLedgersService    : CashAccountLedgersService,
    private cashAccountsService    : CashAccountsService,
    private indexTablesService    : IndexTablesService,
    private saleHeadersService        : SaleHeadersService,
    private notif                     : NotificationService,
    private toolBoxService            : ToolBoxService,
    public matTableService           : MatTableService,
    private dateTimesService           : DateTimesService,
    private router : Router,
    private printService : PrintService,
    private branchesService : BranchesService,  
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.getCBOBranches();
    this.getCashAccounts();
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
  async getCashAccounts(){
    this.cashAccounts = await firstValueFrom(this.cashAccountsService.loadCashAccounts2('all', this.branchId));
    this.cashAccount = this.cashAccounts[0].CashAccount;
  }


  async onClickView(){
    this.isLoading = true;
    var data:any = await firstValueFrom(this.cashAccountLedgersService.getCashAccountLedgerByDateFromByDateToByCashAccount(this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)), this.cashAccount, this.branchId));
    this.previousBalance = data[0];
    this.ledger = data[1];
    if(this.ledger)
      this.isLoading = false;
    this.displayRecords();
  }

  applyFilter(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch(){
    this.searchKey =  this.matTableService.clearSearch(this.listData);
  }

  displayRecords(){
    var data      = this.ledger;
    // data = data.sort((a, b) => {
    //   return new Date(a.InputByDateTime).getTime() - new Date(b.InputByDateTime).getTime();
    // });
    
    
    this.listData = new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }

  getRecord(data : any){
    this.selectedId = data.ReferenceNo+'-'+data.Description+'-'+data.Credit+'-'+data.Debit;
    this.selectedData = data;
  }


  async onClickPrint(){
    var url = this.router.serializeUrl(
      this.router.createUrlTree(['print/printcashaccountledger'])
    );
    var data:any = this.listData.filteredData;
    var title = this.cashAccount.toUpperCase()+' LEDGER FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'printcashaccountledger', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data));
    localStorage.setItem('Title', title);
    localStorage.setItem('PreviousBalance', this.previousBalance.toString());
  }


  
  onContextMenu(event: MouseEvent, data: any) {
    if(this.contextButtons.length > 0){
      event.preventDefault();
      this.getRecord(data);
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { 'data': data };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
    
  }


}
