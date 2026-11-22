'use strict';
(() => {
  const root=document.querySelector('[data-archive]');
  if(!root)return;
  const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const labels={scuola:'Scuola Estiva sul Metodo e la Ricerca Sociale',magistri:'Magistri sine registro',teoria:'Scuola Estiva di Teoria e Metodologia Sociologica',invernale:'Scuole invernali di metodologia',meta:'MetA – Formazione metodologica',incontri:'Incontri sul metodo (esempio)',marradi:'Giornata di studi Alberto Marradi'};
  const categories={'Scuola estiva sul metodo e la ricerca sociale':'scuola','Scuola estiva di teoria e metodologia sociologica':'teoria','Scuola invernale di metodologia':'invernale','Scuola invernale di teoria e metodologia sociologica':'invernale','MetA':'meta'};
  const education=(window.PAIDEIA_ARCHIVIO_EDIZIONI||[]).map(e=>({id:e.id,initiative:categories[e.categoria]||'meta',year:String(e.anno),title:[e.categoria,e.edizione?'· '+e.edizione+'ª edizione':'','· '+e.anno,e.argomento?'— '+e.argomento:''].filter(Boolean).join(' '),date:[e.inizio&&e.fine?e.inizio+' – '+e.fine:'',e.luogo].filter(Boolean).join(' · '),place:e.luogo,edition:e.edizione,state:e.stato==='da-controllare'?'Da verificare':'Documentata',documents:e.documenti||[],description:e.argomento,href:e.id==='scuola-2026-tortorella'?'scuola-estiva/edizione-2026.html':null}));
  const extras=[
    {id:'magistri-2026',initiative:'magistri',year:'2026',title:'Magistri sine registro · XI edizione – Il tempo plurale nella società contemporanea',date:'10 e 17 aprile 2026 · Roma',state:'Conclusa',href:'magistri-sine-registro/edizione-2026.html'},
    {id:'magistri-2025',initiative:'magistri',year:'2025',title:'Magistri sine registro · X edizione – A partire da Habermas',date:'7 e 14 marzo 2025 · Roma',state:'Conclusa',href:'magistri-sine-registro/index.html'},
    {id:'incontri-2026',initiative:'incontri',year:'2026',title:'Incontri sul metodo · 2026',date:'14 ottobre 2026 · data dimostrativa',state:'Esempio',href:'incontri-sul-metodo/edizione-2026.html'},
    {id:'incontri-2025',initiative:'incontri',year:'2025',title:'Incontri sul metodo · 2025',date:'2025 · edizione dimostrativa',state:'Esempio',href:'incontri-sul-metodo/index.html'},
    {id:'marradi-2026',initiative:'marradi',year:'2026',title:'Il metodo come arte · In ricordo di Alberto Marradi',date:'12 dicembre 2026 · 10:00–15:00',state:'Programmato',href:'giornata-marradi/index.html'}
  ];
  const editions=[...education,...extras].sort((a,b)=>+b.year-+a.year||a.title.localeCompare(b.title,'it'));
  const byId=new Map(editions.map(e=>[e.id,e]));
  function normalizeSearch(value) {
    return value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('it')
      .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  }
  const editionSearch = new Map(editions.map(edition => [
    edition.id,
    normalizeSearch([edition.title, edition.place, labels[edition.initiative]].filter(Boolean).join(' '))
  ]));
  const coursesByEdition = new Map();
  const extraCourses=[
    {initiative:'magistri',edition:'magistri-2026',title:'Tempo e identità',people:'Luigi Cimmino',year:'2026'},
    {initiative:'magistri',edition:'magistri-2026',title:'Tempi e genere',people:'Giuseppina Cersosimo',year:'2026'},
    {initiative:'incontri',edition:'incontri-2026',title:'Le categorie nella ricerca sociale',people:'Relatrice fittizia',year:'2026'},
    {initiative:'incontri',edition:'incontri-2026',title:'Interpretazione e comparazione',people:'Relatore fittizio',year:'2026'},
    {initiative:'incontri',edition:'incontri-2026',title:'Tecniche e scelte metodologiche',people:'Relatrice fittizia',year:'2026'},
    {initiative:'marradi',edition:'marradi-2026',title:'Relazioni della giornata di studi',people:'Programma e relatori da definire',year:'2026'}
  ];
  const buttons=[...root.querySelectorAll('[data-view]')],initiative=root.querySelector('#f-iniziativa'),secondary=root.querySelector('#f-secondario'),secondaryLabel=root.querySelector('#f-secondario-label'),results=root.querySelector('#archive-results'),count=root.querySelector('#archive-count'),more=root.querySelector('#archive-more'),retry=root.querySelector('#archive-retry');
  const search = root.querySelector('#f-ricerca');
  const clearSearch = root.querySelector('#archive-search-clear');
  const params=new URLSearchParams(location.search);
  let mode=params.get('vista')==='interventi'?'interventi':'edizioni';
  let limit=24,activities=null,loading=null,generation=0;
  if(Object.hasOwn(labels,params.get('iniziativa')))initiative.value=params.get('iniziativa');
  search.value = params.get('q') || '';
  const courseUrl=new URL('catalogo-corsi.js',document.currentScript.src).href;
  function loadCourses(){
    if(activities)return Promise.resolve(activities);
    if(loading)return loading;
    loading=new Promise((resolve,reject)=>{
      const script=document.createElement('script');script.src=courseUrl;script.async=true;
      script.onload=()=>{
        if(!Array.isArray(window.PAIDEIA_ARCHIVIO_CORSI)){loading=null;script.remove();reject(Error('Catalogo non disponibile'));return;}
        activities=window.PAIDEIA_ARCHIVIO_CORSI.map(m=>({id:m.id,initiative:byId.get(m.scuola)?.initiative||'meta',edition:m.scuola,title:m.titolo||'Titolo non disponibile',people:(m.docenti||[]).map(p=>[p.nome,p.cognome].filter(Boolean).join(' ')).join('; ')||'Docenza non specificata',year:String(m.anno),option:m.opzione,starts:m.inizio,ends:m.fine,state:m.stato==='da-controllare'?'Da verificare':'Documentato'})).concat(extraCourses).sort((a,b)=>+b.year-+a.year||a.title.localeCompare(b.title,'it'));
        for (const course of activities) {
          const context = editionSearch.get(course.edition) || '';
          course.searchText = context + ' ' + normalizeSearch(course.title + ' ' + course.people);
          if (!coursesByEdition.has(course.edition)) coursesByEdition.set(course.edition, []);
          coursesByEdition.get(course.edition).push(course);
        }
        resolve(activities);
      };
      script.onerror=()=>{loading=null;script.remove();reject(Error('Caricamento non riuscito'));};
      document.head.append(script);
    });
    return loading;
  }
  function resetSecondary(initial=false){
    const selected=editions.filter(e=>!initiative.value||e.initiative===initiative.value);
    secondaryLabel.textContent=mode==='edizioni'?'Anno':'Edizione';
    const options=mode==='edizioni'?[['','Tutti gli anni'],...[...new Set(selected.map(e=>e.year))].sort((a,b)=>+b-+a).map(y=>[y,y])]:[['','Tutte le edizioni'],...selected.map(e=>[e.id,e.title])];
    secondary.replaceChildren(...options.map(([value,label])=>{const o=document.createElement('option');o.value=value;o.textContent=label;return o;}));
    const value=initial?params.get(mode==='edizioni'?'anno':'edizione'):'';
    if(options.some(([v])=>v===value))secondary.value=value;
  }
  function syncUrl(){
    const url=new URL(location.href);
    ['vista','iniziativa','anno','edizione','q'].forEach(k=>url.searchParams.delete(k));
    url.searchParams.set('vista',mode);
    if(initiative.value)url.searchParams.set('iniziativa',initiative.value);
    if(secondary.value)url.searchParams.set(mode==='edizioni'?'anno':'edizione',secondary.value);
    if (search.value.trim()) url.searchParams.set('q', search.value.trim());
    try{history.replaceState(null,'',url);}catch{/* Local file preview may restrict history changes. */}
  }
  function documentLink(d){
    if(!d.file)return '';
    const href=d.file==='uploads/formazione/2026-locandina-scuola-estiva.pdf'?'assets/pdf/2026-locandina-scuola-estiva.pdf':'https://raw.githubusercontent.com/mdigregorio/paideiacultura-site/main/'+String(d.file).split('/').map(encodeURIComponent).join('/');
    return `<li><a href="${escape(href)}">${escape(d.titolo||'Documento storico')}</a></li>`;
  }
  const formatDate=value=>value?new Intl.DateTimeFormat('it-IT',{day:'numeric',month:'long',year:'numeric'}).format(new Date(value+'T12:00:00')):'';
  function matchingCoursesNotice(edition, courses, query) {
    const params = new URLSearchParams({
      vista: 'interventi', iniziativa: edition.initiative, edizione: edition.id, q: query
    });
    const examples = courses.slice(0, 2).map(course =>
      '<li>' + escape(course.title) + ' · ' + escape(course.people) + '</li>'
    ).join('');
    return '<div class="archive-match small"><p><strong>Risultati nei corsi e interventi</strong></p>' +
      '<ul>' + examples + '</ul><a href="?' + escape(params.toString()) +
      '">Vedi i risultati in Corsi e interventi (' + courses.length + ')</a></div>';
  }
  async function render(){
    const current=++generation;
    const query = search.value.trim();
    const terms = normalizeSearch(query).split(' ').filter(Boolean);
    const isEdition = mode === 'edizioni';
    buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===mode)));
    clearSearch.hidden = !search.value;
    retry.hidden=true;more.hidden=true;root.setAttribute('aria-busy','true');syncUrl();
    if ((!isEdition || terms.length > 0) && !activities) {
      count.textContent = isEdition ? 'Ricerca nell’archivio…' : 'Caricamento dei corsi e degli interventi…';
      results.replaceChildren();
      try{await loadCourses();}catch{
        if(current!==generation)return;
        count.textContent = isEdition
          ? 'Non è stato possibile completare la ricerca. Puoi riprovare o cancellare la ricerca.'
          : 'Non è stato possibile caricare i corsi. Puoi riprovare o consultare le edizioni.';
        retry.hidden=false;root.setAttribute('aria-busy','false');return;
      }
    }
    if(current!==generation)return;
    const matchingCoursesByEdition = new Map();
    const matches = text => terms.every(term => text.includes(term));
    const collection = (isEdition ? editions : activities).filter(record => {
      if (initiative.value && record.initiative !== initiative.value) return false;
      const secondaryValue = isEdition ? record.year : record.edition;
      if (secondary.value && secondaryValue !== secondary.value) return false;
      if (!terms.length) return true;
      if (!isEdition) return matches(record.searchText);
      if (matches(editionSearch.get(record.id))) return true;
      const courses = (coursesByEdition.get(record.id) || []).filter(course => matches(course.searchText));
      if (!courses.length) return false;
      matchingCoursesByEdition.set(record.id, courses);
      return true;
    });
    count.textContent=`${collection.length} ${isEdition?'edizioni':'corsi/interventi'} nella selezione`;
    results.innerHTML=collection.length?collection.slice(0,limit).map(r=>{
      const ed=isEdition?r:byId.get(r.edition);
      const matchingCourses = isEdition ? matchingCoursesByEdition.get(r.id) : null;
      const matchNotice = matchingCourses ? matchingCoursesNotice(r, matchingCourses, query) : '';
      const context=labels[r.initiative]+' · '+r.year+(isEdition?' · '+r.state:'');
      const details=isEdition?[r.description,r.edition?'Numero dell’edizione: '+r.edition:'',r.place?'Sede: '+r.place:''].filter(Boolean).map(t=>`<p>${escape(t)}</p>`).join('')+((r.documents||[]).length?'<h4>Documenti originali</h4><ul>'+r.documents.map(documentLink).join('')+'</ul>':''):[r.option?'Opzione '+r.option:'',r.starts?'Dal '+formatDate(r.starts)+(r.ends?' al '+formatDate(r.ends):''):'',ed?'Edizione: '+ed.title:'',r.state].filter(Boolean).map(t=>`<p>${escape(t)}</p>`).join('');
      return `<article class="result"><div class="result-top"><div><p class="small muted">${escape(context)}</p><h3>${escape(r.title)}</h3><p class="meta">${escape(isEdition?r.date:r.people)}</p></div><span class="small muted">${isEdition?'Edizione':'Corso / intervento'}</span></div>${matchNotice}<details class="archive-details"><summary>Informazioni e documenti</summary><div class="archive-details-content">${details}${ed?.href?`<p><a href="${escape(ed.href)}">Consulta l’edizione</a></p>`:''}</div></details></article>`;
    }).join(''):terms.length
      ? '<p class="no-results">Nessun risultato per la ricerca con questi filtri. Prova un altro termine o cambia i filtri.</p>'
      : '<p class="no-results">Nessun risultato con questi filtri. Seleziona un’altra iniziativa o un’altra edizione.</p>';
    more.hidden=limit>=collection.length;more.textContent=`Mostra altre voci (${Math.max(0,collection.length-limit)} rimanenti)`;
    root.setAttribute('aria-busy','false');
  }
  buttons.forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.view;limit=24;resetSecondary();render();}));
  initiative.addEventListener('change',()=>{limit=24;resetSecondary();render();});
  secondary.addEventListener('change',()=>{limit=24;render();});
  search.addEventListener('input', () => {
    limit = 24;
    render();
  });
  clearSearch.addEventListener('click', () => {
    search.value = '';
    search.focus();
    limit = 24;
    render();
  });
  more.addEventListener('click',()=>{limit+=24;render();});retry.addEventListener('click',render);
  resetSecondary(true);render();
})();
