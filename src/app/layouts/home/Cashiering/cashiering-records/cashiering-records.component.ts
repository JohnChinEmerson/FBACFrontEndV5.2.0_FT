import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CashDrawersService } from 'src/app/services/Cashiering/cash-drawers.service';
import { SaleReadingsService } from 'src/app/services/Cashiering/sale-readings.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { CashLedgerUIComponent } from '../cash-ledger-ui/cash-ledger-ui.component';
import { CashDrawerUIComponent } from '../cash-drawer-ui/cash-drawer-ui.component';
import { CashReadingRecordsUIComponent } from '../cash-reading-records-ui/cash-reading-records-ui.component';
import { CashCountsService } from 'src/app/services/Cashiering/cash-counts.service';
import { CashLedgersService } from 'src/app/services/Cashiering/cash-ledgers.service';
import { ItemSalesService } from 'src/app/services/Cashiering/item-sales.service';

@Component({
  selector: 'app-cashiering-records',
  templateUrl: './cashiering-records.component.html',
  styleUrls: ['./cashiering-records.component.css']
})
export class CashieringRecordsComponent implements OnInit {

  saleReadings : any=[];
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
    {'Label'   : 'Cash Readings','Function'               : () => this.onClickCashReadings('Cash Readings'),'Disabled': true,}, 
  ];  
  toolButtons2     = [
    {'Label'   : 'View Ledger','Function'        : () => this.onClickViewLedger(),'Disabled': true,}, 
    {'Label'   : 'Reading Details','Function'    : () => this.onClickViewReadingDetails(),'Disabled': true,}, 
  ];  
  contextButtons     = [
    {'Label'   : 'CashDrawer','Function'                : () => this.onClickCashDrawer(),'Disabled': true,}, 
  ];
  defaultColumns   = [ 'ReadingNo','TransDate','StartDateTime', 'EndDateTime','UserFullName','StartUpCash','AmountIn', 'AmountOut','NetAmount','MachineName', 'RecordStatus'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['StartUpCash','AmountIn', 'AmountOut','NetAmount'],
    intColumns: [],
    dateTimeColumns: ['StartDateTime', 'EndDateTime'],
    dateColumns: ['TransDate']
  };
  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private cashDrawersService        : CashDrawersService,
    private saleReadingsService        : SaleReadingsService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService      : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
    private cashCountsService : CashCountsService,
    private cashLedgerService : CashLedgersService,
    private itemSalesService : ItemSalesService,
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
    this.saleReadings = await firstValueFrom(this.saleReadingsService.getSaleReadingByDateFromByDateTo(
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))
    ));
    if(this.saleReadings)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.saleReadings;
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
    this.selectedId = data.ReadingNo;
    this.selectedData = data;
  }
  onClickCashReadings(text){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '2000px';
    dialogConfig.data         = text;
    this.dialog.open(CashReadingRecordsUIComponent,dialogConfig);
  }

  async onClickViewLedger(){
    var cashDrawer:any = await firstValueFrom(this.cashDrawersService.getCashDrawerByReadingNo(this.selectedId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1500px';
    dialogConfig.data         = ([cashDrawer, 'ALL']);
    this.dialog.open(CashLedgerUIComponent,dialogConfig);

  }

 async onClickViewReadingDetails(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printcashieringrecorddetails']));

    var cashDrawer:any =await firstValueFrom(this.cashDrawersService.getCashDrawerByReadingNo(this.selectedData.ReadingNo)); 
    var cashIns:any =await firstValueFrom(this.cashDrawersService.getTotalAmountIn(this.selectedData.ReadingNo, "CASH")); 
    var cashOuts:any =await firstValueFrom(this.cashDrawersService.getTotalAmountOut(this.selectedData.ReadingNo, "CASH")); 
    var bills:any  = await firstValueFrom(this.cashCountsService.getDenominationsByReadingNo(this.selectedData.ReadingNo));
    var cashierLedgers:any = await firstValueFrom(this.cashLedgerService.getReceiptsByReadingNoByPaymentTypeByRecordStatusByAmountColumn(this.selectedData.ReadingNo, 'All', "open", "All"));


    var cashSalesBreakdown:any = cashierLedgers.filter(x => x.PaymentType.toLowerCase() == "cash" && x.Debit > 0);
    var chargeSalesBreakdown:any = cashierLedgers.filter(x => x.PaymentType.toLowerCase() == "charge" && x.Debit > 0);
    var checkSalesBreakdown:any = cashierLedgers.filter(x => x.PaymentType.toLowerCase() == "check" && x.Debit > 0);
    var bankDepositSalesBreakdown:any = cashierLedgers.filter(x => x.PaymentType.toLowerCase() == "bank deposit" && x.Debit > 0);

    var cashExpenseBreakdown:any = cashierLedgers.filter(x => x.PaymentType.toLowerCase() == "cash" && x.Credit > 0);
    var chargeExpenseBreakdown:any = cashierLedgers.filter(x => x.PaymentType.toLowerCase() == "charge" && x.Credit > 0);
    var checkExpenseBreakdown:any = cashierLedgers.filter(x => x.PaymentType.toLowerCase() == "check" && x.Credit > 0);
    var bankDepositExpenseBreakdown:any = cashierLedgers.filter(x => x.PaymentType.toLowerCase() == "bank deposit" && x.Credit > 0);

    var sales:any = await firstValueFrom(this.cashDrawersService.getSalesByPaymentTypes(this.selectedData.ReadingNo));  
    var bankDeposits:any = await firstValueFrom(this.cashDrawersService.getSalesBreakdownBankDeposits(this.selectedData.ReadingNo));  
    var itemSales:any = await firstValueFrom(this.itemSalesService.getItemSaleDetailsByReadingNo(this.selectedData.ReadingNo));  
    var itemSalesTotal:any = await firstValueFrom(this.itemSalesService.getItemSalesTotalByReadingNo(this.selectedData.ReadingNo));  

    var title = 'SALES READING DETAILS';
    this.printService.popupWindow(url, 'printcashreading', window, 800, 800);
    localStorage.setItem('cashDrawer', JSON.stringify(cashDrawer));
    localStorage.setItem('cashIns', JSON.stringify(cashIns));
    localStorage.setItem('cashOuts', JSON.stringify(cashOuts));
    localStorage.setItem('bills', JSON.stringify(bills));
    localStorage.setItem('cashSalesBreakdown', JSON.stringify(cashSalesBreakdown));
    localStorage.setItem('chargeSalesBreakdown', JSON.stringify(chargeSalesBreakdown));
    localStorage.setItem('checkSalesBreakdown', JSON.stringify(checkSalesBreakdown));
    localStorage.setItem('bankDepositSalesBreakdown', JSON.stringify(bankDepositSalesBreakdown));
    localStorage.setItem('cashExpenseBreakdown', JSON.stringify(cashExpenseBreakdown));
    localStorage.setItem('chargeExpenseBreakdown', JSON.stringify(chargeExpenseBreakdown));
    localStorage.setItem('checkExpenseBreakdown', JSON.stringify(checkExpenseBreakdown));
    localStorage.setItem('bankDepositExpenseBreakdown', JSON.stringify(bankDepositExpenseBreakdown));
    localStorage.setItem('sales', JSON.stringify(sales));
    localStorage.setItem('bankDeposits', JSON.stringify(bankDeposits));
    localStorage.setItem('itemSales', JSON.stringify(itemSales));
    localStorage.setItem('itemSalesTotal', JSON.stringify(itemSalesTotal));
    localStorage.setItem('Title', title);
  }

  

  async onClickCashDrawer(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    dialogConfig.data        = (['cashieringrecords',null, this.selectedData]);
    this.dialog.open(CashDrawerUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      this.onClickView();
      if(x){
        this.populateChanges(x);
      }
    });

  }

  populateChanges(saleReadings){
    this.selectedId  = null;
    this.selectedData = null;
    const saleHeaderIndex = this.saleReadings.findIndex(detail => detail.ReadingNo === saleReadings.ReadingNo);

    if (saleHeaderIndex !== -1) {
      this.saleReadings[saleHeaderIndex] = saleReadings;  
    }
    this.displayRecords();
  }
  
  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsalereadings']));
    var data  = this.listData.filteredData;
    var title = 'SALES READINGS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'printsalereadings', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data));
    localStorage.setItem('Title', title);
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
