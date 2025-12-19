export class Enemy {
  constructor(canvas, boss = false) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.isBoss = boss;
    this.size = boss ? 30 : 16;
    this.maxHealth = boss ? 300 : 100;
    this.health = this.maxHealth;

    this.state = 'CHASE';
    this.staggered = false;
    this.speed = boss ? 0.12 : 0.15;
  }

  update(player) {
    if (this.health <= 0) return;

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy);

    if (!this.isBoss && this.health < 25) {
      this.state = 'FEAR';
      this.staggered = true;
    }

    const m = this.state === 'FEAR' ? -1 : 1;
    this.x += (dx / dist) * this.speed * 16 * m;
    this.y += (dy / dist) * this.speed * 16 * m;
  }

  canGloryKill(player) {
    return this.staggered &&
      Math.hypot(this.x - player.x, this.y - player.y) < 40;
  }

  gloryKill() {
    this.health = 0;
  }

  draw(ctx) {
    if (this.health <= 0) return;
    ctx.fillStyle = this.isBoss ? '#800'
      : this.staggered ? '#ff8800' : '#666';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
