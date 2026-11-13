import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { CustomersService } from 'src/app/services/Files/customers.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { SaleReturnDetailsService } from 'src/app/services/SaleReturn/sale-return-details.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { AccountingEntryUIComponent } from '../../Accounting/accounting-entry-ui/accounting-entry-ui.component';
import { HomeComponent } from '../../home.component';
import { SaleReturnDetailsUIComponent } from '../sale-return-details-ui/sale-return-details-ui.component';
import { SaleReturnHeadersService } from 'src/app/services/SaleReturn/sale-return-headers.service';
import { SaleReturnHeaderUIComponent } from '../sale-return-header-ui/sale-return-header-ui.component';
import { LoadItemsForSaleReturnUIComponent } from '../load-items-for-sale-return-ui/load-items-for-sale-return-ui.component';
import { SaleReturnConfigService } from 'src/app/services/SaleReturn/sale-return-config.service';
import { SalesConfigPerMachineService } from 'src/app/services/Sales/sales-config-per-machine.service';
import { SaleConfigService } from 'src/app/services/Sales/sale-config.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sale-return-receipts',
  templateUrl: './sale-return-receipts.component.html',
  styleUrls: ['./sale-return-receipts.component.css']
})
export class SaleReturnReceiptsComponent implements OnInit {

  saleReturnHeaders : any=[];
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
  ];
  defaultColumns    = ['TransDate','TransNo', 'CustomerName','TotalDue','PaymentType','InputByDateTime','InputBy', 'RecordStatus','ReadingNo'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['TotalDue'],
    intColumns: [],
    dateTimeColumns: ['InputByDateTime'],
    dateColumns: ['TransDate']
  };

  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private saleReturnHeadersService        : SaleReturnHeadersService,
    private saleReturnDetailsService        : SaleReturnDetailsService,
    private saleReturnConfigService   : SaleReturnConfigService,
    private customersService        : CustomersService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService      : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
    private notificationService : NotificationService,
    private viewContainerRef : ViewContainerRef,
    private salesConfigPerMachineService : SalesConfigPerMachineService,
    private saleConfigService : SaleConfigService,
    private authService : AuthService,
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
    this.saleReturnHeaders = await firstValueFrom(this.saleReturnHeadersService.getSaleReturnHeadersByDateFromByDateTo(
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))
    ));
    if(this.saleReturnHeaders)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.saleReturnHeaders;
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
    this.dialog.open(SaleReturnDetailsUIComponent,dialogConfig).beforeClosed().subscribe(x => {
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
      this.dialog.open(SaleReturnDetailsUIComponent,dialogConfig).beforeClosed().subscribe(x => {
        this.onClickView();
    });
  }

  async onClickEdit(){
    if(!this.matTableService.checkNull(this.selectedId)) return;


    var data = await firstValueFrom(this.saleReturnHeadersService.getSaleReturnHeaderByTransNo(this.selectedId));
    var customer = await firstValueFrom(this.customersService.getCustomerByCustomerId(this.selectedData.CustomerId));
    var refundable:any = await firstValueFrom(this.saleReturnHeadersService.computeRefundable(this.selectedData.TransCode));

    if(data && customer){
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1000px';
    dialogConfig.data = ([customer,data, data.TransNo, data.TotalAmount, 'open','updatesalereturnheader', refundable]);
      this.dialog.open(SaleReturnHeaderUIComponent,dialogConfig).beforeClosed().subscribe(x => {
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
        this.saleReturnHeadersService.updateSaleReturnRecordStatus(this.selectedId, action).subscribe({
          next:(res)=>{
            this.notificationService.toastrSuccess(res.message);
            this.populateChanges(res.saleReturnHeader);
          },
          error:(err)=>{
            this.notificationService.toastrError(err.error.message);
          },
        });
      }
    });
  }

  populateChanges(saleReturnHeader){
    this.selectedId  = null;
    this.selectedData = null;
    const saleReturnHeaderIndex = this.saleReturnHeaders.findIndex(detail => detail.TransNo === saleReturnHeader.TransNo);
    if (saleReturnHeaderIndex !== -1) {
      this.saleReturnHeaders[saleReturnHeaderIndex] = saleReturnHeader;  
    }
    this.displayRecords();
  }

  async onClickAddItem(){
     if (!this.matTableService.CommonTransaction()) {
      return;
    }
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var data = await firstValueFrom(this.saleReturnHeadersService.getSaleReturnHeaderByTransNo(this.selectedId));

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1500px';
    dialogConfig.data         = ([data.TransCode, data.CustomerId,data, 'salereturnreceipts']);
    this.dialog.open(LoadItemsForSaleReturnUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      if(x){
        this.populateChanges(x);
      } 
    });
  }

  onClickAccountingEntry(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var indexTables: any ={
      'AccountTitleTable' : 'saleaccounttitles',
      'TransactionTable' : 'SaleReturnHeaders',
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
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsalereturnreceipts']));
    var data  = this.listData.filteredData;
    var title = 'SALE RETURN RECEIPTS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'PrintSaleReceipts', window, 800, 800);
    localStorage.setItem('Headers', JSON.stringify(data));
    localStorage.setItem('Title', title);
  }

  // Desktop SaleReturnDetailsUI.PrintReceipt: re-print the POS receipt (BIR or not by this machine) and/or the
  // ordinary receipt, as Sales Config per machine > Printer says
  async onClickPrintReceipt(){
     if(!this.matTableService.checkNull(this.selectedId)) return;

    var perMachine:any = await firstValueFrom(this.salesConfigPerMachineService.getSaleConfigPerMachineByComputerName(this.authService.UserAccount.ComputerName));
    var printer = (perMachine?.Printer || 'pos').toLowerCase();
    if (printer != 'ordinary') {
      var receipt:any = await firstValueFrom(this.saleReturnHeadersService.getSaleReturnReceiptForPrint(this.selectedData.TransNo));
      var saleConfig:any = await firstValueFrom(this.saleConfigService.getSaleConfig());
      var posUrl = this.router.serializeUrl(this.router.createUrlTree([receipt.birRegistered ? 'print/printposbir' : 'print/printpos']));
      this.printService.openPOSReceipt(posUrl, window, {
        'Header': receipt.saleReturnHeader, 'Details': receipt.saleReturnDetails, 'Discounts': [], 'Config': saleConfig,
        'machinePermit': receipt.machinePermit, 'vendorPermit': receipt.vendorPermit, 'ReceiptType': 'salereturn', 'Reprint': 'true',
      });
      if (printer == 'pos') return;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    var saleReturnHeader = await firstValueFrom(this.saleReturnHeadersService.getSaleReturnHeaderByTransNo(this.selectedData.TransNo));
    var saleReturnDetails = await firstValueFrom(this.saleReturnDetailsService.getSaleReturnDetailsByTransNo(this.selectedData.TransNo));
    var saleReturnConfig = await firstValueFrom(this.saleReturnConfigService.getSaleReturnConfig());

    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsalereturndetails']));
    var data  = saleReturnDetails.filter(x =>x.TransNo == this.selectedData.TransNo && x.RecordStatus == 'open');
    var title = 'SALES RETURN RECEIPT OF  - ' + saleReturnHeader.TransNo ;
    
    this.printService.popupWindow(url, 'saleReturnDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(saleReturnHeader));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('SaleReturnConfig', JSON.stringify(saleReturnConfig));
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
