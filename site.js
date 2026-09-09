const burger=document.querySelector('.burger'),menu=document.querySelector('.mobile-nav');
burger?.addEventListener('click',()=>menu.classList.toggle('open'));
document.querySelectorAll('.mobile-nav a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));
document.querySelector('form')?.addEventListener('submit',e=>{e.preventDefault();const t=document.querySelector('.toast');t.textContent='Заявка собрана — подключим отправку после согласования';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3200)});
