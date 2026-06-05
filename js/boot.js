/* ═══════════════════════════════════════
   BOOT.JS — Boot sequence animation
   ═══════════════════════════════════════ */

const BOOT_LINES = [
  '[0.001] BIOS v4.2.1 — Vorsynth Systems',
  '[0.044] CPU: Backend-Core x8 @ 4.2GHz',
  '[0.091] RAM: 32GB DDR5 — OK',
  '[0.134] Loading kernel modules...',
  '[0.201] Mounting /proc/identity... OK',
  '[0.278] Mounting /etc/stack... OK',
  '[0.355] Mounting /var/projects... OK',
  '[0.412] Starting sshd... OK',
  '[0.489] Starting redis-server... OK',
  '[0.534] Starting postgresql@15... OK',
  '[0.611] Starting docker daemon... OK',
  '[0.688] Loading security modules...',
  '[0.744] sec_audit.ko loaded',
  '[0.801] net_monitor.ko loaded',
  '[0.878] Starting activity daemon... OK',
  '[0.921] Initializing network map... OK',
  '[0.967] All systems nominal.',
  '[1.002] VORSYNTH OS — Ready.',
];

function bootSequence() {
  const overlay  = document.getElementById('boot-overlay');
  const logEl    = document.getElementById('boot-log');
  const barEl    = document.getElementById('boot-bar');
  const pctEl    = document.getElementById('boot-pct');
  const statusEl = document.getElementById('boot-status');

  let lineIdx = 0;
  const total = BOOT_LINES.length;
  let timeoutId = 0;

  function finishBoot() {
    overlay.classList.add('hidden');
    window.dispatchEvent(new Event('boot-complete'));
  }

  function stopBoot() {
    clearTimeout(timeoutId);
    statusEl.textContent = 'BOOT SKIPPED — LAUNCHING INTERFACE';
    finishBoot();
  }

  function addLine() {
    if (lineIdx >= total) {
      // Done — fade out
      statusEl.textContent = 'BOOT COMPLETE — LAUNCHING INTERFACE';
      timeoutId = window.setTimeout(() => {
        finishBoot();
      }, 500);
      return;
    }

    const line = document.createElement('div');
    line.className = 'log-line';
    line.textContent = BOOT_LINES[lineIdx];
    logEl.appendChild(line);

    // Keep only last 7 lines visible
    const lines = logEl.querySelectorAll('.log-line');
    if (lines.length > 7) lines[0].remove();

    lineIdx++;
    const pct = Math.round((lineIdx / total) * 100);
    barEl.style.setProperty('--progress', pct + '%');
    pctEl.textContent = pct + '%';

    // Variable delay — feels organic
    const delay = lineIdx < 4 ? 120 : lineIdx < 10 ? 80 : lineIdx < 16 ? 60 : 150;
    timeoutId = window.setTimeout(addLine, delay + Math.random() * 40);
  }

  const skipBtn = document.getElementById('skip-boot');
  skipBtn?.addEventListener('click', stopBoot);

  // Small pause before starting
  timeoutId = window.setTimeout(addLine, 400);
}

document.addEventListener('DOMContentLoaded', bootSequence);