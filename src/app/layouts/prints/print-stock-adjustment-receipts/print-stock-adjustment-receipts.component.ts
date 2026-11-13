import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-print-stock-adjustment-receipts',
  templateUrl: './print-stock-adjustment-receipts.component.html',
  styleUrls: ['./print-stock-adjustment-receipts.component.css']
})
export class PrintStockAdjustmentReceiptsComponent implements OnInit {

 printResult: string | null = null;
  Headers:any;
  businessInfo: any;
  Title: any;
  constructor(
    private auth: AuthService,
  ) { }
  @ViewChild('tableToExport') table: any;
  ngOnInit(): void {
    this.Headers = JSON.parse(localStorage.getItem('Headers'));
    this.Title = localStorage.getItem('Title');
    this.businessInfo = this.auth.BusinessInfo;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
   localStorage.removeItem('Headers');
   localStorage.removeItem('Title');
  }


  getTotal(column){
    let sum = 0;
        this.Headers.forEach(x => {
          if(column.toLowerCase() == 'amountopen'){
            if(x.RecordStatus == 'open'){
              sum += +x.TotalAmount;
            }
          }
          if(column.toLowerCase() == 'amountvoid'){
            if(x.RecordStatus == 'void'){
              sum += +x.TotalAmount;
            }
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
