// game.js
// Contém toda a lógica de "campo minado" com carrinho

import { randInt } from './utils.js';

// Classe base: cada elemento do map é um Tile (requisito 2: herança)
class Tile {
  constructor() {
    this.type = 'normal';
  }
  // Método que define o que acontece quando o carrinho interage
  interact(player) {
    // NormalTile: nada acontece
  }
}

// Tijolo explosivo (requisito 7)
class BombTile extends Tile {
  constructor() {
    super();
    this.type = 'bomb';
  }
  interact(player) {
    // Se tiver escudo, consome 1 escudo (req 8)
    if (player.shield > 0) {
      player.shield--;
    } else {
      // Senão, aplica dano e conta bomba explodida (req 9, 10)
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
    // Aumenta escudo até um limite (pode definir limit dentro de Player)
    player.shield++;
  }
}

// Representa o carrinho/jogador
class Player {
  constructor(maxDamage) {
    this.x = 0;              // posição inicial (req 5)
    this.y = 0;
    this.maxDamage = maxDamage; // limite de avarias (req 7)
    this.damage = 0;         // avarias atuais
    this.shield = 0;         // força do escudo
    this.steps = 0;          // quantos tijolos andou (req 9)
    this.bombsExploded = 0;  // bombas detonadas
    this.startTime = Date.now();
  }

  // Verifica se o carro ainda está “vivo”
  isAlive() {
    return this.damage < this.maxDamage;
  }

  // Tempo decorrido desde o início (ms)
  elapsedTime() {
    return Date.now() - this.startTime;
  }
}

// Gerencia o estado do jogo
export class Game {
  constructor(size, maxDamage) {
    this.size = size;                  // tamanho do mapa (req 6)
    this.player = new Player(maxDamage);
    this.map = this._createMap(size);  // matriz Tile[][] (req 1,4)
    this.finishX = size - 1;           // ponto de chegada (req 5)
    this.finishY = size - 1;
  }

  // Cria e popula o mapa com tiles
  _createMap(size) {
    const map = new Array(size);
    for (let y = 0; y < size; y++) {
      map[y] = new Array(size);
      for (let x = 0; x < size; x++) {
        map[y][x] = new Tile();        // começa tudo normal
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
      } while (!(map[sy][sx] instanceof Tile));
      map[sy][sx] = new ForceFieldTile();
    }

    return map;
  }

  /**
   * Move o carrinho.
   * @param {string} dir - 'W','A','S','D'
   * @param {boolean} jump - se true, pula o próximo tile (req 9)
   */
  move(dir, jump = false) {
    if (!this.player.isAlive()) return;

    // Determina deslocamento
    const delta = { W:[0,-1], A:[-1,0], S:[0,1], D:[1,0] }[dir];
    if (!delta) return;

    // Se for pular, multiplica por 2
    const step = jump ? 2 : 1;
    const newX = this.player.x + delta[0] * step;
    const newY = this.player.y + delta[1] * step;

    // Checa limites do mapa
    if (newX < 0 || newX >= this.size || newY < 0 || newY >= this.size) return;

    // Atualiza posição e estatísticas
    this.player.x = newX;
    this.player.y = newY;
    this.player.steps++;

    // Interage com o tile (bombas, escudos ou normal)
    this.map[newY][newX].interact(this.player);
  }

  // Verifica se o jogo acabou
  isOver() {
    // Chegou ao final ou carro destruído
    return (!this.player.isAlive()) ||
           (this.player.x === this.finishX && this.player.y === this.finishY);
  }

  // Coleta stats pra renderizar na UI
  getStats() {
    return {
      steps: this.player.steps,
      health: this.player.maxDamage - this.player.damage,
      shield: this.player.shield,
      time: this.player.elapsedTime(),
      bombs: this.player.bombsExploded,
      success: (this.player.x === this.finishX && this.player.y === this.finishY)
    };
  }
}
