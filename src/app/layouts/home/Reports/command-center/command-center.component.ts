import { Component, OnInit } from '@angular/core';
import { ReportConfigService } from '../../../../services/Reports/report-config.service';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FinancialStatementsComponent } from '../../Accounting/financial-statements/financial-statements.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PrintService } from 'src/app/services/print.service';
import { CommandCenterService } from 'src/app/services/Reports/command-center.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { CustomersService } from 'src/app/services/Files/customers.service';
import { ItemsService } from 'src/app/services/Files/items.service';
import { SuppliersService } from 'src/app/services/Files/suppliers.service';
import { StocksService } from 'src/app/services/Inventory/stocks.service';
import { BranchesService } from '../../../../services/Config/branches.service';
import { DateRange, DateRangeFilterComponent } from '../../../shared/date-range-filter/date-range-filter.component';

@Component({
  selector: 'app-command-center',
  templateUrl: './command-center.component.html',
  styleUrls: ['./command-center.component.css']
})
export class CommandCenterComponent implements OnInit {
  panelButtons     = [
    {'Label'   : 'Stocks Expiry','Disabled': true,'Function': () => this.onClickStocksExpiry()}, 
    {'Label'   : 'Stock Balance','Disabled': true,'Function': () => this.onClickStockBalance()}, 
    {'Label'   : 'Fast-Slow Moving Items','Disabled': true,'Function': () => this.onClicFastSlowMovingItems()}, 
    {'Label'   : 'Stock Adjustments','Disabled': true,'Function': () => this.onClickStockAdjustments()}, 
  ];  
  panelButtons2     = [
    {'Label'   : 'Orders','Disabled': true,'Function': () => this.onClickOrderReports()}, 
    {'Label'   : 'Sales Report','Disabled': true,'Function': () => this.onClickSalesReports()}, 
    {'Label'   : 'Delivery','Disabled': true,'Function': () => this.onClickDeliveryReports()}, 
    {'Label'   : 'Sales Return','Disabled': true,'Function': () => this.onClickSalesReturnReports()}, 
    {'Label'   : 'Cashiering','Disabled': true,'Function': () => this.onClickCashieringReports()}, 
  ];  
  panelButtons3     = [
    {'Label'   : 'Canvassing','Disabled': true,'Function': () => this.onClickCanvassReports()}, 
    {'Label'   : 'Purchasing','Disabled': true,'Function': () => this.onClickPurchaseReports()}, 
    {'Label'   : 'Receiving','Disabled': true,'Function': () => this.onClickReceivingReports()}, 
    {'Label'   : 'Return To Supplier','Disabled': true,'Function': () => this.onClickReturnToSupplierReports()}, 
    {'Label'   : 'Expenses','Disabled': true,'Function': () => this.onClickExpensesReports()}, 
  ];  
  panelButtons4     = [
    {'Label'   : 'Customer Ledger','Disabled': true,'Function': () => this.onClickCustomerLedger()}, 
    {'Label'   : 'Customer Payments','Disabled': true,'Function': () => this.onClickCustomerPayments()}, 
    {'Label'   : 'Receivables','Disabled': true,'Function': () => this.onClickReceivables()}, 
  ];  
  panelButtons5     = [
    {'Label'   : 'Supplier Ledger','Disabled': true,'Function': () => this.onClickSupplierLedger()}, 
    {'Label'   : 'Supplier Payments','Disabled': true,'Function': () => this.onClickSupplierPayments()}, 
    {'Label'   : 'Payables','Disabled': true,'Function': () => this.onClickPayables()}, 
  ];  
  panelButtons6     = [
    {'Label'   : 'Financial Statements','Disabled': true,'Function': () => this.onClickFinancialStatements()}, 
    {'Label'   : 'Net Cash Report','Disabled': true,'Function': () => this.onClickNetCashReport()}, 
    {'Label'   : 'Cash Account Ledger','Disabled': true,'Function': () => this.onClickCashAccountLedger()}, 
  ]; 
  panelButtons7     = [
    {'Label'   : 'Vouchering','Disabled': true,'Function': () => this.onClickVoucheringReports()}, 
    {'Label'   : 'Disbursements','Disabled': true,'Function': () => this.onClickDisbursementReports()}, 
  ]; 
  panelButtons8     = [
    {'Label'   : 'User Accounts','Disabled': true,'Function': () => this.onClickUserAccounts()}, 
    {'Label'   : 'Access Rights','Disabled': true,'Function': () => this.onClickAccessRights()}, 
  ]; 
  panelButtons9= [
    {'Label'   : 'Customers : 0','Disabled': true}, 
    {'Label'   : 'Suppliers : 0','Disabled': true}, 
    {'Label'   : 'Items : 0','Disabled': true}, 
    {'Label'   : 'OutOfStocks : 0','Disabled': true}, 
  ]; 
  panelButtons10= [
    {'Label'   : 'Cash Sales :0 ','Disabled': true}, 
    {'Label'   : 'Charge Sales : 0 ','Disabled': true}, 
    {'Label'   : 'BankDeposit Sales : 0 ','Disabled': true}, 
    {'Label'   : 'Check Sales : 0','Disabled': true}, 
  ]; 
  panelButtons11= [
    {'Label'   : 'Total Payments : 0','Disabled': true}, 
    {'Label'   : 'Total Void Payments : 0','Disabled': true}, 
    {'Label'   : 'Receivables Due : 0','Disabled': true}, 
    {'Label'   : 'Payables Due : 0','Disabled': true}, 
  ]; 
  buttons : any = this.panelButtons.concat(this.panelButtons2, this.panelButtons3,this.panelButtons4, this.panelButtons5, this.panelButtons6, this.panelButtons7, this.panelButtons8);
  totalButtons : any = this.panelButtons9.concat( this.panelButtons10, this.panelButtons11);
  config : any=[];
  dateFrom        : any = DateRangeFilterComponent.rangeOf('today').from;
  dateTo          : any = DateRangeFilterComponent.rangeOf('today').to;
  toolButtons     = [
    {'Label'   : 'View','Function'                : () => this.onClickView(),'Disabled': true,}, 
  ];
  totals  : any=[];
  branches : any;
  branchId : any;
  isLoading : boolean = false;
  constructor(
    private commandCenterService : CommandCenterService,
    private reportConfigService : ReportConfigService,
    private customersService : CustomersService,
    private itemsService : ItemsService,
    private suppliersService : SuppliersService,
    private authService : AuthService,
    private dateTimesService : DateTimesService,
    private stocksService : StocksService,
    private dialog: MatDialog,
    private router : Router,
    private printService : PrintService,
    private branchesService : BranchesService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCBOBranches();
    // await this.getReportConfig();
    await this.onClickView();
  }

