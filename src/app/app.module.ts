import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/Material/Material.module';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RuntimeConfigService } from './services/Offline/runtime-config.service';
import { ApiBaseInterceptor } from './services/Offline/api-base.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HighchartsChartModule } from 'highcharts-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatePipe } from '@angular/common';
import { LandingComponent } from './layouts/landing/landing.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { HomeComponent } from './layouts/home/home.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './layouts/login/login.component';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { FnbDashboardComponent } from './layouts/dashboard/fnb-dashboard/fnb-dashboard.component';
import { ProfileComponent } from './layouts/home/AccessRights/profile/profile.component';
import { EditProfileComponent } from './layouts/home/AccessRights/edit-profile/edit-profile.component';
import { ChangePasswordUIComponent } from './layouts/home/AccessRights/change-password-ui/change-password-ui.component';
import { BusinessInfoComponent } from './layouts/home/Config/business-info/business-info.component';
import { MachinePermitsComponent } from './layouts/home/BIR/machine-permits/machine-permits.component';
import { VendorPermitsComponent } from './layouts/home/BIR/vendor-permits/vendor-permits.component';
import { SelectedMachinePermitComponent } from './layouts/home/BIR/selected-machine-permit/selected-machine-permit.component';
import { AccessRightsComponent } from './layouts/home/AccessRights/access-rights/access-rights.component';
import { AddAccessRightComponent } from './layouts/home/AccessRights/add-access-right/add-access-right.component';
import { MenusUIComponent } from './layouts/home/AccessRights/menus-ui/menus-ui.component';
import { SelectedMenuUIComponent } from './layouts/home/AccessRights/selected-menu-ui/selected-menu-ui.component';
import { SelectedSubMenuUIComponent } from './layouts/home/AccessRights/selected-sub-menu-ui/selected-sub-menu-ui.component';
import { SubMenuButtonsUIComponent } from './layouts/home/AccessRights/sub-menu-buttons-ui/sub-menu-buttons-ui.component';
import { SubMenusComponent } from './layouts/home/AccessRights/sub-menus/sub-menus.component';
import { UserAccountsComponent } from './layouts/home/AccessRights/user-accounts/user-accounts.component';
import { UserActivitiesComponent } from './layouts/home/AccessRights/user-activities/user-activities.component';
import { ActivityDetailsUIComponent } from './layouts/home/AccessRights/user-activities/activity-details-ui/activity-details-ui.component';
import { UserMenusComponent } from './layouts/home/AccessRights/user-menus/user-menus.component';
import { SelectedUserAccountUIComponent } from './layouts/home/AccessRights/selected-user-account-ui/selected-user-account-ui.component';
import { AddAccessRightMenusUIComponent } from './layouts/home/AccessRights/add-access-right-menus-ui/add-access-right-menus-ui.component';
import { AddAccessRightSubMenusUIComponent } from './layouts/home/AccessRights/add-access-right-sub-menus-ui/add-access-right-sub-menus-ui.component';
import { AddAccessRightSubMenuButtonsUIComponent } from './layouts/home/AccessRights/add-access-right-sub-menu-buttons-ui/add-access-right-sub-menu-buttons-ui.component';
import { PrintUserActivitiesComponent } from './layouts/prints/print-user-activities/print-user-activities.component';
import { PrintUserAccountsComponent } from './layouts/prints/print-user-accounts/print-user-accounts.component';
import { PrintMachinePermitsComponent } from './layouts/prints/print-machine-permits/print-machine-permits.component';
import { PrintComponent } from './layouts/prints/print/print.component';
import { AllButtonsComponent } from './layouts/prints/all-buttons/all-buttons.component';
import { APrintHeaderComponent } from './layouts/prints/aprint-header/aprint-header.component';
import { ItemsComponent } from './layouts/home/Files/items/items.component';
import { CustomersComponent } from './layouts/home/Files/customers/customers.component';
import { SuppliersComponent } from './layouts/home/Files/suppliers/suppliers.component';
import { TablesUIComponent } from './layouts/home/Files/tables-ui/tables-ui.component';
import { TableUIComponent } from './layouts/home/Files/table-ui/table-ui.component';
import { TableCategorysUIComponent } from './layouts/home/Files/table-categorys-ui/table-categorys-ui.component';
import { PrintersUIComponent } from './layouts/home/Files/printers-ui/printers-ui.component';
import { PrinterUIComponent } from './layouts/home/Files/printer-ui/printer-ui.component';
import { AssignedItemsUIComponent } from './layouts/home/Files/assigned-items-ui/assigned-items-ui.component';
import { FilesConfigUIComponent } from './layouts/home/Files/files-config-ui/files-config-ui.component';
import { MenuCostingComponent } from './layouts/home/Menus/menu-costing/menu-costing.component';
import { ComponentsUIComponent } from './layouts/home/Menus/components-ui/components-ui.component';
import { UMConvertionUIComponent } from './layouts/home/Menus/um-convertion-ui/um-convertion-ui.component';
import { MenuSalesReportComponent } from './layouts/home/Menus/menu-sales-report/menu-sales-report.component';
import { EndOfDayInventoryComponent } from './layouts/home/Menus/end-of-day-inventory/end-of-day-inventory.component';
import { IngredientsUsedUIComponent } from './layouts/home/Menus/ingredients-used-ui/ingredients-used-ui.component';
import { ProductionTransactionComponent } from './layouts/home/Menus/production-transaction/production-transaction.component';
import { ProductionReceiptsComponent } from './layouts/home/Menus/production-receipts/production-receipts.component';
import { ProductionEntryUIComponent } from './layouts/home/Menus/production-entry-ui/production-entry-ui.component';
import { ProductionDetailsUIComponent } from './layouts/home/Menus/production-details-ui/production-details-ui.component';
import { ProductionReportsComponent } from './layouts/home/Menus/production-reports/production-reports.component';
import { PrintDataListComponent } from './layouts/prints/print-data-list/print-data-list.component';
import { PrintOrderSlipComponent } from './layouts/prints/print-order-slip/print-order-slip.component';
import { ItemUnitsUIComponent } from './layouts/home/Files/item-units-ui/item-units-ui.component';
import { ItemCategorysUIComponent } from './layouts/home/Files/item-categorys-ui/item-categorys-ui.component';
import { PrintItemsComponent } from './layouts/prints/print-items/print-items.component';
import { PrintCustomersComponent } from './layouts/prints/print-customers/print-customers.component';
import { PrintSuppliersComponent } from './layouts/prints/print-suppliers/print-suppliers.component';
import { CustomerUIComponent } from './layouts/home/Files/customer-ui/customer-ui.component';
import { ItemUIComponent } from './layouts/home/Files/item-ui/item-ui.component';;
import { SupplierUIComponent } from './layouts/home/Files/supplier-ui/supplier-ui.component';
import { ItemPriceCategorysUIComponent } from './layouts/home/Files/item-price-categorys-ui/item-price-categorys-ui.component';
import { PriceCategoryUIComponent } from './layouts/home/Files/price-category-ui/price-category-ui.component';
import { BarcodeItemsUIComponent } from './layouts/home/Files/barcode-items-ui/barcode-items-ui.component';
import { BarcodeUIComponent } from './layouts/home/Files/barcode-ui/barcode-ui.component';
import { PrintBarcodeItemsComponent } from './layouts/prints/print-barcode-items/print-barcode-items.component';
import { AprintFooterComponent } from './layouts/prints/aprint-footer/aprint-footer.component';
import { StocksExpiryComponent } from './layouts/home/Inventory/stocks-expiry/stocks-expiry.component';
import { InventoryStocksComponent } from './layouts/home/Inventory/inventory-stocks/inventory-stocks.component';
import { InventoryHistoryComponent } from './layouts/home/Inventory/inventory-history/inventory-history.component';
import { StockEndingBalanceComponent } from './layouts/home/Inventory/stock-ending-balance/stock-ending-balance.component';
import { StockTotalsComponent } from './layouts/home/Inventory/stock-totals/stock-totals.component';
import { StocksComponent } from './layouts/home/Inventory/stocks/stocks.component';
import { ItemTypesUIComponent } from './layouts/home/Files/item-types-ui/item-types-ui.component';
import { PrintStocksComponent } from './layouts/prints/print-stocks/print-stocks.component';
import { BusinessStylesUIComponent } from './layouts/home/Files/business-styles-ui/business-styles-ui.component';
import { PrintStocksTotalsComponent } from './layouts/prints/print-stocks-totals/print-stocks-totals.component';
import { AdjustPriceUIComponent } from './layouts/home/Inventory/adjust-price-ui/adjust-price-ui.component';
import { PrintStocksEndingBalanceComponent } from './layouts/prints/print-stocks-ending-balance/print-stocks-ending-balance.component';
import { StockLedgerUIComponent } from './layouts/home/Inventory/stock-ledger-ui/stock-ledger-ui.component';
import { PrintStockLedgerComponent } from './layouts/prints/print-stock-ledger/print-stock-ledger.component';
import { PrintInventoryStocksComponent } from './layouts/prints/print-inventory-stocks/print-inventory-stocks.component';
import { PrintInventoryHistoryComponent } from './layouts/prints/print-inventory-history/print-inventory-history.component';
import { InventoryDetailsUIComponent } from './layouts/home/Inventory/inventory-details-ui/inventory-details-ui.component';
import { InventoryDetailUIComponent } from './layouts/home/Inventory/inventory-detail-ui/inventory-detail-ui.component';
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
import { SaleHeaderUIComponent } from './layouts/home/Sales/sale-header-ui/sale-header-ui.component';
import { SaleDetailsUIComponent } from './layouts/home/Sales/sale-details-ui/sale-details-ui.component';
import { SaleDetailUIComponent } from './layouts/home/Sales/sale-detail-ui/sale-detail-ui.component';
import { LoadItemsForSaleUIComponent } from './layouts/home/Sales/load-items-for-sale-ui/load-items-for-sale-ui.component';
import { PendingTransactionsUIComponent } from './layouts/home/Sales/pending-transactions-ui/pending-transactions-ui.component';
import { CustomerPointsUIComponent } from './layouts/home/Files/customer-points-ui/customer-points-ui.component';
import { UnpaidCustomerChecksUIComponent } from './layouts/home/CustomerChecks/unpaid-customer-checks-ui/unpaid-customer-checks-ui.component';
import { DiscountPersonsUIComponent } from './layouts/home/Sales/discount-persons-ui/discount-persons-ui.component';
import { DiscountApplicationUIComponent } from './layouts/home/Sales/discount-application-ui/discount-application-ui.component';
import { ItemThumbComponent } from './layouts/shared/item-thumb/item-thumb.component';
import { OnScreenKeyboardComponent } from './layouts/shared/on-screen-keyboard/on-screen-keyboard.component';
import { KitchenReadyUIComponent } from './layouts/home/Sales/kitchen-ready-ui/kitchen-ready-ui.component';
import { KitchenOrderCardsComponent } from './layouts/shared/kitchen-order-cards/kitchen-order-cards.component';
import { DateRangeFilterComponent } from './layouts/shared/date-range-filter/date-range-filter.component';
import { PrintKitchenQueueHistoryComponent } from './layouts/prints/print-kitchen-queue-history/print-kitchen-queue-history.component';
import { PrintPOSComponent } from './layouts/prints/print-pos/print-pos.component';
import { PrintPOSBIRComponent } from './layouts/prints/print-posbir/print-posbir.component';
import { ReceiptLinesComponent } from './layouts/prints/receipt-lines/receipt-lines.component';
import { ChangeUIComponent } from './layouts/home/Sales/change-ui/change-ui.component';
import { PrintSaleReceiptsComponent } from './layouts/prints/print-sale-receipts/print-sale-receipts.component';
import { PrintSaleDetailsComponent } from './layouts/prints/print-sale-details/print-sale-details.component';
import { VoidReasonUIComponent } from './layouts/home/Sales/void-reason-ui/void-reason-ui.component';
import { SetUpgradeUIComponent } from './layouts/home/Sales/set-upgrade-ui/set-upgrade-ui.component';
import { AccountingEntryUIComponent } from './layouts/home/Accounting/accounting-entry-ui/accounting-entry-ui.component';
import { PrintAccountingEntryComponent } from './layouts/prints/print-accounting-entry/print-accounting-entry.component';
import { SalesYearlyReportComponent } from './layouts/home/Sales/Reports/sales-yearly-report/sales-yearly-report.component';
import { SalesMonthlyReportComponent } from './layouts/home/Sales/Reports/sales-monthly-report/sales-monthly-report.component';
import { SalesDailyReportComponent } from './layouts/home/Sales/Reports/sales-daily-report/sales-daily-report.component';
import { SalesVoidSalesReportComponent } from './layouts/home/Sales/Reports/sales-void-sales-report/sales-void-sales-report.component';
import { SalesDiscountSalesReportComponent } from './layouts/home/Sales/Reports/sales-discount-sales-report/sales-discount-sales-report.component';
import { SalesCustomerSalesReportComponent } from './layouts/home/Sales/Reports/sales-customer-sales-report/sales-customer-sales-report.component';
import { SalesWHTaxSalesReportComponent } from './layouts/home/Sales/Reports/sales-whtax-sales-report/sales-whtax-sales-report.component';
import { SalesVATSalesReportComponent } from './layouts/home/Sales/Reports/sales-vatsales-report/sales-vatsales-report.component';
import { SalesRebatePaidReportComponent } from './layouts/home/Sales/Reports/sales-rebate-paid-report/sales-rebate-paid-report.component';
import { PrintYearlySalesReportComponent } from './layouts/prints/print-yearly-sales-report/print-yearly-sales-report.component';
import { PrintMonthlySalesReportComponent } from './layouts/prints/print-monthly-sales-report/print-monthly-sales-report.component';
import { PrintDailySalesReportComponent } from './layouts/prints/print-daily-sales-report/print-daily-sales-report.component';
import { PrintVoidSalesReportComponent } from './layouts/prints/print-void-sales-report/print-void-sales-report.component';
import { PrintDiscountSalesReportComponent } from './layouts/prints/print-discount-sales-report/print-discount-sales-report.component';
import { PrintCustomerSalesReportComponent } from './layouts/prints/print-customer-sales-report/print-customer-sales-report.component';
import { PrintWHTaxSalesReportComponent } from './layouts/prints/print-whtax-sales-report/print-whtax-sales-report.component';
import { PrintVATSalesReportComponent } from './layouts/prints/print-vatsales-report/print-vatsales-report.component';
import { PrintRebatePaidSalesReportComponent } from './layouts/prints/print-rebate-paid-sales-report/print-rebate-paid-sales-report.component';
import { GeneralJournalUIComponent } from './layouts/home/Accounting/general-journal-ui/general-journal-ui.component';
import { PrintGeneralJournalComponent } from './layouts/prints/print-general-journal/print-general-journal.component';
import { GeneralLedgerUIComponent } from './layouts/home/Accounting/general-ledger-ui/general-ledger-ui.component';
import { PrintGeneralLedgerComponent } from './layouts/prints/print-general-ledger/print-general-ledger.component';
import { CashDrawerUIComponent } from './layouts/home/Cashiering/cash-drawer-ui/cash-drawer-ui.component';
import { CashieringRecordsComponent } from './layouts/home/Cashiering/cashiering-records/cashiering-records.component';
import { CashieringReportsComponent } from './layouts/home/Cashiering/cashiering-reports/cashiering-reports.component';
import { CashieringAccessRightsComponent } from './layouts/home/Cashiering/cashiering-access-rights/cashiering-access-rights.component';
import { CashieringConfigComponent } from './layouts/home/Cashiering/cashiering-config/cashiering-config.component';
import { CashDrawerComponent } from './layouts/home/Cashiering/cash-drawer/cash-drawer.component';
import { ReceivingHeaderUIComponent } from './layouts/home/Receiving/receiving-header-ui/receiving-header-ui.component';
import { ReceivingDetailUIComponent } from './layouts/home/Receiving/receiving-detail-ui/receiving-detail-ui.component';
import { ReceivingDetailsUIComponent } from './layouts/home/Receiving/receiving-details-ui/receiving-details-ui.component';
import { ReceivingReceiptsComponent } from './layouts/home/Receiving/receiving-receipts/receiving-receipts.component';
import { ReceivingReportsComponent } from './layouts/home/Receiving/receiving-reports/receiving-reports.component';
import { ReceivingJournalComponent } from './layouts/home/Receiving/receiving-journal/receiving-journal.component';
import { ReceivingLedgerComponent } from './layouts/home/Receiving/receiving-ledger/receiving-ledger.component';
import { ReceivingConfigComponent } from './layouts/home/Receiving/receiving-config/receiving-config.component';
import { LoadItemsForReceivingUIComponent } from './layouts/home/Receiving/load-items-for-receiving-ui/load-items-for-receiving-ui.component';
import { ReceivingPendingTransactionsUIComponent } from './layouts/home/Receiving/receiving-pending-transactions-ui/receiving-pending-transactions-ui.component';
import { PrintReceivingDetailsComponent } from './layouts/prints/print-receiving-details/print-receiving-details.component';
import { PrintReceivingReceiptsComponent } from './layouts/prints/print-receiving-receipts/print-receiving-receipts.component';
import { ReceivingYearlyReportComponent } from './layouts/home/Receiving/Reports/receiving-yearly-report/receiving-yearly-report.component';
import { ReceivingMonthlyReportComponent } from './layouts/home/Receiving/Reports/receiving-monthly-report/receiving-monthly-report.component';
import { ReceivingDailyReportComponent } from './layouts/home/Receiving/Reports/receiving-daily-report/receiving-daily-report.component';
import { ReceivingVoidReceivingReportComponent } from './layouts/home/Receiving/Reports/receiving-void-receiving-report/receiving-void-receiving-report.component';
import { ReceivingDiscountReceivingReportComponent } from './layouts/home/Receiving/Reports/receiving-discount-receiving-report/receiving-discount-receiving-report.component';
import { ReceivingWHTaxReceivingReportComponent } from './layouts/home/Receiving/Reports/receiving-whtax-receiving-report/receiving-whtax-receiving-report.component';
import { ReceivingVATReceivingReportComponent } from './layouts/home/Receiving/Reports/receiving-vatreceiving-report/receiving-vatreceiving-report.component';
import { ReceivingSupplierReceivingReportComponent } from './layouts/home/Receiving/Reports/receiving-supplier-receiving-report/receiving-supplier-receiving-report.component';
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
import { ExpensePayeesUIComponent } from './layouts/home/Expenses/expense-payees-ui/expense-payees-ui.component';
import { ExpensePayeeUIComponent } from './layouts/home/Expenses/expense-payee-ui/expense-payee-ui.component';
import { ExpenseParticularsUIComponent } from './layouts/home/Expenses/expense-particulars-ui/expense-particulars-ui.component';
import { ExpenseParticularUIComponent } from './layouts/home/Expenses/expense-particular-ui/expense-particular-ui.component';
import { ExpenseHeaderUIComponent } from './layouts/home/Expenses/expense-header-ui/expense-header-ui.component';
import { ExpenseDetailsUIComponent } from './layouts/home/Expenses/expense-details-ui/expense-details-ui.component';
import { ExpenseDetailUIComponent } from './layouts/home/Expenses/expense-detail-ui/expense-detail-ui.component';
import { LoadParticularsForExpenseUIComponent } from './layouts/home/Expenses/load-particulars-for-expense-ui/load-particulars-for-expense-ui.component';
import { ExpensePendingTransactionsUIComponent } from './layouts/home/Expenses/expense-pending-transactions-ui/expense-pending-transactions-ui.component';
import { PrintExpenseDetailsComponent } from './layouts/prints/print-expense-details/print-expense-details.component';
import { PrintExpenseReceiptsComponent } from './layouts/prints/print-expense-receipts/print-expense-receipts.component';
import { ExpensesYearlyReportComponent } from './layouts/home/Expenses/Reports/expenses-yearly-report/expenses-yearly-report.component';
import { ExpensesMonthlyReportComponent } from './layouts/home/Expenses/Reports/expenses-monthly-report/expenses-monthly-report.component';
import { ExpensesDateRangeReportComponent } from './layouts/home/Expenses/Reports/expenses-date-range-report/expenses-date-range-report.component';
import { PrintYearlyExpensesReportComponent } from './layouts/prints/print-yearly-expenses-report/print-yearly-expenses-report.component';
import { PrintMonthlyExpensesReportComponent } from './layouts/prints/print-monthly-expenses-report/print-monthly-expenses-report.component';
import { SaleReturnReceiptsComponent } from './layouts/home/SaleReturn/sale-return-receipts/sale-return-receipts.component';
import { SaleReturnReportsComponent } from './layouts/home/SaleReturn/sale-return-reports/sale-return-reports.component';
import { SaleReturnConfigComponent } from './layouts/home/SaleReturn/sale-return-config/sale-return-config.component';
import { SaleReturnDetailUIComponent } from './layouts/home/SaleReturn/sale-return-detail-ui/sale-return-detail-ui.component';
import { SaleReturnDetailsUIComponent } from './layouts/home/SaleReturn/sale-return-details-ui/sale-return-details-ui.component';
import { SaleReturnHeaderUIComponent } from './layouts/home/SaleReturn/sale-return-header-ui/sale-return-header-ui.component';
import { SaleReturnPendingTransactionsUIComponent } from './layouts/home/SaleReturn/sale-return-pending-transactions-ui/sale-return-pending-transactions-ui.component';
import { LoadItemsForSaleReturnUIComponent } from './layouts/home/SaleReturn/load-items-for-sale-return-ui/load-items-for-sale-return-ui.component';
import { PrintSaleReturnReceiptsComponent } from './layouts/prints/print-sale-return-receipts/print-sale-return-receipts.component';
import { PrintSaleReturnDetailsComponent } from './layouts/prints/print-sale-return-details/print-sale-return-details.component';
import { CashLedgerUIComponent } from './layouts/home/Cashiering/cash-ledger-ui/cash-ledger-ui.component';
import { PrintCashierLedgersComponent } from './layouts/prints/print-cashier-ledgers/print-cashier-ledgers.component';
import { CashCountUIComponent } from './layouts/home/Cashiering/cash-count-ui/cash-count-ui.component';
import { CashReadingRecordsUIComponent } from './layouts/home/Cashiering/cash-reading-records-ui/cash-reading-records-ui.component';
import { PrintCashReadingsComponent } from './layouts/prints/print-cash-readings/print-cash-readings.component';
import { PrintSaleReadingsComponent } from './layouts/prints/print-sale-readings/print-sale-readings.component';
import { DepositToUIComponent } from './layouts/home/Cashiering/deposit-to-ui/deposit-to-ui.component';
import { WithdrawalsUIComponent } from './layouts/home/Cashiering/withdrawals-ui/withdrawals-ui.component';
import { WithdrawalUIComponent } from './layouts/home/Cashiering/withdrawal-ui/withdrawal-ui.component';
import { PrintWithdrawalsComponent } from './layouts/prints/print-withdrawals/print-withdrawals.component';
import { PrintWithdrawalReceiptComponent } from './layouts/prints/print-withdrawal-receipt/print-withdrawal-receipt.component';
import { PrintCashReadingComponent } from './layouts/prints/print-cash-reading/print-cash-reading.component';
import { POSPrintCashReadingComponent } from './layouts/prints/posprint-cash-reading/posprint-cash-reading.component';
import { PrintCashieringRecordDetailsComponent } from './layouts/prints/print-cashiering-record-details/print-cashiering-record-details.component';
import { SalesReadingComponent } from './layouts/home/Cashiering/sales-reading/sales-reading.component';
import { PrintSaleReadingDetailsComponent } from './layouts/prints/print-sale-reading-details/print-sale-reading-details.component';
import { CashAccountsComponent } from './layouts/home/Cashflow/cash-accounts/cash-accounts.component';
import { CashAccountUIComponent } from './layouts/home/Cashflow/cash-account-ui/cash-account-ui.component';
import { CashTransfersComponent } from './layouts/home/Cashflow/cash-transfers/cash-transfers.component';
import { CashTransferUIComponent } from './layouts/home/Cashflow/cash-transfer-ui/cash-transfer-ui.component';
import { CashTransferLedgerComponent } from './layouts/home/Cashflow/cash-transfer-ledger/cash-transfer-ledger.component';
import { CashTransferJournalComponent } from './layouts/home/Cashflow/cash-transfer-journal/cash-transfer-journal.component';
import { CashAccountLedgerComponent } from './layouts/home/Cashflow/cash-account-ledger/cash-account-ledger.component';
import { CheckBookletsUIComponent } from './layouts/home/Cashflow/check-booklets-ui/check-booklets-ui.component';
import { CheckBookletUIComponent } from './layouts/home/Cashflow/check-booklet-ui/check-booklet-ui.component';
import { PrintCashTransfersComponent } from './layouts/prints/print-cash-transfers/print-cash-transfers.component';
import { PrintCashTransferReceiptComponent } from './layouts/prints/print-cash-transfer-receipt/print-cash-transfer-receipt.component';
import { CommandCenterComponent } from './layouts/home/Reports/command-center/command-center.component';
import { NetCashReportComponent } from './layouts/home/Reports/net-cash-report/net-cash-report.component';
import { FastSlowMovingItemsComponent } from './layouts/home/Reports/fast-slow-moving-items/fast-slow-moving-items.component';
import { ItemHistoryComponent } from './layouts/home/Reports/item-history/item-history.component';
import { CustomerHistoryComponent } from './layouts/home/Reports/customer-history/customer-history.component';
import { SupplierHistoryComponent } from './layouts/home/Reports/supplier-history/supplier-history.component';
import { DailyNetCashComponent } from './layouts/home/Reports/daily-net-cash/daily-net-cash.component';
import { MonthlyNetCashComponent } from './layouts/home/Reports/monthly-net-cash/monthly-net-cash.component';
import { BreakdownNetCashComponent } from './layouts/home/Reports/breakdown-net-cash/breakdown-net-cash.component';
import { PrintDailyNetCashComponent } from './layouts/prints/print-daily-net-cash/print-daily-net-cash.component';
import { PrintMonthlyNetCashComponent } from './layouts/prints/print-monthly-net-cash/print-monthly-net-cash.component';
import { PrintBreakdownNetCashComponent } from './layouts/prints/print-breakdown-net-cash/print-breakdown-net-cash.component';
import { PrintFastSlowMovingItemsComponent } from './layouts/prints/print-fast-slow-moving-items/print-fast-slow-moving-items.component';
import { ItemCustomersReportComponent } from './layouts/home/Reports/item-customers-report/item-customers-report.component';
import { ItemSuppliersReportComponent } from './layouts/home/Reports/item-suppliers-report/item-suppliers-report.component';
import { ItemSaleReturnsReportComponent } from './layouts/home/Reports/item-sale-returns-report/item-sale-returns-report.component';
import { ItemReturnToSuppliersReportComponent } from './layouts/home/Reports/item-return-to-suppliers-report/item-return-to-suppliers-report.component';
import { PrintItemCustomersComponent } from './layouts/prints/print-item-customers/print-item-customers.component';
import { PrintItemSuppliersComponent } from './layouts/prints/print-item-suppliers/print-item-suppliers.component';
import { PrintItemAdjustmentsComponent } from './layouts/prints/print-item-adjustments/print-item-adjustments.component';
import { ItemAdjustmentsReportComponent } from './layouts/home/Reports/item-adjustments-report/item-adjustments-report.component';
import { PrintItemSaleReturnsComponent } from './layouts/prints/print-item-sale-returns/print-item-sale-returns.component';
import { PrintItemReturnToSuppliersComponent } from './layouts/prints/print-item-return-to-suppliers/print-item-return-to-suppliers.component';
import { CustomerItemsReportComponent } from './layouts/home/Reports/customer-items-report/customer-items-report.component';
import { CustomerSaleReturnsReportComponent } from './layouts/home/Reports/customer-sale-returns-report/customer-sale-returns-report.component';
import { PrintCustomerItemsComponent } from './layouts/prints/print-customer-items/print-customer-items.component';
import { PrintCustomerSaleReturnsComponent } from './layouts/prints/print-customer-sale-returns/print-customer-sale-returns.component';
import { SupplierItemsReportComponent } from './layouts/home/Reports/supplier-items-report/supplier-items-report.component';
import { SupplierReturnToSuppliersReportComponent } from './layouts/home/Reports/supplier-return-to-suppliers-report/supplier-return-to-suppliers-report.component';
import { PrintSupplierItemsComponent } from './layouts/prints/print-supplier-items/print-supplier-items.component';
import { PrintSupplierReturnToSuppliersComponent } from './layouts/prints/print-supplier-return-to-suppliers/print-supplier-return-to-suppliers.component';
import { AccountTitlesComponent } from './layouts/home/Accounting/account-titles/account-titles.component';
import { AdjustingEntriesComponent } from './layouts/home/Accounting/adjusting-entries/adjusting-entries.component';
import { GeneralJournalComponent } from './layouts/home/Accounting/general-journal/general-journal.component';
import { GeneralLedgerComponent } from './layouts/home/Accounting/general-ledger/general-ledger.component';
import { CashflowLedgerComponent } from './layouts/home/Accounting/cashflow-ledger/cashflow-ledger.component';
import { TrialBalanceComponent } from './layouts/home/Accounting/trial-balance/trial-balance.component';
import { FinancialStatementsComponent } from './layouts/home/Accounting/financial-statements/financial-statements.component';
import { AccountTitleUIComponent } from './layouts/home/Accounting/account-title-ui/account-title-ui.component';
import { PrintAccountTitlesComponent } from './layouts/prints/print-account-titles/print-account-titles.component';
import { AdjustingEntryDetailsUIComponent } from './layouts/home/Accounting/adjusting-entry-details-ui/adjusting-entry-details-ui.component';
import { AdjustingEntryUIComponent } from './layouts/home/Accounting/adjusting-entry-ui/adjusting-entry-ui.component';
import { PrintAdjustingEntryRecordsComponent } from './layouts/prints/print-adjusting-entry-records/print-adjusting-entry-records.component';
import { PrintAdjustingEntryDetailComponent } from './layouts/prints/print-adjusting-entry-detail/print-adjusting-entry-detail.component';
import { PrintCashflowLedgerComponent } from './layouts/prints/print-cashflow-ledger/print-cashflow-ledger.component';
import { PrintTrialBalanceComponent } from './layouts/prints/print-trial-balance/print-trial-balance.component';
import { IncomeStatementsComponent } from './layouts/home/Accounting/income-statements/income-statements.component';
import { CashflowStatementsComponent } from './layouts/home/Accounting/cashflow-statements/cashflow-statements.component';
import { BalanceSheetComponent } from './layouts/home/Accounting/balance-sheet/balance-sheet.component';
import { PrintIncomeStatementsComponent } from './layouts/prints/print-income-statements/print-income-statements.component';
import { PrintBalanceSheetComponent } from './layouts/prints/print-balance-sheet/print-balance-sheet.component';
import { PrintCashflowStatementsComponent } from './layouts/prints/print-cashflow-statements/print-cashflow-statements.component';
import { StockAdjustmentReceiptsComponent } from './layouts/home/StockAdjustments/stock-adjustment-receipts/stock-adjustment-receipts.component';
import { StockAdjustmentReportsComponent } from './layouts/home/StockAdjustments/stock-adjustment-reports/stock-adjustment-reports.component';
import { StockAdjustmentJournalComponent } from './layouts/home/StockAdjustments/stock-adjustment-journal/stock-adjustment-journal.component';
import { StockAdjustmentLedgerComponent } from './layouts/home/StockAdjustments/stock-adjustment-ledger/stock-adjustment-ledger.component';
import { StockAdjustmentHeaderUIComponent } from './layouts/home/StockAdjustments/stock-adjustment-header-ui/stock-adjustment-header-ui.component';
import { StockAdjustmentDetailUIComponent } from './layouts/home/StockAdjustments/stock-adjustment-detail-ui/stock-adjustment-detail-ui.component';
import { StockAdjustmentDetailsUIComponent } from './layouts/home/StockAdjustments/stock-adjustment-details-ui/stock-adjustment-details-ui.component';
import { LoadItemsForStockAdjustmentUIComponent } from './layouts/home/StockAdjustments/load-items-for-stock-adjustment-ui/load-items-for-stock-adjustment-ui.component';
import { ReasonsUIComponent } from './layouts/home/StockAdjustments/reasons-ui/reasons-ui.component';
import { StockAdjustmentPendingTransactionsUIComponent } from './layouts/home/StockAdjustments/stock-adjustment-pending-transactions-ui/stock-adjustment-pending-transactions-ui.component';
import { PrintStockAdjustmentDetailsComponent } from './layouts/prints/print-stock-adjustment-details/print-stock-adjustment-details.component';
import { PrintStockAdjustmentReceiptsComponent } from './layouts/prints/print-stock-adjustment-receipts/print-stock-adjustment-receipts.component';
import { PrintStockAdjustmentReportsComponent } from './layouts/prints/print-stock-adjustment-reports/print-stock-adjustment-reports.component';
import { ReturnToSupplierReceiptsComponent } from './layouts/home/ReturnToSupplier/return-to-supplier-receipts/return-to-supplier-receipts.component';
import { ReturnToSupplierReportsComponent } from './layouts/home/ReturnToSupplier/return-to-supplier-reports/return-to-supplier-reports.component';
import { ReturnToSupplierConfigComponent } from './layouts/home/ReturnToSupplier/return-to-supplier-config/return-to-supplier-config.component';
import { ReturnToSupplierHeaderUIComponent } from './layouts/home/ReturnToSupplier/return-to-supplier-header-ui/return-to-supplier-header-ui.component';
import { ReturnToSupplierDetailUIComponent } from './layouts/home/ReturnToSupplier/return-to-supplier-detail-ui/return-to-supplier-detail-ui.component';
import { ReturnToSupplierDetailsUIComponent } from './layouts/home/ReturnToSupplier/return-to-supplier-details-ui/return-to-supplier-details-ui.component';
import { ReturnToSupplierPendingTransactionsUIComponent } from './layouts/home/ReturnToSupplier/return-to-supplier-pending-transactions-ui/return-to-supplier-pending-transactions-ui.component';
import { LoadItemsForReturnToSupplierUIComponent } from './layouts/home/ReturnToSupplier/load-items-for-return-to-supplier-ui/load-items-for-return-to-supplier-ui.component';
import { PrintReturnToSupplierReceiptsComponent } from './layouts/prints/print-return-to-supplier-receipts/print-return-to-supplier-receipts.component';
import { PrintReturnToSupplierDetailsComponent } from './layouts/prints/print-return-to-supplier-details/print-return-to-supplier-details.component';
import { PrintReturnToSupplierReportComponent } from './layouts/prints/print-return-to-supplier-report/print-return-to-supplier-report.component';
import { PaymentReceiptsComponent } from './layouts/home/Receivables/payment-receipts/payment-receipts.component';
import { PaymentReportsComponent } from './layouts/home/Receivables/payment-reports/payment-reports.component';
import { CustomerPaymentJournalComponent } from './layouts/home/Receivables/customer-payment-journal/customer-payment-journal.component';
import { CustomerPaymentLedgerComponent } from './layouts/home/Receivables/customer-payment-ledger/customer-payment-ledger.component';
import { CustomerLedgerComponent } from './layouts/home/Receivables/customer-ledger/customer-ledger.component';
import { CustomerChecksComponent } from './layouts/home/CustomerChecks/customer-checks/customer-checks.component';
import { CustomerChecksReportComponent } from './layouts/home/CustomerChecks/customer-checks-report/customer-checks-report.component';
import { ReceivableDuesComponent } from './layouts/home/Receivables/receivable-dues/receivable-dues.component';
import { ReceivableReportsComponent } from './layouts/home/Receivables/receivable-reports/receivable-reports.component';
import { ReceivableConfigComponent } from './layouts/home/Receivables/receivable-config/receivable-config.component';
import { PaymentDetailUIComponent } from './layouts/home/Receivables/payment-detail-ui/payment-detail-ui.component';
import { PaymentDetailsUIComponent } from './layouts/home/Receivables/payment-details-ui/payment-details-ui.component';
import { PaymentHeaderUIComponent } from './layouts/home/Receivables/payment-header-ui/payment-header-ui.component';
import { PrintPaymentDetailsComponent } from './layouts/prints/print-payment-details/print-payment-details.component';
import { PrintPaymentReceiptsComponent } from './layouts/prints/print-payment-receipts/print-payment-receipts.component';
import { PrintPaymentReportsComponent } from './layouts/prints/print-payment-reports/print-payment-reports.component';
import { PrintCustomerLedgerComponent } from './layouts/prints/print-customer-ledger/print-customer-ledger.component';
import { PrintCustomerChecksComponent } from './layouts/prints/print-customer-checks/print-customer-checks.component';
import { CustomerCheckUIComponent } from './layouts/home/CustomerChecks/customer-check-ui/customer-check-ui.component';
import { CCheckDepositToUIComponent } from './layouts/home/CustomerChecks/ccheck-deposit-to-ui/ccheck-deposit-to-ui.component';
import { PrintCustomerChecksReportComponent } from './layouts/prints/print-customer-checks-report/print-customer-checks-report.component';
import { PrintReceivableDuesComponent } from './layouts/prints/print-receivable-dues/print-receivable-dues.component';
import { PrintReceivableReportsComponent } from './layouts/prints/print-receivable-reports/print-receivable-reports.component';
import { ReceivableOldReceiptsUIComponent } from './layouts/home/Receivables/receivable-old-receipts-ui/receivable-old-receipts-ui.component';
import { ReceivableOldReceiptUIComponent } from './layouts/home/Receivables/receivable-old-receipt-ui/receivable-old-receipt-ui.component';
import { PrintReceivableOldReceiptsComponent } from './layouts/prints/print-receivable-old-receipts/print-receivable-old-receipts.component';
import { PrintReceivableOldReceiptComponent } from './layouts/prints/print-receivable-old-receipt/print-receivable-old-receipt.component';
import { SupplierLedgerComponent } from './layouts/home/Payables/supplier-ledger/supplier-ledger.component';
import { SupplierPaymentReceiptsComponent } from './layouts/home/Payables/supplier-payment-receipts/supplier-payment-receipts.component';
import { SupplierPaymentReportsComponent } from './layouts/home/Payables/supplier-payment-reports/supplier-payment-reports.component';
import { SupplierPaymentJournalComponent } from './layouts/home/Payables/supplier-payment-journal/supplier-payment-journal.component';
import { SupplierPaymentLedgerComponent } from './layouts/home/Payables/supplier-payment-ledger/supplier-payment-ledger.component';
import { PayableDuesComponent } from './layouts/home/Payables/payable-dues/payable-dues.component';
import { PayableReportsComponent } from './layouts/home/Payables/payable-reports/payable-reports.component';
import { PayableConfigComponent } from './layouts/home/Payables/payable-config/payable-config.component';
import { PayableOldReceiptsUIComponent } from './layouts/home/Payables/payable-old-receipts-ui/payable-old-receipts-ui.component';
import { SupplierPaymentHeaderUIComponent } from './layouts/home/Payables/supplier-payment-header-ui/supplier-payment-header-ui.component';
import { SupplierPaymentDetailUIComponent } from './layouts/home/Payables/supplier-payment-detail-ui/supplier-payment-detail-ui.component';
import { LoadReceiptsForPaymentUIComponent } from './layouts/home/Receivables/load-receipts-for-payment-ui/load-receipts-for-payment-ui.component';
import { LoadReceiptsForSupplierPaymentUIComponent } from './layouts/home/Payables/load-receipts-for-supplier-payment-ui/load-receipts-for-supplier-payment-ui.component';
import { PayableOldReceiptUIComponent } from './layouts/home/Payables/payable-old-receipt-ui/payable-old-receipt-ui.component';
import { PrintPayableOldReceiptComponent } from './layouts/prints/print-payable-old-receipt/print-payable-old-receipt.component';
import { PrintPayableOldReceiptsComponent } from './layouts/prints/print-payable-old-receipts/print-payable-old-receipts.component';
import { PrintSupplierPaymentReceiptsComponent } from './layouts/prints/print-supplier-payment-receipts/print-supplier-payment-receipts.component';
import { PrintSupplierPaymentDetailsComponent } from './layouts/prints/print-supplier-payment-details/print-supplier-payment-details.component';
import { SupplierPaymentDetailsUIComponent } from './layouts/home/Payables/supplier-payment-details-ui/supplier-payment-details-ui.component';
import { PrintSupplierLedgerComponent } from './layouts/prints/print-supplier-ledger/print-supplier-ledger.component';
import { PrintPayableDuesComponent } from './layouts/prints/print-payable-dues/print-payable-dues.component';
import { PrintPayableReportsComponent } from './layouts/prints/print-payable-reports/print-payable-reports.component';
import { ValidateLicenseUIComponent } from './layouts/validate-license-ui/validate-license-ui.component';
import { ClientLicenseUIComponent } from './layouts/client-license-ui/client-license-ui.component';
import { ContactSupportUIComponent } from './layouts/home/Support/contact-support-ui/contact-support-ui.component';
import { SupportEvaluationUIComponent } from './layouts/home/Support/support-evaluation-ui/support-evaluation-ui.component';
import { SoftwareEvaluationUIComponent } from './layouts/home/Support/software-evaluation-ui/software-evaluation-ui.component';
import { SuggestionBoxUIComponent } from './layouts/home/Support/suggestion-box-ui/suggestion-box-ui.component';
import { ItemExpiryDatesUIComponent } from './layouts/home/Inventory/item-expiry-dates-ui/item-expiry-dates-ui.component';
import { ItemExpiryDateUIComponent } from './layouts/home/Inventory/item-expiry-date-ui/item-expiry-date-ui.component';
import { PrintStocksExpiryComponent } from './layouts/prints/print-stocks-expiry/print-stocks-expiry.component';
import { OrderReportsComponent } from './layouts/home/Orders/order-reports/order-reports.component';
import { OrderConfigComponent } from './layouts/home/Orders/order-config/order-config.component';
import { OrderHeaderUIComponent } from './layouts/home/Orders/order-header-ui/order-header-ui.component';
import { OrderDetailUIComponent } from './layouts/home/Orders/order-detail-ui/order-detail-ui.component';
import { OrderDetailsUIComponent } from './layouts/home/Orders/order-details-ui/order-details-ui.component';
import { LoadItemsForOrderUIComponent } from './layouts/home/Orders/load-items-for-order-ui/load-items-for-order-ui.component';
import { OrderPendingTransactionsUIComponent } from './layouts/home/Orders/order-pending-transactions-ui/order-pending-transactions-ui.component';
import { OrderReceiptsComponent } from './layouts/home/Orders/order-receipts/order-receipts.component';
import { PrintOrderReceiptsComponent } from './layouts/prints/print-order-receipts/print-order-receipts.component';
import { PrintOrderDetailsComponent } from './layouts/prints/print-order-details/print-order-details.component';
import { PrintOrderReportsComponent } from './layouts/prints/print-order-reports/print-order-reports.component';
import { PendingSaleOrdersUIComponent } from './layouts/home/Orders/pending-sale-orders-ui/pending-sale-orders-ui.component';
import { DeliveryReceiptsComponent } from './layouts/home/Delivery/delivery-receipts/delivery-receipts.component';
import { DeliveryReportsComponent } from './layouts/home/Delivery/delivery-reports/delivery-reports.component';
import { DeliveryConfigComponent } from './layouts/home/Delivery/delivery-config/delivery-config.component';
import { LoadItemsForDeliveryUIComponent } from './layouts/home/Delivery/load-items-for-delivery-ui/load-items-for-delivery-ui.component';
import { DeliveryDetailUIComponent } from './layouts/home/Delivery/delivery-detail-ui/delivery-detail-ui.component';
import { DeliveryDetailsUIComponent } from './layouts/home/Delivery/delivery-details-ui/delivery-details-ui.component';
import { DeliveryHeaderUIComponent } from './layouts/home/Delivery/delivery-header-ui/delivery-header-ui.component';
import { LoadReceiptsForDeliveryUIComponent } from './layouts/home/Delivery/load-receipts-for-delivery-ui/load-receipts-for-delivery-ui.component';
import { PrintDeliveryDetailsComponent } from './layouts/prints/print-delivery-details/print-delivery-details.component';
import { PrintDeliveryReceiptsComponent } from './layouts/prints/print-delivery-receipts/print-delivery-receipts.component';
import { PrintDeliveryReportsComponent } from './layouts/prints/print-delivery-reports/print-delivery-reports.component';
import { UploadItemsUIComponentComponent } from './layouts/home/Files/upload-items-uicomponent/upload-items-uicomponent.component';
import { UploadCustomersUIComponentComponent } from './layouts/home/Files/upload-customers-uicomponent/upload-customers-uicomponent.component';
import { UploadSuppliersUIComponentComponent } from './layouts/home/Files/upload-suppliers-uicomponent/upload-suppliers-uicomponent.component';
import { UseForTaggingsUIComponent } from './layouts/home/Files/use-for-taggings-ui/use-for-taggings-ui.component';
import { CanvassForApprovalComponent } from './layouts/home/Canvassing/canvass-for-approval/canvass-for-approval.component';
import { CanvassReceiptsComponent } from './layouts/home/Canvassing/canvass-receipts/canvass-receipts.component';
import { CanvassReportsComponent } from './layouts/home/Canvassing/canvass-reports/canvass-reports.component';
import { CanvassDetailUIComponent } from './layouts/home/Canvassing/canvass-detail-ui/canvass-detail-ui.component';
import { CanvassDetailsUIComponent } from './layouts/home/Canvassing/canvass-details-ui/canvass-details-ui.component';
import { CanvassHeaderUIComponent } from './layouts/home/Canvassing/canvass-header-ui/canvass-header-ui.component';
import { LoadItemsForCanvassUIComponent } from './layouts/home/Canvassing/load-items-for-canvass-ui/load-items-for-canvass-ui.component';
import { CanvassPendingTransactionUIComponent } from './layouts/home/Canvassing/canvass-pending-transaction-ui/canvass-pending-transaction-ui.component';
import { CanvassReasonsUIComponent } from './layouts/home/Canvassing/canvass-reasons-ui/canvass-reasons-ui.component';
import { CanvassSuppliersUIComponent } from './layouts/home/Canvassing/canvass-suppliers-ui/canvass-suppliers-ui.component';
import { StockSupplierUIComponent } from './layouts/home/Canvassing/stock-supplier-ui/stock-supplier-ui.component';
import { PrintCanvassDetailsComponent } from './layouts/prints/print-canvass-details/print-canvass-details.component';
import { PrintCanvassReceiptsComponent } from './layouts/prints/print-canvass-receipts/print-canvass-receipts.component';
import { PrintCanvassReportsComponent } from './layouts/prints/print-canvass-reports/print-canvass-reports.component';
import { LoadItemsForPOUIComponent } from './layouts/home/Purchasing/load-items-for-poui/load-items-for-poui.component';
import { POConfigComponent } from './layouts/home/Purchasing/poconfig/poconfig.component';
import { PODetailUIComponent } from './layouts/home/Purchasing/podetail-ui/podetail-ui.component';
import { PODetailsUIComponent } from './layouts/home/Purchasing/podetails-ui/podetails-ui.component';
import { POHeaderUIComponent } from './layouts/home/Purchasing/poheader-ui/poheader-ui.component';
import { POPendingTransactionsUIComponent } from './layouts/home/Purchasing/popending-transactions-ui/popending-transactions-ui.component';
import { POReceiptsComponent } from './layouts/home/Purchasing/poreceipts/poreceipts.component';
import { POReportsComponent } from './layouts/home/Purchasing/poreports/poreports.component';
import { CanvassForPOUIComponent } from './layouts/home/Canvassing/canvass-for-poui/canvass-for-poui.component';
import { PrintPODetailsComponent } from './layouts/prints/print-podetails/print-podetails.component';
import { PrintPOReceiptsComponent } from './layouts/prints/print-poreceipts/print-poreceipts.component';
import { PrintPOReportsComponent } from './layouts/prints/print-poreports/print-poreports.component';
import { ItemPhotoUIComponent } from './layouts/home/Files/item-photo-ui/item-photo-ui.component';
import { EmployeesUIComponent } from './layouts/home/Files/employees-ui/employees-ui.component';
import { PrintVoucherReceiptsComponent } from './layouts/prints/print-voucher-receipts/print-voucher-receipts.component';
import { PrintVoucherReceiptComponent } from './layouts/prints/print-voucher-receipt/print-voucher-receipt.component';
import { PrintVoucherReportsComponent } from './layouts/prints/print-voucher-reports/print-voucher-reports.component';
import { PettyCashVoucherComponent } from './layouts/home/Vouchering/petty-cash-voucher/petty-cash-voucher.component';
import { PrintSaleReturnReportsComponent } from './layouts/prints/print-sale-return-reports/print-sale-return-reports.component';
import { PrintSalesTypeReadingComponent } from './layouts/prints/print-sales-type-reading/print-sales-type-reading.component';
import { DisbursementRequestsComponent } from './layouts/home/Disbursements/disbursement-requests/disbursement-requests.component';
import { DisbursementRecordsComponent } from './layouts/home/Disbursements/disbursement-records/disbursement-records.component';
import { DisbursementReportsComponent } from './layouts/home/Disbursements/disbursement-reports/disbursement-reports.component';
import { UnliquidatedPettyCashComponent } from './layouts/home/Disbursements/unliquidated-petty-cash/unliquidated-petty-cash.component';
import { LiquidatedPettyCashComponent } from './layouts/home/Disbursements/liquidated-petty-cash/liquidated-petty-cash.component';
import { DisbursedChecksComponent } from './layouts/home/Disbursements/disbursed-checks/disbursed-checks.component';
import { DisbursementTransactionUIComponent } from './layouts/home/Disbursements/disbursement-transaction-ui/disbursement-transaction-ui.component';
import { ReceivingAveCostHistoryUIComponent } from './layouts/home/Receiving/receiving-ave-cost-history-ui/receiving-ave-cost-history-ui.component';
import { PrintReceivingAveCostHistoryComponent } from './layouts/prints/print-receiving-ave-cost-history/print-receiving-ave-cost-history.component';
import { BranchesComponent } from './layouts/home/Files/branches/branches.component';
import { BranchUIComponent } from './layouts/home/Files/branch-ui/branch-ui.component';
import { BranchUsersUIComponent } from './layouts/home/Files/branch-users-ui/branch-users-ui.component';
import { OffsetFromPettyCashUIComponent } from './layouts/home/Disbursements/offset-from-petty-cash-ui/offset-from-petty-cash-ui.component';
import { PrintDisbursementReceiptsComponent } from './layouts/prints/print-disbursement-receipts/print-disbursement-receipts.component';
import { PrintDisbursementReceiptComponent } from './layouts/prints/print-disbursement-receipt/print-disbursement-receipt.component';
import { PrintDisbursementReportsComponent } from './layouts/prints/print-disbursement-reports/print-disbursement-reports.component';
import { PrintDisbursedChecksComponent } from './layouts/prints/print-disbursed-checks/print-disbursed-checks.component';
import { LiquidateUIComponent } from './layouts/home/Disbursements/liquidate-ui/liquidate-ui.component';
import { PrintPettyCashDetailsReceiptComponent } from './layouts/prints/print-petty-cash-details-receipt/print-petty-cash-details-receipt.component';
import { PrintPettyCashRecordsComponent } from './layouts/prints/print-petty-cash-records/print-petty-cash-records.component';
import { LoadStocksTransferUIComponent } from './layouts/home/StockAdjustments/load-stocks-transfer-ui/load-stocks-transfer-ui.component';
import { StocksInquiryComponent } from './layouts/home/Inventory/stocks-inquiry/stocks-inquiry.component';
import { PrintStocksInquiryComponent } from './layouts/prints/print-stocks-inquiry/print-stocks-inquiry.component';
import { BanksUIComponent } from './layouts/home/CustomerChecks/banks-ui/banks-ui.component';
import { XZReadingsComponent } from './layouts/home/BIR/xzreadings/xzreadings.component';
import { EReceiptsComponent } from './layouts/home/BIR/ereceipts/ereceipts.component';
import { ESalesBookComponent } from './layouts/home/BIR/esales-book/esales-book.component';
import { BIRDiscountsComponent } from './layouts/home/BIR/birdiscounts/birdiscounts.component';
import { VATSaleTypesComponent } from './layouts/home/BIR/vatsale-types/vatsale-types.component';
import { BIRSalesReportComponent } from './layouts/home/BIR/bir-sales-report/bir-sales-report.component';
import { BIRSalesReportTablesComponent } from './layouts/home/BIR/bir-sales-report-tables/bir-sales-report-tables.component';
import { PrintBIRSalesReportComponent } from './layouts/prints/print-bir-sales-report/print-bir-sales-report.component';
import { ZReadingsComponent } from './layouts/home/BIR/zreadings/zreadings.component';
import { XReadingsComponent } from './layouts/home/BIR/xreadings/xreadings.component';
import { POForDeliveryUIComponent } from './layouts/home/Purchasing/pofor-delivery-ui/pofor-delivery-ui.component';
import { ZReadingsUIComponent } from './layouts/home/BIR/zreadings-ui/zreadings-ui.component';
import { PrintZReadingsComponent } from './layouts/prints/print-zreadings/print-zreadings.component';
import { PrintZReadingReceiptComponent } from './layouts/prints/print-zreading-receipt/print-zreading-receipt.component';
import { PrintZReadingPOSComponent } from './layouts/prints/print-zreading-pos/print-zreading-pos.component';
import { PrintXReadingReceiptComponent } from './layouts/prints/print-xreading-receipt/print-xreading-receipt.component';
import { PrintXReadingPOSComponent } from './layouts/prints/print-xreading-pos/print-xreading-pos.component';
import { PrintESalesBookComponent } from './layouts/prints/print-esales-book/print-esales-book.component';
import { PrintBIRDiscountsComponent } from './layouts/prints/print-birdiscounts/print-birdiscounts.component';
import { PrintVATSalesTypeComponent } from './layouts/prints/print-vatsales-type/print-vatsales-type.component';
import { MultiplePaymentUIComponent } from './layouts/home/MultiplePayments/multiple-payment-ui/multiple-payment-ui.component';
import { EncryptedRedirectComponent } from './layouts/encrypted-redirect/encrypted-redirect.component';
import { MultiplePaymentDetailsUIComponent } from './layouts/home/MultiplePayments/multiple-payment-details-ui/multiple-payment-details-ui.component';
import { SignaturesUIComponent } from './layouts/home/Config/signatures-ui/signatures-ui.component';
import { BackgroundLogoUIComponent } from './layouts/background-logo-ui/background-logo-ui.component';
import { BusinessBackgroundLogoUIComponent } from './layouts/home/Config/business-background-logo-ui/business-background-logo-ui.component';
import { SignatureUIComponent } from './layouts/home/Config/signature-ui/signature-ui.component';
import { PrintSetSignaturesComponent } from './layouts/prints/print-set-signatures/print-set-signatures.component';
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
import { SaleConfigAccessRightsUIComponent } from './layouts/home/Sales/sale-config-access-rights-ui/sale-config-access-rights-ui.component';
import { PasswordUIComponent } from './layouts/home/Sales/password-ui/password-ui.component';
import { ProfitPerformanceComponent } from './layouts/home/Accounting/profit-performance/profit-performance.component';
import { DebtToCashCoverageComponent } from './layouts/home/Accounting/debt-to-cash-coverage/debt-to-cash-coverage.component';
import { PrintProfitPerformanceComponent } from './layouts/prints/print-profit-performance/print-profit-performance.component';
import { PrintDebtToCashCoverageComponent } from './layouts/prints/print-debt-to-cash-coverage/print-debt-to-cash-coverage.component';
import { MultipleUMsComponent } from './layouts/home/Files/multiple-ums/multiple-ums.component';
import { MultipleUMUIComponent } from './layouts/home/Files/multiple-umui/multiple-umui.component';
import { ReceivingConfigAccessRightsUIComponent } from './layouts/home/Receiving/receiving-config-access-rights-ui/receiving-config-access-rights-ui.component';
import { UpdatePriceUIComponent } from './layouts/home/Receiving/update-price-ui/update-price-ui.component';
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
import { SalesConfigPerMachineComponent } from './layouts/home/Sales/sales-config-per-machine/sales-config-per-machine.component';
import { SerialNosUIComponent } from './layouts/home/Files/serial-nos-ui/serial-nos-ui.component';
import { SaleSerialNosUIComponent } from './layouts/home/Sales/sale-serial-nos-ui/sale-serial-nos-ui.component';
import { RRSerialNosUIComponent } from './layouts/home/Receiving/rrserial-nos-ui/rrserial-nos-ui.component';
import { InSerialNosUIComponent } from './layouts/home/StockAdjustments/in-serial-nos-ui/in-serial-nos-ui.component';
import { OutSerialNosUIComponent } from './layouts/home/StockAdjustments/out-serial-nos-ui/out-serial-nos-ui.component';
import { SRSerialNosUIComponent } from './layouts/home/SaleReturn/srserial-nos-ui/srserial-nos-ui.component';
import { RTSSerialNosUIComponent } from './layouts/home/ReturnToSupplier/rtsserial-nos-ui/rtsserial-nos-ui.component';
import { StockTransferReportComponent } from './layouts/home/StockAdjustments/stock-transfer-report/stock-transfer-report.component';
import { StockAdjustmentReportYearlyComponent } from './layouts/home/StockAdjustments/stock-adjustment-report-yearly/stock-adjustment-report-yearly.component';
import { PrintStockTransferReceiptsComponent } from './layouts/prints/print-stock-transfer-receipts/print-stock-transfer-receipts.component';
import { PrintStockTransferDetailsComponent } from './layouts/prints/print-stock-transfer-details/print-stock-transfer-details.component';
import { PopupAccessRightsUIComponent } from './layouts/home/Support/popup-access-rights-ui/popup-access-rights-ui.component';
import { StockAdjustmentConfigComponent } from './layouts/home/StockAdjustments/stock-adjustment-config/stock-adjustment-config.component';
import { PopupsUIComponent } from './layouts/home/Support/popups-ui/popups-ui.component';
import { PopupConfigUIComponent } from './layouts/home/Support/popup-config-ui/popup-config-ui.component';
import { UserGuideComponent } from './layouts/home/UserGuide/user-guide/user-guide.component';
import { ItemPriceHistoryComponent } from './layouts/home/Reports/item-price-history/item-price-history.component';
import { ItemCostHistoryComponent } from './layouts/home/Reports/item-cost-history/item-cost-history.component';
import { PrintItemPriceHistoryComponent } from './layouts/prints/print-item-price-history/print-item-price-history.component';
import { PrintItemCostHistoryComponent } from './layouts/prints/print-item-cost-history/print-item-cost-history.component';
import { NgxMaskModule } from 'ngx-mask';
import { TouchContextMenuDirective } from './layouts/shared/directives/touch-context-menu.directive';
import { BranchUpdateUIComponent } from './layouts/home/Files/branch-update-ui/branch-update-ui.component';
import { CashflowLedgerUIComponent } from './layouts/home/Accounting/cashflow-ledger-ui/cashflow-ledger-ui.component';
import { BackupComponent } from './layouts/home/Config/backup/backup.component';
import { StockAdjustmentReportMonthlyComponent } from './layouts/home/StockAdjustments/stock-adjustment-report-monthly/stock-adjustment-report-monthly.component';
import { StockAdjustmentReportDailyComponent } from './layouts/home/StockAdjustments/stock-adjustment-report-daily/stock-adjustment-report-daily.component';
import { PrintDailyStockAdjustmentReportComponent } from './layouts/prints/print-daily-stock-adjustment-report/print-daily-stock-adjustment-report.component';
import { PrintMonthlyStockAdjustmentReportComponent } from './layouts/prints/print-monthly-stock-adjustment-report/print-monthly-stock-adjustment-report.component';
import { ColumnTotalPipe, RowClassesPipe, RowDisplayPipe, RowTotalPipe } from './services/mat-table.pipes';
import { SupplierChecksComponent } from './layouts/home/SupplierChecks/supplier-checks/supplier-checks.component';
import { SupplierCheckUIComponent } from './layouts/home/SupplierChecks/supplier-check-ui/supplier-check-ui.component';
import { UnpaidSupplierChecksUIComponent } from './layouts/home/SupplierChecks/unpaid-supplier-checks-ui/unpaid-supplier-checks-ui.component';
import { CheckReportsUIComponent } from './layouts/home/Cashflow/check-reports-ui/check-reports-ui.component';
import { PrintCheckReportsComponent } from './layouts/prints/print-check-reports/print-check-reports.component';
import { PrintSupplierChecksComponent } from './prints/print-supplier-checks/print-supplier-checks.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    FnbDashboardComponent,
    ProfileComponent,
    EditProfileComponent,
    ChangePasswordUIComponent,
    BusinessInfoComponent,
    MachinePermitsComponent,
    VendorPermitsComponent,
    SelectedMachinePermitComponent,
    AccessRightsComponent,
    AddAccessRightComponent,
    AddAccessRightMenusUIComponent, 
    MenusUIComponent,
    SelectedMenuUIComponent, 
    SelectedSubMenuUIComponent, 
    SubMenuButtonsUIComponent, 
    SubMenusComponent, 
    UserAccountsComponent, 
    SelectedUserAccountUIComponent,
    UserActivitiesComponent, 
    ActivityDetailsUIComponent,
    UserMenusComponent, 
    AddAccessRightSubMenusUIComponent, 
    AddAccessRightSubMenuButtonsUIComponent, 
    PrintUserActivitiesComponent, 
    PrintUserAccountsComponent, 
    PrintMachinePermitsComponent, 
    PrintComponent, 
    AllButtonsComponent, 
    APrintHeaderComponent, 
    ItemsComponent, 
    CustomersComponent, 
    SuppliersComponent, 
    TablesUIComponent,
    TableUIComponent,
    TableCategorysUIComponent,
    PrintersUIComponent,
    PrinterUIComponent,
    AssignedItemsUIComponent,
    FilesConfigUIComponent,
    MenuCostingComponent,
    ComponentsUIComponent,
    UMConvertionUIComponent,
    MenuSalesReportComponent,
    EndOfDayInventoryComponent,
    IngredientsUsedUIComponent,
    ProductionTransactionComponent,
    ProductionReceiptsComponent,
    ProductionEntryUIComponent,
    ProductionDetailsUIComponent,
    ProductionReportsComponent,
    PrintDataListComponent,
    PrintOrderSlipComponent,
    ItemUnitsUIComponent, 
    ItemCategorysUIComponent, 
    PrintItemsComponent, 
    PrintCustomersComponent, 
    PrintSuppliersComponent, 
    CustomerUIComponent,
    ItemUIComponent,
    SupplierUIComponent,
    ItemPriceCategorysUIComponent,
    PriceCategoryUIComponent,
    BarcodeItemsUIComponent,
    BarcodeUIComponent,
    PrintBarcodeItemsComponent,
    AprintFooterComponent,
    StocksComponent,
    StockTotalsComponent,
    StockEndingBalanceComponent,
    StocksExpiryComponent,
    InventoryStocksComponent,
    InventoryHistoryComponent,
    InventoryConfigUIComponent,
    ItemTypesUIComponent,
    PrintStocksComponent,
    BusinessStylesUIComponent,
    PrintStocksTotalsComponent,
    AdjustPriceUIComponent,
    PrintStocksEndingBalanceComponent,
    StockLedgerUIComponent,
    PrintStockLedgerComponent,
    PrintInventoryStocksComponent,
    PrintInventoryHistoryComponent,
    InventoryDetailsUIComponent,
    InventoryDetailUIComponent,
    PrintInventoryDetailsComponent,
    DevelopersMessageUIComponent,
    VoucherRequestUIComponent,
    VoucherTransUIComponent,
    VoucherRecordsUIComponent,
    VoucherReportsUIComponent,
    SalesReceiptsComponent,
    SalesReportsComponent,
    SalesJournalComponent,
    SalesLedgerComponent,
    SalesOrderingComponent,
    SalesCashieringComponent,
    SalesConfigComponent,
    SaleHeaderUIComponent,
    SaleDetailsUIComponent,
    SaleDetailUIComponent,
    LoadItemsForSaleUIComponent,
    PendingTransactionsUIComponent,
    CustomerPointsUIComponent,
    UnpaidCustomerChecksUIComponent,
    DiscountPersonsUIComponent,
    DiscountApplicationUIComponent,
    KitchenReadyUIComponent,
    KitchenOrderCardsComponent,
    DateRangeFilterComponent,
    PrintKitchenQueueHistoryComponent,
    OnScreenKeyboardComponent,
    ItemThumbComponent,
    PrintPOSComponent,
    PrintPOSBIRComponent,
    ReceiptLinesComponent,
    ChangeUIComponent,
    PrintSaleReceiptsComponent,
    PrintSaleDetailsComponent,
    VoidReasonUIComponent,
    SetUpgradeUIComponent,
    AccountingEntryUIComponent,
    PrintAccountingEntryComponent,
    SalesYearlyReportComponent,
    SalesMonthlyReportComponent,
    SalesDailyReportComponent,
    SalesVoidSalesReportComponent,
    SalesDiscountSalesReportComponent,
    SalesCustomerSalesReportComponent,
    SalesWHTaxSalesReportComponent,
    SalesVATSalesReportComponent,
    SalesRebatePaidReportComponent,
    PrintYearlySalesReportComponent,
    PrintMonthlySalesReportComponent,
    PrintDailySalesReportComponent,
    PrintVoidSalesReportComponent,
    PrintDiscountSalesReportComponent,
    PrintCustomerSalesReportComponent,
    PrintWHTaxSalesReportComponent,
    PrintVATSalesReportComponent,
    PrintRebatePaidSalesReportComponent,
    GeneralJournalUIComponent,
    PrintGeneralJournalComponent,
    GeneralLedgerUIComponent,
    PrintGeneralLedgerComponent,
    CashDrawerUIComponent,
    CashieringRecordsComponent,
    CashieringReportsComponent,
    CashieringAccessRightsComponent,
    CashieringConfigComponent,
    CashDrawerComponent,
    ReceivingHeaderUIComponent,
    ReceivingDetailUIComponent,
    ReceivingDetailsUIComponent,
    ReceivingReceiptsComponent,
    ReceivingReportsComponent,
    ReceivingJournalComponent,
    ReceivingLedgerComponent,
    ReceivingConfigComponent,
    LoadItemsForReceivingUIComponent,
    ReceivingPendingTransactionsUIComponent,
    PrintReceivingDetailsComponent,
    PrintReceivingReceiptsComponent,
    ReceivingYearlyReportComponent,
    ReceivingMonthlyReportComponent,
    ReceivingDailyReportComponent,
    ReceivingVoidReceivingReportComponent,
    ReceivingDiscountReceivingReportComponent,
    ReceivingWHTaxReceivingReportComponent,
    ReceivingVATReceivingReportComponent,
    ReceivingSupplierReceivingReportComponent,
    PrintYearlyReceivingReportComponent,
    PrintMonthlyReceivingReportComponent,
    PrintDailyReceivingReportComponent,
    PrintVoidReceivingReportComponent,
    PrintDiscountReceivingReportComponent,
    PrintWHTaxReceivingReportComponent,
    PrintVATReceivingReportComponent,
    PrintSupplierReceivingReportComponent,
    ExpenseReceiptsComponent,
    ExpenseReportsComponent,
    ExpenseJournalComponent,
    ExpenseLedgerComponent,
    ExpenseConfigComponent,
    ExpensePayeesUIComponent,
    ExpensePayeeUIComponent,
    ExpenseParticularsUIComponent,
    ExpenseParticularUIComponent,
    ExpenseHeaderUIComponent,
    ExpenseDetailsUIComponent,
    ExpenseDetailUIComponent,
    LoadParticularsForExpenseUIComponent,
    ExpensePendingTransactionsUIComponent,
    PrintExpenseDetailsComponent,
    PrintExpenseReceiptsComponent,
    ExpensesYearlyReportComponent,
    ExpensesMonthlyReportComponent,
    ExpensesDateRangeReportComponent,
    PrintYearlyExpensesReportComponent,
    PrintMonthlyExpensesReportComponent,
    SaleReturnReceiptsComponent,
    SaleReturnReportsComponent,
    SaleReturnConfigComponent,
    SaleReturnDetailUIComponent,
    SaleReturnDetailsUIComponent,
    SaleReturnHeaderUIComponent,
    SaleReturnPendingTransactionsUIComponent,
    LoadItemsForSaleReturnUIComponent,
    PrintSaleReturnReceiptsComponent,
    PrintSaleReturnDetailsComponent,
    CashLedgerUIComponent,
    PrintCashierLedgersComponent,
    CashCountUIComponent,
    CashReadingRecordsUIComponent,
    PrintCashReadingsComponent,
    PrintSaleReadingsComponent,
    DepositToUIComponent,
    WithdrawalsUIComponent,
    WithdrawalUIComponent,
    PrintWithdrawalsComponent,
    PrintWithdrawalReceiptComponent,
    PrintCashReadingComponent,
    POSPrintCashReadingComponent,
    PrintCashieringRecordDetailsComponent,
    SalesReadingComponent,
    PrintSaleReadingDetailsComponent,
    CashAccountsComponent,
    CashAccountUIComponent,
    CashTransfersComponent,
    CashTransferUIComponent,
    CashTransferLedgerComponent,
    CashTransferJournalComponent,
    CashAccountLedgerComponent,
    CheckBookletsUIComponent,
    CheckBookletUIComponent,
    PrintCashTransfersComponent,
    PrintCashTransferReceiptComponent,
    CommandCenterComponent,
    NetCashReportComponent,
    FastSlowMovingItemsComponent,
    ItemHistoryComponent,
    CustomerHistoryComponent,
    SupplierHistoryComponent,
    DailyNetCashComponent,
    MonthlyNetCashComponent,
    BreakdownNetCashComponent,
    PrintDailyNetCashComponent,
    PrintMonthlyNetCashComponent,
    PrintBreakdownNetCashComponent,
    PrintFastSlowMovingItemsComponent,
    ItemCustomersReportComponent,
    ItemSuppliersReportComponent,
    ItemSaleReturnsReportComponent,
    ItemReturnToSuppliersReportComponent,
    PrintItemCustomersComponent,
    PrintItemSuppliersComponent,
    PrintItemAdjustmentsComponent,
    ItemAdjustmentsReportComponent,
    PrintItemSaleReturnsComponent,
    PrintItemReturnToSuppliersComponent,
    CustomerItemsReportComponent,
    CustomerSaleReturnsReportComponent,
    PrintCustomerItemsComponent,
    PrintCustomerSaleReturnsComponent,
    SupplierItemsReportComponent,
    SupplierReturnToSuppliersReportComponent,
    PrintSupplierItemsComponent,
    PrintSupplierReturnToSuppliersComponent,
    AccountTitlesComponent,
    AdjustingEntriesComponent,
    GeneralJournalComponent,
    GeneralLedgerComponent,
    CashflowLedgerComponent,
    TrialBalanceComponent,
    FinancialStatementsComponent,
    AccountTitleUIComponent,
    PrintAccountTitlesComponent,
    AdjustingEntryDetailsUIComponent,
    AdjustingEntryUIComponent,
    PrintAdjustingEntryRecordsComponent,
    PrintAdjustingEntryDetailComponent,
    PrintCashflowLedgerComponent,
    PrintTrialBalanceComponent,
    IncomeStatementsComponent,
    CashflowStatementsComponent,
    BalanceSheetComponent,
    PrintIncomeStatementsComponent,
    PrintBalanceSheetComponent,
    PrintCashflowStatementsComponent,
    StockAdjustmentReceiptsComponent,
    StockAdjustmentReportsComponent,
    StockAdjustmentJournalComponent,
    StockAdjustmentLedgerComponent,
    StockAdjustmentHeaderUIComponent,
    StockAdjustmentDetailUIComponent,
    StockAdjustmentDetailsUIComponent,
    LoadItemsForStockAdjustmentUIComponent,
    ReasonsUIComponent,
    StockAdjustmentPendingTransactionsUIComponent,
    PrintStockAdjustmentDetailsComponent,
    PrintStockAdjustmentReceiptsComponent,
    PrintStockAdjustmentReportsComponent,
    ReturnToSupplierReceiptsComponent,
    ReturnToSupplierReportsComponent,
    ReturnToSupplierConfigComponent,
    ReturnToSupplierHeaderUIComponent,
    ReturnToSupplierDetailUIComponent,
    ReturnToSupplierDetailsUIComponent,
    ReturnToSupplierPendingTransactionsUIComponent,
    LoadItemsForReturnToSupplierUIComponent,
    PrintReturnToSupplierReceiptsComponent,
    PrintReturnToSupplierDetailsComponent,
    PrintReturnToSupplierReportComponent,
    PaymentReceiptsComponent,
    PaymentReportsComponent,
    CustomerPaymentJournalComponent,
    CustomerPaymentLedgerComponent,
    CustomerLedgerComponent,
    CustomerChecksComponent,
    CustomerChecksReportComponent,
    ReceivableDuesComponent,
    ReceivableReportsComponent,
    ReceivableConfigComponent,
    PaymentDetailUIComponent,
    PaymentDetailsUIComponent,
    PaymentHeaderUIComponent,
    PrintPaymentDetailsComponent,
    PrintPaymentReceiptsComponent,
    PrintPaymentReportsComponent,
    PrintCustomerLedgerComponent,
    PrintCustomerChecksComponent,
    CustomerCheckUIComponent,
    CCheckDepositToUIComponent,
    PrintCustomerChecksReportComponent,
    PrintReceivableDuesComponent,
    PrintReceivableReportsComponent,
    ReceivableOldReceiptsUIComponent,
    ReceivableOldReceiptUIComponent,
    PrintReceivableOldReceiptsComponent,
    PrintReceivableOldReceiptComponent,
    SupplierLedgerComponent,
    SupplierPaymentReceiptsComponent,
    SupplierPaymentReportsComponent,
    SupplierPaymentJournalComponent,
    SupplierPaymentLedgerComponent,
    PayableDuesComponent,
    PayableReportsComponent,
    PayableConfigComponent,
    PayableOldReceiptsUIComponent,
    SupplierPaymentHeaderUIComponent,
    SupplierPaymentDetailUIComponent,
    LoadReceiptsForPaymentUIComponent,
    LoadReceiptsForSupplierPaymentUIComponent,
    PayableOldReceiptUIComponent,
    PrintPayableOldReceiptComponent,
    PrintPayableOldReceiptsComponent,
    PrintSupplierPaymentReceiptsComponent,
    PrintSupplierPaymentDetailsComponent,
    SupplierPaymentDetailsUIComponent,
    PrintSupplierLedgerComponent,
    PrintPayableDuesComponent,
    PrintPayableReportsComponent,
    ValidateLicenseUIComponent,
    ClientLicenseUIComponent,
    ContactSupportUIComponent,
    SupportEvaluationUIComponent,
    SoftwareEvaluationUIComponent,
    SuggestionBoxUIComponent,
    ItemExpiryDatesUIComponent,
    ItemExpiryDateUIComponent,
    PrintStocksExpiryComponent,
    OrderReceiptsComponent,
    OrderReportsComponent,
    OrderConfigComponent,
    OrderHeaderUIComponent,
    OrderDetailUIComponent,
    OrderDetailsUIComponent,
    LoadItemsForOrderUIComponent,
    OrderPendingTransactionsUIComponent,
    PrintOrderReceiptsComponent,
    PrintOrderDetailsComponent,
    PrintOrderReportsComponent,
    PendingSaleOrdersUIComponent,
    DeliveryReceiptsComponent,
    DeliveryReportsComponent,
    DeliveryConfigComponent,
    LoadItemsForDeliveryUIComponent,
    DeliveryDetailUIComponent,
    DeliveryDetailsUIComponent,
    DeliveryHeaderUIComponent,
    LoadReceiptsForDeliveryUIComponent,
    PrintDeliveryDetailsComponent,
    PrintDeliveryReceiptsComponent,
    PrintDeliveryReportsComponent,
    UploadItemsUIComponentComponent,
    UploadCustomersUIComponentComponent,
    UploadSuppliersUIComponentComponent,
    UseForTaggingsUIComponent,
    CanvassForApprovalComponent,
    CanvassReceiptsComponent,
    CanvassReportsComponent,
    CanvassDetailUIComponent,
    CanvassDetailsUIComponent,
    CanvassHeaderUIComponent,
    LoadItemsForCanvassUIComponent,
    CanvassPendingTransactionUIComponent,
    CanvassReasonsUIComponent,
    CanvassSuppliersUIComponent,
    StockSupplierUIComponent,
    PrintCanvassDetailsComponent,
    PrintCanvassReceiptsComponent,
    PrintCanvassReportsComponent,
    LoadItemsForPOUIComponent,
    POConfigComponent,
    PODetailUIComponent,
    PODetailsUIComponent,
    POHeaderUIComponent,
    POPendingTransactionsUIComponent,
    POReceiptsComponent,
    POReportsComponent,
    CanvassForPOUIComponent,
    PrintPODetailsComponent,
    PrintPOReceiptsComponent,
    PrintPOReportsComponent,
    ItemPhotoUIComponent,
    EmployeesUIComponent,
    PrintVoucherReceiptsComponent,
    PrintVoucherReceiptComponent,
    PrintVoucherReportsComponent,
    PettyCashVoucherComponent,
    PrintSaleReturnReportsComponent,
    PrintSalesTypeReadingComponent,
    DisbursementRequestsComponent,
    DisbursementRecordsComponent,
    DisbursementReportsComponent,
    UnliquidatedPettyCashComponent,
    LiquidatedPettyCashComponent,
    DisbursedChecksComponent,
    DisbursementTransactionUIComponent,
    ReceivingAveCostHistoryUIComponent,
    PrintReceivingAveCostHistoryComponent,
    BranchesComponent,
    BranchUIComponent,
    BranchUsersUIComponent,
    OffsetFromPettyCashUIComponent,
    PrintDisbursementReceiptsComponent,
    PrintDisbursementReceiptComponent,
    PrintDisbursementReportsComponent,
    PrintDisbursedChecksComponent,
    LiquidateUIComponent,
    PrintPettyCashDetailsReceiptComponent,
    PrintPettyCashRecordsComponent,
    LoadStocksTransferUIComponent,
    StocksInquiryComponent,
    PrintStocksInquiryComponent,
    BanksUIComponent,
    XZReadingsComponent,
    EReceiptsComponent,
    ESalesBookComponent,
    BIRDiscountsComponent,
    VATSaleTypesComponent,
    BIRSalesReportComponent,
    BIRSalesReportTablesComponent,
    PrintBIRSalesReportComponent,
    ZReadingsComponent,
    XReadingsComponent,
    POForDeliveryUIComponent,
    ZReadingsUIComponent,
    PrintZReadingsComponent,
    PrintZReadingReceiptComponent,
    PrintZReadingPOSComponent,
    PrintXReadingReceiptComponent,
    PrintXReadingPOSComponent,
    PrintESalesBookComponent,
    PrintBIRDiscountsComponent,
    PrintVATSalesTypeComponent,
    MultiplePaymentUIComponent,
    EncryptedRedirectComponent,
    MultiplePaymentDetailsUIComponent,
    SignaturesUIComponent,
    BackgroundLogoUIComponent,
    BusinessBackgroundLogoUIComponent,
    SignatureUIComponent,
    PrintSetSignaturesComponent,
    SalesSignaturesComponent,
    OrdersSignaturesComponent,
    DeliverySignaturesComponent,
    CanvassSignaturesComponent,
    POSignaturesComponent,
    ReceivingSignaturesComponent,
    PaymentSignaturesComponent,
    PayeeSignaturesComponent,
    ExpenseSignaturesComponent,
    AdjustmentSignaturesComponent,
    SaleReturnSignaturesComponent,
    ReturnToSupplierSignaturesComponent,
    VoucherSignaturesComponent,
    DisbursementSignaturesComponent,
    SaleConfigAccessRightsUIComponent,
    PasswordUIComponent,
    ProfitPerformanceComponent,
    DebtToCashCoverageComponent,
    PrintProfitPerformanceComponent,
    PrintDebtToCashCoverageComponent,
    MultipleUMsComponent,
    MultipleUMUIComponent,
    ReceivingConfigAccessRightsUIComponent,
    UpdatePriceUIComponent,
    PrintCashAccountLedgerComponent,
    OrderTransaction2Component,
    SalesTransaction2Component,
    KitchenQueueComponent,
    DeliveryTransaction2Component,
    CanvassTransaction2Component,
    POTransaction2Component,
    ReceivingTransaction2Component,
    PaymentTransaction2Component,
    PayeeTransaction2Component,
    ExpenseTransaction2Component,
    StockAdjustmentTransaction2Component,
    SaleReturnTransaction2Component,
    ReturnToSupplierTransaction2Component,
    SalesConfigPerMachineComponent,
    SerialNosUIComponent,
    SaleSerialNosUIComponent,
    RRSerialNosUIComponent,
    InSerialNosUIComponent,
    OutSerialNosUIComponent,
    SRSerialNosUIComponent,
    RTSSerialNosUIComponent,
    StockTransferReportComponent,
    StockAdjustmentReportYearlyComponent,
    PrintStockTransferReceiptsComponent,
    PrintStockTransferDetailsComponent,
    PopupAccessRightsUIComponent,
    StockAdjustmentConfigComponent,
    PopupsUIComponent,
    PopupConfigUIComponent,
    UserGuideComponent,
    ItemPriceHistoryComponent,
    ItemCostHistoryComponent,
    PrintItemPriceHistoryComponent,
    PrintItemCostHistoryComponent,
    TouchContextMenuDirective,
    BranchUpdateUIComponent,
    CashflowLedgerUIComponent,
    BackupComponent,
    StockAdjustmentReportMonthlyComponent,
    StockAdjustmentReportDailyComponent,
    PrintDailyStockAdjustmentReportComponent,
    PrintMonthlyStockAdjustmentReportComponent,
    RowDisplayPipe,
    RowClassesPipe,
    ColumnTotalPipe,
    RowTotalPipe,
    SupplierChecksComponent,
    SupplierCheckUIComponent,
    UnpaidSupplierChecksUIComponent,
    CheckReportsUIComponent,
    PrintCheckReportsComponent,
    PrintSupplierChecksComponent, 
  ],
  imports: [
    AgGridModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
    ToastrModule.forRoot(),
    HighchartsChartModule,
    NgSelectModule,
    RouterModule,
    NgxMaskModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [
    DatePipe,
    {
      provide: APP_INITIALIZER,
      useFactory: (runtimeConfig: RuntimeConfigService) => () => runtimeConfig.load(),
      deps: [RuntimeConfigService],
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: ApiBaseInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
