"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function SoundAmbienceToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const stopAmbience = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      // Smooth fade out
      gainNodeRef.current.gain.linearRampToValueAtTime(
        0.0001,
        audioCtxRef.current.currentTime + 1.2
      );
      setTimeout(() => {
        oscillatorsRef.current.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {
            // Ignore if already stopped
          }
        });
        oscillatorsRef.current = [];

        if (noiseSourceRef.current) {
          try {
            noiseSourceRef.current.stop();
            noiseSourceRef.current.disconnect();
          } catch {
            // Ignore
          }
          noiseSourceRef.current = null;
        }
      }, 1300);
    }
    setIsPlaying(false);
  };

  const startAmbience = async () => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;

      if (!AudioContextClass) return;

      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        audioCtxRef.current = new AudioContextClass();
      }

      if (audioCtxRef.current.state === "suspended") {
        await audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Harmonic chords for serene architectural contemplation: 216Hz, 324Hz, 432Hz (subtle warm drone)
      const frequencies = [216, 324, 432];
      oscillatorsRef.current = frequencies.map((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq + (idx === 1 ? 0.3 : -0.2), ctx.currentTime);

        oscGain.gain.setValueAtTime(0.02 / (idx + 1), ctx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();
        return osc;
      });

      // Filtered warm sea breeze noise buffer
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0,
        b1 = 0,
        b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.96 * b1 + white * 0.05;
        b2 = 0.88 * b2 + white * 0.05;
        output[i] = (b0 + b1 + b2) * 0.08;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.015, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(masterGain);
      whiteNoise.start();
      noiseSourceRef.current = whiteNoise;

      // Gentle fade in
      masterGain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 2.5);
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopAmbience();
    } else {
      startAmbience();
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <button
      onClick={toggleSound}
      type="button"
      aria-label={isPlaying ? "Mute architectural soundscape" : "Play ambient architectural soundscape"}
      className="relative flex items-center gap-2 rounded-full border border-[#B9D7E8]/20 bg-[#263C50]/60 px-3 py-1.5 backdrop-blur-md transition-all duration-300 hover:border-[#F6B99D]/60 hover:bg-[#263C50]/80 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F6B99D]"
    >
      <span className="relative flex h-3.5 w-3.5 items-center justify-center">
        {isPlaying ? (
          <Volume2 className="h-3.5 w-3.5 text-[#F6B99D] transition-transform duration-300 group-hover:scale-110" />
        ) : (
          <VolumeX className="h-3.5 w-3.5 text-[#B9D7E8]/70 transition-transform duration-300 group-hover:text-[#FFF9F4]" />
        )}
      </span>

      <span className="hidden sm:inline-block font-sans text-[10px] uppercase tracking-[0.2em] text-[#FFF9F4]/90">
        {isPlaying ? "Atmosphere · Live" : "Atmosphere · Off"}
      </span>

      {/* Subtle audio visualizer bars when playing */}
      {isPlaying && (
        <span className="flex items-end gap-0.5 h-3 ml-1" aria-hidden="true">
          <span className="w-0.5 bg-[#F6B99D] animate-[pulse_0.8s_ease-in-out_infinite] h-2 rounded-full" />
          <span className="w-0.5 bg-[#B9D7E8] animate-[pulse_1.2s_ease-in-out_infinite] h-3 rounded-full" />
          <span className="w-0.5 bg-[#FFF9F4] animate-[pulse_0.9s_ease-in-out_infinite] h-1.5 rounded-full" />
        </span>
      )}
    </button>
  );
}
