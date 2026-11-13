import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { ExpenseConfigService } from 'src/app/services/Expenses/expense-config.service';
import { ExpenseDetailsService } from 'src/app/services/Expenses/expense-details.service';
import { ExpenseHeadersService } from 'src/app/services/Expenses/expense-headers.service';
import { ExpenseParticularsService } from 'src/app/services/Expenses/expense-particulars.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { ExpenseDetailUIComponent } from '../expense-detail-ui/expense-detail-ui.component';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-expense-details-ui',
  templateUrl: './expense-details-ui.component.html',
  styleUrls: ['./expense-details-ui.component.css']
})
export class ExpenseDetailsUIComponent implements OnInit {

  expenseHeader      : any;
  expenseConfig      : any;
  expenseDetails     : any[];
  transNo         : any;
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
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
  ];  
  toolButtons2     = [
    {'Label'   : 'Print Details','Function'  : () => this.onClickPrintDetails(),'Disabled': true,}, 
  ];  
  contextButtons      = [
    {'Label'   : 'Edit','Function'            : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Void/Open','Function'       : () => this.onClickVoid(),'Disabled': true,}, 
  ];
  defaultColumns      = ['TransDate','TransNo', 'PayeeName','ParticularName', 'Category','Amount', 'Discount', 'AmountDue','RecordStatus',  'ReadingNo'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Amount', 'Discount', 'AmountDue'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate']
  };

  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private expenseHeadersService  : ExpenseHeadersService,
    private expenseDetailsService  : ExpenseDetailsService,
    private expenseConfigService   : ExpenseConfigService,
    private expenseParticularsService      : ExpenseParticularsService,
    private dateTimesService    : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    private homeTs              : HomeComponent,

    @Inject(MAT_DIALOG_DATA) public data: any, 

  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.toolButtons, this.toolButtons2, this.contextButtons, null);
    this.dateFrom = this.data[0];
    this.dateTo   = this.data[1];
    this.transNo = this.data[2];
    this.onClickView();
    this.getExpenseConfig();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }
  async getExpenseConfig(){
    this.expenseConfig = await firstValueFrom(this.expenseConfigService.getExpenseConfig());
  }

  async getExpenseHeader(transNo){
    this.expenseHeader = await firstValueFrom(this.expenseHeadersService.getExpenseHeaderByTransNo(transNo));
  }

  async onClickView(){
    this.isLoading = true;
    if(this.transNo == 'all'){
      this.expenseDetails = await firstValueFrom(this.expenseDetailsService.getExpenseDetailsByDateFromByDateTo(
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      ));
    }else{
      this.expenseDetails = await firstValueFrom(this.expenseDetailsService.getExpenseDetailsByTransNo(
      this.transNo
    ));
    }
    
    if(this.expenseDetails)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.expenseDetails;
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
    this.selectedId = data.id;
    this.selectedData = data;
  }
  async onClickEdit(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    var expenseDetail:any = await firstValueFrom(this.expenseDetailsService.getExpenseDetailById(this.selectedData.id));
    var particular:any = await firstValueFrom(this.expenseParticularsService.getParticularByParticularId(this.selectedData.ParticularId));

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = ([expenseDetail,particular, 'editexpenserecord']);
    this.dialog.open(ExpenseDetailUIComponent,dialogConfig).beforeClosed().subscribe(expenseDetail => {
      if(expenseDetail){
        const expenseDetailIndex = this.expenseDetails.findIndex(detail => detail.id === expenseDetail.id);
        if (expenseDetailIndex !== -1) {
          this.expenseDetails[expenseDetailIndex] = expenseDetail;  
        }
        this.displayRecords();
        this.selectedId = undefined;
      }
    
    });
  }

  onClickVoid(){
    if(!this.matTableService.checkNull(this.selectedId)) return;
  
    var action = this.selectedData?.RecordStatus == 'open' ? 'void' : 'open';
    this.notificationService.popupWarning(action.toUpperCase()+" Record",this.selectedData.ParticularName + " under " + this.selectedData.TransNo + " will be " + action + ". Continue?").then(async (result) => {
      if (result.value) {
          this.expenseDetailsService.updateExpenseDetailRecordStatus(this.selectedId, action).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.populateChanges(res.expenseDetail);
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
          });
      }
    });
  }

  populateChanges(expenseDetail){
    this.selectedId  = null;
    this.selectedData = null;
    const expenseDetailIndex = this.expenseDetails.findIndex(detail => detail.id === expenseDetail.id);
    if (expenseDetailIndex !== -1) {
      this.expenseDetails[expenseDetailIndex] = expenseDetail;  
    }
    this.displayRecords();
  }

  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printexpensedetails']));
    var data  = this.listData.filteredData;
    var title = 'EXPENSE DETAILS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'ExpenseDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify([]));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', this.transNo);
  }

  async onClickPrintDetails(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    await this.getExpenseHeader(this.selectedData.TransNo);

    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printexpensedetails']));
    var data  = this.listData.filteredData.filter(x =>x.TransNo == this.selectedData.TransNo && x.RecordStatus == 'open');
    var title = 'EXPENSE RECEIPT OF  - ' + this.expenseHeader.TransNo ;
    
    this.printService.popupWindow(url, 'expenseDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(this.expenseHeader));
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
