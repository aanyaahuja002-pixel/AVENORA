"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { PropertyListing } from "@/types";
import { useFavorites } from "@/hooks/useFavorites";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import {
  X,
  Heart,
  ChevronLeft,
  ChevronRight,
  Compass,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  CheckCircle2,
  Phone,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

interface PropertyDetailModalProps {
  property: PropertyListing | null;
  onClose: () => void;
}

export function PropertyDetailModal({
  property,
  onClose,
}: PropertyDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    notes: "",
  });

  const { isFavorite, toggleFavorite } = useFavorites();

  // Reset active image index & inquiry state when property changes
  useEffect(() => {
    setActiveImageIndex(0);
    setInquirySubmitted(false);
    setFormData({ name: "", email: "", phone: "", date: "", notes: "" });
  }, [property]);

  // Handle ESC key and prevent body scrolling
  useEffect(() => {
    if (!property) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [property, onClose]);

  if (!property) return null;

  const favorited = isFavorite(property.id);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setInquirySubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="property-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-10 overflow-y-auto backdrop-blur-xl bg-[#263C50]/80 animate-in fade-in duration-300"
    >
      {/* Backdrop click dismiss */}
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl border border-[#B9D7E8]/25 bg-[#263C50] text-[#FFF9F4] shadow-[0_25px_80px_rgba(10,18,26,0.9)] flex flex-col">
        {/* Sticky Header Action Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#B9D7E8]/15 bg-[#263C50]/90 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-[#F6B99D] bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              {property.code}
            </span>
            <span className="text-xs uppercase tracking-[0.18em] text-[#B9D7E8]/80 font-sans">
              {property.locality}, {property.city}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Favorite Bookmark Button */}
            <button
              onClick={() => toggleFavorite(property.id)}
              aria-label={
                favorited ? "Remove from saved residences" : "Save residence to favorites"
              }
              type="button"
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
                favorited
                  ? "border-[#F6B99D] bg-[#F6B99D]/20 text-[#F6B99D]"
                  : "border-[#B9D7E8]/25 bg-white/5 text-[#FFF9F4]/70 hover:border-[#FFF9F4] hover:text-[#FFF9F4]"
              }`}
            >
              <Heart
                className={`h-4 w-4 transition-transform ${
                  favorited ? "fill-[#F6B99D] scale-110" : ""
                }`}
              />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close property details"
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#B9D7E8]/25 bg-white/5 text-[#FFF9F4]/70 hover:border-[#FFF9F4] hover:text-[#FFF9F4] hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Prominent Demo Notice Banner */}
        <div className="bg-[#B9D7E8]/10 border-b border-[#B9D7E8]/15 px-6 py-2 flex items-center justify-between text-[11px] font-mono text-[#B9D7E8]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-3.5 w-3.5 text-[#F6B99D]" />
            <span>DEMO LISTING // SIMULATED ARCHITECTURAL DISCOVERY DATA FOR INDIAN METROS</span>
          </div>
          <span className="hidden sm:inline-block text-[#F6B99D] font-semibold">
            {property.category === "buy" ? "FOR SALE" : "FOR LEASE"}
          </span>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 lg:p-10 space-y-8">
          {/* 1. Interactive Image Gallery */}
          <div className="relative rounded-2xl overflow-hidden border border-[#B9D7E8]/20 bg-[#263C50]/80 shadow-2xl">
            {/* Main Stage Image */}
            <div className="relative h-[320px] sm:h-[440px] md:h-[500px] w-full overflow-hidden">
              <Image
                src={property.images[activeImageIndex] || property.images[0]}
                alt={`${property.title} architectural view ${activeImageIndex + 1}`}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1000px"
                className="object-cover object-center transition-all duration-700"
              />

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#263C50]/70 via-transparent to-transparent pointer-events-none" />

              {/* Prev / Next Arrows */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    type="button"
                    aria-label="Previous photograph"
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-[#263C50]/80 text-[#FFF9F4] border border-[#B9D7E8]/30 backdrop-blur-md hover:bg-[#263C50] hover:scale-105 transition-all"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    type="button"
                    aria-label="Next photograph"
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-[#263C50]/80 text-[#FFF9F4] border border-[#B9D7E8]/30 backdrop-blur-md hover:bg-[#263C50] hover:scale-105 transition-all"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Active Image Indicator Pill */}
              <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-[#263C50]/80 border border-[#B9D7E8]/20 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#FFF9F4] backdrop-blur-md">
                <span>0{activeImageIndex + 1}</span>
                <span className="text-[#B9D7E8]/60">/</span>
                <span>0{property.images.length}</span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {property.images.length > 1 && (
              <div className="flex items-center gap-3 p-3 bg-[#263C50]/90 border-t border-[#B9D7E8]/15 overflow-x-auto">
                {property.images.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`View photo ${idx + 1}`}
                    className={`relative h-16 w-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      idx === activeImageIndex
                        ? "border-[#F6B99D] scale-102 shadow-md"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Title, Tagline & Core Price Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#B9D7E8]/15 pb-8">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#F6B99D]">
                  {property.propertyType}
                </span>
                <span className="text-[#B9D7E8]/50">·</span>
                <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#B9D7E8]">
                  {property.city}
                </span>
              </div>
              <h2
                id="property-modal-title"
                className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#FFF9F4]"
              >
                {property.title}
              </h2>
              <p className="font-serif italic text-base sm:text-lg text-[#F6B99D]/90">
                &ldquo;{property.tagline}&rdquo;
              </p>
            </div>

            <div className="flex flex-col md:items-end">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#B9D7E8]/70">
                {property.category === "buy" ? "Investment Acquisition" : "Monthly Lease"}
              </span>
              <span className="font-serif text-3xl sm:text-4xl text-[#F6B99D] font-medium tracking-tight">
                {property.priceFormatted}
              </span>
              <span className="font-mono text-xs text-[#FFF9F4]/60 mt-0.5">
                {property.areaFormatted}
              </span>
            </div>
          </div>

          {/* 3. Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-3">
              <Bed className="h-5 w-5 text-[#B9D7E8]" />
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-[#B9D7E8]/70 font-mono">
                  Suites
                </span>
                <span className="font-serif text-lg text-[#FFF9F4]">
                  {property.bedrooms} Bedrooms
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-3">
              <Bath className="h-5 w-5 text-[#B9D7E8]" />
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-[#B9D7E8]/70 font-mono">
                  Baths
                </span>
                <span className="font-serif text-lg text-[#FFF9F4]">
                  {property.bathrooms} Bathrooms
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-3">
              <Maximize2 className="h-5 w-5 text-[#B9D7E8]" />
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-[#B9D7E8]/70 font-mono">
                  Living Footprint
                </span>
                <span className="font-serif text-lg text-[#FFF9F4]">
                  {property.areaFormatted}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-3">
              <Compass className="h-5 w-5 text-[#F6B99D]" />
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-[#F6B99D]/70 font-mono">
                  Facing
                </span>
                <span className="font-serif text-lg text-[#FFF9F4] truncate">
                  {property.specifications.facing.split(" ")[0]}
                </span>
              </div>
            </div>
          </div>

          {/* 4. Architectural Narrative */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#F6B99D] font-mono">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Architectural Monograph & Concept</span>
            </div>
            <p className="font-light text-sm sm:text-base text-[#FFF9F4]/85 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* 5. Key Amenities & Features */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-[0.24em] text-[#B9D7E8]">
              Sanctuary Amenities & Private Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {property.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2.5 rounded-lg border border-[#B9D7E8]/15 bg-white/5 px-3 py-2 text-xs text-[#FFF9F4]/90"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F6B99D]" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Technical Specifications Table */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-[0.24em] text-[#B9D7E8]">
              Architectural Specifications
            </h3>
            <div className="rounded-2xl border border-[#B9D7E8]/20 bg-[#263C50]/60 overflow-hidden divide-y divide-white/5">
              {[
                { label: "Flooring & Materiality", val: property.specifications.flooring },
                { label: "Ceiling Height", val: property.specifications.ceilingHeight },
                { label: "Balcony / Deck Orientation", val: property.specifications.facing },
                { label: "Vehicle Parking", val: property.specifications.parking },
                { label: "Interior Condition", val: property.specifications.furnishing },
                { label: "Possession Timeline", val: property.specifications.possession },
                { label: "RERA Registration Number", val: property.specifications.reraId },
              ].map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs font-sans gap-1 sm:gap-4"
                >
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#B9D7E8]/70">
                    {row.label}
                  </span>
                  <span className="sm:col-span-2 text-[#FFF9F4] font-light">
                    {row.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Working Private Viewing Schedule Form */}
          <div className="rounded-3xl border border-[#F6B99D]/30 bg-gradient-to-b from-[#263C50] to-[#1e2f3e] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#F6B99D]">
                  Private Office Concierge
                </span>
                <h4 className="font-serif text-2xl text-[#FFF9F4] mt-0.5">
                  Request Confidential Dossier or Viewing
                </h4>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#B9D7E8]/80">
                <Phone className="h-3.5 w-3.5 text-[#F6B99D]" />
                <span>Private Line: +91 22 4900 8800</span>
              </div>
            </div>

            {inquirySubmitted ? (
              <div className="rounded-2xl border border-[#F6B99D]/40 bg-[#F6B99D]/10 p-6 text-center space-y-3 animate-in zoom-in-95 duration-300">
                <CheckCircle2 className="h-10 w-10 text-[#F6B99D] mx-auto" />
                <h5 className="font-serif text-2xl text-[#FFF9F4]">
                  Inquiry Registered Confidentially
                </h5>
                <p className="font-sans text-xs text-[#FFF9F4]/80 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-[#F6B99D]">{formData.name}</strong>. Our Senior Private Office Partner for <strong className="text-[#FFF9F4]">{property.city}</strong> will contact you at <strong className="text-[#FFF9F4]">{formData.email}</strong> to coordinate a private viewing of {property.title}.
                </p>
                <div className="pt-2 font-mono text-[10px] uppercase tracking-widest text-[#B9D7E8]">
                  Reference ID: AVN-REQ-{Math.floor(100000 + Math.random() * 900000)}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-[#B9D7E8]/80 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Radhika Singhania"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#B9D7E8]/20 bg-[#263C50]/80 px-4 py-2.5 text-xs text-[#FFF9F4] placeholder:text-white/30 focus:border-[#F6B99D] focus:outline-none focus:ring-1 focus:ring-[#F6B99D]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-[#B9D7E8]/80 mb-1">
                      Direct Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#B9D7E8]/20 bg-[#263C50]/80 px-4 py-2.5 text-xs text-[#FFF9F4] placeholder:text-white/30 focus:border-[#F6B99D] focus:outline-none focus:ring-1 focus:ring-[#F6B99D]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-[#B9D7E8]/80 mb-1">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98200 00000"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#B9D7E8]/20 bg-[#263C50]/80 px-4 py-2.5 text-xs text-[#FFF9F4] placeholder:text-white/30 focus:border-[#F6B99D] focus:outline-none focus:ring-1 focus:ring-[#F6B99D]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-[#B9D7E8]/80 mb-1">
                      Preferred Viewing Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#B9D7E8]/20 bg-[#263C50]/80 px-4 py-2 text-xs text-[#FFF9F4] focus:border-[#F6B99D] focus:outline-none focus:ring-1 focus:ring-[#F6B99D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-[#B9D7E8]/80 mb-1">
                    Special Acquisition Preferences or Disclosures
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Specific architectural queries, confidentiality requirements or briefing notes..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#B9D7E8]/20 bg-[#263C50]/80 px-4 py-2 text-xs text-[#FFF9F4] placeholder:text-white/30 focus:border-[#F6B99D] focus:outline-none focus:ring-1 focus:ring-[#F6B99D]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <span className="font-mono text-[10px] text-[#B9D7E8]/70">
                    Non-disclosure & strict client confidentiality honored.
                  </span>
                  <LuxuryButton
                    type="submit"
                    variant="peach"
                    size="md"
                    icon={<Calendar className="h-3.5 w-3.5" />}
                  >
                    Confirm Private Viewing
                  </LuxuryButton>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
