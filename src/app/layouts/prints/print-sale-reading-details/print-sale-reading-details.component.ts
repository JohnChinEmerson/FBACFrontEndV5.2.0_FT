import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-print-sale-reading-details',
  templateUrl: './print-sale-reading-details.component.html',
  styleUrls: ['./print-sale-reading-details.component.css']
})
export class PrintSaleReadingDetailsComponent implements OnInit {
  saleReadings: any;
  cashReadings: any;
  bills: any;
  cashierLedgers: any;
  bankDeposits: any;
  itemSales: any;
  itemSalesTotal: any;
  sales: any;
  paymentTypes: any;
  parameters: any;
  Title: any;
  cashSalesBreakdown: any;
  chargeSalesBreakdown: any;
  checkSalesBreakdown: any;
  bankDepositSalesBreakdown: any;
  cashExpenseBreakdown: any;
  chargeExpenseBreakdown: any;
  checkExpenseBreakdown: any;
  bankDepositExpenseBreakdown: any;

  constructor(
    private auth: AuthService,
  ) { }
  @ViewChild('tableToExport') table: any;
  ngOnInit(): void {
    this.saleReadings = JSON.parse(localStorage.getItem('saleReadings'));
    this.cashReadings = JSON.parse(localStorage.getItem('cashReadings'));
    this.bills = JSON.parse(localStorage.getItem('bills'));
    this.cashierLedgers = JSON.parse(localStorage.getItem('cashierLedgers'));
    this.bankDeposits = JSON.parse(localStorage.getItem('bankDeposits'));
    this.itemSales = JSON.parse(localStorage.getItem('itemSales'));
    this.itemSalesTotal = JSON.parse(localStorage.getItem('itemSalesTotal'));
    this.sales = JSON.parse(localStorage.getItem('sales'));
    this.paymentTypes = JSON.parse(localStorage.getItem('paymentTypes'));
    this.parameters = JSON.parse(localStorage.getItem('parameters'));
    this.cashSalesBreakdown = JSON.parse(localStorage.getItem('cashSalesBreakdown'));
    this.chargeSalesBreakdown = JSON.parse(localStorage.getItem('chargeSalesBreakdown'));
    this.checkSalesBreakdown = JSON.parse(localStorage.getItem('checkSalesBreakdown'));
    this.bankDepositSalesBreakdown = JSON.parse(localStorage.getItem('bankDepositSalesBreakdown'));
    this.cashExpenseBreakdown = JSON.parse(localStorage.getItem('cashExpenseBreakdown'));
    this.chargeExpenseBreakdown = JSON.parse(localStorage.getItem('chargeExpenseBreakdown'));
    this.checkExpenseBreakdown = JSON.parse(localStorage.getItem('checkExpenseBreakdown'));
    this.bankDepositExpenseBreakdown = JSON.parse(localStorage.getItem('bankDepositExpenseBreakdown'));
    this.Title = localStorage.getItem('Title');

  }




  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
   localStorage.removeItem('saleReadings');
   localStorage.removeItem('cashReadings');
   localStorage.removeItem('bills');
   localStorage.removeItem('cashierLedgers');
   localStorage.removeItem('bankDeposits');
   localStorage.removeItem('itemSales');
   localStorage.removeItem('itemSalesTotal');
   localStorage.removeItem('sales');
   localStorage.removeItem('paymentTypes');
   localStorage.removeItem('parameters');
   localStorage.removeItem('cashSalesBreakdown');
   localStorage.removeItem('chargeSalesBreakdown');
   localStorage.removeItem('checkSalesBreakdown');
   localStorage.removeItem('bankDepositSalesBreakdown');
   localStorage.removeItem('cashExpenseBreakdown');
   localStorage.removeItem('chargeExpenseBreakdown');
   localStorage.removeItem('checkExpenseBreakdown');
   localStorage.removeItem('bankDepositExpenseBreakdown');
   localStorage.removeItem('Title');
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
