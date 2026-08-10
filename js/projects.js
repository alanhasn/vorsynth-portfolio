/* ═══════════════════════════════════════
   PROJECTS.JS — Live GitHub-driven renderer
   Pulls real public repos straight from the
   GitHub API. No curated/fake project data.
   ═══════════════════════════════════════ */

const GH_OWNER = 'alanhasn';
const GH_API   = 'https://api.github.com';
const MAX_PROJECTS = 10;

function projRelativeTime(isoString) {
  if (!isoString) return '--';
  const diff = Date.now() - new Date(isoString).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return 'today';
  if (days === 1) return '1d ago';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function activityStatus(repo) {
  if (repo.archived) return { cls: 'staging', label: 'ARCHIVED' };
  const days = repo.pushed_at ? (Date.now() - new Date(repo.pushed_at).getTime()) / 86400000 : Infinity;
  if (days < 30)  return { cls: 'online',  label: 'ACTIVE' };
  if (days < 180) return { cls: 'active',  label: 'MAINTAINED' };
  return { cls: 'staging', label: 'DORMANT' };
}

function isQualityRepo(repo) {
  return !repo.fork
    && repo.name.toLowerCase() !== GH_OWNER.toLowerCase()
    && !!repo.description;
}

/* Weighs real activity (recently pushed) alongside stars, so an
   actively-maintained project with few stars still outranks an old,
   abandoned one that happened to pick up a couple of stars early on. */
function repoScore(repo) {
  const days = repo.pushed_at ? (Date.now() - new Date(repo.pushed_at).getTime()) / 86400000 : 9999;
  const recencyScore = 100 / (1 + days / 14);
  return (repo.stargazers_count || 0) * 20 + recencyScore;
}

function rankRepos(repos) {
  return [...repos].sort((a, b) => repoScore(b) - repoScore(a));
}

async function fetchGithubRepos() {
  const res = await fetch(`${GH_API}/users/${GH_OWNER}/repos?per_page=100&sort=updated`);
  if (!res.ok) throw new Error(`GitHub repos request failed: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

async function fetchGithubUser() {
  const res = await fetch(`${GH_API}/users/${GH_OWNER}`);
  if (!res.ok) throw new Error(`GitHub user request failed: ${res.status}`);
  return res.json();
}

function buildProjectCard(repo, i) {
  const card = document.createElement('div');
  card.className = 'proj-card';
  card.style.animationDelay = `${i * 80}ms`;

  const status = activityStatus(repo);
  const topics = (repo.topics || []).slice(0, 5);
  const tagsHtml = topics.length
    ? topics.map(t => `<span class="proj-tag">${t}</span>`).join('')
    : (repo.language ? `<span class="proj-tag">${repo.language}</span>` : '');

  const metaRows = [
    repo.language ? { k: 'LANG', v: repo.language } : null,
    { k: 'STARS', v: `★ ${repo.stargazers_count} · ⑂ ${repo.forks_count}` },
    { k: 'PUSHED', v: projRelativeTime(repo.pushed_at) },
  ].filter(Boolean);
  const metaHtml = metaRows.map(m =>
    `<div class="proj-meta-row"><span class="proj-meta-key">${m.k}</span><span class="proj-meta-val">${m.v}</span></div>`
  ).join('');

  const hasExternalHomepage = repo.homepage && !repo.homepage.includes('github.com');
  const linkHtml = hasExternalHomepage
    ? `<a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="proj-link">LIVE ↗</a>`
    : `<a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="proj-link">REPO ↗</a>`;

  card.innerHTML = `
    <div class="proj-card-top">
      <div class="proj-status-dot ${status.cls}"></div>
      <span class="proj-name">${repo.name}</span>
      <span class="proj-type">${status.label}</span>
    </div>
    <div class="proj-card-body">
      <div class="proj-desc">${repo.description}</div>
      <div class="proj-meta">${metaHtml}</div>
      <div class="proj-tags">${tagsHtml}</div>
    </div>
    <div class="proj-footer">
      <span class="proj-uptime">${repo.archived ? 'ARCHIVED' : 'PUBLIC REPO'}</span>
      <span class="proj-type" style="color:var(--text-lo);font-size:9px;letter-spacing:.1em">${GH_OWNER}/${repo.name}</span>
      ${linkHtml}
    </div>`;

  return card;
}

function renderProjectState(message) {
  const grid = document.getElementById('proj-grid');
  if (!grid) return;
  grid.innerHTML = `<div class="proj-empty">${message}</div>`;
}

async function renderProjects() {
  const grid = document.getElementById('proj-grid');
  if (!grid) return;

  renderProjectState('▸ FETCHING PUBLIC REPOSITORIES FROM GITHUB…');

  try {
    const repos = await fetchGithubRepos();
    const ranked = rankRepos(repos.filter(isQualityRepo)).slice(0, MAX_PROJECTS);

    if (!ranked.length) {
      renderProjectState('NO PUBLIC REPOSITORIES FOUND.');
      return;
    }

    grid.innerHTML = '';
    ranked.forEach((repo, i) => grid.appendChild(buildProjectCard(repo, i)));
  } catch (err) {
    console.warn('Failed to load GitHub repos', err);
    renderProjectState('UNABLE TO REACH GITHUB API. TRY REFRESHING.');
  }
}

/* ── TELEMETRY (real GitHub account stats) ── */
function clampPct(value, max) {
  return Math.max(4, Math.min(100, Math.round((value / max) * 100)));
}

function setTelemetryCounter(id, target, barPct) {
  const el = document.getElementById(id);
  if (!el) return;
  el.dataset.target = target;
  const bar = el.parentElement?.querySelector('.telem-fill');
  if (bar && typeof barPct === 'number') bar.style.setProperty('--pct', `${barPct}%`);
}

async function renderTelemetry() {
  try {
    const [user, repos] = await Promise.all([fetchGithubUser(), fetchGithubRepos()]);
    const quality = repos.filter(isQualityRepo);
    const stars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
    const days = Math.floor((Date.now() - new Date(user.created_at).getTime()) / 86400000);

    setTelemetryCounter('telem-projects', quality.length, clampPct(quality.length, 20));
    setTelemetryCounter('telem-stars', stars, clampPct(stars, 40));
    const uptimeEl = document.getElementById('uptime-val');
    if (uptimeEl) uptimeEl.textContent = `${days}d`;

    if (typeof animateCounters === 'function') animateCounters();
  } catch (err) {
    console.warn('Failed to load GitHub telemetry', err);
  }
}

window.addEventListener('boot-complete', () => {
  setTimeout(renderProjects, 500);
  setTimeout(renderTelemetry, 500);
});
