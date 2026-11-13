import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-print-adjusting-entry-detail',
  templateUrl: './print-adjusting-entry-detail.component.html',
  styleUrls: ['./print-adjusting-entry-detail.component.css']
})
export class PrintAdjustingEntryDetailComponent implements OnInit {

   printResult: string | null = null;
    Details:any;
    businessInfo: any;
    Title: any;
    ReferenceNo: any;
    Header: any;
    constructor(
      private auth: AuthService,
    ) { }
    @ViewChild('tableToExport') table: any;
    ngOnInit(): void {
      this.ReferenceNo = localStorage.getItem('ReferenceNo');
      this.Details  = JSON.parse(localStorage.getItem('Details'));
      this.Header     = JSON.parse(localStorage.getItem('Header'));
      this.Title = localStorage.getItem('Title');
      this.businessInfo = this.auth.BusinessInfo;
    }
  
    @HostListener('window:beforeunload', ['$event'])
    beforeunloadHandler(event) {
     localStorage.removeItem('Details');
     localStorage.removeItem('Header');
     localStorage.removeItem('Title');
     localStorage.removeItem('ReferenceNo');
    }
  
    getTotal(column){
      let sum = 0;
          this.Details.forEach(x => {
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
