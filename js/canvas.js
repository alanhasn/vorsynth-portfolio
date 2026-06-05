/* ═══════════════════════════════════════
   CANVAS.JS — Background grid + particles
   ═══════════════════════════════════════ */

(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: -9999, y: -9999 };
  const PARTICLE_COUNT = 60;
  const GRID_SIZE      = 48;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.vy = -(0.2 + Math.random() * 0.5);
      this.vx = (Math.random() - 0.5) * 0.2;
      this.r  = 0.8 + Math.random() * 1.2;
      this.life = 0;
      this.maxLife = 300 + Math.random() * 400;
      this.hue  = Math.random() > 0.7 ? 165 : 195; // cyan vs teal
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.life > this.maxLife || this.y < -10) this.reset();
    }
    draw() {
      const progress = this.life / this.maxLife;
      const alpha    = Math.sin(progress * Math.PI) * 0.5;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${alpha})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function drawGrid() {
    ctx.strokeStyle = 'rgba(15,32,64,0.6)';
    ctx.lineWidth   = 0.5;

    // Vertical lines
    for (let x = 0; x < W; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    // Horizontal lines
    for (let y = 0; y < H; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Mouse proximity glow on grid intersections
    const mx = mouse.x, my = mouse.y;
    const RADIUS = 120;
    ctx.fillStyle = 'rgba(0,217,255,0.25)';
    for (let x = 0; x < W; x += GRID_SIZE) {
      for (let y = 0; y < H; y += GRID_SIZE) {
        const d = Math.hypot(x - mx, y - my);
        if (d < RADIUS) {
          const a = (1 - d / RADIUS) * 0.5;
          ctx.globalAlpha = a;
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  function drawVignetteCorners() {
    // Corner accents
    const cornerSize = 40;
    const alpha      = 0.4;
    ctx.strokeStyle  = `rgba(0,217,255,${alpha})`;
    ctx.lineWidth    = 1;

    // Top-left
    ctx.beginPath(); ctx.moveTo(cornerSize, 0); ctx.lineTo(0, 0); ctx.lineTo(0, cornerSize); ctx.stroke();
    // Top-right
    ctx.beginPath(); ctx.moveTo(W - cornerSize, 0); ctx.lineTo(W, 0); ctx.lineTo(W, cornerSize); ctx.stroke();
    // Bottom-left
    ctx.beginPath(); ctx.moveTo(0, H - cornerSize); ctx.lineTo(0, H); ctx.lineTo(cornerSize, H); ctx.stroke();
    // Bottom-right
    ctx.beginPath(); ctx.moveTo(W - cornerSize, H); ctx.lineTo(W, H); ctx.lineTo(W, H - cornerSize); ctx.stroke();
  }

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, W, H);

    drawGrid();
    drawVignetteCorners();

    particles.forEach(p => { p.update(); p.draw(); });

    // Subtle horizontal scan line
    const scanY = (frame * 0.4) % H;
    const scanGrad = ctx.createLinearGradient(0, scanY - 4, 0, scanY + 4);
    scanGrad.addColorStop(0, 'transparent');
    scanGrad.addColorStop(0.5, 'rgba(0,217,255,0.04)');
    scanGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = scanGrad;
    ctx.fillRect(0, scanY - 4, W, 8);

    frame++;
    requestAnimationFrame(animate);
  }

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  window.addEventListener('resize', () => { resize(); initParticles(); });
  resize();
  initParticles();
  animate();
})();