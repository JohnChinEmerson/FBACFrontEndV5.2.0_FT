import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-print-vatsales-type',
  templateUrl: './print-vatsales-type.component.html',
  styleUrls: ['./print-vatsales-type.component.css']
})
export class PrintVATSalesTypeComponent implements OnInit {
 printResult: string | null = null;
  Data:any;
  machinePermit : any;
  businessInfo: any;
  Title: any;
  line : string = '__________________________________';
  constructor(
    private auth: AuthService,
  ) { }
  @ViewChild('tableToExport') table: any;
  ngOnInit(): void {
    this.Data = JSON.parse(localStorage.getItem('Data'));
    this.machinePermit = JSON.parse(localStorage.getItem('MachinePermit'));
   
    this.Title = localStorage.getItem('Title');
    this.businessInfo = this.auth.BusinessInfo;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
   localStorage.removeItem('Data');
   localStorage.removeItem('MachinePermit');
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
