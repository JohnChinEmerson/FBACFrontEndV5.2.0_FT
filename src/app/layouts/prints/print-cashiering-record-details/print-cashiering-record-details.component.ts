import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-print-cashiering-record-details',
  templateUrl: './print-cashiering-record-details.component.html',
  styleUrls: ['./print-cashiering-record-details.component.css']
})
export class PrintCashieringRecordDetailsComponent implements OnInit {

  printResult: string | null = null;
  cashDrawer:any;
  cashIns:any;
  cashOuts:any;
  bills:any;
  businessInfo: any;
  Title: any;
  cashSalesBreakdown: any;
  checkSalesBreakdown: any;
  chargeSalesBreakdown: any;
  bankDepositSalesBreakdown: any;
  cashExpenseBreakdown: any;
  chargeExpenseBreakdown: any;
  checkExpenseBreakdown: any;
  bankDepositExpenseBreakdown: any;
  sales: any;
  bankDeposits: any;
  itemSales: any;
  itemSalesTotal: any;
  tDuration: string;
  parameters:any;
  constructor(
    private auth: AuthService,
  ) { }
  @ViewChild('tableToExport') table: any;
  ngOnInit(): void {
    this.cashDrawer = JSON.parse(localStorage.getItem('cashDrawer'));
    this.cashIns = JSON.parse(localStorage.getItem('cashIns'));
    this.cashOuts = JSON.parse(localStorage.getItem('cashOuts'));
    this.bills = JSON.parse(localStorage.getItem('bills'));

    // this.cashDrawer.TotalCash = this.cashDrawer.StartUpCash + this.cashIns.TotalAmount - this.cashOuts.TotalAmount;
    // this.cashDrawer.Variance = this.cashDrawer.PhysicalCash - this.cashDrawer.TotalCash;

    this.cashSalesBreakdown = JSON.parse(localStorage.getItem('cashSalesBreakdown'));
    this.checkSalesBreakdown = JSON.parse(localStorage.getItem('checkSalesBreakdown'));
    this.chargeSalesBreakdown = JSON.parse(localStorage.getItem('chargeSalesBreakdown'));
    this.bankDepositSalesBreakdown = JSON.parse(localStorage.getItem('bankDepositSalesBreakdown'));
    this.cashExpenseBreakdown = JSON.parse(localStorage.getItem('cashExpenseBreakdown'));
    this.chargeExpenseBreakdown = JSON.parse(localStorage.getItem('chargeExpenseBreakdown'));
    this.checkExpenseBreakdown = JSON.parse(localStorage.getItem('checkExpenseBreakdown'));
    this.bankDepositExpenseBreakdown = JSON.parse(localStorage.getItem('bankDepositExpenseBreakdown'));
    this.sales = JSON.parse(localStorage.getItem('sales'));
    this.bankDeposits = JSON.parse(localStorage.getItem('bankDeposits'));
    this.itemSales = JSON.parse(localStorage.getItem('itemSales'));
    this.itemSalesTotal = JSON.parse(localStorage.getItem('itemSalesTotal'));
    this.Title = localStorage.getItem('Title');
    this.businessInfo = this.auth.BusinessInfo;
    this.getDuration();
    this.parameters = this.getParameters();
  }

  getDuration(){
    const endDateTime = new Date(this.cashDrawer.EndDateTime);
    const startDateTime = new Date(this.cashDrawer.StartDateTime);
    const durationMs = endDateTime.getTime() - startDateTime.getTime();

    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    let strHours = `${hours} hour`;
    if (hours > 1) strHours += 's';

    let strMinutes = `${minutes} minute`;
    if (minutes > 1) strMinutes += 's';

    this.tDuration = this.cashDrawer.EndDateTime ? `${strHours} ${strMinutes}` : '';

  }

  getParameters() {
    const tCashExpense = +this.cashExpenseBreakdown.reduce((sum, x) => sum + +x.Credit, 0);
    const tCashExpenseDrawer = +this.cashExpenseBreakdown
        .filter(x => x.FundSource.toLowerCase() === 'cashdrawer')
        .reduce((sum, x) => sum + +x.Credit, 0);
    const tChargeExpense = +this.chargeExpenseBreakdown.reduce((sum, x) => sum + +x.Credit, 0);
    const tCheckExpense = +this.checkExpenseBreakdown.reduce((sum, x) => sum + +x.Credit, 0);
    const tBankDepositExpense = +this.bankDepositExpenseBreakdown.reduce((sum, x) => sum + x.Credit, 0);
    const tAmountOut = +tCashExpense + +tChargeExpense + +tCheckExpense + +tBankDepositExpense;

    return {
        tDuration: this.tDuration,
        tCashSales: +this.cashSalesBreakdown.reduce((sum, x) => sum + +x.Debit, 0),
        tChargeSales: +this.chargeSalesBreakdown.reduce((sum, x) => sum + +x.Debit, 0),
        tCheckSales: +this.checkSalesBreakdown.reduce((sum, x) => sum + +x.Debit, 0),
        tbankDeposits: +this.bankDeposits.reduce((sum, x) => sum + +x.Amount, 0),
        tBankDepositSales: +this.bankDepositSalesBreakdown.reduce((sum, x) => sum + +x.Debit, 0),
        tCashExpense: +tCashExpense,
        tCashExpenseDrawer: +tCashExpenseDrawer,
        tChargeExpense: +tChargeExpense,
        tCheckExpense: +tCheckExpense,
        tBankDepositExpense: +tBankDepositExpense,
        tAmountOut: +tAmountOut,
        tItemSalesTotal: +this.itemSales.reduce((sum, x) => sum + +x.Amount, 0)
    };
}


  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
   localStorage.removeItem('cashDrawer');
   localStorage.removeItem('cashIns');
   localStorage.removeItem('cashOuts');
   localStorage.removeItem('bills');
   localStorage.removeItem('cashSalesBreakdown');
   localStorage.removeItem('checkSalesBreakdown');
   localStorage.removeItem('chargeSalesBreakdown');
   localStorage.removeItem('bankDepositSalesBreakdown');
   localStorage.removeItem('cashExpenseBreakdown');
   localStorage.removeItem('chargeExpenseBreakdown');
   localStorage.removeItem('checkExpenseBreakdown');
   localStorage.removeItem('bankDepositExpenseBreakdown');
   localStorage.removeItem('sales');
   localStorage.removeItem('bankDeposits');
   localStorage.removeItem('itemSales');
   localStorage.removeItem('itemSalesTotal');
   localStorage.removeItem('Title');
  }


  getTotal(column){
    let sum = 0;
        this.bills.forEach((x, index, array)=> {
          sum += +x[column];
        });
  
    return sum;
  }

  getTotalDepositTo(column){
    let sum = 0;
        this.bankDeposits.forEach((x, index, array)=> {
          sum += +x[column];
        });
  
    return sum;
  }


  onClickPrint() {
    window.print();
  }

  onClickExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.Title+'.xlsx');
  }


}
