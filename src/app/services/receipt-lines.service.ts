import { Injectable } from '@angular/core';

// One printed line of the desktop POS printer (Mariosoft.POS.Printing.Data.Lines):
// middle only = centered; left/right = both ends; height = centered box (receipt notes)
export interface ReceiptLine {
  left?   : string;
  middle? : string;
  right?  : string;
  bold?   : boolean;
  height? : number;
  // printed large (kitchen slip CANCELLED heading)
  big?    : boolean;
}

// Desktop (BIR accredited) POS receipts, line for line:
// SaleHeadersBAL.POSPrint / POSPrintBIR / POSPrintVoid and BillOutHeadersBAL.POSPrintBill / POSPrintBillBIR.
// The web keeps VATAmount gross (its TotalDue formula subtracts LessVAT), so VAT AMOUNT prints VATAmount - LessVAT
// to show the desktop's (net) value.
@Injectable({
  providedIn: 'root'
})
export class ReceiptLinesService {

  // POSPrintBIR: SALES / CHARGE INVOICE of a BIR registered machine
  saleBIR(h: any, details: any[], discounts: any[], machinePermit: any, vendorPermit: any, config: any, business: any, reprint: boolean): ReceiptLine[] {
    var lines = this.birHeading(business, machinePermit, h.CashierName, h.InputByDateTime || h.TransDateTime);
    lines.push({ middle: (h.PaymentType || '').toLowerCase() == 'charge' ? 'CHARGE INVOICE' : 'SALES INVOICE', bold: true });
    if (reprint) {
      lines.push({ middle: '**REPRINT**', bold: true });
      lines.push({ middle: 'Reprint Issued :' + this.dateTime(new Date()) });
    }
    lines.push({ middle: '' });
    if ((h.PaymentType || '').toLowerCase() != 'charge')
      lines.push({ left: 'SI#: ' + h.SINo, bold: true });
    lines.push({ left: 'BILL#: ' + (h.BillOutNo ?? '') });
    lines.push({ middle: '' });
    lines.push(...this.tableAndDiscountType(h, discounts));
    lines.push({ middle: '' });
    lines.push(...this.saleLines(h, details, discounts, false));
    lines.push(...this.remarks(h, config));
    lines.push({ middle: '' });
    lines.push(...this.vatBreakdown(h, false));
    lines.push({ middle: '' });
    lines.push({ middle: (h.RecordStatus || '').toLowerCase() == 'void' ? 'THIS DOCUMENT IS NOT VALID FOR CLAIM OF INPUT TAX' : 'THIS SERVES AS YOUR SALES INVOICE', height: this.notesHeight(config) });
    lines.push({ middle: '' });
    lines.push(...this.customerInfo(h));
    lines.push({ middle: '' });
    lines.push(...this.vendorFooter(vendorPermit, machinePermit));
    return lines;
  }

  // POSPrintOrderSlip: kitchen order slip of one printer / area (lines built by SaleRestaurantUI.orderSlips).
  // A slip of cancelled lines only (Cancel Order) has a big CANCELLED heading instead of ORDER SLIP.
  orderSlip(s: any): ReceiptLine[] {
    var lines: ReceiptLine[] = [
      { left: '**FOR KITCHEN USED ONLY**', right: '' },
      { middle: '' },
      { left: 'ORDER#: ' + this.n0(s.OrderNo), right: '' },
      { middle: '' },
      s.IsCancelled ? { middle: '*** CANCELLED ***', bold: true, big: true } : { middle: 'ORDER SLIP', bold: true },
      { middle: '' },
      { left: 'TransDate\t: ' + this.shortDate(s.TransDate), right: '' },
      { left: 'CustomerName\t: ' + (s.CustomerName ?? ''), right: '' },
      { left: s.TableCategory != null ? 'TableCategory\t: ' + s.TableCategory : '', right: '' },
      { left: 'Table/Priority\t: ' + (s.TableName ?? ''), right: '' },
      { left: 'OrderType\t: ' + (s.OrderType ?? ''), right: '' },
      { left: '', right: '' },
    ];
    (s.Sections || []).forEach(section => {
      if (section.Title) lines.push({ middle: section.Title });
      (section.Lines || []).forEach(text => lines.push({ left: text, right: '' }));
      lines.push({ middle: '' });
    });
    if (s.IsCancelled) lines.push({ middle: 'CANCELLED BY', bold: true });
    lines.push({ middle: s.PrintedBy ?? '' });
    lines.push({ middle: this.dateTime(s.PrintedAt) });
    return lines;
  }

  // POSPrint: receipt of a machine that is not BIR registered
  sale(h: any, details: any[], discounts: any[], config: any, business: any, reprint: boolean): ReceiptLine[] {
    var lines = this.plainHeading(business, (config?.ReceiptLabel ?? '') + (reprint ? '-REPRINT' : ''));
    lines.push({ left: 'SaleNo : ' + h.TransNo, right: '' });
    lines.push({ left: 'TransDate : ' + this.shortDate(h.TransDate), right: '' });
    lines.push({ left: 'CustomerName : ' + h.CustomerName, right: '' });
    lines.push({ left: 'Address : ' + (h.Address ?? ''), right: '' });
    lines.push({ left: '', right: '' });
    lines.push({ left: 'BILL#: ' + (h.BillOutNo != null ? h.BillOutNo : '-') });
    lines.push({ middle: '' });
    lines.push(...this.tableAndDiscountType(h, discounts));
    lines.push({ middle: '' });
    lines.push(...this.saleLines(h, details, discounts, false));
    lines.push(...this.remarks(h, config));
    lines.push({ middle: '' });
    lines.push({ middle: (h.CashierName ?? '') + ' @ ' + (h.MachineName ?? '') });
    lines.push({ middle: this.dateTime(h.InputByDateTime || h.TransDateTime) });
    return lines;
  }

