const fs = require('fs');
const path = require('path');
const c = require('./content');
const works = require('./works');

const OUT = path.join(__dirname, 'c');
fs.mkdirSync(OUT, { recursive: true });
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const MEDIA = ['sound', 'intermedia', 'video', 'performance', 'installation', 'photography', 'painting', 'drawing'];
const MEDIA_LABEL = {
  sound: 'sound', intermedia: 'intermedia', video: 'video', performance: 'performance',
  installation: 'installation', photography: 'residency archive', painting: 'painting', drawing: 'drawing'
};

// Nav is a tree, following inbetweennoise.com: `works` opens into a by-year list
// and a by-medium list. A medium points at its own rich page where one exists
// (sound, intermedia, painting, photography); the rest are generated indexes.
const YEARS_NAV = [...new Set(require('./works').map(w => w.y))].sort((a, b) => b - a);
const MEDIA_PAGE = {
  painting: 'paintings.html', drawing: 'drawings.html'
};
// photography reads as a medium tag on a work, but the archive itself is a
// section of the site, so it sits at the top level of the nav rather than
// inside `by medium`.
const MEDIA_NAV_SKIP = ['photography'];
const MEDIA_NAV_LABEL = { painting: 'paintings', drawing: 'drawings' };
const mediaHref = m => MEDIA_PAGE[m] || `works-m-${m}.html`;

// The name at the top of the sidebar already links to index.html, so the nav
// does not repeat it.
const NAV = [
  { f: 'works.html', t: 'works', children: [
      { group: 'by year', items: YEARS_NAV.map(y => ({ f: `works-y-${y}.html`, t: String(y) })) },
      { group: 'by medium', items: [] }
    ] },
  { f: 'residency-archive.html', t: 'residency archive' },
  { f: 'discography.html', t: 'discography', children: [
      { group: '', items: [
        { f: 'discography.html#solo', t: 'solo' },
        { f: 'discography.html#collaborations', t: 'collaborations' },
        { f: 'discography.html#compilations', t: 'compilations' },
        { f: 'discography.html#djsets', t: 'dj sets' }
      ] }
    ] },
  { f: 'texts.html', t: 'texts' },
  { f: 'about.html', t: 'about' },
  { f: 'contact.html', t: 'contact' }
];

