document.addEventListener('DOMContentLoaded', function () {

    /* ================== FAQ ACCORDION ================== */
    const faqItems = document.querySelectorAll('.faq__item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Закрываем все
            faqItems.forEach(i => i.classList.remove('active'));

            // Открываем текущий, если был закрыт
            if (!isActive) item.classList.add('active');
        });
    });

    /* ================== BURGER MENU ================== */
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav--open');
            burger.classList.toggle('burger--open');
        });

        // Закрываем при клике на ссылку
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav--open');
                burger.classList.remove('burger--open');
            });
        });
    }

    /* ================== FORM VALIDATION ================== */
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = form.name.value.trim();
            const phone = form.phone.value.trim();
            const checkbox = form.querySelector('input[type="checkbox"]');

            // Простая валидация
            if (name.length < 2) {
                alert('Пожалуйста, введите имя');
                return;
            }

            const phonePattern = /^[\d\s\+\-\(\)]{7,}$/;
            if (!phonePattern.test(phone)) {
                alert('Пожалуйста, введите корректный номер телефона');
                return;
            }

            if (!checkbox.checked) {
                alert('Необходимо согласие на обработку персональных данных');
                return;
            }

            // Здесь можно отправить данные на сервер
            console.log('Form submitted:', {
                name,
                phone,
                project: form.project.value.trim()
            });

            alert('Спасибо! Ваша заявка отправлена.');
            form.reset();
        });
    }

    /* ================== SMOOTH ANCHORS ================== */
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