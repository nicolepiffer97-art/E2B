/* Section reveals, parallax and method navigation. Energy paths removed. */
(() => {
  'use strict';
  const main = document.querySelector('#contenuto');
  if (!main) return;
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const stickyMedia = matchMedia('(min-width:1100px) and (min-height:720px)');
  const method = document.querySelector('#metodo');
  const methodTabs = [...document.querySelectorAll('[data-method]')];
  const sections = [...main.querySelectorAll(':scope > section')];
  const cards = [...document.querySelectorAll('.world-card')];
  const images = cards.map(card => card.querySelector('.world-art img'));
  const bars = [...document.querySelectorAll('.story-progress span')];
  let bounds = [], imageBounds = [], origin = 0, viewHeight = 0;
  let frame = 0, resizeFrame = 0, visible = !document.hidden, activeStage = -1;
  let methodBounds, heroBounds, headerHeight = 94, lastFocus = null;
  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const still = () => media.matches;
  const box = el => {const r = el.getBoundingClientRect(); return {x:r.left,y:r.top + scrollY - origin,w:r.width,h:r.height,b:r.bottom + scrollY - origin};};
  const fmt = v => Math.round(v * 10) / 10;
  function measure() {
    origin = main.getBoundingClientRect().top + scrollY;
    viewHeight = innerHeight;
    const style = getComputedStyle(main);
    headerHeight = parseFloat(style.getPropertyValue('--header')) || 94;
    heroBounds = box(document.querySelector('.hero'));
    methodBounds = box(method);
    bounds = [...sections,...cards].map(el => ({el,...box(el)}));
    imageBounds = cards.map(box);
    requestFrame();
  }
  function render() {
    frame=0;if(!visible)return;
    const y=scrollY-origin,focusY=y+viewHeight*.59;
    let focusSection = sections[0];
    for(const bound of bounds){
      const active=focusY>=bound.y-60 && focusY<bound.b;
      bound.el.classList.toggle('energy-focus',active);
      if(active && sections.includes(bound.el))focusSection=bound.el;
    }
    if(focusSection!==lastFocus){main.dataset.energyFocus=focusSection.id || 'territori';lastFocus=focusSection;}
    if(!still()){
      const heroProgress=clamp(y/heroBounds.h);
      main.style.setProperty('--hero-drift',`${fmt(heroProgress*65)}px`);
      main.style.setProperty('--copy-drift',`${fmt(heroProgress*22)}px`);
      imageBounds.forEach((b,i)=>{
        if(b.b>y && b.y<y+viewHeight){
          const drift=clamp((y+viewHeight*.5-b.y-b.h*.5)/viewHeight,-1,1)*(innerWidth<600?9:22);
          images[i].style.setProperty('--image-drift',`${fmt(drift)}px`);
        }
      });
    }
    if(!still() && stickyMedia.matches && y+viewHeight>methodBounds.y && y<methodBounds.b){
      const travel=Math.max(1,methodBounds.h-viewHeight+headerHeight);
      const progress=clamp((y-methodBounds.y+headerHeight)/travel);
      const stage=Math.min(2,Math.floor(progress*3));
      bars.forEach((bar,i)=>bar.style.setProperty('--stage-fill',String(clamp(progress*3-i))));
      // Only change on crossing a phase boundary: manual tabs remain usable within the current phase.
      if(stage!==activeStage){
        activeStage=stage;
        if(y+viewHeight>methodBounds.y && y<methodBounds.b){
          const button=methodTabs[stage];
          if(button.getAttribute('aria-selected')!=='true')button.click();
        }
      }
    }
  }
  function requestFrame(){if(!frame && visible)frame=requestAnimationFrame(render);}
  function scheduleMeasure(){if(!resizeFrame)resizeFrame=requestAnimationFrame(()=>{resizeFrame=0;measure();});}
  function syncPreference(){
    document.body.classList.toggle('motion-paused',still());
    activeStage=-1;scheduleMeasure();
  }
  media.addEventListener('change',syncPreference);
  stickyMedia.addEventListener('change',scheduleMeasure);
  window.addEventListener('scroll',()=>{if(!still())requestFrame();},{passive:true});
  window.addEventListener('resize',scheduleMeasure,{passive:true});
  window.addEventListener('pageshow',scheduleMeasure);
  document.addEventListener('visibilitychange',()=>{visible=!document.hidden;if(visible)requestFrame();else if(frame){cancelAnimationFrame(frame);frame=0;}});
  // Font loading, responsive reflow, tabs and the local brief can all change path anchors.
  if('ResizeObserver' in window){
    const observer=new ResizeObserver(scheduleMeasure);
    [main,...sections,...cards,document.querySelector('.brief-form')].forEach(el=>observer.observe(el));
  }
  document.fonts?.ready.then(scheduleMeasure);
  syncPreference();
})();

