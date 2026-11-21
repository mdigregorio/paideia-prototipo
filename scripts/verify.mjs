import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFile(path.join(root,p),'utf8');
const checks=[];
function check(label,fn){fn();checks.push(label);}
async function walk(dir=''){
 const out=[];
 for(const f of await fs.readdir(path.join(root,dir),{withFileTypes:true})){
  if(['.git','templates','data','assets','scripts'].includes(f.name))continue;
  const p=path.posix.join(dir,f.name);
  if(f.isDirectory())out.push(...await walk(p));else if(p.endsWith('.html'))out.push(p);
 }return out;
}
const files=await walk();
const pages=new Map(await Promise.all(files.map(async p=>[p,await read(p)])));
const ids=new Map([...pages].map(([p,h])=>[p,[...h.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1])]));
const legalRedirects=new Map([
 ['cookie.html','privacy.html#cookie'],
 ['copyright.html','privacy.html#note-legali'],
]);
const footerTemplate=(await read('templates/footer.html')).trimEnd();
let internalLinks=0;
for(const [p,h] of pages){
 const pageIds=ids.get(p);assert.equal(new Set(pageIds).size,pageIds.length,'ID duplicato: '+p);
 assert.equal((h.match(/<h1\b/g)||[]).length,1,'Una sola intestazione principale: '+p);
 if(legalRedirects.has(p)){
  const target=legalRedirects.get(p);
  assert(h.includes(`http-equiv="refresh" content="0; url=${target}"`),'Reindirizzamento legale: '+p);
  assert(h.includes(`href="${target}"`),'Link alternativo: '+p);
 }else{
  assert.equal((h.match(/data-menu-toggle/g)||[]).length,1,'Menu accessibile: '+p);
  const prefix='../'.repeat(p.split('/').length-1);
  const footer=h.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)?.[0];
  assert.equal(footer,footerTemplate.replaceAll('{{root}}',prefix),'Footer comune: '+p);
 }
 assert(!h.includes('school-logo-symbol'),'Segnaposto SE: '+p);
 assert(!h.includes('Programma sul sito attuale'),'Vecchio link programma: '+p);
 assert(!h.includes('Fonte dei dati.'),'Nota fonte nella UI: '+p);
 if(p!=='archivio.html')assert(!/src="[^\"]*catalogo-/.test(h),'Catalogo caricato fuori archivio: '+p);
 for(const m of h.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  const u=m[1].replaceAll('&amp;','&');
  if(/^(https?:|mailto:|tel:|data:)/.test(u))continue;
  assert(!u.startsWith('javascript:'),'Link eseguibile: '+p);
  const url=new URL(u,'https://test.local/'+p);
  const target=decodeURIComponent(url.pathname.slice(1));
  assert(!target.startsWith('../'),'Percorso non valido: '+u);
  await fs.access(path.join(root,target));internalLinks++;
  if(url.hash&&ids.has(target))assert(ids.get(target).includes(decodeURIComponent(url.hash.slice(1))),`Ancora mancante: ${p} -> ${u}`);
 }
}
checks.push(`${files.length-legalRedirects.size} pagine con footer e menu comuni, ${legalRedirects.size} reindirizzamenti, ${internalLinks} link/risorse interni`);
const article=pages.get('in-ricordo-di-alberto-marradi.html');
const exact=(await read('data/ricordo-marradi.txt')).trim().split('\n');
const title=article.match(/data-memorial-title>([\s\S]*?)<\/h1>/)[1].replace(/<br\s*\/?>/g,'\n');
const body=article.match(/data-memorial-text>([\s\S]*?)<\/article>/)[1].replace(/<\/p>\s*<p>/g,'\n').replace(/<\/?p>/g,'').trim();
check('Testo commemorativo e titolo identici al testo ricevuto',()=>assert.equal(title+'\n'+body,exact.join('\n')));
check('Galleria commemorativa senza media inventati',()=>assert(!/<(?:img|video|iframe)\b/.test(article.split('<main')[1].split('</main>')[0])));
const catalog=JSON.parse(await read('data/catalogo-formazione.json'));
check('Catalogo: 60 edizioni e 201 moduli, ID unici e relazioni valide',()=>{
 assert.equal(catalog.scuole.length,60);assert.equal(catalog.moduli.length,201);
 const schools=new Set(catalog.scuole.map(e=>e.id));assert.equal(schools.size,60);
 assert.equal(new Set(catalog.moduli.map(m=>m.id)).size,201);
 assert(catalog.moduli.every(m=>schools.has(m.scuola)));
});
const dataSandbox={window:{}};
vm.runInNewContext(await read('assets/catalogo-edizioni.js'),dataSandbox);
vm.runInNewContext(await read('assets/catalogo-corsi.js'),dataSandbox);
check('Tutti i record originali sono presenti nei dati delle due viste',()=>{
 assert.deepEqual(JSON.parse(JSON.stringify(dataSandbox.window.PAIDEIA_ARCHIVIO_EDIZIONI)).map(e=>e.id),catalog.scuole.map(e=>e.id));
 assert.deepEqual(JSON.parse(JSON.stringify(dataSandbox.window.PAIDEIA_ARCHIVIO_CORSI)).map(e=>e.id),catalog.moduli.map(e=>e.id));
});
const news=JSON.parse(await read('data/news.json'));
for(const n of news){
 assert(pages.get('notizie.html').includes(`href="${n.url}"`),'Notizia mancante: '+n.title);
 assert(pages.get('notizie.html').includes(`datetime="${n.publishedAt}"`),'Data mancante: '+n.title);
 if(n.category==='Newsletter')assert(pages.get('newsletter.html').includes(`href="${n.url}"`),'Newsletter non archiviata');
}
checks.push('Newsletter presenti come articoli, in Notizie e nell’archivio datato');
const newsletter=news.filter(n=>n.category==='Newsletter').sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt))[0];
assert(pages.get('index.html').includes(`data-latest-newsletter href="${newsletter.url}"`));
const pdf=await fs.readFile(path.join(root,'assets/pdf/2026-locandina-scuola-estiva.pdf'));
assert.equal(pdf.subarray(0,5).toString(),'%PDF-');checks.push('PDF 2026 locale valido e collegato');

