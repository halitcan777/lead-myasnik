(function(){
  var b=document.querySelector('.burger'), mn=document.querySelector('.mobile-nav');
  if(b&&mn) b.addEventListener('click',function(){mn.classList.toggle('open');});

  document.querySelectorAll('.showcase').forEach(function(sc){
    var btns=[].slice.call(sc.querySelectorAll('.tab-btn'));
    var tracks=[].slice.call(sc.querySelectorAll('.track'));
    var prev=sc.querySelector('.cnav.prev'), next=sc.querySelector('.cnav.next');
    function active(){return tracks.filter(function(t){return !t.hidden;})[0];}
    function step(){var t=active(); if(!t)return 300; var c=t.querySelector('.prod'); var per=window.innerWidth>900?2:1; return (c?c.offsetWidth+16:300)*per;}
    function upd(){var t=active(); if(!t||!prev||!next)return; var max=t.scrollWidth-t.clientWidth-2; prev.disabled=t.scrollLeft<=2; next.disabled=t.scrollLeft>=max;}
    btns.forEach(function(bt){bt.addEventListener('click',function(){
      btns.forEach(function(x){x.classList.remove('active');}); bt.classList.add('active');
      var tb=bt.getAttribute('data-tab');
      tracks.forEach(function(tr){tr.hidden=(tr.getAttribute('data-panel')!==tb); if(!tr.hidden)tr.scrollLeft=0;});
      upd();
    });});
    if(prev)prev.addEventListener('click',function(){var t=active(); if(t)t.scrollBy({left:-step(),behavior:'smooth'});});
    if(next)next.addEventListener('click',function(){var t=active(); if(t)t.scrollBy({left:step(),behavior:'smooth'});});
    tracks.forEach(function(tr){tr.addEventListener('scroll',upd,{passive:true});});
    window.addEventListener('resize',upd); upd();
  });

  var toast=document.querySelector('.toast');
  document.querySelectorAll('form[data-demo]').forEach(function(f){
    f.addEventListener('submit',function(e){e.preventDefault();
      if(toast){toast.textContent='Заявка отправлена (демо). Приём заявок подключим при запуске.';toast.classList.add('show');setTimeout(function(){toast.classList.remove('show');},3500);}
      f.reset();});
  });
})();
