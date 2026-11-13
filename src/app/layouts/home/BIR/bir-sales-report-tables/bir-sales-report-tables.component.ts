import { Component, Input } from '@angular/core';

// One section of the desktop BIR Sales Report (BIRSalesSummary / BIRSalesDetailed / BIR*BreakDown .rdlc):
// section 'summary' | 'detailed' | 'senior' | 'pwd' | 'naac' | 'soloParent' | 'mov'
@Component({
  selector: 'app-bir-sales-report-tables',
  templateUrl: './bir-sales-report-tables.component.html',
  styleUrls: ['./bir-sales-report-tables.component.css']
})
export class BIRSalesReportTablesComponent {
  @Input() data: any = {};
  @Input() section: string = 'summary';

  // desktop report labels
  static readonly labels = {
    summary    : 'BIR SALES SUMMARY REPORT',
    detailed   : 'BIR SALES DETAILED REPORT',
    senior     : 'SENIOR CITIZEN SALES BOOK/REPORT',
    pwd        : 'PERSONS WITH DISABILITY SALES BOOK/REPORT',
    naac       : 'NATIONAL ATHLETES AND COACHES SALES BOOK/REPORT',
    soloParent : 'SOLO PARENT SALES BOOK/REPORT',
    mov        : 'MOV SALES BOOK/REPORT',
  };

  // detailed report amount columns, in the desktop order
  detailedAmounts = ['GrossSales','VATSales','VATAmount','VATExemptSales','ZeroRatedSales','SeniorDiscD','PWDDiscD','NAACDiscD',
                     'SoloParentDiscD','OtherDiscD','ReturnAmountD','VoidAmountD','TotalDeduction','SeniorDiscA','PWDDiscA',
                     'OtherDiscA','VATOnReturnA','OthersA','TotalVATAdjustment','VATPayable','NetSales'];

  get rows(): any[] {
    return this.data?.[this.section] || [];
  }

  // books of persons with a TIN column on the desktop (Senior, PWD)
  get withTIN(): boolean {
    return this.section == 'senior' || this.section == 'pwd';
  }

  sum(rows: any[], column: string): number {
    return (rows || []).reduce((total, x) => total + (+x[column] || 0), 0);
  }
}
