import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFile(path.join(root,p),'utf8');
const write=(p,s)=>fs.writeFile(path.join(root,p),s);
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const date=s=>new Intl.DateTimeFormat('it-IT',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(s+'T12:00:00Z'));
const footer=(await read('templates/footer.html')).trimEnd();
const mainNav=await read('templates/nav-main.html');
const schoolNav=await read('templates/nav-school.html');
const news=JSON.parse(await read('data/news.json')).sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
const newsletters=news.filter(n=>n.category==='Newsletter');
const partners=JSON.parse(await read('data/partners.json'));
const catalog=JSON.parse(await read('data/catalogo-formazione.json'));
if(catalog.scuole.length!==60 || catalog.moduli.length!==201)throw Error('Il catalogo deve conservare 60 edizioni e 201 moduli.');
const schools=new Set(catalog.scuole.map(s=>s.id));
if(catalog.moduli.some(m=>!schools.has(m.scuola)))throw Error('Modulo senza edizione.');
// Runtime assets contain only the fields used by the archive. The JSON remains intact.
const editions=catalog.scuole.map(({id,anno,luogo,categoria,edizione,argomento,stato,inizio,fine,documenti})=>({id,anno,luogo,categoria,edizione,argomento,stato,inizio,fine,documenti}));
const courses=catalog.moduli.map(({id,scuola,anno,titolo,opzione,docenti,inizio,fine,stato})=>({id,scuola,anno,titolo,opzione,docenti,inizio,fine,stato}));
await write('assets/catalogo-edizioni.js',`'use strict';\nwindow.PAIDEIA_ARCHIVIO_EDIZIONI=${JSON.stringify(editions)};\n`);
await write('assets/catalogo-corsi.js',`'use strict';\nwindow.PAIDEIA_ARCHIVIO_CORSI=${JSON.stringify(courses)};\n`);
function newsRows(items){return items.map(n=>`<article class="news-row"><div class="date"><time datetime="${n.publishedAt}">${date(n.publishedAt)}</time>${n.demo?'<br><span class="demo-tag">Data e contenuto demo</span>':''}</div><div class="news-copy"><p class="eyebrow">${escape(n.category)}</p><h3><a href="${escape(n.url)}">${escape(n.title)}</a></h3><p>${escape(n.excerpt)}</p></div></article>`).join('\n');}
function partnerSection(area,prefix){
 const list=partners[area]||[];
 const slots=list.length?list.map(p=>{
  if(!/^https:\/\//.test(p.url)||!p.logo)throw Error('Partner senza link verificato o logo: '+p.name);
  return `<a class="partner-logo" href="${escape(p.url)}"><img src="${prefix}${escape(p.logo)}" alt="${escape(p.name)}" loading="lazy" decoding="async"></a>`;
 }).join(''):'<div class="partner-slot">Logo partner<br><span>In attesa dei materiali</span></div><div class="partner-slot">Logo partner<br><span>In attesa dei materiali</span></div>';
 return `<section class="section partners" data-partners><div class="container"><h2>Partner${area==='incontri'?' · spazi dimostrativi':''}</h2>${list.length?'':'<p>Loghi e collegamenti saranno pubblicati dopo la conferma dei partner.</p>'}<div class="partner-grid">${slots}</div></div></section>`;
}
async function walk(dir=''){
 const out=[];
 for(const f of await fs.readdir(path.join(root,dir),{withFileTypes:true})){
  if(['.git','templates','data','assets','scripts'].includes(f.name))continue;
  const p=path.posix.join(dir,f.name);
  if(f.isDirectory())out.push(...await walk(p));else if(p.endsWith('.html'))out.push(p);
 }
 return out;
}
const files=await walk();
for(const p of files){
 let h=await read(p);
 const prefix='../'.repeat(p.split('/').length-1);
 const area=h.match(/<body[^>]*data-area="([^"]+)"/)?.[1];
 h=h.replace(/<footer class="site-footer">[\s\S]*?<\/footer>/,footer.replaceAll('{{root}}',prefix));
 if(!area)h=h.replace(/<nav[^>]*class="primary-nav"[^>]*>[\s\S]*?<\/nav>/,mainNav.replaceAll('{{root}}',prefix));
 if(area==='scuola'){
  h=h.replace(/<nav[^>]*class="primary-nav microsite-nav"[^>]*>[\s\S]*?<\/nav>/,schoolNav);
  h=h.replace(/<span class="initiative-emblem official-school-mark"[^>]*>[\s\S]*?<\/small><\/span>/,'<img class="school-logo" src="../assets/img/logo-scuola.jpg" width="361" height="125" alt="Scuola Estiva sul Metodo e la Ricerca Sociale">');
  h=h.replace(/(<a class="initiative-brand"[^>]*>)[\s\S]*?(<\/a>)/,'$1<img class="school-logo" src="../assets/img/logo-scuola.jpg" width="361" height="125" alt="Scuola Estiva sul Metodo e la Ricerca Sociale">$2');
 }
 h=h.replace(/<button[^>]*data-menu-toggle[\s\S]*?<\/button>/g,'');
 h=h.replace(/<nav([^>]*class="primary-nav[^"]*"[^>]*)>([\s\S]*?)<\/nav>/,(whole,attrs,links)=>{
  const id=area?'initiative-navigation':'site-navigation';
  const current=links.replace(/ aria-current="page"/g,'').replace(/<a\b([^>]*href="([^"]+)"[^>]*)>/g,(tag,a,u)=>{
   const target=path.posix.normalize(path.posix.join(path.posix.dirname(p),u.split('?')[0]));
   return '<a'+a+(target===p?' aria-current="page"':'')+'>';
  });
  return `<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="${id}" data-menu-toggle hidden><span class="hamburger" aria-hidden="true">☰</span><span data-menu-label>Menu</span></button><nav${attrs.replace(/ id="[^"]+"/g,'')} id="${id}">${current}</nav>`;
 });
 h=h.replace(/<div data-news-list(?: data-limit="(\d+)")?>[\s\S]*?<\/div>(?=<\/div>|\s*<\/div>)/g,(m,limit)=>`<div data-news-list${limit?` data-limit="${limit}"`:''}>${newsRows(limit?news.slice(0,+limit):news)}</div>`);
 // On subsequent builds, the list contains nested divs; use stable delimiters.
 h=h.replace(/<!-- NEWS:START -->[\s\S]*?<!-- NEWS:END -->/g,()=>`<!-- NEWS:START -->${newsRows(p==='index.html'?news.slice(0,3):news)}<!-- NEWS:END -->`);
 h=h.replace(/<div data-news-list(?: data-limit="\d+")?>([\s\S]*?)<\/div>(?=<\/div><\/section>)/g,(m,contents)=>`<!-- NEWS:START -->${newsRows(p==='index.html'?news.slice(0,3):news)}<!-- NEWS:END -->`);
 h=h.replace(/<div data-newsletter-archive>[\s\S]*?<\/div>/,`<div data-newsletter-archive><ol class="newsletter-archive">${newsletters.map(n=>`<li><time datetime="${n.publishedAt}">${date(n.publishedAt)}</time><a href="${n.url}">${escape(n.title)}</a><span class="demo-tag">Demo</span></li>`).join('')}</ol></div>`);
 h=h.replace(/(<a\b[^>]*data-latest-newsletter[^>]*href=")[^"]+/,`$1${newsletters[0].url}`);
 h=h.replace(/https:\/\/www\.paideiascuoleestive\.it\/(staff|scuola|borghi|esperienze|corsi)(?=["#< ])/g,'https://www.paideiascuoleestive.it/$1.html');
 h=h.replace(/<section class="section partners" data-partners>[\s\S]*?<\/section>/g,'');
 if(area&&(p.endsWith('/index.html')||p.includes('/edizione-')))h=h.replace('</main>',partnerSection(area,prefix)+'</main>');
 // Decorative arrows do not add meaning to links.
 h=h.replace(/(<a\b[^>]*>)([^<]*?)[ \u00a0]*[→↗](<\/a>)/g,'$1$2$3');
 if(p==='scuola-estiva/regolamento.html'||p==='scuola-estiva/contatti.html'){
  const label=p.includes('regolamento')?'Regolamento':'Contatti';
  h=h.replace(/(<nav class="breadcrumbs microsite-crumbs"[^>]*>)([\s\S]*?)(<\/nav>)/,(m,start,content,end)=>start+content.replace(/(?: \/ (?:Regolamento|Contatti))+$/,'')+' / '+label+end);
 }
 await write(p,h);
}
console.log(`Aggiornate ${files.length} pagine; archivio 60/201; ${news.length} notizie, ${newsletters.length} newsletter.`);
