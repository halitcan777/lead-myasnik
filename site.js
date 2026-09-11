(function(){
  var b=document.querySelector('.burger'), mn=document.querySelector('.mobile-nav');
  if(b&&mn) b.addEventListener('click',function(){mn.classList.toggle('open');});
  document.querySelectorAll('.tab-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      var wrap=btn.closest('.wrap')||document;
      wrap.querySelectorAll('.tab-btn').forEach(function(x){x.classList.remove('active');});
      btn.classList.add('active');
      var t=btn.getAttribute('data-tab');
      wrap.querySelectorAll('.tab-panel').forEach(function(p){
        p.classList.toggle('is-active', p.getAttribute('data-panel')===t);
      });
    });
  });
  var toast=document.querySelector('.toast');
  document.querySelectorAll('form[data-demo]').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      if(toast){toast.textContent='Заявка отправлена (демо). Приём заявок подключим при запуске.';toast.classList.add('show');setTimeout(function(){toast.classList.remove('show');},3500);}
      f.reset();
    });
  });
})();
