# User guide tools

The User Guide popup (footer **USER GUIDE**) reads `src/app/layouts/home/UserGuide/user-guide/user-guide-data.ts`.
That file is generated; the content lives here, as HTML Help (`.chm`) sources.

```
tools/user-guide/
  sources/<Edition>/        one HTML Help project per edition: toc.hhc (contents), index.hhk (index), pages, _template.css
  lib/guide.js              read / write helpers and the page style (Easy Steps, numbered clicks, bold buttons)
  web-structure.js          what the web version offers per edition (menus and screens, read from the web database)
  web-updates.js            the web version changes applied to the desktop guides (see below)
  build-data.js             sources -> user-guide-data.ts (what the app shows)
  build-chm.js              sources -> out/FNB<Edition>UserGuide.chm (HTML Help Workshop, hhc.exe)
```

Editions: `Enterprise`, `Standard`, `Express`, `POS`, `POSBIR`, `POSBIRBackOffice`.

## Everyday use

Edit a page in `sources/<Edition>/` (same style as the other pages), keep `toc.hhc` / `index.hhk` in step when a topic is
added, then:

```
node tools/user-guide/build-data.js     # refresh the app
node tools/user-guide/build-chm.js      # optional: rebuild the .chm files into tools/user-guide/out/
node tools/user-guide/build-chm.js --publish   # same, and replace src/assets/userguides/*.chm
```

Pages are windows-1252 files: keep new text to plain ASCII (`&gt;` for `>`).

## web-updates.js

`web-updates.js` was run once on the sources decompiled from the desktop `.chm` files (original `.chm` files are still in
`src/assets/userguides` until `--publish`). It adds / moves / rewrites the topics that differ in the web version, per
edition, using `web-structure.js` to decide which edition gets what. It is kept so the changes can be read in one place.
It is a one-time migration, not a build step: it is meant for untouched sources (decompile the `.chm` files again to
get them) and has not been written to be re-run on the edited ones. Edit the sources directly from now on.

## Which guide a user sees

`UserGuideComponent` reads `AuthService.Edition` (the edition of the session, the same value sent in the `Edition` header):
`ENTERPRISE`, `STANDARD`, `EXPRESS`, `POS`, `POS/BIR` and `POS/BIR BACK OFFICE` show only their own guide; `NA`, `DEFAULT`,
empty or anything else shows a tab for every edition.

## Decompiling a .chm

`hh.exe -decompile <new folder> <file.chm>`: the output folder must not exist and its path must be short, otherwise file
names are cut and the contents / index files overwrite each other.
