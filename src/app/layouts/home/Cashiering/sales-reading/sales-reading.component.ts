import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CashCountsService } from 'src/app/services/Cashiering/cash-counts.service';
import { CashieringConfigService } from 'src/app/services/Cashiering/cashiering-config.service';
import { SaleReadingsService } from 'src/app/services/Cashiering/sale-readings.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-sales-reading',
  templateUrl: './sales-reading.component.html',
  styleUrls: ['./sales-reading.component.css']
})
export class SalesReadingComponent implements OnInit {
  data : any=[];
  saleReadings : any=[];
  cashReadings : any=[];
  config : any;
  isLoading       : boolean = false;
  loaded       : boolean = false;
  dateFrom        : any = new Date();
  dateTo          : any = new Date();
  title :any;
  withDate          : boolean = true;
  depositStatus : string = 'UnDeposited';
  text:string = 'Cash Readings';
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  toolButtons     = [
    {'Label'   : 'View','Function'                : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'               : () => this.onClickPrint(),'Disabled': true,}, 
  ];  
  toolButtons2     = [
 
  ];  
  contextButtons     = [
  ];
  defaultColumns1       = ['ReadingNo'];
  dateColumns       = ['TransDate'];
  dateTimeColumns   = ['StartDateTime', 'EndDateTime'];
  defaultColumns    = ['UserFullName'];
  numberColumns     = ['StartUpCash','CashIn', 'CashOut','TotalCash', 'PhysicalCash', 'Variance'];
  defaultColumns2   = ['MachineName', 'RecordStatus', 'DepositStatus'];
  addedColumns      = ['actions'];
  mergeColumns      = this.addedColumns.concat(this.defaultColumns1, this.dateTimeColumns, this.defaultColumns, this.numberColumns, this.defaultColumns2);
  saleReading: any;
  bills: any;
  cashierLedgers: any;
  bankDeposits: any;
  itemSales: any;
  itemSalesTotal: any;
  sales: any;
  paymentTypes: any;
  cashSalesBreakdown: any;
  chargeSalesBreakdown: any;
  checkSalesBreakdown: any;
  bankDepositSalesBreakdown: any;
  cashExpenseBreakdown: any;
  chargeExpenseBreakdown: any;
  checkExpenseBreakdown: any;
  bankDepositExpenseBreakdown: any;
  parameters:any;
  constructor(
    private dialog              : MatDialog,
    private saleReadingsService        : SaleReadingsService,
    private dateTimesService      : DateTimesService,
    private ref: ChangeDetectorRef,
    private printService        : PrintService,
    private router              : Router,
    private notificationService : NotificationService,
  ) { }

  async ngOnInit(): Promise<void> {
  }


  async onClickView(){
    this.isLoading = true;
    this.loaded = false;


    this.data = await firstValueFrom(this.saleReadingsService.getSalesReadingByDateFromByDateTo(
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
    ));
    if(this.data)
      this.isLoading = false;

    this.saleReadings = this.data['saleReadings'];
    this.cashReadings = this.data['cashReadings'];
    
    this.bills = this.data['bills'];
    this.cashierLedgers = this.data['cashierLedgers'];
    this.bankDeposits = this.data['bankDeposits'];
    this.itemSales = this.data['itemSales'];
    this.itemSalesTotal = this.data['itemSalesTotal'];
    this.sales = this.data['sales'];
    this.paymentTypes = this.data['paymentTypes'];

    this.displayRecords();
    this.loaded = true;
  }

  displayRecords(){
      this.title  = 'SALES READING REPORTS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;

    // Breakdown Filters
      this.cashSalesBreakdown = this.cashierLedgers
      .filter(x => x.PaymentType.toLowerCase() === "cash" && x.Debit > 0);

      this.chargeSalesBreakdown = this.cashierLedgers
      .filter(x => x.PaymentType.toLowerCase() === "charge" && x.Debit > 0);

      this.checkSalesBreakdown = this.cashierLedgers
      .filter(x => x.PaymentType.toLowerCase() === "check" && x.Debit > 0);

      this.bankDepositSalesBreakdown = this.cashierLedgers
      .filter(x => x.PaymentType.toLowerCase() === "bank deposit" && x.Debit > 0);

      this.cashExpenseBreakdown = this.cashierLedgers
      .filter(x => x.PaymentType.toLowerCase() === "cash" && x.Credit > 0);

      this.chargeExpenseBreakdown = this.cashierLedgers
      .filter(x => x.PaymentType.toLowerCase() === "charge" && x.Credit > 0);

      this.checkExpenseBreakdown = this.cashierLedgers
      .filter(x => x.PaymentType.toLowerCase() === "check" && x.Credit > 0);

      this.bankDepositExpenseBreakdown = this.cashierLedgers
      .filter(x => x.PaymentType.toLowerCase() === "bank deposit" && x.Credit > 0);

      // Payment Types
      this.paymentTypes = this.getSumPaymentTypes();
      this.paymentTypes.TotalAmountIn =
        +this.paymentTypes.CashIn +
        +this.paymentTypes.ChargeIn +
        +this.paymentTypes.CheckIn +
        +this.paymentTypes.BankDepositIn;

      this.paymentTypes.TotalAmountOut =
          +this.paymentTypes.CashOut +
          +this.paymentTypes.ChargeOut +
          +this.paymentTypes.CheckOut +
          +this.paymentTypes.BankDepositOut;

    this.parameters = this.getParameters();


  }

   getSumPaymentTypes() {
    return {
      CashIn: +this.cashSalesBreakdown.reduce((sum, x) => sum + +x.Debit, 0),
      ChargeIn: +this.chargeSalesBreakdown.reduce((sum, x) => sum + +x.Debit, 0),
      CheckIn: +this.checkSalesBreakdown.reduce((sum, x) => sum + +x.Debit, 0),
      BankDepositIn: +this.bankDepositSalesBreakdown.reduce((sum, x) => sum + +x.Debit, 0),
      CashOut: +this.cashExpenseBreakdown.reduce((sum, x) => sum + +x.Credit, 0),
      ChargeOut: +this.chargeExpenseBreakdown.reduce((sum, x) => sum + +x.Credit, 0),
      CheckOut: +this.checkExpenseBreakdown.reduce((sum, x) => sum + +x.Credit, 0),
      BankDepositOut: +this.bankDepositExpenseBreakdown.reduce((sum, x) => sum + +x.Credit, 0)
    };
  }

  getParameters() {
    return {
      tBills : +this.bills.reduce((sum, x) => sum + +x.Amount, 0),
      tBankDepositTypes : +this.bankDeposits.reduce((sum, x) => sum + +x.Amount, 0),
      tItemSalesTotal : +this.itemSales.reduce((sum, x) => sum + +x.Amount, 0),
      tStartUpCash : +this.saleReadings.reduce((sum, x) => sum + +x.StartUpCash, 0),
      tAmountIn : +this.saleReadings.reduce((sum, x) => sum + +x.AmountIn, 0),
      tAmountOut : +this.saleReadings.reduce((sum, x) => sum + +x.AmountOut, 0),
      tNetAmount : +this.saleReadings.reduce((sum, x) => sum + +x.NetAmount, 0),
      tCashSales : +this.paymentTypes.CashIn,
      tChargeSales : +this.paymentTypes.ChargeIn,
      tCheckSales : +this.paymentTypes.CheckIn,
      tBankDepositSales : +this.paymentTypes.BankDepositIn,
      tCashExpense : +this.paymentTypes.CashOut,
      tChargeExpense : +this.paymentTypes.ChargeOut,
      tCheckExpense : +this.paymentTypes.CheckOut,
      tBankDepositExpense : +this.paymentTypes.BankDepositOut,
    };
}

  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsalereadingdetails']));
    this.printService.popupWindow(url, 'printsalereadingdetails', window, 800, 800);
    localStorage.setItem('saleReadings', JSON.stringify(this.saleReadings));
    localStorage.setItem('cashReadings', JSON.stringify(this.cashReadings));
    localStorage.setItem('bills', JSON.stringify(this.bills));
    localStorage.setItem('cashierLedgers', JSON.stringify(this.cashierLedgers));
    localStorage.setItem('bankDeposits', JSON.stringify(this.bankDeposits));
    localStorage.setItem('itemSales', JSON.stringify(this.itemSales));
    localStorage.setItem('itemSalesTotal', JSON.stringify(this.itemSalesTotal));
    localStorage.setItem('sales', JSON.stringify(this.sales));
    localStorage.setItem('paymentTypes', JSON.stringify(this.paymentTypes));
    localStorage.setItem('parameters', JSON.stringify(this.parameters));

    localStorage.setItem('cashSalesBreakdown', JSON.stringify(this.cashSalesBreakdown));
    localStorage.setItem('chargeSalesBreakdown', JSON.stringify(this.chargeSalesBreakdown));
    localStorage.setItem('checkSalesBreakdown', JSON.stringify(this.checkSalesBreakdown));
    localStorage.setItem('bankDepositSalesBreakdown', JSON.stringify(this.bankDepositSalesBreakdown));
    localStorage.setItem('cashExpenseBreakdown', JSON.stringify(this.cashExpenseBreakdown));
    localStorage.setItem('chargeExpenseBreakdown', JSON.stringify(this.chargeExpenseBreakdown));
    localStorage.setItem('checkExpenseBreakdown', JSON.stringify(this.checkExpenseBreakdown));
    localStorage.setItem('bankDepositExpenseBreakdown', JSON.stringify(this.bankDepositExpenseBreakdown));

    localStorage.setItem('Title', this.title);
  }

}
