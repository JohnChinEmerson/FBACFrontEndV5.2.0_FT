# Kitchen, mobile and costing changes (2026-11-04)

Branch `kitchen-mobile-costing` in both repos (frontend + `FBACBackEndV5.2.0`).

## Migrations (backend `database/migrations`)

Run each with `--path` (they are idempotent: main table and every branch copy, nothing dropped):

```
php artisan migrate --path=database/migrations/2026_11_04_001000_create_menucostinghistory_table.php
php artisan migrate --path=database/migrations/2026_11_04_001100_add_send_kitchen_to_saleconfigs.php
php artisan migrate --path=database/migrations/2026_11_04_001200_add_cancel_ack_to_kitchenqueue.php
```

| Migration | What it does |
|---|---|
| 001000 | New table `{branch}_menucostinghistory` (InnoDB, so it rolls back with the Receiving save) |
| 001100 | `saleconfigs.SendKitchen` varchar(30), default `POS` |
| 001200 | `kitchenqueue.CancelAckBy` / `CancelAckDateTime`; old cancelled rows count as acknowledged |

001200 must run before the new Kitchen Queue screen is used (the QUEUE view reads `CancelAckDateTime`).
`CreateNewTablesByBranch` also copies `menucostinghistory` for new branches.

## What changed, per item

1. **Receiving -> menu costing**: `CostingHelper::updateMenuCostingFromReceiving` runs inside the Receiving save
   transaction. Each recipe line that uses a received item takes the received cost (base UM cost from the
   multiple-UM conversion, then the recipe line's UM rate) only when `CostingHelper::isComponentCostUpdate`
   says so (today: higher than the cost the recipe uses). The product cost is summed again
   (`recomputeProductCost`) and each change is logged in `menucostinghistory`.
2. **Sales Config > Send Kitchen**: POS / Kitchen Display / Both (mat-select), saved with the existing config API.
3. **SEND**: POS = kitchen slip only, Kitchen Display = Kitchen Queue only, Both = both. Already sent lines are never re-sent.
4. **Cancelled items**: stay on the Kitchen Queue card with a red CANCELLED badge and strikethrough, a toast and a
   sound, until the kitchen acknowledges them (per line "OK" or "Acknowledge Cancelled"). Cancel Order prints the
   CANCELLED slip at once (POS / Both) to the printers of the original items; Kitchen Display prints nothing.
5. **Sales toolbar**: READY TO SERVE / LOAD S.O / POINTS / HIDE PRICE on the right. LOAD S.O was disabled because its
   label "LOAD S.O" never matched the access right button "Load S.O". The context menu no longer has Load S.O,
   SerialNos, Save As Pending or Show Pending.
6. **Sales phone layout**: Edit / Remove (and Cancel for a sent line) on every cart row; Remove All and Cancel Order
   (whole order) at the top of the cart; category dropdown; fixed bottom bar SEND / PAY / COMPLETE / MORE, with MORE
   opening a grid of every action; the page keeps the bar's height free at the bottom (safe area included).
7. **Navigation / splash**: the side menu closes after a submenu on phones (and now loads that submenu's buttons,
   which it never did before); phone-only splash in `index.html` (min 1.5 s, until the first screen).
8. **Phone login**: separate phone template in `LoginComponent` (same form, same `login()`): full screen, 52px
   inputs, show/hide password, Remember me (branch + username only, never the password), loading state, inline errors.
9. **Status sync**: SEND tags lines `sent`; only the Kitchen Queue sets preparing / ready / served, and every change
   is copied to the sale lines. The table / order status is the least advanced sent line.
10. **Ready to serve**: notices and polling live only in Sales Transaction (started in `ngOnInit`, stopped in
    `ngOnDestroy`); one toast per READY TO SERVE click ("Table 5 - 2 item(s) ready to serve"), closing after
    `_kitchenNoticeSeconds` (global-variables.ts, 5 s). The READY TO SERVE button shows a count badge and opens the
    Ready dialog: the same cards as the Kitchen Queue READY TO SERVE tab (one per table, Served / Serve All).
11. **Kitchen Queue History**: status filter and Print (same layout as the other list prints: business header,
    title with the date range, filters, rows, total, printed by and print date / time).
12. **Compact cards** (`app-kitchen-order-cards`, shared by QUEUE, READY TO SERVE and the Ready dialog): lines that
    fit in about 38% of the screen height (30% on phones, measured from the rendered line height), fade +
    "See more (+N items)" / "See less", cancelled and newest-SEND lines pinned on top, header with elapsed time,
    item count and status summary, card actions always visible, expanded state kept while the app is open,
    1 column and 48px buttons on phones, sticky card header.

Real-time: polling every `_kitchenRefreshMs` (10 s), the existing Kitchen Queue pattern. It needs no extra server
and works the same against the local and online database.

## Assumptions

- "Kitchen Display" is the Kitchen Queue screen.
- With Send Kitchen = POS nothing goes to the Kitchen Queue, so lines stay "Sent" until SERVE.
- On phones, Cancel Order at the top of the cart cancels the whole order; a single sent line is cancelled with
  the cancel icon on its row.
- The "previous cost" in #1 is the cost the recipe currently uses for that component (so a menu cost never goes
  down because of a receiving).
- SERVE in Sales serves every line except those still cooking in the Kitchen Queue.
- Known limit: removing (not cancelling) an already sent line with Remove / Remove All marks it cancelled on the
  Kitchen Queue but prints no CANCELLED slip. Use Cancel Order for sent lines.

