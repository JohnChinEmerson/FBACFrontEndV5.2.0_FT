import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-print-petty-cash-details-receipt',
  templateUrl: './print-petty-cash-details-receipt.component.html',
  styleUrls: ['./print-petty-cash-details-receipt.component.css']
})
export class PrintPettyCashDetailsReceiptComponent implements OnInit {

  printResult: string | null = null;
  businessInfo: any;
  Title: any;
  TransNo: any;
  PettyCash: any;
  PaidTrans: any;
   constructor(
     private auth: AuthService,
   ) { }
   @ViewChild('tableToExport') table: any;
   ngOnInit(): void {
     this.TransNo = localStorage.getItem('TransNo');
    this.PettyCash     = JSON.parse(localStorage.getItem('PettyCash'));
    this.PaidTrans     = JSON.parse(localStorage.getItem('PaidTrans'));
     this.Title = localStorage.getItem('Title');
     this.businessInfo = this.auth.BusinessInfo;
   }
 
   @HostListener('window:beforeunload', ['$event'])
   beforeunloadHandler(event) {
    localStorage.removeItem('PettyCash');
    localStorage.removeItem('PaidTrans');
    localStorage.removeItem('Title');
    localStorage.removeItem('TransNo');
   }
   getTotal(column){
    let sum = 0;
      this.PaidTrans.forEach(x => {
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
