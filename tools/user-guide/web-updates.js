// Brings the desktop user guides (the .chm sources in ./sources) up to the web version.
//
//   node tools/user-guide/web-updates.js
//
// What the web version has per edition comes from web-structure.js (menus / submenus of the web database) and from the
// code (see the comments next to each section). The script edits the page files, toc.hhc and index.hhk of every edition
// in the same MSHTML style as the existing pages ("Easy Steps", numbered clicks, bold button names). Sections it adds
// carry a <!-- web:... --> marker so running it twice does not repeat them. Start from untouched sources for a clean run.
'use strict';
const fs = require('fs');
const path = require('path');
const g = require('./lib/guide');
const WEB = require('./web-structure');
const { Source, EDITIONS, H, P, STEPS, UL, GAP, pageHtml, nameOf, localOf, norm } = g;

const DG = 'Detailed Guide';
const WV = 'Web Version';
const page = (title, body, h1) => pageHtml(title, h1 || title, body);

/** a group page that is only a numbered list of links (it is written again from the contents on save) */
const listPage = (title, items) => page(title, items.map((it, i) => '<P><FONT size=2>' + (i + 1) + '. <A href="' + it[1] + '">' + g.esc(it[0]) + '</A></FONT></P>' + g.EOL).join(''));

// ============================================================================ content (new pages)

const content = {};

content.login = () => page('Logging In',
  H('Easy Steps:') + GAP +
  STEPS([
    'Open the system address in the browser (computer, tablet or phone).',
    'Select **Branch** (or **Super Admin**).',
    'Input **Username** and **Password** (tick **Show password** to see what you type).',
    'Select **Edition** (hosted system only). **DEFAULT** uses the edition of your user account.',
    'Tick **Remember me** to keep the branch, edition and username on this device. The password is never kept.',
    'Click **Login**.'
  ]) + GAP +
  P('After login the **Dashboard** is shown. On a phone the system opens straight on the Login screen.'));

content.dashboard = () => page('Dashboard',
  H('The Dashboard is the first screen after login. It has three tabs:') + GAP +
  UL([
    '**Dashboard** - select the date range and click **VIEW**. It shows Sales, Transactions, Avg. Sale per Transaction and Open Orders (tables with an unpaid order), then Sales Trend, Category Share, Top-Selling Items, Payment Types and Discounts. Super Admin: select the Branch first.',
    '**Financials** - select the Year (and the Branch, for Super Admin) to view the yearly financial figures.',
    '**Command Center** - the Command Center figures of your edition.'
  ]));

content.mobile = () => page('Using a Phone or Tablet',
  H('A. Open the system in the browser of the phone - it goes straight to the Login screen.') + GAP +
  H('B. Menus') +
  UL([
    'Tap the menu icon to open the side menu, tap a module and then a screen. The menu closes after you choose a screen.',
    'The footer links (Login User, Mariosoft Solutions, Developers Message, User Guide) are at the bottom of the side menu.'
  ]) + GAP +
  H('C. Sales Transaction on a phone') +
  UL([
    'Select the table, choose the category from the dropdown and tap the items.',
    'Open the order to see every line: **Edit** and **Remove** are on each row (and **Cancel** for a line already sent to the kitchen).',
    '**Remove All** and **Cancel Order** (the whole order) are at the top of the order.',
    'The bottom bar has **SEND**, **BILL OUT**, **PAY** and **MORE**. **MORE** shows every other action (SERVE, COMPLETE, UPGRADE, TRANSFER, SPLIT, MERGE ...).',
    'To split a bill, click **SPLIT**, tick the items (or choose **BY AMOUNT**) in the order and click **PAY**.'
  ]) + GAP +
  H('D. Other transaction screens') +
  UL(['The two panels are shown one below the other and the buttons stay at the bottom of the screen.']) + GAP +
  H('E. Kitchen Queue') +
  UL(['The orders are shown in one column with large buttons.']));

