// js/main.js
import { Game } from './game.js';
import { formatTime, randInt } from './utils.js';
import { drawGrid } from './renderer.js';

const SPRITES = { // carrega as imagens que serao usadas no jogo
  tile: 'assets/tileDefault.png',
  bomb: 'assets/bomb.png',
  shield: 'assets/shield.png',
  start: 'assets/tileStart.png',
  end: 'assets/tileEnd.png',
  car: 'assets/car.png'
};

let sprites = {}; // Objeto para armazenar as sprites carregadas

function loadImage(src) { //se encarrega de carregar as imagens
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img); //se der eerro, resolve a promise com a imagem carregada
    img.onerror = reject;
    img.src = src;
  });
}

async function loadSprites() { // Função para carregar todas as sprites
  const promises = Object.entries(SPRITES).map(([key, src]) => 
    loadImage(src).then(img => { sprites[key] = img; })
  );
  await Promise.all(promises);
  console.log('Todas as sprites carregadas!');
}


// 1. Garanta que o DOM está completamente carregado
document.addEventListener('DOMContentLoaded', async () => {
  // Carregue as sprites antes de permitir jogar
  await loadSprites();

  // 2. Elementos DOM  - carrega os elementos do DOM que serão usados no jogo
  const startScreen = document.getElementById('start-screen');
  const gameScreen = document.getElementById('game-screen');
  const endScreen = document.getElementById('end-screen');
  const aboutModal = document.getElementById('about-modal');
  const closeModal = document.getElementById('closeModal');
  
  const startBtn = document.getElementById('startBtn');
  const aboutBtn = document.getElementById('aboutBtn');
  const restartBtn = document.getElementById('restartBtn');
  const sizeSelect = document.getElementById('size');
  
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  
  const stepsEl = document.getElementById('stepsCount');
  const healthEl = document.getElementById('health');
  const shieldEl = document.getElementById('shield');
  const timerEl = document.getElementById('timer');
  
  const skipBtn = document.getElementById('skipBtn');

  
  let game = null;
  let gameLoopId = null;
  let lastTime = 0;

  // botao jogar
  startBtn.addEventListener('click', () => { // quando clicar no botão Jogar
    console.log('Botão Jogar clicado!'); 
    
    startScreen.classList.add('hidden'); // Esconde a tela inicial
    gameScreen.classList.remove('hidden');// Mostra a tela do jogo
    
    const size = parseInt(sizeSelect.value, 10);
    console.log(`Iniciando jogo com tamanho: ${size}`);
    
    // Inicializa o jogo
    game = new Game(size, 3); // Cria uma nova instância do jogo com o tamanho selecionado e dano máximo de 3
    resizeCanvas(size); // Redimensiona o canvas para o tamanho do jogo
        
    // Inicia o game loop
    lastTime = performance.now(); 
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    gameLoopId = requestAnimationFrame(gameLoop);
  });

  // 5. Função resizeCanvas
  function resizeCanvas(size) { // Redimensiona o canvas de acordo com o tamanho do jogo
    const tileSize = 40;
    canvas.width = size * tileSize; // Define a largura do canvas
    canvas.height = size * tileSize;
    console.log(`Canvas redimensionado para: ${canvas.width}x${canvas.height}`); 
  }


  // 7. Game loop corrigido
  function gameLoop(timestamp) {
    if (!game) return;
    
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    // Atualiza o tempo do jogo
    if (!game.isOver()) {
      gameLoopId = requestAnimationFrame(gameLoop);
    }
    
    // Limpa e desenha com as sprites
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(game, ctx, sprites); // Passar sprites como parâmetro
    updateStats();

    
    // Verifica fim de jogo
    if (game.isOver()) {
      endGame();
    }
  }

  // 8. Atualizar estatísticas
  function updateStats() {
    if (!game) return;
    
    const s = game.getStats();
    stepsEl.textContent = s.steps;
    healthEl.textContent = s.health;
    shieldEl.textContent = s.shield;
    timerEl.textContent = formatTime(s.time);
  }

  // 9. Finalizar jogo
  function endGame() {
    console.log('Fim de jogo detectado');
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    
    const stats = game.getStats();
    document.getElementById('endTime').textContent = formatTime(stats.time);
    document.getElementById('bombCount').textContent = stats.bombsExploded;
    document.getElementById('endSteps').textContent = stats.steps;
    document.getElementById('resultText').textContent = 
      stats.health > 0 ? 'Você venceu!' : 'Game Over!';
  }

  // 10. Controles de teclado
  document.addEventListener('keydown', e => {
    if (!game || game.isOver()) return;
    
    const k = e.key.toUpperCase();
    if (['W','A','S','D'].includes(k)) {
      game.move(k);
      updateStats();
    }
  });

  // 11. Botão Pular
    // ...existing code...
  
  const jumpModal = document.getElementById('jumpModal');
  const closeJumpModal = document.getElementById('closeJumpModal');
  
  // 11. Botão Pular
  skipBtn.addEventListener('click', () => {
    if (game && !game.isOver()) {
      jumpModal.classList.remove('hidden');
    }
  });
  
  // Evento para botões de direção
  jumpModal.querySelectorAll('.jump-buttons button').forEach(btn => {
    btn.addEventListener('click', () => {
      const dir = btn.getAttribute('data-dir');
      game.jump(dir);
      updateStats();
      jumpModal.classList.add('hidden');
    });
  });
  
  // Evento para cancelar
  closeJumpModal.addEventListener('click', () => {
    jumpModal.classList.add('hidden');
  });
  
  // ...existing code...

  // 13. Fechar Modal
  closeModal.addEventListener('click', () => {
    aboutModal.classList.add('hidden');
  });

  // 14. Fechar modal ao clicar fora
  window.addEventListener('click', (e) => {
    if (e.target === aboutModal) {
      aboutModal.classList.add('hidden');
    }
  });

  // 15. Botão Reiniciar
  restartBtn.addEventListener('click', () => {
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    const size = game.size;
    game = new Game(size, 3);
    resizeCanvas(size);
    
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    lastTime = performance.now();
    gameLoopId = requestAnimationFrame(gameLoop);
  });

  // 16. Voltar ao Menu (da tela final)
  document.getElementById('backToMenuFromEnd').addEventListener('click', () => {
    endScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
  });

  console.log('Script carregado com sucesso!'); // Debug

  if (aboutBtn && aboutModal) {
    aboutBtn.addEventListener('click', () => {
      aboutModal.classList.remove('hidden');
    });
  }
});