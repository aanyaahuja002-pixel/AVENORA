"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DEMO_PROPERTIES } from "@/data/properties";
import { PropertyListing, PropertyFilterState } from "@/types";
import { useFavorites } from "@/hooks/useFavorites";
import { PropertyCard } from "./PropertyCard";
import { PropertyFilters } from "./PropertyFilters";
import { PropertyDetailModal } from "./PropertyDetailModal";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import { Compass, Sparkles, RotateCcw } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INITIAL_FILTERS: PropertyFilterState = {
  category: "all",
  city: "all",
  propertyType: "all",
  bedrooms: "all",
  priceRange: "all",
  searchQuery: "",
  sortBy: "featured",
  favoritesOnly: false,
};

export function PropertyDiscoverySection() {
  const [filters, setFilters] = useState<PropertyFilterState>(INITIAL_FILTERS);
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);

  const { favorites, favoritesCount } = useFavorites();

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Listen for external open property events (e.g. from AI Consultant chat or viewing request)
  useEffect(() => {
    const handleOpenExternal = (e: Event) => {
      const customEvent = e as CustomEvent<PropertyListing>;
      if (customEvent.detail) {
        setSelectedProperty(customEvent.detail);
      }
    };
    window.addEventListener("avenora_open_property", handleOpenExternal);
    return () => {
      window.removeEventListener("avenora_open_property", handleOpenExternal);
    };
  }, []);

  // Filter & sort computation
  const filteredProperties = useMemo(() => {
    return DEMO_PROPERTIES.filter((property) => {
      // 1. Category filter
      if (filters.category !== "all" && property.category !== filters.category) {
        return false;
      }

      // 2. City filter
      if (filters.city !== "all" && property.city !== filters.city) {
        return false;
      }

      // 3. Property Type filter
      if (
        filters.propertyType !== "all" &&
        property.propertyType !== filters.propertyType
      ) {
        return false;
      }

      // 4. Bedrooms filter
      if (filters.bedrooms !== "all") {
        if (filters.bedrooms === 5) {
          if (property.bedrooms < 5) return false;
        } else if (property.bedrooms !== filters.bedrooms) {
          return false;
        }
      }

      // 5. Budget Range filter
      if (filters.priceRange !== "all") {
        if (filters.priceRange === "under_15cr") {
          if (property.category !== "buy" || property.price >= 150000000)
            return false;
        } else if (filters.priceRange === "15cr_25cr") {
          if (
            property.category !== "buy" ||
            property.price < 150000000 ||
            property.price > 250000000
          )
            return false;
        } else if (filters.priceRange === "above_25cr") {
          if (property.category !== "buy" || property.price <= 250000000)
            return false;
        } else if (filters.priceRange === "under_4l") {
          if (property.category !== "rent" || property.price >= 400000)
            return false;
        } else if (filters.priceRange === "above_4l") {
          if (property.category !== "rent" || property.price < 400000)
            return false;
        }
      }

      // 6. Search query filter
      if (filters.searchQuery.trim() !== "") {
        const query = filters.searchQuery.toLowerCase();
        const matchesQuery =
          property.title.toLowerCase().includes(query) ||
          property.locality.toLowerCase().includes(query) ||
          property.city.toLowerCase().includes(query) ||
          property.propertyType.toLowerCase().includes(query) ||
          property.tagline.toLowerCase().includes(query) ||
          property.amenities.some((a) => a.toLowerCase().includes(query));
        if (!matchesQuery) return false;
      }

      // 7. Favorites only filter
      if (filters.favoritesOnly) {
        if (!favorites.includes(property.id)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "price_asc") return a.price - b.price;
      if (filters.sortBy === "price_desc") return b.price - a.price;
      if (filters.sortBy === "area_desc") return b.areaSqFt - a.areaSqFt;
      // Default: featured first, then ID
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }, [filters, favorites]);

  // GSAP ScrollTrigger Reveal & Card Stagger
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      if (gridRef.current) {
        gsap.set(gridRef.current.children, { opacity: 1, y: 0 });
      }
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Reveal Section Header on scroll
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
          {
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          }
        );
      }

      // 2. Reveal Property Cards Stagger with clean props clearing
      if (gridRef.current) {
        const cards = Array.from(gridRef.current.children);
        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 35 },
            {
              scrollTrigger: {
                trigger: gridRef.current,
                start: "top 90%",
                toggleActions: "play none none none",
              },
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.05,
              ease: "power2.out",
              clearProps: "transform,opacity",
            }
          );
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredProperties.length]);

  // Subtle smooth cross-stagger on filter updates
  useEffect(() => {
    if (!gridRef.current) return;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    gsap.fromTo(
      gridRef.current.children,
      { opacity: 0.4, y: 15 },
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        stagger: 0.03,
        ease: "power2.out",
        clearProps: "all",
      }
    );
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return (
    <section
      ref={sectionRef}
      id="property-discovery"
      className="relative z-20 bg-[#263C50] text-[#FFF9F4] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-[#B9D7E8]/15"
      aria-label="Interactive Property Discovery"
    >
      {/* Background Architectural Watermark & Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-[#B9D7E8]/10 blur-[130px]" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] rounded-full bg-[#F6B99D]/10 blur-[130px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#B9D7E8_1px,transparent_1px),linear-gradient(to_bottom,#B9D7E8_1px,transparent_1px)] bg-[size:120px_120px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_60%,transparent_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#B9D7E8]/30 bg-white/5 px-4 py-1 backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-[#F6B99D]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#FFF9F4]/90">
              SECTION 02 // PRIVATE RESIDENTIAL PORTFOLIO
            </span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#FFF9F4] tracking-tight leading-[1.08]">
            Discover Spaces Worth Coming Home To.
          </h2>

          <p className="font-sans text-base sm:text-lg text-[#FFF9F4]/80 font-light leading-relaxed max-w-2xl">
            Explore thoughtfully selected properties that match your lifestyle, aspirations and vision of home.
          </p>

          <div className="pt-2 flex items-center gap-3 text-xs font-mono text-[#F6B99D]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F6B99D] animate-ping" />
            <span>Featured Indian Metros: Mumbai · Pune · Bangalore · Hyderabad</span>
          </div>
        </div>

        {/* Filter Controls Component */}
        <PropertyFilters
          filters={filters}
          onChange={setFilters}
          totalMatches={filteredProperties.length}
          favoritesCount={favoritesCount}
          onReset={handleResetFilters}
        />

        {/* Property Grid or Empty State */}
        {filteredProperties.length > 0 ? (
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={(p) => setSelectedProperty(p)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-3xl border border-[#B9D7E8]/20 bg-[#263C50]/80 p-12 sm:p-16 text-center backdrop-blur-xl shadow-2xl max-w-xl mx-auto space-y-5 animate-in fade-in duration-300">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#B9D7E8]/30 bg-white/5">
              <Compass className="h-8 w-8 text-[#F6B99D] animate-spin-slow" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-2xl sm:text-3xl text-[#FFF9F4]">
                No sanctuaries match your refined criteria.
              </h3>
              <p className="font-sans text-xs text-[#FFF9F4]/70 leading-relaxed max-w-md mx-auto">
                Try widening your budget horizon, selecting another metropolitan location, or resetting the active filters.
              </p>
            </div>

            <LuxuryButton
              variant="peach"
              size="md"
              icon={<RotateCcw className="h-3.5 w-3.5" />}
              onClick={handleResetFilters}
            >
              Reset All Filters
            </LuxuryButton>
          </div>
        )}
      </div>

      {/* Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />
    </section>
  );
}
