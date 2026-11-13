import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './layouts/landing/landing.component';
import { LoginComponent } from './layouts/login/login.component';
import { HomeComponent } from './layouts/home/home.component';
import { ProfileComponent } from './layouts/home/AccessRights/profile/profile.component';
import { BusinessInfoComponent } from './layouts/home/Config/business-info/business-info.component';
import { MachinePermitsComponent } from './layouts/home/BIR/machine-permits/machine-permits.component';
import { VendorPermitsComponent } from './layouts/home/BIR/vendor-permits/vendor-permits.component';
import { UserMenusComponent } from './layouts/home/AccessRights/user-menus/user-menus.component';
import { AccessRightsComponent } from './layouts/home/AccessRights/access-rights/access-rights.component';
import { UserAccountsComponent } from './layouts/home/AccessRights/user-accounts/user-accounts.component';
import { UserActivitiesComponent } from './layouts/home/AccessRights/user-activities/user-activities.component';
import { PrintComponent } from './layouts/prints/print/print.component';
import { PrintUserActivitiesComponent } from './layouts/prints/print-user-activities/print-user-activities.component';
import { PrintUserAccountsComponent } from './layouts/prints/print-user-accounts/print-user-accounts.component';
import { PrintMachinePermitsComponent } from './layouts/prints/print-machine-permits/print-machine-permits.component';
import { ItemsComponent } from './layouts/home/Files/items/items.component';
import { CustomersComponent } from './layouts/home/Files/customers/customers.component';
import { SuppliersComponent } from './layouts/home/Files/suppliers/suppliers.component';
import { MenuCostingComponent } from './layouts/home/Menus/menu-costing/menu-costing.component';
import { MenuSalesReportComponent } from './layouts/home/Menus/menu-sales-report/menu-sales-report.component';
import { EndOfDayInventoryComponent } from './layouts/home/Menus/end-of-day-inventory/end-of-day-inventory.component';
import { ProductionTransactionComponent } from './layouts/home/Menus/production-transaction/production-transaction.component';
import { ProductionReceiptsComponent } from './layouts/home/Menus/production-receipts/production-receipts.component';
import { ProductionReportsComponent } from './layouts/home/Menus/production-reports/production-reports.component';
import { PrintDataListComponent } from './layouts/prints/print-data-list/print-data-list.component';
import { PrintOrderSlipComponent } from './layouts/prints/print-order-slip/print-order-slip.component';
import { TablesUIComponent } from './layouts/home/Files/tables-ui/tables-ui.component';
import { PrintersUIComponent } from './layouts/home/Files/printers-ui/printers-ui.component';
import { FilesConfigUIComponent } from './layouts/home/Files/files-config-ui/files-config-ui.component';
import { PrintItemsComponent } from './layouts/prints/print-items/print-items.component';
import { PrintCustomersComponent } from './layouts/prints/print-customers/print-customers.component';
import { PrintSuppliersComponent } from './layouts/prints/print-suppliers/print-suppliers.component';
import { PrintBarcodeItemsComponent } from './layouts/prints/print-barcode-items/print-barcode-items.component';
import { StocksComponent } from './layouts/home/Inventory/stocks/stocks.component';
import { StockTotalsComponent } from './layouts/home/Inventory/stock-totals/stock-totals.component';
import { StockEndingBalanceComponent } from './layouts/home/Inventory/stock-ending-balance/stock-ending-balance.component';
import { StocksExpiryComponent } from './layouts/home/Inventory/stocks-expiry/stocks-expiry.component';
import { InventoryStocksComponent } from './layouts/home/Inventory/inventory-stocks/inventory-stocks.component';
import { InventoryHistoryComponent } from './layouts/home/Inventory/inventory-history/inventory-history.component';
import { PrintStocksComponent } from './layouts/prints/print-stocks/print-stocks.component';
import { PrintStocksTotalsComponent } from './layouts/prints/print-stocks-totals/print-stocks-totals.component';
import { PrintStocksEndingBalanceComponent } from './layouts/prints/print-stocks-ending-balance/print-stocks-ending-balance.component';
import { PrintStockLedgerComponent } from './layouts/prints/print-stock-ledger/print-stock-ledger.component';
import { PrintInventoryStocksComponent } from './layouts/prints/print-inventory-stocks/print-inventory-stocks.component';
import { PrintInventoryHistoryComponent } from './layouts/prints/print-inventory-history/print-inventory-history.component';
import { PrintKitchenQueueHistoryComponent } from './layouts/prints/print-kitchen-queue-history/print-kitchen-queue-history.component';
import { PrintInventoryDetailsComponent } from './layouts/prints/print-inventory-details/print-inventory-details.component';
import { InventoryConfigUIComponent } from './layouts/home/Inventory/inventory-config-ui/inventory-config-ui.component';
import { DevelopersMessageUIComponent } from './layouts/home/Config/developers-message-ui/developers-message-ui.component';
import { VoucherRequestUIComponent } from './layouts/home/Vouchering/voucher-request-ui/voucher-request-ui.component';
import { VoucherTransUIComponent } from './layouts/home/Vouchering/voucher-trans-ui/voucher-trans-ui.component';
import { VoucherRecordsUIComponent } from './layouts/home/Vouchering/voucher-records-ui/voucher-records-ui.component';
import { VoucherReportsUIComponent } from './layouts/home/Vouchering/voucher-reports-ui/voucher-reports-ui.component';
import { SalesReceiptsComponent } from './layouts/home/Sales/sales-receipts/sales-receipts.component';
import { SalesReportsComponent } from './layouts/home/Sales/sales-reports/sales-reports.component';
import { SalesJournalComponent } from './layouts/home/Sales/sales-journal/sales-journal.component';
import { SalesLedgerComponent } from './layouts/home/Sales/sales-ledger/sales-ledger.component';
import { SalesOrderingComponent } from './layouts/home/Sales/sales-ordering/sales-ordering.component';
import { SalesCashieringComponent } from './layouts/home/Sales/sales-cashiering/sales-cashiering.component';
import { SalesConfigComponent } from './layouts/home/Sales/sales-config/sales-config.component';
import { PrintPOSComponent } from './layouts/prints/print-pos/print-pos.component';
import { PrintPOSBIRComponent } from './layouts/prints/print-posbir/print-posbir.component';
import { PrintSaleReceiptsComponent } from './layouts/prints/print-sale-receipts/print-sale-receipts.component';
import { PrintSaleDetailsComponent } from './layouts/prints/print-sale-details/print-sale-details.component';
import { PrintAccountingEntryComponent } from './layouts/prints/print-accounting-entry/print-accounting-entry.component';
import { PrintYearlySalesReportComponent } from './layouts/prints/print-yearly-sales-report/print-yearly-sales-report.component';
import { PrintMonthlySalesReportComponent } from './layouts/prints/print-monthly-sales-report/print-monthly-sales-report.component';
import { PrintDailySalesReportComponent } from './layouts/prints/print-daily-sales-report/print-daily-sales-report.component';
import { PrintVoidSalesReportComponent } from './layouts/prints/print-void-sales-report/print-void-sales-report.component';
import { PrintDiscountSalesReportComponent } from './layouts/prints/print-discount-sales-report/print-discount-sales-report.component';
import { PrintCustomerSalesReportComponent } from './layouts/prints/print-customer-sales-report/print-customer-sales-report.component';
import { PrintWHTaxSalesReportComponent } from './layouts/prints/print-whtax-sales-report/print-whtax-sales-report.component';
import { PrintVATSalesReportComponent } from './layouts/prints/print-vatsales-report/print-vatsales-report.component';
import { PrintRebatePaidSalesReportComponent } from './layouts/prints/print-rebate-paid-sales-report/print-rebate-paid-sales-report.component';
import { PrintGeneralJournalComponent } from './layouts/prints/print-general-journal/print-general-journal.component';
import { PrintGeneralLedgerComponent } from './layouts/prints/print-general-ledger/print-general-ledger.component';
import { CashDrawerUIComponent } from './layouts/home/Cashiering/cash-drawer-ui/cash-drawer-ui.component';
import { CashieringRecordsComponent } from './layouts/home/Cashiering/cashiering-records/cashiering-records.component';
import { CashieringReportsComponent } from './layouts/home/Cashiering/cashiering-reports/cashiering-reports.component';
import { CashieringAccessRightsComponent } from './layouts/home/Cashiering/cashiering-access-rights/cashiering-access-rights.component';
import { CashieringConfigComponent } from './layouts/home/Cashiering/cashiering-config/cashiering-config.component';
import { CashDrawerComponent } from './layouts/home/Cashiering/cash-drawer/cash-drawer.component';
import { ReceivingReceiptsComponent } from './layouts/home/Receiving/receiving-receipts/receiving-receipts.component';
import { ReceivingReportsComponent } from './layouts/home/Receiving/receiving-reports/receiving-reports.component';
import { ReceivingJournalComponent } from './layouts/home/Receiving/receiving-journal/receiving-journal.component';
import { ReceivingLedgerComponent } from './layouts/home/Receiving/receiving-ledger/receiving-ledger.component';
import { ReceivingConfigComponent } from './layouts/home/Receiving/receiving-config/receiving-config.component';
import { PrintReceivingDetailsComponent } from './layouts/prints/print-receiving-details/print-receiving-details.component';
import { PrintReceivingReceiptsComponent } from './layouts/prints/print-receiving-receipts/print-receiving-receipts.component';
import { PrintYearlyReceivingReportComponent } from './layouts/prints/print-yearly-receiving-report/print-yearly-receiving-report.component';
import { PrintMonthlyReceivingReportComponent } from './layouts/prints/print-monthly-receiving-report/print-monthly-receiving-report.component';
import { PrintDailyReceivingReportComponent } from './layouts/prints/print-daily-receiving-report/print-daily-receiving-report.component';
import { PrintVoidReceivingReportComponent } from './layouts/prints/print-void-receiving-report/print-void-receiving-report.component';
import { PrintDiscountReceivingReportComponent } from './layouts/prints/print-discount-receiving-report/print-discount-receiving-report.component';
import { PrintWHTaxReceivingReportComponent } from './layouts/prints/print-whtax-receiving-report/print-whtax-receiving-report.component';
import { PrintVATReceivingReportComponent } from './layouts/prints/print-vatreceiving-report/print-vatreceiving-report.component';
import { PrintSupplierReceivingReportComponent } from './layouts/prints/print-supplier-receiving-report/print-supplier-receiving-report.component';
import { ExpenseReceiptsComponent } from './layouts/home/Expenses/expense-receipts/expense-receipts.component';
import { ExpenseReportsComponent } from './layouts/home/Expenses/expense-reports/expense-reports.component';
import { ExpenseJournalComponent } from './layouts/home/Expenses/expense-journal/expense-journal.component';
import { ExpenseLedgerComponent } from './layouts/home/Expenses/expense-ledger/expense-ledger.component';
import { ExpenseConfigComponent } from './layouts/home/Expenses/expense-config/expense-config.component';
import { PrintExpenseDetailsComponent } from './layouts/prints/print-expense-details/print-expense-details.component';
import { PrintExpenseReceiptsComponent } from './layouts/prints/print-expense-receipts/print-expense-receipts.component';
import { PrintYearlyExpensesReportComponent } from './layouts/prints/print-yearly-expenses-report/print-yearly-expenses-report.component';
import { PrintMonthlyExpensesReportComponent } from './layouts/prints/print-monthly-expenses-report/print-monthly-expenses-report.component';
import { SaleReturnReceiptsComponent } from './layouts/home/SaleReturn/sale-return-receipts/sale-return-receipts.component';
import { SaleReturnReportsComponent } from './layouts/home/SaleReturn/sale-return-reports/sale-return-reports.component';
import { SaleReturnConfigComponent } from './layouts/home/SaleReturn/sale-return-config/sale-return-config.component';
import { PrintSaleReturnReceiptsComponent } from './layouts/prints/print-sale-return-receipts/print-sale-return-receipts.component';
import { PrintSaleReturnDetailsComponent } from './layouts/prints/print-sale-return-details/print-sale-return-details.component';
import { PrintCashierLedgersComponent } from './layouts/prints/print-cashier-ledgers/print-cashier-ledgers.component';
import { PrintCashReadingsComponent } from './layouts/prints/print-cash-readings/print-cash-readings.component';
import { PrintSaleReadingsComponent } from './layouts/prints/print-sale-readings/print-sale-readings.component';
import { PrintWithdrawalsComponent } from './layouts/prints/print-withdrawals/print-withdrawals.component';
import { PrintWithdrawalReceiptComponent } from './layouts/prints/print-withdrawal-receipt/print-withdrawal-receipt.component';
import { PrintCashReadingComponent } from './layouts/prints/print-cash-reading/print-cash-reading.component';
import { POSPrintCashReadingComponent } from './layouts/prints/posprint-cash-reading/posprint-cash-reading.component';
import { PrintCashieringRecordDetailsComponent } from './layouts/prints/print-cashiering-record-details/print-cashiering-record-details.component';
import { PrintSaleReadingDetailsComponent } from './layouts/prints/print-sale-reading-details/print-sale-reading-details.component';
import { CashAccountsComponent } from './layouts/home/Cashflow/cash-accounts/cash-accounts.component';
import { CashTransfersComponent } from './layouts/home/Cashflow/cash-transfers/cash-transfers.component';
import { CashAccountLedgerComponent } from './layouts/home/Cashflow/cash-account-ledger/cash-account-ledger.component';
import { CashTransferJournalComponent } from './layouts/home/Cashflow/cash-transfer-journal/cash-transfer-journal.component';
import { CashTransferLedgerComponent } from './layouts/home/Cashflow/cash-transfer-ledger/cash-transfer-ledger.component';
import { PrintCashTransferReceiptComponent } from './layouts/prints/print-cash-transfer-receipt/print-cash-transfer-receipt.component';
import { PrintCashTransfersComponent } from './layouts/prints/print-cash-transfers/print-cash-transfers.component';
import { CommandCenterComponent } from './layouts/home/Reports/command-center/command-center.component';
import { NetCashReportComponent } from './layouts/home/Reports/net-cash-report/net-cash-report.component';
import { FastSlowMovingItemsComponent } from './layouts/home/Reports/fast-slow-moving-items/fast-slow-moving-items.component';
import { ItemHistoryComponent } from './layouts/home/Reports/item-history/item-history.component';
import { CustomerHistoryComponent } from './layouts/home/Reports/customer-history/customer-history.component';
import { SupplierHistoryComponent } from './layouts/home/Reports/supplier-history/supplier-history.component';
import { PrintDailyNetCashComponent } from './layouts/prints/print-daily-net-cash/print-daily-net-cash.component';
import { PrintMonthlyNetCashComponent } from './layouts/prints/print-monthly-net-cash/print-monthly-net-cash.component';
import { PrintBreakdownNetCashComponent } from './layouts/prints/print-breakdown-net-cash/print-breakdown-net-cash.component';
import { PrintFastSlowMovingItemsComponent } from './layouts/prints/print-fast-slow-moving-items/print-fast-slow-moving-items.component';
import { PrintItemCustomersComponent } from './layouts/prints/print-item-customers/print-item-customers.component';
import { PrintItemSuppliersComponent } from './layouts/prints/print-item-suppliers/print-item-suppliers.component';
import { PrintItemAdjustmentsComponent } from './layouts/prints/print-item-adjustments/print-item-adjustments.component';
import { PrintItemSaleReturnsComponent } from './layouts/prints/print-item-sale-returns/print-item-sale-returns.component';
import { PrintItemReturnToSuppliersComponent } from './layouts/prints/print-item-return-to-suppliers/print-item-return-to-suppliers.component';
import { PrintCustomerItemsComponent } from './layouts/prints/print-customer-items/print-customer-items.component';
import { PrintCustomerSaleReturnsComponent } from './layouts/prints/print-customer-sale-returns/print-customer-sale-returns.component';
import { PrintSupplierItemsComponent } from './layouts/prints/print-supplier-items/print-supplier-items.component';
import { PrintSupplierReturnToSuppliersComponent } from './layouts/prints/print-supplier-return-to-suppliers/print-supplier-return-to-suppliers.component';
import { AccountTitlesComponent } from './layouts/home/Accounting/account-titles/account-titles.component';
import { AdjustingEntriesComponent } from './layouts/home/Accounting/adjusting-entries/adjusting-entries.component';
import { GeneralJournalComponent } from './layouts/home/Accounting/general-journal/general-journal.component';
import { GeneralLedgerComponent } from './layouts/home/Accounting/general-ledger/general-ledger.component';
import { CashflowLedgerComponent } from './layouts/home/Accounting/cashflow-ledger/cashflow-ledger.component';
import { TrialBalanceComponent } from './layouts/home/Accounting/trial-balance/trial-balance.component';
import { FinancialStatementsComponent } from './layouts/home/Accounting/financial-statements/financial-statements.component';
import { PrintAccountTitlesComponent } from './layouts/prints/print-account-titles/print-account-titles.component';
import { PrintAdjustingEntryRecordsComponent } from './layouts/prints/print-adjusting-entry-records/print-adjusting-entry-records.component';
import { PrintAdjustingEntryDetailComponent } from './layouts/prints/print-adjusting-entry-detail/print-adjusting-entry-detail.component';
import { PrintCashflowLedgerComponent } from './layouts/prints/print-cashflow-ledger/print-cashflow-ledger.component';
import { PrintTrialBalanceComponent } from './layouts/prints/print-trial-balance/print-trial-balance.component';
import { PrintIncomeStatementsComponent } from './layouts/prints/print-income-statements/print-income-statements.component';
import { PrintBalanceSheetComponent } from './layouts/prints/print-balance-sheet/print-balance-sheet.component';
import { PrintCashflowStatementsComponent } from './layouts/prints/print-cashflow-statements/print-cashflow-statements.component';
import { StockAdjustmentJournalComponent } from './layouts/home/StockAdjustments/stock-adjustment-journal/stock-adjustment-journal.component';
import { StockAdjustmentLedgerComponent } from './layouts/home/StockAdjustments/stock-adjustment-ledger/stock-adjustment-ledger.component';
import { StockAdjustmentReceiptsComponent } from './layouts/home/StockAdjustments/stock-adjustment-receipts/stock-adjustment-receipts.component';
import { StockAdjustmentReportsComponent } from './layouts/home/StockAdjustments/stock-adjustment-reports/stock-adjustment-reports.component';
import { PrintStockAdjustmentDetailsComponent } from './layouts/prints/print-stock-adjustment-details/print-stock-adjustment-details.component';
import { PrintStockAdjustmentReceiptsComponent } from './layouts/prints/print-stock-adjustment-receipts/print-stock-adjustment-receipts.component';
import { PrintStockAdjustmentReportsComponent } from './layouts/prints/print-stock-adjustment-reports/print-stock-adjustment-reports.component';
import { ReturnToSupplierReceiptsComponent } from './layouts/home/ReturnToSupplier/return-to-supplier-receipts/return-to-supplier-receipts.component';
import { ReturnToSupplierReportsComponent } from './layouts/home/ReturnToSupplier/return-to-supplier-reports/return-to-supplier-reports.component';
import { ReturnToSupplierConfigComponent } from './layouts/home/ReturnToSupplier/return-to-supplier-config/return-to-supplier-config.component';
import { PrintReturnToSupplierDetailsComponent } from './layouts/prints/print-return-to-supplier-details/print-return-to-supplier-details.component';
import { PrintReturnToSupplierReceiptsComponent } from './layouts/prints/print-return-to-supplier-receipts/print-return-to-supplier-receipts.component';
import { PrintReturnToSupplierReportComponent } from './layouts/prints/print-return-to-supplier-report/print-return-to-supplier-report.component';
import { PaymentReceiptsComponent } from './layouts/home/Receivables/payment-receipts/payment-receipts.component';
import { PaymentReportsComponent } from './layouts/home/Receivables/payment-reports/payment-reports.component';
import { CustomerPaymentLedgerComponent } from './layouts/home/Receivables/customer-payment-ledger/customer-payment-ledger.component';
import { CustomerLedgerComponent } from './layouts/home/Receivables/customer-ledger/customer-ledger.component';
import { CustomerChecksComponent } from './layouts/home/CustomerChecks/customer-checks/customer-checks.component';
import { CustomerChecksReportComponent } from './layouts/home/CustomerChecks/customer-checks-report/customer-checks-report.component';
import { ReceivableDuesComponent } from './layouts/home/Receivables/receivable-dues/receivable-dues.component';
import { ReceivableReportsComponent } from './layouts/home/Receivables/receivable-reports/receivable-reports.component';
import { ReceivableConfigComponent } from './layouts/home/Receivables/receivable-config/receivable-config.component';
import { CustomerPaymentJournalComponent } from './layouts/home/Receivables/customer-payment-journal/customer-payment-journal.component';
import { PrintPaymentDetailsComponent } from './layouts/prints/print-payment-details/print-payment-details.component';
import { PrintPaymentReceiptsComponent } from './layouts/prints/print-payment-receipts/print-payment-receipts.component';
import { PrintPaymentReportsComponent } from './layouts/prints/print-payment-reports/print-payment-reports.component';
import { PrintCustomerLedgerComponent } from './layouts/prints/print-customer-ledger/print-customer-ledger.component';
import { PrintCustomerChecksComponent } from './layouts/prints/print-customer-checks/print-customer-checks.component';
import { PrintCustomerChecksReportComponent } from './layouts/prints/print-customer-checks-report/print-customer-checks-report.component';
import { PrintReceivableDuesComponent } from './layouts/prints/print-receivable-dues/print-receivable-dues.component';
import { PrintReceivableReportsComponent } from './layouts/prints/print-receivable-reports/print-receivable-reports.component';
import { PrintReceivableOldReceiptsComponent } from './layouts/prints/print-receivable-old-receipts/print-receivable-old-receipts.component';
import { PrintReceivableOldReceiptComponent } from './layouts/prints/print-receivable-old-receipt/print-receivable-old-receipt.component';
import { SupplierPaymentReceiptsComponent } from './layouts/home/Payables/supplier-payment-receipts/supplier-payment-receipts.component';
import { SupplierPaymentReportsComponent } from './layouts/home/Payables/supplier-payment-reports/supplier-payment-reports.component';
import { SupplierPaymentJournalComponent } from './layouts/home/Payables/supplier-payment-journal/supplier-payment-journal.component';
import { SupplierPaymentLedgerComponent } from './layouts/home/Payables/supplier-payment-ledger/supplier-payment-ledger.component';
import { SupplierLedgerComponent } from './layouts/home/Payables/supplier-ledger/supplier-ledger.component';
import { PayableDuesComponent } from './layouts/home/Payables/payable-dues/payable-dues.component';
import { PayableReportsComponent } from './layouts/home/Payables/payable-reports/payable-reports.component';
import { PayableConfigComponent } from './layouts/home/Payables/payable-config/payable-config.component';
import { PrintPayableOldReceiptsComponent } from './layouts/prints/print-payable-old-receipts/print-payable-old-receipts.component';
import { PrintPayableOldReceiptComponent } from './layouts/prints/print-payable-old-receipt/print-payable-old-receipt.component';
import { PrintSupplierPaymentDetailsComponent } from './layouts/prints/print-supplier-payment-details/print-supplier-payment-details.component';
import { PrintSupplierPaymentReceiptsComponent } from './layouts/prints/print-supplier-payment-receipts/print-supplier-payment-receipts.component';
import { PrintSupplierLedgerComponent } from './layouts/prints/print-supplier-ledger/print-supplier-ledger.component';
import { PrintPayableDuesComponent } from './layouts/prints/print-payable-dues/print-payable-dues.component';
import { PrintPayableReportsComponent } from './layouts/prints/print-payable-reports/print-payable-reports.component';
import { ValidateLicenseUIComponent } from './layouts/validate-license-ui/validate-license-ui.component';
import { ContactSupportUIComponent } from './layouts/home/Support/contact-support-ui/contact-support-ui.component';
import { SupportEvaluationUIComponent } from './layouts/home/Support/support-evaluation-ui/support-evaluation-ui.component';
import { SoftwareEvaluationUIComponent } from './layouts/home/Support/software-evaluation-ui/software-evaluation-ui.component';
import { SuggestionBoxUIComponent } from './layouts/home/Support/suggestion-box-ui/suggestion-box-ui.component';
import { PrintStocksExpiryComponent } from './layouts/prints/print-stocks-expiry/print-stocks-expiry.component';
import { OrderReportsComponent } from './layouts/home/Orders/order-reports/order-reports.component';
import { OrderConfigComponent } from './layouts/home/Orders/order-config/order-config.component';
import { OrderReceiptsComponent } from './layouts/home/Orders/order-receipts/order-receipts.component';
import { PrintOrderReceiptsComponent } from './layouts/prints/print-order-receipts/print-order-receipts.component';
import { PrintOrderDetailsComponent } from './layouts/prints/print-order-details/print-order-details.component';
import { PrintOrderReportsComponent } from './layouts/prints/print-order-reports/print-order-reports.component';
import { DeliveryReceiptsComponent } from './layouts/home/Delivery/delivery-receipts/delivery-receipts.component';
import { DeliveryReportsComponent } from './layouts/home/Delivery/delivery-reports/delivery-reports.component';
import { DeliveryConfigComponent } from './layouts/home/Delivery/delivery-config/delivery-config.component';
import { PrintDeliveryDetailsComponent } from './layouts/prints/print-delivery-details/print-delivery-details.component';
import { PrintDeliveryReceiptsComponent } from './layouts/prints/print-delivery-receipts/print-delivery-receipts.component';
import { PrintDeliveryReportsComponent } from './layouts/prints/print-delivery-reports/print-delivery-reports.component';
import { CanvassForApprovalComponent } from './layouts/home/Canvassing/canvass-for-approval/canvass-for-approval.component';
import { CanvassReceiptsComponent } from './layouts/home/Canvassing/canvass-receipts/canvass-receipts.component';
import { CanvassReportsComponent } from './layouts/home/Canvassing/canvass-reports/canvass-reports.component';
import { PrintCanvassDetailsComponent } from './layouts/prints/print-canvass-details/print-canvass-details.component';
import { PrintCanvassReceiptsComponent } from './layouts/prints/print-canvass-receipts/print-canvass-receipts.component';
import { PrintCanvassReportsComponent } from './layouts/prints/print-canvass-reports/print-canvass-reports.component';
import { POReceiptsComponent } from './layouts/home/Purchasing/poreceipts/poreceipts.component';
import { POReportsComponent } from './layouts/home/Purchasing/poreports/poreports.component';
import { POConfigComponent } from './layouts/home/Purchasing/poconfig/poconfig.component';
import { PrintPOReceiptsComponent } from './layouts/prints/print-poreceipts/print-poreceipts.component';
import { PrintPODetailsComponent } from './layouts/prints/print-podetails/print-podetails.component';
import { PrintPOReportsComponent } from './layouts/prints/print-poreports/print-poreports.component';
import { PrintVoucherReceiptsComponent } from './layouts/prints/print-voucher-receipts/print-voucher-receipts.component';
import { PrintVoucherReceiptComponent } from './layouts/prints/print-voucher-receipt/print-voucher-receipt.component';
import { PrintVoucherReportsComponent } from './layouts/prints/print-voucher-reports/print-voucher-reports.component';
import { PettyCashVoucherComponent } from './layouts/home/Vouchering/petty-cash-voucher/petty-cash-voucher.component';
import { PrintSaleReturnReportsComponent } from './layouts/prints/print-sale-return-reports/print-sale-return-reports.component';
import { PrintSalesTypeReadingComponent } from './layouts/prints/print-sales-type-reading/print-sales-type-reading.component';
import { DisbursementRequestsComponent } from './layouts/home/Disbursements/disbursement-requests/disbursement-requests.component';
import { DisbursementRecordsComponent } from './layouts/home/Disbursements/disbursement-records/disbursement-records.component';
import { DisbursementReportsComponent } from './layouts/home/Disbursements/disbursement-reports/disbursement-reports.component';
import { DisbursedChecksComponent } from './layouts/home/Disbursements/disbursed-checks/disbursed-checks.component';
import { UnliquidatedPettyCashComponent } from './layouts/home/Disbursements/unliquidated-petty-cash/unliquidated-petty-cash.component';
import { LiquidatedPettyCashComponent } from './layouts/home/Disbursements/liquidated-petty-cash/liquidated-petty-cash.component';
import { PrintReceivingAveCostHistoryComponent } from './layouts/prints/print-receiving-ave-cost-history/print-receiving-ave-cost-history.component';
import { BranchesComponent } from './layouts/home/Files/branches/branches.component';
import { PrintDisbursementReceiptComponent } from './layouts/prints/print-disbursement-receipt/print-disbursement-receipt.component';
import { PrintDisbursementReceiptsComponent } from './layouts/prints/print-disbursement-receipts/print-disbursement-receipts.component';
import { PrintDisbursementReportsComponent } from './layouts/prints/print-disbursement-reports/print-disbursement-reports.component';
import { PrintDisbursedChecksComponent } from './layouts/prints/print-disbursed-checks/print-disbursed-checks.component';
import { PrintPettyCashRecordsComponent } from './layouts/prints/print-petty-cash-records/print-petty-cash-records.component';
import { PrintPettyCashDetailsReceiptComponent } from './layouts/prints/print-petty-cash-details-receipt/print-petty-cash-details-receipt.component';
import { StocksInquiryComponent } from './layouts/home/Inventory/stocks-inquiry/stocks-inquiry.component';
import { PrintStocksInquiryComponent } from './layouts/prints/print-stocks-inquiry/print-stocks-inquiry.component';
import { XZReadingsComponent } from './layouts/home/BIR/xzreadings/xzreadings.component';
import { EReceiptsComponent } from './layouts/home/BIR/ereceipts/ereceipts.component';
import { ESalesBookComponent } from './layouts/home/BIR/esales-book/esales-book.component';
import { BIRDiscountsComponent } from './layouts/home/BIR/birdiscounts/birdiscounts.component';
import { VATSaleTypesComponent } from './layouts/home/BIR/vatsale-types/vatsale-types.component';
import { BIRSalesReportComponent } from './layouts/home/BIR/bir-sales-report/bir-sales-report.component';
import { PrintBIRSalesReportComponent } from './layouts/prints/print-bir-sales-report/print-bir-sales-report.component';
import { ExpensePayeesUIComponent } from './layouts/home/Expenses/expense-payees-ui/expense-payees-ui.component';
import { ExpenseParticularsUIComponent } from './layouts/home/Expenses/expense-particulars-ui/expense-particulars-ui.component';
import { PrintZReadingsComponent } from './layouts/prints/print-zreadings/print-zreadings.component';
import { PrintZReadingReceiptComponent } from './layouts/prints/print-zreading-receipt/print-zreading-receipt.component';
import { PrintZReadingPOSComponent } from './layouts/prints/print-zreading-pos/print-zreading-pos.component';
import { PrintXReadingReceiptComponent } from './layouts/prints/print-xreading-receipt/print-xreading-receipt.component';
import { PrintXReadingPOSComponent } from './layouts/prints/print-xreading-pos/print-xreading-pos.component';
import { PrintESalesBookComponent } from './layouts/prints/print-esales-book/print-esales-book.component';
import { PrintBIRDiscountsComponent } from './layouts/prints/print-birdiscounts/print-birdiscounts.component';
import { PrintVATSalesTypeComponent } from './layouts/prints/print-vatsales-type/print-vatsales-type.component';
import { EncryptedRedirectComponent } from './layouts/encrypted-redirect/encrypted-redirect.component';
import { SalesSignaturesComponent } from './layouts/home/Sales/sales-signatures/sales-signatures.component';
import { OrdersSignaturesComponent } from './layouts/home/Orders/orders-signatures/orders-signatures.component';
import { DeliverySignaturesComponent } from './layouts/home/Delivery/delivery-signatures/delivery-signatures.component';
import { CanvassSignaturesComponent } from './layouts/home/Canvassing/canvass-signatures/canvass-signatures.component';
import { POSignaturesComponent } from './layouts/home/Purchasing/posignatures/posignatures.component';
import { ReceivingSignaturesComponent } from './layouts/home/Receiving/receiving-signatures/receiving-signatures.component';
import { PaymentSignaturesComponent } from './layouts/home/Receivables/payment-signatures/payment-signatures.component';
import { PayeeSignaturesComponent } from './layouts/home/Payables/payee-signatures/payee-signatures.component';
import { ExpenseSignaturesComponent } from './layouts/home/Expenses/expense-signatures/expense-signatures.component';
import { AdjustmentSignaturesComponent } from './layouts/home/StockAdjustments/adjustment-signatures/adjustment-signatures.component';
import { SaleReturnSignaturesComponent } from './layouts/home/SaleReturn/sale-return-signatures/sale-return-signatures.component';
import { ReturnToSupplierSignaturesComponent } from './layouts/home/ReturnToSupplier/return-to-supplier-signatures/return-to-supplier-signatures.component';
import { VoucherSignaturesComponent } from './layouts/home/Vouchering/voucher-signatures/voucher-signatures.component';
import { DisbursementSignaturesComponent } from './layouts/home/Disbursements/disbursement-signatures/disbursement-signatures.component';
import { ProfitPerformanceComponent } from './layouts/home/Accounting/profit-performance/profit-performance.component';
import { DebtToCashCoverageComponent } from './layouts/home/Accounting/debt-to-cash-coverage/debt-to-cash-coverage.component';
import { PrintProfitPerformanceComponent } from './layouts/prints/print-profit-performance/print-profit-performance.component';
import { PrintDebtToCashCoverageComponent } from './layouts/prints/print-debt-to-cash-coverage/print-debt-to-cash-coverage.component';
import { PrintCashAccountLedgerComponent } from './layouts/prints/print-cash-account-ledger/print-cash-account-ledger.component';
import { OrderTransaction2Component } from './layouts/home/Orders/order-transaction2/order-transaction2.component';
import { SalesTransaction2Component } from './layouts/home/Sales/sales-transaction2/sales-transaction2.component';
import { KitchenQueueComponent } from './layouts/home/Sales/kitchen-queue/kitchen-queue.component';
import { DeliveryTransaction2Component } from './layouts/home/Delivery/delivery-transaction2/delivery-transaction2.component';
import { CanvassTransaction2Component } from './layouts/home/Canvassing/canvass-transaction2/canvass-transaction2.component';
import { POTransaction2Component } from './layouts/home/Purchasing/potransaction2/potransaction2.component';
import { ReceivingTransaction2Component } from './layouts/home/Receiving/receiving-transaction2/receiving-transaction2.component';
import { PaymentTransaction2Component } from './layouts/home/Receivables/payment-transaction2/payment-transaction2.component';
import { PayeeTransaction2Component } from './layouts/home/Payables/payee-transaction2/payee-transaction2.component';
import { ExpenseTransaction2Component } from './layouts/home/Expenses/expense-transaction2/expense-transaction2.component';
import { StockAdjustmentTransaction2Component } from './layouts/home/StockAdjustments/stock-adjustment-transaction2/stock-adjustment-transaction2.component';
import { SaleReturnTransaction2Component } from './layouts/home/SaleReturn/sale-return-transaction2/sale-return-transaction2.component';
import { ReturnToSupplierTransaction2Component } from './layouts/home/ReturnToSupplier/return-to-supplier-transaction2/return-to-supplier-transaction2.component';
import { PrintStockTransferDetailsComponent } from './layouts/prints/print-stock-transfer-details/print-stock-transfer-details.component';
import { PrintStockTransferReceiptsComponent } from './layouts/prints/print-stock-transfer-receipts/print-stock-transfer-receipts.component';
import { PopupAccessRightsUIComponent } from './layouts/home/Support/popup-access-rights-ui/popup-access-rights-ui.component';
import { StockAdjustmentConfigComponent } from './layouts/home/StockAdjustments/stock-adjustment-config/stock-adjustment-config.component';
import { PrintItemPriceHistoryComponent } from './layouts/prints/print-item-price-history/print-item-price-history.component';
import { PrintItemCostHistoryComponent } from './layouts/prints/print-item-cost-history/print-item-cost-history.component';
import { BackupComponent } from './layouts/home/Config/backup/backup.component';
import { PrintDailyStockAdjustmentReportComponent } from './layouts/prints/print-daily-stock-adjustment-report/print-daily-stock-adjustment-report.component';
import { PrintMonthlyStockAdjustmentReportComponent } from './layouts/prints/print-monthly-stock-adjustment-report/print-monthly-stock-adjustment-report.component';
import { SupplierChecksComponent } from './layouts/home/SupplierChecks/supplier-checks/supplier-checks.component';
import { CheckReportsUIComponent } from './layouts/home/Cashflow/check-reports-ui/check-reports-ui.component';
import { PrintCheckReportsComponent } from './layouts/prints/print-check-reports/print-check-reports.component';
import { PrintSupplierChecksComponent } from './prints/print-supplier-checks/print-supplier-checks.component';

