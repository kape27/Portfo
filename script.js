// Menu mobile accessible
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const focusableSelector =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
let previousFocusedElement = null;

function closeMobileMenu() {
    if (!mobileMenu || !mobileMenuBtn) return;
    mobileMenu.classList.remove('active');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (previousFocusedElement && typeof previousFocusedElement.focus === 'function') {
        previousFocusedElement.focus();
    }
}

function openMobileMenu() {
    if (!mobileMenu || !mobileMenuBtn) return;
    previousFocusedElement = document.activeElement;
    mobileMenu.classList.add('active');
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const firstFocusable = mobileMenu.querySelector(focusableSelector);
    if (firstFocusable) firstFocusable.focus();
}

if (mobileMenuBtn && mobileMenu && mobileMenuClose) {
    mobileMenuBtn.addEventListener('click', openMobileMenu);
    mobileMenuClose.addEventListener('click', closeMobileMenu);

    document.querySelectorAll('#mobile-menu a[href^="#"]').forEach((link) => {
        link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    mobileMenu.addEventListener('keydown', (event) => {
        if (event.key !== 'Tab' || !mobileMenu.classList.contains('active')) return;
        const focusable = mobileMenu.querySelectorAll(focusableSelector);
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });
}

// Gestion du formulaire de contact
async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('form-message');

    const formData = {
        name: form.name.value,
        email: form.email.value,
        message: form.message.value
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Transmission en cours...';

    try {
        const response = await fetch('https://formsubmit.co/ajax/mbongo801@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Erreur envoi formulaire');

        messageDiv.className = 'p-4 border border-primary bg-primary/10 text-primary font-ui text-sm';
        messageDiv.textContent = 'Message envoye avec succes. Je vous repondrai rapidement.';
        messageDiv.classList.remove('hidden');
        form.reset();
    } catch {
        messageDiv.className = 'p-4 border border-red-500 bg-red-500/10 text-red-400 font-ui text-sm';
        messageDiv.textContent = 'Erreur lors de l envoi. Contact direct: mbongo801@gmail.com';
        messageDiv.classList.remove('hidden');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Envoyer Transmission';
        setTimeout(() => messageDiv.classList.add('hidden'), 5000);
    }
}

// Smooth scroll pour les ancres
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Barre de progression + bouton retour haut
const progressBar = document.getElementById('progress-bar');
const backToTopBtn = document.getElementById('back-to-top');

function handleScrollUI() {
    const doc = document.documentElement;
    const maxScroll = doc.scrollHeight - doc.clientHeight;
    const scrolled = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;

    if (progressBar) progressBar.style.width = `${scrolled}%`;
    if (backToTopBtn) {
        if (window.scrollY > 500) backToTopBtn.classList.add('visible');
        else backToTopBtn.classList.remove('visible');
    }
}

window.addEventListener('scroll', handleScrollUI, { passive: true });
handleScrollUI();

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Hero name reveal (letter by letter)
function initHeroNameReveal() {
    const heroName = document.getElementById('hero-name');
    if (!heroName) return;
    if (heroName.dataset.revealReady === 'true') return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lines = heroName.querySelectorAll('[data-reveal-text]');
    if (!lines.length) return;

    let charIndex = 0;

    lines.forEach((line) => {
        const lineOffset = Number(line.dataset.revealOffset || 0);
        const normalized = (line.textContent || '').replace(/\s+/g, ' ').trim();
        line.textContent = '';

        Array.from(normalized).forEach((char) => {
            const span = document.createElement('span');
            span.className = 'hero-char';
            span.style.setProperty('--char-index', String(charIndex));
            span.style.setProperty('--char-offset', String(lineOffset));
            charIndex += 1;

            if (char === ' ') {
                span.classList.add('is-space');
                span.textContent = '\u00A0';
            } else {
                span.textContent = char;
            }

            line.appendChild(span);
        });

        charIndex += 2;
    });

    heroName.dataset.revealReady = 'true';
}

function startHeroNameReveal() {
    const heroName = document.getElementById('hero-name');
    if (!heroName || heroName.dataset.revealStarted === 'true') return;

    heroName.dataset.revealStarted = 'true';
    requestAnimationFrame(() => {
        heroName.classList.add('hero-name-reveal-start');
    });
}

initHeroNameReveal();

// Animations au scroll
const cardsToReveal = document.querySelectorAll('section, .skill-card, .project-card');
if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.style.opacity = '1';
                entry.target.classList.add('fade-in-up');
                if (entry.target.id === 'accueil') {
                    startHeroNameReveal();
                }
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    cardsToReveal.forEach((node) => {
        node.style.opacity = '0';
        revealObserver.observe(node);
    });
} else {
    cardsToReveal.forEach((node) => {
        node.style.opacity = '1';
        node.classList.add('fade-in-up');
    });
    startHeroNameReveal();
}

// Tooltips
document.querySelectorAll('[data-tooltip]').forEach((element) => {
    element.classList.add('tooltip');
});

// Animation des barres de competences
const skillCards = document.querySelectorAll('.skill-card');
const skillBarSegments = document.querySelectorAll('.skill-card .h-1 > div');

function getTargetWidth(bar) {
    const widthClass = Array.from(bar.classList).find((cls) => /^w-\[(\d+%)]$/.test(cls));
    if (!widthClass) return '100%';
    return widthClass.match(/^w-\[(\d+%)]$/)[1];
}

skillBarSegments.forEach((bar) => {
    bar.dataset.targetWidth = getTargetWidth(bar);
    bar.style.width = '0%';
});

if ('IntersectionObserver' in window && skillCards.length) {
    const skillObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const bars = entry.target.querySelectorAll('.h-1 > div');
                bars.forEach((bar, index) => {
                    setTimeout(() => {
                        bar.style.transition = 'width 1s ease-out';
                        bar.style.width = bar.dataset.targetWidth || '100%';
                    }, index * 100);
                });
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.5 }
    );

    skillCards.forEach((card) => skillObserver.observe(card));
} else {
    skillBarSegments.forEach((bar) => {
        bar.style.width = bar.dataset.targetWidth || '100%';
    });
}

// Prechargement leger au hover
document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('mouseenter', function onMouseEnter() {
        this.style.willChange = 'transform, filter';
    });
    img.addEventListener('mouseleave', function onMouseLeave() {
        this.style.willChange = 'auto';
    });
});

// Copier l email au clic
const emailElement = document.querySelector('a[href^="mailto:"]');
if (emailElement) {
    emailElement.addEventListener('click', () => {
        const email = 'mbongo801@gmail.com';
        if (!navigator.clipboard) return;
        navigator.clipboard.writeText(email).then(() => {
            const emailText = emailElement.querySelector('p:last-child');
            if (!emailText) return;
            const originalText = emailText.textContent;
            emailText.textContent = 'Email copie.';
            setTimeout(() => {
                emailText.textContent = originalText;
            }, 2000);
        });
    });
}

// Mode navigation clavier
document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') document.body.classList.add('keyboard-nav');
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Lazy-load fallback
if (!('loading' in HTMLImageElement.prototype)) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}
