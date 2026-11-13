import { Component, Inject, Input, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { IndexTablesService } from 'src/app/services/Accounting/index-tables.service';
import { CashflowLedgersService } from 'src/app/services/Cashflow/cashflow-ledgers.service';
import { BranchesService } from 'src/app/services/Config/branches.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-cashflow-ledger-ui',
  templateUrl: './cashflow-ledger-ui.component.html',
  styleUrls: ['./cashflow-ledger-ui.component.css']
})
export class CashflowLedgerUIComponent implements OnInit {
  @Input() data: any; // This will receive `indexTables` from SalesJournalComponent
   searchKey     : string = "";
   selectedId    :any;
   selectedData  : any;
   pageSizeOptions :any = this.matTableService.pageSizeOptions();
   listData      : MatTableDataSource<any>;
   isLoading     : boolean = false;
   indexTables      : any;
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
   defaultColumns  = ['Description',  'AccountTitle','Debit',  'Credit'];
   columnConfig: ColumnTypeConfig = {
      decimalColumns: ['Debit',  'Credit'],
      intColumns: [],
      dateTimeColumns: [],
      dateColumns: []
    };
    columnTypeMap: { [key: string]: string } = {};

   text: string;
   singleTable: boolean = false;
   showHeader : boolean = false;
   btnAdjustingEntryVisible: boolean = false;
   entries: any[];
   accountTitles: any[];
   accountTitle: any;
    enableCashflowActTitle: boolean = true;
    enabledtFrom: boolean = true;
    enabledtTo: boolean = true;
    enablebtnGo: boolean = true;
    accountColumns : any=[];
    branches : any;
    branchId : any; 
   constructor(
     private dialog          : MatDialog,
     private cashflowLedgersService    : CashflowLedgersService,
     private indexTablesService    : IndexTablesService,
     public matTableService           : MatTableService,
     private dateTimesService           : DateTimesService,
     private router : Router,
     private printService : PrintService,
    private branchesService : BranchesService,  
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: any
    
   ) { }
 
   async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.data = this.data || this.dialogData;

    await this.getCBOBranches();

     if(this.data){
      if (this.data.Source.toLowerCase() == 'financial statements') {
        //financial statements
        this.showHeader   = true;
        this.singleTable  = false;
        this.text         = this.data.AccountTitle + ' LedgerUI';
        this.accountTitle = this.data.AccountTitle;
        this.dateFrom     = this.data.DateFrom, 
        this.dateTo       = this.data.DateTo,
        await this.onClickView();

      }else{
        this.dateFrom = this.data.from;
        this.dateTo = this.data.to;
        this.accountTitle = this.data.cfAccountTitle;
        this.enableCashflowActTitle = false;
        this.enabledtFrom = false;
        this.enabledtTo = false;
        this.enablebtnGo = false;
      }
     }else{
       this.getAccountTitles();
     }
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
   async getAccountTitles(){
     this.accountTitles = await firstValueFrom(this.indexTablesService.loadCashflowAccountTitles());
     this.accountTitle = this.accountTitles[0].CashflowAccountTitle;
   }
 
   async onClickView(){
    this.isLoading = true;
    this.accountColumns = [];
     if (this.accountTitle.toLowerCase() == "opening balance" || this.accountTitle.toLowerCase() == "cash adjustment")
     {
         var cashflowTransColumn = this.accountTitle.toLowerCase() == "opening balance" ? "OpeningBalance" : "CashAdjustment";
         var cashflow = this.accountTitle.toLowerCase() == "opening balance" ? "cashin" : "cashout";
         var indexTable:any = 
         {
             AccountTitleTable : "cashtransferaccounttitles",
             CashAccountTransColumn : cashflowTransColumn,
             Cashflow : cashflow,
             CashflowAccountTitle : this.accountTitle,
             TransactionTable : "cashtransfers",
             TransName : "Cash Transfers"
         };
         this.entries = await firstValueFrom(this.cashflowLedgersService.getCashflowEntryByIndexTableByDateFromByDateToByAccountTitle(indexTable, this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)), this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)), this.accountTitle, this.branchId));
         this.accountColumns =  this.entries;
     }
     else
     {
      var hasPaymentType = "yes";
      var indexTables = await firstValueFrom(this.indexTablesService.getIndexTablesHasPaymentType(hasPaymentType));
      for (const x of indexTables) {
        this.entries = await firstValueFrom(this.cashflowLedgersService.getCashflowEntryByIndexTableByDateFromByDateToByAccountTitle(
          x, 
          this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)), 
          this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)), 
          this.accountTitle,
          this.branchId
        ));
      
        this.accountColumns.push(...this.entries); // Use spread syntax to add each entry individually
      }
     }
      if(this.accountColumns)
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
     var data      = this.accountColumns;
     this.accountColumns = this.accountColumns.sort((a, b) => {
       return new Date(a.InputByDateTime).getTime() - new Date(b.InputByDateTime).getTime();
     });
     
     this.listData = new MatTableDataSource(data);
     this.listData.paginator = this.paginator;
     this.listData.sort = this.sort;
   }
 
   getRecord(data : any){
     this.selectedId = data.TransNo+'-'+data.Description+'-'+data.Credit+'-'+data.Debit;
     this.selectedData = data;
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
     var url = this.router.serializeUrl(
       this.router.createUrlTree(['print/printcashflowledger'])
     );
     var data:any = this.listData.filteredData;
     if(this.btnAdjustingEntryVisible){
       var title = this.getBranchName()+' - '+this.accountTitle.toUpperCase()+' CASHFLOW LEDGER FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
     }else{
         title = this.getBranchName()+' - '+this.accountTitle.toUpperCase()+' CASHFLOW LEDGER FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
     }
     this.printService.popupWindow(url, 'printcashflowledger', window, 800, 800);
     localStorage.setItem('Data', JSON.stringify(data));
     localStorage.setItem('Title', title);
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
