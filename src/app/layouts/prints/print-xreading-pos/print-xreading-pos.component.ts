import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ReceiptLine, ReceiptLinesService } from 'src/app/services/receipt-lines.service';

// Desktop DateZReadingsBAL.POSPrintXReading. localStorage 'Data' = getXZReadingsByTerminalByDate response.
@Component({
  selector: 'app-print-xreading-pos',
  templateUrl: './print-xreading-pos.component.html',
  styleUrls: ['./print-xreading-pos.component.css']
})
export class PrintXReadingPOSComponent implements OnInit {
  printResult : string | null = null;
  lines       : ReceiptLine[] = [];
  constructor(
    public auth: AuthService,
    private receiptLinesService: ReceiptLinesService,
  ) { }

  ngOnInit(): void {
    var reading = JSON.parse(localStorage.getItem('Data'));
    this.lines = this.receiptLinesService.xReading(reading, this.auth.BusinessInfo, this.auth.UserAccount?.UserFullName);
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
    localStorage.removeItem('Data');
    localStorage.removeItem('Title');
  }

  onClickPrint() {
    window.print();
  }
}
