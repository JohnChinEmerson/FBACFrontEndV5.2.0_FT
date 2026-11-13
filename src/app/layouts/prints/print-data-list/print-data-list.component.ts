import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';

// Generic list print used by the Tables, Printers and Menus screens.
// localStorage 'PrintDataList' = { Title, Columns: [{ Key, Label, Type? ('decimal' | 'int' | 'date') }], Data: [], Totals?: { Key: value } }
@Component({
  selector: 'app-print-data-list',
  templateUrl: './print-data-list.component.html',
  styleUrls: ['./print-data-list.component.css']
})
export class PrintDataListComponent implements OnInit {
  Title     : string = '';
  columns   : any[] = [];
  data      : any[] = [];
  totals    : any = null;
  @ViewChild('tableToExport') table: any;

  constructor() { }

  ngOnInit(): void {
    var printData = JSON.parse(localStorage.getItem('PrintDataList') || '{}');
    this.Title    = printData.Title || '';
    this.columns  = printData.Columns || [];
    this.data     = printData.Data || [];
    this.totals   = printData.Totals || null;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    localStorage.removeItem('PrintDataList');
  }

  isNumeric(column: any) {
    return column.Type == 'decimal' || column.Type == 'int';
  }

  onClickPrint() {
    window.print();
  }

  onClickExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.Title + '.xlsx');
  }
}
