import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-print-stocks-expiry',
  templateUrl: './print-stocks-expiry.component.html',
  styleUrls: ['./print-stocks-expiry.component.css']
})
export class PrintStocksExpiryComponent implements OnInit {

 printResult: string | null = null;
 Data:any;
  businessInfo: any;
  Title: any;
  Type4: any;
  Title4: any;
  constructor(
    private auth: AuthService,
  ) { }
  @ViewChild('tableToExport') table: any;
  ngOnInit(): void {
    this.Data = JSON.parse(localStorage.getItem('StocksExpiry'));
    this.Title = localStorage.getItem('Title');
    this.Title4 = localStorage.getItem('Title4');
    this.Type4 = localStorage.getItem('Type4');
    this.businessInfo = this.auth.BusinessInfo;
  }

  getTotal(column){
    let sum = 0;
    this.Data.forEach((x, index, array)=> {
      sum += +x[column];
      if (column === 'Balance' && index === array.length - 1) {
        sum = x[column];
      }
    });
    return sum;
  }
  
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    localStorage.setItem('HasPrintStocksExpiry', 'yes');
    localStorage.removeItem('StocksExpiry');
    localStorage.removeItem('Title');
    localStorage.removeItem('Title4');
    localStorage.removeItem('Type4');
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
