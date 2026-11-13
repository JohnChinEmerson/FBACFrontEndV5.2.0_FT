import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { PrintService } from 'src/app/services/print.service';
import { SaleDetailsService } from 'src/app/services/Sales/sale-details.service';
import { SaleHeadersService } from 'src/app/services/Sales/sale-headers.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { SaleDetailsUIComponent } from '../sale-details-ui/sale-details-ui.component';
import { firstValueFrom } from 'rxjs';
import { SaleHeaderUIComponent } from '../sale-header-ui/sale-header-ui.component';
import { CustomersService } from 'src/app/services/Files/customers.service';
import { NotificationService } from 'src/app/services/notification.service';
import { VoidReasonUIComponent } from '../void-reason-ui/void-reason-ui.component';
import { LoadItemsForSaleUIComponent } from '../load-items-for-sale-ui/load-items-for-sale-ui.component';
import { AccountingEntryUIComponent } from '../../Accounting/accounting-entry-ui/accounting-entry-ui.component';
import { OrderHeadersService } from 'src/app/services/Orders/order-headers.service';
import { AuthService } from 'src/app/services/auth.service';
import { MultiplePaymentUIComponent } from '../../MultiplePayments/multiple-payment-ui/multiple-payment-ui.component';
import { SharedMultiplePaymentHeadersService } from 'src/app/services/MultiplePayments/shared-multiple-payment-headers.service';
import { MultiplePaymentHeadersService } from '../../../../services/MultiplePayments/multiple-payment-headers.service';
import { SaleConfigService } from 'src/app/services/Sales/sale-config.service';
import { MachinePermitsService } from 'src/app/services/Config/machine-permits.service';
import { VendorPermitsService } from '../../../../services/Config/vendor-permits.service';
import { SalesConfigPerMachineService } from 'src/app/services/Sales/sales-config-per-machine.service';

