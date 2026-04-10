// ============================================================
// FreeGeny — Application JavaScript principale
// Alpine.js init + helpers globaux + navigation mobile
// ============================================================

// --- Alpine.js composant global ---
function freegenyApp() {
  return {
    // Dark mode (toujours activé par défaut)
    theme: 'dark',

    // Notification toast
    toast: { show: false, message: '', type: 'info', timer: null },

    showToast(message, type = 'success', duration = 4000) {
      clearTimeout(this.toast.timer);
      this.toast = { show: true, message, type };
      this.toast.timer = setTimeout(() => { this.toast.show = false; }, duration);
    },

    // Nav mobile
    mobileMenuOpen: false,
    toggleMobileMenu() { this.mobileMenuOpen = !this.mobileMenuOpen; },

    init() {
      // Lier hamburger natif
      const toggle = document.getElementById('nav-toggle');
      const menu   = document.getElementById('nav-menu');
      if (toggle && menu) {
        toggle.addEventListener('click', () => {
          menu.classList.toggle('open');
          toggle.setAttribute('aria-expanded', menu.classList.contains('open'));
        });
      }

      // Scrolled navbar effect
      const navbar = document.getElementById('main-nav');
      if (navbar) {
        window.addEventListener('scroll', () => {
          navbar.style.background = window.scrollY > 10
            ? 'rgba(10, 15, 30, 0.98)'
            : 'rgba(10, 15, 30, 0.9)';
        }, { passive: true });
      }

      // Animer les chiffres en comptant
      this.animateCounters();

      // Observer les éléments animés
      this.observeAnimations();
    },

    // Compteur animé pour les stats
    animateCounters() {
      document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count, 10);
        const duration = 1500;
        const start = performance.now();
        const update = (time) => {
          const elapsed = time - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          el.textContent = Math.round(eased * target).toLocaleString();
          if (progress < 1) requestAnimationFrame(update);
        };
        // Déclencher quand visible
        const observer = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) {
            requestAnimationFrame(update);
            observer.disconnect();
          }
        }, { threshold: 0.5 });
        observer.observe(el);
      });
    },

    // Animations au scroll (IntersectionObserver)
    observeAnimations() {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

      document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    },
  };
}

// ============================================================
// API helper — fetch JSON avec token CSRF
// ============================================================
async function apiFetch(url, options = {}) {
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';
  const defaults = {
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-Token': csrfToken,
    },
    credentials: 'same-origin',
  };
  const merged = {
    ...defaults,
    ...options,
    headers: { ...defaults.headers, ...(options.headers || {}) },
  };
  const res = await fetch(url, merged);
  const data = await res.json().catch(() => ({ error: 'Réponse invalide du serveur.' }));
  return { ok: res.ok, status: res.status, data };
}

// ============================================================
// Progress Ring SVG
// ============================================================
function updateProgressRing(svgEl, percent) {
  const circle = svgEl.querySelector('.progress-ring-fill');
  if (!circle) return;
  const r = parseFloat(circle.getAttribute('r'));
  const circumference = 2 * Math.PI * r;
  circle.style.strokeDasharray  = `${circumference}`;
  circle.style.strokeDashoffset = `${circumference - (percent / 100) * circumference}`;
}

// ============================================================
// Confetti (succès exercice)
// ============================================================
function triggerConfetti(container) {
  if (!container) container = document.body;
  const colors = ['#FF6B35', '#00C853', '#2196F3', '#FFD600', '#E040FB'];
  for (let i = 0; i < 80; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      top: ${Math.random() * 30}%;
      left: ${Math.random() * 100}%;
      z-index: 9999;
      pointer-events: none;
      animation: confettiFall ${Math.random() * 2 + 1.5}s ease-out forwards;
    `;
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 3500);
  }
}

// Injection keyframe confetti
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
  @keyframes confettiFall {
    0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(80vh) rotate(${Math.random() * 720}deg); opacity: 0; }
  }
`;
document.head.appendChild(confettiStyle);

// ============================================================
// Smooth scroll pour ancres
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Progress rings initiaux
  document.querySelectorAll('.progress-ring[data-percent]').forEach(ring => {
    updateProgressRing(ring, parseFloat(ring.dataset.percent));
  });
});
