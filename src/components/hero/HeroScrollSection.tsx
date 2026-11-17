"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SANCTUARIES } from "@/data/sanctuaries";
import { SanctuaryScene } from "@/types";
import { HotspotPin } from "@/components/ui/HotspotPin";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import {
  Compass,
  Sparkles,
  Maximize2,
  FileText,
  Calendar,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HeroScrollSection() {
  const [currentSanctuaryIndex, setCurrentSanctuaryIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Framing & typography refs
  const initialBrandRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const scrollPromptRef = useRef<HTMLDivElement>(null);

  // Revealed content refs
  const revealedContentRef = useRef<HTMLDivElement>(null);
  const revealedScrimRef = useRef<HTMLDivElement>(null);
  const hotspotsLayerRef = useRef<HTMLDivElement>(null);

  const sanctuary: SanctuaryScene = SANCTUARIES[currentSanctuaryIndex];

  // Handle switching sanctuaries with instant preloaded crossfade
  const handleSelectSanctuary = (index: number) => {
    if (index === currentSanctuaryIndex) return;
    setCurrentSanctuaryIndex(index);
  };

  useEffect(() => {
    // Check reduced-motion preference
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionQuery.addEventListener("change", handleMotionChange);

    const ctx = gsap.context(() => {
      if (motionQuery.matches) {
        // Reduced motion: Set elements to final visible state without scrub transforms
        if (portalRef.current) {
          gsap.set(portalRef.current, {
            width: "100vw",
            height: "100vh",
            borderRadius: "0px",
            maxWidth: "100%",
            maxHeight: "100%",
            marginTop: "0px",
          });
        }
        if (revealedContentRef.current) {
          gsap.set(revealedContentRef.current, { opacity: 1, y: 0, pointerEvents: "auto" });
        }
        if (revealedScrimRef.current) {
          gsap.set(revealedScrimRef.current, { opacity: 1 });
        }
        if (hotspotsLayerRef.current) {
          gsap.set(hotspotsLayerRef.current, { opacity: 1, pointerEvents: "auto" });
        }
        if (initialBrandRef.current) {
          gsap.set(initialBrandRef.current, { opacity: 0 });
        }
        if (leftCardRef.current) {
          gsap.set(leftCardRef.current, { opacity: 0 });
        }
        if (rightCardRef.current) {
          gsap.set(rightCardRef.current, { opacity: 0 });
        }
        setIsExpanded(true);
        return;
      }

      // Main GSAP ScrollTrigger Scrubbed Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=260%",
          pin: pinRef.current,
          scrub: 1.2,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            setScrollProgress(Math.round(p * 100));
            setIsExpanded(p > 0.42);
          },
        },
      });

      // 1. Initial State
      tl.set(revealedContentRef.current, { opacity: 0, y: 40, pointerEvents: "none" })
        .set(revealedScrimRef.current, { opacity: 0 })
        .set(hotspotsLayerRef.current, { opacity: 0, pointerEvents: "none" });

      // 2. Phase 1 (0% -> 45%): Portal expands seamlessly to 100vw x 100vh
      tl.to(
        portalRef.current,
        {
          width: "100vw",
          height: "100vh",
          maxWidth: "100%",
          maxHeight: "100%",
          marginTop: "0px",
          borderRadius: "0px",
          borderWidth: "0px",
          ease: "power2.inOut",
        },
        0
      )
        // Image counter-zoom / dolly optical effect
        .to(
          imageRef.current,
          {
            scale: 1.05,
            ease: "power2.inOut",
          },
          0
        )
        // Initial brand title and tagline gracefully lift & fade
        .to(
          initialBrandRef.current,
          {
            opacity: 0,
            y: -70,
            scale: 1.06,
            ease: "power2.in",
          },
          0.04
        )
        // Flanking metadata cards drift laterally and fade
        .to(
          leftCardRef.current,
          {
            opacity: 0,
            x: -80,
            ease: "power2.in",
          },
          0.02
        )
        .to(
          rightCardRef.current,
          {
            opacity: 0,
            x: 80,
            ease: "power2.in",
          },
          0.02
        )
        // Scroll prompt disappears
        .to(
          scrollPromptRef.current,
          {
            opacity: 0,
            y: 20,
            ease: "power2.in",
          },
          0
        );

      // 3. Phase 2 (45% -> 100%): Deep Brand Reveal & Editorial Scrim
      tl.to(
        revealedScrimRef.current,
        {
          opacity: 1,
          ease: "power1.out",
        },
        0.38
      )
        .to(
          revealedContentRef.current,
          {
            opacity: 1,
            y: 0,
            pointerEvents: "auto",
            ease: "power2.out",
          },
          0.48
        )
        .to(
          hotspotsLayerRef.current,
          {
            opacity: 1,
            pointerEvents: "auto",
            ease: "power2.out",
          },
          0.52
        );
    }, containerRef);

    // Refresh ScrollTrigger on resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      window.removeEventListener("resize", handleResize);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="sanctuary-scene"
      className="relative bg-[#263C50] text-[#FFF9F4] select-none"
      style={{ minHeight: prefersReducedMotion ? "100vh" : "340vh" }}
      aria-label="AVENORA Immersive Architectural Hero"
    >
      {/* Pinned Viewport Stage */}
      <div
        ref={pinRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-[#263C50]"
      >
        {/* Subtle Luxury Architectural Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#B9D7E8_1px,transparent_1px),linear-gradient(to_bottom,#B9D7E8_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-[#B9D7E8]/15" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full border border-[#B9D7E8]/10" />
        </div>

        {/* Ambient Warm Sunset Peach & Powder Blue Radial Glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[55vh] rounded-full bg-gradient-to-tr from-[#F6B99D]/15 via-[#B9D7E8]/10 to-transparent blur-[120px] pointer-events-none"
          aria-hidden="true"
        />

        {/* INITIAL STATE: Foreground Framing Typography & Brand Reveal */}
        <div
          ref={initialBrandRef}
          className="absolute inset-x-0 top-18 sm:top-20 md:top-22 z-20 flex flex-col items-center text-center px-4 pointer-events-none transition-opacity duration-300"
        >
          {/* Over-title badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#B9D7E8]/30 bg-[#263C50]/80 px-3.5 py-1 backdrop-blur-md shadow-lg">
            <Sparkles className="h-3 w-3 text-[#F6B99D]" />
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-[#FFF9F4]/90">
              COLLECTION 2026 // MONOGRAPH NO. 01
            </span>
          </div>

          {/* Majestic Hero Brand Headline & Tagline */}
          <div className="mt-3 sm:mt-4 max-w-4xl">
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-light tracking-[0.16em] uppercase text-[#FFF9F4] leading-[0.92] drop-shadow-2xl">
              AVENORA
            </h1>
            <p className="mt-2.5 sm:mt-3 font-serif text-lg sm:text-2xl lg:text-3xl italic tracking-wide text-[#F6B99D] font-light">
              Find a place that feels like you.
            </p>
          </div>
        </div>

        {/* INITIAL STATE: Flanking Left Architectural Metadata Card */}
        <div
          ref={leftCardRef}
          className="absolute left-6 lg:left-12 bottom-24 z-20 hidden md:block max-w-xs pointer-events-none"
        >
          <div className="rounded-2xl border border-[#B9D7E8]/20 bg-[#263C50]/80 p-5 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#F6B99D] font-mono">
              <Compass className="h-3 w-3" />
              <span>Current Focus · 0{currentSanctuaryIndex + 1}</span>
            </div>
            <h3 className="font-serif text-xl font-normal text-[#FFF9F4] mt-2">
              {sanctuary.title}
            </h3>
            <p className="font-sans text-xs text-[#B9D7E8]/80 mt-1 leading-relaxed">
              {sanctuary.location}
            </p>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#FFF9F4]/70">
              <span>{sanctuary.coordinates}</span>
              <span className="text-[#F6B99D] font-medium">{sanctuary.valuation}</span>
            </div>
          </div>
        </div>

        {/* INITIAL STATE: Flanking Right Discoveries Card */}
        <div
          ref={rightCardRef}
          className="absolute right-6 lg:right-12 bottom-24 z-20 hidden md:block max-w-xs pointer-events-none"
        >
          <div className="rounded-2xl border border-[#B9D7E8]/20 bg-[#263C50]/80 p-5 backdrop-blur-xl shadow-2xl text-right">
            <div className="flex items-center justify-end gap-2 text-[10px] uppercase tracking-[0.22em] text-[#B9D7E8] font-mono">
              <span>Architectural Monograph</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#B9D7E8]" />
            </div>
            <p className="font-serif text-base text-[#FFF9F4] mt-2 italic font-light">
              &ldquo;{sanctuary.curatorNote}&rdquo;
            </p>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-end gap-3 text-[11px] font-mono text-[#F6B99D]">
              <span>{sanctuary.architect}</span>
              <span>· {sanctuary.yearBuilt}</span>
            </div>
          </div>
        </div>

        {/* INITIAL STATE: Floating Scroll Indicator & Progress Ticker */}
        <div
          ref={scrollPromptRef}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-none"
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#B9D7E8]/90">
            Scroll To Expand Horizon
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#F6B99D]">
              [ {scrollProgress.toString().padStart(2, "0")}% ]
            </span>
            <div className="flex h-6 w-3.5 items-start justify-center rounded-full border border-[#B9D7E8]/40 p-0.5">
              <span className="h-1.5 w-1 rounded-full bg-[#F6B99D] animate-bounce" />
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* THE EXPANDING IMAGE PORTAL (Core Scrubbed Hero Entity)         */}
        {/* ============================================================ */}
        <div
          ref={portalRef}
          className="relative z-10 overflow-hidden shadow-[0_30px_90px_rgba(10,18,26,0.85)] border border-[#B9D7E8]/35 bg-[#263C50] will-change-transform"
          style={{
            width: prefersReducedMotion ? "100vw" : "56vw",
            maxWidth: prefersReducedMotion ? "100%" : "820px",
            height: prefersReducedMotion ? "100vh" : "50vh",
            maxHeight: prefersReducedMotion ? "100%" : "500px",
            borderRadius: prefersReducedMotion ? "0px" : "28px",
            marginTop: prefersReducedMotion ? "0px" : "70px",
          }}
        >
          {/* Inner Image Wrapper with Counter Parallax and Multi-Scene Stack */}
          <div
            ref={imageWrapperRef}
            className="relative w-full h-full overflow-hidden"
          >
            {SANCTUARIES.map((s, idx) => (
              <div
                key={s.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  idx === currentSanctuaryIndex ? "opacity-100 z-1" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <Image
                  ref={idx === currentSanctuaryIndex ? imageRef : undefined}
                  src={s.image}
                  alt={s.imageAlt}
                  fill
                  priority={idx <= 1}
                  sizes="100vw"
                  className="object-cover object-center transform scale-125 will-change-transform"
                />
              </div>
            ))}

            {/* Subtle portal vignette on initial frame */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#263C50]/60 via-transparent to-[#263C50]/20 pointer-events-none z-5" />

            {/* Small subtle corner indicator on the unexpanded portal */}
            {!isExpanded && (
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white/90 z-10 pointer-events-none transition-opacity duration-300">
                <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.24em] font-mono bg-[#263C50]/80 px-2.5 py-1 rounded-full backdrop-blur-md border border-[#B9D7E8]/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F6B99D]" />
                  {sanctuary.code}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.2em] font-mono bg-[#263C50]/80 px-2.5 py-1 rounded-full backdrop-blur-md border border-[#B9D7E8]/20">
                  <Maximize2 className="h-2.5 w-2.5 text-[#B9D7E8]" />
                  Expand To Unveil
                </span>
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* PHASE 2 & 3: SCRIM OVERLAY & DEEP BRAND REVEAL CONTENT      */}
          {/* ============================================================ */}
          {/* Cinematic Scrim Vignette */}
          <div
            ref={revealedScrimRef}
            className="absolute inset-0 pointer-events-none z-10 opacity-0"
            style={{
              background:
                "linear-gradient(to top, rgba(38,60,80,0.96) 0%, rgba(38,60,80,0.72) 36%, rgba(38,60,80,0.28) 64%, rgba(38,60,80,0.65) 100%)",
            }}
            aria-hidden="true"
          />

          {/* Interactive Architectural Hotspot Pins Layer */}
          <div
            ref={hotspotsLayerRef}
            className="absolute inset-0 z-20 opacity-0 transition-opacity duration-300 pointer-events-none"
          >
            {sanctuary.hotspots.map((hotspot, idx) => (
              <HotspotPin
                key={`${sanctuary.id}-${hotspot.id}`}
                hotspot={hotspot}
                index={idx}
              />
            ))}
          </div>

          {/* Deep Brand Typography, Sanctuary Switcher & Narrative Reveal */}
          <div
            ref={revealedContentRef}
            id="hero-narrative"
            className="absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 opacity-0 pointer-events-none overflow-y-auto"
          >
            {/* Top Row: Monograph Code & Sanctuary Switcher Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-16 sm:pt-14">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-[0.24em] text-[#F6B99D] bg-[#263C50]/80 px-3 py-1.5 rounded-full border border-[#F6B99D]/30 backdrop-blur-md">
                  {sanctuary.code}
                </span>
                <span className="hidden md:inline-block font-sans text-xs uppercase tracking-[0.2em] text-[#FFF9F4]/80">
                  {sanctuary.location}
                </span>
              </div>

              {/* Sanctuary Scene Switcher Navigation */}
              <div className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-[#B9D7E8]/25 bg-[#263C50]/85 p-1 backdrop-blur-xl shadow-xl overflow-x-auto max-w-full">
                {SANCTUARIES.map((s, idx) => {
                  const isActive = idx === currentSanctuaryIndex;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleSelectSanctuary(idx)}
                      type="button"
                      aria-label={`Switch to ${s.title}`}
                      className={`relative flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-sans uppercase tracking-[0.18em] transition-all duration-300 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F6B99D] ${
                        isActive
                          ? "bg-[#FFF9F4] text-[#263C50] font-semibold shadow-md"
                          : "text-[#FFF9F4]/70 hover:text-[#FFF9F4] hover:bg-white/5"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive ? "bg-[#263C50]" : "bg-[#F6B99D]"
                        }`}
                      />
                      <span>0{idx + 1} {s.title.split(" ")[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Center/Bottom Narrative: Editorial Brand Reveal */}
            <div className="my-auto py-6 sm:py-8 max-w-5xl">
              {/* Eyebrow */}
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#F6B99D]" />
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#F6B99D] font-mono">
                  Private Architectural Discovery
                </span>
              </div>

              {/* Grand Serif Editorial Headline */}
              <h2 className="mt-4 font-serif text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-[#FFF9F4] leading-[1.08] tracking-tight">
                Where architectural poetry meets human belonging.
              </h2>

              {/* Highlighted Brand Tagline */}
              <p className="mt-4 font-serif text-xl sm:text-2xl lg:text-3xl italic text-[#F6B99D] font-light">
                &ldquo;Find a place that feels like you.&rdquo;
              </p>

              {/* Editorial Narrative Statement */}
              <p className="mt-5 max-w-3xl text-sm sm:text-base lg:text-lg text-[#FFF9F4]/85 leading-relaxed font-light">
                {sanctuary.description}
              </p>

              {/* Architectural Specs Row */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-[#B9D7E8]/20">
                <div className="rounded-xl border border-white/10 bg-[#263C50]/60 p-3 backdrop-blur-md">
                  <span className="block text-[9px] uppercase tracking-[0.2em] text-[#B9D7E8]/80 font-mono">
                    Living Interior
                  </span>
                  <span className="mt-1 block font-serif text-lg sm:text-xl text-[#FFF9F4]">
                    {sanctuary.specs.interior}
                  </span>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#263C50]/60 p-3 backdrop-blur-md">
                  <span className="block text-[9px] uppercase tracking-[0.2em] text-[#B9D7E8]/80 font-mono">
                    Private Grounds
                  </span>
                  <span className="mt-1 block font-serif text-lg sm:text-xl text-[#FFF9F4]">
                    {sanctuary.specs.grounds}
                  </span>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#263C50]/60 p-3 backdrop-blur-md">
                  <span className="block text-[9px] uppercase tracking-[0.2em] text-[#B9D7E8]/80 font-mono">
                    Suites & Baths
                  </span>
                  <span className="mt-1 block font-serif text-lg sm:text-xl text-[#FFF9F4]">
                    {sanctuary.specs.suites} Suites · {sanctuary.specs.baths} Baths
                  </span>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#263C50]/60 p-3 backdrop-blur-md">
                  <span className="block text-[9px] uppercase tracking-[0.2em] text-[#F6B99D] font-mono">
                    Acquisition
                  </span>
                  <span className="mt-1 block font-serif text-lg sm:text-xl text-[#F6B99D] font-medium">
                    {sanctuary.valuation}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Action Deck */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#B9D7E8]/15 pb-2">
              <div className="flex items-center gap-3 text-xs text-[#B9D7E8]/80 font-mono">
                <span className="h-2 w-2 rounded-full bg-[#F6B99D] animate-ping" />
                <span>
                  Interactive pins active — Hover or tap numbered hotspots on photography to examine materiality
                </span>
              </div>

              <div className="flex items-center gap-3">
                <LuxuryButton
                  variant="outline"
                  size="md"
                  icon={<FileText className="h-3.5 w-3.5" />}
                  onClick={() => {
                    alert(
                      `Private Architectural Dossier for ${sanctuary.title} (${sanctuary.code}) requested. Our Private Office will establish contact.`
                    );
                  }}
                >
                  Request Dossier
                </LuxuryButton>

                <LuxuryButton
                  variant="peach"
                  size="md"
                  icon={<Calendar className="h-3.5 w-3.5" />}
                  onClick={() => {
                    alert(
                      `Private View Schedule initiated for ${sanctuary.title}. Coordinates: ${sanctuary.coordinates}.`
                    );
                  }}
                >
                  Schedule Viewing
                </LuxuryButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
