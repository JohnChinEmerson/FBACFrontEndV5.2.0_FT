import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-print-customers',
  templateUrl: './print-customers.component.html',
  styleUrls: ['./print-customers.component.css']
})
export class PrintCustomersComponent implements OnInit {

  printResult: string | null = null;
  customers:any;
  businessInfo: any;
  Title: any;
  @ViewChild('tableToExport') table: any;
  constructor(
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.customers = JSON.parse(localStorage.getItem('Customers'));
    this.Title = localStorage.getItem('Title');
    this.businessInfo = this.auth.BusinessInfo;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    //localStorage.clear();
   localStorage.removeItem('Customers');
   localStorage.removeItem('Title');
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
