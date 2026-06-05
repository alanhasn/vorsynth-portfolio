/* ═══════════════════════════════════════
   STACK.JS — Technology stack renderer
   ═══════════════════════════════════════ */

const STACK = [
  // Languages
  { name: 'Python',      icon: '🐍', cat: 'LANGUAGE',    level: 0.90, color: '#3776AB', accent: '#4ea6dc' },
  { name: 'Kotlin',      icon: '🟣', cat: 'LANGUAGE',    level: 0.55, color: '#7F52FF', accent: '#a07aff' },
  { name: 'JavaScript',  icon: '⚡', cat: 'LANGUAGE',    level: 0.65, color: '#F7DF1E', accent: '#ffe566' },
  { name: 'Bash',        icon: '▶', cat: 'LANGUAGE',    level: 0.75, color: '#00d9ff', accent: '#00d9ff' },
  { name: 'HTML',        icon: '🌐', cat: 'LANGUAGE',    level: 0.80, color: '#E34F26', accent: '#ff7040' },
  { name: 'CSS',         icon: '🎨', cat: 'LANGUAGE',    level: 0.70, color: '#1572B6', accent: '#2d9cdb' },
  // Frameworks
  { name: 'Django',      icon: '🎯', cat: 'FRAMEWORK',   level: 0.88, color: '#092E20', accent: '#00ff88' },
  { name: 'DRF',         icon: '🔌', cat: 'FRAMEWORK',   level: 0.85, color: '#a30000', accent: '#ff4444' },
  { name: 'FastAPI',     icon: '🚀', cat: 'FRAMEWORK',   level: 0.75, color: '#009688', accent: '#00e5cc' },
  { name: 'HTMX',        icon: '⚙', cat: 'FRAMEWORK',   level: 0.60, color: '#3366ff', accent: '#5588ff' },
  // Data
  { name: 'PostgreSQL',  icon: '🐘', cat: 'DATABASE',    level: 0.80, color: '#336791', accent: '#5591cc' },
  { name: 'Redis',       icon: '🔴', cat: 'DATABASE',    level: 0.78, color: '#DC382D', accent: '#ff5a50' },
  { name: 'SQLite',      icon: '📦', cat: 'DATABASE',    level: 0.72, color: '#003B57', accent: '#0077aa' },
  { name: 'MySQL',       icon: '🐬', cat: 'DATABASE',    level: 0.65, color: '#00758F', accent: '#00aacc' },
  // Infra
  { name: 'Docker',      icon: '🐳', cat: 'INFRA',       level: 0.80, color: '#2496ED', accent: '#5ab3ff' },
  { name: 'Linux',       icon: '🐧', cat: 'INFRA',       level: 0.85, color: '#FCC624', accent: '#ffd700' },
  { name: 'Git',         icon: '🌿', cat: 'INFRA',       level: 0.88, color: '#F05032', accent: '#ff7755' },
  { name: 'Postman',     icon: '📬', cat: 'INFRA',       level: 0.80, color: '#FF6C37', accent: '#ff8855' },
  // Security
  { name: 'XSScan',      icon: '🔍', cat: 'SECURITY',    level: 0.85, color: '#ff6b35', accent: '#ff6b35' },
  { name: 'SecureTool',  icon: '🔐', cat: 'SECURITY',    level: 0.82, color: '#ff6b35', accent: '#ff6b35' },
  // Mobile
  { name: 'Kotlin/Android', icon: '📱', cat: 'MOBILE',   level: 0.50, color: '#7F52FF', accent: '#a07aff' },
  { name: 'Android Studio', icon: '🛠', cat: 'MOBILE',   level: 0.48, color: '#3DDC84', accent: '#3DDC84' },
];

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function renderStack() {
  const grid = document.getElementById('stack-grid');
  if (!grid) return;

  STACK.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'stack-card';
    card.style.setProperty('--card-color',  hexToRgba(item.accent, 0.08));
    card.style.setProperty('--card-border', hexToRgba(item.accent, 0.35));
    card.style.setProperty('--card-accent', item.accent);
    card.style.animationDelay = `${i * 40}ms`;

    card.innerHTML = `
      <div class="stack-icon">${item.icon}</div>
      <div class="stack-name">${item.name}</div>
      <div class="stack-cat">${item.cat}</div>
      <div class="stack-level">
        <div class="stack-level-fill" style="width:${item.level * 100}%"></div>
      </div>`;

    // Mouse glow effect
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - rect.top)  / rect.height * 100) + '%');
    });

    grid.appendChild(card);

    // Intersection observer for level bar animation
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { card.classList.add('visible'); obs.disconnect(); }
      });
    }, { threshold: 0.2 });
    obs.observe(card);
  });
}

window.addEventListener('boot-complete', () => setTimeout(renderStack, 400));