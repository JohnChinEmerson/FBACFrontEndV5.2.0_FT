import { Component, Inject, Optional, Input, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AccountTitlesService } from 'src/app/services/Accounting/account-titles.service';
import { AccountingEntryDetailsService } from 'src/app/services/Accounting/accounting-entry-details.service';
import { GeneralJournalsService } from 'src/app/services/Accounting/general-journals.service';
import { IndexTablesService } from 'src/app/services/Accounting/index-tables.service';
import { TransAccountTitlesService } from 'src/app/services/Accounting/trans-account-titles.service';
import { BranchesService } from 'src/app/services/Config/branches.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { SaleHeadersService } from 'src/app/services/Sales/sale-headers.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-general-ledger-ui',
  templateUrl: './general-ledger-ui.component.html',
  styleUrls: ['./general-ledger-ui.component.css']
})
export class GeneralLedgerUIComponent implements OnInit {

  @Input() data: any; // This will receive `indexTables` from SalesJournalComponent
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
  showHeader : boolean = false;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'View','Function'           : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
  ];
  contextButtons  =  [];
  defaultColumns  = ['ReferenceNo', 'Description',  'AccountTitle','Debit',  'Credit'];

  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Debit',  'Credit'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};
  text: string;
  singleTable: boolean = false;
  btnAdjustingEntryVisible: boolean = false;
  indexTables2: any[];
  entries: any[];
  tableEntries: any[];
  adjustingEntries: any[];
  accountTitles: any[];
  accountTitle: any;
  branches : any;
  branchId : any; 
  constructor(
    private dialog          : MatDialog,
    private generalJournalsService    : GeneralJournalsService,
    private accountingEntryDetailsService    : AccountingEntryDetailsService,
    private transAccountTitlesService    : TransAccountTitlesService,
    private indexTablesService    : IndexTablesService,
    private saleHeadersService        : SaleHeadersService,
    private notif                     : NotificationService,
    private toolBoxService            : ToolBoxService,
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
    console.log(this.data)
    if(this.data){
      if (this.data.Source.toLowerCase() == 'financial statements') {
        //financial statements
        this.showHeader   = true;
        this.singleTable  = false;
        this.text         = this.data.AccountTitle + ' LedgerUI';
        this.accountTitle = this.data.AccountTitle;
        this.dateFrom     = this.data.DateFrom, 
        this.dateTo       = this.data.DateTo,
        this.btnAdjustingEntryVisible = false;
        await this.onClickView();

      } else if (this.data.Source.toLowerCase() == 'transaction') {
        // transaction ui
        this.indexTables = this.data;
        this.text        = this.indexTables.TransName + 'LedgerUI';
        this.singleTable = true;
        this.btnAdjustingEntryVisible = false;
        this.getAccountTitles();
      }
    }else{
      //main ui
      this.singleTable = false;
      this.btnAdjustingEntryVisible = true;
      this.getAccountTitles2();
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
    this.accountTitles = await firstValueFrom(this.transAccountTitlesService.LoadTransAccountTitlesByAccountTitleTable(this.indexTables.AccountTitleTable));
    this.accountTitle = this.accountTitles[0];
  }

  async getAccountTitles2(){
    this.accountTitles = await firstValueFrom(this.transAccountTitlesService.LoadTransAccountTitles());
    this.accountTitle = this.accountTitles[0];
  }

  async onClickView(){
    this.isLoading = true;

    this.entries = [];
    this.adjustingEntries = [];
    this.tableEntries = [];
    if (this.singleTable)
    {
      this.tableEntries = await firstValueFrom(this.generalJournalsService.getEntryByIndexTableByDateFromByDateToByAccountTitle(this.indexTables, this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)), this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)), this.accountTitle,this.branchId));
      this.tableEntries.forEach(x => {
        x.EntryPoint = this.indexTables.TransName;
        this.entries.push(x);
      });   
      
      this.adjustingEntries = await firstValueFrom(this.accountingEntryDetailsService.getAdjustingEntriesByTransNameByDateFromByDateToByAccountTitle(this.indexTables.TransName,this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)), this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)), this.accountTitle,this.branchId))
      this.adjustingEntries.forEach(x => {
        x.EntryPoint = 'AdjustingEntry';
        this.entries.push(x);
      });    
    }
    else
    {
       this.indexTables2 = await firstValueFrom(this.indexTablesService.getIndexTables());
        this.indexTables2.forEach(async x => {
          this.tableEntries = await firstValueFrom(this.generalJournalsService.getEntryByIndexTableByDateFromByDateToByAccountTitle(x, this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)), this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)), this.accountTitle,this.branchId));
          this.tableEntries.forEach(x => {
            x.EntryPoint = x.TransName;
            this.entries.push(x);
          });   
        });

        this.adjustingEntries = await firstValueFrom(this.accountingEntryDetailsService.getAdjustingEntriesByTransNameByDateFromByDateToByAccountTitle('all',this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)), this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)), this.accountTitle,this.branchId))
        this.adjustingEntries.forEach(x => {
          x.EntryPoint = 'AdjustingEntry';
          this.entries.push(x);
        });    
    }

    if(this.entries)
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
    this.entries = this.entries.filter((item, index, self) =>
    index === self.findIndex(x =>x.AccountTitle === item.AccountTitle &&x.Debit === item.Debit &&x.Credit === item.Credit &&x.ReferenceNo === item.ReferenceNo));

    this.entries = this.entries.sort((a, b) => {
        return new Date(a.InputByDateTime).getTime() -
               new Date(b.InputByDateTime).getTime();
    });

    this.listData = new MatTableDataSource(this.entries);
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
      sum += +x[column];
    });
    return sum;
  }

  getBranchName(){
    var branch = this.branches.find(x => x.BranchId.toLowerCase() == this.branchId.toLowerCase());
    return branch.BranchName.toUpperCase()+' BRANCH';
   }

  async onClickPrint(){
    var url = this.router.serializeUrl(
      this.router.createUrlTree(['print/printgeneralledger'])
    );
    var data:any = this.listData.filteredData;
    if(this.btnAdjustingEntryVisible){
      var title = this.getBranchName()+' - '+this.accountTitle.toUpperCase()+' LEDGER FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    }else{
      if (this.data.Source.toLowerCase() == 'financial statements') {
        title = this.getBranchName()+' '+this.accountTitle.toUpperCase()+' LEDGER FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;

      }else{
        title = this.getBranchName()+' '+this.indexTables.TransName.toUpperCase()+' '+this.accountTitle.toUpperCase()+' LEDGER FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
      }
    }
    this.printService.popupWindow(url, 'printgeneralledger', window, 800, 800);
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