/* A soft field attracts the filament gently toward a nearby fine pointer. */
(() => {
  const flow=document.querySelector('.integration-flow');
  const svg=flow?.querySelector('.energy-wave');
  const path=svg?.querySelector('#energy-wave-path');
  if(!path)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const mobile=matchMedia('(max-width:700px)');
  const gradient=svg.querySelector('#energy-wave-color');
  const response=svg.querySelector('.energy-wave-response');
  const steps=[...flow.querySelectorAll('.integration-step')];
  const pointer={position:.5,normal:0,strength:0,targetPosition:.5,targetNormal:0,targetStrength:0};
  let width=1000,height=84,vertical=false,inView=false,frame=0,measureFrame=0;
  let phase=0,lastTime=0,lastPaint=0,left=0,documentTop=0;
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function offsetAt(t){
    const envelope=Math.pow(Math.max(0,Math.sin(Math.PI*t)),.8);
    const drift=Math.sin(t*Math.PI*3.4-phase)*.7+Math.sin(t*Math.PI*6.8+phase*.61)*.22+Math.sin(t*Math.PI*1.5-phase*.43)*.16;
    const length=vertical?height:width;
    const distance=(t-pointer.position)*length;
    const field=Math.exp(-.5*(distance/82)**2)*pointer.strength;
    const attraction=pointer.normal*.8+Math.sin(distance/20-phase*3)*1.1;
    return envelope*(drift*(vertical?3.5:8)+field*attraction);
  }
  function point(t,offset=offsetAt(t)){
    return vertical?[20+offset,t*height]:[t*width,42+offset];
  }
  const coords=p=>p[0].toFixed(2)+' '+p[1].toFixed(2);
  function draw(){
    let d='';
    for(let i=0;i<=80;i++)d+=(i?'L':'M')+coords(point(i/80))+' ';
    path.setAttribute('d',d);
    // A few short, softly irregular branches appear only in the pointer's field.
    const strength=pointer.strength;
    if(strength>.01){
      const t=clamp(pointer.position,0,1),length=vertical?height:width;
      let branches='';
      const at=pixels=>clamp(t+pixels/length,0,1);
      [-32,-12,13,34].forEach((distance,i)=>{
        const seed=i*1.83;
        const direction=Math.abs(pointer.normal)>5?Math.sign(pointer.normal):(i%2?1:-1);
        const breath=Math.sin(phase*5.2+seed);
        const tipAlong=Math.sin(phase*3.7+seed)*5+(i-1.5)*3;
        const tipNormal=clamp(pointer.normal*.85+direction*(6+breath*2.5),-30,25);
        const startT=at(distance),endT=at(tipAlong);
        const base=offsetAt(startT);
        const jitter=Math.sin(phase*8.1+seed)*2.2;
        const middleT=startT+(endT-startT)*.52;
        const middleNormal=base+(tipNormal-base)*.52+jitter;
        const start=point(startT),middle=point(middleT,middleNormal),end=point(endT,tipNormal);
        const bend1=point(startT+(endT-startT)*.24,base+(tipNormal-base)*.18-jitter);
        const bend2=point(startT+(endT-startT)*.76,base+(tipNormal-base)*.83+jitter*.5);
        branches+='M'+coords(start)+' Q'+coords(bend1)+' '+coords(middle)+' Q'+coords(bend2)+' '+coords(end)+' ';
        if(i%2===0){
          const fork=point(at(tipAlong+direction*7),clamp(tipNormal+direction*5,-32,25));
          const forkBend=point(at(tipAlong+direction*3),middleNormal+direction*4);
          branches+='M'+coords(middle)+' Q'+coords(forkBend)+' '+coords(fork)+' ';
        }
      });
      response.setAttribute('d',branches);
      response.style.opacity=(strength*.48).toFixed(3);
    }else response.style.opacity='0';
  }
  function resetPointer(){pointer.targetStrength=0;}
  function tick(time){
    frame=0;
    if(!inView||document.hidden||reduced.matches){lastTime=0;return;}
    const dt=lastTime?Math.min(time-lastTime,64):16;
    phase+=dt*.00085;lastTime=time;
    const ease=1-Math.exp(-dt/95);
    pointer.position+=(pointer.targetPosition-pointer.position)*ease;
    pointer.normal+=(pointer.targetNormal-pointer.normal)*ease;
    pointer.strength+=(pointer.targetStrength-pointer.strength)*(1-Math.exp(-dt/150));
    if(time-lastPaint>=(pointer.strength>.01?14:30)){draw();lastPaint=time;}
    frame=requestAnimationFrame(tick);
  }
  function sync(){
    if(frame){cancelAnimationFrame(frame);frame=0;}
    lastTime=0;
    if(reduced.matches||!inView||document.hidden){resetPointer();pointer.strength=0;}
    if(reduced.matches){phase=0;draw();}
    else if(inView&&!document.hidden)frame=requestAnimationFrame(tick);
  }
  function measure(){
    measureFrame=0;vertical=mobile.matches;
    width=vertical?40:flow.clientWidth;
    height=vertical?Math.max(80,steps.at(-1).offsetTop+steps.at(-1).offsetHeight+8):84;
    svg.style.height=height+'px';svg.setAttribute('viewBox','0 0 '+width+' '+height);
    gradient.setAttribute('x2',vertical?'0':'1');gradient.setAttribute('y2',vertical?'1':'0');
    const rect=svg.getBoundingClientRect();left=rect.left;documentTop=rect.top+scrollY;
    resetPointer();draw();
  }
  function scheduleMeasure(){if(!measureFrame)measureFrame=requestAnimationFrame(measure);}
  window.addEventListener('pointermove',event=>{
    if(!inView||reduced.matches||!['mouse','pen'].includes(event.pointerType))return;
    const x=event.clientX-left,y=event.clientY+scrollY-documentTop;
    const along=vertical?y:x,normal=vertical?x-20:y-42,length=vertical?height:width;
    const outside=along<0?-along:along>length?along-length:0;
    const distance=Math.hypot(normal,outside);
    pointer.targetPosition=clamp(along/length,0,1);
    pointer.targetNormal=clamp(normal,-28,28);
    pointer.targetStrength=Math.pow(Math.max(0,1-distance/90),1.2);
  },{passive:true});
  window.addEventListener('pointerout',event=>{if(!event.relatedTarget)resetPointer();},{passive:true});
  window.addEventListener('blur',resetPointer);
  window.addEventListener('scroll',resetPointer,{passive:true});
  const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync();},{threshold:0});
  observer.observe(flow);
  const resize=new ResizeObserver(scheduleMeasure);resize.observe(flow);
  mobile.addEventListener('change',scheduleMeasure);
  reduced.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
  document.fonts?.ready.then(scheduleMeasure);
  measure();
})();
