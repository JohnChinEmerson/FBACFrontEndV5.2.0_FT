import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { ExpenseDetailsService } from 'src/app/services/Expenses/expense-details.service';
import { ExpenseHeadersService } from 'src/app/services/Expenses/expense-headers.service';
import { ExpenseParticularsService } from 'src/app/services/Expenses/expense-particulars.service';
import { ExpensePayeesService } from 'src/app/services/Expenses/expense-payees.service';
import { ExpenseTransactionService } from 'src/app/services/Expenses/expense-transaction.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { ExpenseDetailUIComponent } from '../expense-detail-ui/expense-detail-ui.component';
import { ExpenseHeaderUIComponent } from '../expense-header-ui/expense-header-ui.component';
import { ExpenseParticularUIComponent } from '../expense-particular-ui/expense-particular-ui.component';
import { ExpensePayeeUIComponent } from '../expense-payee-ui/expense-payee-ui.component';
import { ExpensePendingTransactionsUIComponent } from '../expense-pending-transactions-ui/expense-pending-transactions-ui.component';

@Component({
  selector: 'app-expense-transaction2',
  templateUrl: './expense-transaction2.component.html',
  styleUrls: ['./expense-transaction2.component.css']
})
export class ExpenseTransaction2Component implements OnInit {
  particulars           : any=[];
  payees                : any=[];
  payeeId               : string = 'CASH';
  particularId          : string ="";
  selectedParticular    : any;
  selectedRowIndex      : number = 0;
  selectedPayee         : any;
  previousPayeeId       : any;  
  qty                   :  number;

  expenseDetails     : any=[];
  expenseHeader      : any=[];

  listData1        : MatTableDataSource<any>;
  searchKey1       : string;
  isLoading1       : boolean = false;
  
  listData2        : MatTableDataSource<any>;
  searchKey2       : string;
  isLoading2       : boolean = false;

  rightClickType      : string = 'expensedetails';
  transCode           : string  = null;
  totalAmount         : number = 0;
  selectedId          : string;
  selectedData        : any;
  expenseConfig       : any=[];
  disableSave         : boolean = false;
  recordStatus        : string = 'open';
  defaultColumns  = ['ParticularName', 'Category','Amount'];
  defaultColumns2: any[] = [
    'Amount',
    'ParticularName',
    'Category',
    'Discount',
    'DiscountValue',
    'AmountDue',
  ];

  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Amount', 'Discount', 'DiscountValue', 'AmountDue',],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};

  @ViewChild('qtyInput') qtyInputRef: ElementRef;
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('dataTable', { static: false }) dataTable!: ElementRef;
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;
  @ViewChildren('rowElement', { read: ElementRef }) rows!: QueryList<ElementRef>;
  @ViewChild('tableContainer', { static: true }) tableContainer!: ElementRef;

  toolButtons     = [
    {'Label'   : 'New Payee','Function'             : () => this.onClickNewPayee(),'Disabled': true,}, 
  ];

  toolButtons2     = [
    {'Label'   : 'New Particular','Function'             : () => this.onClickNewParticular(),'Disabled': true,}, 
  ];

  toggleButtons     = [
    {'Label'   : 'SAVE TRANSACTION-F4','Function'    : () => this.onClickSaveTransaction(),'Disabled': true,}, 
  ];