  // POSPrintVoid: VOIDED SALES receipt printed when a BIR sale is voided (amounts in parentheses)
  voidSale(h: any, details: any[], discounts: any[], machinePermit: any, vendorPermit: any, config: any, business: any): ReceiptLine[] {
    var lines = this.birHeading(business, machinePermit, h.CashierName, h.InputByDateTime || h.TransDateTime);
    lines.push({ middle: 'VOIDED SALES', bold: true });
    lines.push({ middle: '' });
    lines.push({ left: 'VOID#:' + h.VoidNo, bold: true });
    lines.push({ left: 'REFERENCE#:' + h.SINo, bold: true });
    lines.push({ middle: '' });
    lines.push({ left: 'TABLE NO: ' + (h.TableName ?? ''), middle: 'BILL NO. ' + (h.BillOutNo ?? '') });
    lines.push({ left: 'NoOfPax:' + this.n0(h.PaxCount), right: '' });
    var discountType = this.discountTypes(discounts);
    if (discountType)
      lines.push({ left: discountType });
    lines.push({ middle: '' });
    lines.push(...this.saleLines(h, details, discounts, true));
    lines.push(...this.remarks(h, config));
    lines.push({ middle: '' });
    lines.push(...this.vatBreakdown(h, true));
    lines.push({ middle: '' });
    lines.push({ middle: 'THIS DOCUMENT IS NOT VALID FOR CLAIM OF INPUT TAX', height: this.notesHeight(config) });
    lines.push({ middle: '' });
    lines.push(...this.customerInfo(h));
    lines.push({ middle: '' });
    lines.push(...this.vendorFooter(vendorPermit, machinePermit));
    lines.push({ middle: '**VOID**', bold: true });
    lines.push({ middle: 'Void Issued :' + this.dateTime(new Date()) });
    return lines;
  }

  // POSPrintBillBIR: bill out of a BIR registered machine
  billBIR(b: any, details: any[], discounts: any[], machinePermit: any, vendorPermit: any, config: any, business: any, reprint: boolean): ReceiptLine[] {
    var lines = this.birHeading(business, machinePermit, b.CashierName, b.InputByDateTime || b.TransDate);
    lines.push({ middle: 'BILL OUT', bold: true });
    if (reprint) {
      lines.push({ middle: '**REPRINT**', bold: true });
      lines.push({ middle: 'Reprint Issued :' + this.dateTime(new Date()) });
    }
    lines.push({ middle: '' });
    lines.push({ left: 'BILL#: ' + b.TransNo, bold: true });
    lines.push({ middle: '' });
    lines.push(...this.tableAndDiscountType(b, discounts));
    lines.push({ middle: '' });
    lines.push(...this.billLines(b, details, discounts));
    lines.push({ middle: '' });
    lines.push(...this.vatBreakdown(b, false));
    lines.push({ middle: '' });
    lines.push({ middle: 'THIS DOCUMENT IS NOT VALID FOR CLAIM OF INPUT TAX', height: this.notesHeight(config) });
    lines.push({ middle: '' });
    lines.push(...this.customerInfo(b));
    lines.push({ middle: '' });
    lines.push(...this.vendorFooter(vendorPermit, machinePermit));
    return lines;
  }

  // POSPrintBill: bill out of a machine that is not BIR registered
  bill(b: any, details: any[], discounts: any[], config: any, business: any, reprint: boolean): ReceiptLine[] {
    var lines = this.plainHeading(business, 'BILL OUT' + (reprint ? '-REPRINT' : ''));
    lines.push({ left: 'TransDate : ' + this.shortDate(b.TransDate), right: '' });
    lines.push({ left: 'CustomerName : ' + b.CustomerName, right: '' });
    lines.push({ left: 'Address : ' + (b.Address ?? ''), right: '' });
    lines.push({ left: '', right: '' });
    lines.push({ left: 'BILL#: ' + (b.TransNo != null ? b.TransNo : '-') });
    lines.push({ middle: '' });
    lines.push(...this.tableAndDiscountType(b, discounts));
    lines.push({ middle: '' });
    lines.push(...this.billLines(b, details, discounts));
    lines.push({ middle: 'THIS DOCUMENT IS NOT VALID FOR CLAIM OF INPUT TAX', height: this.notesHeight(config) });
    lines.push({ middle: '' });
    lines.push({ middle: (b.CashierName ?? '') + ' @ ' + (b.MachineName ?? '') });
    lines.push({ middle: this.dateTime(b.InputByDateTime || b.TransDate) });
    return lines;
  }

