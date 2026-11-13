import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-print-cash-transfers',
  templateUrl: './print-cash-transfers.component.html',
  styleUrls: ['./print-cash-transfers.component.css']
})
export class PrintCashTransfersComponent implements OnInit {

   printResult: string | null = null;
    Data:any;
    businessInfo: any;
    Title: any;
    constructor(
      private auth: AuthService,
    ) { }
    @ViewChild('tableToExport') table: any;
    ngOnInit(): void {
      this.Data = JSON.parse(localStorage.getItem('Data'));
      this.Title = localStorage.getItem('Title');
      this.businessInfo = this.auth.BusinessInfo;
    }
  
    @HostListener('window:beforeunload', ['$event'])
    beforeunloadHandler(event) {
     localStorage.removeItem('Data');
     localStorage.removeItem('Title');
    }
  
  
    getTotal(column){
      let sum = 0;
          this.Data.forEach(x => {
            if(column.toLowerCase() == 'amountopen'){
              if(x.RecordStatus == 'open'){
                sum += +x.Amount;
              }
            }
            if(column.toLowerCase() == 'amountvoid'){
              if(x.RecordStatus == 'void'){
                sum += +x.Amount;
              }
            }
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
