import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-print-account-titles',
  templateUrl: './print-account-titles.component.html',
  styleUrls: ['./print-account-titles.component.css']
})
export class PrintAccountTitlesComponent implements OnInit {

 printResult: string | null = null;
  data:any;
  businessInfo: any;
  Title: any;
  @ViewChild('tableToExport') table: any;
  constructor(
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.data = JSON.parse(localStorage.getItem('Data'));
    this.Title = localStorage.getItem('Title');
    this.businessInfo = this.auth.BusinessInfo;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    //localStorage.clear();
   localStorage.removeItem('Data');
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
