/* ═══════════════════════════════════════
   MAIN.JS — Core orchestration
   ═══════════════════════════════════════ */

/* ── CUSTOM CURSOR ── */
(function () {
  const cur   = document.getElementById('cursor');
  const trail = document.getElementById('cursor-trail');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supportsFinePointer = window.matchMedia('(pointer:fine)').matches;
  let tx = 0, ty = 0, cx = 0, cy = 0;

  if (prefersReducedMotion || !cur || !trail || !supportsFinePointer) return;

  document.addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
    cur.style.left = tx + 'px';
    cur.style.top  = ty + 'px';
  });

  // Trail lerp
  function animTrail() {
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    trail.style.left = cx + 'px';
    trail.style.top  = cy + 'px';
    requestAnimationFrame(animTrail);
  }
  animTrail();

  document.querySelectorAll('a, button, .stack-card, .proj-card, .nav-tab, input').forEach(el => {
    el.addEventListener('mouseenter', () => cur.classList.add('hover'));
    el.addEventListener('mouseleave', () => cur.classList.remove('hover'));
  });
})();

/* ── LIVE CLOCK ── */
(function () {
  const el = document.getElementById('live-time');
  function tick() {
    const d = new Date();
    const h = String(d.getUTCHours()+3).padStart(2,'0');
    const m = String(d.getUTCMinutes()).padStart(2,'0');
    const s = String(d.getUTCSeconds()).padStart(2,'0');
    if (el) el.textContent = `${h}:${m}:${s}`;
  }
  tick();
  setInterval(tick, 1000);
})();

/* ── FAKE CPU METER ── */
(function () {
  const el = document.getElementById('cpu-val');
  let base = 18;
  function tick() {
    base += (Math.random() - 0.5) * 6;
    base  = Math.max(8, Math.min(62, base));
    if (el) el.textContent = Math.round(base);
  }
  tick();
  setInterval(tick, 1800);
})();

/* ── STATUS MESSAGE ROTATOR ── */
(function () {
  const msgs = [
    'SYSTEM OPERATIONAL',
    'ALL SERVICES NOMINAL',
    'SECURITY MODULES ACTIVE',
    'MONITORING ENABLED',
    'REDIS: CONNECTED',
    'POSTGRESQL: CONNECTED',
    'DOCKER DAEMON: RUNNING',
  ];
  const el = document.getElementById('status-msg');
  let i = 0;
  setInterval(() => {
    if (!el) return;
    i = (i + 1) % msgs.length;
    el.style.opacity = 0;
    setTimeout(() => {
      el.textContent = msgs[i];
      el.style.opacity = 1;
    }, 300);
  }, 4000);
  if (el) el.style.transition = 'opacity 0.3s';
})();