// Exercise archive behavior without a browser or network. The document double only
// supplies controls; the real scripts perform filtering, loading and rendering.
class Element{
 constructor(value=''){this.value=value;this.listeners={};this.attrs={};this.hidden=false;this.children=[];this.dataset={};this.innerHTML='';this.textContent='';}
 addEventListener(name,fn){this.listeners[name]=fn;}
 setAttribute(k,v){this.attrs[k]=v;}
 getAttribute(k){return this.attrs[k];}
 replaceChildren(...items){this.children=items;this.value=items[0]?.value||'';this.innerHTML='';}
 remove(){}
 click(){this.listeners.click?.({target:this});}
 change(){this.listeners.change?.({target:this});}
}
const archiveCode=await read('assets/archive.js');
const coursesCode=await read('assets/catalogo-corsi.js');
const editionsCode=await read('assets/catalogo-edizioni.js');
const flush=()=>new Promise(resolve=>setImmediate(resolve));
function fixture(search=''){
 const controls=Object.fromEntries(['f-iniziativa','f-secondario','f-secondario-label','archive-results','archive-count','archive-more','archive-retry'].map(id=>[id,new Element()]));
 const buttons=['edizioni','interventi'].map(view=>{const b=new Element();b.dataset.view=view;return b;});
 const archive=new Element();archive.querySelector=s=>controls[s.slice(1)];archive.querySelectorAll=()=>buttons;
 const requests=[];
 const sandbox={window:{},URL,URLSearchParams,Intl,Date,Map,Set,Object,location:{href:'https://example.test/archivio.html'+search,search},history:{replaceState(){}},document:{currentScript:{src:'https://example.test/assets/archive.js'},querySelector:()=>archive,createElement:()=>new Element(),head:{append:s=>requests.push(s)}}};
 vm.createContext(sandbox);vm.runInContext(editionsCode,sandbox);vm.runInContext(archiveCode,sandbox);
 return {controls,buttons,requests,sandbox,load:async()=>{vm.runInContext(coursesCode,sandbox);requests.at(-1).onload();await flush();}};
}
let f=fixture();
check('Vista iniziale: 65 edizioni, prime 24 righe, nessun caricamento corsi',()=>{
 assert(f.controls['archive-count'].textContent.startsWith('65 '));
 assert.equal((f.controls['archive-results'].innerHTML.match(/<article /g)||[]).length,24);
 assert.equal(f.requests.length,0);
});
f.controls['archive-more'].click();assert.equal((f.controls['archive-results'].innerHTML.match(/<article /g)||[]).length,48);
f.controls['f-iniziativa'].value='scuola';f.controls['f-iniziativa'].change();
f.controls['f-secondario'].value='2026';f.controls['f-secondario'].change();
assert(f.controls['archive-count'].textContent.startsWith('1 '));
checks.push('Edizioni: filtri iniziativa+anno e caricamento progressivo');
f.buttons[1].click();assert.equal(f.requests.length,1);await f.load();
f.controls['f-secondario'].value='scuola-2026-tortorella';f.controls['f-secondario'].change();
assert(f.controls['archive-count'].textContent.startsWith('6 '));
assert(f.controls['archive-results'].innerHTML.includes('Comics-Based Research'));
f.controls['f-iniziativa'].value='';f.controls['f-iniziativa'].change();
assert(f.controls['archive-count'].textContent.startsWith('207 '));
f.buttons[0].click();f.buttons[1].click();await flush();assert.equal(f.requests.length,1);
checks.push('Corsi: 201+6 voci, filtri iniziativa+edizione, una sola richiesta differita');
f=fixture('?iniziativa=scuola&anno=2025');assert(f.controls['archive-count'].textContent.startsWith('1 '));
f=fixture('?vista=interventi&iniziativa=scuola&edizione=scuola-2026-tortorella');await f.load();assert(f.controls['archive-count'].textContent.startsWith('6 '));
checks.push('Filtri preselezionati funzionanti nei collegamenti diretti');
f=fixture();f.buttons[1].click();f.buttons[0].click();await f.load();assert(f.controls['archive-count'].textContent.startsWith('65 '));
checks.push('Un caricamento lento non sovrascrive la vista scelta successivamente');
f=fixture();f.buttons[1].click();f.requests[0].onerror();await flush();assert.equal(f.controls['archive-retry'].hidden,false);f.controls['archive-retry'].click();await f.load();assert(f.controls['archive-count'].textContent.startsWith('207 '));
checks.push('Errore di caricamento con recupero tramite Riprova');

