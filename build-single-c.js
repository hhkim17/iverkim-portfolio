const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'c');
// Derived from the build output so removing or adding a page can't break this.
// index first (it is the template and the default route), release-* pages last.
const PAGES = (() => {
  // files beginning with _ are scratch pages (contact sheets etc), not site pages
  const all = fs.readdirSync(dir).filter(f => f.endsWith('.html') && !f.startsWith('_')).map(f => f.replace(/\.html$/, ''));
  const rest = all.filter(n => n !== 'index').sort((a, b) =>
    (a.startsWith('release-') - b.startsWith('release-')) || a.localeCompare(b));
  return ['index', ...rest];
})();
const css = fs.readFileSync(path.join(dir, 'style.css'), 'utf8');
const viewerJs = fs.readFileSync(path.join(dir, 'viewer.js'), 'utf8');
const tpl = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');

const sections = PAGES.map(p => {
  const html = fs.readFileSync(path.join(dir, p + '.html'), 'utf8');
  const m = html.match(/<main class="main">([\s\S]*?)<\/main>/);
  if (!m) throw new Error('no main in ' + p);
  return `<section class="rt-page" id="p-${p}"${p === 'index' ? '' : ' hidden'}>${m[1]}</section>`;
}).join('\n');

let out = tpl.replace(/<main class="main">[\s\S]*?<\/main>/, `<main class="main">\n${sections}\n</main>`);
out = out.replace(/<link rel="stylesheet" href="style\.css">/, `<style>\n${css}\n</style>`);
out = out.replace(/<script src="app\.js"><\/script>/, '');
out = out.replace(/<script src="viewer\.js"><\/script>/, `<script>${viewerJs}</script>`);
out = out.replace(new RegExp(`href="(${PAGES.join('|')})\\.html(#[^"]*)?"`, 'g'), 'href="#$1$2"');
out = out.replace(/ aria-current="page"/g, '');

const router = `
<script>
(function(){
  var pages=${JSON.stringify(PAGES)};
  function parse(){
    var h=(location.hash||'#index').slice(1);
    var i=h.indexOf('#');
    if(i===-1) return {page:pages.indexOf(h)!==-1?h:(h?null:'index'), sub:''};
    return {page:h.slice(0,i), sub:h.slice(i+1)};
  }
  function render(){
    var r=parse(), page=r.page;
    if(pages.indexOf(page)===-1) page='index';
    pages.forEach(function(p){
      var el=document.getElementById('p-'+p);
      if(el) el.hidden=(p!==page);
    });
    document.querySelectorAll('.side nav a').forEach(function(a){
      var t=a.getAttribute('href').replace('#','').split('#')[0];
      if(t===page) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
    });
    document.querySelectorAll('video,audio').forEach(function(m){ if(!m.paused) m.pause(); });
    document.title='Iver Kim — '+page;
    var sub=r.sub;
    if(page==='works'){
      var vm=document.getElementById('view-medium'), vy=document.getElementById('view-year');
      var bm=document.getElementById('bm'), by=document.getElementById('by');
      if(vm&&vy){
        var year = sub.indexOf('y-')===0 || sub==='by-year';
        vm.hidden=year; vy.hidden=!year;
        if(bm) bm.setAttribute('aria-pressed',year?'false':'true');
        if(by) by.setAttribute('aria-pressed',year?'true':'false');
      }
    }
    if(sub){
      var el=document.getElementById(sub);
      if(el){ setTimeout(function(){el.scrollIntoView({block:'start'});},60); return; }
    }
    window.scrollTo(0,0);
  }
  window.addEventListener('hashchange',render);
  document.addEventListener('click',function(e){
    var b=e.target.closest && e.target.closest('#bm,#by');
    if(!b) return;
    location.hash='#works#'+(b.id==='by'?'by-year':'by-medium');
    render();
  });
  render();
})();
</script>`;

out = out.replace('</body>', router + '\n</body>');
fs.writeFileSync(path.join(__dirname, 'iverkim-C-index.html'), out);
console.log('single-file C:', out.length, 'bytes');
