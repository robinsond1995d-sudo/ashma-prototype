export default class Enemy {
  constructor(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.r = 12;

    this.hp = 40;
  }

  takeHit(dmg = 10) {
    this.hp -= dmg;

    this.game.spawnBlood(this.x, this.y, 10);
    this.game.triggerShake(6, 100);
    this.game.hitFreeze(110);

    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    this.game.spawnBlood(this.x, this.y, 24);
    this.game.triggerShake(10, 160);
  }

  update() {}

  draw(ctx) {
    ctx.fillStyle = "#4a2a2a";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }
}
