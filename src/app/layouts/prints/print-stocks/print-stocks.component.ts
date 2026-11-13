import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-print-stocks',
  templateUrl: './print-stocks.component.html',
  styleUrls: ['./print-stocks.component.css']
})
export class PrintStocksComponent implements OnInit {
  printResult: string | null = null;
  items:any;
  businessInfo: any;
  Title: any;
  Title1: any;
  Type1: any;
  constructor(
    private auth: AuthService,
  ) { }
  @ViewChild('tableToExport') table: any;
  ngOnInit(): void {
    this.items = JSON.parse(localStorage.getItem('Items'));
    this.Title = localStorage.getItem('Title');
    this.Title1 = localStorage.getItem('Title1');
    this.Type1 = localStorage.getItem('Type1');
    this.businessInfo = this.auth.BusinessInfo;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
  localStorage.setItem('HasPrintItems', 'yes');
   localStorage.removeItem('Items');
   localStorage.removeItem('Title');
   localStorage.removeItem('Title1');
   localStorage.removeItem('Type1');
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
