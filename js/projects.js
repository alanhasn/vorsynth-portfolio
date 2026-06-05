/* ═══════════════════════════════════════
   PROJECTS.JS — Deployed systems renderer
   ═══════════════════════════════════════ */

const PROJECTS = [
  {
    name:   'SMBN Command Center',
    type:   'DISTRIBUTED BACKEND',
    status: 'online',
    statusLabel: 'LIVE',
    desc:   'Smart Media Bot Network — multi-device orchestration platform with real-time WebSocket dispatch, automation rule engine, AI provider integration, and Android OTA delivery pipeline.',
    meta: [
      { k: 'STACK',  v: 'Django · ASGI · Redis · PostgreSQL · Socket.IO · Docker' },
      { k: 'ARCH',   v: 'Event-driven · Producer/Consumer · REST + WS hybrid' },
      { k: 'FEAT',   v: 'AI panel · Device registry · OTA system · Scheduler' },
    ],
    tags: ['Python', 'Django', 'Redis', 'Docker', 'Socket.IO', 'ASGI'],
    uptime: 'UPTIME 99.8%',
    link: null,
  },
  {
    name:   'XSScan',
    type:   'SECURITY TOOL · PyPI',
    status: 'online',
    statusLabel: 'PUBLISHED',
    desc:   'XSS vulnerability detection library published on PyPI. Automated payload injection, DOM analysis, and structured vulnerability reporting for Python web security audits.',
    meta: [
      { k: 'LANG',   v: 'Python' },
      { k: 'DIST',   v: 'PyPI — pip install xsscan' },
      { k: 'SCOPE',  v: 'Payload encoder · DOM inspector · Report generator' },
    ],
    tags: ['Python', 'Security', 'PyPI', 'XSS', 'OWASP'],
    uptime: 'STATUS ACTIVE',
    link: 'https://pypi.org/user/vorsynth',
  },
  {
    name:   'SecureTool',
    type:   'SECURITY LIBRARY · PyPI',
    status: 'online',
    statusLabel: 'PUBLISHED',
    desc:   'Reusable security primitives for Python applications. Encryption helpers, secure hashing, token generation, input validation, and audit-friendly logging utilities.',
    meta: [
      { k: 'LANG',   v: 'Python' },
      { k: 'DIST',   v: 'PyPI — pip install securetool' },
      { k: 'SCOPE',  v: 'Cryptography · Token auth · Input validation · Audit logs' },
    ],
    tags: ['Python', 'Cryptography', 'PyPI', 'Security', 'Auth'],
    uptime: 'STATUS ACTIVE',
    link: 'https://pypi.org/user/NobodyWhoami/',
  },
  {
    name:   'Vulnerability Scanner',
    type:   'SECURITY PLATFORM · WEB APP',
    status: 'active',
    statusLabel: 'IN DEV',
    desc:   'Automated web vulnerability scanning platform with structured report interface. Covers OWASP Top 10, HTTP header inspection, endpoint enumeration, and async scanning workers.',
    meta: [
      { k: 'STACK',  v: 'Python · Django · JavaScript · DRF' },
      { k: 'ARCH',   v: 'Django backend · REST API · Async scanner workers' },
      { k: 'SCOPE',  v: 'OWASP Top 10 · Header audit · Endpoint discovery' },
    ],
    tags: ['Django', 'OWASP', 'Security', 'Python', 'REST'],
    uptime: 'BUILD ACTIVE',
    link: null,
  },
  {
    name:   'Android OTA System',
    type:   'MOBILE INFRASTRUCTURE',
    status: 'active',
    statusLabel: 'INTEGRATED',
    desc:   'Over-the-air APK update delivery system integrated into SMBN. Streaming APK download, BroadcastReceiver fix for Android 13+, package installer intents, and version management.',
    meta: [
      { k: 'LANG',   v: 'Kotlin · Python (Django backend)' },
      { k: 'FEAT',   v: 'APK streaming · Android 13+ compat · Version control' },
      { k: 'INT',    v: 'SMBN backend · Device registry · Socket.IO events' },
    ],
    tags: ['Kotlin', 'Android', 'Django', 'OTA', 'Mobile'],
    uptime: 'UPTIME 99.5%',
    link: null,
  },
  {
    name:   'Backend API Systems',
    type:   'INFRASTRUCTURE LAYER',
    status: 'staging',
    statusLabel: 'ONGOING',
    desc:   'Collection of production-grade REST and WebSocket API systems built with Django, FastAPI, and DRF. Clean architecture, async-first, security hardened with rate limiting and auth layers.',
    meta: [
      { k: 'STACK',  v: 'Django · FastAPI · DRF · PostgreSQL · Redis' },
      { k: 'FEAT',   v: 'JWT auth · Rate limiting · ASGI · Async workers' },
      { k: 'FOCUS',  v: 'Clean arch · Security-first · Scalable design' },
    ],
    tags: ['Django', 'FastAPI', 'REST', 'PostgreSQL', 'Redis'],
    uptime: 'MULTI-SERVICE',
    link: 'https://github.com/alanhasn',
  },
];

function renderProjects() {
  const grid = document.getElementById('proj-grid');
  if (!grid) return;

  PROJECTS.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'proj-card';
    card.style.animationDelay = `${i * 80}ms`;

    const tagsHtml = p.tags.map(t => `<span class="proj-tag">${t}</span>`).join('');
    const metaHtml = p.meta.map(m =>
      `<div class="proj-meta-row"><span class="proj-meta-key">${m.k}</span><span class="proj-meta-val">${m.v}</span></div>`
    ).join('');
    const linkHtml = p.link
      ? `<a href="${p.link}" target="_blank" class="proj-link">VIEW ↗</a>`
      : `<span class="proj-link" style="border-color:var(--border);color:var(--text-lo);cursor:default;">PRIVATE</span>`;

    card.innerHTML = `
      <div class="proj-card-top">
        <div class="proj-status-dot ${p.status}"></div>
        <span class="proj-name">${p.name}</span>
        <span class="proj-type">${p.statusLabel}</span>
      </div>
      <div class="proj-card-body">
        <div class="proj-desc">${p.desc}</div>
        <div class="proj-meta">${metaHtml}</div>
        <div class="proj-tags">${tagsHtml}</div>
      </div>
      <div class="proj-footer">
        <span class="proj-uptime">${p.uptime}</span>
        <span class="proj-type" style="color:var(--text-lo);font-size:9px;letter-spacing:.1em">${p.type}</span>
        ${linkHtml}
      </div>`;

    grid.appendChild(card);
  });
}

window.addEventListener('boot-complete', () => setTimeout(renderProjects, 500));