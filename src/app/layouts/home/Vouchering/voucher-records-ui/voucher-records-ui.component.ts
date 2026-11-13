import { Component, OnInit, ViewChild } from '@angular/core';
import { VoucherHeadersService } from 'src/app/services/Vouchering/voucher-headers.service';
import { VoucherTransUIComponent } from '../voucher-trans-ui/voucher-trans-ui.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { POHeadersService } from 'src/app/services/Purchasing/poheaders.service';
import { PODetailsService } from 'src/app/services/Purchasing/podetails.service';
import { ReceivingDetailsService } from 'src/app/services/Receiving/receiving-details.service';
import { ReceivingHeadersService } from 'src/app/services/Receiving/receiving-headers.service';
import { ExpenseDetailsService } from 'src/app/services/Expenses/expense-details.service';
import { ExpenseHeadersService } from 'src/app/services/Expenses/expense-headers.service';
import { SupplierPaymentDetailsService } from 'src/app/services/Payables/supplier-payment-details.service';
import { SupplierPaymentHeadersService } from 'src/app/services/Payables/supplier-payment-headers.service';

@Component({
  selector: 'app-voucher-records-ui',
  templateUrl: './voucher-records-ui.component.html',
  styleUrls: ['./voucher-records-ui.component.css']
})
export class VoucherRecordsUIComponent implements OnInit {
  voucherHeaders : any=[];
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
                          'Petty Cash'
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
  ];
  dateColumns       = [];
  defaultColumns    = ['VoucherDate','VoucherNo','TransNo', 'TransName','PayToName', 'PaymentType','Amount','VoucherStatus', 'RequestedBy', 'RecordStatus','InputByDateTime','InputBy',];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Amount'],
    intColumns: [],
    dateTimeColumns: ['InputByDateTime'],
    dateColumns: ['VoucherDate']
  };

  columnTypeMap: { [key: string]: string } = {};

  constructor(
    private dialog              : MatDialog,
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
    this.voucherHeaders = await firstValueFrom(this.voucherHeadersService.getVoucherHeadersByDateFromByDateToByTransName(
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      this.transName,
    ));
    if(this.voucherHeaders)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.voucherHeaders;
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
    this.selectedId = data.VoucherNo;
    this.selectedData = data;
  }


  async onClickEdit(){
    if(!this.matTableService.checkNull(this.selectedId)) return;


    var data = await firstValueFrom(this.voucherHeadersService.getVoucherHeaderByVoucherNo(this.selectedId));
    var receipt:any ={
      PayToId : data.PayToId,
      PayToName : data.PayToName,
      TransName : data.TransName,
      TransNo : data.TransNo,
      TableName : data.TableName,
      VoucherType : data.VoucherType,
      Amount : data.Amount,
      InvNo : data.InvNo,
      PaymentType : data.PaymentType,
      RequestedBy : data.RequestedBy,
      RequestedById : data.RequestedById,
      EditableTransNo : data.EditableTransNo,
      VoucherNo : data.VoucherNo,
    };
    if(data){
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1000px';
      dialogConfig.data        = ([receipt,data, 'updatevoucherfromrecords']);
      this.dialog.open(VoucherTransUIComponent,dialogConfig).beforeClosed().subscribe(x => {
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
          this.voucherHeadersService.updateVoucherRecordStatus(this.selectedId, action).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.populateChanges(res.voucherHeader);
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
          });
      }
    });
  }

  populateChanges(voucherHeader){
    this.selectedId  = null;
    this.selectedData = null;
    const voucherHeaderIndex = this.voucherHeaders.findIndex(detail => detail.VoucherNo === voucherHeader.VoucherNo);
    if (voucherHeaderIndex !== -1) {
      this.voucherHeaders[voucherHeaderIndex] = voucherHeader;  
    }
    this.displayRecords();
  }
  
    onClickPrint(){
      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printvoucherreceipts']));
      var data  = this.listData.filteredData;
      var title = this.transName.toUpperCase()+' PAYMENT VOUCHERS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
      this.printService.popupWindow(url, 'printvoucherreceipts', window, 800, 800);
      localStorage.setItem('Headers', JSON.stringify(data));
      localStorage.setItem('Title', title);
    }

    async onClickPrintReceipt(){
      if(!this.matTableService.checkNull(this.selectedId)) return;

      if(this.selectedData.TransName.toLowerCase() == 'purchasing'){
        var poHeader:any = await firstValueFrom(this.pOHeadersService.getPOHeaderByTransNo(this.selectedData.TransNo));
        var data:any = await firstValueFrom(this.pODetailsService.getOpenPODetailsByTransNo(this.selectedData.TransNo));
            data  = data.filter(x => x.RecordStatus == 'open');

        var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printpodetails']));
        var title = 'PO RECEIPT OF  - ' + poHeader.TransNo ;
        this.printService.popupWindow(url, 'poDetails', window, 800, 800);
        localStorage.setItem('Header', JSON.stringify(poHeader));
        localStorage.setItem('Voucher', JSON.stringify(this.selectedData));
        localStorage.setItem('Details', JSON.stringify(data));
        localStorage.setItem('Title', title);
        localStorage.setItem('TransNo', this.selectedData.TransNo);
      }
      if(this.selectedData.TransName.toLowerCase() == 'receiving'){
        var receivingHeader:any = await firstValueFrom(this.receivingHeadersService.getReceivingHeaderByTransNo(this.selectedData.TransNo));
        var data:any = await firstValueFrom(this.receivingDetailsService.getReceivingDetailsByTransNo(this.selectedData.TransNo));
            data  = data.filter(x => x.RecordStatus == 'open');

        var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printreceivingdetails']));
        var title = 'RECEIVING RECEIPT OF  - ' + receivingHeader.TransNo ;
        
        this.printService.popupWindow(url, 'receivingDetails', window, 800, 800);
        localStorage.setItem('Header', JSON.stringify(receivingHeader));
        localStorage.setItem('Voucher', JSON.stringify(this.selectedData));
        localStorage.setItem('Details', JSON.stringify(data));
        localStorage.setItem('Title', title);
        localStorage.setItem('TransNo', this.selectedData.TransNo);
      }

      if(this.selectedData.TransName.toLowerCase() == 'expenses'){
        var expenseHeader:any = await firstValueFrom(this.expenseHeadersService.getExpenseHeaderByTransNo(this.selectedData.TransNo));
        var data:any = await firstValueFrom(this.expenseDetailsService.getExpenseDetailsByTransNo(this.selectedData.TransNo));
            data  = data.filter(x => x.RecordStatus == 'open');

        var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printexpensedetails']));
        var title = 'EXPENSE RECEIPT OF  - ' + expenseHeader.TransNo ;
        
        this.printService.popupWindow(url, 'expenseDetails', window, 800, 800);
        localStorage.setItem('Header', JSON.stringify(expenseHeader));
        localStorage.setItem('Voucher', JSON.stringify(this.selectedData));
        localStorage.setItem('Details', JSON.stringify(data));
        localStorage.setItem('Title', title);
        localStorage.setItem('TransNo', this.selectedData.TransNo);
      }
      if(this.selectedData.TransName.toLowerCase() == 'payables'){
        var supplierPaymentHeader:any = await firstValueFrom(this.supplierPaymentHeadersService.getSupplierPaymentHeaderByTransNo(this.selectedData.TransNo));
        var data:any = await firstValueFrom(this.supplierPaymentDetailsService.getSupplierPaymentDetailsByTransNo(this.selectedData.TransNo));
            data  = data.filter(x => x.RecordStatus == 'open');

        var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsupplierpaymentdetails']));
        var title = 'SUPPLIER PAYMENT RECEIPT OF  - ' + supplierPaymentHeader.TransNo ;
        
        this.printService.popupWindow(url, 'supplierPaymentDetails', window, 800, 800);
        localStorage.setItem('Header', JSON.stringify(supplierPaymentHeader));
        localStorage.setItem('Voucher', JSON.stringify(this.selectedData));
        localStorage.setItem('Details', JSON.stringify(data));
        localStorage.setItem('Title', title);
        localStorage.setItem('TransNo', this.selectedData.TransNo);
      }

      if(this.selectedData.TransName.toLowerCase() == 'petty cash'){
        var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printvoucherreceipt']));
        var title = 'VOUCHER RECEIPT OF  - ' + this.selectedData.VoucherNo ;
        
        this.printService.popupWindow(url, 'printvoucherreceipt', window, 800, 800);
        localStorage.setItem('Voucher', JSON.stringify(this.selectedData));
        localStorage.setItem('Title', title);
        localStorage.setItem('TransNo', this.selectedData.VoucherNo);
      }
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
