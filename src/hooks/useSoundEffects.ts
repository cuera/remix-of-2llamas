import { useState, useCallback, useRef, useEffect } from "react";

// Simple oscillator-based sound effects — no external files needed
const audioCtxRef = { current: null as AudioContext | null };

function getCtx() {
  if (!audioCtxRef.current) {
    audioCtxRef.current = new AudioContext();
  }
  return audioCtxRef.current;
}

function playTone(freq: number, duration: number, type: OscillatorType = "square", vol = 0.15) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = vol;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio not supported
  }
}

export function useSoundEffects() {
  const [muted, setMuted] = useState(true); // muted by default
  const mutedRef = useRef(muted);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  const playBloop = useCallback(() => {
    if (mutedRef.current) return;
    playTone(440, 0.12, "square", 0.1);
    setTimeout(() => playTone(520, 0.1, "square", 0.08), 60);
  }, []);

  const playDing = useCallback(() => {
    if (mutedRef.current) return;
    playTone(880, 0.15, "sine", 0.12);
    setTimeout(() => playTone(1100, 0.2, "sine", 0.1), 100);
  }, []);

  const playWahWah = useCallback(() => {
    if (mutedRef.current) return;
    playTone(300, 0.3, "sawtooth", 0.08);
    setTimeout(() => playTone(250, 0.3, "sawtooth", 0.07), 200);
    setTimeout(() => playTone(200, 0.5, "sawtooth", 0.06), 400);
  }, []);

  const playCelebration = useCallback(() => {
    if (mutedRef.current) return;
    const notes = [523, 659, 784, 1047];
    notes.forEach((n, i) => {
      setTimeout(() => playTone(n, 0.2, "sine", 0.1), i * 120);
    });
  }, []);

  const playDodge = useCallback(() => {
    if (mutedRef.current) return;
    playTone(300, 0.08, "square", 0.08);
    setTimeout(() => playTone(200, 0.1, "square", 0.06), 50);
  }, []);

  const playCountdown = useCallback(() => {
    if (mutedRef.current) return;
    playTone(440, 0.15, "sine", 0.1);
  }, []);

  return {
    muted,
    toggleMute: () => setMuted((m) => !m),
    playBloop,
    playDing,
    playWahWah,
    playCelebration,
    playDodge,
    playCountdown,
  };
}
