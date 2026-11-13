import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ReceiptLine, ReceiptLinesService } from 'src/app/services/receipt-lines.service';
import { _url } from 'src/global-variables';

// Receipt of a machine that is not BIR registered (desktop SaleHeadersBAL.POSPrint;
// ReceiptType 'salereturn': SaleReturnHeadersBAL.POSPrint).
// localStorage: Header, Details, Discounts, Config, Reprint
@Component({
  selector: 'app-print-pos',
  templateUrl: './print-pos.component.html',
  styleUrls: ['./print-pos.component.css']
})
export class PrintPOSComponent implements OnInit {
  private storageKeys = ['Header', 'Details', 'Discounts', 'Config', 'machinePermit', 'vendorPermit', 'Title', 'ReceiptType', 'Reprint'];
  fontSize    : number = 9;
  posMargin   : number = 1;
  printResult : string | null = null;
  lines       : ReceiptLine[] = [];
  logo        : string | null = null;
  constructor(
    public auth: AuthService,
    private receiptLinesService: ReceiptLinesService,
  ) { }

  ngOnInit(): void {
    var businessInfo = this.auth.BusinessInfo;
    if (businessInfo?.POSPrinterLogo)
      this.logo = (_url + "img/config/businessinfo/" + businessInfo.POSPrinterLogo).replace('/api', '');

    var header    = JSON.parse(localStorage.getItem('Header'));
    var details   = JSON.parse(localStorage.getItem('Details')) || [];
    var discounts = JSON.parse(localStorage.getItem('Discounts')) || [];
    var config    = JSON.parse(localStorage.getItem('Config'));
    this.fontSize  = +config?.POSFontSize || 9;
    this.posMargin = +config?.POSMargin || 1;
    var reprint = localStorage.getItem('Reprint') == 'true';
    this.lines = localStorage.getItem('ReceiptType') == 'salereturn'
        ? this.receiptLinesService.saleReturn(header, details, config, businessInfo, reprint)
        : this.receiptLinesService.sale(header, details, discounts, config, businessInfo, reprint);

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
    this.storageKeys.forEach(x => localStorage.removeItem(x));
  }

  onClickPrint() {
    window.print();
  }
}
