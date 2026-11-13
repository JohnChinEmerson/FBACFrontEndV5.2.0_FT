
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-print-stocks-inquiry',
  templateUrl: './print-stocks-inquiry.component.html',
  styleUrls: ['./print-stocks-inquiry.component.css']
})
export class PrintStocksInquiryComponent implements OnInit {

  printResult: string | null = null;
  businessInfo: any;
  Data: any;
  Type:any;
  Title:any;
  @ViewChild('tableToExport') table: any;
  Branches: any;
  constructor(
    private router: Router,
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.Data = JSON.parse(localStorage.getItem('Data'));
    this.businessInfo = this.auth.BusinessInfo;
    this.Title = localStorage.getItem('title');
    this.Type = localStorage.getItem('Type');
    this.Branches = JSON.parse(localStorage.getItem('Branches'));
    this.Branches = this.Branches?.filter(x => x.BranchId !== 'ALL');
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
     localStorage.removeItem('Data');
     localStorage.removeItem('title');
     localStorage.removeItem('Type');
     localStorage.removeItem('Branches');
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

  getLastRowColumn(Column) {
    let data = null;
    if (this.Data && this.Data.length > 0) {
      const lastRow = this.Data[this.Data.length - 1];
      data = lastRow[Column];
    }
    return data;
  }

  getTotal(element: any): number {
    let total = 0;
    this.Branches.forEach(branch => {
      if (branch.BranchName.toLocaleLowerCase() != 'all') {
        total += +element[branch.BranchName] || 0;
      }
    });
    return total;
  }
}
