import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { DisbursementHeadersService } from 'src/app/services/Disbursements/disbursement-headers.service';
import { ExpenseDetailsService } from 'src/app/services/Expenses/expense-details.service';
import { ExpenseHeadersService } from 'src/app/services/Expenses/expense-headers.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SupplierPaymentDetailsService } from 'src/app/services/Payables/supplier-payment-details.service';
import { SupplierPaymentHeadersService } from 'src/app/services/Payables/supplier-payment-headers.service';
import { PrintService } from 'src/app/services/print.service';
import { PODetailsService } from 'src/app/services/Purchasing/podetails.service';
import { POHeadersService } from 'src/app/services/Purchasing/poheaders.service';
import { ReceivingDetailsService } from 'src/app/services/Receiving/receiving-details.service';
import { ReceivingHeadersService } from 'src/app/services/Receiving/receiving-headers.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { VoucherTransUIComponent } from '../../Vouchering/voucher-trans-ui/voucher-trans-ui.component';
import { AccountingEntryUIComponent } from '../../Accounting/accounting-entry-ui/accounting-entry-ui.component';
import { DisbursementTransactionUIComponent } from '../disbursement-transaction-ui/disbursement-transaction-ui.component';
import { VoucherHeadersService } from 'src/app/services/Vouchering/voucher-headers.service';

@Component({
  selector: 'app-disbursement-records',
  templateUrl: './disbursement-records.component.html',
  styleUrls: ['./disbursement-records.component.css']
})
export class DisbursementRecordsComponent implements OnInit {

  disbursementHeaders : any=[];
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  dateFrom        : any = new Date();
  dateTo          : any = new Date();
  transName       : string = 'All';
  transNames      : any = [
                          'All',
                          'Purchasing',
                          'Receiving',
                          'Expenses',
                          'Payables',
                          'Petty Cash',
                          'Sales Return'
                        ];
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  toolButtons     = [
    {'Label'   : 'View','Function'                : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'               : () => this.onClickPrint(),'Disabled': true,}, 
  ];  
  toolButtons2     = [
    {'Label'   : 'Print Receipt','Function'               : () => this.onClickPrintReceipt(),'Disabled': true,}, 
  ];  
  contextButtons     = [
    {'Label'   : 'Edit','Function'                : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Void/Open','Function'           : () => this.onClickVoid(),'Disabled': true,},
    {'Label'   : 'Accounting Entry','Function'           : () => this.onClickAccountingEntry(),'Disabled': true,},
  ];
  defaultColumns    = ['TransDate','DisburseNo','TransNo', 'TransName','PayToName', 'PaymentType','AmountPaid','CashAccount', 'ReceivedBy', 'RecordStatus','InputByDateTime','InputBy','ReadingNo'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['AmountPaid'],
    intColumns: [],
    dateTimeColumns: ['InputByDateTime'],
    dateColumns: ['TransDate']
  };

  columnTypeMap: { [key: string]: string } = {};
  
  constructor(
    private dialog              : MatDialog,
    private disbursementHeadersService        : DisbursementHeadersService,
    private voucherHeadersService        : VoucherHeadersService,
    private pOHeadersService        : POHeadersService,
    private pODetailsService        : PODetailsService,
    private receivingHeadersService        : ReceivingHeadersService,
    private receivingDetailsService        : ReceivingDetailsService,
    private expenseHeadersService        : ExpenseHeadersService,
    private expenseDetailsService        : ExpenseDetailsService,
    private supplierPaymentHeadersService        : SupplierPaymentHeadersService,
    private supplierPaymentDetailsService        : SupplierPaymentDetailsService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService      : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
    private notificationService : NotificationService,
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
    this.disbursementHeaders = await firstValueFrom(this.disbursementHeadersService.getDisbursementHeadersByDateFromByDateToByTransName(
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      this.transName,
    ));
    if(this.disbursementHeaders)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.disbursementHeaders;
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
    this.selectedId = data.DisburseNo;
    this.selectedData = data;
  }


  async onClickEdit(){
    if(!this.matTableService.checkNull(this.selectedId)) return;


    var dHeader = await firstValueFrom(this.disbursementHeadersService.getDisbursementHeaderByDisburseNo(this.selectedId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data        = (['', 'updatedisbursementfromrecords',dHeader]);
    this.dialog.open(DisbursementTransactionUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      if(x){
        this.populateChanges(x);
      }
    });
  }

  onClickVoid(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var action = this.selectedData?.RecordStatus == 'open' ? 'void' : 'open';
    this.notificationService.popupWarning(action.toUpperCase()+" Record","All Items  under " + this.selectedId + " will be " + action.toUpperCase () + ". Continue?").then(async (result) => {
      if (result.value) {
          this.disbursementHeadersService.updateDisbursementRecordStatus(this.selectedId, action).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.populateChanges(res.disbursementHeader);
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
          });
      }
    });
  }


    onClickAccountingEntry(){
      if(!this.matTableService.checkNull(this.selectedId)) return;
  
      var indexTables: any ={
        'AccountTitleTable' : 'disbursementaccounttitles',
        'TransactionTable' : 'disbursementheaders',
        'TransName' : null,
      } ;
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1000px';
      dialogConfig.data         = ([indexTables, this.selectedId]);
      this.dialog.open(AccountingEntryUIComponent,dialogConfig);
  
    }

  populateChanges(disbursementHeader){
    this.selectedId  = null;
    this.selectedData = null;
    const disbursementHeaderIndex = this.disbursementHeaders.findIndex(detail => detail.DisburseNo === disbursementHeader.DisburseNo);
    if (disbursementHeaderIndex !== -1) {
      this.disbursementHeaders[disbursementHeaderIndex] = disbursementHeader;  
    }
    this.displayRecords();
  }
  
    onClickPrint(){
      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printdisbursementreceipts']));
      var data  = this.listData.filteredData;
      var title = this.transName.toUpperCase()+' DISBURSEMENTS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
      this.printService.popupWindow(url, 'printdisbursementreceipts', window, 800, 800);
      localStorage.setItem('Headers', JSON.stringify(data));
      localStorage.setItem('Title', title);
    }

    async onClickPrintReceipt(){
      if(!this.matTableService.checkNull(this.selectedId)) return;

        var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printdisbursementreceipt']));
        var title = 'DISBURSEMENT RECEIPT OF  - ' + this.selectedData.DisburseNo ;
        
        this.printService.popupWindow(url, 'printdisbursementreceipt', window, 800, 800);
        localStorage.setItem('Disbursement', JSON.stringify(this.selectedData));
        localStorage.setItem('Title', title);
        localStorage.setItem('TransNo', this.selectedData.DisburseNo);
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