/* ── COUNTER ANIMATION ── */
function animateCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const dur    = 1500;
    const start  = performance.now();
    function update(now) {
      const pct = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - pct, 3);
      el.textContent = Math.round(ease * target);
      if (pct < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

/* ── SECTION NAVIGATION ── */
(function () {
  const tabs     = document.querySelectorAll('.nav-tab');
  const sections = document.querySelectorAll('.ws-section');
  const statusEl = document.getElementById('status-msg');
  const sectionOrder = ['overview', 'stack', 'ops', 'projects', 'terminal'];
  let countersAnimated = false;

  function activate(id, pushState = true) {
    const target = sectionOrder.includes(id) ? id : 'overview';

    tabs.forEach(t => {
      const isActive = t.dataset.section === target;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', String(isActive));
    });
    sections.forEach(s => {
      const active = s.id === target;
      s.classList.toggle('active', active);
    });

    if (pushState) {
      history.replaceState(null, '', `#${target}`);
    }

    // Special side effects
    if (target === 'overview' && !countersAnimated) {
      animateCounters();
      countersAnimated = true;
    }
    if (target === 'terminal') {
      setTimeout(() => document.getElementById('term-input')?.focus(), 100);
    }
    if (statusEl) {
      const labels = {
        overview: 'SYSTEM OVERVIEW',
        stack:    'TECHNOLOGY MATRIX',
        ops:      'OPERATIONAL PROFILE',
        projects: 'DEPLOYED SYSTEMS',
        terminal: 'TERMINAL ACTIVE',
      };
      statusEl.textContent = labels[target] || 'SYSTEM OPERATIONAL';
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activate(tab.dataset.section));
  });

  function getInitialSection() {
    const hash = window.location.hash.replace('#', '');
    return sectionOrder.includes(hash) ? hash : 'overview';
  }

  window.addEventListener('hashchange', () => {
    activate(window.location.hash.replace('#', ''), false);
  });

  document.addEventListener('keydown', e => {
    if (document.activeElement?.id === 'term-input') return;
    const map = { '1': 'overview', '2': 'stack', '3': 'ops', '4': 'projects', '5': 'terminal' };
    if (map[e.key]) return activate(map[e.key]);

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const activeId = Array.from(tabs).find(t => t.classList.contains('active'))?.dataset.section;
      if (!activeId) return;
      const idx = sectionOrder.indexOf(activeId);
      const next = e.key === 'ArrowRight' ? sectionOrder[idx + 1] : sectionOrder[idx - 1];
      if (next) activate(next);
    }
  });

  window.addEventListener('boot-complete', () => {
    const initial = getInitialSection();
    setTimeout(() => { activate(initial); }, 200);
    loadGitHubStatus().catch(() => {});
  });
})();

/* ── OPS DOMAINS ── */
(function () {
  const DOMAINS = [
    {
      icon: '⬡',
      name: 'BACKEND ENGINEERING',
      tag: 'PRIMARY',
      tagColor: '#00d9ff',
      skills: ['Django', 'FastAPI', 'DRF', 'ASGI', 'HTMX', 'REST APIs', 'WebSocket', 'Async Python', 'Clean Architecture', 'API Design'],
    },
    {
      icon: '🔐',
      name: 'SECURITY ENGINEERING',
      tag: 'SPECIALIZED',
      tagColor: '#ff6b35',
      skills: ['XSS Detection', 'Static Analysis', 'APK Forensics', 'SSL Pinning Bypass', 'OWASP Top 10', 'Threat Hunting', 'C2 Detection', 'Frida', 'reFlutter', 'Vulnerability Scanning'],
    },
    {
      icon: '⚙',
      name: 'DEVOPS & INFRASTRUCTURE',
      tag: 'ACTIVE',
      tagColor: '#00ff88',
      skills: ['Docker', 'Linux', 'Git', 'CI/CD', 'Process Automation', 'Server Hardening', 'Networking', 'Monitoring', 'PostgreSQL', 'Redis'],
    },
    {
      icon: '📱',
      name: 'ANDROID DEVELOPMENT',
      tag: 'LEARNING',
      tagColor: '#ffd700',
      skills: ['Kotlin', 'Android SDK', 'Jetpack Components', 'Gradle', 'ADB', 'OTA Systems', 'BroadcastReceiver', 'Android Internals', 'Mobile Security', 'Android Studio'],
    },
  ];

  function renderOps() {
    const container = document.getElementById('ops-domains');
    if (!container) return;

    DOMAINS.forEach(d => {
      const div = document.createElement('div');
      div.className = 'ops-domain';

      const skillsHtml = d.skills.map(s => `<span class="ops-skill">${s}</span>`).join('');
      div.innerHTML = `
        <div class="ops-domain-header">
          <span class="ops-domain-icon">${d.icon}</span>
          <span class="ops-domain-name">${d.name}</span>
          <span class="ops-domain-tag" style="color:${d.tagColor};border-color:${d.tagColor}">${d.tag}</span>
        </div>
        <div class="ops-skills">${skillsHtml}</div>`;

      container.appendChild(div);
    });
  }

  window.addEventListener('boot-complete', () => setTimeout(renderOps, 300));
})();