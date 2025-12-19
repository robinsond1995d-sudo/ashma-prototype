export default class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;

    this.shakeTime = 0;
    this.shakePower = 0;

    this.flashAlpha = 0;
    this.flashColor = "200,0,0";

    this.blood = [];

    this.freezeTime = 0;
  }

  triggerShake(power = 6, time = 120) {
    this.shakePower = power;
    this.shakeTime = time;
  }

  triggerFlash(color = "200,0,0", alpha = 0.4) {
    this.flashColor = color;
    this.flashAlpha = alpha;
  }

  hitFreeze(ms = 100) {
    this.freezeTime = Math.max(this.freezeTime, ms);
  }

  spawnBlood(x, y, count = 8) {
    for (let i = 0; i < count; i++) {
      this.blood.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        life: 600 + Math.random() * 400,
        r: 2 + Math.random() * 3
      });
    }
  }

  update(dt) {
    if (this.freezeTime > 0) {
      this.freezeTime -= dt;
      return;
    }

    if (this.shakeTime > 0) this.shakeTime -= dt;
    if (this.flashAlpha > 0) this.flashAlpha -= dt * 0.002;

    this.blood.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02;
      p.life -= dt;
    });

    this.blood = this.blood.filter(p => p.life > 0);
  }

  beginCamera() {
    this.ctx.save();
    if (this.shakeTime > 0) {
      const dx = (Math.random() - 0.5) * this.shakePower;
      const dy = (Math.random() - 0.5) * this.shakePower;
      this.ctx.translate(dx, dy);
    }
  }

  endCamera() {
    this.ctx.restore();
  }

  drawFX() {
    const { ctx, canvas } = this;

    // Blood
    ctx.fillStyle = "#6b0000";
    this.blood.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Flash
    if (this.flashAlpha > 0) {
      ctx.fillStyle = `rgba(${this.flashColor},${this.flashAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }
}
