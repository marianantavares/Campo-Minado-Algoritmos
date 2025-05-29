// utils.js
export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}