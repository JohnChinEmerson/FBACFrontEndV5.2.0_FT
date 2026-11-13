import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { ExpenseDetailsService } from 'src/app/services/Expenses/expense-details.service';
import { ExpenseHeadersService } from 'src/app/services/Expenses/expense-headers.service';
import { ExpenseTransactionService } from 'src/app/services/Expenses/expense-transaction.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-expense-pending-transactions-ui',
  templateUrl: './expense-pending-transactions-ui.component.html',
  styleUrls: ['./expense-pending-transactions-ui.component.css']
})
export class ExpensePendingTransactionsUIComponent implements OnInit {

  expenseHeaders           : any[];
  expenseDetails           : any[];
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  listData2        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  pageSizeOptions2 :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  isLoading2       : boolean = false;

  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild('paginator') paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  @ViewChild(MatSort) sort2              : MatSort;
  @ViewChild('paginator2') paginator2    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu2: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'Save To Expense','Function'            : () => this.onClickSaveToExpense(),'Disabled': true,}, 
  ];
  contextButtons  =  [
    {'Label'   : 'Remove','Function'            : () => this.onClickRemove(),'Disabled': true,}, 
    {'Label'   : 'Remove All','Function'            : () => this.onClickRemoveAll(),'Disabled': true,}, 
  ];

  defaultColumns  = ['TransCode', 'PayeeName'];
  defaultColumns2 = ['Amount','ParticularName', 'Category','Discount', 'AmountDue',];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Amount','Discount', 'AmountDue'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};

  transCode : string;
  constructor(
    private dialogRef         : MatDialogRef<ExpensePendingTransactionsUIComponent>,
    private dialog              : MatDialog,
    private expenseHeadersService        : ExpenseHeadersService,
    private expenseDetailsService        : ExpenseDetailsService,
    private expenseTransactionService        : ExpenseTransactionService,
    public matTableService     : MatTableService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    private homeTs              : HomeComponent,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    await this.homeTs.getButtons();
     this.toolBoxService.disableButtons(this.toolButtons, null, this.contextButtons, null);
    this.transCode  = this.data;
    this.onClickView();
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
    this.expenseHeaders = await firstValueFrom(this.expenseHeadersService.getExpenseHeadersByRecordStatus('pending'));
    if(this.expenseHeaders)
      this.isLoading = false;
    this.displayRecords();
  }

  async onClickViewExpenseDetails(){
    this.listData2 =  new MatTableDataSource([]);
    this.listData2.paginator = this.paginator2;
    this.listData2.sort = this.sort2;

    this.isLoading2 = true;
    this.expenseDetails = await firstValueFrom(this.expenseDetailsService.getExpenseDetailsByTransCode(this.selectedData.TransCode));
    if(this.expenseDetails)
      this.isLoading2 = false;
    this.displayRecords2();
  }

  displayRecords(){
    var data = this.expenseHeaders;
    this.listData =  new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;

    this.listData2 =  new MatTableDataSource([]);
    this.listData2.paginator = this.paginator2;
    this.listData2.sort = this.sort2;

  }
  displayRecords2(){
    var data = this.expenseDetails;
    this.listData2 =  new MatTableDataSource(data);
    this.listData2.paginator = this.paginator2;
    this.listData2.sort = this.sort2;
  }
  applyFilter(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch(){
    this.searchKey =  this.matTableService.clearSearch(this.listData);
  }

  getRecord(data : any){
    this.selectedId = data.TransCode;
    this.selectedData = data;
    this.onClickViewExpenseDetails();
  }
 
  onClickRemove(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notificationService.popupWarning("Delete Record",this.selectedData.TransCode+ " will be remove. Continue?").then((result) => {
      if (result.value) {
        this.expenseTransactionService.deleteExpenseDetailsByTransCode(this.selectedData.TransCode).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.expenseHeaders = this.expenseHeaders.filter(x => x.TransCode != this.selectedData.TransCode);
              this.displayRecords();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
      }
    });
  }

  onClickRemoveAll(){
    this.notificationService.popupWarning("Delete Record","All records will be remove. Continue?").then((result) => {
      if (result.value) {
        this.expenseTransactionService.deleteAllExpenseHeadersPending().subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.expenseHeaders = [];
              this.displayRecords();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
      }
    });
  }

  onClickSaveToExpense(){
    this.notificationService.popupWarning("Save To Expense","Record will be save to expense. Continue?").then((result) => {
      if(result.value){
          if(this.transCode){
            this.expenseTransactionService.saveAsPendingExpenseByTransCode(this.transCode).subscribe({
                next:(res)=>{
                
                },
                error:(err)=>{
                  this.notificationService.toastrError(err.error);
                },
            });
        }
        this.expenseTransactionService.backToOngoingExpenseByTransCode(this.selectedData.TransCode).subscribe({
            next:(res)=>{
              this.dialogRef.close(res);
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
      }
    });
  }

  onClose(){
    this.dialogRef.close(false);
  }
  onContextMenu(event: MouseEvent, data: any) {
    this.getRecord(data);
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'data': data };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }


}