const button=new Element();button.attrs['aria-controls']='site-navigation';
const nav=new Element(),label=new Element(),header={classList:{add(){}},contains:t=>t===button||t===nav};
button.querySelector=()=>label;button.closest=()=>header;button.focus=()=>{button.focused=true;};
const media={matches:true,addEventListener(name,fn){this.listener=fn;}};
const events={};
const menuSandbox={window:{matchMedia:()=>media},document:{querySelectorAll:s=>s==='[data-menu-toggle]'?[button]:[],querySelector:()=>null,getElementById:()=>nav,addEventListener:(e,fn)=>{events[e]=fn;}}};
vm.runInNewContext(await read('assets/app.js'),menuSandbox);
assert(nav.hidden);button.click();assert(!nav.hidden);assert.equal(button.getAttribute('aria-expanded'),'true');
events.keydown({key:'Escape'});assert(nav.hidden&&button.focused);
button.click();events.click({target:{}});assert(nav.hidden);
media.matches=false;media.listener();assert(!nav.hidden&&button.hidden);
checks.push('Menu mobile: apertura/chiusura, Escape, clic esterno, passaggio a desktop');

const totals={pages:files.length,internalLinks,editions:catalog.scuole.length,courses:catalog.moduli.length,checks:checks.length};
console.log(JSON.stringify({status:'PASS',...totals,checks},null,2));
