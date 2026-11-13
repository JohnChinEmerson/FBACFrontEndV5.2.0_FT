import { Component, OnInit, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { EditionKey, GuideNode, GUIDES, GUIDE_PAGES } from './user-guide-data';

interface Row {
  node: GuideNode;
  depth: number;
  hasChildren: boolean;
  expanded: boolean;
}

interface SearchHit {
  node: GuideNode;
  path: string;
}

interface Edition {
  key: EditionKey;
  label: string;
  icon: string;
  blurb: string;
  tree: GuideNode[];
  parent: Map<number, GuideNode | null>;
  byFile: Map<string, GuideNode>;
  order: GuideNode[];            // every node that has content, in reading order
  index: { node: GuideNode; path: string; text: string }[];
  selected: GuideNode | null;
  expanded: Set<number>;
  query: string;
  rows: Row[];
  hits: SearchHit[] | null;
  topicCount: number;
}

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.css']
})
export class UserGuideComponent implements OnInit {
  editions: Edition[] = [];
  singleEdition = false; // true when the logged-in edition has its own guide (no edition tabs)
  tabIndex = 0;
  navOpen = false; // mobile only: show / hide the contents list

  private htmlCache = new Map<string, SafeHtml>();

  constructor(
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    @Optional() public dialogRef: MatDialogRef<UserGuideComponent> // only set when opened as a popup
  ) { }

  ngOnInit(): void {
    const all = [
      this.build('enterprise', 'Enterprise', 'domain', 'Full suite: files, menus, inventory, orders, sales and kitchen queue, cashiering, delivery, canvassing, purchasing, receiving, receivables, payables, expenses, stock adjustments, returns, vouchering, disbursements, cashflow, reports and accounting.'),
      this.build('standard', 'Standard', 'business_center', 'Core operations: files, menus, inventory, sales and kitchen queue, cashiering, receiving, receivables, payables, expenses, stock adjustments, returns, cashflow, reports and accounting.'),
      this.build('express', 'Express', 'bolt', 'Essential modules: files, menus, inventory, sales and kitchen queue, cashiering, receiving, expenses, stock adjustments, returns, cashflow, reports and accounting.'),
      this.build('pos', 'POS', 'point_of_sale', 'Point of sale: files, menus, inventory, sales and kitchen queue, cashiering, receiving, expenses, returns, cashflow, reports and accounting.'),
      this.build('posbir', 'POS BIR', 'receipt_long', 'BIR-ready point of sale: files, sales and kitchen queue, cashiering, returns, XZ readings, e-receipts, e-sales book, discounts, VAT sales, machine permits and BIR sales report.'),
      this.build('posbirbo', 'POS BIR Back Office', 'storefront', 'Back office for BIR POS: files, menus, inventory, sales and kitchen queue, cashiering, receiving, expenses, returns, reports and accounting.')
    ];

    // only the guide of the logged-in edition; NA / Default (or anything unknown) sees every edition
    const mine = this.editionKey();
    const own = mine ? all.filter(e => e.key === mine) : [];
    this.singleEdition = own.length === 1;
    this.editions = this.singleEdition ? own : all;
  }

  // the edition of the current session (the same value the API receives in the Edition header)
  private editionKey(): EditionKey | null {
    const raw = String(this.authService.Edition ?? '').toLowerCase().replace(/[^a-z]/g, '');
    switch (raw) {
      case 'enterprise': return 'enterprise';
      case 'standard': return 'standard';
      case 'express': return 'express';
      case 'pos': return 'pos';
      case 'posbir': return 'posbir';
      case 'posbirbackoffice': return 'posbirbo';
      default: return null; // na, default, empty
    }
  }

  // ---------- building the edition models ----------

  private build(key: EditionKey, label: string, icon: string, blurb: string): Edition {
    const tree = GUIDES[key];
    const parent = new Map<number, GuideNode | null>();
    const byFile = new Map<string, GuideNode>();
    const order: GuideNode[] = [];
    const index: Edition['index'] = [];

    const walk = (nodes: GuideNode[], par: GuideNode | null, trail: string[]) => {
      for (const n of nodes) {
        parent.set(n.id, par);
        if (n.f) { byFile.set(n.f, n); }
        const path = [...trail, n.t];
        if (n.p) {
          order.push(n);
          index.push({
            node: n,
            path: trail.join(' › '),
            text: (n.t + ' ' + this.plain(GUIDE_PAGES[n.p] || '')).toLowerCase()
          });
        }
        if (n.c) { walk(n.c, n, path); }
      }
    };
    walk(tree, null, []);

    const ed: Edition = {
      key, label, icon, blurb, tree, parent, byFile, order, index,
      selected: null,
      expanded: new Set<number>(),
      query: '',
      rows: [],
      hits: null,
      topicCount: order.length
    };

    // open the first group and show the first topic
    if (tree.length) { ed.expanded.add(tree[0].id); }
    ed.selected = order.length ? order[0] : null;
    this.refresh(ed);
    return ed;
  }

