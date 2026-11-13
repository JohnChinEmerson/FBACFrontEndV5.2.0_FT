// Compiles the guide sources into .chm files with Microsoft HTML Help Workshop (hhc.exe).
//
//   node tools/user-guide/build-chm.js            -> tools/user-guide/out/FNB<Edition>UserGuide.chm
//   node tools/user-guide/build-chm.js --publish  -> also copies them over src/assets/userguides/
//
// Only the pages that can be reached from the contents, the index or another page are compiled, so leftovers of the
// desktop guides (pages no topic points to) do not show up in the search of the .chm.
'use strict';
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const { SOURCES, EDITIONS, Source, localOf } = require('./lib/guide');

const HHC = ['C:/Program Files (x86)/HTML Help Workshop/hhc.exe', 'C:/Program Files/HTML Help Workshop/hhc.exe'].find(fs.existsSync);
if (!HHC) { console.error('hhc.exe (HTML Help Workshop) not found'); process.exit(1); }

const OUT = path.join(__dirname, 'out');
const WORK = path.join(OUT, 'work');
const ASSETS = path.join(__dirname, '..', '..', 'src', 'assets', 'userguides');
const TITLE = { Enterprise: 'Enterprise', Standard: 'Standard', Express: 'Express', POS: 'POS', POSBIR: 'POSBIR', POSBIRBackOffice: 'POSBIRBackOffice' };

fs.rmSync(WORK, { recursive: true, force: true });
fs.mkdirSync(WORK, { recursive: true });
const built = [];

for (const [key, name] of Object.entries(EDITIONS)) {
  const s = new Source(key);
  const have = new Map(fs.readdirSync(s.dir).map(f => [f.toLowerCase(), f]));

  // pages reachable from the contents, the index and from each other
  const reach = new Set();
  const queue = [];
  const take = f => { const real = have.get(String(f).toLowerCase()); if (real && !reach.has(real)) { reach.add(real); queue.push(real); } };
  s.walk(n => { if (localOf(n)) take(localOf(n)); });
  for (const m of s.hhk.matchAll(/name="Local" value="([^"]*)"/gi)) take(m[1]);
  while (queue.length) {
    const f = queue.shift();
    if (!/\.html?$/i.test(f)) continue;
    for (const m of fs.readFileSync(path.join(s.dir, f), 'latin1').matchAll(/href\s*=\s*"?([^"\s>#]+)/gi)) if (!/^https?:/i.test(m[1])) take(decodeURIComponent(m[1]));
  }
  take('_template.css');

  const dir = path.join(WORK, name);
  fs.mkdirSync(dir, { recursive: true });
  for (const f of reach) fs.copyFileSync(path.join(s.dir, f), path.join(dir, f));
  fs.copyFileSync(path.join(s.dir, 'toc.hhc'), path.join(dir, 'toc.hhc'));
  fs.copyFileSync(path.join(s.dir, 'index.hhk'), path.join(dir, 'index.hhk'));

  const first = (() => { let f = null; s.walk(n => { if (!f && localOf(n)) f = localOf(n); }); return f; })();
  const chm = path.join(OUT, 'FNB' + TITLE[name] + 'UserGuide.chm');
  const title = 'Mariosoft Food and Beverage ' + name.replace('POSBIRBackOffice', 'POSBIRBackOffice') + ' - User Manual';
  const hhp =
    '[OPTIONS]\r\n' +
    'Compatibility=1.1 or later\r\n' +
    'Compiled file=' + chm + '\r\n' +
    'Contents file=toc.hhc\r\n' +
    'Default Window=main\r\n' +
    'Default topic=' + first + '\r\n' +
    'Display compile progress=No\r\n' +
    'Full-text search=Yes\r\n' +
    'Index file=index.hhk\r\n' +
    'Language=0x409 English (United States)\r\n' +
    'Title=' + title + '\r\n\r\n' +
    '[WINDOWS]\r\n' +
    'main="' + title + '","toc.hhc","index.hhk","' + first + '","' + first + '",,,,,0x23520,200,0x387e,[10,10,900,650],0xB0000,,,,,,0\r\n\r\n' +
    '[FILES]\r\n' + [...reach].sort().join('\r\n') + '\r\n';
  fs.writeFileSync(path.join(dir, name + '.hhp'), hhp, 'latin1');

  fs.rmSync(chm, { force: true });
  const r = cp.spawnSync(HHC, [name + '.hhp'], { cwd: dir, encoding: 'latin1' });
  if (!fs.existsSync(chm)) { console.error(name + ': compile failed\n' + r.stdout + r.stderr); process.exitCode = 1; continue; }
  const warn = (r.stdout.match(/HHC\d+: Warning[^\r\n]*/g) || []);
  built.push(chm);
  console.log(name.padEnd(18) + (fs.statSync(chm).size / 1024).toFixed(0).padStart(5) + ' KB   ' + reach.size + ' files' + (warn.length ? '   ' + warn.length + ' warning(s)' : ''));
  warn.slice(0, 5).forEach(w => console.log('    ' + w));
}

if (process.argv.includes('--publish')) {
  for (const f of built) fs.copyFileSync(f, path.join(ASSETS, path.basename(f)));
  console.log('copied ' + built.length + ' file(s) to ' + path.relative(process.cwd(), ASSETS));
}
