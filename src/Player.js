export default class Player {
  constructor(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.r = 10;

    this.vx = 0;
    this.vy = 0;

    this.speed = 2.2;

    this.dashCooldown = 0;
    this.dashTime = 0;
  }

  dash(dirX, dirY) {
    if (this.dashCooldown <= 0) {
      this.vx = dirX * 8;
      this.vy = dirY * 8;
      this.dashTime = 80;
      this.dashCooldown = 800;

      this.game.triggerShake(8, 90);
    }
  }

  hit() {
    this.game.triggerFlash("200,0,0", 0.45);
    this.game.triggerShake(5, 100);
    this.game.hitFreeze(90);
  }

  update(dt, input) {
    if (this.game.freezeTime > 0) return;

    if (this.dashCooldown > 0) this.dashCooldown -= dt;
    if (this.dashTime > 0) {
      this.dashTime -= dt;
      this.vx *= 0.92;
      this.vy *= 0.92;
    } else {
      this.vx = input.x * this.speed;
      this.vy = input.y * this.speed;
    }

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx) {
    ctx.fillStyle = "#222";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }
  }
