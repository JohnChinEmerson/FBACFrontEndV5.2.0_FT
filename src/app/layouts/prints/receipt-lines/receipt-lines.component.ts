import { Component, Input } from '@angular/core';
import { ReceiptLine } from 'src/app/services/receipt-lines.service';

// Renders desktop POS printer lines (ReceiptLinesService); a VOID receipt gets the desktop watermark.
@Component({
  selector: 'app-receipt-lines',
  templateUrl: './receipt-lines.component.html',
  styleUrls: ['./receipt-lines.component.css']
})
export class ReceiptLinesComponent {
  @Input() lines: ReceiptLine[] = [];
  @Input() logo: string | null = null;
  @Input() watermark: string | null = null;
  // Sales Config per machine POSPrinterWidth (Desktop printer units, 1/100 inch); 0 = the paper width
  readonly widthIn: number | null = (+localStorage.getItem('POSPrinterWidth') || 0) > 0 ? +localStorage.getItem('POSPrinterWidth') / 100 : null;
  // Desktop Printer: Tahoma at the machine's POSPrinterFontSize (points; 7 when not set). Order slips pass
  // OrderSlipPOSPrinterFontSize instead.
  @Input() fontSizePt: number | null = null;
  get fontPt(): number {
    var size = +this.fontSizePt || +localStorage.getItem('POSPrinterFontSize') || 0;
    return size > 0 ? size : 7;
  }
}