const CSS = `
/* Redaction — Forest Young & Jeremy Mickel (OFL), served via jsDelivr/Fontsource.
   Supreme — Indian Type Foundry (free for commercial use), served via Fontshare. */
@import url("https://cdn.jsdelivr.net/npm/@fontsource/redaction@5.3.0/index.css");
@import url("https://cdn.jsdelivr.net/npm/@fontsource/redaction-35@5.3.0/index.css");
@import url("https://api.fontshare.com/v2/css?f[]=supreme@400,500&display=swap");

:root{
  --bg:#FFFFFF; --ink:#111111; --ink-2:#4A4A48; --ink-3:#8C8C88;
  --rule:#DCDCD8; --hair:#EEEEEA;
  --serif:"Redaction",Georgia,"Times New Roman",serif;
  --display:"Redaction 35","Redaction",Georgia,serif;
  --sans:"Supreme",-apple-system,"Helvetica Neue",Arial,sans-serif;
  --side:196px;
}
*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%}
body{background:var(--bg);color:var(--ink);font-family:var(--serif);
  font-size:13.5px;line-height:1.6;-webkit-font-smoothing:antialiased;font-kerning:normal}
a{color:inherit;text-decoration:none}
img,video{display:block;max-width:100%}
em{font-style:italic}

.lbl{font-family:var(--sans);font-size:10.5px;letter-spacing:.14em;text-transform:lowercase;
  font-weight:500;color:var(--ink-3)}

/* ---- frame: persistent left index, like a printed table of contents ---- */
.frame{display:grid;grid-template-columns:var(--side) minmax(0,1fr);min-height:100vh}
.side{border-right:1px solid var(--rule);padding:26px 20px 26px 26px;position:sticky;top:0;height:100vh;
  overflow-y:auto;display:flex;flex-direction:column;gap:26px}
.side .name{font-family:var(--display);font-size:16px;line-height:1.15;letter-spacing:.005em}
.side nav{display:flex;flex-direction:column}
.side nav a{padding:2px 0;font-size:12.5px;color:var(--ink-2);border-bottom:1px solid transparent;width:fit-content}
.side nav a:hover{color:var(--ink);border-color:var(--ink)}
.side nav a[aria-current="page"]{color:#BDB7AC;border-color:transparent}
.side nav a[aria-current="page"]:hover{color:#BDB7AC;border-color:transparent}
.side nav .sub{display:flex;flex-direction:column;margin:3px 0 6px 12px}
.side nav .sub a{font-size:11.5px;color:var(--ink-3);padding:1.5px 0}
.side nav .sub a:hover{color:var(--ink)}
.side nav .subhead{font-family:var(--sans);font-size:9.5px;letter-spacing:.14em;text-transform:lowercase;
  color:var(--ink-3);opacity:.7;margin:6px 0 2px}
.side .grp{margin-top:14px}
.side .ext a{display:block;padding:2px 0;color:var(--ink-2)}
.side .ext a:hover{color:var(--ink)}
.side .cr{margin-top:auto;color:var(--ink-3);font-size:12px;padding-top:20px}

.main{padding:30px 40px 90px;max-width:1180px}
.rule{height:1px;background:var(--rule);margin:30px 0}
.hair{height:1px;background:var(--hair);margin:20px 0}

h1.pt{font-family:var(--display);font-size:26px;line-height:1.1;font-weight:400;letter-spacing:.002em}
h2.st{font-family:var(--display);font-size:17px;line-height:1.2;font-weight:400;margin-bottom:4px}
.intro{max-width:62ch;margin-top:14px;color:var(--ink-2)}

/* ---- home: everything visible at once ---- */
.toc{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:34px 46px;margin-top:34px}
.toc section h3{font-family:var(--sans);font-size:10.5px;letter-spacing:.14em;text-transform:lowercase;
  font-weight:500;color:var(--ink-3);padding-bottom:7px;margin-bottom:9px;border-bottom:1px solid var(--rule)}
.toc a{display:block;padding:2px 0;color:var(--ink-2);width:fit-content;border-bottom:1px solid transparent}
.toc a:hover{color:var(--ink);border-color:var(--ink)}
.toc .n{color:var(--ink-3);font-size:12.5px}

/* ---- home: one image at a time ---- */
.viewer{height:calc(100vh - 120px);min-height:420px}
.viewer .plate{height:100%;display:flex;align-items:center;justify-content:flex-start}
.viewer img{max-height:100%;max-width:100%;width:auto;height:auto;object-fit:contain;
  transition:opacity .7s ease}
.viewer img.fade{opacity:0}

/* ---- releases ---- */
.rels{margin-top:10px}
.rel{display:grid;grid-template-columns:56px minmax(0,1.4fr) minmax(0,1fr) 108px;gap:16px;
  padding:10px 0;border-bottom:1px solid var(--hair);align-items:start}
.rel:hover{background:#FAFAF7}
.rel .cover{display:block;width:56px;height:56px;border:1px solid var(--hair)}
.rel .cover img{width:100%;height:100%;object-fit:cover;display:block}
.rel .rt{line-height:1.35}
.rel .rt a{border-bottom:1px solid var(--rule)}
.rel .rt a:hover{border-color:var(--ink)}
.rel .ra{color:var(--ink-2);font-size:14px}
.rel .rd{font-family:var(--sans);font-size:10px;letter-spacing:.1em;color:var(--ink-3);text-align:right}
.relhead{display:grid;grid-template-columns:220px minmax(0,1fr);gap:34px;align-items:start;margin-top:6px}
.relhead .art img{width:100%;height:auto;display:block;border:1px solid var(--hair)}
.relhead blockquote{margin:0 0 16px;padding-left:14px;border-left:1px solid var(--rule);
  color:var(--ink-2);font-style:italic;max-width:56ch}
.relhead .tx{max-width:60ch;margin-bottom:12px}
.credits{font-size:13px;color:var(--ink-2);line-height:1.7}
.tracklist{counter-reset:trk;margin-top:8px}
.tracklist li{counter-increment:trk;list-style:none;padding:5px 0;border-bottom:1px solid var(--hair)}
.tracklist li::before{content:counter(trk,decimal-leading-zero);font-family:var(--sans);font-size:10px;
  letter-spacing:.1em;color:var(--ink-3);margin-right:12px}
.backlink{display:inline-block;margin-bottom:20px;font-family:var(--sans);font-size:10.5px;
  letter-spacing:.14em;text-transform:lowercase;color:var(--ink-3)}
.backlink:hover{color:var(--ink)}
/* ---- work detail ---- */
.detail{display:grid;grid-template-columns:190px minmax(0,1fr);gap:38px;align-items:start;margin-top:4px}
.detail .dt-t{font-family:var(--display);font-size:19px;line-height:1.2;font-weight:400;margin-bottom:10px}
.detail .counter{font-family:var(--sans);font-size:10px;letter-spacing:.1em;color:var(--ink-3);margin-bottom:7px}
.picker{display:grid;grid-template-columns:repeat(3,50px);gap:10px;margin-bottom:14px}
.picker .thumb{padding:0;border:0;background:#F2F2EE;width:50px;height:50px;cursor:pointer;overflow:hidden;opacity:.55}
.picker .thumb img{width:100%;height:100%;object-fit:cover;display:block}
.picker .thumb.on,.picker .thumb:hover{opacity:1}
.detail .facts{font-size:12.5px;color:var(--ink-2);line-height:1.65}
.detail .dlinks{margin-top:12px;display:flex;flex-direction:column;gap:3px}
.detail .dlinks a{font-size:12.5px;color:var(--ink-2);border-bottom:1px solid var(--rule);width:fit-content}
.detail .dlinks a:hover{border-color:var(--ink)}
.detail .dtext{margin-top:14px}
.detail .dtext .tx{font-size:13px;line-height:1.6}
.detail .credit{font-family:var(--sans);font-size:10px;letter-spacing:.1em;color:var(--ink-3);margin-top:10px}
.credit{font-family:var(--sans);font-size:10px;letter-spacing:.1em;color:var(--ink-3);margin-top:10px}
.detail .stage img{width:100%;height:auto;display:block;max-width:640px}
.detail .stage .vid{margin-top:18px;max-width:640px}
.detail .stage .vwrap{position:relative;padding-top:56.25%;background:#F2F2EE}
.detail .stage .vwrap iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.detail .stage .vid figcaption{font-family:var(--sans);font-size:10px;letter-spacing:.1em;color:var(--ink-3);padding-top:6px}
.statement{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:34px;margin-top:12px}
.statement .tx{font-size:13.5px;line-height:1.72;max-width:52ch;margin-bottom:12px}
.txt{padding:22px 0;border-bottom:1px solid var(--hair);max-width:60ch}
.txt .dt{color:var(--ink-3);font-size:12px;margin:2px 0 10px}
.txt .tx{margin-bottom:10px}
.d3{display:grid;grid-template-columns:minmax(0,1fr);gap:34px;align-items:start;margin-top:10px}
.d3 .tx{max-width:56ch;margin-bottom:10px}
.d3 .genre{font-family:var(--sans);font-size:10px;letter-spacing:.1em;color:var(--ink-3);margin-top:12px}
.d3 .members{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.d3 .members .ph{background:#F2F2EE;aspect-ratio:1/1;overflow:hidden}
.d3 .members img{width:100%;height:100%;object-fit:cover;display:block}
.d3 .members figcaption{font-size:11.5px;color:var(--ink-3);padding-top:6px}

/* ---- works index (the spine) ---- */
.switch{display:flex;gap:16px;align-items:baseline;margin:26px 0 6px}
.switch button{font-family:var(--sans);font-size:10.5px;letter-spacing:.14em;text-transform:lowercase;
  background:none;border:0;padding:0 0 2px;cursor:pointer;color:var(--ink-3);border-bottom:1px solid transparent}
.switch button[aria-pressed="true"]{color:var(--ink);border-color:var(--ink)}
.switch .count{margin-left:auto;color:var(--ink-3);font-size:12.5px}

.wgroup{margin-top:26px}
.wgroup>h3{font-family:var(--sans);font-size:10.5px;letter-spacing:.14em;text-transform:lowercase;font-weight:500;
  color:var(--ink-3);border-bottom:1px solid var(--rule);padding-bottom:7px}
.wrow{display:grid;grid-template-columns:52px minmax(0,1.35fr) minmax(0,1fr) 128px;gap:16px;
  padding:7px 0;border-bottom:1px solid var(--hair);align-items:baseline}
.wrow:hover{background:#FAFAF7}
.wrow .wy{color:var(--ink-3);font-size:13px}
.wrow .wt{line-height:1.35}
.wrow .wt a{border-bottom:1px solid var(--rule)}
.wrow .wt a:hover{border-color:var(--ink)}
.wrow .wv{color:var(--ink-2);font-size:14px}
.wrow .wm{font-family:var(--sans);font-size:10px;letter-spacing:.1em;color:var(--ink-3);text-align:right}
.wrow .wk,.rel .wk{font-style:italic;color:var(--ink-3);font-size:13px}

/* ---- entries ---- */
.entry{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:40px;
  padding:30px 0;border-bottom:1px solid var(--rule);align-items:start}
.entry .dt{margin-top:10px;color:var(--ink-2);font-size:14px}
.entry .dt div+div{margin-top:2px}
.entry .tx{margin-top:16px;max-width:56ch}
.entry .media{display:flex;flex-direction:column;gap:8px}
.entry .media img{width:100%;background:#F2F2EE}
.entry .media video{width:100%;background:#F2F2EE}
.entry .more{display:inline-block;margin-top:14px;border-bottom:1px solid var(--rule)}
.entry .more:hover{border-color:var(--ink)}

/* ---- plates ---- */
.plates{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:22px}
.plates figure{background:#F2F2EE}
.plates img{width:100%;height:100%;object-fit:cover}
.plates figcaption{font-family:var(--sans);font-size:10px;letter-spacing:.06em;color:var(--ink-3);padding-top:7px;line-height:1.45}
.plates.art figcaption{font-family:var(--serif);font-size:11.5px;letter-spacing:0}
.plates figcaption .pt-t{font-style:italic;font-size:12.5px;letter-spacing:0;color:var(--ink-2)}
/* artwork plates: never crop a painting */
.plates.art{grid-template-columns:repeat(auto-fill,minmax(200px,1fr));column-gap:20px;row-gap:24px;align-items:start}
.plates.art figure{background:none;display:flex;flex-direction:column}
.plates.art .ph{background:#F2F2EE;aspect-ratio:1/1;flex:none;overflow:hidden;display:flex;align-items:center;justify-content:center;padding:12px}
.plates.art .ph img{width:auto;height:auto;max-width:100%;max-height:100%;object-fit:contain}
/* ---- thumbnail tiles ----
   Proportions taken from inbetweennoise.com: 170x100 thumb (17:10), 20px column
   gap, 7px between image and caption, title italic with the year on its own line
   beneath it, everything small and grey. Sizes are scaled up slightly because
   Redaction runs smaller than Helvetica at the same px. */
.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));
  column-gap:20px;row-gap:24px;margin-top:16px;align-items:start}
.tiles figure{display:flex;flex-direction:column;max-width:220px}
.tiles .ph{background:#F2F2EE;aspect-ratio:17/10;flex:none;overflow:hidden}
.tiles .ph img{width:100%;height:100%;object-fit:cover;display:block}
.tiles .ph[data-empty]{background:repeating-linear-gradient(135deg,#F4F4F0,#F4F4F0 6px,#EFEFEA 6px,#EFEFEA 12px)}
.tiles .ph-link{display:block}
.tiles .ph-link:hover .ph{opacity:.82}
.tiles .tt a{border-bottom:1px solid var(--rule)}
.tiles .tt a:hover{border-color:var(--ink)}
.tiles a.ph:hover{opacity:.82}
.tiles figcaption{padding-top:7px;line-height:1.45}
.tiles .tt{font-style:italic;font-size:12.5px;color:var(--ink-2)}
.tiles .ty,.tiles .tr,.tiles .tv{display:block;font-size:11.5px;color:var(--ink-3)}
.tiles .tr{margin-top:2px}

/* ---- cv ---- */
.cvblock{margin-top:26px}
.cvblock h3{font-family:var(--sans);font-size:10.5px;letter-spacing:.14em;text-transform:lowercase;font-weight:500;
  color:var(--ink-3);border-bottom:1px solid var(--rule);padding-bottom:7px;margin-bottom:8px}
.cve{display:grid;grid-template-columns:58px minmax(0,1fr);gap:16px;padding:3.5px 0;align-items:baseline}
.cve .y{color:var(--ink-3);font-size:13px}
.cve a{border-bottom:1px solid var(--rule)}
.cve a:hover{border-color:var(--ink)}
.cve .nt{color:var(--ink-3);font-style:italic}

.bio{max-width:64ch}
.bio p+p{margin-top:15px}
.bio h1.pt{margin-bottom:18px}
.contact{margin-top:32px;padding-top:18px;border-top:1px solid var(--rule);max-width:64ch}
.contact a{border-bottom:1px solid var(--rule)}
.contact a:hover{border-color:var(--ink)}
.contact .row{display:grid;grid-template-columns:88px 1fr;gap:14px;padding:3px 0}
.contact .row .k{color:var(--ink-3);font-size:13px}

audio{width:100%;max-width:460px;margin-top:12px;height:34px}

@media(max-width:1080px){ .toc{grid-template-columns:repeat(2,minmax(0,1fr))} .plates{grid-template-columns:repeat(3,1fr)} }
@media(max-width:860px){
  .frame{grid-template-columns:1fr}
  .side{position:static;height:auto;border-right:0;border-bottom:1px solid var(--rule);padding:24px 22px}
  .side nav{flex-direction:row;flex-wrap:wrap;gap:0 16px;align-items:baseline}
  .side nav .sub{flex-basis:100%;flex-direction:row;flex-wrap:wrap;gap:0 12px;
    margin:2px 0 4px;align-items:baseline}
  .side nav .subhead{flex-basis:100%;margin:7px 0 0}
  .side .cr{margin-top:16px}
  .main{padding:26px 22px 70px}
  .entry{grid-template-columns:1fr;gap:20px}
  .wrow{grid-template-columns:44px 1fr;gap:8px}
  .wrow .wv,.wrow .wm{grid-column:2;text-align:left}
  .rel{grid-template-columns:56px minmax(0,1fr);gap:12px}
  .rel .ra,.rel .rd{grid-column:2;text-align:left}
  .detail{grid-template-columns:1fr;gap:20px}
  .d3{grid-template-columns:1fr;gap:18px}
  .statement{grid-template-columns:1fr;gap:6px}
  .relhead{grid-template-columns:1fr;gap:18px}
  .relhead .art{max-width:260px}
  .toc{grid-template-columns:1fr}
  .plates{grid-template-columns:repeat(2,1fr)}
}
@media(prefers-reduced-motion:reduce){*{transition:none!important}}
`;

