// Shared helpers for the F&B user guide tools.
//
// A "source" is an HTML Help project folder (tools/user-guide/sources/<Edition>/): toc.hhc (contents), index.hhk
// (index), _template.css and the pages (page_N.html / *.htm, windows-1252). The tools read and write those files
// byte-for-byte as latin1 so nothing else in a page is touched.
'use strict';
const fs = require('fs');
const path = require('path');

const SOURCES = path.join(__dirname, '..', 'sources');
const EDITIONS = {
  enterprise: 'Enterprise', standard: 'Standard', express: 'Express',
  pos: 'POS', posbir: 'POSBIR', posbirbo: 'POSBIRBackOffice'
};
const EOL = '\r\n';

const norm = s => String(s || '').toLowerCase().replace(/&amp;/g, '&').replace(/[^a-z0-9]+/g, '');

// ---------------------------------------------------------------- contents (.hhc)

/** Parse a .hhc into { head, tail, root:[node] }; node = { params:[[name,value]], children:[] } */
function parseHhc(text) {
  const first = text.search(/<UL>/i);
  const last = text.lastIndexOf('</UL>') + 5;
  const head = text.slice(0, first);
  const tail = text.slice(last);
  const body = text.slice(first, last);
  const re = /<UL>|<\/UL>|<LI>\s*<OBJECT[^>]*>([\s\S]*?)<\/OBJECT>/gi;
  const root = [];
  const stack = [];
  let lastNode = null, m;
  while ((m = re.exec(body))) {
    const tok = m[0].toUpperCase();
    if (tok === '<UL>') stack.push(stack.length ? lastNode.children : root);
    else if (tok === '</UL>') stack.pop();
    else {
      const params = [...m[1].matchAll(/<param\s+name="([^"]*)"\s+value="([^"]*)"\s*>/gi)].map(p => [p[1], p[2]]);
      lastNode = { params, children: [] };
      stack[stack.length - 1].push(lastNode);
    }
  }
  return { head, tail, root };
}

function serializeHhc(toc) {
  const list = nodes => {
    let s = '<UL>';
    for (const n of nodes) {
      s += '<LI><OBJECT type="text/sitemap">' + EOL;
      for (const [k, v] of n.params) s += '<param name="' + k + '" value="' + v + '">' + EOL;
      s += '</OBJECT>' + EOL;
      if (n.children.length) s += list(n.children);
    }
    return s + '</UL>';
  };
  return toc.head + list(toc.root) + toc.tail;
}

const getParam = (n, k) => { const p = n.params.find(x => x[0] === k); return p ? p[1] : ''; };
const setParam = (n, k, v) => { const p = n.params.find(x => x[0] === k); if (p) p[1] = v; else n.params.push([k, v]); };
const nameOf = n => getParam(n, 'Name');
const localOf = n => getParam(n, 'Local');

function makeNode(name, local, image) {
  const params = [['Name', name], ['Local', local || '']];
  params.push(['ImageNumber', String(image || (local ? 11 : 1))]);
  return { params, children: [] };
}

// ---------------------------------------------------------------- HTML text helpers (guide style)

