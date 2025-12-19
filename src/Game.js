import { Player } from './Player.js';
import { Enemy } from './Enemy.js';
import { Arena } from './Arena.js';
import { TouchControls } from './TouchControls.js';

export class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;

    this.controls = new TouchControls(canvas);
    this.player = new Player(canvas, this.controls);
    this.arena = new Arena(canvas);

    this.enemies = [
      new Enemy(canvas),
      new Enemy(canvas),
      new Enemy(canvas),
      new Enemy(canvas),
      new Enemy(canvas),
      new Enemy(canvas, true) // Immortal Guard
    ];

    this.freeze = 0;
    this.shake = 0;
    this.lastTime = 0;

    canvas.addEventListener('touchstart', () => {
      this.player.dash();
      this.tryGloryKill();
    });
  }

  tryGloryKill() {
    this.enemies.forEach(e => {
      if (e.canGloryKill(this.player)) {
        e.gloryKill();
        this.freeze = 120;
        this.shake = 200;
        this.player.health = Math.min(100, this.player.health + 25);
      }
    });
  }

  start() {
    requestAnimationFrame(this.loop.bind(this));
  }

  loop(time) {
    const delta = time - this.lastTime;
    this.lastTime = time;

    if (this.freeze > 0) {
      this.freeze -= delta;
      this.render(true);
      requestAnimationFrame(this.loop.bind(this));
      return;
    }

    this.update(delta);
    this.render();
    requestAnimationFrame(this.loop.bind(this));
  }

  update(delta) {
    this.player.update(delta);
    this.enemies.forEach(e => e.update(this.player));
    if (this.shake > 0) this.shake -= delta;
  }

  render(freeze = false) {
    const ctx = this.ctx;
    ctx.save();

    if (this.shake > 0) {
      ctx.translate(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
    }

    this.arena.draw(ctx);
    this.player.draw(ctx);
    this.enemies.forEach(e => e.draw(ctx));
    this.controls.draw(ctx);

    ctx.restore();

    if (freeze) {
      ctx.fillStyle = 'rgba(255,0,0,0.2)';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}