content.footer = () => page('Footer Links',
  H('The footer is at the bottom of every screen (at the bottom of the side menu on a phone).') + GAP +
  UL([
    '**LOGIN USER** - the user who is logged in.',
    '**MARIOSOFT SOLUTIONS** - opens the Mariosoft Solutions website.',
    '**DEVELOPERS MESSAGE** - opens the message from the developers.',
    '**USER GUIDE** - opens this guide in a window. It shows the guide of your edition; users of the NA / Default edition see a tab for every edition. Use the contents on the left or the search box, **Previous** / **Next** at the bottom of a topic, and the X at the top right to close it.'
  ]));

// the text of the Developers Message screen of the web version (the desktop guide still had the older Retail Accounting text)
content.devMessage = () =>
  P('Click **DEVELOPERS MESSAGE** in the footer of any screen (at the bottom of the side menu on a phone).') + GAP +
  [
    'Dear Esteemed Users,',
    'As the creator of our Mariosoft Food and Beverage Web Accounting System, I want to express my deep appreciation for choosing us to support your business. Each update, every piece of functionality, and all the work we put into the system is guided by one purpose - helping you succeed.',
    "We recognize that managing a business isn't just about figures or transactions. It's about transforming your dedication and hard work into something tangible. Our aim is to simplify, speed up, and enhance your operations, allowing you to concentrate on what matters most - growing your business and delighting your patrons.",
    'Your feedback, suggestions, and insights continually drive our efforts. We strive every day to improve, adapt, and build a system that serves as more than just software - a real partner in your journey. You motivate us to push boundaries and deliver the best.',
    "Thank you for trusting us to be a part of your path to success. Together, we're reimagining the future of the food and beverage industry - with passion, purpose, and a commitment to helping you thrive.",
    'With sincere appreciation,',
    'Emerson John Chin',
    'Lead Developer'
  ].map(t => P(t) + GAP).join('');

content.signatures = () => page('Signatures',
  P('The **Signatures** button is in the header window of the transactions (next to Print Receipt). It sets the names printed on the signature lines of the receipt. Each module has its own Signatures entry in the menu and in Access Rights (for example Sales Signatures, Receiving Signatures).') + GAP +
  H('Easy Steps:') + GAP +
  STEPS([
    'Open the header window of the transaction (RightClick the receipt->Edit, or the header window when saving).',
    'Click **Signatures**',
    'Click **New**',
    '  Fill-in textboxes: SignLabel (ex. Prepared by), SignName, SignPosition, SignLine',
    'Click **Save**'
  ]) + GAP +
  P('...to change or remove a signature: select it, then click **Edit** / **Delete**.'));

content.kitchenQueue = () => page('Kitchen Queue',
  H('A. Click Sales->Kitchen Queue') +
  UL([
    '**QUEUE** - the orders sent to the kitchen, one card for each order.',
    '**READY TO SERVE** - the tables that have items ready to be served, one card for each table.',
    '**HISTORY** - select Date From, Date To and Status, then Search or Print.'
  ]) + GAP +
  H('B. How to use the kitchen queue?') + P('   Easy Steps:') +
  STEPS([
    'Click Sales->**Kitchen Queue**',
    'On the **QUEUE** tab click **Preparing** on an item when the kitchen starts it (or **All Preparing** for the whole order).',
    'Click **Ready to Serve** when the item is done (or **All Ready to Serve**). Use **Back to Preparing** to undo it.',
    'The waiter sees it on the Sales Transaction (**READY TO SERVE** button). Open the **READY TO SERVE** tab and click **Served** when the item is delivered, or **Serve All** for the whole table.'
  ]) + GAP +
  H('C. Cancelled items') +
  UL([
    'An item cancelled after it was sent stays on its card in red with the word CANCELLED, with a message and a sound, until the kitchen clicks **Acknowledge Cancelled**. It remains in HISTORY as Cancelled.',
    'Items added later to an order that is already in the queue are shown on top with the word NEW.',
    'Long cards show only the first lines: click **See more (+N items)** / **See less**.'
  ]) + GAP +
  H('D. Notes') +
  UL([
    'The screen refreshes by itself every 10 seconds.',
    'Orders reach the Kitchen Queue only when Sales->Sales Config **Send Kitchen** is **Kitchen Display** or **Both**.'
  ]));

