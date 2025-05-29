// renderer.js
export function drawGrid(game, ctx) {
  const tileSize = 40;
  
  for (let y = 0; y < game.size; y++) {
    for (let x = 0; x < game.size; x++) {
      ctx.strokeStyle = '#000';
      ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);

      const tile = game.map[y][x];
      switch (tile.type) {
        case 'bomb':
          ctx.fillStyle = tile.revealed ? 'darkred' : 'black';
          break;
        case 'shield':
          ctx.fillStyle = tile.revealed ? 'lightblue' : 'blue';
          break;
        case 'start':
          ctx.fillStyle = 'green';
          break;
        case 'end':
          ctx.fillStyle = 'purple';
          break;
        default:
          ctx.fillStyle = tile.revealed ? '#4a4a6a' : '#2d2d44';
      }
      
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  // Carrinho
  ctx.fillStyle = 'red';
  ctx.fillRect(
    game.player.x * tileSize,
    game.player.y * tileSize,
    tileSize,
    tileSize
  );
}