  // SaleReturnHeadersBAL.POSPrintBIR: SALES RETURN of a BIR registered machine (SR#, REFERENCE# = SI nos. returned)
  saleReturnBIR(h: any, details: any[], machinePermit: any, vendorPermit: any, config: any, business: any, reprint: boolean): ReceiptLine[] {
    var lines = this.birHeading(business, machinePermit, h.InputBy || h.CashierName, h.InputByDateTime || h.TransDateTime);
    lines.push({ middle: 'SALES RETURN', bold: true });
    if (reprint) {
      lines.push({ middle: '**REPRINT**', bold: true });
      lines.push({ middle: 'Reprint Issued :' + this.dateTime(new Date()) });
    }
    lines.push({ middle: '' });
    lines.push({ left: 'SR#:' + (details?.[0]?.SRNo ?? h.SRNo ?? ''), bold: true });
    lines.push({ left: 'REFERENCE#:' + (details || []).map(d => d.SINo).join(', '), bold: true });
    lines.push({ middle: '' });
    lines.push({ middle: '' });
    (details || []).forEach(sd => {
      lines.push({ left: sd.ItemName, right: '' });
      lines.push({ left: this.qty(sd.Qty) + ' @ P' + this.n2(sd.Price) + '/' + (sd.UM ?? ''), right: '(' + this.n2(sd.Amount) + ')' });
    });
    lines.push({ left: '', right: '' });
    lines.push(...this.returnTotals(h));
    lines.push({ middle: '' });
    lines.push({ middle: 'THIS DOCUMENT IS NOT VALID FOR CLAIM OF INPUT TAX', height: this.notesHeight(config) });
    lines.push({ middle: '' });
    lines.push(...this.customerInfo(h));
    lines.push({ middle: '' });
    lines.push(...this.vendorFooter(vendorPermit, machinePermit));
    return lines;
  }

  // SaleReturnHeadersBAL.POSPrint: SALES RETURN of a machine that is not BIR registered
  saleReturn(h: any, details: any[], config: any, business: any, reprint: boolean): ReceiptLine[] {
    var lines: ReceiptLine[] = [
      { middle: business?.BusinessName ?? '' },
      { middle: business?.Address ?? '' },
      { middle: business?.TIN ?? '' },
      { middle: business?.ContactNo ?? '' },
      { middle: '' },
      { middle: 'SALES RETURN' + (reprint ? '-REPRINT' : '') },
      { middle: '' },
      { left: 'TransNo : ' + h.TransNo, right: '' },
      { left: 'TransDate : ' + this.shortDate(h.TransDate), right: '' },
      { left: 'CustomerName : ' + h.CustomerName, right: '' },
      { left: 'Address : ' + (h.Address ?? ''), right: '' },
      { left: '', right: '' },
    ];
    (details || []).forEach(sd => {
      lines.push({ left: sd.ItemName, right: '' });
      lines.push({ left: this.qty(sd.Qty) + ' @ P' + this.n2(sd.Price) + '/' + (sd.UM ?? ''), right: this.n2(sd.Amount) });
    });
    lines.push({ left: '', right: '' });
    lines.push(...this.returnTotals(h));
    lines.push({ middle: '' });
    lines.push({ middle: 'THIS DOCUMENT IS NOT VALID FOR CLAIM OF INPUT TAX' });
    lines.push({ middle: '' });
    lines.push({ middle: '' });
    lines.push({ middle: this.dateTime(h.InputByDateTime || h.TransDateTime) });
    lines.push({ middle: (h.InputBy || h.CashierName || '') + ' @ ' + (h.MachineName ?? '') });
    return lines;
  }

  // sales return totals: amounts above zero in parentheses
  private returnTotals(h: any): ReceiptLine[] {
    var p = (value: any) => +value > 0 ? '(' + this.n2(value) + ')' : this.n2(value);
    return [
      { left: 'TOTAL AMOUNT', right: p(h.TotalAmount) },
      { left: 'VATABLE AMOUNT', right: p(h.VATableAmount) },
      { left: 'VAT AMOUNT', right: p(h.VATAmount) },
      { left: 'VAT EXEMPT', right: p(h.VATExemptSales) },
      { left: 'VAT ADJUSTMENT', right: p(h.VATAdjustment) },
      { left: 'ZERO RATED', right: p(h.ZeroRatedSales) },
      { left: 'NON VAT', right: p(h.NonVATSales) },
      { left: 'WHTAX', right: p(h.WHTaxAmount) },
      { left: 'DISCOUNT', right: p(h.DiscountAmount) },
      { left: 'TOTAL DUE', right: p(h.TotalDue) },
    ];
  }