content.branches = () => page('Branches',
  H('A. Click Files->Branches') +
  UL([
    'View - to view the branches',
    'Search - to search a branch',
    'RightClick selected branch->**Edit** - to change the branch name',
    'RightClick selected branch->**Delete** - to delete the branch',
    'RightClick selected branch->**Users** - to view the users of the branch; click **Add** / **Remove** to add or remove a user'
  ]));

content.stocksInquiry = () => page('Stocks Inquiry',
  H('A. Click Inventory->Stocks Inquiry') +
  UL([
    'Select the branch tab',
    'Search - to search an item. The available quantity of the item is shown for every branch.',
    'Print - to print the stocks inquiry'
  ]));

content.adjustmentConfig = () => page('Adjustment Config',
  H('A. Click StockAdjustments->Adjustment Config') +
  UL(['Set **ValidateQtyOnStockOut** (yes - the available quantity is checked when stocking out) -> Click Save']));

content.backup = () => page('Backup',
  H('A. Click Config->Backup') +
  UL([
    'Select Date From and Date To - to view the backups made in that period (BackupDate, BackupName)',
    'Backup - to make a backup of the database now. Wait until "Database Backup Ongoing..." is finished.',
    'Download - to download the selected backup file'
  ]) + GAP +
  H('B. How to back up the database?') + P('   Easy Steps:') +
  STEPS(['Click Config->**Backup**', 'Click **Backup**', 'Select the new backup in the list->Click **Download** and keep the file in a safe place']));

content.popups = () => page('Popups',
  H('A. Click Config->Popups') +
  UL([
    'The list shows the users of the selected popup.',
    '**Add Users** - to choose the users who will see the popup after login',
    '**Remove Users** - to stop showing the popup to the selected users',
    '**Popups** - to set the number of days (OnOrBeforeDays) of each popup'
  ]) + GAP +
  H('B. Popup / what is shown after login') +
  UL([
    '**Stocks Expiry** - the stocks that expire within the days set',
    '**Out of Stocks** - the items that are out of stock',
    '**Receivables** / **Payables** - the dues within the days set',
    '**Dashboard** - the dashboard'
  ]) + GAP +
  P('A popup is shown only for the editions that have it.'));

content.profitPerformance = () => page('Profit Performance',
  H('A. Click Accounting->Profit Performance') +
  UL([
    'Select Branch and Year->Click View - the NetRevenue, NetExpense, NetProfit and Percent of each Quarter',
    'Print - to print profit performance'
  ]));

content.debtToCash = () => page('Debt to Cash Coverage',
  H('A. Click Accounting->Debt to Cash Coverage') +
  UL([
    'Select Branch and Year->Click View - the Debt, Cash and Percent of each Quarter',
    'Print - to print debt to cash coverage'
  ]));

content.itemHistory = () => page('Item History',
  H('A. Click Reports->Item History') +
  UL([
    'Select ItemName, FilterType, Branch and DateRange->Click View',
    'FilterType: Customers, Suppliers, Adjustment-StockIn, Adjustment-StockOut, Sales Return, Return To Supplier, Price History or Cost History'
  ]));

content.customerHistory = () => page('Customer History',
  H('A. Click Reports->Customer History') +
  UL([
    'Select CustomerName, FilterType, Branch and DateRange->Click View',
    'FilterType: Items or Sales Return'
  ]));

content.supplierHistory = () => page('Supplier History',
  H('A. Click Reports->Supplier History') +
  UL([
    'Select SupplierName, FilterType, Branch and DateRange->Click View',
    'FilterType: Items or Return To Supplier'
  ]));

content.expensePayees = () => page('Payees',
  H('A. Click Expenses->Payees') +
  UL([
    'View - to view payees',
    'New - to add new payee. Fill-in textboxes: PayeeName, Address, ContactNo, TermDays, PayeeTIN, BusinessStyle->Click Save',
    'Print - to print payees',
    'RightClick selected payee->Edit / Delete'
  ]));

content.expenseParticulars = () => page('Particulars',
  H('A. Click Expenses->Particulars') +
  UL([
    'View - to view particulars',
    'New - to add new particular. Fill-in textboxes: ParticularName, Category, Amount->Click Save',
    'Print - to print particulars',
    'RightClick selected particular->Edit / Delete'
  ]));