@Component({
  selector: 'app-sales-receipts',
  templateUrl: './sales-receipts.component.html',
  styleUrls: ['./sales-receipts.component.css']
})
export class SalesReceiptsComponent implements OnInit {
  saleHeaders : any=[];
  oHeader:any;
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  dateFrom        : any = new Date();
  dateTo          : any = new Date();
  saleconfigPerMachine:any=[];
  saleConfig:any=[];
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
    {'Label'   : 'Multiple Payment','Function'            : () => this.onClickMultiplePayment(),'Disabled': true,}, 
    {'Label'   : 'Accounting Entry','Function'    : () => this.onClickAccountingEntry(),'Disabled': true,}, 
  ];
  defaultColumns    = ['TransDate','TransNo', 'CustomerName','TotalDue','PaymentType','InputByDateTime','InputBy', 'RecordStatus', 'PaidStatus', 'ReadingNo', 'InvNo', 'SINo'];

  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['TotalDue'],
    intColumns: [],
    dateTimeColumns: ['InputByDateTime'],
    dateColumns: ['TransDate']
  };
  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private saleHeadersService        : SaleHeadersService,
    private saleDetailsService        : SaleDetailsService,
    private saleConfigService        : SaleConfigService,
    private orderHeadersService        : OrderHeadersService,
    private customersService        : CustomersService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService      : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
    private notificationService : NotificationService,
    private sharedMultiplePaymentHeadersService : SharedMultiplePaymentHeadersService,
    private multiplePaymentHeadersService : MultiplePaymentHeadersService,
    private auth_service : AuthService,
    private machinePermitsService : MachinePermitsService,
    private vendorPermitsService : VendorPermitsService,
    private salesConfigPerMachineService : SalesConfigPerMachineService, 
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
    this.saleHeaders = await firstValueFrom(this.saleHeadersService.getSaleHeadersByDateFromByDateTo(
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))
    ));
    if(this.saleHeaders)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.saleHeaders;
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
    this.dialog.open(SaleDetailsUIComponent,dialogConfig).beforeClosed().subscribe(x => {
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
    this.dialog.open(SaleDetailsUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      this.onClickView();
    });
  }

  async onClickEdit(){
    if(!this.matTableService.checkNull(this.selectedId)) return;


    var data = await firstValueFrom(this.saleHeadersService.getSaleHeaderByTransNo(this.selectedId));
    var customer = await firstValueFrom(this.customersService.getCustomerByCustomerId(this.selectedData.CustomerId));
    if(this.selectedData.OrderNo != null || this.selectedData.OrderNo != 0){
      this.oHeader = await firstValueFrom(this.orderHeadersService.getOrderHeaderByTransNo(this.selectedData.OrderNo));
    }

    if(data && customer){
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1000px';
      dialogConfig.data = ([customer,data, data.TransNo,data.TotalAmount,this.oHeader, 'open','updatesaleheader', data.AmountPaid]);
      this.dialog.open(SaleHeaderUIComponent,dialogConfig).beforeClosed().subscribe(x => {
        if(x){
          this.populateChanges(x);
        }
      });
    }
  }

  onClickVoid(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    // Desktop SaleReceiptsUI: a BIR machine voids too, issuing a VOID no. and printing the VOIDED SALES receipt
    var action = this.selectedData?.RecordStatus == 'open' ? 'void' : 'open';
    this.notificationService.popupWarning(action.toUpperCase()+" Record","All Items  under " + this.selectedId + " will be " + action.toUpperCase () + ". Continue?").then(async (result) => {
      if (result.value) {
        var data = await firstValueFrom(this.saleHeadersService.getSaleHeaderByTransNo(this.selectedId));

        if(action == 'open'){
          this.saleHeadersService.updateSaleRecordStatus(this.selectedId, action).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.populateChanges(res.saleHeader);
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
          });
        }else{
          const dialogConfig        = new MatDialogConfig();
          dialogConfig.disableClose = true;
          dialogConfig.autoFocus    = true;
          dialogConfig.width        = '500px';
          dialogConfig.data = ([data, data.TransNo]);
          this.dialog.open(VoidReasonUIComponent,dialogConfig).beforeClosed().subscribe(x => {
            if(x){
              this.saleHeadersService.updateSaleRecordStatus(data.TransNo, action).subscribe({
                next:(res)=>{
                  this.notificationService.toastrSuccess(res.message);
                  if (res.printVoid)
                    this.printPOS(res.saleHeader, res.saleDetails, res.discountApplications, res.machinePermit, res.vendorPermit, 'void', false);
                  this.populateChanges(res.saleHeader);
                },
                error:(err)=>{
                  this.notificationService.toastrError(err.error?.message ?? err.error);
                },
              });
            } 
          });
        }
       
      }
    });
  }

  populateChanges(saleHeader){
    this.selectedId  = null;
    this.selectedData = null;
    const saleHeaderIndex = this.saleHeaders.findIndex(detail => detail.TransNo === saleHeader.TransNo);
    if (saleHeaderIndex !== -1) {
      this.saleHeaders[saleHeaderIndex] = saleHeader;  
    }
    this.displayRecords();
  }

  async onClickAddItem(){
     if (!this.matTableService.CommonTransaction()) {
      return;
    }
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var data = await firstValueFrom(this.saleHeadersService.getSaleHeaderByTransNo(this.selectedId));

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1500px';
    dialogConfig.data         = ([data.TransNo, data.CustomerId,data, 'salereceipts']);
    this.dialog.open(LoadItemsForSaleUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      if(x){
        this.populateChanges(x);
      } 
    });
  }

  async onClickMultiplePayment(){
    if(!this.matTableService.checkNull(this.selectedId)) return;
    
    if(this.selectedData.PaymentType.toLowerCase() != 'multiple') 
        return this.notificationService.toastrWarning("PaymentType is not MULTIPLE.");

    var saleHeader:any = await firstValueFrom(this.saleHeadersService.getSaleHeaderByTransNo(this.selectedId));
    var data:any = {
      'CustomerId' : saleHeader.CustomerId,
      'CustomerName' : saleHeader.CustomerName,
      'ContactNo' : saleHeader.ContactNo,
      'Address' : saleHeader.Address,
      'CustomerTIN' : saleHeader.CustomerTIN,
      'BusinessStyle' : saleHeader.BusinessStyle,
      'TransName' : "Item Sales",
      'SourceTransName' : "Item Sales",
      'TransNo' : saleHeader.TransNo,
      'TransCode' : saleHeader.TransNo,
      'TransDate' : this.dateTimesService.ConvertToDateFormat(new Date( saleHeader.TransDate)),
      'VATType' : saleHeader.VATType,
      'TotalDue' : saleHeader.TotalDue,
      'AmountPaid' : saleHeader.AmountPaid,
    };

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = ([data, 'salesreceipt', 'Save', null, 'Update']);
    this.dialog.open(MultiplePaymentUIComponent,dialogConfig).beforeClosed().subscribe(async x => {
      if(x){
         this.multiplePaymentHeadersService.updateMultiplePaymentHeaderFromReceipt(saleHeader.TransNo, saleHeader.TransNo, 'item sales').subscribe({
          next:(res)=>{
       
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
      'AccountTitleTable' : 'saleaccounttitles',
      'TransactionTable' : 'saleheaders',
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
      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsalereceipts']));
      var data  = this.listData.filteredData;
      var title = 'SALES RECEIPTS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
      this.printService.popupWindow(url, 'PrintSaleReceipts', window, 800, 800);
      localStorage.setItem('Headers', JSON.stringify(data));
      localStorage.setItem('Title', title);
    }

    async onClickPrintReceipt(){
      if(!this.matTableService.checkNull(this.selectedId)) return;

      // Desktop SaleDetailsUI.PrintReceipt: re-print (a voided sale prints with the VOID watermark)
      try {
        var receipt:any = await firstValueFrom(this.saleHeadersService.getSaleReceiptForPrint(this.selectedData.TransNo));
      } catch (err:any) {
        return this.notificationService.toastrError(err.error?.message);
      }
      this.saleConfig = await firstValueFrom(this.saleConfigService.getSaleConfig());
      this.saleconfigPerMachine = await firstValueFrom(this.salesConfigPerMachineService.getSaleConfigPerMachineByComputerName(this.auth_service.UserAccount.ComputerName));

      this.print(receipt);

      // if(saleHeader.PaymentType.toLowerCase() == 'multiple')
      //   var mpHeaders= await firstValueFrom(this.multiplePaymentHeadersService.getMultiplePaymentsBySourceTransCode(saleHeader.TransNo));
      // else
      //   mpHeaders = null;

      // var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsaledetails']));
      // var data  = saleDetails.filter(x =>x.TransNo == this.selectedData.TransNo && x.RecordStatus == 'open');
      // var title = 'SALES INVOICE OF  - ' + saleHeader.TransNo ;
      
      // this.printService.popupWindow(url, 'saleDetails', window, 800, 800);
      // localStorage.setItem('Header', JSON.stringify(saleHeader));
      // localStorage.setItem('MPHeader', JSON.stringify(mpHeaders));
      // localStorage.setItem('Details', JSON.stringify(data));
      // localStorage.setItem('SaleConfig', JSON.stringify(saleConfig));
      // localStorage.setItem('Title', title);
      // localStorage.setItem('TransNo', this.selectedData.TransNo);
    }

    async print(receipt) {
      var saleHeader = receipt.saleHeader;
      var saleDetails = receipt.saleDetails;
      if ((this.saleconfigPerMachine.Printer || '').toLowerCase() == 'both') {
        this.printPOS(saleHeader, saleDetails, receipt.discountApplications, receipt.machinePermit, receipt.vendorPermit, 'sale', true);
        await this.delay(1000);
        await this.printOrdinary(saleHeader, saleDetails);
      }
      if((this.saleconfigPerMachine.Printer || '').toLowerCase() == 'pos'){
        this.printPOS(saleHeader, saleDetails, receipt.discountApplications, receipt.machinePermit, receipt.vendorPermit, 'sale', true);
      }
      if((this.saleconfigPerMachine.Printer || '').toLowerCase() == 'ordinary'){
        this.printOrdinary(saleHeader,saleDetails);
      }
    }

    // receiptType 'sale' (POSPrintBIR / POSPrint) or 'void' (POSPrintVoid); reprint adds the desktop **REPRINT**
    async printPOS(saleHeader, saleDetails, discounts, machinePermit, vendorPermit, receiptType: string, reprint: boolean){
      if (!this.saleConfig || !this.saleConfig.id)
        this.saleConfig = await firstValueFrom(this.saleConfigService.getSaleConfig());
      var bir = (saleHeader.BIRRegistered || '').toLowerCase() == "yes" || receiptType == 'void';
      var url = this.router.serializeUrl(this.router.createUrlTree([bir ? 'print/printposbir' : 'print/printpos']));
      localStorage.setItem('Header', JSON.stringify(saleHeader));
      localStorage.setItem('Details', JSON.stringify(saleDetails));
      localStorage.setItem('Discounts', JSON.stringify(discounts || []));
      localStorage.setItem('machinePermit', JSON.stringify(machinePermit));
      localStorage.setItem('vendorPermit', JSON.stringify(vendorPermit));
      localStorage.setItem('Config', JSON.stringify(this.saleConfig));
      localStorage.setItem('Title', bir ? 'SALES INVOICE' : 'SALES RECEIPT');
      localStorage.setItem('ReceiptType', receiptType);
      localStorage.setItem('Reprint', reprint ? 'true' : 'false');
      this.printService.popupWindow(url, 'POSPrint', window, 1000, 700);
    }
  
    async printOrdinary(saleHeader,saleDetails ){
      if(saleHeader.PaymentType.toLowerCase() == 'multiple')
        var mpHeaders= await firstValueFrom(this.multiplePaymentHeadersService.getMultiplePaymentsBySourceTransCode(saleHeader.TransNo));
      else
        mpHeaders = null;
  
      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsaledetails']));
      var data  = saleDetails.filter(x =>x.TransNo == saleHeader.TransNo && x.RecordStatus == 'open');
      var title = 'SALES INVOICE OF  - ' + saleHeader.TransNo ;
      
      this.printService.popupWindow(url, 'saleDetails', window, 800, 800);
      localStorage.setItem('Header', JSON.stringify(saleHeader));
      localStorage.setItem('MPHeader', JSON.stringify(mpHeaders));
      localStorage.setItem('Details', JSON.stringify(data));
      localStorage.setItem('SaleConfig', JSON.stringify(this.saleConfig));
      localStorage.setItem('Title', title);
      localStorage.setItem('TransNo', saleHeader.TransNo);
    }
  
    delay(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
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
