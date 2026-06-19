/** Sons discrets pour la messagerie (Web Audio — pas de fichiers externes). */

let audioCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) audioCtx = new Ctx();
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

export function isChatSoundsEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("freegeny_chat_sounds") !== "false";
}

export function setChatSoundsEnabled(enabled: boolean): void {
  localStorage.setItem("freegeny_chat_sounds", enabled ? "true" : "false");
}

/** À appeler après un clic utilisateur (politique autoplay des navigateurs). */
export function unlockChatSounds(): void {
  getContext();
}

function playTone(freq: number, durationSec: number, volume = 0.12, type: OscillatorType = "sine") {
  if (!isChatSoundsEnabled()) return;
  const ctx = getContext();
  if (!ctx) return;
  if (ctx.state === "suspended") void ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;
  osc.connect(gain);
  gain.connect(ctx.destination);
  const t0 = ctx.currentTime;
  osc.start(t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + durationSec);
  osc.stop(t0 + durationSec);
}

export function playSendSound(): void {
  unlockChatSounds();
  playTone(880, 0.08, 0.09);
  setTimeout(() => playTone(1175, 0.06, 0.07), 50);
}

export function playReceiveSound(): void {
  unlockChatSounds();
  playTone(520, 0.1, 0.1);
  setTimeout(() => playTone(780, 0.08, 0.08), 70);
}

export function playNotifySound(): void {
  playTone(660, 0.1, 0.05);
  setTimeout(() => playTone(880, 0.08, 0.04), 90);
}