content.birSalesReport = () => page('BIR Sales Report',
  H('A. Click BIR->BIR Sales Report') +
  UL([
    'Select DateFrom and DateTo->Click View - to view the sales report required by the BIR',
    'Print - to print the BIR sales report'
  ]));

// Quick Guide steps (number is given when added)
const quickSteps = {
  kitchen: ['Use the Kitchen Queue', 'How to use the Kitchen Queue?', () =>
    H('Easy Steps:') + GAP +
    STEPS([
      'Click Sales->**Sales Transaction**->Select Table->Select Items->Click **SEND**',
      'Click Sales->**Kitchen Queue**',
      'Click **Preparing** (or All Preparing) when the kitchen starts the order',
      'Click **Ready to Serve** when it is done',
      'Open the **READY TO SERVE** tab->Click **Served** (or Serve All) when it is delivered to the customer'
    ])],
  backup: ['Take a Database Backup', 'How to take a database backup?', () =>
    H('Easy Steps:') + GAP +
    STEPS(['Click Config->**Backup**', 'Click **Backup**', 'Select the new backup in the list->Click **Download**'])],
  birSales: ['View BIR Sales Report', 'How to view the BIR sales report?', () =>
    H('Easy Steps:') + GAP +
    STEPS(['Click BIR->**BIR Sales Report**', 'Select DateFrom and DateTo->Click **View**', 'Click **Print**'])]
};

// ============================================================================ edition runner

