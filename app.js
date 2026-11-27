/* Buildless, offline-first concept. No external requests or personal-data storage. */
const technologies = {
  "solar": {
    "name": "Fotovoltaico",
    "category": "Produzione rinnovabile",
    "title": "Dalla luce,\nnuova energia.",
    "description": "Progettiamo, costruiamo e conduciamo infrastrutture fotovoltaiche, mettendo in relazione produzione elettrica, connessioni e fabbisogni del sito. Il fotovoltaico diventa parte di un sistema che può integrare accumulo e diverse utenze energetiche.",
    "detail": "La progettazione considera le caratteristiche dell’area, l’integrazione impiantistica e le esigenze di esercizio. Configurazione, dimensionamento e modalità di collegamento si definiscono sul singolo progetto.",
    "connection": "Produzione fotovoltaica, accumulo e utilizzi finali: tre elementi da progettare insieme.",
    "cta": "Parliamo di fotovoltaico",
    "interest": "Fotovoltaico",
    "keywords": [
      "progettiamo, costruiamo e conduciamo",
      "produzione elettrica",
      "accumulo",
      "integrazione impiantistica",
      "dimensionamento"
    ]
  },
  "wind": {
    "name": "Eolico",
    "category": "Produzione rinnovabile",
    "title": "Il vento diventa\ninfrastruttura.",
    "description": "L’eolico entra nell’ecosistema E2B come infrastruttura di produzione da connettere al contesto energetico del progetto. Progettazione, costruzione e conduzione tengono insieme impianto, collegamenti elettrici e relazione con gli altri elementi del sistema.",
    "detail": "Le scelte tecniche partono dalle caratteristiche del sito e dalle esigenze di utilizzo dell’energia. L’integrazione con rete e accumulo si valuta in funzione della configurazione prevista.",
    "connection": "Produzione eolica, connessioni elettriche e accumulo, secondo le esigenze del progetto.",
    "cta": "Parliamo di eolico",
    "interest": "Eolico",
    "keywords": [
      "produzione",
      "progettazione, costruzione e conduzione",
      "collegamenti elettrici",
      "rete e accumulo",
      "caratteristiche del sito"
    ]
  },
  "bess": {
    "name": "BESS",
    "category": "Accumulo energetico",
    "title": "L’energia trova\nil suo tempo.",
    "description": "I sistemi BESS accumulano energia elettrica per renderla disponibile in momenti diversi dalla produzione. E2B li considera una componente dell’infrastruttura energetica, da integrare con fonti rinnovabili, rete e fabbisogni delle utenze.",
    "detail": "Capacità, potenza e logiche di funzionamento dipendono dagli obiettivi del sito. Il progetto mette in relazione collegamenti, controllo e condizioni di esercizio, fino alla conduzione del sistema.",
    "connection": "Rinnovabili, accumulo e consumi: una gestione coordinata dei diversi fabbisogni.",
    "cta": "Parliamo di accumulo",
    "interest": "BESS / Accumulo",
    "keywords": [
      "accumulano energia elettrica",
      "fonti rinnovabili",
      "capacità, potenza",
      "logiche di funzionamento",
      "conduzione"
    ]
  },
  "bio": {
    "name": "Biometano",
    "category": "Trasformazione energetica",
    "title": "Nuovi cicli,\nnuovo valore.",
    "description": "Il biometano amplia il campo delle infrastrutture per la transizione energetica. E2B affronta il progetto con una visione unitaria di processo, integrazione impiantistica e operatività, dalla progettazione alla costruzione e alla conduzione.",
    "detail": "La configurazione tiene conto delle caratteristiche del sito e delle esigenze di utilizzo. L’eventuale integrazione con CHP è un tema da approfondire: fattibilità e responsabilità operative vanno verificate sul singolo impianto.",
    "connection": "Produzione, trattamento e infrastrutture di utilizzo, con interfacce coordinate lungo il processo.",
    "cta": "Parliamo di biometano",
    "interest": "Biometano",
    "keywords": [
      "integrazione impiantistica",
      "progettazione",
      "costruzione",
      "conduzione",
      "interfacce",
      "connessioni"
    ]
  },
  "hydrogen": {
    "name": "Idrogeno",
    "category": "Ambito prospettico / da approfondire",
    "title": "Progettare\nnuove possibilità.",
    "description": "L’idrogeno è un ambito prospettico negli appunti di indirizzo E2B. Il possibile ruolo nel sistema energetico va approfondito in relazione a produzione, integrazione impiantistica e impieghi finali.",
    "detail": "Competenze, partner, fattibilità e perimetro operativo sono da verificare prima di presentare una soluzione commerciale o un progetto di riferimento.",
    "connection": "Produzione, sistemi di gestione e impieghi finali: una filiera da leggere nel suo insieme.",
    "cta": "Parliamo di idrogeno",
    "interest": "Idrogeno — approfondimento",
    "keywords": [
      "produzione",
      "sistemi impiantistici",
      "impieghi finali",
      "fonti energetiche disponibili",
      "ingegneria",
      "condizioni operative"
    ]
  },
  "digital": {
    "name": "Data center",
    "category": "Integrazione energetica del digitale",
    "title": "Il digitale ha\nuna base energetica.",
    "description": "Il perimetro energetico del data center comprende produzione, accumulo e connessioni elettriche con i fabbisogni del sito. E2B mette in relazione queste componenti con i requisiti dell’infrastruttura digitale, secondo le responsabilità definite nel progetto.",
    "detail": "Dimensionamento, continuità di servizio e condizioni di esercizio richiedono un coordinamento con le competenze dedicate al data center. Configurazione, prestazioni e responsabilità vanno definite e documentate per il singolo sito.",
    "connection": "Infrastruttura digitale, rinnovabili e storage: connessioni progettate per le esigenze del sito.",
    "cta": "Parliamo di integrazione",
    "interest": "Integrazione energetica data center",
    "keywords": [
      "rinnovabili",
      "accumulo",
      "fabbisogni",
      "continuità",
      "competenze dedicate al data center"
    ]
  }
};
const phases={
  "design": {
    "title": "Definire impianti, collegamenti e criteri di esercizio.",
    "copy": "Partiamo dai fabbisogni del sito e dagli obiettivi del progetto. L’ingegneria confronta le configurazioni possibili, dimensiona i componenti e definisce le interfacce fra produzione, accumulo, rete e utenze. Le scelte progettuali diventano requisiti per la costruzione e per la successiva conduzione.",
    "outputs": [
      "Configurazione tecnica e dimensionamento dei sistemi.",
      "Schemi di collegamento fra fonti, storage e utenze.",
      "Requisiti da trasferire alla costruzione e alla conduzione."
    ],
    "form": "Progettazione"
  },
  "build": {
    "title": "Portare il progetto in cantiere e avviare il sistema.",
    "copy": "La costruzione traduce il progetto in opere, impianti e collegamenti. Coordiniamo le attività di realizzazione e l’integrazione fra i diversi sistemi energetici, seguendo le interfacce definite in progettazione. Il percorso comprende la messa in servizio e il passaggio alla fase operativa.",
    "outputs": [
      "Coordinamento delle attività di realizzazione.",
      "Integrazione di impianti e collegamenti energetici.",
      "Messa in servizio e passaggio alla conduzione."
    ],
    "form": "Costruzione"
  },
  "operate": {
    "title": "Seguire l’impianto mentre lavora.",
    "copy": "Conduciamo i sistemi energetici e leggiamo i dati di esercizio per individuare scostamenti e necessità di intervento. Il monitoraggio collega produzione, accumulo e consumi; i riscontri operativi aiutano a impostare le ottimizzazioni. Attività e responsabilità sono definite sul singolo impianto.",
    "outputs": [
      "Monitoraggio delle condizioni di funzionamento.",
      "Individuazione degli scostamenti e delle necessità di intervento.",
      "Ottimizzazione sulla base dei dati di esercizio."
    ],
    "form": "Conduzione"
  }
};
const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
function multiline(el,value){el.replaceChildren(...value.split('\n').flatMap((line,i)=>i?[document.createElement('br'),document.createTextNode(line)]:[document.createTextNode(line)]));}
function emphasize(element,text,phrases){
  const tokens=[...phrases].sort((a,b)=>b.length-a.length);
  const escape=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const pattern=new RegExp('('+tokens.map(escape).join('|')+')','giu');
  element.replaceChildren(...text.split(pattern).map((part,index)=>{
    if(index%2===0)return document.createTextNode(part);
    const strong=document.createElement('strong');strong.textContent=part;return strong;
  }));
}
function selectTechnology(key,{focus=false}={}){
  const data=technologies[key];if(!data)return;
  $$('.system-tabs [role="tab"]').forEach(button=>{const selected=button.dataset.tech===key;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;if(selected&&focus)button.focus();});
  $('#technology-panel').setAttribute('aria-labelledby',`tab-${key}`);
  $('#tech-category').textContent=data.category;$('#tech-icon use').setAttribute('href',`#energy-icon-${key}`);
  multiline($('#tech-title'),data.title);emphasize($('#tech-description'),data.description,data.keywords);emphasize($('#tech-detail'),data.detail,data.keywords);emphasize($('#tech-connection'),data.connection,data.keywords);
  $('#tech-cta').firstChild.textContent=data.cta+' ';$('#tech-cta').dataset.interest=data.interest;
  $('.system-explorer').dataset.active=key;
  $$('[data-node]').forEach(node=>{const selected=node.dataset.node===key;node.classList.toggle('active',selected);node.setAttribute('aria-pressed',String(selected));});
  $$('[data-route]').forEach(route=>route.classList.toggle('active',route.dataset.route===key));
}
function selectMethod(key,{focus=false}={}){
  const data=phases[key];if(!data)return;
  $$('.method-tabs [role="tab"]').forEach(button=>{const selected=button.dataset.method===key;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;if(selected&&focus)button.focus();});
  $('#method-panel').setAttribute('aria-labelledby',`method-${key}`);$('#method-panel').dataset.stage=key;
  $('#method-heading').textContent=data.title;$('#method-copy').textContent=data.copy;
  $('#method-outputs').replaceChildren(...data.outputs.map(text=>{const item=document.createElement('li');item.textContent=text;return item;}));
}
function enableTabs(selector,attribute,select){
  const buttons=$$(selector);
  buttons.forEach((button,index)=>{
    button.addEventListener('click',()=>select(button.dataset[attribute]));
    button.addEventListener('keydown',event=>{
      const vertical=button.parentElement.getAttribute('aria-orientation')==='vertical';
      const next=vertical?'ArrowDown':'ArrowRight',previous=vertical?'ArrowUp':'ArrowLeft';
      let target;if(event.key===next)target=(index+1)%buttons.length;else if(event.key===previous)target=(index-1+buttons.length)%buttons.length;else if(event.key==='Home')target=0;else if(event.key==='End')target=buttons.length-1;else return;
      event.preventDefault();select(buttons[target].dataset[attribute],{focus:true});
    });
  });
}
enableTabs('.system-tabs [role="tab"]','tech',selectTechnology);
enableTabs('.method-tabs [role="tab"]','method',selectMethod);

