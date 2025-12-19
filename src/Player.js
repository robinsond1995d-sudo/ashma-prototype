export class Player {
  constructor(canvas, controls) {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.size = 20;

    this.speed = 0.45;
    this.health = 100;
    this.controls = controls;

    this.dashCooldown = 0;
    this.isDashing = false;
  }

  dash() {
    if (this.dashCooldown > 0) return;
    const v = this.controls.getVector();
    this.x += v.x * 120;
    this.y += v.y * 120;
    this.dashCooldown = 800;
    this.isDashing = true;
  }

  update(delta) {
    const v = this.controls.getVector();
    this.x += v.x * this.speed * delta;
    this.y += v.y * this.speed * delta;

    if (this.dashCooldown > 0) this.dashCooldown -= delta;
    this.isDashing = false;
  }

  draw(ctx) {
    ctx.fillStyle = this.isDashing ? '#fff' : '#ff0000';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