  // DateZReadingsBAL.POSPrintXReading: X-READING REPORT (r = BIR reading sections of getXZReadingsByTerminalByDate)
  xReading(r: any, business: any, preparedBy: string): ReceiptLine[] {
    var si = r.dateSI, cd = r.dateCashDrawers, pay = cd.Payments || {};
    var lines = this.readingHeading(r.machinePermit, business, 'X-READING REPORT', '');
    lines.push(...this.readingWindow(si));
    lines.push({ left: 'Cashier:', right: cd.Cashier ?? '' });
    lines.push({ middle: '' });
    lines.push({ left: 'Beg. OR #:', right: (si.StartingSI ?? '').substring(2) });
    lines.push({ left: 'End. OR #:', right: (si.EndingSI ?? '').substring(2) });
    lines.push({ middle: '' });
    lines.push({ left: 'Opening Fund:', right: this.n2(cd.OpeningFund) });
    lines.push(this.dashes());
    lines.push({ left: 'PAYMENTS RECEIVED', right: '' });
    lines.push({ left: 'CASH', right: this.n2(pay.Cash) });
    lines.push({ left: 'CHEQUE', right: this.n2(pay.Check) });
    lines.push({ left: 'BANK DEPOSIT', right: this.n2(pay.BankDeposit) });
    lines.push({ left: 'Total Payments ', right: this.n2(cd.PaymentReceived) });
    lines.push(this.dashes());
    lines.push({ left: 'VOID : ', right: this.n2(r.dateVoidSales.TotalAmount) });
    lines.push(this.dashes());
    lines.push({ left: 'REFUND :', right: this.n2(r.dateSaleReturns.TotalAmount) });
    lines.push(this.dashes());
    lines.push({ left: 'Less Withdrawal: ', right: this.n2(cd.LessWidthrawal) });
    lines.push(this.dashes());
    lines.push(...this.transactionSummary(cd, preparedBy));
    return lines;
  }

  // DateZReadingsBAL.POSPrintZReading: Z-READING REPORT (r = BIR reading sections; reprint from zReadingSections)
  zReading(r: any, business: any, preparedBy: string, reprint: string): ReceiptLine[] {
    var si = r.dateSI, s = r.dateSales, v = r.dateVATSales, cd = r.dateCashDrawers;
    var lines = this.readingHeading(r.machinePermit, business, 'Z-READING REPORT' + reprint, 'ZR#:' + (si.ZReadingNo ?? ''));
    lines.push(...this.readingWindow(si));
    lines.push({ left: 'Beg. SI #:', right: si.StartingSI ?? '' });
    lines.push({ left: 'End. SI #:', right: si.EndingSI ?? '' });
    lines.push({ left: 'Beg. VOID #:', right: si.BegVOID ?? '' });
    lines.push({ left: 'End. VOID #:', right: si.EndVOID ?? '' });
    lines.push({ left: 'Beg. RETURN #:', right: si.BegRETURN ?? '' });
    lines.push({ left: 'End. RETURN #:', right: si.EndRETURN ?? '' });
    lines.push({ middle: '' });
    lines.push({ left: 'Reset Counter No.', right: si.ResetCounterNo ?? '' });
    lines.push({ left: 'Z Counter No. :', right: si.ZCounterNo ?? '' });
    lines.push(this.dashes());
    lines.push({ left: 'Present Accumulated Sales: ', right: this.n2(s.EndingSales) });
    lines.push({ left: 'Previous Accumulated Sales: ', right: this.n2(s.PreviousSales) });
    lines.push({ left: 'Sales for the Day: ', right: this.n2(s.GrossSales) });
    lines.push(this.dashes());
    lines.push({ middle: 'BREAKDOWN OF SALES' });
    lines.push({ left: 'VATABLE SALES : ', right: this.n2(v.VATSales) });
    lines.push({ left: 'VAT AMOUNT: ', right: this.n2(v.VATAmount) });
    lines.push({ left: 'VAT EXEMPT SALES: ', right: this.n2(v.VATExemptSales) });
    lines.push({ left: 'ZERO RATED SALES: ', right: this.n2(v.ZeroRatedSales) });
    lines.push(this.dashes());
    lines.push({ left: 'Gross Amount: ', right: this.n2(s.GrossSales) });
    lines.push({ left: 'Less Discount: ', right: this.n2(s.LessDiscount) });
    lines.push({ left: 'Less Return: ', right: this.n2(s.LessReturn) });
    lines.push({ left: 'Less Void:', right: this.n2(s.LessVoid) });
    lines.push({ left: 'Less VAT Adjustment: ', right: this.n2(s.TotalVATAdjustments) });
    lines.push({ left: 'Net Amount: ', right: this.n2(s.NetSales) });
    lines.push(this.dashes());
    lines.push({ middle: 'DISCOUNT SUMMARY' });
    lines.push({ left: 'SC Disc. : ', right: this.n2(s.SeniorDiscount) });
    lines.push({ left: 'PWD Disc. : ', right: this.n2(s.PWDDiscount) });
    lines.push({ left: 'NAAC Disc. : ', right: this.n2(s.NAACDiscount) });
    lines.push({ left: 'Solo Parent Disc. : ', right: this.n2(s.SoloParentDiscount) });
    lines.push({ left: 'Other Disc. : ', right: this.n2(s.OtherDiscount) });
    lines.push(this.dashes());
    lines.push({ middle: 'SALES ADJUSTMENT' });
    lines.push({ left: 'VOID : ', right: this.n2(r.dateVoidSales.TotalAmount) });
    lines.push({ left: 'RETURN :', right: this.n2(r.dateSaleReturns.TotalAmount) });
    lines.push(this.dashes());
    lines.push({ middle: 'VAT ADJUSTMENT' });
    lines.push({ left: 'SC TRANS. :', right: this.n2(s.LessVATSenior) });
    lines.push({ left: 'PWD TRANS :', right: this.n2(s.LessVATPWD) });
    lines.push({ left: 'REG.Disc. TRANS :', right: this.n2(s.LessVATReg) });
    lines.push({ left: 'ZERO-RATED TRANS.:', right: this.n2(s.LessVATZeroRated) });
    lines.push({ left: 'VAT on Return:', right: this.n2(s.LessVATReturn) });
    lines.push({ left: 'Other VAT Adjustments', right: this.n2(s.LessVATOther) });
    lines.push(this.dashes());
    lines.push(...this.transactionSummary(cd, preparedBy));
    return lines;
  }

