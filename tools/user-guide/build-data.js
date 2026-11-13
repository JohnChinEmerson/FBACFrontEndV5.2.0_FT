// Builds src/app/layouts/home/UserGuide/user-guide/user-guide-data.ts from the guide sources.
//
//   node tools/user-guide/build-data.js
//
// Every edition's contents (toc.hhc) becomes a tree of { id, t(itle), f(ile), p(age key), c(hildren) } and every page is
// cleaned to plain HTML (no fonts, banners, footers) and stored once under a key made from its content, so a page that
// several editions share is written a single time.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { SOURCES, EDITIONS, parseHhc, nameOf, localOf } = require('./lib/guide');

const OUT = path.join(__dirname, '..', '..', 'src', 'app', 'layouts', 'home', 'UserGuide', 'user-guide', 'user-guide-data.ts');
const dec = new TextDecoder('windows-1252');

function clean(buf) {
  let h = dec.decode(buf);
  const body = /<BODY[^>]*>([\s\S]*)<\/BODY>/i.exec(h);
  h = body ? body[1] : h;
  h = h
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<DIV[^>]*class=footer[^>]*>[\s\S]*$/i, '')                    // copyright footer (the viewer has its own)
    .replace(/<DIV[^>]*id=nsbanner[^>]*>[\s\S]*?<\/H1>\s*<\/DIV>\s*<\/DIV>/i, '')  // banner + page heading
    .replace(/<DIV[^>]*id=titlerow[^>]*>[\s\S]*?<\/H1>\s*<\/DIV>/i, '')
    .replace(/<H1[^>]*>[\s\S]*?<\/H1>/gi, '')
    .replace(/<HR[^>]*>/gi, '')
    .replace(/<\/?(?:DIV|FONT|SPAN|CENTER)[^>]*>/gi, '')
    .replace(/<BR\s*\/?>/gi, '<br>')
    .replace(/<(P|UL|OL|LI|BLOCKQUOTE|STRONG|B|EM|I|U|TABLE|TR|TD|TH|TBODY)\b[^>]*>/gi, (m, t) => '<' + t.toLowerCase() + '>')
    .replace(/<\/(P|UL|OL|LI|BLOCKQUOTE|STRONG|B|EM|I|U|TABLE|TR|TD|TH|TBODY)>/gi, (m, t) => '</' + t.toLowerCase() + '>')
    // links inside the guide jump to another topic; web links open in a new tab
    .replace(/<A\s+[^>]*?href\s*=\s*"?([^">\s]+)"?[^>]*>/gi, (m, href) =>
      /^https?:/i.test(href) ? '<a href="' + href + '" target="_blank" rel="noopener">' : '<a data-page="' + decodeURIComponent(href) + '">')
    .replace(/<\/A>/gi, '</a>')
    .replace(/\s+/g, ' ')
    .replace(/(?:<br>\s*)+/g, ' ')
    .replace(/<p>\s*(?:&nbsp;|\s)*<\/p>/gi, '')
    .replace(/<p>\s*$/i, '')
    .trim();
  // pages in the guide are written with <P> that is often never closed: close the last one so the html is tidy
  return h.replace(/(<p>)(?![\s\S]*<\/p>\s*$)/i, '$1');
}

const pages = {};
let nextId = 0;
const guides = {};

for (const [key, name] of Object.entries(EDITIONS)) {
  const dir = path.join(SOURCES, name);
  const files = new Map(fs.readdirSync(dir).map(f => [f.toLowerCase(), f]));
  const toc = parseHhc(fs.readFileSync(path.join(dir, 'toc.hhc'), 'latin1'));
  const convert = nodes => nodes.map(n => {
    const out = { id: ++nextId, t: nameOf(n).replace(/&amp;/g, '&') };
    const f = localOf(n);
    if (f) {
      const real = files.get(f.toLowerCase());
      if (!real) throw new Error(`${name}: "${out.t}" points to a missing page ${f}`);
      out.f = f;
      const html = clean(fs.readFileSync(path.join(dir, real)));
      const k = 'p' + crypto.createHash('sha1').update(html).digest('hex').slice(0, 8);
      pages[k] = html;
      out.p = k;
    }
    if (n.children.length) out.c = convert(n.children);
    return out;
  });
  guides[key] = convert(toc.root);
}

// a link to a page that is not in the contents of that edition would be dead: report it
const dead = [];
for (const [key, tree] of Object.entries(guides)) {
  const have = new Set();
  (function w(a) { a.forEach(n => { if (n.f) have.add(n.f.toLowerCase()); if (n.c) w(n.c); }); })(tree);
  (function w(a) {
    a.forEach(n => {
      if (n.p) for (const m of pages[n.p].matchAll(/data-page="([^"]+)"/g)) if (!have.has(m[1].toLowerCase())) dead.push(`${key}: "${n.t}" -> ${m[1]}`);
      if (n.c) w(n.c);
    });
  })(tree);
}

const sortedPages = Object.fromEntries(Object.keys(pages).sort().map(k => [k, pages[k]]));
const ts =
  '// AUTO-GENERATED from the FBAC *.chm user guide sources by tools/user-guide/build-data.js. Do not edit by hand.\n' +
  "export type EditionKey = 'enterprise' | 'standard' | 'express' | 'pos' | 'posbir' | 'posbirbo';\n\n" +
  'export interface GuideNode {\n' +
  '  id: number;      // unique id\n' +
  '  t: string;       // title shown in the contents\n' +
  '  f?: string;      // original page file name (target of in-page links)\n' +
  '  p?: string;      // key into GUIDE_PAGES (absent for pure group headings)\n' +
  '  c?: GuideNode[]; // children\n' +
  '}\n\n' +
  'export const GUIDES: Record<EditionKey, GuideNode[]> = ' + JSON.stringify(guides) + ';\n\n' +
  'export const GUIDE_PAGES: Record<string, string> = {\n' +
  Object.entries(sortedPages).map(([k, v]) => '  ' + JSON.stringify(k) + ': ' + JSON.stringify(v)).join(',\n') + '\n};\n';

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, ts.replace(/\n/g, '\r\n'), 'utf8');

const count = t => t.reduce((s, n) => s + (n.p ? 1 : 0) + (n.c ? count(n.c) : 0), 0);
console.log('wrote ' + path.relative(process.cwd(), OUT) + ' (' + (ts.length / 1024).toFixed(0) + ' KB, ' + Object.keys(pages).length + ' distinct pages)');
for (const k of Object.keys(guides)) console.log('  ' + k.padEnd(9) + count(guides[k]) + ' topics');
if (dead.length) { console.log('\nDEAD LINKS (' + dead.length + '):'); dead.slice(0, 40).forEach(d => console.log('  ' + d)); }
