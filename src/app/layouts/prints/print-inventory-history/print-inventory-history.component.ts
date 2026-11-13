import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-print-inventory-history',
  templateUrl: './print-inventory-history.component.html',
  styleUrls: ['./print-inventory-history.component.css']
})
export class PrintInventoryHistoryComponent implements OnInit {

  printResult: string | null = null;
  inventoryHistory:any;
  businessInfo: any;
  Title: any;
  constructor(
    private auth: AuthService,
  ) { }
  @ViewChild('tableToExport') table: any;
  ngOnInit(): void {
    this.inventoryHistory = JSON.parse(localStorage.getItem('InventoryHistory'));
    this.Title = localStorage.getItem('Title');
    this.businessInfo = this.auth.BusinessInfo;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
   localStorage.removeItem('InventoryHistory');
   localStorage.removeItem('Title');
  }


  getTotal(column){
    let sum = 0;
        this.inventoryHistory.forEach(x => {
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
