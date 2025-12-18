export class MobileControls {
  constructor(player) {
    this.player = player;
    this.move = { x: 0, y: 0 };

    this.createJoystick();
  }

  createJoystick() {
    const base = document.createElement('div');
    const knob = document.createElement('div');

    Object.assign(base.style, {
      position: 'fixed',
      left: '20px',
      bottom: '20px',
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.1)',
      touchAction: 'none'
    });

    Object.assign(knob.style, {
      position: 'absolute',
      left: '40px',
      top: '40px',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.4)'
    });

    base.appendChild(knob);
    document.body.appendChild(base);

    base.addEventListener('touchmove', e => {
      const touch = e.touches[0];
      const rect = base.getBoundingClientRect();

      const x = (touch.clientX - rect.left - 60) / 60;
      const y = (touch.clientY - rect.top - 60) / 60;

      this.move.x = Math.max(-1, Math.min(1, x));
      this.move.y = Math.max(-1, Math.min(1, y));
    });

    base.addEventListener('touchend', () => {
      this.move.x = 0;
      this.move.y = 0;
    });
  }
}
