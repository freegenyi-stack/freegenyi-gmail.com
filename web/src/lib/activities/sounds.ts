"use client";

let muted = false;

type SoundId =
  | "succes"
  | "erreur"
  | "flip"
  | "drop"
  | "match"
  | "tick"
  | "fanfare"
  | "tap"
  | "encourage";

const PATHS: Record<SoundId, string> = {
  succes: "/sounds/success.mp3",
  erreur: "/sounds/wrong.mp3",
  flip: "/sounds/flip.mp3",
  drop: "/sounds/drop.mp3",
  match: "/sounds/match.mp3",
  tick: "/sounds/tick.mp3",
  fanfare: "/sounds/fanfare.mp3",
  tap: "/sounds/tap.mp3",
  encourage: "/sounds/encourage.mp3",
};

/** Fréquences de secours si les MP3 ne sont pas déployés */
const SYNTH: Record<SoundId, { freq: number; duration: number; type?: OscillatorType }> = {
  succes: { freq: 880, duration: 0.12, type: "sine" },
  erreur: { freq: 220, duration: 0.18, type: "square" },
  flip: { freq: 520, duration: 0.08, type: "triangle" },
  drop: { freq: 340, duration: 0.1, type: "sine" },
  match: { freq: 660, duration: 0.14, type: "sine" },
  tick: { freq: 1000, duration: 0.04, type: "sine" },
  fanfare: { freq: 740, duration: 0.35, type: "sine" },
  tap: { freq: 480, duration: 0.05, type: "sine" },
  encourage: { freq: 392, duration: 0.2, type: "triangle" },
};

let howlerReady: typeof import("howler") | null = null;

async function loadHowler() {
  if (howlerReady) return howlerReady;
  howlerReady = await import("howler");
  return howlerReady;
}

function playSynth(id: SoundId) {
  if (typeof window === "undefined") return;
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const cfg = SYNTH[id];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = cfg.type ?? "sine";
    osc.frequency.value = cfg.freq;
    gain.gain.value = 0.15;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + cfg.duration);
    osc.stop(ctx.currentTime + cfg.duration + 0.02);
    setTimeout(() => void ctx.close(), (cfg.duration + 0.1) * 1000);
  } catch {
    /* ignore */
  }
}

export function setActivitySoundsMuted(value: boolean) {
  muted = value;
}

export function isActivitySoundsMuted() {
  return muted;
}

/** Joue un son MP3 si présent, sinon synthèse Web Audio légère. */
export async function playActivitySound(id: SoundId) {
  if (muted || typeof window === "undefined") return;
  try {
    const { Howl } = await loadHowler();
    const sound = new Howl({
      src: [PATHS[id]],
      volume: 0.7,
      html5: true,
      onloaderror: () => playSynth(id),
      onplayerror: () => playSynth(id),
    });
    sound.play();
  } catch {
    playSynth(id);
  }
}

export async function fireConfetti(kind: "success" | "perfect" = "success") {
  if (typeof window === "undefined") return;
  try {
    const confetti = (await import("canvas-confetti")).default;
    if (kind === "success") {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.8 },
        colors: ["#F97316", "#10B981", "#F59E0B", "#FB923C", "#34D399"],
      });
    } else {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          confetti({
            particleCount: 200,
            spread: 160,
            origin: { y: 0.6 },
            colors: ["#F97316", "#10B981", "#F59E0B", "#FB923C", "#34D399"],
          });
        }, i * 200);
      }
    }
  } catch {
    /* optional */
  }
}
