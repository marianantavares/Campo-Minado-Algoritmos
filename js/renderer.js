// renderer.js
export function drawGrid(game, ctx, sprites) {
  const tileSize = 40;
  const spriteSize = 32;

  for (let y = 0; y < game.size; y++) {
    for (let x = 0; x < game.size; x++) {
      ctx.drawImage(
        sprites.tile,
        x * tileSize,
        y * tileSize,
        tileSize,
        tileSize
      );

      const tile = game.map[y][x];

      if (tile.revealed) {
        switch (tile.type) {
          case 'bomb':
            ctx.drawImage(
              sprites.bomb,
              x * tileSize + (tileSize - spriteSize) / 2,
              y * tileSize + (tileSize - spriteSize) / 2,
              spriteSize,
              spriteSize
            );
            break;
          case 'shield':
            ctx.drawImage(
              sprites.shield,
              x * tileSize + (tileSize - spriteSize) / 2,
              y * tileSize + (tileSize - spriteSize) / 2,
              spriteSize,
              spriteSize
            );
            break;
          case 'start':
            ctx.drawImage(
              sprites.start,
              x * tileSize,
              y * tileSize,
              tileSize,
              tileSize
            );
            break;
          case 'end':
            ctx.drawImage(
              sprites.end,
              x * tileSize,
              y * tileSize,
              tileSize,
              tileSize
            );
            break;
        }
      }

      ctx.strokeStyle = '#000';
      ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  // Carrinho (após desenhar todos os tiles)
  ctx.drawImage(
    sprites.car,
    game.player.x * tileSize + (tileSize - spriteSize) / 2,
    game.player.y * tileSize + (tileSize - spriteSize) / 2,
    spriteSize,
    spriteSize
  );
}