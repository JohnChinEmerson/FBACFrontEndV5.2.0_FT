import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-print-inventory-stocks',
  templateUrl: './print-inventory-stocks.component.html',
  styleUrls: ['./print-inventory-stocks.component.css']
})
export class PrintInventoryStocksComponent implements OnInit {

  printResult: string | null = null;
  items:any;
  businessInfo: any;
  Title: any;
  Status: any;
  constructor(
    private auth: AuthService,
  ) { }
  @ViewChild('tableToExport') table: any;
  ngOnInit(): void {
    this.items = JSON.parse(localStorage.getItem('Items'));
    this.Title = localStorage.getItem('Title');
    this.Status = localStorage.getItem('Status');
    this.businessInfo = this.auth.BusinessInfo;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
   localStorage.removeItem('Items');
   localStorage.removeItem('Title');
   localStorage.removeItem('Status');
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
