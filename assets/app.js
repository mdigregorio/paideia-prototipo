'use strict';
(function () {
  const archiveRoot = document.querySelector('[data-archive]');
  const source=window.PAIDEIA_ARCHIVIO_FORMAZIONE || {scuole:[],moduli:[]};
  const catToId={
    'Scuola estiva sul metodo e la ricerca sociale':'scuola',
    'Scuola estiva di teoria e metodologia sociologica':'teoria',
    'Scuola invernale di metodologia':'invernale',
    'Scuola invernale di teoria e metodologia sociologica':'invernale',
    'MetA':'meta'
  };
  const labels={
    scuola:'Scuola Estiva sul Metodo e la Ricerca Sociale',
    magistri:'Magistri sine registro',
    teoria:'Scuola Estiva di Teoria e Metodologia Sociologica',
    invernale:'Scuole invernali di metodologia',
    meta:'MetA – Formazione metodologica',
    incontri:'Incontri sul metodo (esempio)',
    marradi:'Giornata di studi Alberto Marradi'
  };
  const education=source.scuole.map(x=>({
    id:x.id, initiative:catToId[x.categoria]||'meta',
    year:String(x.anno),title:[x.categoria, x.edizione?'· '+x.edizione+'ª edizione':'', '· '+x.anno, x.argomento?'— '+x.argomento:''].filter(Boolean).join(' ').replace(/ +/g,' '),
    date:[x.inizio&&x.fine?(x.inizio+' – '+x.fine):'',x.luogo].filter(Boolean).join(' · ') || String(x.anno),
    place:x.luogo||'',category:x.categoria,edition:x.edizione,
    state:x.stato==='da-controllare'?'Da verificare':'Documentata',
    documents:x.documenti||[],description:x.argomento||'',href:x.id==='scuola-2026-tortorella'?'scuola-estiva/edizione-2026.html':null
  }));
  const extraEditions=[
    {id:'magistri-2026',initiative:'magistri',year:'2026',title:'Magistri sine registro · XI edizione – Il tempo plurale nella società contemporanea',date:'10 e 17 aprile 2026 · Roma',state:'Conclusa',href:'magistri-sine-registro/edizione-2026.html',description:'Seminari di ermeneutica promossi da Paideia e Sapienza Università di Roma.'},
    {id:'magistri-2025',initiative:'magistri',year:'2025',title:'Magistri sine registro · X edizione – A partire da Habermas',date:'7 e 14 marzo 2025 · Roma',state:'Conclusa',href:'magistri-sine-registro/index.html',description:'Edizione storica dei seminari di ermeneutica.'},
    {id:'incontri-2026',initiative:'incontri',year:'2026',title:'Incontri sul metodo · 2026',date:'14 ottobre 2026 · data dimostrativa',state:'Esempio',href:'incontri-sul-metodo/edizione-2026.html',description:'Convegno di una giornata con tre relazioni. Iniziativa fittizia.'},
    {id:'incontri-2025',initiative:'incontri',year:'2025',title:'Incontri sul metodo · 2025',date:'2025 · edizione dimostrativa',state:'Esempio',href:'incontri-sul-metodo/index.html',description:'Edizione dimostrativa.'},
    {id:'marradi-2026',initiative:'marradi',year:'2026',title:'Il metodo come arte · In ricordo di Alberto Marradi',date:'12 dicembre 2026 · 10:00–15:00',state:'Programmato',href:'giornata-marradi/index.html',description:'Giornata di studi senza serie di edizioni.'}
  ];
  const editions=[...education,...extraEditions].sort((a,b)=>Number(b.year)-Number(a.year)||a.title.localeCompare(b.title,'it'));
  const activities=source.moduli.map(m=>({
    id:m.id, initiative:(education.find(e=>e.id===m.scuola)||{}).initiative||'meta', edition:m.scuola,
    title:m.titolo,people:(m.docenti||[]).map(p=>[p.nome,p.cognome].filter(Boolean).join(' ')).join('; ')||'Docenza non specificata',
    year:String(m.anno),option:m.opzione,starts:m.inizio,ends:m.fine,
    state:m.stato==='da-controllare'?'Da verificare':'Documentato',
    href:m.scuola==='scuola-2026-tortorella'?'scuola-estiva/edizione-2026.html':null
  })).concat([
    {initiative:'magistri',edition:'magistri-2026',title:'Tempo e identità',people:'Luigi Cimmino',year:'2026',href:'magistri-sine-registro/edizione-2026.html'},
    {initiative:'magistri',edition:'magistri-2026',title:'Tempi e genere',people:'Giuseppina Cersosimo',year:'2026',href:'magistri-sine-registro/edizione-2026.html'},
    {initiative:'incontri',edition:'incontri-2026',title:'Le categorie nella ricerca sociale',people:'Relatrice fittizia',year:'2026',href:'incontri-sul-metodo/edizione-2026.html'},
    {initiative:'incontri',edition:'incontri-2026',title:'Interpretazione e comparazione',people:'Relatore fittizio',year:'2026',href:'incontri-sul-metodo/edizione-2026.html'},
    {initiative:'incontri',edition:'incontri-2026',title:'Tecniche e scelte metodologiche',people:'Relatrice fittizia',year:'2026',href:'incontri-sul-metodo/edizione-2026.html'},
    {initiative:'marradi',edition:'marradi-2026',title:'Relazioni della giornata di studi',people:'Programma e relatori da definire',year:'2026',href:'giornata-marradi/index.html'}
  ]).sort((a,b)=>Number(b.year)-Number(a.year)||a.title.localeCompare(b.title,'it'));
  const escape = s => String(s).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  if(archiveRoot){
    const params = new URLSearchParams(location.search);
    const modeButtons = [...archiveRoot.querySelectorAll('[data-view]')];
    const initiative = document.querySelector('#f-iniziativa');
    const secondary = document.querySelector('#f-secondario');
    const secondaryLabel = document.querySelector('#f-secondario-label');
    const results = document.querySelector('#archive-results');
    const count = document.querySelector('#archive-count');
    let mode = params.get('vista') === 'interventi' ? 'interventi' : 'edizioni';
    const initial = params.get('iniziativa');
    if(Object.hasOwn(labels,initial)) initiative.value=initial;
    function setOptions(options) {
      secondary.replaceChildren(...options.map(([value,label])=>{const o=document.createElement('option');o.value=value;o.textContent=label;return o;}));
    }
    function resetSecondary(){
      if(mode==='edizioni'){
        secondaryLabel.textContent='Anno';
        setOptions([['','Tutti gli anni'],...[...new Set(editions.map(e=>e.year))].sort((a,b)=>b.localeCompare(a)).map(y=>[y,y])]);
      } else {
        secondaryLabel.textContent='Edizione';
        let es=editions.filter(e=>!initiative.value||initiative.value===e.initiative);
        setOptions([['','Tutte le edizioni'],...es.map(e=>[e.id,e.title])]);
      }
    }
    let visibleLimit=24;
    const moreButton=document.querySelector('#archive-more');
    const dateFmt=value=>{
      if(!value)return '';
      const d=new Date(value+'T12:00:00');
      return Number.isNaN(d.getTime())?value:new Intl.DateTimeFormat('it-IT',{day:'numeric',month:'long',year:'numeric'}).format(d);
    };
    function render(){
      modeButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===mode)));
      const iv=initiative.value,sv=secondary.value;
      const collection=mode==='edizioni'
        ? editions.filter(e=>(!iv||e.initiative===iv)&&(!sv||e.year===sv))
        : activities.filter(a=>(!iv||a.initiative===iv)&&(!sv||a.edition===sv));
      count.textContent=collection.length+' '+(mode==='edizioni'?'edizioni':'corsi/interventi')+' nella selezione';
      const shown=collection.slice(0,visibleLimit);
      const docs=e=>(e.documents||[]).map(d=>{
        const target='https://github.com/mdigregorio/paideiacultura-site/blob/main/'+String(d.file||'').split('/').map(encodeURIComponent).join('/');
        return '<li><a target="_blank" rel="noopener noreferrer" href="'+escape(target)+'">'+escape(d.titolo||'Documento storico')+' ↗</a></li>';
      }).join('');
      results.innerHTML=shown.length ? shown.map(r=>{
        const isEdition=mode==='edizioni';
        const ed=isEdition?r:editions.find(e=>e.id===r.edition);
        const context=isEdition?labels[r.initiative]+' · '+r.year+' · '+r.state:labels[r.initiative]+' · '+(ed?ed.title:r.year);
        const detail=isEdition?r.date:r.people;
        const meta=isEdition?
          [r.description,r.edition?'Numero dell’edizione: '+r.edition:null,r.place?'Sede: '+r.place:null].filter(Boolean).map(x=>'<p>'+escape(x)+'</p>').join('')+
          ((r.documents||[]).length?'<p><strong>Documenti originali</strong></p><ul>'+docs(r)+'</ul>':'')+
          (r.href?'<p><a href="'+escape(r.href)+'">Visita la pagina dell’edizione →</a></p>':'') :
          [r.option?'Opzione '+r.option:null,r.starts?'Dal '+dateFmt(r.starts)+(r.ends?' al '+dateFmt(r.ends):''):null,ed?'Edizione di riferimento: '+ed.title:null,r.state].filter(Boolean).map(x=>'<p>'+escape(x)+'</p>').join('')+
          (ed?.href?'<p><a href="'+escape(ed.href)+'">Consulta l’iniziativa →</a></p>':'');
        return '<article class="result"><div class="result-top"><div><span class="small muted">'+escape(context)+'</span><h3>'+escape(r.title)+'</h3><p class="meta">'+escape(detail)+'</p></div><span class="small muted">'+(isEdition?'Edizione':'Corso / intervento')+'</span></div><details class="archive-details"><summary>Informazioni e documenti</summary><div class="archive-details-content">'+meta+'</div></details></article>';
      }).join(''):'<p class="no-results">Nessun risultato con questi filtri. Prova a selezionare un’altra iniziativa o un’altra edizione.</p>';
      if(moreButton){moreButton.hidden=visibleLimit>=collection.length;moreButton.textContent='Mostra altre voci ('+(collection.length-shown.length)+' rimanenti)';}
    }
    const refresh=()=>{visibleLimit=24;resetSecondary();render();};
    moreButton?.addEventListener('click',()=>{visibleLimit+=24;render();});
    modeButtons.forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.view;refresh();}));
    initiative.addEventListener('change',refresh);
    secondary.addEventListener('change',render);
    resetSecondary();render();
  }
  const loginForm=document.querySelector('#demo-login');
  if(loginForm){
    loginForm.addEventListener('submit',e=>{
      e.preventDefault();
      const user=document.querySelector('#demo-user').value.trim();
      const password=document.querySelector('#demo-password').value;
      const msg=document.querySelector('#login-feedback');
      if(user==='demo@paideia.test'&&password==='prototipo'){
        document.querySelector('#login-panel').classList.add('hidden');
        document.querySelector('#demo-dashboard').classList.add('active');
        document.querySelector('#demo-dashboard').focus();
      }else{msg.textContent='Credenziali di esempio non corrette: demo@paideia.test / prototipo';msg.className='ui-feedback error';}
    });
    document.querySelector('#demo-logout').addEventListener('click',()=>{
      document.querySelector('#login-panel').classList.remove('hidden');
      document.querySelector('#demo-dashboard').classList.remove('active');
      loginForm.reset();
    });
    document.querySelector('#demo-questionnaire')?.addEventListener('submit',e=>{
      e.preventDefault();const el=document.querySelector('#questionnaire-feedback');el.textContent='Risposta registrata soltanto nell’interfaccia dimostrativa: nessun dato è stato inviato o salvato.';el.hidden=false;
    });
  }
  document.querySelectorAll('[data-demo-newsletter]').forEach(f=>f.addEventListener('submit',e=>{
    e.preventDefault();const el=f.querySelector('[data-feedback]');el.textContent='Iscrizione simulata: nessun indirizzo viene trasmesso o memorizzato.';el.hidden=false;f.reset();
  }));
  document.querySelectorAll('[data-demo-enrol]').forEach(f=>f.addEventListener('submit',e=>{
    e.preventDefault();const el=f.querySelector('[data-feedback]');el.textContent='Richiesta simulata: iscrizioni e pagamenti non vengono effettuati.';el.hidden=false;
  }));

  // Filtro essenziale dell'elenco dei soci (nessuna richiesta al server).
  const memberFilter=document.querySelector('#member-filter');
  if(memberFilter){
    const entries=[...document.querySelectorAll('[data-member]')];
    memberFilter.addEventListener('input',()=>{
      const q=memberFilter.value.trim().toLocaleLowerCase('it');let found=0;
      entries.forEach(e=>{const hit=e.dataset.member.includes(q);e.hidden=!hit;if(hit)found++;});
      document.querySelector('#member-count').textContent=`${found} persone nell’elenco`;
    });
  }
  // Profilo di una persona associata: dati pubblici provenienti dall'elenco istituzionale.
  const nameTarget=document.querySelector('#member-name');
  if(nameTarget){
    const name=new URLSearchParams(location.search).get('nome') || '';
    const data=window.PAIDEIA_MEMBERS || {};
    const m=data[name];
    if(m){
      nameTarget.textContent=name+(m.deceased?' †':'');
      document.title=name+' · Soci Paideia';
      document.querySelector('#member-role').textContent=m.role||'Socio/a Paideia';
      if(m.info)document.querySelector('#member-info').textContent=m.info;
      const ext=document.querySelector('#member-ext');
      if(m.url){ext.href=m.url;ext.hidden=false;ext.target='_blank';ext.rel='noopener noreferrer';}
    }else{document.querySelector('#member-info').textContent='Il profilo richiesto non è presente nell’elenco del prototipo.';}
  }
  // Slideshow dell'area Scuola, attivabile dall'utente; nessun timer al caricamento.
  document.querySelectorAll('[data-slideshow]').forEach(slider=>{
    const slides=[...slider.querySelectorAll('.slide')];if(!slides.length)return;
    const status=slider.querySelector('[data-slide-status]');
    const toggle=slider.querySelector('[data-slide-toggle]');
    let index=0,timer=null;
    const show=next=>{
      index=(next+slides.length)%slides.length;
      slides.forEach((el,i)=>{el.classList.toggle('active',i===index);el.hidden=i!==index;});
      status.textContent=`${index+1} / ${slides.length}`;
    };
    const stop=()=>{if(timer){clearInterval(timer);timer=null;}toggle.textContent='Avvia';toggle.setAttribute('aria-pressed','false');};
    slider.querySelector('[data-slide-prev]')?.addEventListener('click',()=>show(index-1));
    slider.querySelector('[data-slide-next]')?.addEventListener('click',()=>show(index+1));
    toggle?.addEventListener('click',()=>{
      if(timer){stop();return;}
      if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
      timer=setInterval(()=>show(index+1),6500);
      toggle.textContent='Pausa';toggle.setAttribute('aria-pressed','true');
    });
    show(0);
  });
})();
