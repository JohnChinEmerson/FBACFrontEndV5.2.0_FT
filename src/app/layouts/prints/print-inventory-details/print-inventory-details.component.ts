import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-print-inventory-details',
  templateUrl: './print-inventory-details.component.html',
  styleUrls: ['./print-inventory-details.component.css']
})
export class PrintInventoryDetailsComponent implements OnInit {

  printResult: string | null = null;
  inventoryDetails:any;
  businessInfo: any;
  Title: any;
  constructor(
    private auth: AuthService,
  ) { }
  @ViewChild('tableToExport') table: any;
  ngOnInit(): void {
    this.inventoryDetails = JSON.parse(localStorage.getItem('InventoryDetails'));
    this.Title = localStorage.getItem('Title');
    this.businessInfo = this.auth.BusinessInfo;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
   localStorage.removeItem('InventoryDetails');
   localStorage.removeItem('Title');
  }


  getTotal(column){
    let sum = 0;
        this.inventoryDetails.forEach(x => {
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
