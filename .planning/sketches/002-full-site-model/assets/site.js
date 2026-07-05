/* v3 full-site model — shared behaviour. Plain JS, no build step. */
(function(){
  const PAGE = document.body.dataset.page || '';

  /* ── nav ── */
  const NAV = [
    ['writing.html','Writing'],
    ['works.html','Works'],
    ['prometheus.html','Prometheus'],
    ['newsletter.html','Monthly'],
    ['about.html','About'],
    ['uses.html','Uses'],
  ];
  const nav=document.createElement('nav'); nav.className='site-nav';
  nav.innerHTML =
    `<a class="brand" href="index.html">Monty<b>.</b>Singer</a>`+
    `<div class="links">`+NAV.map(([h,l],i)=>
      `<a href="${h}" class="${PAGE===h.replace('.html','')?'active':''} ${i>2?'hide-sm':''}">${l}</a>`).join('')+`</div>`;
  document.body.prepend(nav);

  /* ── fixed atmosphere ── */
  const atmo=document.createElement('div'); atmo.className='atmosphere';
  atmo.innerHTML='<i></i><i></i><i></i>'; document.body.prepend(atmo);

  /* ── fill interior page-hero from data attrs ── */
  document.querySelectorAll('.page-hero[data-title]').forEach(h=>{
    const crumb=h.dataset.crumb||'';
    const sub=h.dataset.sub||'';
    h.innerHTML =
      (crumb?`<div class="crumb">${crumb}</div>`:'')+
      `<h1>${h.dataset.title}</h1>`+
      (sub?`<p class="sub">${sub}</p>`:'')+
      `<div class="rule-strong"></div>`;
  });

  /* ── footer ── */
  const foot=document.createElement('footer'); foot.className='site-footer';
  foot.innerHTML=`<div class="wrap">
    <a href="links.html" class="big grad-text">Let's be friends.</a>
    <div class="cols">
      <div><h4>Site</h4>
        <a href="writing.html">Writing</a><a href="works.html">Works</a>
        <a href="prometheus.html">Prometheus</a><a href="about.html">About</a></div>
      <div><h4>More</h4>
        <a href="newsletter.html">Monty Monthly</a><a href="watching.html">Watching</a>
        <a href="uses.html">Uses</a><a href="events.html">Events</a><a href="links.html">Links</a></div>
      <div><h4>Elsewhere</h4>
        <a href="#">Substack ↗</a><a href="#">GitHub ↗</a>
        <a href="#">LinkedIn ↗</a><a href="#">X / Twitter ↗</a></div>
      <div><h4>Contact</h4>
        <a href="#">monty@prometheus.today</a><a href="prometheus.html">Work with Prometheus</a></div>
    </div>
    <div class="colophon"><span>© 2026 Monty Singer</span><span>Founder of Prometheus · Builder · Writer</span></div>
  </div>`;
  if(PAGE!=='home') document.body.appendChild(foot); // home includes footer as the last deck slide

  /* ── reveal on scroll ── */
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:0.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  /* ── theme switcher toolbar ── */
  const tb=document.createElement('div'); tb.id='sketch-tools';
  tb.innerHTML=`<span>palette</span><select>
    <option value="default">prometheus</option>
    <option value="nocturne">nocturne</option>
    <option value="ember">ember</option>
    <option value="halogen">halogen</option></select>`;
  tb.querySelector('select').onchange=function(){document.querySelector('link[href*="themes/"]').href='../themes/'+this.value+'.css';};
  document.body.appendChild(tb);

  /* ── WebGL hero object (home only) ── */
  function initBlob(){
    const canvas=document.getElementById('webgl');
    if(!canvas||typeof THREE==='undefined') return;
    let renderer; try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});}catch(e){return;}
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.outputEncoding=THREE.sRGBEncoding;
    renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.15;
    const scene=new THREE.Scene();
    const cam=new THREE.PerspectiveCamera(42,1,0.1,100); cam.position.set(0,0,4.4);
    const geo=new THREE.IcosahedronGeometry(1.3,12);
    const base=geo.attributes.position.array.slice();
    const blob=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:0x140805,emissive:0x000000,metalness:0.5,roughness:0.26}));
    scene.add(blob);
    const wire=new THREE.Mesh(new THREE.IcosahedronGeometry(1.62,2),new THREE.MeshBasicMaterial({color:0x0a0503,wireframe:true,transparent:true,opacity:0.16}));
    scene.add(wire);
    const key=new THREE.DirectionalLight(0xffffff,1.9);key.position.set(3,4,5);scene.add(key);
    const rim=new THREE.DirectionalLight(0xff6a3a,1.7);rim.position.set(-4,-2,-4);scene.add(rim);
    const fill=new THREE.DirectionalLight(0xffffff,0.45);fill.position.set(-3,2,3);scene.add(fill);
    scene.add(new THREE.AmbientLight(0x1a0a06,0.5));
    function resize(){const p=canvas.parentElement.getBoundingClientRect();const w=Math.max(p.width,100),h=Math.max(p.height,100);renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();}
    resize(); if(window.ResizeObserver) new ResizeObserver(resize).observe(canvas.parentElement);
    const pos=geo.attributes.position; let t=0;
    (function tick(){
      t+=0.006;
      for(let i=0;i<pos.count;i++){const ix=i*3,bx=base[ix],by=base[ix+1],bz=base[ix+2];const l=Math.hypot(bx,by,bz)||1;
        const n=Math.sin(bx*2+t*1.6)+Math.sin(by*2.3+t*1.2)+Math.sin(bz*2.1+t*1.9);const d=1.3+n*0.11;
        pos.array[ix]=bx/l*d;pos.array[ix+1]=by/l*d;pos.array[ix+2]=bz/l*d;}
      pos.needsUpdate=true; geo.computeVertexNormals();
      blob.rotation.y+=0.0035; blob.rotation.x=Math.sin(t*0.3)*0.22; wire.rotation.y-=0.0018; wire.rotation.z+=0.001;
      renderer.render(scene,cam); requestAnimationFrame(tick);
    })();
  }

  /* ── slide deck (home): ported from CHOMP's Slideshow controller ──
     One gesture = one slide. Wheel only advances on a FRESH gesture (a pause,
     a re-acceleration, or a direction change); decaying trackpad momentum is
     ignored. An 820ms lock covers the 800ms tween so one push = one slide, but
     direction REVERSALS bypass the lock so up/down stays instant. */
  function deckInit(){
    const sc=document.getElementById('scroller'); if(!sc) return;
    const objwrap=document.querySelector('.objwrap');
    const slides=()=>Array.from(sc.querySelectorAll('.deck-slide'));
    let idx=0;

    // progress dots
    const dots=document.createElement('div'); dots.className='deck-dots';
    slides().forEach((_,i)=>{const b=document.createElement('b'); if(i===0)b.className='on'; dots.appendChild(b);});
    document.body.appendChild(dots);
    const markDots=i=>dots.querySelectorAll('b').forEach((b,j)=>b.classList.toggle('on',j===i));

    // object entrance: spawn in the right portion, fly in from the left, settle right
    function objEnter(){
      if(!objwrap) return; const vw=innerWidth/100;
      objwrap.style.transition='none';
      objwrap.style.transform=`translateX(${(20*vw).toFixed(1)}px)`;
      objwrap.style.opacity='0';
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        objwrap.style.transition='transform 1s cubic-bezier(.16,1,.3,1),opacity .55s ease';
        objwrap.style.transform=`translateX(${(38*vw).toFixed(1)}px)`;
        objwrap.style.opacity='1';
      }));
    }
    objEnter();

    let lock=0, stepDir=0, raf=0;
    const locked=()=>Date.now()<lock;
    const lockFor=ms=>{lock=Date.now()+ms;};
    const ease=x=>x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
    const animateTo=(top,dur)=>{cancelAnimationFrame(raf);const from=sc.scrollTop,dist=top-from,t0=performance.now();
      const tick=now=>{const p=dur?Math.min((now-t0)/dur,1):1;sc.scrollTop=from+dist*ease(p);if(p<1)raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);};
    const goTo=i=>{const sl=slides();i=Math.max(0,Math.min(sl.length-1,i));if(i===idx)return;idx=i;markDots(i);lockFor(820);objEnter();animateTo(sl[i].offsetTop,800);};
    const step=dir=>{if(locked()&&dir===stepDir)return;stepDir=dir;goTo(idx+dir);};

    let wT=0,wDir=0,wAbs=0;
    sc.addEventListener('wheel',e=>{e.preventDefault();const adel=Math.abs(e.deltaY);if(adel<4)return;
      const dir=e.deltaY>0?1:-1,now=Date.now();const fresh=now-wT>110||dir!==wDir||adel>wAbs*1.25+2;
      wT=now;wDir=dir;wAbs=adel;if(!fresh)return;step(dir);},{passive:false});

    let tY=null;
    sc.addEventListener('touchstart',e=>{tY=e.touches[0].clientY;},{passive:true});
    sc.addEventListener('touchmove',e=>{e.preventDefault();},{passive:false});
    sc.addEventListener('touchend',e=>{if(tY==null)return;const end=e.changedTouches[0]&&e.changedTouches[0].clientY;const dy=tY-(end==null?tY:end);if(Math.abs(dy)>28)step(dy>0?1:-1);tY=null;},{passive:true});

    addEventListener('keydown',e=>{const tag=(e.target&&e.target.tagName)||'';if(/^(input|textarea|select)$/i.test(tag))return;
      if(['ArrowDown','PageDown',' '].includes(e.key)){e.preventDefault();step(1);}
      else if(['ArrowUp','PageUp'].includes(e.key)){e.preventDefault();step(-1);}
      else if(e.key==='Home'){e.preventDefault();goTo(0);}else if(e.key==='End'){e.preventDefault();goTo(slides().length-1);}});

    // keep index synced + replay entrance if the user drags the scrollbar
    let st; sc.addEventListener('scroll',()=>{if(locked())return;clearTimeout(st);st=setTimeout(()=>{
      const sl=slides();const mid=sc.scrollTop+sc.clientHeight/2;let near=0,best=Infinity;
      sl.forEach((el,i)=>{const d=Math.abs(el.offsetTop+el.offsetHeight/2-mid);if(d<best){best=d;near=i;}});
      if(near!==idx){idx=near;markDots(near);objEnter();}},90);},{passive:true});

    addEventListener('resize',()=>{const sl=slides();sc.scrollTop=sl[idx].offsetTop;});
  }

  if(PAGE==='home'){ initBlob(); deckInit(); }
})();