  async getCBOBranches(){
    this.branches = await firstValueFrom(this.branchesService.getBranchesCBO());
    this.branchId = this.branches[0].BranchId;
  }

  // a preset or new dates load at once
  onRangeChange(range: DateRange){
    this.dateFrom = range.from;
    this.dateTo = range.to;
    this.onClickView();
  }

  // only what this edition has is shown
  enabled(buttons: any[]){
    return (buttons || []).filter(b => b.Disabled);
  }

  figureName(button: any){
    return button.Label.split(':')[0].trim().replace('OutOfStocks', 'Out of Stocks').replace('BankDeposit', 'Bank Deposit');
  }

  // counts (Customers, Suppliers, Items, Out of Stocks) come formatted with decimals: shown as whole numbers
  figureValue(button: any){
    var value = button.Label.split(':').slice(1).join(':').trim() || '0';
    return /Customers|Suppliers|Items|OutOfStocks/.test(button.Label) ? value.replace(/\.00$/, '') : value;
  }

  async onClickView(){
    if (this.isLoading) return;
    this.isLoading = true;
    try {
      this.totals = await firstValueFrom(this.commandCenterService.getCommandCenterTotalsByDateFromByDateTo(
          this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
          this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
          this.totalButtons,
          this.branchId
      ));
    } finally {
      this.isLoading = false;
    }

    this.dashboardUILoad();
    this.panelButtons9 = [];
    this.panelButtons10 = [];
    this.panelButtons11 = [];

    this.totals['buttons'].forEach(x => {
      if(x.Label.includes('Items') || x.Label.includes('Customers') || x.Label.includes('Suppliers') || x.Label.includes('OutOfStocks') ){
        this.panelButtons9.push(x);
      }

      if(x.Label.includes('Cash Sales') || x.Label.includes('Charge Sales') || x.Label.includes('BankDeposit Sales') || x.Label.includes('Check Sales') ){
        this.panelButtons10.push(x);
      }
      if(x.Label.includes('Total Payments') || x.Label.includes('Total Void Payments') || x.Label.includes('Receivables Due') || x.Label.includes('Payables Due') ){
        this.panelButtons11.push(x);
      }
     
    });


  }
  async getReportConfig(){
    this.config = await firstValueFrom(this.reportConfigService.getReportConfig());
  }

