// game.js
// Contém toda a lógica de jogo

import { randInt } from './utils.js';
// importa a função randInt, que gera números aleatórios, usada aqui para sortear onde bombas
//  e escudos vão cair no tabuleiro.


// ESSA É A CLASSE BASE DO CODIGO, NO CASO O TIJOLO NORMAL
class Tile {
  constructor() {
    this.type = 'normal'; //INDICA QUE É UM TIJOLO NORMAL SEM BOMBA OU ESCUDO
    this.revealed = false; // COMEÇA ESCONDIDO SE TIVER ALGUMA BOMBA OU ESCUDO NAQUELA POSIÇAO
  }

  // Método que define o que acontece quando o carrinho interage, ENTAO fica revelado.
  interact(player) {
    this.revealed = true; 
  }
}

// Tijolo explosivo 
class BombTile extends Tile {
  constructor() {
    super();
    this.type = 'bomb';
  }
  interact(player) { //interação com o carrinho
    super.interact(player);
    if (player.shield > 0) { // Se o carrinho tiver escudo, ele perde um escudo
      player.shield--;
    } else {
      player.damage++; //se o jogador nao tiver escudo, ele toma dano
      player.bombsExploded++; // Conta quantas bombas explodiram
    }
  }
}

// Tijolo de força (requisito 8)
class ForceFieldTile extends Tile {
  constructor() {
    super();
    this.type = 'shield';// Indica que é um tijolo de escudo
  }
  interact(player) {
    super.interact(player);
    player.shield++; //o carrinho ganha um escudo extra para se proteger de bombas futuras
  }
}

// Representa o carrinho/jogador
class Player {
  constructor(maxDamage) {
    this.x = 0; // Posição inicial no eixo X
    this.y = 0;
    this.maxDamage = maxDamage; // Define o dano máximo que o carrinho pode receber, no caso é 3
    this.damage = 0; //quanto de dano o carrinho já tomou
    this.shield = 0; // Quantidade de escudos que o carrinho tem
    this.steps = 0; // Contador de passos do carrinho
    this.bombsExploded = 0; // Contador de bombas que explodiram
    this.startTime = Date.now(); // Marca o tempo de início do jogo
  }

  isAlive() {
    return this.damage < this.maxDamage; // Verifica se o carrinho ainda está vivo
  }

  elapsedTime() {
    return Math.floor((Date.now() - this.startTime) / 1000); // calcula quantos segundos se passaram desde o começo do jogo
  }
}

// Gerencia o estado do jogo
export class Game {
  constructor(size, maxDamage = 3) { 

    this.size = size; // Tamanho do tabuleiro 
    this.player = new Player(maxDamage); // Cria o jogador com dano máximo
    this.map = this._createMap(size); // Cria o tabuleiro com tiles
    this.finishX = size - 1; // Posição final no eixo X
    this.finishY = size - 1; // Posição final no eixo Y
    this.gameOver = false;  // Indica se o jogo acabou
  }

  // Cria o tabuleiro
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
    
    for (let i = 0; i < numBombs; i++) { // sorteia 20% dos tijolos para serem bombas
      
      let bx, by;
      do {
        bx = randInt(0, size - 1);
        by = randInt(0, size - 1);
      } while ((bx === 0 && by === 0) || (bx === this.finishX && by === this.finishY));
      //// Garante que a bomba não apareça na posição inicial (0,0) ou na posição final
      map[by][bx] = new BombTile();
    }

    // Sorteia shields 
    const numShields = Math.floor(total * 0.08); // 8% dos tijolos serão escudos
    for (let i = 0; i < numShields; i++) {
      let sx, sy;
      do {
        sx = randInt(0, size - 1);
        sy = randInt(0, size - 1);
      } while ((sx === 0 && sy === 0) || (sx === this.finishX && sy === this.finishY));
      map[sy][sx] = new ForceFieldTile();
    }

    // ponto de partida e chegada
    map[0][0] = new StartTile();
    map[size - 1][size - 1] = new EndTile();

    return map;
  }

  move(dir) { 
    if (this.gameOver || !this.player.isAlive()) return; // Se o jogo já acabou ou o carrinho está morto, não faz nada

  
    const delta = { W:[0,-1], A:[-1,0], S:[0,1], D:[1,0] }[dir]; // Mapeia as teclas W, A, S, D para movimentos no tabuleiro
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
    this.map[newY][newX].interact(this.player); //

    // Verifica se o jogo acabou
    if (!this.player.isAlive() || 
       (this.player.x === this.finishX && this.player.y === this.finishY)) { // Se o carrinho morreu ou chegou ao final, o jogo acaba
      this.gameOver = true; // Marca o jogo como acabado
    }
  }

  // Novo método para pular colisão
  skipCollision() {
    if (this.gameOver) return;
    const currentTile = this.map[this.player.y][this.player.x]; //
    currentTile.revealed = true;
  }

  // Novo método para pular um bloco em qualquer direção
  jump(dir) {
    if (this.gameOver || !this.player.isAlive()) return;

    // Determina deslocamento
    const delta = { W:[0,-1], A:[-1,0], S:[0,1], D:[1,0] }[dir];
    if (!delta) return;

    const newX = this.player.x + delta[0] * 2; // Multiplica por 2 para pular dois blocos
    const newY = this.player.y + delta[1] * 2;//

    // Checa limites do mapa
    if (newX < 0 || newX >= this.size || newY < 0 || newY >= this.size) return; 

    // Atualiza posição e estatísticas
    this.player.x = newX; 
    this.player.y = newY;
    this.player.steps++;

    // Interage apenas com o tile de destino
    this.map[newY][newX].interact(this.player); // 

    // Verifica se o jogo acabou
    if (!this.player.isAlive() || 
       (this.player.x === this.finishX && this.player.y === this.finishY)) {
      this.gameOver = true;
    }
  }

  // Verifica se o jogo acabou
  isOver() {
    return this.gameOver;
  }

  // Coleta stats pra renderizar na UI
  getStats() {
    return {
      steps: this.player.steps, // quantos passos o carrinho deu
      health: this.player.maxDamage - this.player.damage, // quanto de vida o carrinho tem
      shield: this.player.shield, // quantos escudos o carrinho tem
      time: this.player.elapsedTime(), //
      bombsExploded: this.player.bombsExploded // quantas bombas explodiram
    };
  }
}

// Novas classes para tiles especiais
class StartTile extends Tile {  // Representa o ponto de partida
  constructor() {
    super();
    this.type = 'start';
    this.revealed = true; //ja vem revelado
  }
}

class EndTile extends Tile { // Representa o ponto de chegada
  constructor() {
    super();
    this.type = 'end';
    this.revealed = true;
  }
}