  // XZReading.SetData: sections of a saved Z-Reading (DateZReadings row) for its re-print
  zReadingSections(z: any, machinePermit: any): any {
    return {
      machinePermit: machinePermit,
      dateSI: { ZReadingNo: z.ZReadingNo, TransDate: z.TransDate, StartingSI: z.StartingSI, EndingSI: z.EndingSI,
                BegVOID: z.StartingVOID, EndVOID: z.EndingVOID, BegRETURN: z.StartingRETURN, EndRETURN: z.EndingRETURN,
                ReportDate: z.ReportDate, ReportTime: z.ReportTime, StartDateTime: z.StartDateTime, EndDateTime: z.EndDateTime,
                ZCounterNo: z.ZCounterNo, ResetCounterNo: z.ResetCounterNo },
      dateSales: z,
      dateVATSales: { VATSales: z.VATSales, VATAmount: z.VATAmount, VATExemptSales: z.VATExemptSales, ZeroRatedSales: z.ZeroRatedSales },
      dateSaleReturns: { TotalAmount: z.SalesReturn, TotalCount: z.SRCount },
      dateVoidSales: { TotalAmount: z.VoidSales, TotalCount: z.VoidCount },
      dateCashDrawers: { CashInDrawer: z.CashAmount, BankDeposit: z.BankAmount, Cheque: z.CheckAmount, OpeningFund: z.OpeningFund,
                         LessWidthrawal: z.LessWithdrawal, PaymentReceived: z.PaymentReceived, ShortOver: z.ShortOver },
    };
  }

  private readingHeading(machinePermit: any, business: any, reportLabel: string, zReadingNo: string): ReceiptLine[] {
    return [
      { middle: business?.BusinessName ?? '' },
      { middle: business?.Address ?? '' },
      { middle: business?.TIN ?? '' },
      { middle: business?.ContactNo ?? '' },
      { middle: '' },
      { middle: 'Terminal:' + (machinePermit?.ComputerName ?? '') },
      { middle: 'MIN# : ' + (machinePermit?.MachineNo ?? '') },
      { middle: 'SN# : ' + (machinePermit?.SerialNo ?? '') },
      { middle: 'PTU# : ' + (machinePermit?.PermitNo ?? '') },
      { middle: 'Issued : ' + this.shortDate(machinePermit?.DateIssued) },
      { middle: '' },
      this.dashes(),
      zReadingNo ? { left: reportLabel, right: zReadingNo } : { middle: reportLabel },
      this.dashes(),
    ];
  }

  private readingWindow(si: any): ReceiptLine[] {
    var mmddyyyy = (value: any) => { var d = this.shortDate(value).split('/'); return d.length == 3 ? ('0' + d[0]).slice(-2) + '/' + ('0' + d[1]).slice(-2) + '/' + d[2] : ''; };
    return [
      { left: 'Report Date :', right: si.ReportDate ?? '' },
      { left: 'Report Time :', right: si.ReportTime ?? '' },
      { middle: '' },
      { left: 'Start Date & Time:', right: si.StartDateTime ? this.dateTime(si.StartDateTime) : mmddyyyy(si.TransDate) },
      { left: 'End Date & Time: ', right: si.EndDateTime ? this.dateTime(si.EndDateTime) : mmddyyyy(si.TransDate) },
      { middle: '' },
    ];
  }

  private transactionSummary(cd: any, preparedBy: string): ReceiptLine[] {
    return [
      { middle: 'TRANSACTION SUMMARY' },
      { left: 'Cash In Drawer:', right: this.n2(cd.CashInDrawer) },
      { left: 'CHEQUE', right: this.n2(cd.Cheque) },
      { left: 'BANK DEPOSIT :', right: this.n2(cd.BankDeposit) },
      { left: 'Opening Fund: ', right: this.n2(cd.OpeningFund) },
      { left: 'Less Withdrawal: ', right: this.n2(cd.LessWidthrawal) },
      { left: 'Payments Received: ', right: this.n2(cd.PaymentReceived) },
      this.dashes(),
      { left: 'SHORT/OVER: ', right: this.n2(cd.ShortOver) },
      this.dashes(),
      { middle: 'Prepared By : ' + (preparedBy ?? '') },
      { middle: this.dateTime(new Date()) },
      { middle: '' },
      { middle: '' },
      { middle: 'Signed By: ______________________________' },
      { middle: '' },
    ];
  }

  private dashes(): ReceiptLine {
    return { middle: '----------------------------------------' };
  }

  // ---- shared parts --------------------------------------------------------------------

