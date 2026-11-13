import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-print-canvass-details',
  templateUrl: './print-canvass-details.component.html',
  styleUrls: ['./print-canvass-details.component.css']
})
export class PrintCanvassDetailsComponent implements OnInit {
  printResult: string | null = null;
  Details:any;
  businessInfo: any;
  Title: any;
  TransNo: any;
  Header: any;
  constructor(
    private auth: AuthService,
  ) { }
  @ViewChild('tableToExport') table: any;
  ngOnInit(): void {
    this.TransNo = localStorage.getItem('TransNo');
    this.Details  = JSON.parse(localStorage.getItem('Details'));
    this.Header     = JSON.parse(localStorage.getItem('Header'));
    this.Title = localStorage.getItem('Title');
    this.businessInfo = this.auth.BusinessInfo;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
   localStorage.removeItem('Details');
   localStorage.removeItem('Header');
   localStorage.removeItem('Title');
   localStorage.removeItem('TransNo');
  }

  getTotal(column){
    let sum = 0;
        this.Details.forEach(x => {
          if(column.toLowerCase() == 'amountopen'){
            if(x.RecordStatus == 'open'){
              sum += +x.Amount;
            }
          }
          else if(column.toLowerCase() == 'amountvoid'){
            if(x.RecordStatus == 'void'){
              sum += +x.Amount;
            }
          }
           else {
             sum += +x[column];
           }
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