  dashboardUILoad() { 
      const standardButtons = this.standardButtons();
      const expressButtons = this.expressButtons();
      const posButtons = this.posButtons();
      const posBIRBackOffice = this.posBIRBackOfficeButtons();
      this.buttons.forEach((btn: any) => {
          let value = btn.Label;
          if (btn.Label.includes(":")) {
              value = btn.Label.split(":")[0].trim();
          }
          if (value.toLowerCase() !== "go" && btn.Disabled) {
              switch (this.authService.UserAccount.Edition.toLowerCase()) {
                  case "standard":
                      btn.Disabled = standardButtons.includes(value);
                      break;
                  case "express":
                      btn.Disabled = expressButtons.includes(value);
                      break;
                  case "pos":
                      btn.Disabled = posButtons.includes(value);
                      break;
                  case "posbirbackoffice":
                      btn.Disabled = posBIRBackOffice.includes(value);
                      break;
              }
          }
      });
      this.totalButtons.forEach((btn: any) => {
        let value = btn.Label;
        if (btn.Label.includes(":")) {
            value = btn.Label.split(":")[0].trim();
        }
        if (value.toLowerCase() !== "go" && btn.Disabled) {
            switch (this.authService.UserAccount.Edition.toLowerCase()) {
                case "standard":
                    btn.Disabled = standardButtons.includes(value);
                    break;
                case "express":
                    btn.Disabled = expressButtons.includes(value);
                    break;
                case "pos":
                    btn.Disabled = posButtons.includes(value);
                    break;
                case "posbirbackoffice":
                    btn.Disabled = posBIRBackOffice.includes(value);
                    break;
            }
        }
    });
  }

  standardButtons(){
      return [
          "Stocks Expiry",
          "Stock Balance",
          "Fast-Slow Moving Items",
          "Cashiering",
          "Sales Return",
          "Customers",
          "Suppliers",
          "Items",
          "Out of Stocks",
          "Expenses",
          "Stock Adjustments",
          "Receiving",
          "Return To Supplier",
          "Cash Sales",
          "Charge Sales",
          "Bank Deposit",
          "Check Sales",
          "Sales Report",
          "Receivables",
          "Payables",
          "Cash Account Ledger",
          "Total Payments",
          "Total Void Payments",
          "Receivables Due",
          "Payables Due",
          "Financial Statements",
          "Customer Payments",
          "Supplier Payments",
          "User Accounts",
          "Net Cash Report",
          "Customer Ledger",
          "Supplier Ledger",
          "Access Rights",
      ];
  }

  expressButtons(){
      return [
          "Stocks Expiry",
          "Stock Balance",
          "Fast-Slow Moving Items",
          "Cashiering",
          "Sales Return",
          "Customers",
          "Suppliers",
          "Items",
          "Out of Stocks",
          "Expenses",
          "Stock Adjustments",
          "Receiving",
          "Return To Supplier",
          "Cash Sales",
          "Bank Deposit",
          "Check Sales",
          "Sales Report",
          "Cash Account Ledger",
          "Total Payments",
          "Total Void Payments",
          "Financial Statements",
          "User Accounts",
          "Net Cash Report",
          "Access Rights",
      ];
  }

  posButtons(){
      return [
          "Stocks Expiry",
          "Stock Balance",
          "Fast-Slow Moving Items",
          "Cashiering",
          "Sales Return",
          "Customers",
          "Suppliers",
          "Items",
          "Out of Stocks",
          "Expenses",
          "Receiving",
          "Cash Sales",
          "Bank Deposit",
          "Check Sales",
          "Sales Report",
          "Cash Account Ledger",
          "Total Payments",
          "Total Void Payments",
          "Financial Statements",
          "User Accounts",
          "Net Cash Report",
          "Access Rights",
      ];
  }