function run(key) {
  const s = new Source(key);
  const log = [];
  const say = m => log.push(m);
  const has = m => WEB.modules[m].includes(key);
  const dg = (...t) => s.find([DG, ...t]);
  const enterprise = path.join(g.SOURCES, EDITIONS.enterprise);
  /** a page file this edition's folder lacks is copied from the Enterprise folder (same file name) */
  const borrow = f => { if (!s.exists(f) && fs.existsSync(path.join(enterprise, f))) { fs.copyFileSync(path.join(enterprise, f), path.join(s.dir, f)); s.touched.add(f); return true; } return s.exists(f); };
  const append = (titles, marker, body) => { try { if (s.append(titles, marker, body)) say('  + ' + titles.slice(1).join(' > ') + ' (' + marker + ')'); } catch (e) { say('  ! ' + e.message); } };
  const addPage = (parent, o) => { const n = s.addTopic([DG, ...parent], o); say('  + new topic ' + [...parent, o.title].join(' > ')); return n; };

  // ---- 0. glitches in the desktop sources
  if (key === 'posbir' && s.exists('page_61.html')) s.write('page_61.html', s.read('page_61.html').replace(/<title>Customers<\/title>/i, '<title>Suppliers</title>'));

  // ---- 1. screens the web shows that the desktop guide has pages for but never listed (found in the group pages)
  for (const group of s.find([DG]).children.slice()) {
    const gfile = localOf(group);
    if (!gfile || !group.children.length || !s.exists(gfile)) continue;
    const wm = WEB.webModule(nameOf(group));
    if (!WEB.modules[wm] || !WEB.modules[wm].includes(key)) continue;
    const screens = (WEB.screens[wm] || []).map(norm);
    const links = [...s.read(gfile).matchAll(/<A\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/A>/gi)]
      .map(m => ({ file: m[1], text: m[2].replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim() }));
    let prev = null;
    for (const l of links) {
      const have = group.children.find(c => localOf(c).toLowerCase() === l.file.toLowerCase());
      if (have) { prev = have; continue; }
      if (!s.exists(l.file) || s.usesFile(l.file) || !screens.includes(norm(l.text))) continue;
      s.addTopic([DG, nameOf(group)], { title: l.text, file: l.file, after: prev ? nameOf(prev) : null, first: !prev });
      prev = group.children.find(c => localOf(c).toLowerCase() === l.file.toLowerCase());
      s.rename([DG, nameOf(group), l.text], l.text);
      say('  + listed ' + nameOf(group) + ' > ' + l.text);
    }
  }

  // ---- 2. Returns: Sales Return and Return To Supplier are one menu on the web
  const sr = dg('Sales Return'), rts = dg('Return To Supplier');
  if (sr || rts) {
    const first = sr ? 'Sales Return' : 'Return To Supplier';
    const at = s.find([DG]).children.findIndex(c => norm(nameOf(c)) === norm(first));
    const items = [sr && ['Sales Return', localOf(sr)], rts && ['Return To Supplier', localOf(rts)]].filter(Boolean);
    s.addTopic([DG], { title: 'Returns', file: 'returns_group.htm', html: listPage('Returns', items), image: 1 });
    const parent = s.find([DG]).children;
    const node = parent.pop();                       // addTopic put it last: place it where the first group was
    parent.splice(at, 0, node);
    for (const t of ['Sales Return', 'Return To Supplier']) if (dg(t)) s.moveTopic([DG, t], [DG, 'Returns']);
    say('  ~ Sales Return / Return To Supplier -> Returns');
  }
  const pathFix = [
    [/(Click\s+)Sales Return(-&gt;)/g, '$1Returns$2'],
    [/(Click\s+)Return To Supplier(-&gt;)/g, '$1Returns$2']
  ];
  pathFix.forEach(([re, to]) => s.replaceAllRe(re, to));

  // ---- 3. Customer Checks / Checks Report moved from Receivables to Cashflow
  if (has('Cashflow') && dg('Cashflow')) {
    for (const t of ['Customer Checks', 'Checks Report']) {
      if (dg('Receivables', t)) { s.moveTopic([DG, 'Receivables', t], [DG, 'Cashflow']); say('  ~ ' + t + ': Receivables -> Cashflow'); }
      else if (!dg('Cashflow', t)) {
        const f = t === 'Customer Checks' ? 'page_125.html' : 'page_126.html';
        if (borrow(f)) { s.addTopic([DG, 'Cashflow'], { title: t, file: f }); say('  + ' + t + ' added to Cashflow'); }
      }
    }
    for (const f of ['page_125.html', 'page_126.html', 'page_43.html']) if (s.exists(f)) {
      s.write(f, s.read(f).replace(/Receivables-&gt;(<STRONG>)?(\s*)(Customer\s+Checks|Checks\s+Report)/gi, 'Cashflow-&gt;$1$2$3'));
    }
    append([DG, 'Cashflow', 'Customer Checks'], 'checks',
      UL(['Web version - filter the checks by **Status**, **Month** and **Year**. Select checks and click **Deposit / Undeposit** to deposit or undeposit them.']));
  }
  const qChecks = s.quick(/customer checks/i);
  if (qChecks && s.exists(localOf(qChecks))) s.write(localOf(qChecks), s.read(localOf(qChecks)).replace(/Receivables-&gt;(<STRONG>)?(\s*)Customer/i, 'Cashflow-&gt;$1$2Customer'));

  // ---- 4. Web Version group (first in the Detailed Guide)
  const webItems = [
    ['Logging In', 'web_login.htm', content.login()],
    ['Dashboard', 'web_dashboard.htm', content.dashboard()],
    ['Using a Phone or Tablet', 'web_mobile.htm', content.mobile()],
    ['Footer Links', 'web_footer.htm', content.footer()]
  ];
  s.addTopic([DG], { title: WV, file: 'web_version.htm', html: listPage(WV, webItems.map(i => [i[0], i[1]])), first: true, image: 1 });
  for (const [title, file, html] of webItems) s.addTopic([DG, WV], { title, file, html });
  say('  + Web Version: ' + webItems.map(i => i[0]).join(', '));
  // Developers Message is a footer link on the web
  if (dg('Config', 'Developers Message')) {
    s.moveTopic([DG, 'Config', 'Developers Message'], [DG, WV]);
    s.setBody([DG, WV, 'Developers Message'], content.devMessage());
    say('  ~ Developers Message: Config -> Web Version (footer link)');
  }
  s.addTopic([DG, WV], { title: 'Signatures', file: 'web_signatures.htm', html: content.signatures() });

  // ---- 5. modules the web does not offer to this edition
  for (const m of ['Config', 'Cashflow']) {
    if (!has(m) && dg(m)) {
      s.removeTopic([DG, m]);
      say('  - module removed from the guide (not in the web ' + key + ' menu): ' + m);
      // Quick Guide steps that start in that module
      const qg = s.find(['Quick Guide']);
      for (const q of qg.children.slice()) {
        const f = localOf(q);
        if (!f || !s.exists(f)) continue;
        if (new RegExp('Click\\s+' + m + '\\s*->', 'i').test(s.text(f))) { s.removeTopic(['Quick Guide', nameOf(q)]); say('  - quick step removed: ' + nameOf(q)); }
      }
    }
  }

  // ---- 6. new screens in existing modules
  const newScreens = [
    ['Files', 'Branches', 'branches.htm', content.branches, 'Suppliers'],
    ['Inventory', 'Stocks Inquiry', 'stocks_inquiry.htm', content.stocksInquiry, 'Stock Totals'],
    ['StockAdjustments', 'Adjustment Config', 'adjustment_config.htm', content.adjustmentConfig, null],
    ['Config', 'Popups', 'popups.htm', content.popups, 'Business Info'],
    ['Config', 'Backup', 'backup.htm', content.backup, null],
    ['Accounting', 'Profit Performance', 'profit_performance.htm', content.profitPerformance, null],
    ['Accounting', 'Debt to Cash Coverage', 'debt_to_cash_coverage.htm', content.debtToCash, null],
    ['Reports', 'Item History', 'item_history.htm', content.itemHistory, null],
    ['Reports', 'Customer History', 'customer_history.htm', content.customerHistory, null],
    ['Reports', 'Supplier History', 'supplier_history.htm', content.supplierHistory, null],
    ['Expenses', 'Payees', 'expense_payees.htm', content.expensePayees, 'Expense Ledger'],
    ['Expenses', 'Particulars', 'expense_particulars.htm', content.expenseParticulars, 'Payees'],
    ['BIR', 'BIR Sales Report', 'bir_sales_report.htm', content.birSalesReport, null],
    ['Sales', 'Kitchen Queue', 'kitchen_queue.htm', content.kitchenQueue, 'Sales Transaction']
  ];
  for (const [mod, title, file, make, after] of newScreens) {
    if (!has(mod) || !dg(mod) || dg(mod, title)) continue;
    addPage([mod], { title, file, html: make(), after });
  }
  // POS BIR also shows the rest of the Files screens on the web
  if (key === 'posbir' && dg('Files')) {
    for (const [t, f] of [['Tables', 'Tables.htm'], ['Printers', 'Printers.htm'], ['Files Config', 'Files_Config.htm']]) {
      if (!dg('Files', t) && borrow(f)) addPage(['Files'], { title: t, file: f });
    }
    if (!dg('Files', 'Branches')) addPage(['Files'], { title: 'Branches', file: 'branches.htm', html: content.branches(), after: 'Suppliers' });
  }

  // ---- 7. changes inside existing screens
  const salesTrans = [DG, 'Sales', 'Sales Transaction'];
  if (dg('Sales', 'Sales Transaction')) {
    s.setBody(salesTrans,
      H('A. Click Sales->Sales Transaction') + GAP +
      H('B. How to sale item?') + P('   Easy Steps:') +
      STEPS([
        'Click Sales->**Sales Transaction**',
        'Select **Table** (when Sales Config **Has Table** is yes). A vacant table starts a new order; a table with an order opens that order.',
        'Select **Category**',
        'Select **Item** - one click adds quantity 1 (a quantity window opens when Sales Config **PopupQty** is yes)',
        '  ...repeat the process until all items entered',
        'Choose **DINE IN** or **TAKE OUT**',
        'Click **SEND** to send the order to the kitchen (the kitchen slip, the Kitchen Queue or both: see Sales Config->Send Kitchen). Items already sent are not sent again.',
        'Click **SERVE** when the order is served to the customer.',
        'Click **BILL OUT** to print the bill (optional).',
        'Click **PAY**->Input **AmountPaid**->Press Enter / Click Save',
        'Click **COMPLETE** to make the table available for the next transaction.'
      ]) + GAP +
      H('C. Tabs and buttons') +
      UL([
        '**TABLE CATEGORY** (when Files Config **MultipleTable** is yes), **TABLE**, **CATEGORY** and **PRODUCT** - choose the table area, the table, the category and the item. Press F8 to go to the **PRODUCT** tab: the search box and **HIDE PRICE** (hide the prices) work on that tab.',
        '**SEND** - sends the new items to the kitchen. **SERVE** - marks the order as served.',
        '**READY TO SERVE** - shows how many tables have items ready from the kitchen. Click it to see the tables, click **View details** to see their items, then click **Served** (or **Serve All**). **Back** returns to the tables.',
        '**UPGRADE** - select a Set item, click **UPGRADE** and choose the component to replace with another item. The new item is charged its own price less the price of the replaced item (you can edit it) and stays with the Set.',
        '**TRANSFER** - click **TRANSFER**, then select the vacant table to move the order to.',
        '**MERGE** - click **MERGE**, then select the table whose bill is added to this one.',
        '**SPLIT** - see D.',
        '**LOAD S.O** and **POINTS** - shown when your access rights allow them.'
      ]) + GAP +
      H('D. How to split the bill?') + P('   Easy Steps:') +
      STEPS([
        'Open the table->Click **SPLIT**',
        'Choose **BY ITEMS** - tick the items to pay, or **BY AMOUNT** - input the amount to pay',
        'Click **PAY** - only the split part is paid and the rest stays on the table. Click **SPLIT** again to cancel.'
      ]) +
      UL([
        'BY AMOUNT takes whole items in order and cuts the rest by quantity from one item. Set items and items not yet sent to the kitchen are not cut, so the paid amount can be slightly different; it is shown before paying.'
      ]) + GAP +
      H('E. How to cancel an item or the order?') +
      UL([
        'RightClick the item->**Edit**, **Remove**, **Remove All** or **Cancel Order**.',
        'Use **Cancel Order** for items already sent to the kitchen: the CANCELLED slip is printed or the Kitchen Queue is told, depending on Send Kitchen.'
      ]) + GAP +
      H('F. A table shows an amount but opens empty?') +
      UL([
        'The order was left by another cashier or by an earlier reading. Click the table: the system shows who has it, the reading, the time and the amount, and offers to release the table.',
        'Confirm with the password to cancel that order and make the table vacant.'
      ]) + GAP +
      P('On a phone see Web Version->Using a Phone or Tablet.'));
    say('  ~ Sales Transaction rewritten for the web');
    if (key === 'posbir') {
      append(salesTrans, 'bir-zreading', GAP + H('G. POS/BIR') + UL(['A machine whose Z Reading of the day is already closed can no longer accept sales.']));
    }
  }
  const qSale = s.quick(/sale item/i);
  if (qSale) {
    s.setBody(['Quick Guide', nameOf(qSale)],
      H('Easy Steps:') + GAP +
      STEPS([
        'Click Sales->**Sales Transaction**',
        'Select **Table**',
        'Select **Category**',
        'Select **Item**',
        '  ...repeat the process until all items entered',
        'Choose **DINE IN** or **TAKE OUT**',
        'Click **SEND** to send the order to the kitchen.',
        'Click **SERVE** when the order is served to the customer.',
        'Click **PAY**->Input **AmountPaid**->Press Enter / Click Save',
        'Click **COMPLETE** to make the table available for the next transaction.'
      ]));
    say('  ~ Quick Guide: Sale Item');
  }
  append([DG, 'Sales', 'Sales Config'], 'sendkitchen',
    GAP + P('**Send Kitchen** - where **SEND** in the Sales Transaction sends the order:') +
    UL([
      '**POS** - prints the kitchen slip only (default)',
      '**Kitchen Display** - shows the order on the Kitchen Queue only (no slip)',
      '**Both** - prints the kitchen slip and shows the order on the Kitchen Queue'
    ]));
  append([DG, 'Files', 'Items'], 'items',
    GAP + H('K. Web version') +
    UL([
      '**Upload Items** - to add many items from an Excel file',
      '  1. Click Files->Items->**Upload Items**',
      '  2. Click **ItemsFormat** to download the template and fill it in (one sheet per item type and a Costing sheet)',
      '  3. Choose the file->Click **Check File** - items that already exist are skipped; nothing is uploaded until the errors shown are fixed',
      '  4. Click **Upload**',
      '**Export Items** - to export the items',
      'RightClick item->**Photo** - to set the picture of the item',
      'RightClick item->**AveCost History** - to view the cost history of the item. AveCostMethod of the item: Average Costing Method, Last Highest Item Cost or Last Purchase Cost.',
      '**Branch Update** - shown in the main branch: updates the items in the other branches'
    ]));
  if (has('Menus')) append([DG, 'Menus', 'Menu Costing'], 'receivingcost',
    GAP + H('E. Web version') +
    UL([
      'When items are received (Receiving Transaction) the costing of the menu is updated automatically: a component that is received at a higher cost than the menu uses takes the new cost, and the cost of the menu is computed again. A lower cost never reduces the cost of a menu. Every change is kept in the menu costing history.'
    ]));
  if (has('Receiving')) append([DG, 'Receiving', 'Receiving Transaction'], 'receiving',
    GAP + H('Web version') +
    UL([
      'The header window shows the VAT details of the receipt (VATSales, VATExemptSales, VATAmount), the same as the sales receipt.',
      'The cost of received items that are components of a menu updates the menu costing (see Menus->Menu Costing).'
    ]));
  if (has('Purchasing')) append([DG, 'Purchasing', 'PO Transaction'], 'povat',
    GAP + H('Web version') + UL(['The header window shows the VAT details of the purchase order (VATSales, VATExemptSales, VATAmount), the same as the sales receipt.']));
  if (has('Accounting')) append([DG, 'Accounting', 'Financial Statements'], 'fsdetails',
    GAP + H('Web version') + UL(['In the Income Statement, Balance Sheet and Cashflow Statement double-click an account title to open its details (General Ledger).']));
  if (has('StockAdjustments')) append([DG, 'StockAdjustments', 'Adjustment Reports'], 'tabs',
    GAP + H('Web version') + UL(['The report has the tabs **Yearly**, **Monthly** and **Daily**, and the **Stock Transfer Report**.']));

  // ---- 8. new Quick Guide steps (appended at the end of the Quick Guide)
  const qg = s.find(['Quick Guide']);
  const lastNo = () => Math.max(0, ...qg.children.map(c => parseInt(nameOf(c), 10)).filter(n => !isNaN(n)));
  const addQuick = (id) => {
    const [title, h1, body] = quickSteps[id];
    const n = lastNo() + 1;
    s.addTopic(['Quick Guide'], { title: n + '. ' + title, file: 'web_q_' + id + '.htm', html: page(n + '. ' + title, body(), n + '. ' + h1) });
    say('  + quick step: ' + n + '. ' + title);
  };
  addQuick('kitchen');
  if (has('Config')) addQuick('backup');
  if (has('BIR')) addQuick('birSales');

  s.renumberQuickGuide();
  s.save();
  if (s.skippedLists.length) say('  ? group pages that are not plain link lists (not regenerated): ' + s.skippedLists.join('; '));
  return { s, log };
}

// ============================================================================ report

function gapReport(s, key) {
  const out = [];
  const mine = new Set(); s.walk(n => mine.add(norm(nameOf(n))));
  for (const [mod, members] of Object.entries(WEB.modules)) {
    if (!members.includes(key)) continue;
    const missing = WEB.screens[mod].filter(x => !/signatures$/i.test(x) && !mine.has(norm(x)));
    if (missing.length) out.push(mod + ': ' + missing.join(', '));
  }
  return out;
}

if (require.main === module) {
  for (const key of Object.keys(EDITIONS)) {
    const { s, log } = run(key);
    console.log('\n=== ' + s.name);
    log.forEach(l => console.log(l));
    const gaps = gapReport(new Source(key), key);
    if (gaps.length) console.log('  . web screens without a guide topic:\n    ' + gaps.join('\n    '));
  }
}
module.exports = { run, content };
