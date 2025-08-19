(function () {
  const root = document.documentElement;
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  const nav = document.getElementById('primary-navigation');
  const menuToggle = document.getElementById('menu-toggle');
  const themeToggle = document.getElementById('theme-toggle');
  const progress = document.querySelector('.scroll-progress span');

  // Theme toggle with persistence
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    root.setAttribute('data-theme', 'light');
  }
  themeToggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) {
      root.removeAttribute('data-theme');
      localStorage.removeItem('theme');
      themeToggle.querySelector('.icon').textContent = '🌙';
    } else {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      themeToggle.querySelector('.icon').textContent = '🌞';
    }
  });

  // Mobile menu toggle
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
  }

  // Close mobile nav on link click
  navLinks.forEach((a) => a.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle && menuToggle.setAttribute('aria-expanded', 'false');
  }));

  // Smooth scroll behavior
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || '';
      if (href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
        }
      }
    });
  });

  // Reveal on scroll
  const revealables = Array.from(document.querySelectorAll('[data-reveal]'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealables.forEach((el) => io.observe(el));

  // Active nav link based on scroll position
  const sectionIds = navLinks.map((a) => a.getAttribute('href')).filter(Boolean).filter((h) => h.startsWith('#'));
  const sections = sectionIds.map((id) => document.querySelector(id)).filter(Boolean);
  const updateActiveLink = () => {
    const fromTop = window.scrollY + 80;
    let currentId = '';
    for (const section of sections) {
      if (section.offsetTop <= fromTop) currentId = '#' + section.id;
    }
    navLinks.forEach((a) => a.removeAttribute('aria-current'));
    const active = navLinks.find((a) => a.getAttribute('href') === currentId);
    if (active) active.setAttribute('aria-current', 'page');
  };
  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();

  // Scroll progress indicator
  const onScroll = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progressWidth = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progress.style.width = progressWidth + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Copy to clipboard for contact
  document.querySelectorAll('.copy').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy') || '';
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = 'Copied!';
        setTimeout(() => (btn.textContent = 'Copy'), 1200);
      } catch (err) {
        console.error('Copy failed', err);
        btn.textContent = 'Failed';
        setTimeout(() => (btn.textContent = 'Copy'), 1200);
      }
    });
  });

  // Dynamic year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})(); 