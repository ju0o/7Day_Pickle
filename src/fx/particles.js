/**
 * OneWord: Canvas Neon Particle Burst Engine
 * 순수 HTML5 Canvas 기반 네온 파티클 폭죽/스파크 애니메이션 엔진 (외부 라이브러리 제로)
 */

export class NeonParticleBurst {
  constructor(canvasId = "fxCanvas") {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.particles = [];
    this.animId = null;
    this.resize();

    if (typeof window !== "undefined") {
      window.addEventListener("resize", () => this.resize());
    }
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(x, y, colorHex = "#00e5ff", count = 45) {
    if (!this.canvas || !this.ctx) return;
    this.resize();

    const colors = [
      colorHex,
      "#ffffff",
      "#00e5ff",
      "#ff007f",
      "#ffb703"
    ];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      const size = Math.random() * 3.5 + 1.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const life = Math.random() * 35 + 30; // 프레임 수 (약 0.6 ~ 1.0초)

      this.particles.push({
        x: x || this.canvas.width / 2,
        y: y || this.canvas.height * 0.45,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5, // 약간 위로 튀어오름
        size,
        color,
        life,
        maxLife: life,
        alpha: 1
      });
    }

    if (!this.animId) {
      this.animate();
    }
  }

  animate() {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // 중력
      p.vx *= 0.98; // 공기 저항
      p.life--;
      p.alpha = Math.max(0, p.life / p.maxLife);

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = p.color;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(() => this.animate());
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.animId = null;
    }
  }
}
