const GITHUB_OWNER = 'alanhasn';
const GITHUB_API = 'https://api.github.com';

function formatNumber(value) {
  return typeof value === 'number' ? value.toLocaleString('en-US') : '--';
}

function relativeTime(isoString) {
  if (!isoString) return '--';
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function parseGithubEvents(events) {
  if (!Array.isArray(events)) return [];
  return events.slice(0, 5).map(ev => {
    const time = relativeTime(ev.created_at);
    if (ev.type === 'PushEvent' && ev.payload?.commits?.length) {
      return { type: 'PUSH', msg: ev.payload.commits[0].message, time };
    }
    if (ev.type === 'ReleaseEvent' && ev.payload?.release?.name) {
      return { type: 'RELEASE', msg: `Published ${ev.payload.release.name}`, time };
    }
    if (ev.type === 'CreateEvent') {
      return { type: 'CREATE', msg: `Created ${ev.payload.ref_type} ${ev.payload.ref || ''}`.trim(), time };
    }
    if (ev.type === 'IssuesEvent') {
      return { type: 'ISSUE', msg: `${ev.payload.action} issue #${ev.payload.issue?.number}`, time };
    }
    return { type: ev.type.replace(/Event$/, '').toUpperCase(), msg: `Activity on ${ev.repo?.name || 'repo'}`, time };
  });
}

function parseUptimeValue(text) {
  if (typeof text !== 'string') return null;
  const match = text.match(/(\d+(?:\.\d+)?)%/);
  return match ? Number(match[1]) : null;
}

function buildDeployHealth(projects) {
  const list = Array.isArray(projects) ? projects : [];
  const totalSystems = list.length;
  const liveSystems = list.filter(p => p.status === 'online').length;
  const healthNumbers = list
    .map(p => parseUptimeValue(p.uptime))
    .filter(n => typeof n === 'number');
  const averageUptime = healthNumbers.length
    ? `${(healthNumbers.reduce((sum, n) => sum + n, 0) / healthNumbers.length).toFixed(1)}%`
    : '99.1%';
  return { totalSystems, liveSystems, averageUptime };
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function renderEventList(events) {
  const list = document.getElementById('gh-event-list');
  if (!list) return;
  list.innerHTML = '';
  events.forEach(ev => {
    const row = document.createElement('div');
    row.className = 'status-event';
    row.innerHTML = `
      <span class="status-event-type">${ev.type}</span>
      <span class="status-event-msg">${ev.msg}</span>
      <span class="status-event-time">${ev.time}</span>
    `;
    list.appendChild(row);
  });
}

function renderRepoList(repos) {
  const container = document.getElementById('gh-repo-list');
  if (!container) return;
  container.innerHTML = '';
  repos.slice(0, 6).forEach(repo => {
    const card = document.createElement('div');
    card.className = 'repo-card';
    card.innerHTML = `
      <div class="repo-card-title">${repo.name}</div>
      <div class="repo-card-desc">${repo.description || 'No description available.'}</div>
      <div class="repo-card-meta">
        <span>★ ${repo.stargazers_count || 0}</span>
        <span>⚑ ${repo.open_issues_count || 0}</span>
        <span>${relativeTime(repo.pushed_at)}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderDeploySystems(projects) {
  const container = document.getElementById('deploy-system-list');
  if (!container) return;
  const list = Array.isArray(projects) ? projects : [];
  container.innerHTML = '';
  list.filter(p => p.status === 'online' || p.status === 'active').slice(0, 6).forEach(project => {
    const card = document.createElement('div');
    card.className = 'repo-card';
    card.innerHTML = `
      <div class="repo-card-title">${project.name}</div>
      <div class="repo-card-desc">${project.desc}</div>
      <div class="repo-card-meta">
        <span>${project.statusLabel}</span>
        <span>${project.uptime}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderGithubStatus(data, projects) {
  setText('gh-repo-count', formatNumber(data.repoCount));
  setText('gh-stars', formatNumber(data.stars));
  setText('gh-open-issues', formatNumber(data.openIssues));
  setText('gh-latest-push', data.latestPush || '--');
  setText('deploy-live', `${data.liveSystems}/${data.totalSystems}`);
  setText('deploy-uptime', data.averageUptime);
  setText('deploy-activity', data.activityLabel);
  renderEventList(data.events);
  renderRepoList(data.topRepos);
  renderDeploySystems(projects);
}

async function loadGitHubStatus() {
  const projects = Array.isArray(window.PROJECTS) ? window.PROJECTS : [];
  const health = buildDeployHealth(projects);
  const state = {
    repoCount: '--',
    stars: '--',
    openIssues: '--',
    latestPush: '--',
    events: [{ type: 'IDLE', msg: 'Waiting for GitHub response', time: '--' }],
    topRepos: [],
    liveSystems: health.liveSystems,
    totalSystems: health.totalSystems,
    averageUptime: health.averageUptime,
    activityLabel: 'Loading GitHub activity',
  };

  try {
    const [reposResp, eventsResp] = await Promise.all([
      fetch(`${GITHUB_API}/users/${GITHUB_OWNER}/repos?per_page=100&sort=updated&direction=desc`),
      fetch(`${GITHUB_API}/users/${GITHUB_OWNER}/events/public?per_page=6`),
    ]);

    if (reposResp.ok) {
      const repos = await reposResp.json();
      const repoList = Array.isArray(repos) ? repos : [];
      state.repoCount = repoList.length;
      state.stars = repoList.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
      state.openIssues = repoList.reduce((sum, repo) => sum + (repo.open_issues_count || 0), 0);
      const latest = repoList.find(repo => repo.pushed_at);
      state.latestPush = latest ? `${latest.name} · ${relativeTime(latest.pushed_at)}` : '--';
      state.topRepos = repoList.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
    }

    if (eventsResp.ok) {
      const events = await eventsResp.json();
      const parsed = parseGithubEvents(events);
      state.events = parsed.length ? parsed : [{ type: 'IDLE', msg: 'No recent public events', time: '--' }];
      state.activityLabel = parsed[0]?.msg || 'Recent GitHub activity';
    }
  } catch (err) {
    console.warn('GitHub status load failed', err);
    state.events = [{ type: 'ERROR', msg: 'Unable to load GitHub metrics', time: '--' }];
    state.activityLabel = 'Offline';
  }

  renderGithubStatus(state, projects);
}

window.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('status-page') || document.getElementById('gh-repo-count')) {
    loadGitHubStatus().catch(() => {});
  }
});
