import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ReceiptLine, ReceiptLinesService } from 'src/app/services/receipt-lines.service';

// Restaurant slips printed from Sales Transaction (Desktop POSPrintOrderSlip / POSPrintBill):
//  - 'slips' : one order slip per kitchen/bar area (SEND)
//  - 'bill'  : bill out handed to the table before payment (BILL OUT)
// localStorage 'OrderSlip' = { Type, Slips?, BillOut?, Details?, Discounts?, MachinePermit?, VendorPermit?, Config?, Reprint?, FontSize? }
// FontSize: Sales Config per machine OrderSlipPOSPrinterFontSize (slips) / POSPrinterFontSize (bill); 0 = default
@Component({
  selector: 'app-print-order-slip',
  templateUrl: './print-order-slip.component.html',
  styleUrls: ['./print-order-slip.component.css']
})
export class PrintOrderSlipComponent implements OnInit {
  slipData      : any = {};
  businessInfo  : any;
  printedAt     : Date = new Date();
  printed       : boolean = false;
  billLines     : ReceiptLine[] = [];
  slipLines     : ReceiptLine[][] = [];

  constructor(
    private auth: AuthService,
    private receiptLinesService: ReceiptLinesService,
  ) { }

  ngOnInit(): void {
    this.slipData = JSON.parse(localStorage.getItem('OrderSlip') || '{}');
    this.businessInfo = this.auth.BusinessInfo;
    if (this.slipData.Type == 'slips')
      this.slipLines = (this.slipData.Slips || []).map(slip => this.receiptLinesService.orderSlip(slip));
    if (this.slipData.Type == 'bill') {
      var d = this.slipData;
      var reprint = !!d.Reprint;
      this.billLines = (d.BillOut?.BIRRegistered || '').toLowerCase() == 'yes'
          ? this.receiptLinesService.billBIR(d.BillOut, d.Details, d.Discounts, d.MachinePermit, d.VendorPermit, d.Config, this.businessInfo, reprint)
          : this.receiptLinesService.bill(d.BillOut, d.Details, d.Discounts, d.Config, this.businessInfo, reprint);
    }
    setTimeout(() => this.onClickPrint(), 400);
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    localStorage.removeItem('OrderSlip');
  }

  // Desktop prints the slip directly: print on open, then close the popup (no Print button)
  onClickPrint() {
    this.printed = true;
    window.onafterprint = () => window.close();
    window.print();
  }
}