  private birHeading(business: any, machinePermit: any, cashierName: string, dateTime: any): ReceiptLine[] {
    var lines: ReceiptLine[] = [
      { middle: business?.BusinessName ?? '' },
      { middle: business?.Proprietor ?? '' },
      { middle: business?.Address ?? '' },
      { middle: (business?.VATType ?? '') + ' - ' + (business?.TIN ?? '') },
      { middle: '' },
    ];
    if (machinePermit) {
      lines.push({ left: 'MIN#:' + (machinePermit.MachineNo ?? '') });
      lines.push({ left: 'SN#:' + (machinePermit.SerialNo ?? '') });
      lines.push({ middle: '' });
    }
    lines.push({ left: 'CASHIER : ' + (cashierName ?? '') });
    lines.push({ left: 'DATE & TIME: ' + this.dateTime(dateTime) });
    lines.push({ middle: '' });
    return lines;
  }

  private plainHeading(business: any, receiptLabel: string): ReceiptLine[] {
    return [
      { middle: business?.BusinessName ?? '' },
      { middle: business?.Proprietor ?? '' },
      { middle: business?.Address ?? '' },
      { middle: business?.TIN ?? '' },
      { middle: business?.ContactNo ?? '' },
      { middle: '' },
      { middle: receiptLabel },
      { middle: '' },
    ];
  }

  private tableAndDiscountType(h: any, discounts: any[]): ReceiptLine[] {
    var lines: ReceiptLine[] = [
      { left: 'TABLE NO: ' + (h.TableName ?? '') },
      { left: 'NoOfPax: ' + this.n0(h.PaxCount), right: '' },
    ];
    var discountType = this.discountTypes(discounts);
    if (discountType)
      lines.push({ left: discountType });
    return lines;
  }

  // "DISCOUNT TYPE: SENIOR CITIZEN, PWD"
  private discountTypes(discounts: any[]): string {
    if (!discounts || discounts.length == 0) return '';
    return 'DISCOUNT TYPE: ' + discounts.map(d => (d.DiscountName || '').toLowerCase() == 'senior' ? 'Senior Citizen' : d.DiscountName).join(', ').toUpperCase();
  }

  // SetLines / SetLinesVoid: items, totals and the discount lines
  private saleLines(h: any, details: any[], discounts: any[], isVoid: boolean): ReceiptLine[] {
    var p = (value: string) => isVoid ? '(' + value + ')' : value;
    var lines = this.itemLines(h, details, isVoid);
    var tQty = this.itemCount(details);
    lines.push({ middle: '' });
    lines.push({ left: 'TOTAL SALES', right: p(this.n2(h.TotalAmount)) });
    if (+h.LessVAT > 0)        lines.push({ left: 'LESS: 12% VAT', right: p(this.n2(h.LessVAT)) });
    if (+h.AdvancePayment > 0) lines.push({ left: 'ADVANCE PAID', right: p(this.n2(h.AdvancePayment)) });
    if (+h.DeliveryFee > 0)    lines.push({ left: 'DELIVERY FEE', right: p(this.n2(h.DeliveryFee)) });
    if (+h.WHTaxAmount > 0)    lines.push({ left: 'WHTAX', right: p(this.n2(h.WHTaxAmount)) });
    if (isVoid)
      lines.push({ left: 'DISCOUNT ' + this.headerDiscount(h), right: p(this.n2(h.DiscountAmount)) });
    else
      lines.push(...this.discountLines(discounts));
    if (+h.RebatePaid > 0)       lines.push({ left: 'REBATE PAID', right: p(this.n2(h.RebatePaid)) });
    if (+h.ServiceFeeAmount > 0) lines.push({ left: 'SERVICE FEE ' + this.serviceFee(h), right: this.n2(h.ServiceFeeAmount) });
    lines.push({ left: 'TOTAL DUE', right: p(this.n2(h.TotalDue)) });
    lines.push({ left: 'AMOUNT PAID', right: p(this.n2(h.AmountPaid)) });
    lines.push({ left: 'CHANGE', right: p(this.n2((+h.AmountPaid || 0) - (+h.TotalDue || 0))) });
    lines.push({ left: 'TOTAL ITEMS : ' + this.qty(tQty, 0), right: '' });
    return lines;
  }

  // BillOutHeadersBAL.SetLines: no amount paid / change
  private billLines(b: any, details: any[], discounts: any[]): ReceiptLine[] {
    var lines = this.itemLines(b, details, false);
    var tQty = this.itemCount(details);
    lines.push({ middle: '' });
    lines.push({ left: 'TOTAL SALES', right: this.n2(b.TotalAmount) });
    if (+b.LessVAT > 0)        lines.push({ left: 'LESS: 12% VAT', right: this.n2(b.LessVAT) });
    if (+b.AdvancePayment > 0) lines.push({ left: 'ADVANCE PAID', right: this.n2(b.AdvancePayment) });
    if (+b.DeliveryFee > 0)    lines.push({ left: 'DELIVERY FEE', right: this.n2(b.DeliveryFee) });
    if (+b.WHTaxAmount > 0)    lines.push({ left: 'WHTAX', right: this.n2(b.WHTaxAmount) });
    lines.push(...this.discountLines(discounts));
    if (+b.RebatePaid > 0)       lines.push({ left: 'REBATE PAID', right: this.n2(b.RebatePaid) });
    if (+b.ServiceFeeAmount > 0) lines.push({ left: 'SERVICE FEE ' + this.serviceFee(b), right: this.n2(b.ServiceFeeAmount) });
    lines.push({ left: 'TOTAL DUE', right: this.n2(b.TotalDue) });
    lines.push({ left: 'TOTAL ITEMS : ' + this.qty(tQty, 0), right: '' });
    return lines;
  }

