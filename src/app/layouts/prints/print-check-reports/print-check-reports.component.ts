import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-print-check-reports',
  templateUrl: './print-check-reports.component.html',
  styleUrls: ['./print-check-reports.component.css']
})
export class PrintCheckReportsComponent implements OnInit {
 CheckType: string = 'Customer';
  printResult: string | null = null;
  Data:any;
  businessInfo: any;
  Title: any;
  @ViewChild('tableToExport') table: any;
  constructor(
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
  this.Data = JSON.parse(localStorage.getItem('Data'));
  this.Title = localStorage.getItem('Title');
  this.CheckType = localStorage.getItem('CheckType');
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
    //localStorage.clear();
   localStorage.removeItem('Data');
   localStorage.removeItem('Title');
    localStorage.removeItem('CheckType');
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
