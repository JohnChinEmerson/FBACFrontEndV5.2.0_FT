import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-print-receivable-dues',
  templateUrl: './print-receivable-dues.component.html',
  styleUrls: ['./print-receivable-dues.component.css']
})
export class PrintReceivableDuesComponent implements OnInit {

  printResult: string | null = null;
     Data:any;
     businessInfo: any;
     Title: any;
     Title2: any;
     Type2: any;
     constructor(
       private auth: AuthService,
     ) { }
     @ViewChild('tableToExport') table: any;
     ngOnInit(): void {
       this.Data = JSON.parse(localStorage.getItem('ReceivableDues'));
       this.Title = localStorage.getItem('Title');
       this.Title2 = localStorage.getItem('Title2');
       this.Type2 = localStorage.getItem('Type2');
       if(this.Type2 == 'Title2'){
       this.Data = JSON.parse(localStorage.getItem('Data2'));
       }
       this.businessInfo = this.auth.BusinessInfo;
     }
   
     getTotal(column){
       let sum = 0;
       this.Data.forEach(x => {
               sum += +x[column];
       });
       return sum;
     }
   
     @HostListener('window:beforeunload', ['$event'])
     beforeunloadHandler(event) {
      localStorage.setItem('HasPrintReceivableDues', 'yes');
      localStorage.removeItem('ReceivableDues');
      localStorage.removeItem('Data2');
      localStorage.removeItem('Title');
      localStorage.removeItem('Title2');
      localStorage.removeItem('Type2');
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
