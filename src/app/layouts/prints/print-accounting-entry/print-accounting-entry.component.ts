import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-print-accounting-entry',
  templateUrl: './print-accounting-entry.component.html',
  styleUrls: ['./print-accounting-entry.component.css']
})
export class PrintAccountingEntryComponent implements OnInit {
  printResult: string | null = null;
  Data:any;
  businessInfo: any;
  Title: any;
  Header: any;
  constructor(
    private auth: AuthService,
  ) { }
  @ViewChild('tableToExport') table: any;
  ngOnInit(): void {
    this.Data  = JSON.parse(localStorage.getItem('Data'));
    this.Header  = JSON.parse(localStorage.getItem('Header'));
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
              sum += +x[column];
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
