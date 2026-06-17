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
        <a href="newsletter.html">Monty Monthly</a><a href="uses.html">Uses</a>
        <a href="events.html">Events</a><a href="links.html">Links</a></div>
      <div><h4>Elsewhere</h4>
        <a href="#">Substack ↗</a><a href="#">GitHub ↗</a>
        <a href="#">LinkedIn ↗</a><a href="#">X / Twitter ↗</a></div>
      <div><h4>Contact</h4>
        <a href="#">monty@prometheus.today</a><a href="prometheus.html">Work with Prometheus</a></div>
    </div>
    <div class="colophon"><span>© 2026 Monty Singer</span><span>Founder of Prometheus · Builder · Writer</span></div>
  </div>`;
  document.body.appendChild(foot);

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
    const blob=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:0xff5a33,emissive:0x4a1200,emissiveIntensity:0.5,metalness:0.35,roughness:0.32}));
    scene.add(blob);
    const wire=new THREE.Mesh(new THREE.IcosahedronGeometry(1.62,2),new THREE.MeshBasicMaterial({color:0xffb23c,wireframe:true,transparent:true,opacity:0.10}));
    scene.add(wire);
    const key=new THREE.DirectionalLight(0xffffff,1.7);key.position.set(3,4,5);scene.add(key);
    const rim=new THREE.DirectionalLight(0xffb23c,1.3);rim.position.set(-4,-2,-4);scene.add(rim);
    const fill=new THREE.DirectionalLight(0xff5a33,0.7);fill.position.set(-3,2,3);scene.add(fill);
    scene.add(new THREE.AmbientLight(0x2a1206,0.7));
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

  /* ── scroll travel: object slides off right → re-enters from left ── */
  function travelInit(){
    const objwrap=document.querySelector('.objwrap'); if(!objwrap) return;
    function travel(){
      const vw=innerWidth/100, p=Math.min(Math.max(scrollY/innerHeight,0),1);
      let x = p<0.5 ? 26+(78-26)*(p/0.5) : -78+(52)*((p-0.5)/0.5);
      objwrap.style.transform=`translateX(${(x*vw).toFixed(1)}px)`;
    }
    addEventListener('scroll',travel,{passive:true}); addEventListener('resize',travel); travel();
  }

  if(PAGE==='home'){ initBlob(); travelInit(); }
})();
