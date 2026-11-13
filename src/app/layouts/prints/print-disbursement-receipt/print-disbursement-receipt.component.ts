import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-print-disbursement-receipt',
  templateUrl: './print-disbursement-receipt.component.html',
  styleUrls: ['./print-disbursement-receipt.component.css']
})
export class PrintDisbursementReceiptComponent implements OnInit {

  printResult: string | null = null;
   businessInfo: any;
   Title: any;
   TransNo: any;
  Disbursement: any;
   constructor(
     private auth: AuthService,
   ) { }
   @ViewChild('tableToExport') table: any;
   ngOnInit(): void {
     this.TransNo = localStorage.getItem('TransNo');
    this.Disbursement     = JSON.parse(localStorage.getItem('Disbursement'));
     this.Title = localStorage.getItem('Title');
     this.businessInfo = this.auth.BusinessInfo;
   }
 
   @HostListener('window:beforeunload', ['$event'])
   beforeunloadHandler(event) {
    localStorage.removeItem('Disbursement');
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
