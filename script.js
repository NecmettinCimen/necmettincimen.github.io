document.addEventListener('DOMContentLoaded', function () {

  // ─── Lucide icons ───────────────────────────────────────────────
  if (window.lucide) lucide.createIcons();
  if (typeof updateThemeIcon === 'function') updateThemeIcon();

  // ─── Scroll progress bar ────────────────────────────────────────
  const scrollBar = document.getElementById('scroll-progress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollBar) scrollBar.style.width = pct + '%';
  }

  // ─── Mobile menu ────────────────────────────────────────────────
  const mobileBtn  = document.getElementById('mobile-menu-btn');
  const mobileNav  = document.getElementById('mobile-nav');
  const hamburger  = document.getElementById('hamburger-icon');
  const closeIcon  = document.getElementById('close-icon');

  function closeMobileMenu() {
    if (!mobileNav) return;
    mobileNav.classList.add('hidden');
    mobileNav.classList.remove('flex');
    if (hamburger) hamburger.classList.remove('hidden');
    if (closeIcon) closeIcon.classList.add('hidden');
    if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
  }

  if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = !mobileNav.classList.contains('hidden');
      if (isOpen) {
        closeMobileMenu();
      } else {
        mobileNav.classList.remove('hidden');
        mobileNav.classList.add('flex');
        if (hamburger) hamburger.classList.add('hidden');
        if (closeIcon) closeIcon.classList.remove('hidden');
        mobileBtn.setAttribute('aria-expanded', 'true');
      }
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('#navbar')) closeMobileMenu();
    });
  }

  // ─── Active nav link on scroll ──────────────────────────────────
  const sections   = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    const scrollPos = window.scrollY + 120;
    let current = '';
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) current = sec.id;
    });
    desktopLinks.forEach(link => {
      const isActive = link.getAttribute('href') === '#' + current;
      link.classList.toggle('nav-link-active', isActive);
      link.classList.toggle('text-cyan-400', isActive);
      link.classList.toggle('text-gray-400', !isActive);
    });
  }

  // ─── Scroll event (throttled) ───────────────────────────────────
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        setActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  updateScrollProgress();
  setActiveLink();

  // ─── Smooth scroll ──────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.pageYOffset - 72;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

  // ─── Typewriter ─────────────────────────────────────────────────
  const typewriterEl = document.getElementById('typewriter-text');
  const phrases = [
    'Head of Software',
    'AI Solutions Architect',
    'Microservices & .NET Expert',
    'LLM Integration Specialist',
    'Team Lead & Mentor',
  ];
  let phraseIndex = 0, charIndex = 0, deleting = false;

  function type() {
    if (!typewriterEl) return;
    const phrase = phrases[phraseIndex];
    if (deleting) {
      charIndex--;
      typewriterEl.textContent = phrase.substring(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 40);
    } else {
      charIndex++;
      typewriterEl.textContent = phrase.substring(0, charIndex);
      if (charIndex === phrase.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
      setTimeout(type, 75);
    }
  }
  setTimeout(type, 800);

  // ─── Count-up animation ─────────────────────────────────────────
  const countEls = document.querySelectorAll('.count-up');
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '+';
      const duration = 1200;
      const step = Math.ceil(duration / target);
      let current = 0;
      const interval = setInterval(() => {
        current++;
        el.textContent = current + suffix;
        if (current >= target) {
          el.textContent = target + suffix;
          clearInterval(interval);
        }
      }, step);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  countEls.forEach(el => countObserver.observe(el));

  // ─── Language colour map ─────────────────────────────────────────
  const langColour = {
    'Go':         { bg: 'bg-teal-400/10',   text: 'text-teal-400',   border: 'border-teal-400/20'   },
    'C#':         { bg: 'bg-purple-400/10', text: 'text-purple-400', border: 'border-purple-400/20' },
    'TypeScript': { bg: 'bg-blue-400/10',   text: 'text-blue-400',   border: 'border-blue-400/20'   },
    'JavaScript': { bg: 'bg-yellow-400/10', text: 'text-yellow-400', border: 'border-yellow-400/20' },
    'SCSS':       { bg: 'bg-red-400/10',    text: 'text-red-400',    border: 'border-red-400/20'    },
    'CSS':        { bg: 'bg-pink-400/10',   text: 'text-pink-400',   border: 'border-pink-400/20'   },
    'HTML':       { bg: 'bg-orange-400/10', text: 'text-orange-400', border: 'border-orange-400/20' },
    'Java':       { bg: 'bg-amber-400/10',  text: 'text-amber-400',  border: 'border-amber-400/20'  },
    'C++':        { bg: 'bg-indigo-400/10', text: 'text-indigo-400', border: 'border-indigo-400/20' },
  };
  function langBadge(lang) {
    if (!lang) return '';
    const c = langColour[lang] || { bg: 'bg-gray-700/40', text: 'text-gray-400', border: 'border-gray-700' };
    return `<span class="px-2 py-0.5 rounded-md ${c.bg} ${c.text} text-xs font-mono border ${c.border}">${lang}</span>`;
  }

  // ─── Render repo card ────────────────────────────────────────────
  function repoCard(repo) {
    const topics = (repo.topics || []).slice(0, 5);
    const topicHtml = topics.map(t =>
      `<span class="px-2 py-0.5 rounded-md bg-gray-800 text-gray-500 text-xs">${t}</span>`
    ).join('');
    const demoLink = repo.homepage
      ? `<a href="${repo.homepage}" target="_blank" rel="noopener noreferrer"
           class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-cyan-400 transition-colors">
           <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
           Demo
         </a>`
      : '';
    return `
      <div class="repo-card bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-3
                  hover:border-cyan-400/50 hover:-translate-y-1 transition-all duration-300"
           data-topics="${(repo.topics || []).join(',')}">
        <div class="flex items-start justify-between gap-2">
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer"
             class="text-cyan-400 font-semibold text-sm hover:text-cyan-300 transition-colors leading-snug">${repo.name}</a>
          ${langBadge(repo.language)}
        </div>
        <p class="text-gray-400 text-xs leading-relaxed flex-1">${repo.description || 'No description available.'}</p>
        ${topicHtml ? `<div class="flex flex-wrap gap-1.5">${topicHtml}</div>` : ''}
        <div class="flex items-center gap-4 text-xs text-gray-600 pt-1">
          <span class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            ${repo.stargazers_count}
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
            ${repo.forks_count}
          </span>
        </div>
        <div class="flex gap-3 pt-1 border-t border-gray-800">
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer"
             class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-cyan-400 transition-colors">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            Code
          </a>
          ${demoLink}
        </div>
      </div>`;
  }

  // ─── Filter button helper ────────────────────────────────────────
  const ACTIVE_BTN   = 'border-cyan-400 bg-cyan-400 text-gray-950';
  const INACTIVE_BTN = 'border-gray-700 bg-gray-900 text-gray-400 hover:border-cyan-400/50 hover:text-cyan-400';

  function updateFilterBtns(active) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      const isActive = btn.getAttribute('data-filter') === active;
      btn.setAttribute('aria-selected', isActive);
      btn.className = `filter-btn px-4 py-2 rounded-full text-sm font-medium border cursor-pointer transition-all ${isActive ? ACTIVE_BTN : INACTIVE_BTN}`;
    });
  }

  function renderRepositories(repos) {
    const container = document.querySelector('.repos-container');
    if (!container) return;
    const visible = repos.filter(r => r.homepage);
    if (visible.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12 text-gray-500">
          <p class="text-sm">No projects with live demos for this filter.</p>
        </div>`;
      return;
    }
    container.innerHTML = visible.map(repoCard).join('');
    if (window.lucide) lucide.createIcons();
  }

  // ─── GitHub API fetch ────────────────────────────────────────────
  const username = 'necmettincimen';
  const reposContainer = document.querySelector('.repos-container');
  const filterButtonsEl = document.querySelector('.filter-buttons');

  if (reposContainer) {
    reposContainer.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-12 gap-3 text-gray-500">
        <svg class="w-8 h-8 animate-spin text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        <p class="text-sm">Loading projects…</p>
      </div>`;

    fetch(`https://api.github.com/users/${username}/repos?sort=created&per_page=100`)
      .then(res => {
        if (!res.ok) throw new Error('GitHub API ' + res.status);
        return res.json();
      })
      .then(repos => {
        const filtered = repos
          .filter(r => !r.fork)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 24);

        if (filtered.length === 0) {
          reposContainer.innerHTML = '<div class="col-span-full text-center py-8 text-gray-500 text-sm">No projects found.</div>';
          return;
        }

        const topicCounts = {};
        filtered.forEach(r => (r.topics || []).forEach(t => { topicCounts[t] = (topicCounts[t] || 0) + 1; }));
        const topTopics = Object.entries(topicCounts)
          .sort(([,a],[,b]) => b - a)
          .slice(0, 8)
          .map(([t]) => t);

        if (filterButtonsEl && topTopics.length > 0) {
          topTopics.forEach(topic => {
            const btn = document.createElement('button');
            btn.setAttribute('data-filter', topic);
            btn.setAttribute('role', 'tab');
            btn.setAttribute('aria-selected', 'false');
            btn.className = `filter-btn px-4 py-2 rounded-full text-sm font-medium border cursor-pointer transition-all ${INACTIVE_BTN}`;
            btn.textContent = `${topic} (${topicCounts[topic]})`;
            filterButtonsEl.appendChild(btn);
          });
        }

        window.allRepos = filtered;
        renderRepositories(filtered);

        document.querySelectorAll('.filter-btn').forEach(btn => {
          btn.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');
            updateFilterBtns(filter);
            renderRepositories(filter === 'all' ? window.allRepos :
              window.allRepos.filter(r => (r.topics || []).includes(filter)));
          });
        });
      })
      .catch(err => {
        console.error('Error fetching repos:', err);
        if (reposContainer) {
          reposContainer.innerHTML = `
            <div class="col-span-full text-center py-8 text-gray-500 text-sm">
              <p class="mb-2">Could not load projects from GitHub.</p>
              <a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer"
                 class="text-cyan-400 hover:text-cyan-300 underline underline-offset-2">
                Visit GitHub profile →
              </a>
            </div>`;
        }
      });
  }
});
