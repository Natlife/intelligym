// Hamburger Menu Toggle Logic
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.desktop-nav');

menuBtn?.addEventListener('click', () => {
  const isOpen = menuBtn.classList.toggle('open');
  nav.classList.toggle('open');
  
  // Set aria-expanded for screen readers
  menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  
  // Toggle body scroll locking
  document.body.classList.toggle('nav-open', isOpen);
});

// Close Mobile Menu on Nav Click
document.querySelectorAll('.desktop-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    menuBtn?.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    document.body.classList.remove('nav-open');
  });
});

// Scroll Reveal Observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Futuristic ambient effects
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
  const root = document.documentElement;
  let rafId = 0;

  window.addEventListener('pointermove', (event) => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      root.style.setProperty('--cursor-x', `${event.clientX}px`);
      root.style.setProperty('--cursor-y', `${event.clientY}px`);
      rafId = 0;
    });
  }, { passive: true });

  const particleField = document.createElement('div');
  particleField.className = 'ai-particle-field';
  particleField.setAttribute('aria-hidden', 'true');

  const particleCount = window.innerWidth < 768 ? 18 : 34;
  for (let i = 0; i < particleCount; i += 1) {
    const particle = document.createElement('span');
    particle.className = 'ai-particle';
    particle.style.setProperty('--x', `${Math.random() * 100}%`);
    particle.style.setProperty('--y', `${Math.random() * 100}%`);
    particle.style.setProperty('--s', `${Math.random() * 3 + 1}px`);
    particle.style.setProperty('--dx', `${(Math.random() - 0.5) * 90}px`);
    particle.style.setProperty('--dy', `${(Math.random() - 0.5) * 90}px`);
    particle.style.setProperty('--d', `${Math.random() * 8 + 7}s`);
    particle.style.animationDelay = `${Math.random() * -10}s`;
    particleField.appendChild(particle);
  }

  document.body.prepend(particleField);

  const tiltTargets = document.querySelectorAll(
    '.feature-card, .audience-box, .process-card, .why-card, .pricing-card, .member, .hero-media, .solution-image'
  );

  tiltTargets.forEach((target) => {
    target.classList.add('is-tilting');

    target.addEventListener('pointermove', (event) => {
      const rect = target.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      const rotateX = (50 - y) / 18;
      const rotateY = (x - 50) / 18;

      target.style.setProperty('--mx', `${x}%`);
      target.style.setProperty('--my', `${y}%`);
      target.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    }, { passive: true });

    target.addEventListener('pointerleave', () => {
      target.style.removeProperty('transform');
      target.style.removeProperty('--mx');
      target.style.removeProperty('--my');
    });
  });
}
