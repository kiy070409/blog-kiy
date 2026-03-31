// Intersection Observer for scroll animations
const observerOptions = {
  root: null,
  threshold: 0.1,
  rootMargin: "0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');
    menuToggle.classList.toggle('toggle-active');
  });
}

// Header Scroll Effect
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.style.backgroundColor = 'rgba(10, 10, 12, 0.95)';
    header.style.padding = '0.5rem 0';
  } else {
    header.style.backgroundColor = 'rgba(10, 10, 12, 0.8)';
    header.style.padding = '0';
  }
});

// Initialize animations on load
document.addEventListener('DOMContentLoaded', () => {
  // Elements to animate
  const animateElements = [
    '.section-header', 
    '.about-grid', 
    '.project-card', 
    '.blog-item',
    '.contact-section .container'
  ];

  animateElements.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.classList.add('reveal-hidden');
      observer.observe(el);
    });
  });

  // Adding CSS for animations dynamically if not in style.css
  const style = document.createElement('style');
  style.textContent = `
    .reveal-hidden {
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .reveal-visible {
      opacity: 1;
      transform: translateY(0);
    }
    .nav-links.nav-active {
      display: flex !important;
      flex-direction: column;
      position: absolute;
      top: 80px;
      left: 0;
      width: 100%;
      background: var(--bg-color);
      padding: 2rem;
      border-bottom: 1px solid var(--card-border);
      gap: 1.5rem;
      text-align: center;
      animation: slideIn 0.3s ease forwards;
    }
    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .menu-toggle.toggle-active span:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }
    .menu-toggle.toggle-active span:nth-child(2) {
      opacity: 0;
    }
    .menu-toggle.toggle-active span:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -6px);
    }
  `;
  document.head.appendChild(style);
});
