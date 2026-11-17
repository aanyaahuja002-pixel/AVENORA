"use client";

import Image from "next/image";
import { PropertyListing } from "@/types";
import { useFavorites } from "@/hooks/useFavorites";
import { Heart, ArrowUpRight, Bed, Bath, Maximize2 } from "lucide-react";

interface PropertyCardProps {
  property: PropertyListing;
  onSelect: (property: PropertyListing) => void;
}

export function PropertyCard({ property, onSelect }: PropertyCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(property.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(property);
    }
  };

  return (
    <article
      tabIndex={0}
      role="button"
      onClick={() => onSelect(property)}
      onKeyDown={handleKeyDown}
      aria-label={`Explore ${property.title} in ${property.locality}, ${property.city}`}
      className="group relative flex flex-col justify-between rounded-3xl border border-[#B9D7E8]/20 bg-[#263C50]/80 backdrop-blur-xl overflow-hidden shadow-[0_15px_40px_rgba(10,18,26,0.5)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#F6B99D]/50 hover:shadow-[0_25px_60px_rgba(246,185,157,0.15)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F6B99D] cursor-pointer"
    >
      {/* 1. Image Viewport with Hover Zoom */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#263C50]">
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
        />

        {/* Subtle Gradient Shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#263C50] via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges Row */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            {/* Demo Badge */}
            <span className="rounded-full bg-[#263C50]/90 border border-[#F6B99D]/60 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[#F6B99D] backdrop-blur-md shadow-sm">
              DEMO
            </span>

            {/* Category Badge */}
            <span className="rounded-full bg-[#FFF9F4]/90 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[#263C50] font-semibold backdrop-blur-md shadow-sm">
              {property.category === "buy" ? "BUY" : "RENT"}
            </span>
          </div>

          {/* Favorite Toggle Button */}
          <button
            type="button"
            onClick={handleFavoriteClick}
            aria-label={
              favorited
                ? `Remove ${property.title} from favorites`
                : `Add ${property.title} to favorites`
            }
            className={`flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 shadow-md ${
              favorited
                ? "border-[#F6B99D] bg-[#263C50] text-[#F6B99D] scale-105"
                : "border-white/20 bg-[#263C50]/70 text-[#FFF9F4]/80 hover:border-[#F6B99D] hover:text-[#F6B99D] hover:scale-105"
            }`}
          >
            <Heart
              className={`h-4 w-4 transition-transform ${
                favorited ? "fill-[#F6B99D] scale-110" : ""
              }`}
            />
          </button>
        </div>

        {/* Bottom Locality Pill on Image */}
        <div className="absolute bottom-3 left-4 z-10 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-mono text-[#FFF9F4]/90">
          <span className="h-1.5 w-1.5 rounded-full bg-[#F6B99D]" />
          <span>
            {property.locality} · {property.city}
          </span>
        </div>
      </div>

      {/* 2. Card Body Content */}
      <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow space-y-4">
        <div>
          {/* Property Type Monograph */}
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#B9D7E8]">
            {property.propertyType} · {property.code}
          </span>

          {/* Title */}
          <h3 className="font-serif text-xl sm:text-2xl text-[#FFF9F4] font-normal leading-snug mt-1 group-hover:text-[#F6B99D] transition-colors duration-300">
            {property.title}
          </h3>

          {/* Tagline */}
          <p className="font-serif italic text-xs text-[#FFF9F4]/70 mt-1 line-clamp-1">
            &ldquo;{property.tagline}&rdquo;
          </p>
        </div>

        {/* 3. Specs Bar */}
        <div className="flex items-center justify-between py-3 border-y border-white/10 text-xs font-mono text-[#FFF9F4]/80">
          <div className="flex items-center gap-1.5">
            <Bed className="h-3.5 w-3.5 text-[#B9D7E8]" />
            <span>{property.bedrooms} BHK</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Bath className="h-3.5 w-3.5 text-[#B9D7E8]" />
            <span>{property.bathrooms} Baths</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Maximize2 className="h-3.5 w-3.5 text-[#B9D7E8]" />
            <span>{property.areaFormatted}</span>
          </div>
        </div>

        {/* 4. Price & Action Row */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="block font-mono text-[9px] uppercase tracking-widest text-[#B9D7E8]/70">
              {property.category === "buy" ? "Acquisition" : "Lease"}
            </span>
            <span className="font-serif text-2xl text-[#F6B99D] font-medium tracking-tight">
              {property.priceFormatted}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] font-sans text-[#FFF9F4] group-hover:text-[#F6B99D] transition-colors">
            <span>Explore</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </article>
  );
}
