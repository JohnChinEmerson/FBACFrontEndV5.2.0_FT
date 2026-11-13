import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ReceiptLine, ReceiptLinesService } from 'src/app/services/receipt-lines.service';

// Desktop DateZReadingsBAL.POSPrintZReading of a saved Z-Reading (XZReading.SetData).
// localStorage 'Data' = DateZReadings row, 'MachinePermit' = its terminal's permit, 'Reprint' = 'true' on re-print.
@Component({
  selector: 'app-print-zreading-pos',
  templateUrl: './print-zreading-pos.component.html',
  styleUrls: ['./print-zreading-pos.component.css']
})
export class PrintZReadingPOSComponent implements OnInit {
  printResult : string | null = null;
  lines       : ReceiptLine[] = [];
  constructor(
    public auth: AuthService,
    private receiptLinesService: ReceiptLinesService,
  ) { }

  ngOnInit(): void {
    var zReading = JSON.parse(localStorage.getItem('Data'));
    var machinePermit = JSON.parse(localStorage.getItem('MachinePermit') || 'null')
        ?? { ComputerName: zReading.Terminal, MachineNo: zReading.MachineNo, SerialNo: zReading.SerialNo, PermitNo: zReading.PermitNo, DateIssued: zReading.DateIssued };
    var sections = this.receiptLinesService.zReadingSections(zReading, machinePermit);
    var reprint = localStorage.getItem('Reprint') == 'true' ? '(reprint)' : '';
    this.lines = this.receiptLinesService.zReading(sections, this.auth.BusinessInfo, this.auth.UserAccount?.UserFullName, reprint);
    setTimeout(() => this.onClickPrint(), 300);
    window.addEventListener('afterprint', () => {
      if (this.printResult === null) {
        this.printResult = 'canceled';
        this.clearStorage();
        window.close();
      }
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    this.clearStorage();
  }

  private clearStorage(){
    ['Data', 'Title', 'MachinePermit', 'Reprint'].forEach(x => localStorage.removeItem(x));
  }

  onClickPrint() {
    window.print();
  }
}