  // a component of a Set: zero-priced line (SetId = the Set's ItemId) shown under its Set, not as an item of its own
  private isSetComponent(sd: any): boolean {
    return !!sd.SetId && sd.SetId != 'NA';
  }

  // an UPGRADE line: the item a Set's component was swapped for, linked to its Set line by SetDetailId
  private isUpgradeLine(sd: any): boolean {
    return !!sd.SetDetailId && (!sd.SetId || sd.SetId == 'NA');
  }

  // Sale lines in print order: every item, each Set followed by its components (what is in it) and then its upgrades.
  // The lines come sorted for printing (or newest first), so they are grouped here, never by position.
  private groupedLines(details: any[]): { sd: any, kind: 'item' | 'component' | 'upgrade' }[] {
    var all = details || [];
    var parents = all.filter(d => !this.isSetComponent(d) && !(this.isUpgradeLine(d) && all.some(p => p.id == d.SetDetailId)));
    var used = new Set<any>();
    var out: { sd: any, kind: 'item' | 'component' | 'upgrade' }[] = [];
    parents.forEach(p => {
      out.push({ sd: p, kind: 'item' });
      all.filter(c => this.isSetComponent(c) && (c.SetDetailId ? c.SetDetailId == p.id : c.SetId == p.ItemId)).forEach(c => {
        if (!used.has(c)) { used.add(c); out.push({ sd: c, kind: 'component' }); }
      });
      all.filter(u => this.isUpgradeLine(u) && u.SetDetailId == p.id).forEach(u => { used.add(u); out.push({ sd: u, kind: 'upgrade' }); });
    });
    // a component whose Set is not in the list is shown as an item rather than lost
    all.filter(c => this.isSetComponent(c) && !used.has(c)).forEach(c => out.push({ sd: c, kind: 'item' }));
    return out;
  }

  // quantity of the items sold: a Set's components are part of it, not more items
  private itemCount(details: any[]): number {
    return (details || []).filter(d => !this.isSetComponent(d)).reduce((total, d) => total + (+d.Qty || 0), 0);
  }

  private itemLines(h: any, details: any[], isVoid: boolean): ReceiptLine[] {
    var lines: ReceiptLine[] = [];
    this.groupedLines(details).forEach(({ sd, kind }) => {
      if (kind == 'component') {
        // "   - TEST ADOBO MEAL (1.0/PC)" under its Set (no price: it is in the Set's price)
        lines.push({ left: '   - ' + sd.ItemName + ' (' + this.qty(sd.Qty) + '/' + (sd.UM ?? '') + ')', right: '' });
        return;
      }
      var vat = (h.BIRRegistered || '').toLowerCase() == 'yes' && (sd.VATType || '').toLowerCase() == 'vat' ? 'V' : '';
      var amount = this.n2(sd.Amount) + vat;
      var indent = kind == 'upgrade' ? '  ' : '';
      lines.push({ left: kind == 'upgrade' ? '  UPGRADE: ' + sd.ItemName : sd.ItemName, right: '' });
      lines.push({ left: indent + ' ' + this.qty(sd.Qty) + ' @ P' + this.n2(sd.Price) + '/' + (sd.UM ?? ''), right: isVoid ? '(' + amount + ')' : amount });
      if (+sd.Discount > 0)
        lines.push({ left: indent + '  Discount @ P' + (isVoid ? '(' + this.n2(sd.Discount) + ')' : this.n2(sd.Discount)), right: '' });
    });
    return lines;
  }

  // one discount: "DISCOUNT (20%)"; several: "DISCOUNT:" then "   -2SC-20%" per discount
  private discountLines(discounts: any[]): ReceiptLine[] {
    if (!discounts || discounts.length == 0) return [];
    if (discounts.length == 1)
      return [{ left: 'DISCOUNT (' + this.percent(discounts[0]) + ')', right: this.n2(discounts[0].DiscountAmount) }];
    var lines: ReceiptLine[] = [{ left: 'DISCOUNT:', right: '' }];
    discounts.forEach(d => lines.push({ left: '   -' + this.n0(d.DiscountedPax) + this.suffix(d.DiscountName) + '-' + this.percent(d), right: this.n2(d.DiscountAmount) }));
    return lines;
  }

  private suffix(name: string): string {
    switch ((name || '').toLowerCase()) {
      case 'senior':      return 'SC';
      case 'pwd':         return 'PWD';
      case 'solo parent': return 'SP';
      case 'naac':        return 'NAAC';
      case 'mov':         return 'MOV';
      default:            return 'REG';
    }
  }

