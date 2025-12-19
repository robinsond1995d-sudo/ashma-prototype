export class Arena {
  constructor(canvas) {
    this.canvas = canvas;
  }

  draw(ctx) {
    ctx.fillStyle = '#110000';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const g = ctx.createRadialGradient(
      this.canvas.width / 2,
      this.canvas.height / 2,
      100,
      this.canvas.width / 2,
      this.canvas.height / 2,
      this.canvas.width
    );
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