  toggleButtons2     = [
       {'Label'   : 'LOAD PARTICULARS-F1','Function'          : () => this.onClickLoadParticulars(),'Disabled': true,}, 
  ];
  contextButtons1  =  [
  ];
  contextButtons2  =  [
    {'Label'   : 'Edit','Function'            : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Remove','Function'          : () => this.onClickRemove(),'Disabled': true,}, 
    {'Label'   : 'Remove All','Function'      : () => this.onClickRemoveAll(),'Disabled': true,}, 
    {'Label'   : 'Save As Pending','Function' : () => this.onClickSaveAsPending(),'Disabled': true,}, 
    {'Label'   : 'Show Pending','Function'    : () => this.onClickShowPending(),'Disabled': true,}, 
  ];
  constructor(
    private dialog          : MatDialog,
    private particularsService    : ExpenseParticularsService,
    private payeesService     : ExpensePayeesService,
    private expenseTransactionService      : ExpenseTransactionService,
    private expenseHeadersService      : ExpenseHeadersService,
    private expenseDetailsService      : ExpenseDetailsService,
    private notif           : NotificationService,
    private auth_service    : AuthService,
    private toolBoxService : ToolBoxService,
    public matTableService : MatTableService,
    private numbersService : NumbersService,
    private dateTimesService : DateTimesService,
    private stringHelperService : StringHelperService,
    private homeTs : HomeComponent,
    private notificationService : NotificationService,
     private viewContainerRef : ViewContainerRef,
    
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    this.getPayees();
    this.getExpenseParticulars();
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.toolButtons, this.toolButtons2, this.toggleButtons, this.toggleButtons2);
    this.toolBoxService.disableButtons(this.contextButtons1, this.contextButtons2,null, null);
    this.getExpenseDetails();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }
  async getPayees(){
    this.payees = await firstValueFrom(this.payeesService.getCBOPayees());
    this.payees.push(this.stringHelperService.withCASHPayeeCBO());
  }

  async getTransCode(){
    this.transCode = null;   // Desktop: no number until the first line is saved (it then gets its temporary TransNo)
  }

  async getExpenseDetails(){
    this.isLoading2 = true;
    try{
      this.expenseHeader = await firstValueFrom(this.expenseHeadersService.getExpenseHeaderByRecordStatusByInputBy('ongoing',this.auth_service.User));

      if (!this.expenseHeader) {
        this.expenseDetails = [];
        this.payeeId = 'CASH';
        this.transCode = null;
      }
      else{
        this.expenseDetails = await firstValueFrom(this.expenseDetailsService.getExpenseDetailsByTransCode(this.expenseHeader.TransCode));
        this.payeeId = this.expenseHeader.PayeeId;
        this.transCode = this.expenseHeader.TransCode;
      }
    }
    finally{
      this.isLoading2 = false;
      this.displayExpenseDetails();
    }
  } 


  // async getExpenseDetails(){
  //   if(this.transCode == null){
  //     await this.getTransCode();
  //   }
  //   this.isLoading2 = true;
  //   this.expenseHeader  = await firstValueFrom(this.expenseHeadersService.getExpenseHeaderByTransCode(this.transCode));
  //   this.expenseDetails =  await firstValueFrom(this.expenseDetailsService.getExpenseDetailsByTransCode(this.transCode));

  //   if(this.expenseHeader){
  //     if(this.expenseHeader.PayeeId){
  //       if(this.payeeId  != 'CASH'){
  //         this.payeeId = this.payeeId
  //       }else{
  //         this.payeeId = this.expenseHeader.PayeeId
  //       }
  //     }
  //   }else{
  //     if(!this.payeeId){
  //       this.payeeId = 'CASH';
  //     }
  //   }
    
  //   if(this.expenseDetails)
  //     this.isLoading2 = false;
  //   this.displayExpenseDetails();
  // } 


  async getExpenseParticulars(){
    this.isLoading1 = true;
    this.particulars = await firstValueFrom(this.particularsService.getCBOParticulars());
    this.isLoading1 = false;
    this.displayExpenseParticulars();
  }

  displayExpenseParticulars(){
    var data = this.particulars; 
    this.resetSearchBoxes();
    this.listData1 = new MatTableDataSource(data);
    this.listData1.paginator = this.paginator1;
    this.searchInput.nativeElement.focus();
  }

