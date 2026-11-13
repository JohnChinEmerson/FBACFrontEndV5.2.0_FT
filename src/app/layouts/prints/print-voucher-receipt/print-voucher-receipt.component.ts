import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-print-voucher-receipt',
  templateUrl: './print-voucher-receipt.component.html',
  styleUrls: ['./print-voucher-receipt.component.css']
})
export class PrintVoucherReceiptComponent implements OnInit {
  printResult: string | null = null;
   businessInfo: any;
   Title: any;
   TransNo: any;
  Voucher: any;
   constructor(
     private auth: AuthService,
   ) { }
   @ViewChild('tableToExport') table: any;
   ngOnInit(): void {
     this.TransNo = localStorage.getItem('TransNo');
    this.Voucher     = JSON.parse(localStorage.getItem('Voucher'));
     this.Title = localStorage.getItem('Title');
     this.businessInfo = this.auth.BusinessInfo;
   }
 
   @HostListener('window:beforeunload', ['$event'])
   beforeunloadHandler(event) {
    localStorage.removeItem('Voucher');
    localStorage.removeItem('Title');
    localStorage.removeItem('TransNo');
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
