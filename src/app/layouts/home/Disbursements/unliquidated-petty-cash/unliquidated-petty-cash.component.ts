import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { DisbursedPettyCashService } from 'src/app/services/Disbursements/disbursed-petty-cash.service';
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
import { VoucherHeadersService } from 'src/app/services/Vouchering/voucher-headers.service';
import { HomeComponent } from '../../home.component';
import { LiquidateUIComponent } from '../liquidate-ui/liquidate-ui.component';

@Component({
  selector: 'app-unliquidated-petty-cash',
  templateUrl: './unliquidated-petty-cash.component.html',
  styleUrls: ['./unliquidated-petty-cash.component.css']
})
export class UnliquidatedPettyCashComponent implements OnInit {
  pettyCashRecords : any=[];
  paidTrans         : any=[];
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  listData2        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  pageSizeOptions2 :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  isLoading2       : boolean = false;
  dateFrom        : any = new Date();
  dateTo          : any = new Date();
  liquidated : boolean;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;
  @ViewChild(MatSort) sort2              : MatSort;
  @ViewChild(MatPaginator) paginator2    : MatPaginator;
  @ViewChild('contextMenuTrigger')
  contextMenu!: MatMenuTrigger;
  @ViewChild('contextMenuTrigger2')
  contextMenuTrigger2!: MatMenuTrigger;
  contextMenuPosition2 = {x: '0px',y: '0px'};
   selectedData2: any;
  contextMenuPosition = { x: '0px', y: '0px' };
  toolButtons     = [
    {'Label'   : 'View','Function'                : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'               : () => this.onClickPrint(),'Disabled': true,}, 
  ];  
  toolButtons2     = [
    {'Label'   : 'Liquidate','Function'                : () => this.onClickLiquidate(),'Disabled': true,}, 
    {'Label'   : 'Print Receipt','Function'               : () => this.onClickPrintReceipt(),'Disabled': true,}, 
  ];  
  contextButtons     = [
    {'Label'   : 'Liquidate','Function'                : () => this.onClickLiquidate(),'Disabled': true,}, 
  ];
    contextButtons2 = [
     {'Label': 'Remove','Function': () => this.onClickRemove(),'Disabled': false,},
  ];
  defaultColumns    = ['TransDate','DisburseNo','VoucherNo', 'PaymentType','CashAccount','AmountReleased', 'AmountUsed', 'AmountLeft','ReceivedBy'];
  defaultColumns2    = ['TransDate','VoucherNo', 'TransNo','TransName', 'Description','AmountPaid', 'AmountLeft'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['AmountReleased', 'AmountUsed', 'AmountLeft','AmountPaid', 'AmountLeft'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate']
  };

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private disbursedPettyCashService        : DisbursedPettyCashService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService      : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
    private notificationService : NotificationService,
    private route : ActivatedRoute,
  ) { 
    this.route.data.subscribe(data => {
      this.liquidated = data['liquidated'];
    });
  }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.toolButtons, this.toolButtons2, this.contextButtons, null);
    if(!this.liquidated)
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
    if(!this.liquidated)
      this.pettyCashRecords = await firstValueFrom(this.disbursedPettyCashService.getPettyCashUnliquidated());
    else
      this.pettyCashRecords = await firstValueFrom(this.disbursedPettyCashService.getPettyCashLiquidatedByDateFromByDateTo(
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
    ));

    if(this.pettyCashRecords)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.pettyCashRecords;
    this.listData =  new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;


    this.listData2 =  new MatTableDataSource([]);
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
    this.selectedId = data.DisburseNo;
    this.selectedData = data;
    this.viewPaidTransactions();
  }

  async viewPaidTransactions()
  {
    if(!this.selectedId)
        return;
    this.isLoading2 = true;
      var amountReleased = this.selectedData.AmountReleased;
      this.paidTrans = await firstValueFrom(this.disbursedPettyCashService.getPaidTransactionsByDisburseNo(this.selectedId));
      var amountLeft =this.selectedData.AmountReleased;
      this.paidTrans.forEach(x => {
        amountLeft -= x.AmountPaid;
        x.AmountLeft = amountLeft;
      });
    this.isLoading2 = false;
     this.displayRecords2();
  }

  displayRecords2(){
    var data = this.paidTrans;
    this.listData2 =  new MatTableDataSource(data);
    this.listData2.paginator = this.paginator2;
    this.listData2.sort = this.sort2;
  }

  async onClickLiquidate(){
    if(!this.matTableService.CommonTransaction()){
      return;
    }
    if(!this.matTableService.checkNull(this.selectedId)) return;

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    dialogConfig.data        = ([this.selectedData, 'liquidatefromunliquidated']);
    this.dialog.open(LiquidateUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      if(x){
        this.onClickView();
      }
    });
  }
selectPaidTransaction(data: any) {
  this.selectedData2 = data;
}
onClickRemove(data?: any) {
  data = data || this.selectedData2;

  if (!data || !data.TransNo || !data.VoucherNo) {
    this.notificationService.toastrWarning('Please select a record.');
    return;
  }
  this.notificationService.popupWarning('Remove','Are you sure you want to remove this record?').then((result) => {
    if (result.value) {
      this.disbursedPettyCashService.deletePaidTransaction({
        VoucherNo: data.VoucherNo,
        TransNo: data.TransNo,
        TransName: data.TransName,
        DisburseNo: this.selectedId
      }).subscribe({
        next: () => {
          this.notificationService.toastrSuccess('Removed successfully.');
          this.selectedData2 = null;
          this.viewPaidTransactions();
          this.onClickView();
        },
        error: (err: any) => {
          this.notificationService.toastrError(
            err?.error?.message || 'Failed to remove.'
          );
        }
      });
    }
  });
}

  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printpettycashrecords']));
    var data  = this.listData.filteredData;
    var title = 'DISBURSED PETTY CASH FROM FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'printpettycashrecords', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data));
    localStorage.setItem('Title', title);
  }

  async onClickPrintReceipt(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printpettycashdetailsreceipt']));
      var title = 'PETTY CASH DETAILS RECEIPT OF  - ' + this.selectedData.DisburseNo ;
      
      this.printService.popupWindow(url, 'printpettycashdetailsreceipt', window, 800, 800);
      localStorage.setItem('PettyCash', JSON.stringify(this.selectedData));
      localStorage.setItem('PaidTrans', JSON.stringify(this.paidTrans));
      localStorage.setItem('Title', title);
      localStorage.setItem('TransNo', this.selectedData.DisburseNo);
  }
  
onContextMenu2(event: MouseEvent, data: any) {
  event.preventDefault();

  this.selectPaidTransaction(data);

  this.contextMenuPosition2 = {
    x: event.clientX + 'px',
    y: event.clientY + 'px'
  };

  this.contextMenuTrigger2.menuData = { data: data };

  this.contextMenuTrigger2.openMenu();
}

}