const mapLayoutQuery=matchMedia('(max-width:600px)');
function layoutEnergyMap(){
  if(window.E2BEcosystem){window.E2BEcosystem.layout(mapLayoutQuery.matches);return;}
  const compact=mapLayoutQuery.matches;
  const positions=compact?{solar:[90,72],wind:[280,72],bess:[470,72],bio:[90,348],hydrogen:[280,348],digital:[470,348]}:{solar:[155,100],wind:[410,100],bess:[665,100],bio:[155,380],hydrogen:[410,380],digital:[665,380]};
  const center=compact?[280,210]:[410,240];
  $('.ecosystem').setAttribute('viewBox',compact?'0 0 560 460':'0 0 820 500');
  $('.map-grid').setAttribute('width',compact?'560':'820');$('.map-grid').setAttribute('height',compact?'460':'500');
  $('.central-node').setAttribute('transform',`translate(${center[0]} ${center[1]})`);$$('.node-label').forEach(label=>label.setAttribute('y',compact?'94':'92'));
  $$('[data-node]').forEach(node=>{const [x,y]=positions[node.dataset.node];node.setAttribute('transform',`translate(${x} ${y})`);});
  $$('[data-route]').forEach(route=>{const [x,y]=positions[route.dataset.route];route.setAttribute('d',`M${x} ${y} ${center[0]} ${center[1]}`);});
}
mapLayoutQuery.addEventListener('change',layoutEnergyMap);layoutEnergyMap();
$$('[data-node]').forEach(node=>{
  node.addEventListener('click',()=>selectTechnology(node.dataset.node));
  node.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();selectTechnology(node.dataset.node);}});
  const preview=(active)=>$$('[data-route]').filter(route=>route.dataset.route===node.dataset.node).forEach(route=>route.classList.toggle('hovered',active));
  node.addEventListener('pointerenter',()=>preview(true));node.addEventListener('pointerleave',()=>preview(false));
  node.addEventListener('focus',()=>preview(true));node.addEventListener('blur',()=>preview(false));
});
selectTechnology('solar');selectMethod('design');
$$('[data-select]').forEach(link=>link.addEventListener('click',()=>selectTechnology(link.dataset.select)));
$('#tech-cta').addEventListener('click',()=>{$('#interest').value=$('#tech-cta').dataset.interest;});
const menuButton=$('.menu-toggle'),navigation=$('#navigation');
function closeMenu(){menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Apri navigazione');navigation.classList.remove('open');}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Chiudi navigazione':'Apri navigazione');navigation.classList.toggle('open',open);});
navigation.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){closeMenu();menuButton.focus();}});
document.addEventListener('click',event=>{if(!event.target.closest('.header'))closeMenu();});
const desktopQuery=matchMedia('(min-width:961px)');desktopQuery.addEventListener('change',closeMenu);
const notes=$('#note-concept');
$$('[data-open-notes]').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();notes.showModal();}));
$('.dialog-close').addEventListener('click',()=>notes.close());$('.dialog-dismiss').addEventListener('click',()=>notes.close());
notes.addEventListener('click',event=>{if(event.target===notes){const bounds=notes.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)notes.close();}});
let briefText='';
$('#brief-form').addEventListener('submit',event=>{
  event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;
  const phase=new FormData(form).get('phase');
  briefText=`E2B — Brief di progetto\n\nAmbito: ${$('#interest').value}\nFase: ${phase}\n\nPunto di partenza:\n${$('#message').value.trim()}\n\nDocumento preparato localmente dal concept E2B. Nessun invio effettuato.`;
  if(!$('#message').value.trim()){$('#message').setCustomValidity('Descrivi il punto di partenza del progetto.');$('#message').reportValidity();return;}
  $('#brief-summary').textContent=briefText;$('#brief-result').hidden=false;$('#copy-status').textContent='';
  $('#brief-result').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'nearest'});
});
$('#message').addEventListener('input',()=>$('#message').setCustomValidity(''));
$('#download-brief').addEventListener('click',()=>{if(!briefText)return;const url=URL.createObjectURL(new Blob([briefText],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='E2B-Brief-progetto.txt';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('#copy-brief').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(briefText);$('#copy-status').textContent='Testo copiato.';}
  catch{const selection=getSelection(),range=document.createRange();range.selectNodeContents($('#brief-summary'));selection.removeAllRanges();selection.addRange(range);$('#copy-status').textContent='Testo selezionato: usa Ctrl+C o il comando Copia del dispositivo.';}
});
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
if('IntersectionObserver' in window){
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('pending');revealObserver.unobserve(entry.target);}}),{threshold:.08});
  if(!reduceMotion.matches){document.body.classList.add('motion-ready');$$('.reveal').forEach(element=>{element.classList.add('pending');revealObserver.observe(element);});}
  const navLinks=$$('#navigation a[href^="#"]');
  const navObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(link=>{if(link.hash==='#'+entry.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}});},{rootMargin:'-15% 0px -60% 0px'});
  $$('main section[id]').forEach(section=>navObserver.observe(section));
}