function shell(title, current, body) {
  const link = n => `<a href="${n.f}"${n.f === current ? ' aria-current="page"' : ''}>${esc(n.t)}</a>`;
  const nav = NAV.map(n => {
    if (!n.children) return link(n);
    // expand the branch whenever the current page belongs to it
    const owns = n.f === current || n.children.some(g => g.items.some(i => i.f === current));
    if (!owns) return link(n);
    return link(n) + '\n        <div class="sub">' + n.children.map(g =>
      `<span class="subhead">${esc(g.group)}</span>` +
      g.items.map(link).join('')).join('') + '</div>';
  }).join('\n        ');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(c.name)} — ${esc(title)}</title>
<meta name="description" content="${esc(c.tagline)}">
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="frame">
  <div class="side">
    <div>
      <a class="name" href="index.html">${esc(c.name)}</a>
    </div>
    <nav>
        ${nav}
    </nav>
    <div class="cr">${esc(c.copyright)}</div>
  </div>
  <main class="main">
${body}
  </main>
</div>
<script src="viewer.js"></script>\n<script src="app.js"></script>
</body>
</html>`;
}

/* ---------------- home: full table of contents, nothing hidden ---------------- */
const byMediumCount = {};
works.forEach(w => w.m.forEach(m => { byMediumCount[m] = (byMediumCount[m] || 0) + 1; }));
const years = [...new Set(works.map(w => w.y))].sort((a, b) => b - a);
NAV.find(n => n.t === 'works').children[1].items =
  MEDIA.filter(m => byMediumCount[m] && !MEDIA_NAV_SKIP.includes(m))
    .map(m => ({ f: mediaHref(m), t: MEDIA_NAV_LABEL[m] || MEDIA_LABEL[m] || m }));

const paintingItems = c.drawings.groups.flatMap(g => g.items || []);
// One image per work, plus the paintings and drawings. Residency photographs are
// documentation rather than works, and there are 52 of them, so only the single
// thumbnail each residency already carries reaches the home plate.
// One image per work, plus the paintings and drawings. Scores stay out — those
// images document someone else's performance — as does anything marked
// `noHome` in works.js.
const stripImgs = [...new Set([
  ...works.filter(w => !w.noHome).map(w => w.img).filter(im => im && !im.startsWith('img/scores/')),
  ...paintingItems.map(it => it.img)
])];

const home = `
    <div class="viewer" id="viewer">
      <div class="plate"><img id="vimg" src="${stripImgs[Math.floor(Math.random() * stripImgs.length)]}" alt=""></div>
    </div>
    <script id="vdata" type="application/json">${JSON.stringify(stripImgs)}</script>`;

/* ---------------- works: index + by-year + by-medium ----------------
   Thumbnail grid in the inbetweennoise.com manner: image, italic title, year.
   Works without a thumbnail yet fall back to an empty plate so the grid still
   reads as a grid — see HANDOFF gap on filling in images. */
const workHref = w => (w.slug ? `work-${w.slug}.html` : (w.link || w.href || ''));
const workTile = w => {
  const dest = workHref(w);
  const ext = dest.startsWith('http') ? ' target="_blank" rel="noopener"' : '';
  const ph = `<div class="ph"${w.img ? '' : ' data-empty="1"'}>${w.img ? `<img loading="lazy" src="${w.img}" alt="${esc(w.t)}">` : ''}</div>`;
  return `<figure>
        ${dest ? `<a class="ph-link" href="${dest}"${ext}>${ph}</a>` : ph}
        <figcaption><span class="tt">${dest ? `<a href="${dest}"${ext}>${esc(w.t)}</a>` : esc(w.t)}</span>
          <span class="ty">${w.y}</span>
          <span class="tr">${w.m.map(m => esc(MEDIA_LABEL[m])).join(' \u00b7 ')}</span>
          <span class="tv">${esc(w.v)}${w.w ? ' \u00b7 with ' + esc(w.w) : ''}</span></figcaption>
      </figure>`;
};
const worksGrid = list => `<div class="tiles">\n      ${list.map(workTile).join('\n      ')}\n    </div>`;

const worksPage = (heading, list, note) => `
    <h1 class="pt">${esc(heading)}</h1>
    <div class="lbl" style="margin-top:22px">${list.length} work${list.length === 1 ? '' : 's'}${note ? ' \u00b7 ' + esc(note) : ''}</div>
    ${worksGrid(list)}`;

const byYear = works.slice().sort((a, b) => b.y - a.y || a.t.localeCompare(b.t));
const worksBody = worksPage('Works', byYear);

const yearPages = YEARS_NAV.map(y => [`works-y-${y}.html`,
  shell(String(y), `works-y-${y}.html`, worksPage(String(y), works.filter(w => w.y === y)))]);

// only media without a rich page of their own need a generated index
const mediumPages = MEDIA.filter(m => byMediumCount[m] && !MEDIA_PAGE[m]).map(m => [`works-m-${m}.html`,
  shell(MEDIA_LABEL[m], `works-m-${m}.html`,
    worksPage(MEDIA_LABEL[m], works.filter(w => w.m.includes(m)).sort((a, b) => b.y - a.y)))]);

/* ---------------- sound ---------------- */
const collab = c.sound.groups.find(g => g.id === 'collaborations');
const perf = c.sound.groups.find(g => g.id === 'performances');
const rel = c.sound.groups.find(g => g.id === 'releases');
const dj = c.sound.groups.find(g => g.id === 'djsets');

const soundBody = `
    <h1 class="pt">Sound</h1>
    ${c.sound.intro ? `<p class="intro">${esc(c.sound.intro)}</p>` : ''}

    <div class="rule"></div>
    <div class="lbl" id="djsets" style="margin-top:34px">dj sets</div>
    <div class="wgroup" style="margin-top:10px">
      ${dj.items.map(d => `<div class="wrow">
        <span class="wy">${esc(d.year)}</span>
        <span class="wt"><a href="${d.href}" target="_blank" rel="noopener">${esc(d.title)}</a></span>
        <span class="wv">${esc(d.venue)}</span>
        <span class="wm">${esc(d.date)}</span>
      </div>`).join('\n      ')}
    </div>

    <div class="lbl" id="live" style="margin-top:34px">live &amp; performance</div>
    <div class="wgroup" style="margin-top:10px">
      ${perf.items.map(p => `<div class="wrow">
        <span class="wy">${esc(p.year)}</span>
        <span class="wt">${esc(p.title)}${p.with ? ` <span class="wk">with ${esc(p.with)}</span>` : ''}</span>
        <span class="wv">${esc(p.venue)}</span>
        <span class="wm">${esc(p.kind.toLowerCase())}</span>
      </div>`).join('\n      ')}
    </div>

    <div class="lbl" id="scores" style="margin-top:34px">scores for performance &amp; installation</div>
    ${collab.items.map(it => `<article class="entry">
      <div>
        <h2 class="st">${esc(it.title)}</h2>
        <div class="dt">
          <div>${esc(it.year)}</div>
          <div>${esc(it.role)}</div>
          <div>${esc(it.venue)}</div>
        </div>
        <p class="tx">${esc(it.text)}</p>
        ${it.link ? `<a class="more" href="${it.link.href}" target="_blank" rel="noopener">${esc(it.link.label)}</a>` : ''}
        ${it.audio ? `<audio controls preload="none" src="${it.audio}"></audio>` : ''}
      </div>
      <div class="media">
        ${(it.videos || []).map(v => `<video src="${v}" controls muted loop playsinline preload="metadata"></video>`).join('\n        ')}
        ${(it.images || []).map(im => `<img loading="lazy" src="${im}" alt="${esc(it.title)}">`).join('\n        ')}
      </div>
    </article>`).join('\n    ')}`;

/* ---------------- intermedia ---------------- */
const proj = c.intermedia.groups.find(g => g.id === 'projects');
const lab = c.intermedia.groups.find(g => g.id === 'lab');
const interBody = `
    <h1 class="pt">Intermedia</h1>

    <div class="lbl" style="margin-top:26px">projects (${proj.items.length})</div>
    <div class="tiles">
      ${proj.items.map(p => `<figure>
        <div class="ph"><img loading="lazy" src="${p.img}" alt="${esc(p.title)}"></div>
        <figcaption><span class="tt">${esc(p.title)}</span>
          <span class="ty">${esc(p.year)}</span>
          <span class="tr">${esc(p.role)}</span>${p.venue ? `<span class="tv">${esc(p.venue)}</span>` : ''}</figcaption>
      </figure>`).join('\n      ')}
    </div>

    <div class="lbl" id="lab" style="margin-top:38px">lab \u2014 ${esc(lab.note.toLowerCase())}</div>
    <div class="plates" style="grid-template-columns:repeat(2,1fr);max-width:760px">
      ${lab.images.map(im => `<figure><img loading="lazy" src="${im}" alt="Lab"></figure>`).join('\n      ')}
    </div>`;

/* ---------------- photography ---------------- */
const photoBody = `
    <h1 class="pt">Residency Archive</h1>
    ${c.photography.series.map(s => `
    <div class="rule" style="margin-top:26px"></div>
    <h2 class="st" id="${s.id}">${esc(s.title)}</h2>
    <div class="dt" style="color:var(--ink-2);font-size:14px;margin-top:4px">${esc(s.year)} \u00b7 ${esc(s.place)} \u00b7 ${esc(s.medium)}</div>
    <div class="dt" style="color:var(--ink-3);font-size:13px">${esc(s.context)}</div>
    ${s.text ? `<p class="tx" style="max-width:56ch;margin-top:10px">${esc(s.text)}</p>` : ''}
    ${s.audio ? `<audio controls preload="none" src="${s.audio}"></audio>` : ''}
    ${s.credit ? `<p class="credit">${esc(s.credit)}</p>` : ''}
    <div class="tiles" style="margin-top:14px">
      ${s.images.map(im => `<figure><div class="ph"><img loading="lazy" src="${im}" alt="${esc(s.title)}"></div></figure>`).join('\n      ')}
    </div>
    ${(s.drawings || []).length ? `<div class="lbl" style="margin-top:26px">drawings \u00b7 ${s.drawings.length}</div>
    <div class="plates art" style="margin-top:10px">
      ${s.drawings.map(im => `<figure><div class="ph"><img loading="lazy" src="${im}" alt="${esc(s.title)} drawing"></div></figure>`).join('\n      ')}
    </div>` : ''}`).join('\n')}`;

/* ---------------- drawings ---------------- */
const artPage = (heading, key) => `
    <h1 class="pt">${esc(heading)}</h1>
    ${c.drawings.groups.filter(g => g.page === key && (g.items || []).length).map(g => `
    <div class="lbl" id="${g.id}" style="margin-top:30px">${esc(g.title.toLowerCase())} (${g.items.length})${g.note ? ' \u2014 ' + esc(g.note) : ''}</div>
    <div class="plates art">
      ${g.items.map(it => `<figure>
        <div class="ph"><img loading="lazy" src="${it.img}" alt="${esc(it.title)}"></div>
        <figcaption><span class="pt-t">${esc(it.title)}</span>${it.year ? '<br>' + esc(it.year) : ''}${it.medium ? '<br>' + esc(it.medium) + (it.size ? ', ' + esc(it.size) : '') : ''}</figcaption>
      </figure>`).join('\n      ')}
    </div>`).join('\n')}`;

const paintBody = artPage('Paintings', 'paintings');
const drawBody  = artPage('Drawings', 'drawings');

/* ---------------- about (bio + cv) ---------------- */
const idFor = t => t.toLowerCase().split(/[^a-z]+/).filter(Boolean)[0];
const aboutBody = `
    <div class="bio">
      <h1 class="pt">About</h1>
      ${c.bio.map(p => `<p>${esc(p)}</p>`).join('\n      ')}
    </div>

    <div class="rule" style="margin-top:38px"></div>
    ${c.cv.map(sec => `<div class="cvblock" id="${idFor(sec.title)}">
      <h3>${esc(sec.title.toLowerCase())}</h3>
      ${sec.entries.map(e => `<div class="cve"><span class="y">${esc(e.year)}</span><span>${e.href ? `<a href="${e.href}" target="_blank" rel="noopener">${esc(e.text)}</a>` : esc(e.text)}${e.note ? ` <span class="nt">(${esc(e.note)})</span>` : ''}</span></div>`).join('\n      ')}
    </div>`).join('\n    ')}`;

/* ---------------- cv (folded into about) ---------------- */
const cvBody = `
    <h1 class="pt">CV</h1>
    <p class="intro">Full listing. See <a href="works.html" style="border-bottom:1px solid var(--rule)">works</a> for the same material sorted by medium.</p>
    ${c.cv.map(s => `<div class="cvblock" id="${idFor(s.title)}">
      <h3>${esc(s.title.toLowerCase())}</h3>
      ${s.entries.map(e => `<div class="cve"><span class="y">${esc(e.year)}</span><span>${e.href ? `<a href="${e.href}" target="_blank" rel="noopener">${esc(e.text)}</a>` : esc(e.text)}${e.note ? ` <span class="nt">(${esc(e.note)})</span>` : ''}</span></div>`).join('\n      ')}
    </div>`).join('\n    ')}`;

const VIEWER_JS = `
(function(){
  var data=document.getElementById('vdata');
  if(data){
    var imgs=JSON.parse(data.textContent);
    var im=document.getElementById('vimg');
    // Uniformly random, refusing anything seen in the recent window. A shuffle bag
    // walks the whole set before repeating, which reads as an order; this does not.
    var recent=[], window=Math.min(Math.max(3,Math.floor(imgs.length/3)),20);
    function pick(){
      if(imgs.length<2) return imgs[0];
      var next, guard=0;
      do { next=imgs[Math.floor(Math.random()*imgs.length)]; }
      while(recent.indexOf(next)!==-1 && ++guard<40);
      recent.push(next); if(recent.length>window) recent.shift();
      return next;
    }
    recent.push(im.getAttribute('src'));
    // only warm a handful; the pool is large now
    imgs.slice(0,8).forEach(function(s){var p=new Image();p.src=s;});
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setInterval(function(){
      if(document.hidden) return;
      var tries=0;
      (function attempt(){
        var next=pick(), pre=new Image();
        pre.onload=function(){
          if(reduce){ im.src=next; return; }
          im.classList.add('fade');
          setTimeout(function(){ im.src=next; im.classList.remove('fade'); },700);
        };
        pre.onerror=function(){ if(++tries<3) attempt(); };
        pre.src=next;
      })();
    },5000);
  }
})();
`;

const JS = `
(function(){
  // Old deep links (works.html#m-sound, #y-2023) now have pages of their own.
  var h=location.hash;
  if(h.indexOf('#m-')===0){ var m=h.slice(3), rich=${JSON.stringify(MEDIA_PAGE)}; location.replace(rich[m]||('works-m-'+m+'.html')); return; }
  if(h.indexOf('#y-')===0){ location.replace('works-y-'+h.slice(3)+'.html'); return; }
})();
`;

/* ---------------- release detail pages ---------------- */
const releasePage = r => {
  const pg = r.page;
  return `
    <a class="backlink" href="discography.html">\u2190 discography</a>
    <h1 class="pt">${esc(r.title)}</h1>
    <p class="intro">${esc(r.artist)} \u00b7 ${esc(r.kind)}${r.detail ? ' \u00b7 ' + esc(r.detail) : ''} \u00b7 ${esc(r.date)}</p>

    <div class="rule"></div>
    <div class="relhead">
      <div class="art"><img src="${r.art}" alt="${esc(r.title)} cover"></div>
      <div>
        ${pg.quote ? `<blockquote>${esc(pg.quote)}</blockquote>` : ''}
        ${pg.text.map(t => `<p class="tx">${esc(t)}</p>`).join('\n        ')}
        <div style="margin-top:16px">
          ${pg.links.map(l => `<a class="more" style="margin-right:16px" href="${l.href}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('\n          ')}
        </div>
        ${pg.related ? `<p style="margin-top:18px;font-size:13px;color:var(--ink-3)">${esc(pg.related.label)} \u2014
          <a href="${pg.related.href}" style="border-bottom:1px solid var(--rule)">works index</a></p>` : ''}
      </div>
    </div>

    ${pg.tracks.length ? `<div class="lbl" style="margin-top:34px">tracklist</div>
    <ol class="tracklist">
      ${pg.tracks.map(t => `<li>${esc(t)}</li>`).join('\n      ')}
    </ol>` : ''}

    ${pg.about ? `<div class="rule" style="margin-top:34px"></div>
    <div class="lbl">${esc(pg.about.heading)}</div>
    <div class="d3">
      <div>
        ${pg.about.lines.map(l => `<p class="tx">${esc(l)}</p>`).join('\n        ')}
        <p class="genre">${esc(pg.about.genre)}</p>
      </div>
      ${(pg.about.members || []).length ? `<div class="members">
        ${pg.about.members.map(m => `<figure><div class="ph"><img loading="lazy" src="${m.img}" alt="${esc(m.name)}"></div>
        <figcaption>${esc(m.name)}</figcaption></figure>`).join('\n        ')}
      </div>` : ''}
    </div>` : ''}

    ${pg.gallery ? `<div class="tiles" style="margin-top:26px">
      ${pg.gallery.map(g => `<figure><div class="ph"><img loading="lazy" src="${g}" alt="${esc(r.title)}"></div></figure>`).join('\n      ')}
    </div>` : ''}

    ${pg.physical ? `<div class="lbl" style="margin-top:34px">${esc(pg.physical.label.toLowerCase())}</div>
    <div class="tiles" style="margin-top:12px">
      ${pg.physical.images.map(g => `<figure><div class="ph"><img loading="lazy" src="${g}" alt="${esc(pg.physical.label)}"></div></figure>`).join('\n      ')}
    </div>` : ''}

    ${pg.alsoSingle ? `<div class="lbl" style="margin-top:34px">also released</div>
    <div class="tiles" style="margin-top:12px">
      <figure><div class="ph"><img loading="lazy" src="${pg.alsoSingle.img}" alt="${esc(pg.alsoSingle.label)}"></div>
      <figcaption><span class="tt">${esc(pg.alsoSingle.label)}</span></figcaption></figure>
    </div>` : ''}

    <div class="lbl" style="margin-top:34px">credits</div>
    <div class="credits" style="margin-top:8px">
      ${pg.credits.map(cr => `<div>${esc(cr)}</div>`).join('\n      ')}
    </div>`;
};

/* A watch link is worth more as a player. Recognise YouTube and Vimeo urls in a
   work's links and turn them into embeds; anything else stays a link. */
const videoEmbed = href => {
  let m = href.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  if (m) {
    const t = (href.match(/[?&#]t=(\d+)/) || [])[1];
    return `https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1${t ? '&start=' + t : ''}`;
  }
  m = href.match(/vimeo\.com\/(?:video\/)?(\d+)(?:[?&]h=(\w+))?/);
  if (m) return `https://player.vimeo.com/video/${m[1]}${m[2] ? '?h=' + m[2] : ''}`;
  if (/player\.vimeo\.com|youtube\.com\/embed/.test(href)) return href;
  return null;
};

/* ---------------- work detail pages ----------------
   Meta column on the left (title, back, counter, 50x50 thumbnail picker, role,
   rule, text), the selected image large on the right. Pure CSS + a tiny script:
   clicking a thumb swaps the main image. */
const workPage = w => {
  const d = w.det || {};
  const imgs = d.images || (w.img ? [w.img] : []);
  const embedded = (d.links || []).filter(l => videoEmbed(l.href))
    .map(l => ({ label: l.label.replace(/^watch\s*[—-]?\s*/i, '') || l.label, src: videoEmbed(l.href) }));
  const plainLinks = (d.links || []).filter(l => !videoEmbed(l.href));
  const videos = (d.video || []).concat(embedded);
  const para = t => `<p class="tx">${esc(t)}</p>`;
  return `
    <a class="backlink" href="works.html">\u2190 works</a>
    <div class="detail">
      <div class="meta">
        <h1 class="dt-t">${esc(w.t)}</h1>
        ${imgs.length > 1 ? `<div class="counter"><span id="ct">1</span> / ${imgs.length}</div>
        <div class="picker">
          ${imgs.map((im, i) => `<button class="thumb${i ? '' : ' on'}" data-i="${i}" aria-label="image ${i + 1}"><img loading="lazy" src="${im}" alt=""></button>`).join('\n          ')}
        </div>` : ''}
        <div class="facts">
          <div>${w.y}</div>
          ${d.role ? `<div>${esc(d.role)}</div>` : ''}
          <div>${esc(w.m.map(m => MEDIA_LABEL[m]).join(' \u00b7 '))}</div>
          ${w.v && w.v !== '\u2014' ? `<div>${esc(w.v)}${w.c ? ', ' + esc(w.c) : ''}</div>` : ''}
          ${w.x ? `<div>in \u2039${esc(w.x)}\u203a</div>` : ''}
          ${w.w ? `<div>with ${esc(w.w)}</div>` : ''}
        </div>
        ${plainLinks.length ? `<div class="dlinks">
          ${plainLinks.map(l => `<a href="${l.href}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('\n          ')}
        </div>` : ''}
        ${(d.text || []).length ? `<div class="dtext">${d.text.map(para).join('\n        ')}</div>` : ''}
        ${d.credit ? `<p class="credit">${esc(d.credit)}</p>` : ''}
      </div>
      ${imgs.length || videos.length ? `<div class="stage">
        ${imgs.length ? `<img id="stage-img" src="${imgs[0]}" alt="${esc(w.t)}">` : ''}
        ${videos.map(v => `<figure class="vid">
          <div class="vwrap"><iframe src="${v.src}" title="${esc(v.label)}" allow="fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>
          <figcaption>${esc(v.label)}</figcaption>
        </figure>`).join('\n        ')}
      </div>` : '<div></div>'}
    </div>
    ${d.statementKo ? `
    <div class="rule" style="margin-top:40px"></div>
    <div class="lbl">${esc(d.statementTitle || 'statement')}</div>
    <div class="statement">
      <div>${d.statementKo.map(para).join('\n        ')}</div>
      <div>${d.statementEn.map(para).join('\n        ')}</div>
    </div>` : ''}
    ${imgs.length ? `<script>(function(){
      var stage=document.getElementById('stage-img'), ct=document.getElementById('ct');
      document.querySelectorAll('.picker .thumb').forEach(function(b){
        b.addEventListener('click',function(){
          var i=+b.dataset.i;
          stage.src=b.querySelector('img').src;
          if(ct) ct.textContent=i+1;
          document.querySelectorAll('.picker .thumb').forEach(function(o){o.classList.toggle('on',o===b);});
        });
      });
    })();<\/script>` : ''}`;
};

const workPages = works.filter(w => w.slug)
  .map(w => [`work-${w.slug}.html`, shell(w.t, 'works.html', workPage(w))]);

const releasePages = rel.items.filter(r => r.slug && r.page)
  .map(r => [`release-${r.slug}.html`, shell(r.title, 'sound.html', releasePage(r))]);

/* ---------------- discography / texts / contact ---------------- */
const relRow = r => {
  const dest = r.slug ? `release-${r.slug}.html` : r.href;
  const ext = r.slug ? '' : ' target="_blank" rel="noopener"';
  return `<div class="rel">
        <a class="cover" href="${dest}"${ext}><img loading="lazy" src="${r.art}" alt="${esc(r.title)} cover"></a>
        <span class="rt"><a href="${dest}"${ext}>${esc(r.title)}</a> <span class="wk">${esc(r.kind)}</span></span>
        <span class="ra">${esc(r.artist)}${r.role ? '<br>' + esc(r.role) : ''}${r.detail ? '<br>' + esc(r.detail) : ''}</span>
        <span class="rd">${esc(r.date)}</span>
      </div>`;
};
const DISCO = [
  ['solo', 'solo', 'solo'],
  ['collaborations', 'collaborations', 'collaboration'],
  ['compilations', 'compilations', 'compilation']
];
const discoBody = `
    <h1 class="pt">Discography</h1>
    ${DISCO.map(([id, label, key]) => {
      const list = rel.items.filter(r => r.group === key || (key === 'collaboration' && r.group === 'collective'));
      if (!list.length) return '';
      return `<div class="rule" style="margin-top:26px"></div>
    <div class="lbl" id="${id}">${label}</div>
    <div class="rels">
      ${list.map(relRow).join('\n      ')}
    </div>`;
    }).join('\n')}
    <div class="rule" style="margin-top:26px"></div>
    <div class="lbl" id="djsets">dj sets</div>
    <div class="wgroup" style="margin-top:10px">
      ${dj.items.map(d => `<div class="wrow">
        <span class="wy">${esc(d.year)}</span>
        <span class="wt"><a href="${d.href}" target="_blank" rel="noopener">${esc(d.title)}</a></span>
        <span class="wv">${esc(d.venue)}</span>
        <span class="wm">${esc(d.date)}</span>
      </div>`).join('\n      ')}
    </div>
    <p style="margin-top:22px;color:var(--ink-2);max-width:56ch">${esc(rel.note)} &mdash;
      <a href="https://kimiver.bandcamp.com" target="_blank" rel="noopener" style="border-bottom:1px solid var(--rule)">bandcamp</a>,
      <a href="https://deepdronedreamer.bandcamp.com" target="_blank" rel="noopener" style="border-bottom:1px solid var(--rule)">d\u00b3</a>,
      <a href="https://soundcloud.com/kimiver" target="_blank" rel="noopener" style="border-bottom:1px solid var(--rule)">soundcloud</a>.</p>`;

const textsBody = `
    <h1 class="pt">Texts</h1>
    ${(c.texts.items || []).length
      ? c.texts.items.map(t => `<article class="txt">
      <h2 class="st">${esc(t.title)}</h2>
      <div class="dt">${esc(t.meta || '')}</div>
      ${(t.body || []).map(b => `<p class="tx">${esc(b)}</p>`).join('\n      ')}
    </article>`).join('\n    ')
      : `<p class="tx" style="max-width:56ch;margin-top:18px;color:var(--ink-3)">\u2014</p>`}`;

const contactBody = `
    <h1 class="pt">Contact</h1>
    <div class="contact" style="margin-top:20px">
      <div class="row"><span class="k">email</span><span><a href="mailto:${c.contact.email}">${c.contact.email}</a></span></div>
      ${c.contact.links.map(l => `<div class="row"><span class="k">${esc(l.label.toLowerCase())}</span><span><a href="${l.href}" target="_blank" rel="noopener">${esc(l.href.replace(/^https?:\/\//, ''))}</a></span></div>`).join('\n      ')}
    </div>`;

const pages = [
  ['index.html', shell('index', 'index.html', home)],
  ['works.html', shell('works', 'works.html', worksBody)],
  ['residency-archive.html', shell('residency archive', 'residency-archive.html', photoBody)],
  ['paintings.html', shell('paintings', 'paintings.html', paintBody)],
  ['drawings.html', shell('drawings', 'drawings.html', drawBody)],
  ['discography.html', shell('discography', 'discography.html', discoBody)],
  ['texts.html', shell('texts', 'texts.html', textsBody)],
  ['about.html', shell('about', 'about.html', aboutBody)],
  ['contact.html', shell('contact', 'contact.html', contactBody)]
];

// Custom domain. GitHub Pages serves the site at the domain named in c/CNAME,
// and redirects the github.io address to it — so this must stay empty until the
// domain is registered and its DNS points at GitHub, or the site goes dark.
// To switch over: register the domain, set the DNS records (see README), then
// put 'iverkim.com' here and push.
const CUSTOM_DOMAIN = 'iverkim.com';
if (CUSTOM_DOMAIN) fs.writeFileSync(path.join(OUT, 'CNAME'), CUSTOM_DOMAIN + '\n');

const ASSETS = path.join(__dirname, 'assets');
const IMGOUT = path.join(OUT, 'img');
if (fs.existsSync(ASSETS)) {
  // mirror, don't merge — cpSync alone leaves files behind after a source delete
  fs.rmSync(IMGOUT, { recursive: true, force: true });
  fs.cpSync(ASSETS, IMGOUT, { recursive: true });
}
fs.writeFileSync(path.join(OUT, 'style.css'), CSS);
fs.writeFileSync(path.join(OUT, 'app.js'), JS);
fs.writeFileSync(path.join(OUT, 'viewer.js'), VIEWER_JS);
const emitted = pages.concat(releasePages, yearPages, mediumPages, workPages);
// Remove pages left behind by earlier builds (a work removed from works.js used to
// keep its stale work-*.html around). Scratch pages starting with _ are left alone.
fs.readdirSync(OUT)
  .filter(f => f.endsWith('.html') && !f.startsWith('_') && !emitted.some(([n]) => n === f))
  .forEach(f => fs.unlinkSync(path.join(OUT, f)));
emitted.forEach(([f, html]) => fs.writeFileSync(path.join(OUT, f), html));
console.log('built C:', pages.map(p => p[0]).join(', '));
