/* ═══════════════════════════════════════
   NETWORK.JS — Animated node/edge map
   ═══════════════════════════════════════ */

(function () {
  let canvas, ctx, W, H, nodes = [], edges = [], animFrame;
  let initialized = false;

  const NODES = [
    { id: 'vorsynth', label: 'VORSYNTH',    type: 'core',     x: 0.5,  y: 0.5  },
    { id: 'django',   label: 'Django',      type: 'service',  x: 0.25, y: 0.25 },
    { id: 'drf',      label: 'DRF',         type: 'service',  x: 0.2,  y: 0.6  },
    { id: 'fastapi',  label: 'FastAPI',     type: 'service',  x: 0.3,  y: 0.78 },
    { id: 'redis',    label: 'Redis',       type: 'service',  x: 0.72, y: 0.22 },
    { id: 'postgres', label: 'PostgreSQL',  type: 'service',  x: 0.78, y: 0.5  },
    { id: 'docker',   label: 'Docker',      type: 'service',  x: 0.7,  y: 0.75 },
    { id: 'smbn',     label: 'SMBN',        type: 'service',  x: 0.45, y: 0.18 },
    { id: 'xsscan',   label: 'XSScan',      type: 'security', x: 0.15, y: 0.42 },
    { id: 'sectool',  label: 'SecureTool',  type: 'security', x: 0.82, y: 0.32 },
    { id: 'vuln',     label: 'VulnScanner', type: 'security', x: 0.6,  y: 0.15 },
    { id: 'linux',    label: 'Linux',       type: 'service',  x: 0.88, y: 0.7  },
  ];

  const EDGES = [
    ['vorsynth','django'],['vorsynth','drf'],['vorsynth','fastapi'],
    ['vorsynth','redis'],['vorsynth','postgres'],['vorsynth','smbn'],
    ['vorsynth','xsscan'],['vorsynth','sectool'],['vorsynth','vuln'],
    ['django','postgres'],['django','redis'],['fastapi','redis'],
    ['smbn','redis'],['smbn','docker'],['docker','linux'],
    ['sectool','vuln'],['xsscan','vuln'],
  ];

  const COLORS = {
    core:     '#00d9ff',
    service:  '#00ff88',
    security: '#ff6b35',
  };

  function init() {
    canvas = document.getElementById('network-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    buildGraph();
    initialized = true;
    animate();
  }

  function resize() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    W = canvas.width  = rect.width  || canvas.offsetWidth  || 300;
    H = canvas.height = rect.height || canvas.offsetHeight || 200;
    if (initialized) buildGraph();
  }

  function buildGraph() {
    nodes = NODES.map(n => ({
      ...n,
      px:    n.x * W,
      py:    n.y * H,
      vx:    (Math.random() - 0.5) * 0.3,
      vy:    (Math.random() - 0.5) * 0.3,
      pulse: Math.random() * Math.PI * 2,
    }));

    edges = EDGES.map(([a, b]) => ({
      a: nodes.find(n => n.id === a),
      b: nodes.find(n => n.id === b),
      progress: 0,
      speed: 0.003 + Math.random() * 0.004,
      active: false,
      timer: Math.random() * 200,
    }));
  }

  let frame = 0;
  function animate() {
    animFrame = requestAnimationFrame(animate);
    if (!ctx || !W || !H) return;
    ctx.clearRect(0, 0, W, H);

    frame++;

    // Soft drift
    nodes.forEach(n => {
      n.pulse += 0.04;
      n.px += n.vx;
      n.py += n.vy;

      const ox = n.x * W, oy = n.y * H;
      const dx = ox - n.px, dy = oy - n.py;
      n.vx += dx * 0.002;
      n.vy += dy * 0.002;
      n.vx *= 0.97;
      n.vy *= 0.97;

      n.px = Math.max(8, Math.min(W - 8, n.px));
      n.py = Math.max(8, Math.min(H - 8, n.py));
    });

    // Draw edges
    edges.forEach(e => {
      if (!e.a || !e.b) return;
      e.timer--;
      if (e.timer <= 0) {
        e.active   = true;
        e.progress = 0;
        e.timer    = 120 + Math.random() * 200;
      }
      if (e.active) e.progress = Math.min(1, e.progress + e.speed);
      if (e.progress >= 1) e.active = false;

      const ax = e.a.px, ay = e.a.py, bx = e.b.px, by = e.b.py;

      // Base edge
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.strokeStyle = 'rgba(15,32,64,0.9)';
      ctx.lineWidth   = 1;
      ctx.stroke();

      // Active packet
      if (e.active && e.progress > 0) {
        const px = ax + (bx - ax) * e.progress;
        const py = ay + (by - ay) * e.progress;

        // Glow trail
        const grad = ctx.createLinearGradient(ax, ay, px, py);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, 'rgba(0,217,255,0.5)');
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(px, py);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Packet dot
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#00d9ff';
        ctx.fill();
      }
    });

    // Draw nodes
    nodes.forEach(n => {
      const color  = COLORS[n.type];
      const isCore = n.type === 'core';
      const r      = isCore ? 6 : 4;
      const pulse  = Math.sin(n.pulse) * 0.5 + 0.5;

      // Glow ring
      const glowR = r + 4 + pulse * 4;
      ctx.beginPath();
      ctx.arc(n.px, n.py, glowR, 0, Math.PI * 2);
      ctx.fillStyle = color + Math.floor(pulse * 30).toString(16).padStart(2,'0');
      ctx.fill();

      // Node dot
      ctx.beginPath();
      ctx.arc(n.px, n.py, r, 0, Math.PI * 2);
      ctx.fillStyle   = color;
      ctx.shadowBlur  = 8;
      ctx.shadowColor = color;
      ctx.fill();
      ctx.shadowBlur  = 0;

      // Label
      ctx.font      = `${isCore ? '600' : '400'} ${isCore ? 10 : 8}px 'IBM Plex Mono', monospace`;
      ctx.fillStyle = isCore ? color : 'rgba(122,156,192,0.8)';
      ctx.textAlign = 'center';
      ctx.fillText(n.label, n.px, n.py - r - 5);
    });
  }

  window.addEventListener('boot-complete', () => {
    setTimeout(init, 200);
  });

  window.addEventListener('resize', resize);
})();