import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-print-xreading-receipt',
  templateUrl: './print-xreading-receipt.component.html',
  styleUrls: ['./print-xreading-receipt.component.css']
})
export class PrintXReadingReceiptComponent implements OnInit {

  printResult: string | null = null;
  Data:any;
  businessInfo: any;
  Title: any;
  line : string = '__________________________________';
  constructor(
    private auth: AuthService,
  ) { }
  @ViewChild('tableToExport') table: any;
  ngOnInit(): void {
    this.Data = JSON.parse(localStorage.getItem('Data'));
   
    this.Title = localStorage.getItem('Title');
    this.businessInfo = this.auth.BusinessInfo;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
   localStorage.removeItem('Data');
   localStorage.removeItem('Title');
  }


  getTotal(column){
  
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
