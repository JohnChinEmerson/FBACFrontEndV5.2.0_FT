import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-print-suppliers',
  templateUrl: './print-suppliers.component.html',
  styleUrls: ['./print-suppliers.component.css']
})
export class PrintSuppliersComponent implements OnInit {

  printResult: string | null = null;
  suppliers:any;
  businessInfo: any;
  Title: any;
  @ViewChild('tableToExport') table: any;

  constructor(
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.suppliers = JSON.parse(localStorage.getItem('Suppliers'));
    this.Title = localStorage.getItem('Title');
    this.businessInfo = this.auth.BusinessInfo;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    //localStorage.clear();
    localStorage.removeItem('Suppliers');
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
