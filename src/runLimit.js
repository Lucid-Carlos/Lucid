// src/runLimit.js
// Controla las corridas gratis de "correr el prompt" via localStorage.
// Cuenta CADA generacion: la corrida inicial y cada refinamiento.

const KEY = "bd_runs_used";
export const FREE_RUNS = 5;

function usedCount() {
  const n = parseInt(localStorage.getItem(KEY), 10);
  return isNaN(n) ? 0 : n;
}

export function runsLeft() {
  return Math.max(0, FREE_RUNS - usedCount());
}

export function canRun() {
  return runsLeft() > 0;
}

// Suma una corrida. Regresa las corridas restantes despues de sumar.
// Llamar SOLO cuando la corrida fue exitosa.
export function recordRun() {
  const next = usedCount() + 1;
  localStorage.setItem(KEY, String(next));
  return Math.max(0, FREE_RUNS - next);
}
