"use client";

import { useState, useRef, useEffect } from "react";
import { ArchitecturalHotspot } from "@/types";
import { X, Compass } from "lucide-react";

interface HotspotPinProps {
  hotspot: ArchitecturalHotspot;
  index: number;
}

export function HotspotPin({ hotspot, index }: HotspotPinProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside or escape key
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Adjust card position based on coordinates so it doesn't clip screen edges
  const isRightSide = hotspot.x > 60;
  const isBottomSide = hotspot.y > 60;

  return (
    <div
      ref={containerRef}
      className="absolute z-30 transition-transform duration-300"
      style={{
        left: `${hotspot.x}%`,
        top: `${hotspot.y}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Interactive Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={`View details about ${hotspot.title}`}
        className="relative group flex items-center justify-center p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F6B99D] rounded-full"
      >
        {/* Radar concentric pulse rings */}
        <span
          className="absolute inset-0 rounded-full bg-[#F6B99D]/20 animate-ping"
          style={{ animationDuration: "3s" }}
          aria-hidden="true"
        />
        <span
          className="absolute -inset-1.5 rounded-full border border-[#B9D7E8]/40 scale-75 group-hover:scale-125 transition-transform duration-500"
          aria-hidden="true"
        />

        {/* Central glowing core badge */}
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#263C50]/90 border border-[#F6B99D] text-[#FFF9F4] shadow-[0_0_18px_rgba(246,185,157,0.45)] backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-[#F6B99D] group-hover:text-[#263C50]">
          {isOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <span className="font-sans text-[11px] font-semibold tracking-wider">
              0{index + 1}
            </span>
          )}
        </span>

        {/* Subtle pill label hovering next to pin when closed */}
        {!isOpen && (
          <span className="absolute left-10 hidden md:flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#263C50]/80 border border-[#B9D7E8]/20 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[#FFF9F4]/90 backdrop-blur-md shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F6B99D]" />
            {hotspot.title}
          </span>
        )}
      </button>

      {/* Floating Architectural Detail Glass Popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={hotspot.title}
          className={`absolute z-40 w-72 sm:w-80 rounded-2xl p-5 shadow-[0_20px_50px_rgba(10,18,26,0.6)] backdrop-blur-2xl border border-[#B9D7E8]/30 bg-[#263C50]/95 text-[#FFF9F4] animate-in fade-in zoom-in-95 duration-200 ${
            isRightSide ? "right-0 -translate-x-4 sm:right-6 sm:translate-x-0" : "left-0 translate-x-4 sm:left-6 sm:translate-x-0"
          } ${
            isBottomSide ? "bottom-12" : "top-12"
          }`}
        >
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-[#B9D7E8]/15 pb-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#F6B99D]">
                <Compass className="h-3 w-3" />
                {hotspot.category}
              </span>
              <span className="text-[10px] text-[#B9D7E8]/60">·</span>
              <span className="text-[10px] font-mono text-[#B9D7E8]/80">
                HOTSPOT 0{index + 1}
              </span>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-[#B9D7E8]/60 hover:text-[#FFF9F4] p-1 rounded-full hover:bg-white/5 transition-colors"
              aria-label="Close detail modal"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="mt-3">
            <h4 className="font-serif text-lg font-medium tracking-wide text-[#FFF9F4] leading-snug">
              {hotspot.title}
            </h4>
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#B9D7E8]/90 font-sans mt-0.5">
              {hotspot.subtitle}
            </p>
            <p className="mt-2.5 text-xs text-[#FFF9F4]/80 leading-relaxed font-light">
              {hotspot.detail}
            </p>
          </div>

          {/* Footer Metric Tag */}
          {hotspot.metric && (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-[11px]">
              <span className="text-[10px] uppercase tracking-[0.16em] text-[#B9D7E8]/70">
                Architectural Spec
              </span>
              <span className="font-mono font-medium text-[#F6B99D]">
                {hotspot.metric}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