const esc = s => String(s).replace(/&(?!(?:[a-z]+|#\d+);)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** plain guide text -> html: **bold**, -> arrows, entities escaped. ASCII only so the windows-1252 file stays valid. */
const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<STRONG>$1</STRONG>');
const nb = n => '&nbsp;'.repeat(n);

/** heading line (bold) */
const H = s => '<P><STRONG><FONT size=2>' + inline(s) + '</FONT></STRONG></P>' + EOL;
/** plain paragraph; leading spaces indent */
const P = s => {
  const lead = /^ */.exec(s)[0].length;
  return '<P><FONT size=2>' + nb(lead * 2) + inline(s.trim()) + '</FONT></P>' + EOL;
};
/** numbered easy steps; an entry starting with spaces is an indented detail line (not numbered) */
const STEPS = lines => {
  let n = 0, out = '';
  for (const l of lines) {
    if (/^\s/.test(l)) out += P(l);
    else out += P(++n + '. ' + l);
  }
  return out;
};
const UL = items => '<UL>' + EOL + items.map(i => '  <LI><FONT size=2>' + inline(i) + '</FONT></LI>' + EOL).join('') + '</UL>' + EOL;
const GAP = '<P>&nbsp;</P>' + EOL;

const FOOTER =
  '<DIV class=footer>' + EOL +
  '<P>' + nb(5) + 'Copyright &copy; 2024 <A ' + EOL +
  'href="https://www.mariosoftsolutions.ph" target=_blank>Mariosoft Solutions</A>. ' + EOL +
  'All Rights Reserved. </P></DIV></BODY></HTML>' + EOL;

/** a complete guide page */
function pageHtml(title, h1, body) {
  return '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">' + EOL +
    '<HTML><HEAD><title>' + esc(title) + '</title>' + EOL +
    '<META content="text/html; charset=iso-8859-1" http-equiv=Content-Type>' + EOL +
    '<META name=GENERATOR content="MSHTML 11.00.10570.1001"><LINK rel=stylesheet ' + EOL +
    'href="_template.css"></HEAD>' + EOL +
    '<BODY>' + EOL +
    '<DIV id=nsbanner>' + EOL + '<DIV id=titlerow>' + EOL +
    '<H1 class=dtH1>' + esc(h1 || title) + '</H1></DIV></DIV>' + EOL +
    '<DIV id=nstext><BR>' + EOL +
    body +
    '<HR>' + EOL + EOL + '<P></P></DIV>' + EOL +
    FOOTER;
}

// ---------------------------------------------------------------- one edition's source folder

class Source {
  constructor(key) {
    this.key = key;
    this.name = EDITIONS[key];
    this.dir = path.join(SOURCES, this.name);
    this.toc = parseHhc(fs.readFileSync(path.join(this.dir, 'toc.hhc'), 'latin1'));
    this.hhk = fs.readFileSync(path.join(this.dir, 'index.hhk'), 'latin1');
    this.added = [];            // topics added or renamed: [title, file], written to the index on save
    this.removedFiles = [];     // pages deleted: their index entries go on save
    this.touched = new Set();   // files rewritten
  }

  // the contents of the desktop guides name some pages with another letter case than the file (Menu_costing.htm)
  file(f) {
    const p = path.join(this.dir, f);
    if (fs.existsSync(p)) return p;
    const hit = fs.readdirSync(this.dir).find(x => x.toLowerCase() === f.toLowerCase());
    return hit ? path.join(this.dir, hit) : p;
  }
  exists(f) { return fs.existsSync(this.file(f)); }
  read(f) { return fs.readFileSync(this.file(f), 'latin1'); }
  write(f, text) { fs.writeFileSync(this.file(f), text, 'latin1'); this.touched.add(f); }

  /** find a node by a path of titles, e.g. ['Detailed Guide','Sales','Sales Transaction']; loose title match */
  find(titles, nodes = this.toc.root) {
    let list = nodes, found = null;
    for (const t of titles) {
      found = list.find(n => norm(nameOf(n)) === norm(t));
      if (!found) return null;
      list = found.children;
    }
    return found;
  }

  /** parent list + index of a node found by path */
  where(titles) {
    const parent = titles.length > 1 ? this.find(titles.slice(0, -1)) : null;
    const list = parent ? parent.children : this.toc.root;
    const node = list.find(n => norm(nameOf(n)) === norm(titles[titles.length - 1]));
    return node ? { list, index: list.indexOf(node), node, parent } : null;
  }

  /** the page file of a topic (throws when the topic or its page is missing) */
  pageOf(titles) {
    const n = this.find(titles);
    if (!n || !localOf(n)) throw new Error(`[${this.name}] topic not found: ${titles.join(' > ')}`);
    return localOf(n);
  }

  /** every node in reading order with its title path */
  walk(fn, nodes = this.toc.root, trail = []) {
    for (const n of nodes) { fn(n, [...trail, nameOf(n)]); this.walk(fn, n.children, [...trail, nameOf(n)]); }
  }

  /** true when some node already uses the page file */
  usesFile(f) { let u = false; this.walk(n => { if (localOf(n).toLowerCase() === f.toLowerCase()) u = true; }); return u; }

  /** add a topic (and its page) under parentTitles, after the sibling titled `after` (default: at the end) */
  addTopic(parentTitles, { title, file, html, after, image, first }) {
    const parent = parentTitles.length ? this.find(parentTitles) : null;
    if (parentTitles.length && !parent) throw new Error(`[${this.name}] parent not found: ${parentTitles.join(' > ')}`);
    const list = parent ? parent.children : this.toc.root;
    if (html != null) this.write(file, html);
    const existing = list.find(n => localOf(n).toLowerCase() === file.toLowerCase());
    if (existing) { setParam(existing, 'Name', title); return existing; }
    const node = makeNode(title, file, image);
    let at = first ? 0 : list.length;
    if (after) {
      const i = list.findIndex(n => norm(nameOf(n)) === norm(after));
      if (i >= 0) at = i + 1;
    }
    list.splice(at, 0, node);
    this.added.push([title, file]);
    return node;
  }

  /** the Quick Guide step whose title matches (e.g. /sale item/i) */
  quick(re) {
    const qg = this.find(['Quick Guide']);
    return qg ? qg.children.find(c => re.test(nameOf(c))) || null : null;
  }

  /** plain text of a page (tags removed), for checks */
  text(file) {
    return this.read(file).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ');
  }

  /** regex replacement in every page; returns the number of pages changed */
  replaceAllRe(re, to) {
    let n = 0;
    for (const f of fs.readdirSync(this.dir)) {
      if (!/\.html?$/i.test(f)) continue;
      const h = this.read(f);
      const out = h.replace(re, to);
      if (out !== h) { this.write(f, out); n++; }
    }
    return n;
  }

  /** where the text of a page starts: after the banner (inside <DIV id=nstext> when the page has one) */
  textStart(h) {
    const m = /<DIV id=nstext>(\s*<BR>)?/i.exec(h);
    if (m) return { open: m.index, after: m.index + m[0].length, wrapped: true };
    const end = h.search(/<\/H1>/i);
    if (end < 0) { const b = /<BODY[^>]*>/i.exec(h); return { open: b.index + b[0].length, after: b.index + b[0].length, wrapped: false }; }
    let i = end + 5;
    for (let k = 0; k < 2; k++) { const mm = /^\s*<\/DIV>/i.exec(h.slice(i)); if (!mm) break; i += mm[0].length; }
    return { open: i, after: i, wrapped: false };
  }

  /** put a block at the top of a topic page once (marker guards re-runs) */
  prepend(file, marker, body) {
    let h = this.read(file);
    const tag = '<!-- web:' + marker + ' -->';
    if (h.includes(tag)) return false;
    const at = this.textStart(h).after;
    h = h.slice(0, at) + EOL + tag + EOL + body + h.slice(at);
    this.write(file, h);
    return true;
  }

  /** a group heading without a page of its own, or with one (list page is generated on save) */
  addGroup(parentTitles, { title, file, after, html }) {
    const node = this.addTopic(parentTitles, { title, file: file || '', html, after, image: 1 });
    return node;
  }

  removeTopic(titles, { deleteFiles = true } = {}) {
    const w = this.where(titles);
    if (!w) return false;
    w.list.splice(w.index, 1);
    if (deleteFiles) {
      const gone = [];
      const collect = n => { if (localOf(n)) gone.push(localOf(n)); n.children.forEach(collect); };
      collect(w.node);
      for (const f of gone) {
        if (this.usesFile(f)) continue;
        this.removedFiles.push(f);
        if (this.exists(f)) fs.unlinkSync(this.file(f));
      }
    }
    return true;
  }

  moveTopic(fromTitles, toParentTitles, after) {
    const w = this.where(fromTitles);
    if (!w) return false;
    const target = this.find(toParentTitles);
    if (!target) throw new Error(`[${this.name}] target not found: ${toParentTitles.join(' > ')}`);
    w.list.splice(w.index, 1);
    let at = target.children.length;
    if (after) { const i = target.children.findIndex(n => norm(nameOf(n)) === norm(after)); if (i >= 0) at = i + 1; }
    target.children.splice(at, 0, w.node);
    return true;
  }

  /** rename a topic in the contents and (optionally) in its page title / heading */
  rename(titles, newTitle, { page = true } = {}) {
    const n = this.find(titles);
    if (!n) return false;
    setParam(n, 'Name', newTitle);
    const f = localOf(n);
    if (page && f && this.exists(f)) {
      let h = this.read(f);
      h = h.replace(/<title>[^<]*<\/title>/i, '<title>' + esc(newTitle) + '</title>')
           .replace(/(<H1[^>]*>)[^<]*(<\/H1>)/i, '$1' + esc(newTitle) + '$2');
      this.write(f, h);
    }
    this.added.push([newTitle, f]);
    return true;
  }

  /** where the text of a page ends: before the closing <HR>, else before the </DIV> that closes the text block */
  textEnd(h, start) {
    const foot = h.search(/<DIV class=footer>/i);
    if (foot < 0) throw new Error('no footer');
    const seg = h.slice(start, foot);
    const onlyMarkup = t => t.replace(/<[^>]*>|\s|&nbsp;/g, '') === '';
    const hr = seg.toUpperCase().lastIndexOf('<HR>');
    if (hr >= 0 && onlyMarkup(seg.slice(hr))) return start + hr;
    const div = seg.toUpperCase().lastIndexOf('</DIV>');
    if (div >= 0 && onlyMarkup(seg.slice(div))) return start + div;
    return foot;
  }

  /** replace the body of a topic page (keeps the page head, banner and footer) */
  setBody(titles, body, { h1 } = {}) {
    const f = this.pageOf(titles);
    let h = this.read(f);
    const t = this.textStart(h);
    const end = this.textEnd(h, t.open);
    h = h.slice(0, t.open) + (t.wrapped ? '<DIV id=nstext><BR>' : '') + EOL + body + h.slice(end);
    if (h1) h = h.replace(/(<H1[^>]*>)[^<]*(<\/H1>)/i, '$1' + esc(h1) + '$2');
    this.write(f, h);
  }

  /** add a block to the end of a topic page once (marker guards re-runs) */
  append(titles, marker, body) {
    const f = this.pageOf(titles);
    let h = this.read(f);
    const tag = '<!-- web:' + marker + ' -->';
    if (h.includes(tag)) return false;
    const at = this.textEnd(h, this.textStart(h).open);
    h = h.slice(0, at) + tag + EOL + body + h.slice(at);
    this.write(f, h);
    return true;
  }

  /** literal text replacement in a topic page; no-op when `from` is gone; throws when neither form is found */
  replace(titles, from, to) {
    const f = this.pageOf(titles);
    const h = this.read(f);
    if (!h.includes(from)) return h.includes(to);
    this.write(f, h.split(from).join(to));
    return true;
  }

  /** replace text in every page of the edition; returns the number of pages changed */
  replaceAll(from, to) {
    let n = 0;
    for (const f of fs.readdirSync(this.dir)) {
      if (!/\.html?$/i.test(f)) continue;
      const h = this.read(f);
      if (h.includes(from)) { this.write(f, h.split(from).join(to)); n++; }
    }
    return n;
  }

  /** number the Quick Guide topics again 1..n (title in the contents, page title and heading) */
  renumberQuickGuide() {
    const qg = this.find(['Quick Guide']);
    if (!qg) return;
    let n = 0;
    for (const node of qg.children) {
      const t = nameOf(node);
      if (!/^\d+\.\s*/.test(t) || !localOf(node)) continue;
      n++;
      const fresh = t.replace(/^\d+\.\s*/, n + '. ');
      if (fresh === t) continue;
      setParam(node, 'Name', fresh);
      const f = localOf(node);
      if (this.exists(f)) {
        let h = this.read(f);
        h = h.replace(/(<title>)\s*\d+\.\s*/i, '$1' + n + '. ').replace(/(<H1[^>]*>)\s*\d+\.\s*/i, '$1' + n + '. ');
        this.write(f, h);
      }
    }
  }

  /**
   * Group pages (Detailed Guide, Sales, Quick Guide contents ...) are plain lists of numbered links. After the
   * contents changed they are written again from it, but only when the page really is such a list.
   */
  refreshListPages() {
    this.skippedLists = [];
    this.walk((node, trail) => {
      const f = localOf(node);
      const kids = node.children.filter(k => nameOf(k));
      if (!f || !this.exists(f) || !kids.length) return;
      const h = this.read(f);
      const m = /(<DIV id=nstext>)([\s\S]*?)(<\/DIV>\s*<DIV class=footer>)/i.exec(h);
      const skip = () => this.skippedLists.push(trail.join(' > ') + ' [' + f + ']');
      if (!m) return skip();
      const paras = m[2].match(/<P>[\s\S]*?<\/P>/gi) || [];
      const real = paras.filter(p => p.replace(/<[^>]*>|&nbsp;|\s/g, '') !== '');
      if (!real.length || !real.every(p => /<A\s+href=/i.test(p))) return skip();      // not a pure list: keep the page
      const isToc = norm(nameOf(node)) === 'quickguide';
      let n = 0, list = '';
      for (const k of kids) {
        const kf = localOf(k);
        if (!kf || kf === f) continue;
        if (isToc && /table of contents/i.test(nameOf(k))) continue;
        const label = nameOf(k).replace(/^\d+\.\s*/, '');
        list += '<P><FONT size=2>' + (++n) + '. <A href="' + kf + '">' + esc(label) + '</A></FONT></P>' + EOL;
      }
      if (list) this.write(f, h.slice(0, m.index) + m[1] + '<BR>' + EOL + list + h.slice(m.index + m[0].length - m[3].length));
    });
    // the "Table of Contents" topic lists the Quick Guide steps
    const toc = this.find(['Quick Guide', 'Table of Contents']);
    if (toc && localOf(toc) && this.exists(localOf(toc))) {
      const f = localOf(toc);
      const h = this.read(f);
      const m = /(<DIV id=nstext>)([\s\S]*?)(<\/DIV>\s*<DIV class=footer>|<HR>)/i.exec(h) || /(<BODY>)([\s\S]*?)(<DIV class=footer>)/i.exec(h);
      if (m && /<A\s+href=/i.test(m[2])) {
        const qg = this.find(['Quick Guide']);
        let list = '';
        for (const k of qg.children) {
          if (k === toc || !localOf(k)) continue;
          list += '<P><FONT size=2><A href="' + localOf(k) + '">' + esc(nameOf(k)) + '</A></FONT></P>' + EOL;
        }
        // keep the title row / banner that sits before the list: only the paragraphs of links are replaced
        const keep = m[2].replace(/<P>[\s\S]*?<\/P>/gi, '').replace(/<BR>/gi, '');
        this.write(f, h.slice(0, m.index) + m[1] + keep + '<BR>' + EOL + list + h.slice(m.index + m[0].length - m[3].length));
      }
    }
  }

  /** write contents + index */
  save() {
    this.refreshListPages();
    fs.writeFileSync(this.file('toc.hhc'), serializeHhc(this.toc), 'latin1');
    // new / renamed topics are findable from the index
    let hhk = this.hhk;
    if (this.removedFiles.length) {
      hhk = hhk.replace(/<LI>\s*<OBJECT[^>]*>[\s\S]*?<\/OBJECT>\s*/gi, block =>
        this.removedFiles.some(f => block.toLowerCase().includes('value="' + f.toLowerCase() + '"')) ? '' : block);
      this.removedFiles = [];
    }
    const have =new Set([...hhk.matchAll(/name="Local" value="([^"]*)"/gi)].map(x => x[1].toLowerCase()));
    const add = this.added.filter(([, f]) => f && !have.has(f.toLowerCase()));
    if (add.length) {
      const items = add.map(([t, f]) =>
        '<LI><OBJECT type="text/sitemap">' + EOL + '<param name="Name" value="' + esc(t.replace(/^\d+\.\s*/, '')) + '">' + EOL +
        '<param name="Local" value="' + f + '">' + EOL + '</OBJECT>' + EOL).join('');
      const i = hhk.lastIndexOf('</UL>');
      hhk = hhk.slice(0, i) + items + hhk.slice(i);
    }
    this.hhk = hhk;
    fs.writeFileSync(this.file('index.hhk'), hhk, 'latin1');
    this.added = [];
  }
}

module.exports = {
  SOURCES, EDITIONS, EOL, norm, parseHhc, serializeHhc, getParam, setParam, nameOf, localOf, makeNode,
  esc, inline, H, P, STEPS, UL, GAP, pageHtml, Source
};
