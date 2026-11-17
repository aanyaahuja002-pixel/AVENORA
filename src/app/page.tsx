import { Navbar } from "@/components/navigation/Navbar";
import { HeroScrollSection } from "@/components/hero/HeroScrollSection";
import { PropertyDiscoverySection } from "@/components/discovery/PropertyDiscoverySection";
import { ContactSection } from "@/components/contact/ContactSection";
import { AIConsultantChat } from "@/components/ai/AIConsultantChat";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#263C50] text-[#FFF9F4] selection:bg-[#F6B99D] selection:text-[#263C50]">
      {/* Navigation Bar */}
      <Navbar />

      {/* SECTION 1: Immersive Pinned, Scroll-Scrubbed Expanding Image Hero with Brand Reveal */}
      <HeroScrollSection />

      {/* SECTION 2: Interactive Property Discovery */}
      <PropertyDiscoverySection />

      {/* STAGE 3: Premium Contact Advisory & Property Viewing Requests */}
      <ContactSection />

      {/* Floating AVENORA AI Property Consultant Chat */}
      <AIConsultantChat />

      {/* Elegant Editorial Colophon / Status Bar */}
      <footer className="relative z-20 border-t border-[#B9D7E8]/15 bg-[#263C50] py-10 text-center text-xs font-mono text-[#B9D7E8]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-serif text-base tracking-widest text-[#FFF9F4]">
              AVENORA
            </span>
            <span className="text-[#B9D7E8]/40">·</span>
            <span className="text-[11px] uppercase tracking-wider text-[#F6B99D]">
              Find a place that feels like you.
            </span>
          </div>

          <div className="text-[10px] tracking-widest text-[#B9D7E8]/60 uppercase">
            Monograph Edition 2026 // Private Sanctuaries & Urban Estates
          </div>

          <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest">
            <span className="text-[#FFF9F4]/80">Mumbai · Pune · Bangalore · Hyderabad</span>
            <span className="text-[#B9D7E8]/40">·</span>
            <span className="text-[#FFF9F4]/80">Zurich · London</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
