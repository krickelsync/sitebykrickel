// Lightweight UI sound engine using Web Audio API — no asset files needed.
let ctx: AudioContext | null = null;
const KEY = "sbk-sound-enabled";

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const v = localStorage.getItem(KEY);
  if (v === null) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return !reduced;
  }
  return v === "1";
}

export function setSoundEnabled(on: boolean) {
  localStorage.setItem(KEY, on ? "1" : "0");
  window.dispatchEvent(new CustomEvent("sbk-sound-change", { detail: on }));
}

function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor: typeof AudioContext | undefined =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  return ctx;
}

function blip(freq: number, dur = 0.06, type: OscillatorType = "sine", gain = 0.04) {
  if (!isSoundEnabled()) return;
  const ac = ensureCtx();
  if (!ac) return;
  if (ac.state === "suspended") ac.resume();
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
  osc.connect(g).connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + dur);
}

export const playClick = () => blip(880, 0.05, "square", 0.03);
export const playSuccess = () => {
  blip(660, 0.08, "sine", 0.05);
  setTimeout(() => blip(990, 0.12, "sine", 0.05), 80);
};
export const playWhoosh = () => {
  if (!isSoundEnabled()) return;
  const ac = ensureCtx();
  if (!ac) return;
  if (ac.state === "suspended") ac.resume();
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(200, ac.currentTime);
  osc.frequency.exponentialRampToValueAtTime(60, ac.currentTime + 0.25);
  g.gain.value = 0.04;
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.3);
  osc.connect(g).connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + 0.3);
};

export function installGlobalClickSound() {
  if (typeof window === "undefined") return;
  if ((window as any).__sbkClickSound) return;
  (window as any).__sbkClickSound = true;
  document.addEventListener("click", (e) => {
    const t = e.target as HTMLElement | null;
    if (!t) return;
    if (t.closest("a, button, [role='button']")) playClick();
  });
}