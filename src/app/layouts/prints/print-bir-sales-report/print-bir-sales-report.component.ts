import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';

// Print / Excel of one section of the BIR Sales Report (desktop BIRSalesReportUI report viewers).
// localStorage: Data (getBIRSalesReportByDateFromByDateTo), Section, Title
@Component({
  selector: 'app-print-bir-sales-report',
  templateUrl: './print-bir-sales-report.component.html',
  styleUrls: ['./print-bir-sales-report.component.css']
})
export class PrintBIRSalesReportComponent implements OnInit {
  Data    : any = {};
  Section : string = 'summary';
  Title   : string = '';
  @ViewChild('tableToExport') table: ElementRef;

  ngOnInit(): void {
    this.Data = JSON.parse(localStorage.getItem('Data') || '{}');
    this.Section = localStorage.getItem('Section') || 'summary';
    this.Title = localStorage.getItem('Title') || '';
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    ['Data', 'Section', 'Title'].forEach(x => localStorage.removeItem(x));
  }

  onClickPrint() {
    window.print();
  }

  onClickExcel() {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    this.table.nativeElement.querySelectorAll('table').forEach((t, i) =>
      XLSX.utils.book_append_sheet(wb, XLSX.utils.table_to_sheet(t), 'Sheet' + (i + 1)));
    XLSX.writeFile(wb, this.Title + '.xlsx');
  }
}