  // GetSingleDiscount / GetMultipleDiscount: "20%" (or "12.50%"), nothing for an amount
  private percent(d: any): string {
    var value = +d.DiscountPercent || 0;
    if (value > 0 && (d.DiscountType || '').toLowerCase() == 'percent')
      return (Number.isInteger(value) ? this.n0(value) : this.n2(value)) + '%';
    return '';
  }

  // GetDiscount (void receipt): header discount percent
  private headerDiscount(h: any): string {
    var value = +h.DiscountValue || 0;
    if (value > 0 && (h.DiscountType || '').toLowerCase() == 'percent')
      return (Number.isInteger(value) ? this.n0(value) : this.n2(value)) + '%';
    return '';
  }

  private serviceFee(h: any): string {
    var value = +h.ServiceFeeValue || 0;
    if (value > 0 && (h.ServiceFeeType || '').toLowerCase() == 'percent')
      return '(' + (Number.isInteger(value) ? this.n0(value) : this.n2(value)) + '%)';
    return '';
  }

  private vatBreakdown(h: any, isVoid: boolean): ReceiptLine[] {
    var p = (value: any) => isVoid ? '(' + this.n2(value) + ')' : this.n2(value);
    var lines: ReceiptLine[] = [
      { left: 'VATABLE SALES', right: p(h.VATableAmount) },
      { left: 'VAT AMOUNT', right: p((+h.VATAmount || 0) - (+h.LessVAT || 0)) },
      { left: 'VAT EXEMPT SALES ', right: p(h.VATExemptSales) },
      { left: 'ZERO RATED SALES ', right: p(h.ZeroRatedSales) },
    ];
    if (+h.NonVATSales > 0)
      lines.push({ left: 'NON-VAT SALES ', right: p(h.NonVATSales) });
    return lines;
  }

  private remarks(h: any, config: any): ReceiptLine[] {
    if (h.Remarks && h.Remarks != '-')
      return [{ middle: h.Remarks, height: this.notesHeight(config) }];
    return [];
  }

  private customerInfo(h: any): ReceiptLine[] {
    return [
      { left: "CUSTOMERS' INFORMATION:" },
      { left: 'NAME : ' + (h.CustomerName ?? '') },
      { left: 'ADDRESS : ' + (h.Address ?? '') },
      { left: 'TIN : ' + (h.CustomerTIN ?? '') },
    ];
  }

  private vendorFooter(vendorPermit: any, machinePermit: any): ReceiptLine[] {
    var lines: ReceiptLine[] = [];
    if (vendorPermit) {
      var accreditationDate = vendorPermit.AccreditationDate ? new Date(vendorPermit.AccreditationDate) : null;
      var validUntil = accreditationDate ? new Date(accreditationDate.getFullYear() + 5, accreditationDate.getMonth(), accreditationDate.getDate()) : null;
      lines.push({ left: vendorPermit.VendorName ?? '' });
      lines.push({ left: 'ADDRESS : ' + (vendorPermit.Address ?? '') });
      lines.push({ left: 'TIN : ' + (vendorPermit.TIN ?? '') });
      lines.push({ left: 'ACCREDITATION #: : ' + (vendorPermit.AccreditationNo ?? '') });
      lines.push({ left: 'DATE ISSUED  : ' + this.shortDate(accreditationDate) });
      lines.push({ left: 'VALID UNTIL  : ' + this.shortDate(validUntil) });
    }
    lines.push({ left: 'PTU#:' + (machinePermit?.PermitNo ?? '') });
    lines.push({ left: 'Issued:' + this.shortDate(machinePermit?.DateIssued) });
    lines.push({ middle: '' });
    return lines;
  }

  private notesHeight(config: any): number {
    return +config?.POSReceiptNotesHeight > 0 ? +config.POSReceiptNotesHeight : 0;
  }

  // ---- desktop number / date formats --------------------------------------------------

  n0(value: any): string { return this.number(value, 0); }
  n1(value: any): string { return this.number(value, 1); }
  n2(value: any): string { return this.number(value, 2); }
  // a line's quantity: one decimal like the Desktop (2.0, 1.5), more only when the quantity has more (a line cut by
  // Split by amount, e.g. 0.4464 x 1,120.00 = 499.97), so the receipt line still adds up
  qty(value: any, minDecimals: number = 1): string {
    return (+value || 0).toLocaleString('en-US', { minimumFractionDigits: minDecimals, maximumFractionDigits: 4 });
  }

  private number(value: any, decimals: number): string {
    return (+value || 0).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }

  // DateTime.ToShortDateString(): 10/5/2026
  shortDate(value: any): string {
    var date = this.toDate(value);
    return date ? (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() : '';
  }

  // DateTime.ToString(): 10/5/2026 1:05:09 PM
  dateTime(value: any): string {
    var date = this.toDate(value);
    if (!date) return '';
    var hours = date.getHours() % 12 || 12;
    var pad = (n: number) => (n < 10 ? '0' : '') + n;
    return this.shortDate(date) + ' ' + hours + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()) + ' ' + (date.getHours() < 12 ? 'AM' : 'PM');
  }

  private toDate(value: any): Date | null {
    if (!value) return null;
    var date = value instanceof Date ? value : new Date(typeof value == 'string' ? value.replace(' ', 'T') : value);
    return isNaN(date.getTime()) ? null : date;
  }
}
