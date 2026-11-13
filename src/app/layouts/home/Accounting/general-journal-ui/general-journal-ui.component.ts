import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { table } from 'console';
import { firstValueFrom } from 'rxjs';
import { AccountingEntryDetailsService } from 'src/app/services/Accounting/accounting-entry-details.service';
import { GeneralJournalsService } from 'src/app/services/Accounting/general-journals.service';
import { IndexTablesService } from 'src/app/services/Accounting/index-tables.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { SaleHeadersService } from 'src/app/services/Sales/sale-headers.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { AdjustingEntryUIComponent } from '../adjusting-entry-ui/adjusting-entry-ui.component';
import { BranchesService } from 'src/app/services/Config/branches.service';

@Component({
  selector: 'app-general-journal-ui',
  templateUrl: './general-journal-ui.component.html',
  styleUrls: ['./general-journal-ui.component.css']
})
export class GeneralJournalUIComponent implements OnInit {
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
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'View','Function'           : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
  ];
  toolButtons2     = [
    {'Label'   : 'Adjusting Entry','Function'           : () => this.onClickAdjustingEntry(),'Disabled': true,}, 
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
  branches : any;
  branchId : any; 
  constructor(
    private dialog          : MatDialog,
    private generalJournalsService    : GeneralJournalsService,
    private accountingEntryDetailsService    : AccountingEntryDetailsService,
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
    if(this.data){
      this.indexTables = this.data;
      this.text        = this.indexTables.TransName + 'JournalUI';
      this.singleTable = true;
      this.btnAdjustingEntryVisible = false;
    }else{
      this.singleTable = false;
      this.btnAdjustingEntryVisible = true;
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
  async onClickView(){
    this.isLoading = true;

    this.entries = [];
    this.adjustingEntries = [];
    this.tableEntries = [];
    if (this.singleTable)
    {
      this.tableEntries = await firstValueFrom(this.generalJournalsService.getEntryByIndexTableByDateFromByDateToByAccountTitle(this.indexTables, this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)), this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)), 'all', this.branchId));
      this.tableEntries.forEach(x => {
        x.EntryPoint = this.indexTables.TransName;
        this.entries.push(x);
      });   
      
      this.adjustingEntries = await firstValueFrom(this.accountingEntryDetailsService.getAdjustingEntriesByTransNameByDateFromByDateTo(this.indexTables.TransName,this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)), this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)), this.branchId))
      this.adjustingEntries.forEach(x => {
        x.EntryPoint = 'AdjustingEntry';
        this.entries.push(x);
      });    
    }
    else
    {
       this.indexTables2 = await firstValueFrom(this.indexTablesService.getIndexTables());
        this.indexTables2.forEach(async x => {
          this.tableEntries = await firstValueFrom(this.generalJournalsService.getEntryByIndexTableByDateFromByDateToByAccountTitle(x, this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)), this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)), 'all', this.branchId));
          this.tableEntries.forEach(x => {
            x.EntryPoint = x.TransName;
            this.entries.push(x);
          });   
        });

        this.adjustingEntries = await firstValueFrom(this.accountingEntryDetailsService.getAdjustingEntriesByTransNameByDateFromByDateTo('all',this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)), this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)), this.branchId))
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
    var data      = this.entries;
    this.entries = this.entries.sort((a, b) => {
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
      sum += +x[column];
    });
    return sum;
  }

  getBranchName(){
    var branch = this.branches.find(x => x.BranchId.toLowerCase() == this.branchId.toLowerCase());
    return branch.BranchName.toUpperCase()+' BRANCH';
   }

  onClickAdjustingEntry(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '2000px';
    dialogConfig.data = (['',[], [], 'saveadjustingentry']);
    this.dialog.open(AdjustingEntryUIComponent,dialogConfig);
  }

  async onClickPrint(){
    var url = this.router.serializeUrl(
      this.router.createUrlTree(['print/printgeneraljournal'])
    );
    var data:any = this.listData.filteredData;
    if(this.btnAdjustingEntryVisible){
      var title = this.getBranchName()+' - '+' JOURNAL ENTRIES FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    }else{
       title = this.getBranchName()+' - '+this.indexTables.TransName.toUpperCase()+' JOURNAL ENTRIES FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    }
    this.printService.popupWindow(url, 'printgeneraljournal', window, 800, 800);
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
