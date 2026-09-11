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
        const phonePattern = /^[\d\s+\-()]{7,}$/;
        const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        const validators = {
            name: v => v.trim().length >= 2,
            contact: v => {
                const t = v.trim();
                if (!t) return false;
                return t.includes('@') ? emailPattern.test(t) : phonePattern.test(t);
            }
        };

        const fields = {};
        Object.keys(validators).forEach(key => {
            const wrap = form.querySelector('.form__field[data-field="' + key + '"]');
            const input = wrap ? wrap.querySelector('input') : null;
            if (input) fields[key] = { wrap: wrap, input: input };
        });

        let submitAttempted = false;

        function paint(key) {
            const field = fields[key];
            const value = field.input.value;
            const valid = validators[key](value);
            field.wrap.classList.remove('form__field--success', 'form__field--error');
            if (valid) {
                field.wrap.classList.add('form__field--success');
                return true;
            }
            if (submitAttempted || (field.input.dataset.touched === '1' && value.trim() !== '')) {
                field.wrap.classList.add('form__field--error');
            }
            return false;
        }

        Object.keys(fields).forEach(key => {
            fields[key].input.addEventListener('input', () => paint(key));
            fields[key].input.addEventListener('blur', () => {
                fields[key].input.dataset.touched = '1';
                paint(key);
            });
        });

        const project = form.querySelector('textarea[name="project"]');
        if (project) {
            const grow = () => {
                project.style.height = 'auto';
                project.style.height = project.scrollHeight + 'px';
            };
            project.addEventListener('input', grow);
        }

        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            submitAttempted = true;

            const nameOk = paint('name');
            const contactOk = paint('contact');
            const checkbox = form.querySelector('input[type="checkbox"]');

            if (!nameOk) {
                showToast('Пожалуйста, введите имя');
                fields.name.input.focus();
                return;
            }

            if (!contactOk) {
                const isEmail = fields.contact.input.value.includes('@');
                showToast(isEmail
                    ? 'Похоже, в e-mail опечатка. Пример: name@mail.ru'
                    : 'Введите телефон (например, +7 951 794-44-82) или e-mail');
                fields.contact.input.focus();
                return;
            }

            if (!checkbox.checked) {
                showToast('Остался один шаг — отметьте согласие на обработку персональных данных');
                return;
            }

            const sendBtn = form.querySelector('button[type="submit"]');
            sendBtn.disabled = true;

            try {
                const response = await fetch('/api/lead', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: fields.name.input.value.trim(),
                        contact: fields.contact.input.value.trim(),
                        project: project ? project.value.trim() : ''
                    })
                });
                const result = await response.json();
                if (result.ok) {
                    showToast('Спасибо! Заявка отправлена — свяжусь с вами в ближайшее время', 'success');
                    form.reset();
                    submitAttempted = false;
                    Object.keys(fields).forEach(key => {
                        fields[key].wrap.classList.remove('form__field--success', 'form__field--error');
                        delete fields[key].input.dataset.touched;
                    });
                    if (project) project.style.height = 'auto';
                } else {
                    showToast('Бот не принял заявку: ' + (result.error || 'неизвестная ошибка'));
                }
            } catch (err) {
                showToast('Не удалось отправить заявку. Попробуйте ещё раз чуть позже.');
            } finally {
                sendBtn.disabled = false;
            }
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
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

});