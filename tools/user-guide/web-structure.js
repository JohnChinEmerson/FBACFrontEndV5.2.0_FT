// What the web version offers, per edition. Read on 2026-11-06 from the web database (mariosoft_fbac_v5_2):
//   modules  = the `menus` table: a module is listed for an edition when its Enterprise / Standard / Express / POS /
//              POSBIR / POSBIRBackOffice column is "yes" (this is the filter Menus::getMenusByAccessRightMenuId applies
//              to the session edition; NA / empty sessions are not filtered).
//   screens  = the active rows of the `submenus` table (they are not filtered by edition).
// The guide updates in web-updates.js use this to decide which edition receives which section.
'use strict';

const ALL = ['enterprise', 'standard', 'express', 'pos', 'posbir', 'posbirbo'];

const modules = {
  'Files': ALL,
  'Menus': ['enterprise', 'standard', 'express', 'pos', 'posbirbo'],
  'Inventory': ['enterprise', 'standard', 'express', 'pos', 'posbirbo'],
  'Orders': ['enterprise'],
  'Sales': ALL,
  'Cashiering': ALL,
  'Delivery': ['enterprise'],
  'Canvassing': ['enterprise'],
  'Purchasing': ['enterprise'],
  'Receiving': ['enterprise', 'standard', 'express', 'pos', 'posbirbo'],
  'Receivables': ['enterprise', 'standard'],
  'Payables': ['enterprise', 'standard'],
  'Expenses': ['enterprise', 'standard', 'express', 'pos', 'posbirbo'],
  'StockAdjustments': ['enterprise', 'standard', 'express'],
  'Returns': ALL,
  'Vouchering': ['enterprise'],
  'Disbursements': ['enterprise'],
  'Reports': ['enterprise', 'standard', 'express', 'pos', 'posbirbo'],
  'Cashflow': ['enterprise', 'standard', 'express', 'pos'],
  'Accounting': ['enterprise', 'standard', 'express', 'pos', 'posbirbo'],
  'BIR': ['posbir'],
  'Access Rights': ALL,
  'Config': ['enterprise', 'standard', 'express', 'pos']
};

const screens = {
  'Files': ['Items', 'Customers', 'Suppliers', 'Branches', 'Tables', 'Printers', 'Files Config'],
  'Menus': ['Menu Costing', 'Menu Sales Report', 'End-of-Day Inventory', 'Production Transaction', 'Production Receipts', 'Production Reports'],
  'Inventory': ['Stocks', 'Stock Totals', 'Stocks Inquiry', 'Stock Ending Balance', 'Stocks Expiry', 'Inventory Stocks', 'Inventory History', 'Inventory Config'],
  'Orders': ['Order Transaction', 'Order Receipts', 'Order Reports', 'Order Config', 'Order Signatures'],
  'Sales': ['Sales Transaction', 'Kitchen Queue', 'Sales Receipts', 'Sales Reports', 'Sales Journal', 'Sales Ledger', 'Ordering', 'Cashiering', 'Sales Config', 'Sales Signatures'],
  'Cashiering': ['CashDrawer', 'Cashiering Records', 'Cashiering Reports', 'Cashier Access Rights', 'Cashiering Config'],
  'Delivery': ['Delivery Transaction', 'Delivery Receipts', 'Delivery Reports', 'Delivery Config', 'Delivery Signatures'],
  'Canvassing': ['Canvass Transaction', 'Canvass For Approval', 'Canvass Receipts', 'Canvass Reports', 'Canvass Signatures'],
  'Purchasing': ['PO Transaction', 'PO Receipts', 'PO Reports', 'PO Config', 'PO Signatures'],
  'Receiving': ['Receiving Transaction', 'Receiving Receipts', 'Receiving Reports', 'Receiving Journal', 'Receiving Ledger', 'Receiving Config', 'Receiving Signatures'],
  'Receivables': ['Payment Transaction', 'Payment Receipts', 'Payment Reports', 'Payment Journal', 'Payment Ledger', 'Customer Ledger', 'Receivable Dues', 'Receivable Reports', 'Receivable Config', 'Payment Signatures'],
  'Payables': ['Payee Transaction', 'Payee Receipts', 'Payee Reports', 'Payee Journal', 'Payee Ledger', 'Supplier Ledger', 'Payable Dues', 'Payable Reports', 'Payable Config', 'Payee Signatures'],
  'Expenses': ['Expense Transaction', 'Expense Receipts', 'Expense Reports', 'Expense Journal', 'Expense Ledger', 'Payees', 'Particulars', 'Expense Config', 'Expense Signatures'],
  'StockAdjustments': ['Adjustment Transaction', 'Adjustment Receipts', 'Adjustment Reports', 'Adjustment Journal', 'Adjustment Ledger', 'Adjustment Signatures', 'Adjustment Config'],
  'Returns': ['Sales Return Transaction', 'Sales Return Receipts', 'Sales Return Reports', 'Sales Return Config', 'Sales Return Signatures',
    'Return To Supplier Transaction', 'Return To Supplier Receipts', 'Return To Supplier Reports', 'Return To Supplier Config', 'Return To Supplier Signatures'],
  'Vouchering': ['Voucher Requests', 'Voucher Records', 'Voucher Reports', 'Petty Cash Voucher', 'Voucher Signatures'],
  'Disbursements': ['Disbursement Requests', 'Disbursement Records', 'Disbursement Reports', 'Disbursed Checks', 'Unliquidated Petty Cash', 'Liquidated Petty Cash', 'Disbursement Signatures'],
  'Reports': ['Command Center', 'Net Cash Report', 'Fast-Slow Moving Items', 'Item History', 'Customer History', 'Supplier History'],
  'Cashflow': ['Cash Accounts', 'Cash Transfers', 'Cash Account Ledger', 'Cash Transfer Journal', 'Cash Transfer Ledger', 'Customer Checks', 'Checks Report'],
  'Accounting': ['Account Titles', 'Adjusting Entries', 'General Journal', 'General Ledger', 'Cashflow Ledger', 'Trial Balance', 'Financial Statements', 'Profit Performance', 'Debt to Cash Coverage'],
  'BIR': ['XZ Readings', 'E-Receipts', 'E-Sales Book', 'Discounts', 'VAT Sales', 'Machine Permits', 'Vendor Permit', 'BIR Sales Report'],
  'Access Rights': ['UserAccounts', 'UserActivities', 'User Menus', 'AccessRights'],
  'Config': ['Developers Message', 'Popups', 'Business Info', 'Backup']
};

/** the web module a guide module belongs to (Sales Return and Return To Supplier are one Returns menu on the web) */
const webModule = guideModule => /^(sales return|return to supplier)$/i.test(guideModule) ? 'Returns' : guideModule;

module.exports = { ALL, modules, screens, webModule };
