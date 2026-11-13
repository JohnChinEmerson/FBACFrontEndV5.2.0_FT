import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-print-stocks-totals',
  templateUrl: './print-stocks-totals.component.html',
  styleUrls: ['./print-stocks-totals.component.css']
})
export class PrintStocksTotalsComponent implements OnInit {

  printResult: string | null = null;
  items:any;
  businessInfo: any;
  Title: any;
  constructor(
    private auth: AuthService,
  ) { }
  @ViewChild('tableToExport') table: any;
  ngOnInit(): void {
    this.items = JSON.parse(localStorage.getItem('Items'));
    this.Title = localStorage.getItem('Title');
    this.businessInfo = this.auth.BusinessInfo;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
   localStorage.removeItem('Items');
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
  getTotal(column){
    let sum = 0;
    this.items.forEach(x => {
      sum += +x[column];
    });
    return sum;
  }

}
