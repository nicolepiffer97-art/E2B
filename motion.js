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

/* Decorative wave: update one SVG path, only while it is visible. */
(() => {
  const flow=document.querySelector('.integration-flow');
  const svg=flow?.querySelector('.energy-wave');
  const path=svg?.querySelector('#energy-wave-path');
  if(!path)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const mobile=matchMedia('(max-width:700px)');
  const gradient=svg.querySelector('#energy-wave-color');
  const steps=[...flow.querySelectorAll('.integration-step')];
  let width=1000,height=84,vertical=false,inView=false,frame=0,measureFrame=0;
  let phase=0,lastTime=0,lastPaint=0;
  function draw(){
    const length=vertical?height:width;
    const amplitude=vertical?4.5:10;
    const segments=80;
    let d='';
    for(let i=0;i<=segments;i++){
      const t=i/segments;
      const envelope=Math.pow(Math.sin(Math.PI*t),.8);
      const drift=Math.sin(t*Math.PI*3.4-phase)*.7+Math.sin(t*Math.PI*6.8+phase*.61)*.22+Math.sin(t*Math.PI*1.5-phase*.43)*.16;
      const offset=envelope*drift*amplitude;
      const x=vertical?20+offset:t*length;
      const y=vertical?t*length:42+offset;
      d+=(i?'L':'M')+x.toFixed(2)+' '+y.toFixed(2)+' ';
    }
    path.setAttribute('d',d);
  }
  function tick(time){
    frame=0;
    if(!inView||document.hidden||reduced.matches){lastTime=0;return;}
    if(lastTime)phase+=Math.min(time-lastTime,64)*.00085;
    lastTime=time;
    if(time-lastPaint>=30){draw();lastPaint=time;}
    frame=requestAnimationFrame(tick);
  }
  function sync(){
    if(frame){cancelAnimationFrame(frame);frame=0;}
    lastTime=0;
    if(reduced.matches){phase=0;draw();}
    else if(inView&&!document.hidden)frame=requestAnimationFrame(tick);
  }
  function measure(){
    measureFrame=0;vertical=mobile.matches;
    width=vertical?40:flow.clientWidth;
    height=vertical?Math.max(80,steps.at(-1).offsetTop+steps.at(-1).offsetHeight+8):84;
    svg.style.height=height+'px';
    svg.setAttribute('viewBox','0 0 '+width+' '+height);
    gradient.setAttribute('x2',vertical?'0':'1');gradient.setAttribute('y2',vertical?'1':'0');
    draw();
  }
  function scheduleMeasure(){if(!measureFrame)measureFrame=requestAnimationFrame(measure);}
  const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync();},{threshold:0});
  observer.observe(flow);
  const resize=new ResizeObserver(scheduleMeasure);resize.observe(flow);
  mobile.addEventListener('change',scheduleMeasure);
  reduced.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
  document.fonts?.ready.then(scheduleMeasure);
  measure();
})();
