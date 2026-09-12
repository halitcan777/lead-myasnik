(function(){
  var b=document.querySelector('.burger'), mn=document.querySelector('.mobile-nav');
  if(b&&mn) b.addEventListener('click',function(){
    var open=mn.classList.toggle('open');
    b.setAttribute('aria-expanded',open?'true':'false');
  });

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
    function maxPos(t){return t.scrollWidth-t.clientWidth;}
    function atEnd(t){return t.scrollLeft>=maxPos(t)-2;}
    // Последняя карточка, которую трек ещё может подтянуть к левому краю.
    // Дальше прокрутка упирается в конец, и несколько последних карточек
    // дают одну и ту же позицию: если считать шаг от них, кнопка «назад»
    // с правого края пересчитывает всё в ту же точку и ничего не двигает.
    function lastStop(t){var cs=C(t),b=base(t),m=maxPos(t),i=cs.length-1;while(i>0&&cs[i].offsetLeft-b>m+2)i--;return i;}
    function nearIdx(t){var cs=C(t),sl=t.scrollLeft+base(t),bi=0,bd=1e9;cs.forEach(function(c,i){var d=Math.abs(c.offsetLeft-sl);if(d<bd){bd=d;bi=i;}});return bi;}
    // Точка отсчёта для шага стрелками — всегда реально достижимая карточка.
    function stopIdx(t){return Math.min(nearIdx(t),lastStop(t));}
    // Для точек-индикаторов правый край — это последняя карточка: она
    // видна целиком, хотя к левому краю трек её уже не подтягивает.
    function activeIdx(t){return atEnd(t)?C(t).length-1:nearIdx(t);}
    // Сдвиг делается относительным, а не абсолютным: в контейнере со
    // scroll-snap-type:mandatory Chrome глушит scrollTo к позиции левее
    // текущей приклеенной карточки — трек просто остаётся на месте.
    // scrollBy на ту же дельту отрабатывает нормально.
    function goTo(t,i){var cs=C(t);i=Math.max(0,Math.min(i,cs.length-1));t.scrollBy({left:cs[i].offsetLeft-base(t)-t.scrollLeft,behavior:'smooth'});}
    function buildDots(){var t=A();if(!dotsWrap||!t)return;dotsWrap.innerHTML='';C(t).forEach(function(c,i){var d=document.createElement('button');d.className='dot';d.setAttribute('aria-label','Позиция '+(i+1));d.addEventListener('click',function(){goTo(t,i);restart();});dotsWrap.appendChild(d);});sync();}
    function sync(){var t=A();if(!t)return;var ai=activeIdx(t);if(prev)prev.disabled=t.scrollLeft<=2;if(next)next.disabled=atEnd(t);if(dotsWrap){var ds=dotsWrap.children;for(var i=0;i<ds.length;i++)ds[i].classList.toggle('active',i===ai);}}
    // Автопрокрутка работает, пока витрину не тронули. Как только человек
    // сам листает — колесом, пальцем или стрелками — таймер выключается
    // насовсем: иначе он дёргает трек посреди чужого движения.
    var taken=false;
    function play(){stop();if(taken)return;timer=setInterval(function(){var t=A();if(!t||hover)return;goTo(t,atEnd(t)?0:stopIdx(t)+1);},4000);}
    function stop(){if(timer){clearInterval(timer);timer=null;}}
    function restart(){play();}
    ['wheel','touchstart','pointerdown','keydown'].forEach(function(ev){
      sc.addEventListener(ev,function(){taken=true;stop();},{passive:true});
    });
    btns.forEach(function(bt){bt.addEventListener('click',function(){btns.forEach(function(x){x.classList.remove('active');});bt.classList.add('active');var tb=bt.getAttribute('data-tab');tracks.forEach(function(tr){tr.hidden=(tr.getAttribute('data-panel')!==tb);if(!tr.hidden)tr.scrollLeft=0;});buildDots();restart();});});
    if(prev)prev.addEventListener('click',function(){var t=A();goTo(t,stopIdx(t)-1);restart();});
    if(next)next.addEventListener('click',function(){var t=A();goTo(t,stopIdx(t)+1);restart();});
    tracks.forEach(function(tr){tr.addEventListener('scroll',sync,{passive:true});});
    sc.addEventListener('pointerenter',function(){hover=true;});
    sc.addEventListener('pointerleave',function(){hover=false;});
    window.addEventListener('resize',sync);
    buildDots();play();
  });


  // ---- Каталог: категория как экран + сортировка ---------------------------
  // Фильтров нет намеренно: в самой большой категории 19 позиций, всё видно
  // списком, а фасеты на таком объёме просто пересказывают ту же выдачу.
  var cx = document.querySelector('[data-catalog]');
  if(cx){
    var tiles=[].slice.call(cx.querySelectorAll('.cat')),
        prods=[].slice.call(cx.querySelectorAll('.prod')),
        grid=cx.querySelector('.cat-grid'),
        nameEl=cx.querySelector('[data-cat-name]'),
        countEl=cx.querySelector('[data-cat-count]'),
        sortEl=cx.querySelector('[data-sort]'),
        cur=tiles[0].getAttribute('data-cat');

    function plural(n){var a=n%10,b=n%100;
      return (a===1&&b!==11)?'позиция':((a>=2&&a<=4)&&(b<12||b>14))?'позиции':'позиций';}
    function apply(){
      var n=0;
      prods.forEach(function(p){
        var show=p.getAttribute('data-cat')===cur;
        p.hidden=!show;
        // Считаем позиции прайса, а не карточки: в одной карточке может
        // лежать несколько вариантов одного товара от разных производителей.
        if(show)n+=(+p.getAttribute('data-n')||1);
      });
      countEl.textContent=n+' '+plural(n);
      // Одна-две карточки в сетке на четыре колонки висят в углу пустого
      // ряда — в этом случае раскладываем их горизонтально, шире.
      var shown=0; prods.forEach(function(p){if(!p.hidden)shown++;});
      grid.classList.toggle('few',shown<=2);
    }
    function sortNow(){
      var v=sortEl?sortEl.value:'cat', arr=prods.slice();
      arr.sort(function(a,b){
        if(v==='az'||v==='za'){
          var r=a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'),'ru');
          return v==='az'?r:-r;
        }
        return (+a.getAttribute('data-i'))-(+b.getAttribute('data-i'));
      });
      arr.forEach(function(p){grid.appendChild(p);});
    }
    function pick(cid){
      cur=cid;
      tiles.forEach(function(b){
        var on=b.getAttribute('data-cat')===cid;
        b.setAttribute('aria-selected',on?'true':'false');
        if(on&&nameEl)nameEl.textContent=b.getAttribute('data-name');
      });
      apply();
    }
    tiles.forEach(function(b){
      b.addEventListener('click',function(){pick(b.getAttribute('data-cat'));});
    });
    if(sortEl)sortEl.addEventListener('change',sortNow);
    // Старые ссылки вида katalog.html#cat5 продолжают открывать свою категорию.
    var h=(location.hash||'').replace('#','');
    if(h&&tiles.some(function(b){return b.getAttribute('data-cat')===h;}))cur=h;
    pick(cur);
  }

  var toast=document.querySelector('.toast');
  document.querySelectorAll('form[data-demo]').forEach(function(f){
    f.addEventListener('submit',function(e){e.preventDefault();
      if(toast){toast.textContent='Заявка отправлена (демо). Приём заявок подключим при запуске.';toast.classList.add('show');setTimeout(function(){toast.classList.remove('show');},3500);}
      f.reset();});
  });
})();
