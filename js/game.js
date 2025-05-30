// game.js
// Contém toda a lógica de "campo minado" com carrinho

import { randInt } from './utils.js';

// Classe base: cada elemento do map é um Tile (requisito 2: herança)
class Tile {
  constructor() {
    this.type = 'normal';
    this.revealed = false; // Adicionei esta propriedade para controle
  }
  // Método que define o que acontece quando o carrinho interage
  interact(player) {
    this.revealed = true; // Marca o tile como revelado
  }
}

// Tijolo explosivo (requisito 7)
class BombTile extends Tile {
  constructor() {
    super();
    this.type = 'bomb';
  }
  interact(player) {
    super.interact(player);
    if (player.shield > 0) {
      player.shield--;
    } else {
      player.damage++;
      player.bombsExploded++;
    }
  }
}

// Tijolo de força (requisito 8)
class ForceFieldTile extends Tile {
  constructor() {
    super();
    this.type = 'shield';
  }
  interact(player) {
    super.interact(player);
    player.shield++;
  }
}

// Representa o carrinho/jogador
class Player {
  constructor(maxDamage) {
    this.x = 0;
    this.y = 0;
    this.maxDamage = maxDamage;
    this.damage = 0;
    this.shield = 0;
    this.steps = 0;
    this.bombsExploded = 0;
    this.startTime = Date.now();
  }

  isAlive() {
    return this.damage < this.maxDamage;
  }

  elapsedTime() {
    return Math.floor((Date.now() - this.startTime) / 1000); // Convertido para segundos
  }
}

// Gerencia o estado do jogo
export class Game {
  constructor(size, maxDamage = 3) {
    this.size = size;
    this.player = new Player(maxDamage);
    this.map = this._createMap(size);
    this.finishX = size - 1;
    this.finishY = size - 1;
    this.gameOver = false; // Adicionei esta propriedade
  }

  // Cria e popula o mapa com tiles
  _createMap(size) {
    const map = new Array(size);
    for (let y = 0; y < size; y++) {
      map[y] = new Array(size);
      for (let x = 0; x < size; x++) {
        map[y][x] = new Tile();
      }
    }

    // Sorteia bombas (20% dos tijolos)
    const total = size * size;
    const numBombs = Math.floor(total * 0.2);
    
    for (let i = 0; i < numBombs; i++) {
      let bx, by;
      do {
        bx = randInt(0, size - 1);
        by = randInt(0, size - 1);
      } while ((bx === 0 && by === 0) || (bx === this.finishX && by === this.finishY));
      map[by][bx] = new BombTile();
    }

    // Sorteia shields (10% dos tijolos)
    const numShields = Math.floor(total * 0.1);
    for (let i = 0; i < numShields; i++) {
      let sx, sy;
      do {
        sx = randInt(0, size - 1);
        sy = randInt(0, size - 1);
      } while ((sx === 0 && sy === 0) || (sx === this.finishX && sy === this.finishY));
      map[sy][sx] = new ForceFieldTile();
    }

    // Adiciona tiles de início e fim
    map[0][0] = new StartTile();
    map[size - 1][size - 1] = new EndTile();

    return map;
  }

  move(dir) { // Removi o parâmetro 'jump'
    if (this.gameOver || !this.player.isAlive()) return;

    // Determina deslocamento
    const delta = { W:[0,-1], A:[-1,0], S:[0,1], D:[1,0] }[dir];
    if (!delta) return;

    const newX = this.player.x + delta[0];
    const newY = this.player.y + delta[1];

    // Checa limites do mapa
    if (newX < 0 || newX >= this.size || newY < 0 || newY >= this.size) return;

    // Atualiza posição e estatísticas
    this.player.x = newX;
    this.player.y = newY;
    this.player.steps++;

    // Interage com o tile (bombas, escudos ou normal)
    this.map[newY][newX].interact(this.player);

    // Verifica se o jogo acabou
    if (!this.player.isAlive() || 
       (this.player.x === this.finishX && this.player.y === this.finishY)) {
      this.gameOver = true;
    }
  }

  // Novo método para pular colisão
  skipCollision() {
    if (this.gameOver) return;
    const currentTile = this.map[this.player.y][this.player.x];
    currentTile.revealed = true;
  }

  // Verifica se o jogo acabou
  isOver() {
    return this.gameOver;
  }

  // Coleta stats pra renderizar na UI
  getStats() {
    return {
      steps: this.player.steps,
      health: this.player.maxDamage - this.player.damage,
      shield: this.player.shield,
      time: this.player.elapsedTime(),
      bombsExploded: this.player.bombsExploded
    };
  }
}

// Novas classes para tiles especiais
class StartTile extends Tile {
  constructor() {
    super();
    this.type = 'start';
    this.revealed = true;
  }
}

class EndTile extends Tile {
  constructor() {
    super();
    this.type = 'end';
    this.revealed = true;
  }
}