document.addEventListener('DOMContentLoaded', function () {

    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toastText');
    const toastClose = document.getElementById('toastClose');
    let toastTimer = null;

    function showToast(message, type) {
        if (!toast) return;
        toastText.textContent = message;
        toast.classList.remove('toast--error', 'toast--success');
        toast.classList.add(type === 'success' ? 'toast--success' : 'toast--error');
        toast.classList.add('toast--show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(hideToast, 5000);
    }

    function hideToast() {
        if (toast) toast.classList.remove('toast--show');
    }

    if (toastClose) toastClose.addEventListener('click', hideToast);

    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }

    const faqItems = document.querySelectorAll('.faq__item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav--open');
            burger.classList.toggle('burger--open');
            document.body.classList.toggle('menu-locked');
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav--open');
                burger.classList.remove('burger--open');
                document.body.classList.remove('menu-locked');
            });
        });
    }

    const form = document.getElementById('contactForm');

    if (form) {
        const phonePattern = /^[\d\s\+\-\(\)]{7,}$/;
        const emailPattern = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;

        const validators = {
            name: v => v.trim().length >= 2,
            contact: v => {
                const t = v.trim();
                if (!t) return false;
                return t.includes('@') ? emailPattern.test(t) : phonePattern.test(t);
            }
        };

        function paint(key) {
            const wrap = form.querySelector('.form__field[data-field="' + key + '"]');
            if (!wrap) return true;
            const input = wrap.querySelector('input, textarea');
            const value = input.value;
            wrap.classList.remove('form__field--success', 'form__field--error');
            if (!value.trim()) return false;
            const ok = validators[key](value);
            wrap.classList.add(ok ? 'form__field--success' : 'form__field--error');
            return ok;
        }

        ['name', 'contact'].forEach(key => {
            const wrap = form.querySelector('.form__field[data-field="' + key + '"]');
            if (!wrap) return;
            const input = wrap.querySelector('input');
            input.addEventListener('input', () => paint(key));
            input.addEventListener('blur', () => paint(key));
        });

        const project = form.querySelector('textarea[name="project"]');
        if (project) {
            const grow = () => {
                project.style.height = 'auto';
                project.style.height = project.scrollHeight + 'px';
            };
            project.addEventListener('input', grow);
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const nameOk = paint('name');
            const contactOk = paint('contact');
            const checkbox = form.querySelector('input[type="checkbox"]');

            if (!nameOk) {
                showToast('Пожалуйста, введите имя');
                form.querySelector('input[name="name"]').focus();
                return;
            }

            if (!contactOk) {
                const contactInput = form.querySelector('input[name="contact"]');
                const isEmail = contactInput.value.includes('@');
                showToast(isEmail
                    ? 'Похоже, в e-mail опечатка. Пример: name@mail.ru'
                    : 'Введите телефон (например, +7 951 794-44-82) или e-mail');
                contactInput.focus();
                return;
            }

            if (!checkbox.checked) {
                showToast('Остался один шаг — отметьте согласие на обработку персональных данных');
                return;
            }

            console.log('Form submitted:', {
                name: form.name.value.trim(),
                contact: form.contact.value.trim(),
                contactType: form.contact.value.includes('@') ? 'email' : 'phone',
                project: project ? project.value.trim() : ''
            });

            showToast('Спасибо! Заявка отправлена — свяжусь с вами в ближайшее время', 'success');
            form.reset();
            form.querySelectorAll('.form__field').forEach(f => {
                f.classList.remove('form__field--success', 'form__field--error');
            });
            if (project) project.style.height = 'auto';
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.length < 2) return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = 20;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

});