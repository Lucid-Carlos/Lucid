// src/runLimit.js
// Controla las corridas gratis de "correr el prompt" via localStorage.
// Cuenta CADA generacion (corrida inicial + cada refinamiento).
// El limite se REINICIA al inicio de cada mes natural.

const KEY = "bd_runs";
export const FREE_RUNS = 5;

function currentPeriod() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; // ej. "2026-09"
}

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { period: currentPeriod(), used: 0 };
    const obj = JSON.parse(raw);
    // Si el mes guardado no es el actual, arranca de cero.
    if (!obj || obj.period !== currentPeriod()) {
      return { period: currentPeriod(), used: 0 };
    }
    return { period: obj.period, used: Number(obj.used) || 0 };
  } catch {
    return { period: currentPeriod(), used: 0 };
  }
}

export function runsLeft() {
  return Math.max(0, FREE_RUNS - read().used);
}

export function canRun() {
  return runsLeft() > 0;
}

// Suma una corrida. Regresa las corridas restantes despues de sumar.
// Llamar SOLO cuando la corrida fue exitosa.
export function recordRun() {
  const cur = read();
  const next = { period: cur.period, used: cur.used + 1 };
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  return Math.max(0, FREE_RUNS - next.used);
}
