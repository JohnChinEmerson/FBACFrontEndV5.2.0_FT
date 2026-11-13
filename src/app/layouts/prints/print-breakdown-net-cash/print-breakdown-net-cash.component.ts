import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-print-breakdown-net-cash',
  templateUrl: './print-breakdown-net-cash.component.html',
  styleUrls: ['./print-breakdown-net-cash.component.css']
})
export class PrintBreakdownNetCashComponent implements OnInit {

  printResult: string | null = null;
    businessInfo: any;
    Title: any;
  total: any;
  orderDownPayments: any;
  checkOutPayments: any;
  itemSalesPayments: any;
  pODownPayments: any;
  receivingPayments: any;
  payablePayments: any;
  expensePayments: any;
    constructor(
      private auth: AuthService,
    ) { }
    @ViewChild('tableToExport') table: any;
    ngOnInit(): void {
      this.total = JSON.parse(localStorage.getItem('total'));
      this.orderDownPayments = JSON.parse(localStorage.getItem('orderDownPayments'));
      this.checkOutPayments = JSON.parse(localStorage.getItem('checkOutPayments'));
      this.itemSalesPayments = JSON.parse(localStorage.getItem('itemSalesPayments'));
      this.pODownPayments = JSON.parse(localStorage.getItem('pODownPayments'));
      this.receivingPayments = JSON.parse(localStorage.getItem('receivingPayments'));
      this.payablePayments = JSON.parse(localStorage.getItem('payablePayments'));
      this.expensePayments = JSON.parse(localStorage.getItem('expensePayments'));
      this.expensePayments = JSON.parse(localStorage.getItem('expensePayments'));
      this.Title = localStorage.getItem('Title');

     
      this.businessInfo = this.auth.BusinessInfo;
    }
  
    @HostListener('window:beforeunload', ['$event'])
    beforeunloadHandler(event) {
     localStorage.removeItem('total');
     localStorage.removeItem('Title');
     localStorage.removeItem('orderDownPayments');
     localStorage.removeItem('checkOutPayments');
     localStorage.removeItem('itemSalesPayments');
     localStorage.removeItem('pODownPayments');
     localStorage.removeItem('receivingPayments');
     localStorage.removeItem('payablePayments');
     localStorage.removeItem('expensePayments');
    }
  
    getTotal(data, column){
      let sum = 0;
      this[data].forEach(x => {
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
