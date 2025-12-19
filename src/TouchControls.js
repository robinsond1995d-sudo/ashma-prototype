export class TouchControls {
  constructor(canvas) {
    this.active = false;
    this.startX = 0;
    this.startY = 0;
    this.dx = 0;
    this.dy = 0;
    this.maxDist = 50;

    canvas.addEventListener('touchstart', e => this.start(e), { passive: false });
    canvas.addEventListener('touchmove', e => this.move(e), { passive: false });
    canvas.addEventListener('touchend', () => this.end());
  }

  start(e) {
    const t = e.touches[0];
    if (t.clientX > window.innerWidth / 2) return;
    this.active = true;
    this.startX = t.clientX;
    this.startY = t.clientY;
  }

  move(e) {
    if (!this.active) return;
    const t = e.touches[0];
    this.dx = t.clientX - this.startX;
    this.dy = t.clientY - this.startY;

    const d = Math.hypot(this.dx, this.dy);
    if (d > this.maxDist) {
      this.dx = (this.dx / d) * this.maxDist;
      this.dy = (this.dy / d) * this.maxDist;
    }
  }

  end() {
    this.active = false;
    this.dx = 0;
    this.dy = 0;
  }

  getVector() {
    return { x: this.dx / this.maxDist, y: this.dy / this.maxDist };
  }

  draw(ctx) {
    if (!this.active) return;
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#500';
    ctx.beginPath();
    ctx.arc(this.startX, this.startY, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f00';
    ctx.beginPath();
    ctx.arc(this.startX + this.dx, this.startY + this.dy, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
      }
