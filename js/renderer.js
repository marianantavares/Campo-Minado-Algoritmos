// renderer.js
// Desenha o estado do Game no <canvas> usando sprites

import { formatTime } from './utils.js';

// Assumimos que sprites.png já está carregado como Image em main.js
let spriteSheet;

/**
 * Define qual Image usar como spritesheet.
 * Deve ser chamado antes de desenhar.
 */
export function setSpriteSheet(img) {
  spriteSheet = img;
}

/**
 * Desenha o mapa e o carrinho.
 * @param {Game} game
 * @param {CanvasRenderingContext2D} ctx
 */
export function draw(game, ctx) {
  const size = game.size;
  const tileW = ctx.canvas.width / size;
  const tileH = ctx.canvas.height / size;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const tile = game.map[y][x];
      let sx, sy;
      // Define origem no spritesheet de acordo com tipo
      switch (tile.type) {
        case 'bomb':       sx = 32; sy = 0; break;
        case 'shield':     sx = 64; sy = 0; break;
        default:           sx = 0;  sy = 0; break;
      }
      // Desenha o sprite do tile
      ctx.drawImage(spriteSheet, sx, sy, 32, 32, x*tileW, y*tileH, tileW, tileH);
    }
  }

  // Desenha o carrinho (sprite na posição 96,0 do sprite sheet)
  const px = game.player.x * tileW;
  const py = game.player.y * tileH;
  ctx.drawImage(spriteSheet, 96, 0, 32, 32, px, py, tileW, tileH);
}