## Manual test checklist

Set up: run the 3 migrations; Sales Config Has Table = yes; a few tables; Kitchen Queue rights for the kitchen user.

| # | Steps | Expected |
|---|---|---|
| 1a | Item A cost 10 is in recipe B (QtyMade 2, QtyUsed 4). Receive A at 12 and save | B cost goes up by (4/2)*2 = 4; one `menucostinghistory` row with old/new costs, RR no., user |
| 1b | Receive A again at 11 | B cost unchanged, no history row |
| 1c | Receive A in a multiple UM (box of 12) at 144 | Recipe uses 12 per base unit (no change if 12 already) |
| 2 | Sales Config: set Send Kitchen to each value, Save, reopen | Value kept; default POS |
| 3a | POS: SEND an order | Kitchen slip prints; nothing on the Kitchen Queue |
| 3b | Kitchen Display: SEND | No slip; card on the Kitchen Queue |
| 3c | Both: SEND, add an item, SEND again | Second SEND prints / queues only the new item |
| 4a | Both: Cancel Order on a sent line | CANCELLED slip prints at once; KQ card shows the line CANCELLED (red, struck through) with toast + sound |
| 4b | KQ: OK / Acknowledge Cancelled | Line leaves the card; it is still in HISTORY as Cancelled |
| 4c | Kitchen Display: Cancel Order on a sent line | No slip; KQ shows CANCELLED |
| 5 | Sales Transaction (desktop) | READY TO SERVE / LOAD S.O / POINTS / HIDE PRICE on the right; LOAD S.O enabled for a user with button rights; right-click menu: Edit, Remove, Remove All, Cancel Order only |
| 6a | Phone: open a table, add items, open the order | Edit / Remove on every row; Remove All + Cancel Order at the top; both work |
| 6b | Phone: category | Dropdown, not chips |
| 6c | Phone: bottom bar | SEND / PAY / COMPLETE / MORE, never scrolls; MORE shows every action |
| 6d | Phone: table list scrolled to the bottom | Last table fully above the bar |
| 7a | Phone: side menu > Sales > a submenu | Menu closes; the screen's buttons follow that submenu's rights |
| 7b | Open the app on a phone / on a PC | Splash on the phone only |
| 8 | Phone login: empty fields, wrong password, show password, Remember me, correct login | Inline errors; server error box; Login shows a spinner; branch + username prefilled next time; desktop login unchanged |
| 9 | SEND, then in KQ: Preparing, Ready to Serve | Sales line: Sent -> Preparing -> Ready to Serve (within 10 s); never Preparing before the kitchen sets it |
| 10a | KQ: Ready to Serve on 2 items of Table 5 while Sales Transaction is open | Toast "Table 5 - Ready to Serve: 2 item(s)..." closing after 5 s; badge count goes up |
| 10b | Same while on another screen, then open Sales Transaction | No notice on the other screen; it shows on entering Sales Transaction |
| 10c | READY TO SERVE dialog: Served on one item, Serve All on a table | Items leave the dialog; Sales lines show Served at once; KQ READY TO SERVE tab updated |
| 10d | KQ READY TO SERVE tab: Serve All on a table card | All ready items of the table served |
| 11 | KQ HISTORY: dates + status filter + search, Print | Print shows only the filtered rows, the date range, filters, printed by and date / time |
| 12a | KQ on a laptop with a 12-item order | Card shows a few lines, fade, "See more (+N items)"; header and All Preparing / All Ready to Serve visible; See more / See less in place |
| 12b | SEND more items to the same order | New items pinned on top with NEW |
| 12c | KQ on a phone | 1 column, tabs fit the width, 48px buttons, no sideways scrolling, card header sticks while scrolling an expanded card |

Automated checks run on the sandbox DB (2026-11-04): backend harness 28/28 (rolled back), browser run 56/56
(desktop 1366x768 + phone 390x844), production build OK.

## Follow-up changes (2026-11-04, after review)

- Phones open straight on the login screen (no landing page); after login, laptop and phone show the dashboard
  instead of the logo page (`HomeComponent.isShowDashboard` now defaults to true).
- Sales Config: Send Kitchen lines up with the other fields (equal grid columns) and shows the short value.
- Splash screen never appears in print popups (order slip, receipts, reports) or print pages, so they print as before.
- Sales Transaction phone bar: SEND / BILL OUT / PAY + MORE (COMPLETE is in MORE).
- READY TO SERVE dialog: opens on the tables (items ready, waiting time); View details shows the table's items with
  Served / Serve All; Back returns to the tables.
- Laptop: the item search box shows on the PRODUCT tab only (F8 opens that tab) and HIDE PRICE is enabled on the
  PRODUCT tab only. Note: a barcode scanner therefore types into the search only on the PRODUCT tab.
- Transaction header dialogs (SaleHeaderUI and the others using transaction-header.css) on phones: the close button
  is at the top right like the other forms (it was cut off at the top left).

| # | Steps | Expected |
|---|---|---|
| F1 | Open the web app on a phone (logged out) | The login screen, no landing page |
| F2 | Log in on a laptop and on a phone | Dashboard shown |
| F3 | Phone: SEND, then print the slip | Slip prints (no splash in the popup) |
| F4 | Sales Transaction, laptop: TABLE / CATEGORY / PRODUCT tabs | Search box and HIDE PRICE only on PRODUCT; F8 jumps to PRODUCT |
| F5 | READY TO SERVE | Table list; View details -> items + Served / Serve All; Back |
| F6 | Phone: PAY | Close button top right |
