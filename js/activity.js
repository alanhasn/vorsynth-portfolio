/* ═══════════════════════════════════════
   ACTIVITY.JS — Live activity log feed
   ═══════════════════════════════════════ */

(function () {
  const EVENTS = [
    { type: 'commit',  msgs: ['feat: async task scheduler refactor','fix: OTA broadcast for Android 13+','refactor: AI provider config merge','feat: Socket.IO device dispatch layer','chore: Redis connection pool tuning','fix: ASGI middleware ordering','feat: XSScan payload encoder v2','test: vulnerability scanner coverage'] },
    { type: 'deploy',  msgs: ['SMBN v2.4 → production','redis:7.2 container ↑ OK','django-asgi worker spawned','PostgreSQL replica synced','docker network vorsynth_net ↑'] },
    { type: 'scan',    msgs: ['XSS audit: 14 endpoints checked','SSL cert expiry check: 89d','CVE-2024-4... patched','dep scan: 0 critical, 2 medium','OWASP top-10 sweep complete'] },
    { type: 'alert',   msgs: ['Rate limit hit: 429 from 185.x.x.x','Unusual login attempt blocked','Port 22 probe detected — blocked'] },
  ];

  const MAX_LINES = 9;
  let feed, interval;

  function pad2(n) { return String(n).padStart(2, '0'); }
  function timestamp() {
    const d = new Date();
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
  }

  function randomEvent() {
    // Bias toward commit/deploy
    const weights = [0.45, 0.3, 0.18, 0.07];
    const r = Math.random();
    let acc = 0;
    for (let i = 0; i < weights.length; i++) {
      acc += weights[i];
      if (r < acc) return EVENTS[i];
    }
    return EVENTS[0];
  }

  function addLine() {
    if (!feed) return;
    const ev  = randomEvent();
    const msg = ev.msgs[Math.floor(Math.random() * ev.msgs.length)];
    const ts  = timestamp();

    const line = document.createElement('div');
    line.className = 'activity-line';
    line.style.animationDelay = '0ms';
    line.innerHTML =
      `<span class="act-time">${ts}</span>` +
      `<span class="act-type ${ev.type}">${ev.type.toUpperCase()}</span>` +
      `<span class="act-msg">${msg}</span>`;

    feed.appendChild(line);

    // Remove oldest if over limit
    const lines = feed.querySelectorAll('.activity-line');
    if (lines.length > MAX_LINES) lines[0].remove();
  }

  function start() {
    feed = document.getElementById('activity-feed');
    if (!feed) return;

    // Seed with initial lines
    for (let i = 0; i < 6; i++) {
      setTimeout(addLine, i * 120);
    }

    // Ongoing stream
    interval = setInterval(addLine, 2800 + Math.random() * 1200);
  }

  window.addEventListener('boot-complete', () => setTimeout(start, 600));
})();