  posBIRBackOfficeButtons(){
      return [
          "Stocks Expiry",
          "Stock Balance",
          "Fast-Slow Moving Items",
          "Cashiering",
          "Sales Return",
          "Customers",
          "Suppliers",
          "Items",
          "Out of Stocks",
          "Cash Sales",
          "Bank Deposit",
          "Check Sales",
          "Total Payments",
          "Expenses",
          "Receiving",
          "Cash Account Ledger",
          "Sales Report",
          "Financial Statements",
          "User Accounts",
          "Net Cash Report",
          "Access Rights",
      ];
  }

  onClickFinancialStatements(){
    var url = this.router.serializeUrl(
        this.router.createUrlTree(['home/accounting/financial_statements'], { queryParams: { showLayout: false } })
      );
    this.printService.popupWindow(url, 'financial_statements', window, 1500, 800);
  }
  onClickNetCashReport(){
    var url = this.router.serializeUrl(
        this.router.createUrlTree(['home/reports/net_cash_report'], { queryParams: { showLayout: false } })
      );
    this.printService.popupWindow(url, 'net_cash_report', window, 1500, 800);
  }
  onClickCashAccountLedger(){
    var url = this.router.serializeUrl(
        this.router.createUrlTree(['home/cashflow/cash_account_ledger'], { queryParams: { showLayout: false } })
      );
    this.printService.popupWindow(url, 'cash_account_ledger', window, 1500, 800);
  }
  onClickStocksExpiry(){
    var url = this.router.serializeUrl(
        this.router.createUrlTree(['home/inventory/stocks_expiry'], { queryParams: { showLayout: false } })
      );
    this.printService.popupWindow(url, 'stocks_expiry', window, 1500, 800);
  }
  onClickStockBalance(){
    var url = this.router.serializeUrl(
        this.router.createUrlTree(['home/inventory/stock_ending_balance'], { queryParams: { showLayout: false } })
      );
    this.printService.popupWindow(url, 'stock_ending_balance', window, 1500, 800);
  }
  onClicFastSlowMovingItems(){
    var url = this.router.serializeUrl(
        this.router.createUrlTree(['home/reports/fast_slow_moving_items'], { queryParams: { showLayout: false } })
      );
    this.printService.popupWindow(url, 'fast_slow_moving_items', window, 1500, 800);
  }
  onClickStockAdjustments(){
    var url = this.router.serializeUrl(
        this.router.createUrlTree(['home/stock adjustments/stockadjustment_reports'], { queryParams: { showLayout: false } })
      );
    this.printService.popupWindow(url, 'stockadjustment_reports', window, 1500, 800);
  }
  onClickOrderReports(){
    var url = this.router.serializeUrl(
        this.router.createUrlTree(['home/orders/order_reports'], { queryParams: { showLayout: false } })
      );
    this.printService.popupWindow(url, 'order_reports', window, 1500, 800);
  }
  onClickSalesReports(){
    var url = this.router.serializeUrl(
        this.router.createUrlTree(['home/sales/sales_reports'], { queryParams: { showLayout: false, branchId : this.branchId } })
      );
    this.printService.popupWindow(url, 'sales_reports', window, 1500, 800);
  }
  onClickDeliveryReports(){
    var url = this.router.serializeUrl(
        this.router.createUrlTree(['home/delivery/delivery_reports'], { queryParams: { showLayout: false } })
      );
    this.printService.popupWindow(url, 'delivery_reports', window, 1500, 800);
  }
  onClickSalesReturnReports(){
    var url = this.router.serializeUrl(
        this.router.createUrlTree(['home/sales return/sales_return_reports'], { queryParams: { showLayout: false } })
      );
    this.printService.popupWindow(url, 'sales_return_reports', window, 1500, 800);
  }
  onClickCashieringReports(){
    var url = this.router.serializeUrl(
        this.router.createUrlTree(['home/cashiering/cashiering_reports'], { queryParams: { showLayout: false } })
      );
    this.printService.popupWindow(url, 'cashiering_reports', window, 1500, 800);
  }
  onClickCanvassReports(){
    var url = this.router.serializeUrl(
        this.router.createUrlTree(['home/canvassing/canvass_reports'], { queryParams: { showLayout: false } })
      );
    this.printService.popupWindow(url, 'canvass_reports', window, 1500, 800);
  }
  onClickPurchaseReports(){
    var url = this.router.serializeUrl(
        this.router.createUrlTree(['home/purchasing/po_reports'], { queryParams: { showLayout: false } })
      );
    this.printService.popupWindow(url, 'po_reports', window, 1500, 800);
  }
  onClickReceivingReports(){
    var url = this.router.serializeUrl(
        this.router.createUrlTree(['home/receiving/receiving_reports'], { queryParams: { showLayout: false } })
      );
    this.printService.popupWindow(url, 'receiving_reports', window, 1500, 800);
  }
  onClickReturnToSupplierReports(){
    var url = this.router.serializeUrl(
        this.router.createUrlTree(['home/return to supplier/return_to_supplier_reports'], { queryParams: { showLayout: false } })
      );
    this.printService.popupWindow(url, 'return_to_supplier_reports', window, 1500, 800);
  }
  onClickExpensesReports(){
    var url = this.router.serializeUrl(
        this.router.createUrlTree(['home/expenses/expense_reports'], { queryParams: { showLayout: false } })
      );
    this.printService.popupWindow(url, 'expense_reports', window, 1500, 800);
  }
  onClickCustomerLedger(){
    var url = this.router.serializeUrl(
        this.router.createUrlTree(['home/receivables/customer_ledger'], { queryParams: { showLayout: false } })
      );
    this.printService.popupWindow(url, 'customer_ledger', window, 1500, 800);
  }
  onClickCustomerPayments(){
    var url = this.router.serializeUrl(
        this.router.createUrlTree(['home/receivables/payment_reports'], { queryParams: { showLayout: false } })
      );
    this.printService.popupWindow(url, 'payment_reports', window, 1500, 800);
  }
  onClickReceivables(){
    var url = this.router.serializeUrl(
        this.router.createUrlTree(['home/receivables/receivable_reports'], { queryParams: { showLayout: false } })
      );
    this.printService.popupWindow(url, 'receivable_reports', window, 1500, 800);
  }
  onClickSupplierLedger(){
    var url = this.router.serializeUrl(
        this.router.createUrlTree(['home/payables/supplier_ledger'], { queryParams: { showLayout: false } })
      );
    this.printService.popupWindow(url, 'supplier_ledger', window, 1500, 800);
  }
  onClickSupplierPayments(){
    var url = this.router.serializeUrl(
        this.router.createUrlTree(['home/payables/supplier_payment_reports'], { queryParams: { showLayout: false } })
      );
    this.printService.popupWindow(url, 'supplier_payment_reports', window, 1500, 800);
  }
  onClickPayables(){
    var url = this.router.serializeUrl(
        this.router.createUrlTree(['home/payables/payable_reports'], { queryParams: { showLayout: false } })
      );
    this.printService.popupWindow(url, 'payable_reports', window, 1500, 800);
  }
  onClickVoucheringReports(){
    var url = this.router.serializeUrl(
        this.router.createUrlTree(['home/vouchering/voucher_reports'], { queryParams: { showLayout: false } })
      );
    this.printService.popupWindow(url, 'voucher_reports', window, 1500, 800);
  }
  onClickDisbursementReports(){
    var url = this.router.serializeUrl(
        this.router.createUrlTree(['home/disbursements/disbursement_reports'], { queryParams: { showLayout: false } })
      );
    this.printService.popupWindow(url, 'disbursement_reports', window, 1500, 800);
  }
  onClickUserAccounts(){
    var url = this.router.serializeUrl(
        this.router.createUrlTree(['home/access rights/useraccounts'], { queryParams: { showLayout: false } })
      );
    this.printService.popupWindow(url, 'useraccounts', window, 1500, 800);
  }
  onClickAccessRights(){
    var url = this.router.serializeUrl(
        this.router.createUrlTree(['home/access rights/access_rights'], { queryParams: { showLayout: false } })
      );
    this.printService.popupWindow(url, 'access_rights', window, 1500, 800);
  }

