"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2 } from "lucide-react";
import { onVoicesReady, pickSoftFemaleVoice } from "@/lib/voice";

/**
 * "Listen" — reads a lesson aloud using the browser's built-in speech synthesis. No servers,
 * no audio files. Made for the real use case: learning hands-free while feeding or walking.
 */
export function ListenButton({ text }: { text: string }) {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const chunks = useRef<string[]>([]);
  const idx = useRef(0);
  const voice = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    const stop = onVoicesReady(() => {
      voice.current = pickSoftFemaleVoice();
    });
    return () => {
      stop();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function speakNext() {
    if (idx.current >= chunks.current.length) {
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(chunks.current[idx.current]);
    // Soft, gentle female delivery — a little slower and higher than the default.
    if (!voice.current) voice.current = pickSoftFemaleVoice();
    if (voice.current) {
      u.voice = voice.current;
      u.lang = voice.current.lang;
    }
    u.rate = 0.95;
    u.pitch = 1.15;
    u.onend = () => {
      idx.current += 1;
      speakNext();
    };
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  }

  function toggle() {
    if (!supported) return;
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    // Split into sentence-ish chunks — long single utterances can be dropped by some engines.
    chunks.current = text
      .split(/(?<=[.!?])\s+/)
      .reduce<string[]>((acc, s) => {
        const last = acc[acc.length - 1];
        if (last && (last + " " + s).length < 220) acc[acc.length - 1] = last + " " + s;
        else acc.push(s);
        return acc;
      }, []);
    idx.current = 0;
    setSpeaking(true);
    synth.cancel();
    speakNext();
  }

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={speaking}
      className="inline-flex min-h-10 items-center gap-1.5 border-2 border-[var(--color-graphite)] bg-[var(--color-surface)] px-3 text-sm font-bold text-[var(--color-ink)] [border-radius:14px_9px_13px_10px/10px_13px_9px_14px] [box-shadow:2px_3px_0_rgba(58,50,40,0.15)]"
    >
      {speaking ? <Pause size={15} aria-hidden /> : <Play size={15} aria-hidden />}
      <Volume2 size={14} aria-hidden />
      {speaking ? "Stop" : "Listen"}
    </button>
  );
}
