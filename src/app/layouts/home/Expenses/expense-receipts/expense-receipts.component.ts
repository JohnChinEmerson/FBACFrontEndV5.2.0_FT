import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { ExpenseDetailsService } from 'src/app/services/Expenses/expense-details.service';
import { ExpenseHeadersService } from 'src/app/services/Expenses/expense-headers.service';
import { ExpensePayeesService } from 'src/app/services/Expenses/expense-payees.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { AccountingEntryUIComponent } from '../../Accounting/accounting-entry-ui/accounting-entry-ui.component';
import { HomeComponent } from '../../home.component';
import { ExpenseDetailsUIComponent } from '../expense-details-ui/expense-details-ui.component';
import { ExpenseHeaderUIComponent } from '../expense-header-ui/expense-header-ui.component';
import { LoadParticularsForExpenseUIComponent } from '../load-particulars-for-expense-ui/load-particulars-for-expense-ui.component';

@Component({
  selector: 'app-expense-receipts',
  templateUrl: './expense-receipts.component.html',
  styleUrls: ['./expense-receipts.component.css']
})
export class ExpenseReceiptsComponent implements OnInit {

  expenseHeaders : any=[];
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  dateFrom        : any = new Date();
  dateTo          : any = new Date();
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  toolButtons     = [
    {'Label'   : 'View','Function'                : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'               : () => this.onClickPrint(),'Disabled': true,},   
  ];  
  toolButtons2     = [
    {'Label'   : 'View Details','Function'        : () => this.onClickViewDetails(),'Disabled': true,}, 
    {'Label'   : 'Print Receipt','Function'               : () => this.onClickPrintReceipt(),'Disabled': true,},   
    {'Label'   : 'View All Details','Function'    : () => this.onClickViewAllDetails(),'Disabled': true,}, 
  ];  
  contextButtons     = [
    {'Label'   : 'Edit','Function'                : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Void/Open','Function'           : () => this.onClickVoid(),'Disabled': true,},
    {'Label'   : 'Add Item','Function'            : () => this.onClickAddItem(),'Disabled': true,}, 
    {'Label'   : 'Accounting Entry','Function'    : () => this.onClickAccountingEntry(),'Disabled': true,}, 
  ];
  defaultColumns    = ['TransDate','TransNo', 'PayeeName','TotalDue','PaymentType','TermDays','DueDate','InputByDateTime','InputBy', 'RecordStatus', 'ReadingNo', 'FundSource'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['TotalDue',],
    intColumns: ['TermDays'],
    dateTimeColumns: ['InputByDateTime'],
    dateColumns: ['TransDate','DueDate']
  };

  columnTypeMap: { [key: string]: string } = {};
  
  constructor(
    private dialog              : MatDialog,
    private expenseHeadersService        : ExpenseHeadersService,
    private expenseDetailsService        : ExpenseDetailsService,
    private expensePayeesService        : ExpensePayeesService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService      : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
    private notificationService : NotificationService,
    private viewContainerRef : ViewContainerRef,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.toolButtons, this.toolButtons2, this.contextButtons, null);
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async onClickView(){
    this.isLoading = true;
    this.expenseHeaders = await firstValueFrom(this.expenseHeadersService.getExpenseHeadersByDateFromByDateTo(
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))
    ));
    if(this.expenseHeaders)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.expenseHeaders;
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
    this.selectedId = data.TransNo;
    this.selectedData = data;
  }

  onClickViewDetails(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1500px';
    dialogConfig.data         = ([this.dateFrom, this.dateTo, this.selectedData.TransNo]);
    dialogConfig.viewContainerRef = this.viewContainerRef; 
    this.dialog.open(ExpenseDetailsUIComponent,dialogConfig).beforeClosed().subscribe(x => {
        this.onClickView();
    });
  }

  onClickViewAllDetails(){
    const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1500px';
      dialogConfig.data         = ([this.dateFrom, this.dateTo, 'all']);
      dialogConfig.viewContainerRef = this.viewContainerRef; 
      this.dialog.open(ExpenseDetailsUIComponent,dialogConfig).beforeClosed().subscribe(x => {
        this.onClickView();
    });
  }

  async onClickEdit(){
    if(!this.matTableService.checkNull(this.selectedId)) return;


    var data = await firstValueFrom(this.expenseHeadersService.getExpenseHeaderByTransNo(this.selectedId));
    var payee = await firstValueFrom(this.expensePayeesService.getPayeeByPayeeId(this.selectedData.PayeeId));

    if(data && payee){
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1000px';
      dialogConfig.data = ([payee,data, data.TransNo,data.TotalAmount, 'update','updateexpenseheader']);
      this.dialog.open(ExpenseHeaderUIComponent,dialogConfig).beforeClosed().subscribe(x => {
        if(x){
          this.populateChanges(x);
        }
      });
    }
  }

  onClickVoid(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var action = this.selectedData?.RecordStatus == 'open' ? 'void' : 'open';
    this.notificationService.popupWarning(action.toUpperCase()+" Record","All Items  under " + this.selectedId + " will be " + action.toUpperCase () + ". Continue?").then(async (result) => {
      if (result.value) {
        var data = await firstValueFrom(this.expenseHeadersService.getExpenseHeaderByTransNo(this.selectedId));

          this.expenseHeadersService.updateExpenseRecordStatus(this.selectedId, action).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.populateChanges(res.expenseHeader);
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error.message);
            },
          });
      
      }
    });
  }

  populateChanges(expenseHeader){
    this.selectedId  = null;
    this.selectedData = null;
    const expenseHeaderIndex = this.expenseHeaders.findIndex(detail => detail.TransNo === expenseHeader.TransNo);
    if (expenseHeaderIndex !== -1) {
      this.expenseHeaders[expenseHeaderIndex] = expenseHeader;  
    }
    this.displayRecords();
  }

  async onClickAddItem(){
     if (!this.matTableService.CommonTransaction()) {
      return;
    }
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var data = await firstValueFrom(this.expenseHeadersService.getExpenseHeaderByTransNo(this.selectedId));

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1500px';
    dialogConfig.data         = ([data.TransCode, data.PayeeId,data, 'expensereceipts']);
    this.dialog.open(LoadParticularsForExpenseUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      if(x){
        this.populateChanges(x);
      } 
    });
  }

  onClickAccountingEntry(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var indexTables: any ={
      'AccountTitleTable' : 'expenseaccounttitles',
      'TransactionTable' : 'expenseheaders',
      'TransName' : null,
    } ;
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data         = ([indexTables, this.selectedId]);
    this.dialog.open(AccountingEntryUIComponent,dialogConfig);

  }
  
  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printexpensereceipts']));
    var data  = this.listData.filteredData;
    var title = 'EXPENSE RECEIPTS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'PrintExpenseReceipts', window, 800, 800);
    localStorage.setItem('Headers', JSON.stringify(data));
    localStorage.setItem('Title', title);
  }

  async onClickPrintReceipt(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var expenseHeader = await firstValueFrom(this.expenseHeadersService.getExpenseHeaderByTransNo(this.selectedData.TransNo));
    var expenseDetails = await firstValueFrom(this.expenseDetailsService.getExpenseDetailsByTransNo(this.selectedData.TransNo));

    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printexpensedetails']));
    var data  = expenseDetails.filter(x =>x.TransNo == this.selectedData.TransNo && x.RecordStatus == 'open');
    var title = 'EXPENSE RECEIPT OF  - ' + expenseHeader.TransNo ;
    
    this.printService.popupWindow(url, 'expenseDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(expenseHeader));
    localStorage.setItem('Voucher', null);
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', this.selectedData.TransNo);
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

}
