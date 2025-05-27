// pasta usada para funções genéricas usadas em todo o jogo
/* Gera um inteiro aleatório entre min e max (inclusive).
 * Usamos Random clássico pra sortear posições de bombas e escudos.
 */

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Converte milissegundos em string MM:SS.
 * Usado no painel de tempo (requisito 9: exibir tempo decorrido).
 */

export function formatTime(ms) {
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000);
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