  displayExpenseDetails(){
    var data = this.expenseDetails; 
    this.totalAmount = 0;
    if(data.length > 0){
      data.forEach(x => {
        this.totalAmount += +x.AmountDue;
      });
    }
    this.selectedId = undefined;
    this.selectedData = undefined;
    this.listData2 = new MatTableDataSource(data);
    this.listData2.paginator = this.paginator2;
  }

  async onChangePayee(data){
    if(this.expenseDetails.length > 0){
      return this.notificationService.popupWarning3Buttons('Ongoing Transaction', 'Transaction for '+this.expenseDetails[0].PayeeName+' is ongoing. Save transaction as pending first to avoid data loss. CONTINUE?', 'Override Payee', 'Save as Pending', 'Cancel').then((result) => {
        if (result.isConfirmed) {
          this.expenseTransactionService.saveAsPendingExpenseByTransCode(this.transCode).subscribe({
            next:async (res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.payeeId = data.PayeeId;
              await this.getTransCode();
              this.expenseHeader = null;   // Save As Pending: start a new transaction (the saved one stays in Show Pending, Desktop)
              this.expenseDetails = [];
              this.displayExpenseDetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
        }
        else if (result.isDenied) {
          this.expenseTransactionService.overrideExpensePayeeByTransCode(this.transCode, data.PayeeId).subscribe({
            next:async (res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.payeeId = data.PayeeId;
              await this.getTransCode();
              this.getExpenseDetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
        }else{
          this.payeeId = this.expenseDetails[0].PayeeId;
        }
        
      });
    }
  }

    
  getRecord2(data : any){
    this.selectedId = data.id;
    this.selectedData = data;
  }

  getRecord1(data : any){
    this.particularId = data.ParticularId;
    this.selectedParticular = data;

    const filtered = this.listData1?.filteredData;
    if (filtered) {
      const index = filtered.findIndex((item: any) => item.ParticularId === data.ParticularId);
      if (index !== -1) {
        this.selectedRowIndex = index;
      }
    }
  }

  getFirstRecordItem() {
    const data = this.listData1?.filteredData[0];
    if (data) {
      this.getRecord1(data);
    }
  }

  getFirstRecord() {
    const data = this.listData1?.filteredData[0];
    if (data) {
      const index = this.listData1.data.findIndex((x: any) => x.ParticularId === data.ParticularId);
      this.selectedRowIndex = index;
      this.getRecord1(data);

      setTimeout(() => {
          if (this.searchInput) {
            this.searchInput.nativeElement.blur();
          }
          const table = document.querySelector('mat-table') as HTMLElement;
          if (table) {
            table.focus();
          } else {
            console.warn('mat-table not found in DOM');
          }
        }, 100);
    }
  }

  onKeyDown(event: KeyboardEvent) {
    const data = this.listData1?.filteredData;
    if (!data || data.length === 0) return;

    if (event.key === 'ArrowDown') {
      this.selectedRowIndex = (this.selectedRowIndex + 1) % data.length;
      this.getRecord1(data[this.selectedRowIndex]);
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      this.selectedRowIndex = (this.selectedRowIndex - 1 + data.length) % data.length;
      this.getRecord1(data[this.selectedRowIndex]);
      event.preventDefault();
    }

    // Scroll logic (same as before)
    setTimeout(() => {
      const rowElems = this.rows?.toArray();
      const selectedRow = rowElems?.[this.selectedRowIndex];
      if (selectedRow) {
        const rowElement = selectedRow.nativeElement;
        const container = this.tableContainer.nativeElement;

        const rowTop = rowElement.offsetTop;
        const rowBottom = rowTop + rowElement.offsetHeight;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.clientHeight;

        if (rowTop < containerTop || rowBottom > containerBottom) {
          rowElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  }

  async onFocusQty(){
    if(this.transCode == null){
      await this.getTransCode();
    }

    if(!this.selectedParticular || this.selectedParticular == undefined){
      this.getFirstRecord();
    }
    if(this.qty > 0){
      this.selectedParticular.Amount = this.qty;
    }

    this.selectedParticular.TransCode = this.transCode;
    this.selectedParticular.PayeeId = this.payeeId;
    this.saveToExpenseHeaders();
  }

  saveToExpenseHeaders(){
    this.expenseTransactionService.saveToExpenseHeaders(this.selectedParticular.ParticularId, this.transCode, this.payeeId, this.qty ?? this.selectedParticular.Amount, this.recordStatus).subscribe({
      next: (res)=>{
        this.transCode = res.expenseDetail?.TransNo ?? this.transCode;  // the first line gets the temporary TransNo
        this.notif.toastrSuccess(res.message);
        this.expenseDetails = [ res.expenseDetail,...this.expenseDetails]; 
        this.displayExpenseDetails();
        this.resetSearchBoxes();
      },
      error: (err)=>{
        this.notif.toastrError(err.error.message);
        this.particularId = undefined;
      }
    }); 
  }

  async onClickSaveTransaction(){
    if (!this.matTableService.CommonTransaction()) {
      return;
    }
    if(this.expenseDetails.length == 0)
      return this.notificationService.toastrWarning('Empty Transaction');

    var payee:any = await firstValueFrom(this.payeesService.getPayeeByPayeeId(this.payeeId));

    this.disableSave = true;
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data = ([payee,this.expenseHeader, this.transCode, this.totalAmount, this.recordStatus,'saveexpensetransaction']);
    this.dialog.open(ExpenseHeaderUIComponent,dialogConfig).beforeClosed().subscribe(async x => {
      if(x){
        await this.getTransCode();
        this.expenseHeader = null;
        this.payeeId = 'CASH';
        this.expenseDetails= [];
        this.displayExpenseDetails();
        this.resetSearchBoxes();
      }
    });
    
  }

 async onClickEdit(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    
    var expenseDetail:any = await firstValueFrom(this.expenseDetailsService.getExpenseDetailById(this.selectedData.id));
    var particular:any = await firstValueFrom(this.particularsService.getParticularByParticularId(this.selectedData.ParticularId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = ([expenseDetail,particular, 'updateexpensetransaction']);
    this.dialog.open(ExpenseDetailUIComponent,dialogConfig).beforeClosed().subscribe(expenseDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(expenseDetail) ? expenseDetail[0] : expenseDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo

      //update expenseDetailsDisplay
      const expenseDetailIndex = this.expenseDetails.findIndex(detail => detail.id === expenseDetail.id);
      if (expenseDetailIndex !== -1) {
        this.expenseDetails[expenseDetailIndex] = expenseDetail;  
      }
      this.displayExpenseDetails();
    });
  }

  onClickRemove(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notificationService.popupWarning("Delete Record",this.selectedData.ParticularName+ " will be remove. Continue?").then((result) => {
      if (result.value) {
        this.expenseTransactionService.deleteExpenseDetailById(this.selectedData.id).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.expenseDetails = this.expenseDetails.filter(x => x.id != this.selectedData.id);
              this.displayExpenseDetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error.message);
            },
        });
      }
    });
  }

  onClickRemoveAll(){
    if(this.expenseDetails.length == 0)
      return this.notificationService.toastrWarning('Empty Transaction');

    this.notificationService.popupWarning("Delete Record","All Particulars will be REMOVED. Continue?").then((result) => {
      if (result.value) {
        this.expenseTransactionService.deleteExpenseDetailsByTransCode(this.transCode).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.expenseDetails = [];
              this.displayExpenseDetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error.message);
            },
        });
      }
    });
  }
  
  onClickSaveAsPending(){
    this.notificationService.popupWarning("Pending Expense","All Particulars will be save as pending. Continue?").then((result) => {
      if (result.value) {
        this.expenseTransactionService.saveAsPendingExpenseByTransCode(this.transCode).subscribe({
            next:async (res)=>{
              this.notificationService.toastrSuccess(res.message);
              await this.getTransCode();
              this.expenseHeader = null;   // Save As Pending: start a new transaction (the saved one stays in Show Pending, Desktop)
              this.expenseDetails = [];
              this.displayExpenseDetails();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
      }
    });
  }

  onClickShowPending(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data        = this.transCode;
     dialogConfig.viewContainerRef = this.viewContainerRef; 
    this.dialog.open(ExpensePendingTransactionsUIComponent,dialogConfig).beforeClosed().subscribe(res => {
      if(res){
        this.transCode = res.transCode; 
        this.expenseDetails = res.expenseDetails; 
        this.expenseHeader = res.expenseHeader; 
        this.payeeId = res.expenseHeader.PayeeId; 
        this.displayExpenseDetails();
      }
    });
  }


  onClickLoadParticulars(){
    this.getExpenseParticulars();
  }



  onClickNewPayee(){
      if (!this.matTableService.CommonTransaction()) {
      return;
    }
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = (['','expense']);
    this.dialog.open(ExpensePayeeUIComponent,dialogConfig).beforeClosed().subscribe(payee => {
      if(payee){
        this.payees = [payee,...this.payees]; 
      }
    });
  }

  onClickNewParticular(){
      if (!this.matTableService.CommonTransaction()) {
      return;
    }
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data        = (['', 'expense']);
    this.dialog.open(ExpenseParticularUIComponent,dialogConfig).beforeClosed().subscribe(particular => {
      if(particular){
        this.particulars = [particular,...this.particulars]; 
        this.displayExpenseParticulars();
      }
    });
  }

  updateElementExpenseDetail(event: any, id, Column){
    if(Column == 'DiscountType'){
      var Value = event.checked;
      if(Value == true){
        Value = 'percent';
      }else{
        Value = 'amount';
      }
    }else{
      var Value = event.target.value ;
      if (!this.numbersService.isNumber(Value)) {
        return this.notif.toastrWarning(Value+' is not a number.');
      } 
    }
    this.expenseTransactionService.updateElementExpenseDetail(id, Column, Value).subscribe({
      next:(res) =>{
        this.notif.toastrSuccess(res.message);

        //update expenseDetailsDisplay
        const expenseDetailIndex = this.expenseDetails.findIndex(detail => detail.id === id);
        if (expenseDetailIndex !== -1) {
          this.expenseDetails[expenseDetailIndex] = res.expenseDetail;  
        }
        this.displayExpenseDetails();
      },
      error:(err) => {
        this.notif.toastrError(err.error.message);
      },
    });
  }

  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  onContextMenu(event: MouseEvent, data: any, type) {
    this.rightClickType = type;
    if(data)
     if(type == 'expensedetails'){
        this.getRecord2(data);
      }else{
        this.getRecord1(data);
      }
    
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { 'data': data };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
  }

  applyFilter(){
    this.matTableService.applyFilter(this.listData1, this.searchKey1);
  }

  clearSearch(){
    this.searchKey1 =  this.matTableService.clearSearch(this.listData1);
  }
  
  async applyFilter2(){
    this.matTableService.applyFilter(this.listData1, this.searchKey1);
    this.selectedParticular = this.listData1.filteredData[0];

    if(!this.selectedParticular || this.selectedParticular == undefined){
      return this.notificationService.toastrWarning("Particular Not Found.");
    }
    this.onFocusQty();
  }

  resetSearchBoxes(){
    this.particularId = undefined;
    this.qty = undefined;
    this.selectedParticular = undefined;
    this.searchKey1 = undefined;
    this.searchInput.nativeElement.focus();
    if(this.listData1?.filteredData){
      this.clearSearch();
    }
  }
  @HostListener('document:keydown', ['$event'])
 handleKeyboardEvent(event: KeyboardEvent) {
  if (event.key === 'F1') {
    event.preventDefault();
    this.onClickLoadParticulars();
  }
 
   if (event.key === 'F4') {
    event.preventDefault();
    this.onClickSaveTransaction();
  }
  
}
}
