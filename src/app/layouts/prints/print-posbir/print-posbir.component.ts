import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ReceiptLine, ReceiptLinesService } from 'src/app/services/receipt-lines.service';
import { _url } from 'src/global-variables';

// BIR receipt of a BIR registered machine, as the desktop prints it:
//  ReceiptType 'sale' (default): SaleHeadersBAL.POSPrintBIR - SALES / CHARGE INVOICE (Reprint: **REPRINT**, VOID watermark when voided)
//  ReceiptType 'void'          : SaleHeadersBAL.POSPrintVoid - VOIDED SALES
//  ReceiptType 'salereturn'    : SaleReturnHeadersBAL.POSPrintBIR - SALES RETURN
// localStorage: Header, Details, Discounts, Config, machinePermit, vendorPermit, ReceiptType, Reprint
@Component({
  selector: 'app-print-posbir',
  templateUrl: './print-posbir.component.html',
  styleUrls: ['./print-posbir.component.css']
})
export class PrintPOSBIRComponent implements OnInit {
  private storageKeys = ['Header', 'Details', 'Discounts', 'Config', 'machinePermit', 'vendorPermit', 'Title', 'ReceiptType', 'Reprint'];
  printResult : string | null = null;
  lines       : ReceiptLine[] = [];
  watermark   : string | null = null;
  logo        : string | null = null;
  constructor(
    public auth: AuthService,
    private receiptLinesService: ReceiptLinesService,
  ) { }

  ngOnInit(): void {
    var businessInfo = this.auth.BusinessInfo;
    if (businessInfo?.POSPrinterLogo)
      this.logo = (_url + "img/config/businessinfo/" + businessInfo.POSPrinterLogo).replace('/api', '');

    var header        = JSON.parse(localStorage.getItem('Header'));
    var details       = JSON.parse(localStorage.getItem('Details')) || [];
    var discounts     = JSON.parse(localStorage.getItem('Discounts')) || [];
    var config        = JSON.parse(localStorage.getItem('Config'));
    var machinePermit = JSON.parse(localStorage.getItem('machinePermit'));
    var vendorPermit  = JSON.parse(localStorage.getItem('vendorPermit'));
    var receiptType   = localStorage.getItem('ReceiptType') || 'sale';
    var reprint       = localStorage.getItem('Reprint') == 'true';

    if (receiptType == 'void') {
      this.lines = this.receiptLinesService.voidSale(header, details, discounts, machinePermit, vendorPermit, config, businessInfo);
    } else if (receiptType == 'salereturn') {
      this.lines = this.receiptLinesService.saleReturnBIR(header, details, machinePermit, vendorPermit, config, businessInfo, reprint);
    } else {
      this.lines = this.receiptLinesService.saleBIR(header, details, discounts, machinePermit, vendorPermit, config, businessInfo, reprint);
      this.watermark = (header?.RecordStatus || '').toLowerCase() == 'void' ? 'VOID' : null;
    }

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
