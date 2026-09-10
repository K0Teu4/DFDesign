/* ===== Accordion ===== */
document.querySelectorAll('.acc__head').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const item = btn.closest('.acc__item');
    item.classList.toggle('open');
    btn.setAttribute('aria-expanded', item.classList.contains('open'));
  });
});

/* ===== Burger ===== */
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', ()=>{
  const open = burger.classList.toggle('is-open');
  menu.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
menu.querySelectorAll('a').forEach(a=>{
  a.addEventListener('click', ()=>{
    burger.classList.remove('is-open');
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  });
});

/* ===== Form validation ===== */
const form = document.getElementById('lead');
const submitBtn = document.getElementById('submitBtn');
const status = form.querySelector('.form-status');

const phoneRe = /^[+\d][\d\s\-()]{7,}$/;

function setFieldState(input, state, message=''){
  const wrap = input.closest('.field-wrap');
  if(!wrap) return;
  wrap.classList.remove('is-error','is-success');
  input.classList.remove('is-error','is-success');
  const msg = wrap.querySelector('.field-status');
  if(state==='error'){
    wrap.classList.add('is-error');
    input.classList.add('is-error');
    if(msg) msg.textContent = message;
  } else if(state==='success'){
    wrap.classList.add('is-success');
    input.classList.add('is-success');
    if(msg) msg.textContent = '';
  } else if(msg){
    msg.textContent = '';
  }
}

['name','phone'].forEach(name=>{
  const inp = form.elements[name];
  inp.addEventListener('blur', ()=>{
    if(!inp.value.trim()){
      setFieldState(inp,'error', name==='name'?'Введите имя':'Введите телефон');
    } else if(name==='phone' && !phoneRe.test(inp.value.trim())){
      setFieldState(inp,'error','Проверьте формат телефона');
    } else {
      setFieldState(inp,'success');
    }
  });
  inp.addEventListener('input', ()=>{
    if(inp.classList.contains('is-error') && inp.value.trim()){
      if(name==='phone' && !phoneRe.test(inp.value.trim())) return;
      setFieldState(inp,'success');
    }
  });
});

form.addEventListener('submit', e=>{
  e.preventDefault();
  const name = form.elements.name;
  const phone = form.elements.phone;
  const agree = form.elements.agree;
  let valid = true;

  if(!name.value.trim()){ setFieldState(name,'error','Введите имя'); valid=false; }
  else setFieldState(name,'success');

  if(!phone.value.trim()){ setFieldState(phone,'error','Введите телефон'); valid=false; }
  else if(!phoneRe.test(phone.value.trim())){ setFieldState(phone,'error','Проверьте формат'); valid=false; }
  else setFieldState(phone,'success');

  if(!agree.checked){
    status.textContent='Подтвердите согласие на обработку данных';
    valid=false;
  } else status.textContent='';

  if(!valid) return;

  submitBtn.setAttribute('aria-disabled','true');
  submitBtn.disabled = true;
  status.textContent='Отправляю...';

  // Демо: имитация запроса
  setTimeout(()=>{
    status.textContent='Спасибо! Заявка принята — свяжусь в течение дня.';
    form.reset();
    document.querySelectorAll('.field-wrap').forEach(w=>w.classList.remove('is-error','is-success'));
    submitBtn.removeAttribute('aria-disabled');
    submitBtn.disabled = false;
  }, 600);
});

/* ===== Fade images on load ===== */
document.querySelectorAll('[style*="background-image"]').forEach(el=>{
  el.style.opacity='0';
  el.style.transition='opacity .6s ease';
  requestAnimationFrame(()=>{
    requestAnimationFrame(()=>{ el.style.opacity='1'; });
  });
});