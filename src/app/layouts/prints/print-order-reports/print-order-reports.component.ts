import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-print-order-reports',
  templateUrl: './print-order-reports.component.html',
  styleUrls: ['./print-order-reports.component.css']
})
export class PrintOrderReportsComponent implements OnInit {

printResult: string | null = null;
    Data:any;
    businessInfo: any;
    Title: any;
    Month : any;
    Category: any;
    ItemId: any;
    NumberColumns: any;

    constructor(
      private auth: AuthService,
    ) { }
    @ViewChild('tableToExport') table: any;
    ngOnInit(): void {
      this.Data = JSON.parse(localStorage.getItem('Data'));
      this.Title = localStorage.getItem('Title');
      this.Category = localStorage.getItem('Category');
      this.ItemId = localStorage.getItem('ItemId');
      this.Month = localStorage.getItem('Month');
      this.NumberColumns = JSON.parse(localStorage.getItem('NumberColumns'));
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
     localStorage.removeItem('Data');
     localStorage.removeItem('Title');
     localStorage.removeItem('Category');
     localStorage.removeItem('ItemId');
     localStorage.removeItem('Month');
     localStorage.removeItem('NumberColumns');
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