  private plain(html: string): string {
    return html
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ');
  }

  // ---------- rows (the contents list) ----------

  private refresh(ed: Edition): void {
    const rows: Row[] = [];
    const walk = (nodes: GuideNode[], depth: number) => {
      for (const n of nodes) {
        const hasChildren = !!(n.c && n.c.length);
        const expanded = hasChildren && ed.expanded.has(n.id);
        rows.push({ node: n, depth, hasChildren, expanded });
        if (expanded && n.c) { walk(n.c, depth + 1); }
      }
    };
    walk(ed.tree, 0);
    ed.rows = rows;
  }

  trackRow = (_: number, r: Row) => r.node.id;
  trackHit = (_: number, h: SearchHit) => h.node.id;
  trackNode = (_: number, n: GuideNode) => n.id;

  toggle(ed: Edition, node: GuideNode, event?: Event): void {
    event?.stopPropagation();
    if (ed.expanded.has(node.id)) { ed.expanded.delete(node.id); } else { ed.expanded.add(node.id); }
    this.refresh(ed);
  }

  expandAll(ed: Edition): void {
    const walk = (nodes: GuideNode[]) => nodes.forEach(n => { if (n.c?.length) { ed.expanded.add(n.id); walk(n.c); } });
    walk(ed.tree);
    this.refresh(ed);
  }

  collapseAll(ed: Edition): void {
    ed.expanded.clear();
    this.refresh(ed);
  }

  // ---------- selecting / navigating ----------

  select(ed: Edition, node: GuideNode): void {
    ed.selected = node;

    // make sure the path to the node is open
    let p = ed.parent.get(node.id) || null;
    while (p) { ed.expanded.add(p.id); p = ed.parent.get(p.id) || null; }
    if (node.c?.length) { ed.expanded.add(node.id); }

    ed.query = '';
    ed.hits = null;
    this.refresh(ed);
    this.navOpen = false;
    this.scrollToContent(ed);
  }

  onRowClick(ed: Edition, row: Row): void {
    this.select(ed, row.node);
  }

  openFromContent(ed: Edition, event: Event): void {
    const el = (event.target as HTMLElement).closest('a[data-page]') as HTMLElement | null;
    if (!el) { return; }
    event.preventDefault();
    const target = ed.byFile.get(el.getAttribute('data-page') || '');
    if (target) { this.select(ed, target); }
  }


  prev(ed: Edition): GuideNode | null {
    const i = this.orderIndex(ed);
    return i > 0 ? ed.order[i - 1] : null;
  }

  next(ed: Edition): GuideNode | null {
    const i = this.orderIndex(ed);
    return i >= 0 && i < ed.order.length - 1 ? ed.order[i + 1] : null;
  }

  private orderIndex(ed: Edition): number {
    return ed.selected ? ed.order.findIndex(n => n.id === ed.selected!.id) : -1;
  }

  breadcrumb(ed: Edition, node: GuideNode): string[] {
    const trail: string[] = [];
    let p = ed.parent.get(node.id) || null;
    while (p) { trail.unshift(p.t); p = ed.parent.get(p.id) || null; }
    return trail;
  }

  // ---------- search ----------

  onSearch(ed: Edition, value: string): void {
    ed.query = value;
    const words = value.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    if (!words.length) { ed.hits = null; return; }
    ed.hits = ed.index
      .filter(i => words.every(w => i.text.includes(w)))
      .sort((a, b) => Number(b.node.t.toLowerCase().includes(words[0])) - Number(a.node.t.toLowerCase().includes(words[0])))
      .slice(0, 60)
      .map(i => ({ node: i.node, path: i.path }));
  }

  clearSearch(ed: Edition): void {
    ed.query = '';
    ed.hits = null;
  }

  // ---------- content ----------

  html(node: GuideNode | null): SafeHtml {
    if (!node || !node.p) { return ''; }
    let h = this.htmlCache.get(node.p);
    if (!h) {
      // content comes from our own bundled guide files, so it is trusted
      h = this.sanitizer.bypassSecurityTrustHtml(GUIDE_PAGES[node.p] || '');
      this.htmlCache.set(node.p, h);
    }
    return h;
  }

  private scrollToContent(ed: Edition): void {
    if (typeof window === 'undefined' || window.innerWidth > 900) { return; }
    setTimeout(() => document.getElementById('ug-content-' + ed.key)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  }
}