const routes: Routes = [
    {
      path: '',component: ValidateLicenseUIComponent,
    },
    {
      path: 'landing',component: LandingComponent,
      children:[
        {
          path: 'login', component: LoginComponent,
        }
      ]
    },
    {
      path: 'home', component: HomeComponent, data: { showLayout: true } ,
      children:[
        {
          path:'profile', component:ProfileComponent
        },
        {
          path: 'config/developers_message', component: DevelopersMessageUIComponent,
        },
        {
          path: 'config/backup', component: BackupComponent,
        },
        {
          path: 'support/popups', component: PopupAccessRightsUIComponent,
        },
        {
          path: 'support/business_info', component: BusinessInfoComponent,
        },
        {
          path: 'support/contact_support', component: ContactSupportUIComponent,
        },
        {
          path: 'support/support_evaluation', component: SupportEvaluationUIComponent,
        },
        {
          path: 'support/software_evaluation', component: SoftwareEvaluationUIComponent,
        },
        {
          path: 'support/suggestion_box', component: SuggestionBoxUIComponent,
        },
        {
          path: 'vouchering/voucher_requests', component: VoucherRequestUIComponent,
        },
        {
          path: 'vouchering/petty_cash_voucher', component: PettyCashVoucherComponent,
        },
        {
          path: 'vouchering/voucher_records', component: VoucherRecordsUIComponent,
        },
        {
          path: 'vouchering/voucher_reports', component: VoucherReportsUIComponent,
        },
        {
          path: 'vouchering/voucher_signatures', component: VoucherSignaturesComponent,
        },
        {
          path: 'disbursements/disbursement_requests', component: DisbursementRequestsComponent,
        },
        {
          path: 'disbursements/disbursement_records', component: DisbursementRecordsComponent,
        },
        {
          path: 'disbursements/disbursement_reports', component: DisbursementReportsComponent,
        },
        {
          path: 'disbursements/disbursed_checks', component: DisbursedChecksComponent,
        },
        {
          path: 'disbursements/unliquidated_petty_cash', component: UnliquidatedPettyCashComponent,data: { liquidated: false }
        },
        {
          path: 'disbursements/liquidated_petty_cash', component: UnliquidatedPettyCashComponent,data: { liquidated: true }
        },
        {
          path: 'disbursements/disbursement_signatures', component: DisbursementSignaturesComponent,
        },
        {
          path: 'access rights/user_menus', component: UserMenusComponent,
        },
        {
          path: 'access rights/access_rights', component: AccessRightsComponent,
        },
        {
          path: 'access rights/useraccounts', component: UserAccountsComponent,
        },
        {
          path: 'access rights/user_activities', component: UserActivitiesComponent,
        },
        {
          path: 'files/branches', component: BranchesComponent,
        },
        {
          path: 'files/items', component: ItemsComponent,
        },
        {
          path: 'files/customers', component: CustomersComponent,
        },
        {
          path: 'files/suppliers', component: SuppliersComponent,
        },
        {
          path: 'files/tables', component: TablesUIComponent,
        },
        {
          path: 'files/printers', component: PrintersUIComponent,
        },
        {
          path: 'files/files_config', component: FilesConfigUIComponent,
        },
        {
          path: 'menus/menu_costing', component: MenuCostingComponent,
        },
        {
          path: 'menus/menu_sales_report', component: MenuSalesReportComponent,
        },
        {
          path: 'menus/end_of_day_inventory', component: EndOfDayInventoryComponent,
        },
        {
          path: 'menus/production_transaction', component: ProductionTransactionComponent,
        },
        {
          path: 'menus/production_receipts', component: ProductionReceiptsComponent,
        },
        {
          path: 'menus/production_reports', component: ProductionReportsComponent,
        },
        {
          path: 'inventory/stocks', component: StocksComponent,
        },
        {
          path: 'inventory/stock_totals', component: StockTotalsComponent,
        },
        {
          path: 'inventory/stock_ending_balance', component: StockEndingBalanceComponent,
        },
        {
          path: 'inventory/stocks_expiry', component: StocksExpiryComponent,
        },
        {
          path: 'inventory/stocks_inquiry', component: StocksInquiryComponent,
        },
        {
          path: 'inventory/inventory_stocks', component: InventoryStocksComponent,
        },
        {
          path: 'inventory/inventory_history', component: InventoryHistoryComponent,
        },
        {
          path: 'inventory/inventory_config', component: InventoryConfigUIComponent,
        },
        {
          path: 'orders/order_transaction', component: OrderTransaction2Component,
        },
        {
          path: 'orders/order_receipts', component: OrderReceiptsComponent,
        },
        {
          path: 'orders/order_reports', component: OrderReportsComponent,
        },
        {
          path: 'orders/order_config', component: OrderConfigComponent,
        },
        {
          path: 'orders/order_signatures', component: OrdersSignaturesComponent,
        },
        {
          path: 'sales/sales_transactions', component: SalesTransaction2Component,
        },
        {
          path: 'sales/kitchen_queue', component: KitchenQueueComponent,
        },
        {
          path: 'sales/sales_receipts', component: SalesReceiptsComponent,
        },
        {
          path: 'sales/sales_reports', component: SalesReportsComponent,
        },
        {
          path: 'sales/sales_journal', component: SalesJournalComponent, // add parameter here
        },
        {
          path: 'sales/sales_ledger', component: SalesLedgerComponent,
        },
        {
          path: 'sales/ordering', component: SalesOrderingComponent,
        },
        {
          path: 'sales/cashiering', component: SalesCashieringComponent,
        },
        {
          path: 'sales/sales_config', component: SalesConfigComponent,
        },
        {
          path: 'sales/sales_signatures', component: SalesSignaturesComponent,
        },
        {
          path: 'cashiering/cashdrawer', component: CashDrawerComponent,
        },
        {
          path: 'cashiering/cashiering_records', component: CashieringRecordsComponent,
        },
        {
          path: 'cashiering/cashiering_reports', component: CashieringReportsComponent,
        },
        {
          path: 'cashiering/cashier_access_rights', component: CashieringAccessRightsComponent,
        },
        {
          path: 'cashiering/cashiering_config', component: CashieringConfigComponent,
        },
        {
          path: 'delivery/delivery_transaction', component: DeliveryTransaction2Component,
        },
        {
          path: 'delivery/delivery_receipts', component: DeliveryReceiptsComponent,
        },
        {
          path: 'delivery/delivery_reports', component: DeliveryReportsComponent,
        },
        {
          path: 'delivery/delivery_config', component: DeliveryConfigComponent,
        },
        {
          path: 'delivery/delivery_signatures', component: DeliverySignaturesComponent,
        },
        {
          path: 'canvassing/canvass_transaction', component: CanvassTransaction2Component,
        },
        {
          path: 'canvassing/canvass_for_approval', component: CanvassForApprovalComponent,
        },
        {
          path: 'canvassing/canvass_receipts', component: CanvassReceiptsComponent,
        },
        {
          path: 'canvassing/canvass_reports', component: CanvassReportsComponent,
        },
        {
          path: 'canvassing/canvass_signatures', component: CanvassSignaturesComponent,
        },
        {
          path: 'purchasing/po_transaction', component: POTransaction2Component,
        },
        {
          path: 'purchasing/po_receipts', component: POReceiptsComponent,
        },
        {
          path: 'purchasing/po_reports', component: POReportsComponent,
        },
        {
          path: 'purchasing/po_config', component: POConfigComponent,
        },
        {
          path: 'purchasing/po_signatures', component: POSignaturesComponent,
        },
        {
          path: 'receiving/receiving_transaction', component: ReceivingTransaction2Component,
        },
        {
          path: 'receiving/receiving_receipts', component: ReceivingReceiptsComponent,
        },
        {
          path: 'receiving/receiving_reports', component: ReceivingReportsComponent,
        },
        {
          path: 'receiving/receiving_journal', component: ReceivingJournalComponent,
        },
        {
          path: 'receiving/receiving_ledger', component: ReceivingLedgerComponent,
        },
        {
          path: 'receiving/receiving_config', component: ReceivingConfigComponent,
        },
        {
          path: 'receiving/receiving_signatures', component: ReceivingSignaturesComponent,
        },
        {
          path: 'receivables/payment_transaction', component: PaymentTransaction2Component,
        },
        {
          path: 'receivables/payment_receipts', component: PaymentReceiptsComponent,
        },
        {
          path: 'receivables/payment_reports', component: PaymentReportsComponent,
        },
        {
          path: 'receivables/payment_journal', component: CustomerPaymentJournalComponent,
        },
        {
          path: 'receivables/payment_ledger', component: CustomerPaymentLedgerComponent,
        },
        {
          path: 'receivables/customer_ledger', component: CustomerLedgerComponent,
        },
       
        {
          path: 'receivables/receivable_dues', component: ReceivableDuesComponent,
        },
        {
          path: 'receivables/receivable_reports', component: ReceivableReportsComponent,
        },
        {
          path: 'receivables/receivable_config', component: ReceivableConfigComponent,
        },
        {
          path: 'receivables/payment_signatures', component: PaymentSignaturesComponent,
        },
        {
          path: 'payables/payee_transaction', component: PayeeTransaction2Component,
        },
        {
          path: 'payables/supplier_payment_receipts', component: SupplierPaymentReceiptsComponent,
        },
        {
          path: 'payables/supplier_payment_reports', component: SupplierPaymentReportsComponent,
        },
        {
          path: 'payables/supplier_payment_journal', component: SupplierPaymentJournalComponent,
        },
        {
          path: 'payables/supplier_payment_ledger', component: SupplierPaymentLedgerComponent,
        },
        {
          path: 'payables/supplier_ledger', component: SupplierLedgerComponent,
        },
        {
          path: 'payables/payable_dues', component: PayableDuesComponent,
        },
        {
          path: 'payables/payable_reports', component: PayableReportsComponent,
        },
        {
          path: 'payables/payable_config', component: PayableConfigComponent,
        },
        {
          path: 'payables/payee_signatures', component: PayeeSignaturesComponent,
        },
        {
          path: 'expenses/expense_transaction', component: ExpenseTransaction2Component,
        },
        {
          path: 'expenses/expense_receipts', component: ExpenseReceiptsComponent,
        },
        {
          path: 'expenses/expense_reports', component: ExpenseReportsComponent,
        },
        {
          path: 'expenses/expense_journal', component: ExpenseJournalComponent,
        },
        {
          path: 'expenses/expense_ledger', component: ExpenseLedgerComponent,
        },
        {
          path: 'expenses/expense_payees', component: ExpensePayeesUIComponent,
        },
        {
          path: 'expenses/expense_particulars', component: ExpenseParticularsUIComponent,
        },
        {
          path: 'expenses/expense_config', component: ExpenseConfigComponent,
        },
        {
          path: 'expenses/expense_signatures', component: ExpenseSignaturesComponent,
        },
        {
          path: 'stock adjustments/stockadjustment_transaction', component: StockAdjustmentTransaction2Component,
        },
        {
          path: 'stock adjustments/stockadjustment_receipts', component: StockAdjustmentReceiptsComponent,
        },
        {
          path: 'stock adjustments/stockadjustment_reports', component: StockAdjustmentReportsComponent,
        },
        {
          path: 'stock adjustments/stockadjustment_journal', component: StockAdjustmentJournalComponent,
        },
        {
          path: 'stock adjustments/stockadjustment_ledger', component: StockAdjustmentLedgerComponent,
        },
        {
          path: 'stock adjustments/stockadjustment_signatures', component: AdjustmentSignaturesComponent,
        },
                {
          path: 'stock adjustments/stockadjustment_config', component: StockAdjustmentConfigComponent,
        },
        {
          path: 'sales return/sales_return_transaction', component: SaleReturnTransaction2Component,
        },
        {
          path: 'sales return/sales_return_receipts', component: SaleReturnReceiptsComponent,
        },
        {
          path: 'sales return/sales_return_reports', component: SaleReturnReportsComponent,
        },
        {
          path: 'sales return/sales_return_config', component: SaleReturnConfigComponent,
        },
        {
          path: 'sales return/sales_return_signatures', component: SaleReturnSignaturesComponent,
        },
        {
          path: 'return to supplier/return_to_supplier_transaction', component: ReturnToSupplierTransaction2Component,
        },
        {
          path: 'return to supplier/return_to_supplier_receipts', component: ReturnToSupplierReceiptsComponent,
        },
        {
          path: 'return to supplier/return_to_supplier_reports', component: ReturnToSupplierReportsComponent,
        },
        {
          path: 'return to supplier/return_to_supplier_config', component: ReturnToSupplierConfigComponent,
        },
        {
          path: 'return to supplier/return_to_supplier_signatures', component: ReturnToSupplierSignaturesComponent,
        },
        {
          path: 'cashflow/cash_accounts', component: CashAccountsComponent,
        },
        {
          path: 'cashflow/cash_transfers', component: CashTransfersComponent,
        },
        {
          path: 'cashflow/cash_account_ledger', component: CashAccountLedgerComponent,
        },
        {
          path: 'cashflow/cash_transfer_journal', component: CashTransferJournalComponent,
        },
        {
          path: 'cashflow/cash_transfer_ledger', component: CashTransferLedgerComponent,
        },
         {
          path: 'cashflow/customer_checks', component: CustomerChecksComponent,
        },
         {
          path: 'cashflow/supplier_checks', component: SupplierChecksComponent,
        },
        {
          path: 'cashflow/checks_report', component: CheckReportsUIComponent,
        },
        {
          path: 'reports/command_center', component: CommandCenterComponent,
        },
        {
          path: 'reports/net_cash_report', component: NetCashReportComponent,
        },
        {
          path: 'reports/fast_slow_moving_items', component: FastSlowMovingItemsComponent,
        },
        {
          path: 'reports/item_history', component: ItemHistoryComponent,
        },
        {
          path: 'reports/customer_history', component: CustomerHistoryComponent,
        },
        {
          path: 'reports/supplier_history', component: SupplierHistoryComponent,
        },
        {
          path: 'accounting/account_titles', component: AccountTitlesComponent,
        },
        {
          path: 'accounting/adjusting_entries', component: AdjustingEntriesComponent,
        },
        {
          path: 'accounting/general_journal', component: GeneralJournalComponent,
        },
        {
          path: 'accounting/general_ledger', component: GeneralLedgerComponent,
        },
        {
          path: 'accounting/cashflow_ledger', component: CashflowLedgerComponent,
        },
        {
          path: 'accounting/trial_balance', component: TrialBalanceComponent,
        },
        {
          path: 'accounting/financial_statements', component: FinancialStatementsComponent,
        },
        {
          path: 'accounting/profit_performance', component: ProfitPerformanceComponent,
        },
        {
          path: 'accounting/debt_to_cash_coverage', component: DebtToCashCoverageComponent,
        },
        {
          path: 'bir/xzreadings', component: XZReadingsComponent,
        },
        {
          path: 'bir/ereceipts', component: EReceiptsComponent,
        },
        {
          path: 'bir/esalesbook', component: ESalesBookComponent,
        },
        {
          path: 'bir/discounts', component: BIRDiscountsComponent,
        },
        {
          path: 'bir/vatsales', component: VATSaleTypesComponent,
        },
        {
          path: 'bir/birsalesreport', component: BIRSalesReportComponent,
        },
        {
          path: 'bir/machinepermits', component: MachinePermitsComponent,
        },
        {
          path: 'bir/vendorpermit', component: VendorPermitsComponent,
        },
      ]
    },
    {
      path:'print', component: PrintComponent,
      children:[
        {
          path:'printuseraccounts', component:PrintUserAccountsComponent,
        },
        {
          path:'printuseractivities', component:PrintUserActivitiesComponent,
        },
        {
          path:'printmachinepermits', component:PrintMachinePermitsComponent,
        },
        {
          path:'printitems', component:PrintItemsComponent,
        },
        {
          path: 'printreceivingavecosthistory', component: PrintReceivingAveCostHistoryComponent,
        },
        {
          path:'printbarcodeitems', component:PrintBarcodeItemsComponent,
        },
        {
          path:'printcustomers', component:PrintCustomersComponent,
        },
        {
          path:'printdatalist', component:PrintDataListComponent,
        },
        {
          path:'printorderslip', component:PrintOrderSlipComponent,
        },
        {
          path:'printsuppliers', component:PrintSuppliersComponent,
        },
        {
          path:'printstocks', component:PrintStocksComponent,
        },
        {
          path:'printstockstotals', component:PrintStocksTotalsComponent,
        },
        {
          path:'printstocksendingbalance', component:PrintStocksEndingBalanceComponent,
        },
        {
          path:'printstockledger', component:PrintStockLedgerComponent,
        },
        {
          path:'printstocksinquiry', component:PrintStocksInquiryComponent,
        },
        {
          path:'printinventorystocks', component:PrintInventoryStocksComponent,
        },
        {
          path:'printinventoryhistory', component:PrintInventoryHistoryComponent,
        },
        {
          path:'printkitchenqueuehistory', component:PrintKitchenQueueHistoryComponent,
        },
        {
          path:'printinventorydetails', component:PrintInventoryDetailsComponent,
        },
        {
          path:'printstocksexpiry', component:PrintStocksExpiryComponent,
        },
        {
          path:'printpos', component:PrintPOSComponent,
        },
        {
          path:'printposbir', component:PrintPOSBIRComponent,
        },
        {
          path:'printorderreceipts', component:PrintOrderReceiptsComponent,
        },
        {
          path:'printorderdetails', component:PrintOrderDetailsComponent,
        },
        {
          path:'printorderreports', component:PrintOrderReportsComponent,
        },
        {
          path:'printsalereceipts', component:PrintSaleReceiptsComponent,
        },
        {
          path:'printsaledetails', component:PrintSaleDetailsComponent,
        },
        {
          path:'printaccountingentry', component:PrintAccountingEntryComponent,
        },
        {
          path:'printyearlysalesreport', component:PrintYearlySalesReportComponent,
        },
        {
          path:'printmonthlysalesreport', component:PrintMonthlySalesReportComponent,
        },
        {
          path:'printdailysalesreport', component:PrintDailySalesReportComponent,
        },
        {
          path:'printvoidsalesreport', component:PrintVoidSalesReportComponent,
        },
        {
          path:'printdiscountsalesreport', component:PrintDiscountSalesReportComponent,
        },
        {
          path:'printcustomersalesreport', component:PrintCustomerSalesReportComponent,
        },
        {
          path:'printwhtaxsalesreport', component:PrintWHTaxSalesReportComponent,
        },
        {
          path:'printvatsalesreport', component:PrintVATSalesReportComponent,
        },
        {
          path:'printrebatepaidsalesreport', component:PrintRebatePaidSalesReportComponent,
        },
        {
          path:'printdeliverydetails', component:PrintDeliveryDetailsComponent,
        },
        {
          path:'printdeliveryreceipts', component:PrintDeliveryReceiptsComponent,
        },
        {
          path:'printdeliveryreport', component:PrintDeliveryReportsComponent,
        },
        {
          path:'printcanvassdetails', component:PrintCanvassDetailsComponent,
        },
        {
          path:'printcanvassreceipts', component:PrintCanvassReceiptsComponent,
        },
        {
          path:'printcanvassreports', component:PrintCanvassReportsComponent,
        },
        {
          path:'printgeneraljournal', component:PrintGeneralJournalComponent,
        },
        {
          path:'printgeneralledger', component:PrintGeneralLedgerComponent,
        },
        {
          path:'printporeceipts', component:PrintPOReceiptsComponent,
        },
        {
          path:'printpodetails', component:PrintPODetailsComponent,
        },
        {
          path:'printporeports', component:PrintPOReportsComponent,
        },
        {
          path:'printreceivingreceipts', component:PrintReceivingReceiptsComponent,
        },
        {
          path:'printreceivingdetails', component:PrintReceivingDetailsComponent,
        },
        {
          path:'printyearlyreceivingreport', component:PrintYearlyReceivingReportComponent,
        },
        {
          path:'printmonthlyreceivingreport', component:PrintMonthlyReceivingReportComponent,
        },
        {
          path:'printdailyreceivingreport', component:PrintDailyReceivingReportComponent,
        },
        {
          path:'printvoidreceivingreport', component:PrintVoidReceivingReportComponent,
        },
        {
          path:'printdiscountreceivingreport', component:PrintDiscountReceivingReportComponent,
        },
        {
          path:'printsupplierreceivingreport', component:PrintSupplierReceivingReportComponent,
        },
        {
          path:'printwhtaxreceivingreport', component:PrintWHTaxReceivingReportComponent,
        },
        {
          path:'printvatreceivingreport', component:PrintVATReceivingReportComponent,
        },
        {
          path:'printexpensedetails', component:PrintExpenseDetailsComponent,
        },
        {
          path:'printexpensereceipts', component:PrintExpenseReceiptsComponent,
        },
        {
          path:'printyearlyexpensesreport', component:PrintYearlyExpensesReportComponent,
        },
        {
          path:'printmonthlyexpensesreport', component:PrintMonthlyExpensesReportComponent,
        },
        {
          path:'printsalereturnreceipts', component:PrintSaleReturnReceiptsComponent,
        },
        {
          path:'printsalereturndetails', component:PrintSaleReturnDetailsComponent,
        },
        {
          path:'printsalereturnreport', component:PrintSaleReturnReportsComponent,
        },
        {
          path:'printcashierledger', component:PrintCashierLedgersComponent,
        },
        {
          path:'printsalereadings', component:PrintSaleReadingsComponent,
        },
        {
          path:'printcashreadings', component:PrintCashReadingsComponent,
        },
        {
          path:'printcashreading', component:PrintCashReadingComponent,
        },
        {
          path:'posprintcashreading', component:POSPrintCashReadingComponent,
        },
        {
          path:'printcashieringrecorddetails', component:PrintCashieringRecordDetailsComponent,
        },
        {
          path:'printsalereadingdetails', component:PrintSaleReadingDetailsComponent,
        },
        {
          path:'printsalestypereading', component:PrintSalesTypeReadingComponent,
        },
        {
          path:'printwithdrawals', component:PrintWithdrawalsComponent,
        },
        {
          path:'printwithdrawalreceipt', component:PrintWithdrawalReceiptComponent,
        },
        {
          path:'printcashtranfers', component: PrintCashTransfersComponent,
        },
        {
          path:'printcashtransferreceipt', component: PrintCashTransferReceiptComponent,
        },
        {
          path:'printdailynetcash', component: PrintDailyNetCashComponent,
        },
        {
          path:'printmonthlynetcash', component: PrintMonthlyNetCashComponent,
        },
        {
          path:'printbreakdownnetcash', component: PrintBreakdownNetCashComponent,
        },
        {
          path:'printfastslowmovingitems', component: PrintFastSlowMovingItemsComponent,
        },
        {
          path:'printitemcustomers', component: PrintItemCustomersComponent,
        },
        {
          path:'printitemsuppliers', component: PrintItemSuppliersComponent
        },
        {
          path:'printitemadjustments', component: PrintItemAdjustmentsComponent
        },
        {
          path:'printitemsalereturns', component: PrintItemSaleReturnsComponent
        },
        {
          path:'printitemreturntosuppliers', component: PrintItemReturnToSuppliersComponent
        },
        {
          path:'printitempricehistory', component: PrintItemPriceHistoryComponent
        },
        {
          path:'printitemcosthistory', component: PrintItemCostHistoryComponent
        },
        {
          path:'printcustomeritems', component: PrintCustomerItemsComponent
        },
        {
          path:'printcustomersalereturns', component: PrintCustomerSaleReturnsComponent
        },
        {
          path:'printsupplieritems', component: PrintSupplierItemsComponent
        },
        {
          path:'printsupplierreturntosuppliers', component: PrintSupplierReturnToSuppliersComponent
        },
        {
          path:'printaccounttitles', component: PrintAccountTitlesComponent
        },
        {
          path:'printadjustingentryrecords', component: PrintAdjustingEntryRecordsComponent
        },
        {
          path:'printadjustingentrydetails', component: PrintAdjustingEntryDetailComponent
        },
        {
          path:'printcashflowledger', component: PrintCashflowLedgerComponent
        },
        {
          path:'printtrialbalance', component: PrintTrialBalanceComponent
        },
        {
          path:'printincomestatements', component: PrintIncomeStatementsComponent
        },
        {
          path:'printbalancesheet', component: PrintBalanceSheetComponent
        },
        {
          path:'printcashflowstatements', component: PrintCashflowStatementsComponent
        },
        {
          path:'printstockadjustmentdetails', component: PrintStockAdjustmentDetailsComponent
        },
        {
          path:'printstockadjustmentreceipts', component: PrintStockAdjustmentReceiptsComponent
        },
        {
          path:'printstockadjustmentreport', component: PrintStockAdjustmentReportsComponent
        },
        {
          path:'printmonthlystockadjustmentreport', component:PrintMonthlyStockAdjustmentReportComponent,
        },
        {
          path:'printdailystockadjustmentreport', component:PrintDailyStockAdjustmentReportComponent,
        },
        {
          path:'printreturntosupplierdetails', component: PrintReturnToSupplierDetailsComponent
        },
        {
          path:'printreturntosupplierreceipts', component: PrintReturnToSupplierReceiptsComponent
        },
        {
          path:'printreturntosupplierreport', component: PrintReturnToSupplierReportComponent
        },
        {
          path:'printpaymentdetails', component: PrintPaymentDetailsComponent
        },
        {
          path:'printpaymentreceipts', component: PrintPaymentReceiptsComponent
        },
        {
          path:'printpaymentreports', component: PrintPaymentReportsComponent
        },
        {
          path:'printcustomerledger', component: PrintCustomerLedgerComponent
        },
        {
          path:'printcustomerchecks', component: PrintCustomerChecksComponent
        },
        {
          path:'printcustomerchecksreport', component: PrintCustomerChecksReportComponent
        },
         {
          path:'printchecksreport', component: PrintCheckReportsComponent
        },
       {
          path:'printsupplierchecks', component: PrintSupplierChecksComponent
        },
        {
          path:'printreceivabledues', component: PrintReceivableDuesComponent
        },
        {
          path:'printreceivablereports', component: PrintReceivableReportsComponent
        },
        {
          path:'printreceivableoldreceipts', component: PrintReceivableOldReceiptsComponent
        },
        {
          path:'printreceivableoldreceipt', component: PrintReceivableOldReceiptComponent
        },
        {
          path:'printsupplierpaymentdetails', component: PrintSupplierPaymentDetailsComponent
        },
        {
          path:'printsupplierpaymentreceipts', component: PrintSupplierPaymentReceiptsComponent
        },
        {
          path:'printsupplierledger', component: PrintSupplierLedgerComponent
        },
        {
          path:'printpayabledues', component: PrintPayableDuesComponent
        },
        {
          path:'printpayablereports', component: PrintPayableReportsComponent
        },
        {
          path:'printpayableoldreceipts', component: PrintPayableOldReceiptsComponent
        },
        {
          path:'printpayableoldreceipt', component: PrintPayableOldReceiptComponent
        },
        {
          path:'printvoucherreceipts', component: PrintVoucherReceiptsComponent
        },
        {
          path:'printvoucherreceipt', component: PrintVoucherReceiptComponent
        },
        {
          path:'printvoucherreports', component: PrintVoucherReportsComponent
        },
        {
          path:'printdisbursementreceipts', component: PrintDisbursementReceiptsComponent
        },
        {
          path:'printdisbursementreceipt', component: PrintDisbursementReceiptComponent
        },
        {
          path:'printdisbursementreports', component: PrintDisbursementReportsComponent
        },
        {
          path:'printdisbursedchecks', component: PrintDisbursedChecksComponent
        },
        {
          path:'printpettycashrecords', component: PrintPettyCashRecordsComponent
        },
        {
          path:'printpettycashdetailsreceipt', component: PrintPettyCashDetailsReceiptComponent
        },
        {
          path:'printzreadings', component: PrintZReadingsComponent
        },
        {
          path:'printzreadingreceipt', component: PrintZReadingReceiptComponent
        },
        {
          path:'printzreadingpos', component: PrintZReadingPOSComponent
        },
        {
          path:'printxreadingreceipt', component: PrintXReadingReceiptComponent
        },
        {
          path:'printxreadingpos', component: PrintXReadingPOSComponent
        },
        {
          path:'printesalesbook', component: PrintESalesBookComponent
        },
        {
          path:'printbirdiscounts', component: PrintBIRDiscountsComponent
        },
        {
          path:'printbirsalesreport', component: PrintBIRSalesReportComponent
        },
        {
          path:'printvatsalestype', component: PrintVATSalesTypeComponent
        },
        {
          path:'printprofitperformance', component: PrintProfitPerformanceComponent
        },
        {
          path:'printdebttocashcoverage', component: PrintDebtToCashCoverageComponent
        },
        {
          path:'printcashaccountledger', component: PrintCashAccountLedgerComponent
        },
          {
          path:'printstocktransferreceipts', component: PrintStockTransferReceiptsComponent
        },
        {
          path:'printstocktransferdetails', component: PrintStockTransferDetailsComponent
        },
      ]
    },
    { 
      path: '**', 
      component: EncryptedRedirectComponent 
    },
   
  ];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports : [
    RouterModule
  ]
})
export class AppRoutingModule { }
