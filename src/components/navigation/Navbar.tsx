"use client";

import { useState, useEffect } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { SoundAmbienceToggle } from "@/components/ui/SoundAmbienceToggle";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import { Menu, X, ArrowUpRight, Shield } from "lucide-react";

interface NavbarProps {
  currentLocationName?: string;
  currentCoordinates?: string;
}

export function Navbar({
  currentLocationName = "Villa Solaria · Amalfi",
  currentCoordinates = "40.6281° N, 14.4850° E",
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#263C50]/85 backdrop-blur-xl py-3 border-b border-[#B9D7E8]/15 shadow-[0_10px_30px_rgba(20,32,44,0.4)]"
          : "bg-transparent py-5 lg:py-7 border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <BrandLogo />
            <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-white/10 text-[10px] uppercase tracking-[0.2em] text-[#B9D7E8]/70 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F6B99D] animate-pulse" />
              <span>{currentCoordinates}</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-7 rounded-full border border-[#B9D7E8]/20 bg-[#263C50]/50 backdrop-blur-md px-6 py-2 shadow-sm"
          >
            {[
              { label: "Sanctuaries", href: "#sanctuary-scene", badge: "03" },
              { label: "Residences", href: "#property-discovery", badge: "12" },
              { label: "Private Office", href: "#contact-advisory" },
              { label: "Monograph", href: "#hero-narrative", badge: "2026" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[#FFF9F4]/80 transition-colors duration-200 hover:text-[#F6B99D]"
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="font-mono text-[9px] rounded-full bg-[#B9D7E8]/15 px-1.5 py-0.2 text-[#B9D7E8] group-hover:bg-[#F6B99D]/20 group-hover:text-[#F6B99D] transition-colors">
                    {link.badge}
                  </span>
                )}
              </a>
            ))}
          </nav>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-3">
            <SoundAmbienceToggle />

            <div className="hidden lg:block">
              <LuxuryButton
                variant="primary"
                size="sm"
                icon={<ArrowUpRight className="h-3 w-3" />}
                onClick={() => {
                  const target = document.getElementById("contact-advisory");
                  target?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Inquire
              </LuxuryButton>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full border border-[#B9D7E8]/30 bg-[#263C50]/70 text-[#FFF9F4] backdrop-blur-md transition-all hover:border-[#F6B99D]"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="md:hidden fixed inset-x-0 top-[65px] bottom-0 bg-[#263C50]/98 backdrop-blur-2xl border-t border-[#B9D7E8]/20 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-top-4 duration-300 z-50"
        >
          <div className="space-y-6 pt-4">
            <div className="border-b border-[#B9D7E8]/10 pb-4">
              <span className="text-[10px] uppercase tracking-[0.24em] text-[#F6B99D] font-mono">
                Current Location Focus
              </span>
              <p className="font-serif text-xl text-[#FFF9F4] mt-1">
                {currentLocationName}
              </p>
              <p className="font-mono text-xs text-[#B9D7E8]/70 mt-0.5">
                {currentCoordinates}
              </p>
            </div>

            <nav className="flex flex-col space-y-4">
              {[
                {
                  label: "Sanctuaries Showcase",
                  sub: "Explore expanding hero estates",
                  href: "#sanctuary-scene",
                },
                {
                  label: "Curated Indian Residences",
                  sub: "Mumbai, Pune, Bangalore & Hyderabad",
                  href: "#property-discovery",
                },
                {
                  label: "Private Office & Advisory",
                  sub: "Discreet acquisitions & viewing",
                  href: "#contact-advisory",
                },
                {
                  label: "Editorial Monograph",
                  sub: "Issue No. 01 — 2026",
                  href: "#hero-narrative",
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3 border-b border-white/5 hover:border-[#F6B99D]/40 transition-colors group"
                >
                  <div>
                    <p className="font-serif text-lg text-[#FFF9F4] group-hover:text-[#F6B99D] transition-colors">
                      {item.label}
                    </p>
                    <p className="text-xs text-[#B9D7E8]/60 font-sans">
                      {item.sub}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[#B9D7E8]/50 group-hover:text-[#F6B99D] transition-colors" />
                </a>
              ))}
            </nav>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs text-[#B9D7E8]/80 font-sans">
              <Shield className="h-3.5 w-3.5 text-[#F6B99D]" />
              <span>Strictly Private & Confidential Portfolios</span>
            </div>
            <LuxuryButton
              variant="peach"
              size="lg"
              className="w-full"
              onClick={() => {
                setIsMobileMenuOpen(false);
                const target = document.getElementById("hero-narrative");
                target?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Request Private Access
            </LuxuryButton>
          </div>
        </div>
      )}
    </header>
  );
}
