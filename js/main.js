// main.js

const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const aboutModal = document.getElementById('about-modal');
const closeModal = document.getElementById('closeModal');
const startBtn = document.getElementById('startBtn');
const aboutBtn = document.getElementById('aboutBtn');
const restartBtn = document.getElementById('restartBtn');
const backBtn = document.createElement('button');
backBtn.innerText = 'Voltar';
backBtn.className = 'btn secondary';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let game = null;

// Eventos
startBtn.addEventListener('click', () => {
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  document.getElementById('info-panel').appendChild(backBtn);
  startGame();
});

aboutBtn.addEventListener('click', () => {
  aboutModal.classList.remove('hidden');
});

closeModal.addEventListener('click', () => {
  aboutModal.classList.add('hidden');
});

restartBtn.addEventListener('click', () => {
  endScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
});

backBtn.addEventListener('click', () => {
  gameScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
});

function startGame() {
  const size = parseInt(document.getElementById('size').value);
  game = new Game(size);
  resizeCanvas(size);
  gameLoop();
}

function resizeCanvas(size) {
  const tileSize = 40;
  canvas.width = size * tileSize;
  canvas.height = size * tileSize;
}

function gameLoop() {
  renderer.clear();
  renderer.drawGrid(game);
  requestAnimationFrame(gameLoop);
}

// renderer.js

const renderer = {
  clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  },

  drawGrid(game) {
    const tileSize = 40;
    for (let y = 0; y < game.size; y++) {
      for (let x = 0; x < game.size; x++) {
        ctx.strokeStyle = '#000';
        ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);

        const cell = game.map[y][x];
        if (cell === 'start') {
          ctx.fillStyle = 'green';
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        } else if (cell === 'end') {
          ctx.fillStyle = 'purple';
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        } else if (cell === 'bomb') {
          ctx.fillStyle = 'black';
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        } else if (cell === 'shield') {
          ctx.fillStyle = 'blue';
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
      }
    }

    // Player
    ctx.fillStyle = 'red';
    ctx.fillRect(game.player.x * tileSize, game.player.y * tileSize, tileSize, tileSize);
  }
};

// game.js

class Game {
  constructor(size) {
    this.size = size;
    this.map = this.generateMap(size);
    this.player = { x: 0, y: 0 };
  }

  generateMap(size) {
    const map = Array.from({ length: size }, () => Array(size).fill('empty'));

    map[0][0] = 'start';
    map[size - 1][size - 1] = 'end';

    // Bombas
    for (let i = 0; i < Math.floor(size * 1.5); i++) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      if (map[y][x] === 'empty') map[y][x] = 'bomb';
    }

    // Escudos
    for (let i = 0; i < Math.floor(size); i++) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      if (map[y][x] === 'empty') map[y][x] = 'shield';
    }

    return map;
  }
}