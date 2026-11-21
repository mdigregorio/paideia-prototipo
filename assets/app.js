'use strict';
(function () {
  document.querySelectorAll('[data-menu-toggle]').forEach(button=>{
    const nav=document.getElementById(button.getAttribute('aria-controls'));
    if(!nav)return;
    const breakpoint=window.matchMedia('(max-width: 1200px)');
    const header=button.closest('header');
    header.classList.add('has-menu');
    function setOpen(open,focus=false){
      button.setAttribute('aria-expanded',String(open));
      button.querySelector('[data-menu-label]').textContent=open?'Chiudi':'Menu';
      button.setAttribute('aria-label',open?'Chiudi menu di navigazione':'Apri menu di navigazione');
      nav.hidden=breakpoint.matches&&!open;
      if(focus)button.focus();
    }
    function resize(){button.hidden=!breakpoint.matches;setOpen(false);}
    button.addEventListener('click',()=>setOpen(button.getAttribute('aria-expanded')!=='true'));
    nav.addEventListener('click',event=>{if(event.target.closest('a')&&breakpoint.matches)setOpen(false);});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&button.getAttribute('aria-expanded')==='true'){setOpen(false,true);}});
    document.addEventListener('click',event=>{if(breakpoint.matches&&!header.contains(event.target))setOpen(false);});
    breakpoint.addEventListener('change',resize);resize();
  });
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
      if(name==='Alberto Marradi'){
        document.querySelector('#member-articles').innerHTML='<h2>In ricordo di Alberto Marradi</h2><p>Il ricordo del fondatore e presidente onorario di Paideia.</p><p><a href="in-ricordo-di-alberto-marradi.html">Leggi l’articolo commemorativo</a></p><p><a href="giornata-marradi/index.html">Il metodo come arte · giornata di studi</a></p>';
      }
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
