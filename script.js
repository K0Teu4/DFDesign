/* ========== Мобильное меню ========== */
const header = document.getElementById('header');
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
  const open = header.classList.toggle('header--open');
  document.body.classList.toggle('nav-locked', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    header.classList.remove('header--open');
    document.body.classList.remove('nav-locked');
    burger.setAttribute('aria-expanded', 'false');
  });
});

/* ========== Аккордеон FAQ ========== */
document.querySelectorAll('.faq__item').forEach((item) => {
  const btn = item.querySelector('.faq__q');
  const answer = item.querySelector('.faq__a');

  btn.addEventListener('click', () => {
    const isOpen = item.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
    answer.style.maxHeight = isOpen ? `${answer.scrollHeight}px` : null;
  });
});

/* ========== Форма заявки ========== */
const form = document.getElementById('form');
const status = document.getElementById('form-status');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const phone = String(data.get('phone') || '').trim();

  if (!name || !phone) {
    status.textContent = 'Заполните имя и номер телефона.';
    return;
  }

  /* Здесь подключается реальная отправка (fetch на бэкенд / Telegram-бот). */
  console.log('Заявка:', { 
    name, 
    phone, 
    brief: String(data.get('brief') || '').trim() 
  });
  
  status.textContent = 'Спасибо! Заявка отправлена — свяжусь с вами в ближайшее время.';
  form.reset();
});

/* ========== Год в подвале ========== */
document.getElementById('year').textContent = new Date().getFullYear();