import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';
import { ToolBoxService } from 'src/app/services/tool-box.service';

@Component({
  selector: 'app-posprint-cash-reading',
  templateUrl: './posprint-cash-reading.component.html',
  styleUrls: ['./posprint-cash-reading.component.css']
})
export class POSPrintCashReadingComponent implements OnInit {

  printResult: string | null = null;
  cashDrawer:any;
  cashIns:any;
  cashOuts:any;
  denominations:any;
  businessInfo: any;
  Title: any;
  WithLogo : boolean = this.toolBoxService.WithLogo();
  constructor(
    public auth: AuthService,
    public toolBoxService: ToolBoxService,
  ) { }
  @ViewChild('tableToExport') table: any;
  ngOnInit(): void {
    this.cashDrawer = JSON.parse(localStorage.getItem('cashDrawer'));
    this.cashIns = JSON.parse(localStorage.getItem('cashIns'));
    this.cashOuts = JSON.parse(localStorage.getItem('cashOuts'));
    this.denominations = JSON.parse(localStorage.getItem('denominations'));
    this.Title = localStorage.getItem('Title');
    this.businessInfo = this.auth.BusinessInfo;
    window.print();
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

}
