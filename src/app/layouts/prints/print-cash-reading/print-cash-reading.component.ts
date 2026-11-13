import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-print-cash-reading',
  templateUrl: './print-cash-reading.component.html',
  styleUrls: ['./print-cash-reading.component.css']
})
export class PrintCashReadingComponent implements OnInit {

  printResult: string | null = null;
  cashDrawer:any;
  cashIns:any;
  cashOuts:any;
  denominations:any;
  businessInfo: any;
  Title: any;
  constructor(
    private auth: AuthService,
  ) { }
  @ViewChild('tableToExport') table: any;
  ngOnInit(): void {
    this.cashDrawer = JSON.parse(localStorage.getItem('cashDrawer'));
    this.cashIns = JSON.parse(localStorage.getItem('cashIns'));
    this.cashOuts = JSON.parse(localStorage.getItem('cashOuts'));
    this.denominations = JSON.parse(localStorage.getItem('denominations'));
    this.Title = localStorage.getItem('Title');
    this.businessInfo = this.auth.BusinessInfo;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
   localStorage.removeItem('cashDrawer');
   localStorage.removeItem('cashIns');
   localStorage.removeItem('cashOuts');
   localStorage.removeItem('denominations');
   localStorage.removeItem('Title');
  }


  getTotal(column){
    let sum = 0;
        this.denominations.forEach((x, index, array)=> {
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
