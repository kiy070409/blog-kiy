import { posts } from './posts.js';

// --- Router System ---
class Router {
  constructor() {
    this.routes = {
      home: document.getElementById('home-view'),
      archive: document.getElementById('archive-view'),
      post: document.getElementById('post-view'),
    };
    this.init();
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  handleRoute() {
    const hash = window.location.hash || '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (hash === '#/') {
      this.showView('home');
      renderHomePosts();
    } else if (hash.startsWith('#/blog')) {
      const match = hash.match(/#\/blog\/(\d+)/);
      if (match) {
        this.showView('post');
        renderPostDetail(parseInt(match[1]));
      } else {
        this.showView('archive');
        renderArchive();
      }
    }
  }

  showView(viewName) {
    Object.keys(this.routes).forEach((name) => {
      const el = this.routes[name];
      if (name === viewName) {
        el.classList.remove('hidden');
        el.classList.add('fade-in');
      } else {
        el.classList.add('hidden');
        el.classList.remove('fade-in');
      }
    });
  }
}

// --- Render Logic ---

function renderHomePosts() {
  const container = document.getElementById('home-posts-container');
  if (!container) return;
  
  // Show only top 3 recent posts on home
  const recentPosts = [...posts].reverse().slice(0, 3);
  container.innerHTML = recentPosts.map(post => `
    <div class="py-12 group cursor-pointer border-b border-outline-variant/10" onclick="location.hash='#/blog/${post.id}'">
      <div class="flex justify-between items-baseline mb-4">
        <span class="font-label text-xs uppercase tracking-widest text-primary-dim">${post.date}</span>
        <span class="material-symbols-outlined text-outline-variant opacity-0 group-hover:opacity-100 transition-opacity">arrow_outward</span>
      </div>
      <h3 class="text-3xl font-headline text-on-background group-hover:italic transition-all">${post.title}</h3>
      <p class="mt-4 text-on-surface-variant max-w-lg font-body leading-relaxed">${post.summary}</p>
    </div>
  `).join('');
}

function renderArchive() {
  const container = document.getElementById('archive-posts-list');
  if (!container) return;

  container.innerHTML = posts.map(post => `
    <article class="py-10 border-b border-outline-variant/10 group cursor-pointer" onclick="location.hash='#/blog/${post.id}'">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex-1">
          <div class="flex gap-3 mb-2">
            ${post.tags.map(tag => `<span class="text-[10px] uppercase tracking-widest text-primary font-semibold">${tag}</span>`).join('')}
          </div>
          <h2 class="text-2xl md:text-3xl font-headline text-on-background group-hover:text-primary transition-colors">${post.title}</h2>
          <p class="mt-2 text-on-surface-variant font-body line-clamp-2">${post.summary}</p>
        </div>
        <div class="text-right">
          <span class="font-label text-sm text-outline-variant">${post.date}</span>
        </div>
      </div>
    </article>
  `).join('');
}

function renderPostDetail(postId) {
  const post = posts.find(p => p.id === postId);
  const container = document.getElementById('post-content');
  if (!container || !post) return;

  container.innerHTML = `
    <header class="mb-16">
      <div class="flex gap-4 mb-6">
        ${post.tags.map(tag => `<span class="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-xs font-label uppercase tracking-widest">${tag}</span>`).join('')}
      </div>
      <h1 class="text-4xl md:text-6xl font-headline text-on-background mb-8 leading-tight">${post.title}</h1>
      <div class="flex items-center gap-4 text-on-surface-variant font-label text-sm uppercase tracking-widest">
        <span>Inyoung Kim</span>
        <span class="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
        <span>${post.date}</span>
      </div>
    </header>
    <div class="prose prose-lg max-w-none font-body text-on-surface-variant leading-loose space-y-8">
      <p class="text-xl text-on-surface border-l-4 border-primary-container pl-6 italic mb-12">
        ${post.summary}
      </p>
      <div class="article-body text-lg">
        ${post.content.split('\n').map(p => `<p class="mb-6">${p}</p>`).join('')}
      </div>
    </div>
    <div class="mt-24 pt-12 border-t border-outline-variant/20 flex justify-between">
      <button onclick="window.history.back()" class="flex items-center gap-2 font-label text-sm uppercase tracking-widest text-primary hover:text-on-background transition-colors">
        <span class="material-symbols-outlined">arrow_back</span> Back to List
      </button>
      <button onclick="location.hash='#/'" class="font-label text-sm uppercase tracking-widest text-primary hover:text-on-background transition-colors">Home</button>
    </div>
  `;
}

// --- Initialization ---

// Initialize Router
const router = new Router();

// Mobile Menu Logic
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuLinks = mobileMenu.querySelectorAll('a');

const toggleMenu = (show) => {
  if (show) {
    mobileMenu.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  } else {
    mobileMenu.classList.add('hidden');
    document.body.style.overflow = '';
  }
};

if (mobileMenuBtn) mobileMenuBtn.onclick = () => toggleMenu(true);
if (closeMenuBtn) closeMenuBtn.onclick = () => toggleMenu(false);
mobileMenuLinks.forEach(link => {
  link.onclick = () => toggleMenu(false);
});

// Scroll Animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-visible');
    }
  });
}, { threshold: 0.1 });

const setupAnimations = () => {
  document.querySelectorAll('section, article').forEach(el => {
    el.classList.add('reveal-hidden');
    observer.observe(el);
    
    // Safety fallback: Reveal after 2 seconds if observer fails
    setTimeout(() => {
      el.classList.add('reveal-visible');
    }, 2000);
  });
};

setupAnimations();

// Style injection for animations
const style = document.createElement('style');
style.textContent = `
  .hidden { display: none !important; }
  .fade-in { animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .reveal-hidden {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .reveal-visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
  .prose p { margin-bottom: 1.5rem; }
`;
document.head.appendChild(style);

// Run initial route
router.handleRoute();