  async onClickButton(button){
    if(button.Label.includes('Customers')){
      const url = this.router.serializeUrl(this.router.createUrlTree(['print/printcustomers']));
      const data = this.totals['customers'];
      this.printService.popupWindow(url, 'Customers', window, 800, 800);
      localStorage.setItem('Customers', JSON.stringify(data));
      localStorage.setItem('Title', 'CUSTOMERS');
    }
    if(button.Label.includes('Items')){
      var url = this.router.serializeUrl(this.router.createUrlTree(['print/printitems']));
      const data = this.totals['items'];
      this.printService.popupWindow(url, 'Items', window, 800, 800);
      localStorage.setItem('Items', JSON.stringify(data));
      localStorage.setItem('Title', 'ITEMS');
    }
    if(button.Label.includes('Suppliers')){
      var url = this.router.serializeUrl(this.router.createUrlTree(['print/printsuppliers']));
      const data = this.totals['suppliers'];
      this.printService.popupWindow(url, 'Suppliers', window, 800, 800);
      localStorage.setItem('Suppliers', JSON.stringify(data));
      localStorage.setItem('Title', 'SUPPLIERS');
    }
    if(button.Label.includes('OutOfStocks')){
      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printstocks']));
      const data = this.totals['outOfStocks'];
      this.printService.popupWindow(url, 'Items', window, 800, 800);
      localStorage.setItem('Items', JSON.stringify(data));
      localStorage.setItem('Title', 'OUT OF STOCKS ITEMS');
      localStorage.setItem('Title1', 'OUT OF STOCKS ITEMS');
      localStorage.setItem('Type1', 'Title');

    }

    if(button.Label.includes('Total Void Payments')){
      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsalestypereading']));
      var data = this.totals['voidedSales'];
      this.printService.popupWindow(url, 'Data', window, 800, 800);
      localStorage.setItem('Data', JSON.stringify(data));
      localStorage.setItem('Title', 'VOID PAYMENTS FROM '+
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' +
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))
      );
    }

    if(button.Label.includes('Total Payments')){
      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsalestypereading']));
      var data = this.totals['cashierLedgers'];
      this.printService.popupWindow(url, 'Data', window, 800, 800);
      localStorage.setItem('Data', JSON.stringify(data));
      localStorage.setItem('Title', 'PAYMENTS FROM '+
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' +
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))
      );
    }

    if(button.Label.includes('Cash Sales')){
      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsalestypereading']));
      var data = this.totals['cashSalesBreakdown'];
      this.printService.popupWindow(url, 'Data', window, 800, 800);
      localStorage.setItem('Data', JSON.stringify(data));
      localStorage.setItem('Title', 'CASH SALES FROM '+
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' +
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))
      );
    }

    if(button.Label.includes('Charge Sales')){
      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsalestypereading']));
      var data = this.totals['chargeSalesBreakdown'];
      this.printService.popupWindow(url, 'Data', window, 800, 800);
      localStorage.setItem('Data', JSON.stringify(data));
      localStorage.setItem('Title', 'CHARGE SALES FROM '+
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' +
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))
      );
    }

    if(button.Label.includes('BankDeposit Sales')){
      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsalestypereading']));
      var data = this.totals['bankDepositSalesBreakdown'];
      this.printService.popupWindow(url, 'Data', window, 800, 800);
      localStorage.setItem('Data', JSON.stringify(data));
      localStorage.setItem('Title', 'BANK DEPOSIT SALES FROM '+
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' +
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))
      );
    }

    if(button.Label.includes('Check Sales')){
      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsalestypereading']));
      var data = this.totals['checkSalesBreakdown'];
      this.printService.popupWindow(url, 'Data', window, 800, 800);
      localStorage.setItem('Data', JSON.stringify(data));
      localStorage.setItem('Title', 'CHECKS SALES FROM '+
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' +
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))
      );
    }

    if(button.Label.includes('Payables Due')){
      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printpayabledues']));
      var data  = this.totals['payablesReceipts'];
      var title = 'PAYABLE DUES FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo));
      this.printService.popupWindow(url, 'printpayabledues', window, 800, 800);
      localStorage.setItem('PayableDues', JSON.stringify(data));
      localStorage.setItem('Data3', JSON.stringify(data));
      localStorage.setItem('Title', title);
      localStorage.setItem('Title3', title);
      localStorage.setItem('Type3', 'Title');
    }

    if(button.Label.includes('Receivables Due')){
      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printreceivabledues']));
      var data  = this.totals['receivableReceipts'];
      var title = 'RECEIVABLES DUES FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo));
      this.printService.popupWindow(url, 'printreceivabledues', window, 800, 800);
      localStorage.setItem('ReceivableDues', JSON.stringify(data));
      localStorage.setItem('Data2', JSON.stringify(data));
      localStorage.setItem('Title', title);
      localStorage.setItem('Title2', title);
      localStorage.setItem('Type2', 'Title');
    }
  }
}
