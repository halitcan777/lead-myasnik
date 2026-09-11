(function(){
  var b=document.querySelector('.burger'), mn=document.querySelector('.mobile-nav');
  if(b&&mn) b.addEventListener('click',function(){mn.classList.toggle('open');});

  function mask(v){var d=v.replace(/\D/g,'');if(d[0]==='8')d='7'+d.slice(1);if(d&&d[0]!=='7')d='7'+d;d=d.slice(0,11);var r='+7';if(d.length>1)r+=' ('+d.slice(1,4);if(d.length>=4)r+=') '+d.slice(4,7);if(d.length>=7)r+='-'+d.slice(7,9);if(d.length>=9)r+='-'+d.slice(9,11);return r;}
  document.querySelectorAll('input[data-phone]').forEach(function(i){
    i.addEventListener('input',function(){i.value=mask(i.value);});
    i.addEventListener('focus',function(){if(!i.value)i.value='+7 ';});
  });

  document.querySelectorAll('.showcase').forEach(function(sc){
    var btns=[].slice.call(sc.querySelectorAll('.tab-btn')),
        tracks=[].slice.call(sc.querySelectorAll('.track')),
        prev=sc.querySelector('.cnav.prev'), next=sc.querySelector('.cnav.next'),
        dotsWrap=sc.querySelector('[data-dots]'), timer=null, hover=false;
    function A(){return tracks.filter(function(t){return !t.hidden;})[0];}
    function C(t){return [].slice.call(t.querySelectorAll('.prod'));}
    function base(t){var c=C(t)[0];return c?c.offsetLeft:0;}
    function atEnd(t){return t.scrollLeft>=t.scrollWidth-t.clientWidth-2;}
    function activeIdx(t){var cs=C(t),sl=t.scrollLeft+base(t),bi=0,bd=1e9;cs.forEach(function(c,i){var d=Math.abs(c.offsetLeft-sl);if(d<bd){bd=d;bi=i;}});if(atEnd(t))bi=cs.length-1;return bi;}
    function goTo(t,i){var cs=C(t);i=Math.max(0,Math.min(i,cs.length-1));t.scrollTo({left:cs[i].offsetLeft-base(t),behavior:'smooth'});}
    function buildDots(){var t=A();if(!dotsWrap||!t)return;dotsWrap.innerHTML='';C(t).forEach(function(c,i){var d=document.createElement('button');d.className='dot';d.setAttribute('aria-label','Позиция '+(i+1));d.addEventListener('click',function(){goTo(t,i);restart();});dotsWrap.appendChild(d);});sync();}
    function sync(){var t=A();if(!t)return;var ai=activeIdx(t);if(prev)prev.disabled=t.scrollLeft<=2;if(next)next.disabled=atEnd(t);if(dotsWrap){var ds=dotsWrap.children;for(var i=0;i<ds.length;i++)ds[i].classList.toggle('active',i===ai);}}
    function play(){stop();timer=setInterval(function(){var t=A();if(!t||hover)return;goTo(t,atEnd(t)?0:activeIdx(t)+1);},4000);}
    function stop(){if(timer){clearInterval(timer);timer=null;}}
    function restart(){play();}
    btns.forEach(function(bt){bt.addEventListener('click',function(){btns.forEach(function(x){x.classList.remove('active');});bt.classList.add('active');var tb=bt.getAttribute('data-tab');tracks.forEach(function(tr){tr.hidden=(tr.getAttribute('data-panel')!==tb);if(!tr.hidden)tr.scrollLeft=0;});buildDots();restart();});});
    if(prev)prev.addEventListener('click',function(){var t=A();goTo(t,activeIdx(t)-1);restart();});
    if(next)next.addEventListener('click',function(){var t=A();goTo(t,activeIdx(t)+1);restart();});
    tracks.forEach(function(tr){tr.addEventListener('scroll',sync,{passive:true});});
    sc.addEventListener('pointerenter',function(){hover=true;});
    sc.addEventListener('pointerleave',function(){hover=false;});
    window.addEventListener('resize',sync);
    buildDots();play();
  });

  var toast=document.querySelector('.toast');
  document.querySelectorAll('form[data-demo]').forEach(function(f){
    f.addEventListener('submit',function(e){e.preventDefault();
      if(toast){toast.textContent='Заявка отправлена (демо). Приём заявок подключим при запуске.';toast.classList.add('show');setTimeout(function(){toast.classList.remove('show');},3500);}
      f.reset();});
  });
})();
