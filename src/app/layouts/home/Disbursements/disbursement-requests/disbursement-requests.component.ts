import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { PODetailsService } from 'src/app/services/Purchasing/podetails.service';
import { POHeadersService } from 'src/app/services/Purchasing/poheaders.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { VoucherHeadersService } from 'src/app/services/Vouchering/voucher-headers.service';
import { HomeComponent } from '../../home.component';
import { DisbursementTransactionUIComponent } from '../disbursement-transaction-ui/disbursement-transaction-ui.component';
import { ReceivingDetailsService } from 'src/app/services/Receiving/receiving-details.service';
import { SupplierPaymentDetailsService } from 'src/app/services/Payables/supplier-payment-details.service';
import { ExpenseDetailsService } from 'src/app/services/Expenses/expense-details.service';
import { SaleReturnDetailsService } from 'src/app/services/SaleReturn/sale-return-details.service';
import { OffsetFromPettyCashUIComponent } from '../offset-from-petty-cash-ui/offset-from-petty-cash-ui.component';

@Component({
  selector: 'app-disbursement-requests',
  templateUrl: './disbursement-requests.component.html',
  styleUrls: ['./disbursement-requests.component.css']
})
export class DisbursementRequestsComponent implements OnInit {

  voucherHeaders           : any[];
  pendingDetails          : any[];
  selectedData    : any=[];
  selectedId      : number = 0;
  searchKey       : string = "";
  searchKey2       : string = "";
  listData        : MatTableDataSource<any>;
  listData2        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  pageSizeOptions2 :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  isLoading2       : boolean = false;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild('paginator') paginator    : MatPaginator;  
  @ViewChild(MatSort) sort2              : MatSort;
  @ViewChild('paginator2') paginator2    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
  ];  

  contextButtons      = [
    {'Label'   : 'Generate Disbursement','Function'            : () => this.onClickGenerateDisbursement(),'Disabled': true,}, 
    {'Label'   : 'Offset From Disbursed Petty Cash','Function'            : () => this.onClickOffSetFromPettyCash(),'Disabled': true,}, 
  ];
  defaultColumns      = ['VoucherNo','VoucherDate','PayToName', 'TransName', 'TransNo','Amount','PaymentType','RequestedBy'];
  defaultColumns2      = ['Qty','UM', 'ItemName','Cost', 'Discount', 'Amount'];
  defaultColumns3      = ['Qty','UM', 'ItemName','Price', 'Discount', 'Amount','SalePaidStatus', 'ExpiryDate', 'Reason'];
  defaultColumns4      = ['SourceTransNo','Amount'];
  defaultColumns5      = ['ParticularName', 'Category','Amount', 'Discount', 'AmountDue'];
  
  
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Amount','Qty','Cost','Price', 'Discount', 'Amount','AmountDue'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['VoucherDate']
  };

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};
  columnTypeMap3: { [key: string]: string } = {};
  columnTypeMap4: { [key: string]: string } = {};
  columnTypeMap5: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private voucherHeadersService        : VoucherHeadersService,
    private pODetailsService        : PODetailsService,
    private receivingDetailsService        : ReceivingDetailsService,
    private supplierPaymentDetailsService        : SupplierPaymentDetailsService,
    private expenseDetailsService        : ExpenseDetailsService,
    private saleReturnDetailsService        : SaleReturnDetailsService,
    private pOHeadersService        : POHeadersService,
    private toolBoxService      : ToolBoxService,
    private notificationService      : NotificationService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    this.columnTypeMap3 = this.buildColumnTypeMap(this.defaultColumns3);
    this.columnTypeMap4 = this.buildColumnTypeMap(this.defaultColumns4);
    this.columnTypeMap5 = this.buildColumnTypeMap(this.defaultColumns5);
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.toolButtons, this.contextButtons, null,null);
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
    this.voucherHeaders = await firstValueFrom(this.voucherHeadersService.getVoucherHeadersPendingByTransName('all'));
    if(this.voucherHeaders)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.voucherHeaders;
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

  displayRecords2(){
    var data = this.pendingDetails;
    this.listData2 =  new MatTableDataSource(data);
    this.listData2.paginator = this.paginator2;
    this.listData2.sort = this.sort2;
  }

  applyFilter2(){
    this.matTableService.applyFilter(this.listData2, this.searchKey2);
  }

  clearSearch2(){
    this.searchKey2 =  this.matTableService.clearSearch(this.listData2);
  }

  getRecord(data : any){
    this.selectedId = data.VoucherNo;
    this.selectedData = data;
    this.onClickViewDetails();
  }

  async onClickViewDetails(){
    this.isLoading2 = true;
    if(this.selectedData.TransName.toLowerCase() == 'purchasing'){
      this.pendingDetails = await firstValueFrom(this.pODetailsService.getOpenPODetailsByTransNo(this.selectedData.TransNo));
    }
    else  if(this.selectedData.TransName.toLowerCase() == 'receiving'){
      this.pendingDetails = await firstValueFrom(this.receivingDetailsService.getOpenReceivingDetailsByTransNo(this.selectedData.TransNo));
    }
    else  if(this.selectedData.TransName.toLowerCase() == 'payables'){
      this.pendingDetails = await firstValueFrom(this.supplierPaymentDetailsService.getOpenSupplierPaymentDetailsByTransNo(this.selectedData.TransNo));
    }
    else  if(this.selectedData.TransName.toLowerCase() == 'expenses'){
      this.pendingDetails = await firstValueFrom(this.expenseDetailsService.getOpenExpenseDetailsByTransNo(this.selectedData.TransNo));
    }
    else  if(this.selectedData.TransName.toLowerCase() == 'sales return'){
      this.pendingDetails = await firstValueFrom(this.saleReturnDetailsService.getOpenSaleReturnDetailsByTransNo(this.selectedData.TransNo));
    }else{
      this.pendingDetails = [];
    }
    if(this.pendingDetails)
        this.isLoading2 = false;
      this.displayRecords2();
  }
  async onClickGenerateDisbursement(){
    if(!this.matTableService.CommonTransaction()){
      return;
    }
    var voucher:any = await firstValueFrom(this.voucherHeadersService.getVoucherHeaderByVoucherNo(this.selectedId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data        = ([voucher, 'generatedisbursement', '']);
    this.dialog.open(DisbursementTransactionUIComponent, dialogConfig).beforeClosed().subscribe(item => {
        this.onClickView();
    });
  }

  async onClickOffSetFromPettyCash(){
    var voucher:any = await firstValueFrom(this.voucherHeadersService.getVoucherHeaderByVoucherNo(this.selectedId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data        = ([voucher, 'offsetfrompettycashdisbursement']);
    this.dialog.open(OffsetFromPettyCashUIComponent, dialogConfig).beforeClosed().subscribe(item => {
        this.onClickView();
    });
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
