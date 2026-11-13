import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-print-sale-details',
  templateUrl: './print-sale-details.component.html',
  styleUrls: ['./print-sale-details.component.css']
})
export class PrintSaleDetailsComponent implements OnInit {

  printResult: string | null = null;
  Details:any;
  businessInfo: any;
  Title: any;
  TransNo: any;
  Header: any;
  MPHeader: any;
  SaleConfig: any;
  constructor(
    private auth: AuthService,
  ) { }
  @ViewChild('tableToExport') table: any;
  ngOnInit(): void {
    this.TransNo = localStorage.getItem('TransNo');
    this.Details  = JSON.parse(localStorage.getItem('Details'));
    this.Header     = JSON.parse(localStorage.getItem('Header'));
    this.MPHeader     = JSON.parse(localStorage.getItem('MPHeader'));
    this.SaleConfig = JSON.parse(localStorage.getItem('SaleConfig'));
    this.Title = localStorage.getItem('Title');
    this.businessInfo = this.auth.BusinessInfo;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
   localStorage.removeItem('Details');
   localStorage.removeItem('Header');
   localStorage.removeItem('MPHeader');
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
          if(column.toLowerCase() == 'amountvoid'){
            if(x.RecordStatus == 'void'){
              sum += +x.Amount;
            }
          }
      });
  
    return sum;
  }
  getItemName(data){
    var itemName =  data.ItemName;
    
    if(data.SerialNos != null){
      itemName += '('+data.SerialNos+')';
    }
    return itemName;
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
