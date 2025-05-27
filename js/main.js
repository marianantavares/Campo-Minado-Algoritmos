// main.js
import { Game }       from './game.js';
import { formatTime } from './utils.js';

const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen   = document.getElementById('end-screen');
const aboutModal  = document.getElementById('about-modal');

const startBtn = document.getElementById('startBtn');

const sizeSelect  = document.getElementById('size');

const canvas      = document.getElementById('gameCanvas');
const ctx         = canvas.getContext('2d');

const stepsEl  = document.getElementById('stepsCount');
const healthEl = document.getElementById('health');
const shieldEl = document.getElementById('shield');
const timerEl  = document.getElementById('timer');

let game = null;

// inicia
startBtn.addEventListener('click', () => {
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  const size = parseInt(sizeSelect.value, 10);
  game = new Game(size, 3);
  resizeCanvas(size);
  // inicia contagem de tempo e loop de render
  requestAnimationFrame(gameLoop);
});

function resizeCanvas(size) {
  const tileSize = 40;
  canvas.width = size * tileSize;
  canvas.height = size * tileSize;
}

const backBtn = document.createElement('button');
backBtn.innerText = 'Voltar';
backBtn.className = 'btn secondary';

startBtn.addEventListener('click', () => {
  // ... mostra a tela de jogo ...
  document.getElementById('info-panel').appendChild(backBtn);
  startGame();
});

backBtn.addEventListener('click', () => {
  gameScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
});


function gameLoop() {
  // Limpa e redesenha o grid
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid(game);
  updateStats();

  if (!game.isOver()) {
    requestAnimationFrame(gameLoop);
  } else {
    // aqui você pode passar para a tela de fim de jogo
    console.log('Game Over!', game.getStats());
  }
}

//desenha o grid
function drawGrid(game) {
  const tileSize = 40;
  for (let y = 0; y < game.size; y++) {
    for (let x = 0; x < game.size; x++) {
      ctx.strokeStyle = '#000';
      ctx.strokeRect(x*tileSize, y*tileSize, tileSize, tileSize);

      const tile = game.map[y][x];
      switch (tile.type) {
        case 'bomb':   ctx.fillStyle = 'black';   break;
        case 'shield': ctx.fillStyle = 'blue';    break;
        default:       ctx.fillStyle = '#2d2d44'; break;
      }
      ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
    }
  }
  // carrinho
  ctx.fillStyle = 'red';
  ctx.fillRect(
    game.player.x * tileSize,
    game.player.y * tileSize,
    tileSize, tileSize
  );
}

// Atualiza os valores do painel
function updateStats() {
  const s = game.getStats();
  stepsEl.innerText  = s.steps;
  healthEl.innerText = s.health;
  shieldEl.innerText = s.shield;
  timerEl.innerText  = formatTime(s.time);
}

// Captura WASD
document.addEventListener('keydown', e => {
  if (!game || game.isOver()) return;
  const k = e.key.toUpperCase();
  if (['W','A','S','D'].includes(k)) {
    game.move(k);
    updateStats();
  }
});