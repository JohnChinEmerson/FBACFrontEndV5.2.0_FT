import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-print-payable-dues',
  templateUrl: './print-payable-dues.component.html',
  styleUrls: ['./print-payable-dues.component.css']
})
export class PrintPayableDuesComponent implements OnInit {

 printResult: string | null = null;
     Data:any;
     businessInfo: any;
     Title: any;
     Title3: any;
     Type3: any;
     constructor(
       private auth: AuthService,
     ) { }
     @ViewChild('tableToExport') table: any;
     ngOnInit(): void {
       this.Data = JSON.parse(localStorage.getItem('PayableDues'));
       this.Title = localStorage.getItem('Title');
       this.Title3 = localStorage.getItem('Title3');
       this.Type3 = localStorage.getItem('Type3');
       if(this.Type3 == 'Title3'){
       this.Data = JSON.parse(localStorage.getItem('Data3'));
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
      localStorage.setItem('HasPrintPayableDues', 'yes');
      localStorage.removeItem('PayableDues');
      localStorage.removeItem('Data3');
      localStorage.removeItem('Title');
      localStorage.removeItem('Title3');
      localStorage.removeItem('Type3');
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
