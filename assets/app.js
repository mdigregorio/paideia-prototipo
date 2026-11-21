'use strict';
(function () {
  const archiveRoot = document.querySelector('[data-archive]');
  const editions = [
    {id:'scuola-2026',initiative:'scuola',year:'2026',title:'Scuola Estiva sul Metodo e la Ricerca Sociale · 2026',date:'24 agosto – 4 settembre 2026',state:'conclusa',href:'scuola-estiva/edizione-2026.html',description:'Due settimane di formazione nel borgo di Tortorella, con corsi a scelta.'},
    {id:'scuola-2025',initiative:'scuola',year:'2025',title:'Scuola Estiva · 2025',date:'2025',state:'conclusa',href:'scuola-estiva/index.html',description:'Voce esemplificativa per illustrare lo storico delle edizioni.'},
    {id:'incontri-2026',initiative:'incontri',year:'2026',title:'Incontri sul metodo · 2026',date:'14 ottobre 2026 · data dimostrativa',state:'conclusa',href:'incontri-sul-metodo/edizione-2026.html',description:'Convegno di una giornata con tre relazioni. Iniziativa dimostrativa.'},
    {id:'incontri-2025',initiative:'incontri',year:'2025',title:'Incontri sul metodo · 2025',date:'2025 · edizione dimostrativa',state:'conclusa',href:'incontri-sul-metodo/index.html',description:'Edizione precedente dimostrativa.'},
    {id:'marradi-2026',initiative:'marradi',year:'2026',title:'Il metodo come arte · In ricordo di Alberto Marradi',date:'12 dicembre 2026 · 10:00–15:00',state:'programmata',href:'giornata-marradi/index.html',description:'Giornata di studi, iniziativa autonoma senza serie di edizioni.'}
  ];
  const activities = [
    {initiative:'scuola',edition:'scuola-2026',title:'Analisi del contenuto e Natural Language Processing',people:'Mario Monteleone; Giuseppe Michele Padricelli',href:'scuola-estiva/corso-analisi-contenuto.html',year:'2026'},
    {initiative:'scuola',edition:'scuola-2026',title:'Analisi multivariata dei dati con software statistici',people:'Felice Addeo',href:'scuola-estiva/edizione-2026.html',year:'2026'},
    {initiative:'scuola',edition:'scuola-2026',title:'Metodi di ricerca partecipativa: Focus Group e metodo Delphi',people:'Vincenzo Esposito; Patrizia Medici',href:'scuola-estiva/edizione-2026.html',year:'2026'},
    {initiative:'scuola',edition:'scuola-2026',title:'Comics-Based Research',people:'Veronica Moretti',href:'scuola-estiva/edizione-2026.html',year:'2026'},
    {initiative:'scuola',edition:'scuola-2025',title:'Laboratorio di ricerca sociale',people:'Docenza da definire · voce dimostrativa',href:'scuola-estiva/index.html',year:'2025'},
    {initiative:'incontri',edition:'incontri-2026',title:'Le categorie nella ricerca sociale',people:'Giulia Moretti · persona fittizia',href:'incontri-sul-metodo/edizione-2026.html',year:'2026'},
    {initiative:'incontri',edition:'incontri-2026',title:'Interpretazione e comparazione',people:'Luca Ricci · persona fittizia',href:'incontri-sul-metodo/edizione-2026.html',year:'2026'},
    {initiative:'incontri',edition:'incontri-2026',title:'Tecniche e scelte metodologiche',people:'Elena Serra · persona fittizia',href:'incontri-sul-metodo/edizione-2026.html',year:'2026'},
    {initiative:'incontri',edition:'incontri-2025',title:'Conoscenza e ricerca',people:'Relatrice dimostrativa',href:'incontri-sul-metodo/index.html',year:'2025'},
    {initiative:'marradi',edition:'marradi-2026',title:'Relazioni della giornata di studi',people:'Programma e relatori da definire',href:'giornata-marradi/index.html',year:'2026'}
  ];
  const labels = {'scuola':'Scuola Estiva','incontri':'Incontri sul metodo','marradi':'Giornata Marradi'};
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
    function render(){
      modeButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===mode)));
      const iv=initiative.value,sv=secondary.value;
      const collection = mode==='edizioni' ? editions.filter(e=>(!iv||e.initiative===iv)&&(!sv||e.year===sv)) : activities.filter(a=>(!iv||a.initiative===iv)&&(!sv||a.edition===sv));
      count.textContent=collection.length+' '+(mode==='edizioni'?'edizioni':'corsi/interventi')+' nella selezione';
      results.innerHTML=collection.length ? collection.map(r=>{
        const ed=mode==='edizioni'?r:editions.find(e=>e.id===r.edition);
        const context=mode==='edizioni'?`${labels[r.initiative]} · ${r.year} · ${r.state}`:`${labels[r.initiative]} · ${ed ? ed.title : r.year}`;
        const detail=mode==='edizioni'?`${r.date} · ${r.description}`:r.people;
        return `<article class="result"><div class="result-top"><div><span class="small muted">${escape(context)}</span><h3><a href="${escape(r.href)}">${escape(r.title)}</a></h3><p class="meta">${escape(detail)}</p></div><a class="text-link small" href="${escape(r.href)}">Apri scheda</a></div></article>`;
      }).join(''):'<p class="no-results">Nessun risultato con questi filtri. Prova a selezionare un’altra iniziativa o un’altra edizione.</p>';
    }
    modeButtons.forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.view;resetSecondary();render();}));
    initiative.addEventListener('change',()=>{resetSecondary();render();});
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
})();
