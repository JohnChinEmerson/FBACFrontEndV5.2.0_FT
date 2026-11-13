import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { ExpenseHeadersService } from 'src/app/services/Expenses/expense-headers.service';
import { ExpenseParticularsService } from 'src/app/services/Expenses/expense-particulars.service';
import { ExpenseTransactionService } from 'src/app/services/Expenses/expense-transaction.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { ExpenseDetailUIComponent } from '../expense-detail-ui/expense-detail-ui.component';

@Component({
  selector: 'app-load-particulars-for-expense-ui',
  templateUrl: './load-particulars-for-expense-ui.component.html',
  styleUrls: ['./load-particulars-for-expense-ui.component.css']
})
export class LoadParticularsForExpenseUIComponent implements OnInit {

  particulars           : any=[];
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  selectedParticular : any;
  type :string;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Save To Expense','Function'   : () => this.onClickSaveToExpense(),'Disabled': true,}, 
  ];  
  contextButtons     = [];
  defaultColumns  = ['ParticularName','Category','Amount'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Amount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  transCode: string;
  payeeId: string;
  expenseDetails: any=[];
  expenseHeader: any;
  particular: any;
  ui: any;
  dateFrom: string | number | Date;
  dateTo: string | number | Date;
  constructor(
    private dialog                      : MatDialog,
    private dialogRef                   : MatDialogRef<LoadParticularsForExpenseUIComponent>,
    private particularsService        : ExpenseParticularsService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService      : DateTimesService,
    public matTableService     : MatTableService,
    private expenseTransactionService : ExpenseTransactionService,
    private expenseHeadersService : ExpenseHeadersService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  ngOnInit(): void {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);

    this.transCode = this.data[0];
    this.payeeId    = this.data[1];
    this.expenseDetails = this.data[2];
    this.expenseHeader = this.data[2];
    this.ui = this.data[3];
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
      this.particulars = await firstValueFrom(this.particularsService.getParticularsToDisplay());
    if(this.particulars)
      this.isLoading = false;
    this.displayRecords();
  }


  displayRecords(){
    var data = this.particulars;
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
    this.selectedId = data.ParticularId;
    this.selectedData = data;
  }

  onClose(){
    if(this.ui == 'expensetransaction'){
      this.dialogRef.close(this.expenseDetails);
    }
    if(this.ui == 'expensereceipts'){
      this.dialogRef.close(this.expenseHeader);
    }
  }

  applyFilter2(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
    this.selectedId = this.listData.filteredData[0].ParticularId;
    this.onClickSaveToExpense();
  }

  onClickSaveToExpense(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    this.selectedParticular  = this.particulars.filter(x => x.ParticularId == this.selectedId);
    this.selectedParticular = this.selectedParticular[0];

    if(this.ui == 'expensereceipts')
      this.PopupQtyUI2();
    else{
      this.expenseTransactionService.saveToExpenseHeaders(this.selectedId, this.transCode, this.payeeId, this.selectedParticular.Amount, 'open').subscribe({
        next: (res)=>{
          this.transCode = res.expenseDetail?.TransNo ?? this.transCode;  // the first line gets the temporary TransNo
          this.notificationService.toastrSuccess(res.message);
          this.expenseDetails = [ res.expenseDetail,...this.expenseDetails]; 
          this.selectedId = undefined;
        },
        error: (err)=>{
          this.notificationService.toastrError(err.error.message);
        }
      }); 
    }
  }

  async PopupQtyUI2()
  {
    var particular:any     = await firstValueFrom(this.particularsService.getParticularByParticularId(this.selectedId));
    particular.TransCode   = this.transCode;
    particular.PayeeId  = this.payeeId;
    
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    if(this.ui == 'expensetransaction'){
      dialogConfig.data = (['',particular, 'additemexpensetransaction']);
    }
    if(this.ui == 'expensereceipts'){
      particular.TransNo   = this.expenseHeader.TransNo;
      dialogConfig.data = (['',particular, 'additemexpensereceipts'
      ]);
    }
    this.dialog.open(ExpenseDetailUIComponent,dialogConfig).beforeClosed().subscribe(async expenseDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(expenseDetail) ? expenseDetail[0] : expenseDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo
      if(this.ui == 'expensetransaction'){
        this.expenseDetails = [ expenseDetail,...this.expenseDetails]; 
        this.selectedId = undefined;
      }
      if(this.ui == 'expensereceipts'){
        this.expenseHeader = await firstValueFrom(this.expenseHeadersService.getExpenseHeaderByTransNo(expenseDetail.TransNo));
      }
    });
   
  }

}
