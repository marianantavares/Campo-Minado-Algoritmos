// renderer.js
export function drawGrid(game, ctx, sprites) {
  const tileSize = 40;
  const spriteSize = 32;

  for (let y = 0; y < game.size; y++) {
    for (let x = 0; x < game.size; x++) {
        // desenha cada célula aqui
  }
      ctx.drawImage(
        sprites.tile,
        x * tileSize,
        y * tileSize,
        tileSize,
        tileSize
      );

      // pesquisa aqui qual é o bloco real de cada posiçao
      const tile = game.map[y][x];

      //NA HORA QUE PASSAMOS POR CIMA DO BLOCO, VERIFICAMOS SE ELE É true
      if (tile.revealed) {
        switch (tile.type) {
          case 'bomb':
            //DESENHA A BOMBA
            ctx.drawImage(
              sprites.bomb,
              x * tileSize + (tileSize - spriteSize) / 2,
              y * tileSize + (tileSize - spriteSize) / 2,
              spriteSize,
              spriteSize
            );
            break;
          case 'shield':
            //DESENHA O CAMPO DE FORÇA
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

      //Desenha as “linhas” de contorno em cada célula
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
