import { Game } from './Game.js';

const container = document.getElementById('game');
const game = new Game(container);

function loop(time) {
  game.update(time * 0.001);
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
