"use client";

import { PropertyFilterState, PropertyCity, PropertyType } from "@/types";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Heart,
  X,
  MapPin,
  Home,
} from "lucide-react";

interface PropertyFiltersProps {
  filters: PropertyFilterState;
  onChange: (updated: PropertyFilterState) => void;
  totalMatches: number;
  favoritesCount: number;
  onReset: () => void;
}

const CITIES: PropertyCity[] = ["Mumbai", "Pune", "Bangalore", "Hyderabad"];
const PROPERTY_TYPES: PropertyType[] = [
  "Penthouse",
  "Architectural Villa",
  "Sky Residence",
  "Garden Duplex",
  "Heritage Estate",
];

export function PropertyFilters({
  filters,
  onChange,
  totalMatches,
  favoritesCount,
  onReset,
}: PropertyFiltersProps) {
  const hasActiveFilters =
    filters.category !== "all" ||
    filters.city !== "all" ||
    filters.propertyType !== "all" ||
    filters.bedrooms !== "all" ||
    filters.priceRange !== "all" ||
    filters.searchQuery.trim() !== "" ||
    filters.favoritesOnly;

  return (
    <div className="space-y-6">
      {/* 1. Top Bar: Category Pill Switch + Search Input + Sort Dropdown */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Category Segmented Switch */}
        <div className="inline-flex items-center rounded-full border border-[#B9D7E8]/25 bg-[#263C50]/90 p-1.5 backdrop-blur-xl shadow-lg self-start">
          {[
            { label: "All Properties", val: "all" },
            { label: "For Acquisition (Buy)", val: "buy" },
            { label: "For Lease (Rent)", val: "rent" },
          ].map((cat) => {
            const isActive = filters.category === cat.val;
            return (
              <button
                key={cat.val}
                type="button"
                onClick={() =>
                  onChange({
                    ...filters,
                    category: cat.val as PropertyFilterState["category"],
                  })
                }
                className={`relative px-4 py-2 rounded-full text-xs font-sans uppercase tracking-[0.18em] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F6B99D] ${
                  isActive
                    ? "bg-[#FFF9F4] text-[#263C50] font-semibold shadow-md"
                    : "text-[#FFF9F4]/75 hover:text-[#FFF9F4] hover:bg-white/5"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Input & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Keyword Search */}
          <div className="relative flex-grow sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#B9D7E8]/60" />
            <input
              type="text"
              placeholder="Search locality, title or architect..."
              value={filters.searchQuery}
              onChange={(e) =>
                onChange({ ...filters, searchQuery: e.target.value })
              }
              className="w-full rounded-full border border-[#B9D7E8]/25 bg-[#263C50]/80 pl-10 pr-4 py-2 text-xs text-[#FFF9F4] placeholder:text-white/40 focus:border-[#F6B99D] focus:outline-none focus:ring-1 focus:ring-[#F6B99D] transition-all"
            />
            {filters.searchQuery && (
              <button
                onClick={() => onChange({ ...filters, searchQuery: "" })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                aria-label="Clear search text"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) =>
                onChange({
                  ...filters,
                  sortBy: e.target.value as PropertyFilterState["sortBy"],
                })
              }
              aria-label="Sort residences"
              className="w-full sm:w-auto appearance-none rounded-full border border-[#B9D7E8]/25 bg-[#263C50]/80 px-4 py-2 pr-9 text-xs font-sans tracking-wider text-[#FFF9F4] focus:border-[#F6B99D] focus:outline-none focus:ring-1 focus:ring-[#F6B99D] cursor-pointer"
            >
              <option value="featured" className="bg-[#263C50] text-[#FFF9F4]">
                Sort: Curated
              </option>
              <option value="price_asc" className="bg-[#263C50] text-[#FFF9F4]">
                Price: Low to High
              </option>
              <option value="price_desc" className="bg-[#263C50] text-[#FFF9F4]">
                Price: High to Low
              </option>
              <option value="area_desc" className="bg-[#263C50] text-[#FFF9F4]">
                Area: Largest First
              </option>
            </select>
            <SlidersHorizontal className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#B9D7E8]/70" />
          </div>

          {/* Favorites Only Toggle */}
          <button
            type="button"
            onClick={() =>
              onChange({ ...filters, favoritesOnly: !filters.favoritesOnly })
            }
            aria-pressed={filters.favoritesOnly}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-sans uppercase tracking-[0.16em] transition-all ${
              filters.favoritesOnly
                ? "border-[#F6B99D] bg-[#F6B99D]/20 text-[#F6B99D]"
                : "border-[#B9D7E8]/25 bg-[#263C50]/80 text-[#FFF9F4]/80 hover:border-[#FFF9F4]"
            }`}
          >
            <Heart
              className={`h-3.5 w-3.5 ${
                filters.favoritesOnly ? "fill-[#F6B99D]" : ""
              }`}
            />
            <span>Saved ({favoritesCount})</span>
          </button>
        </div>
      </div>

      {/* 2. Detailed Multi-Filter Controls Row */}
      <div className="rounded-2xl border border-[#B9D7E8]/20 bg-[#263C50]/70 p-5 backdrop-blur-xl shadow-xl space-y-4">
        {/* City Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#B9D7E8]/80 mr-2">
            <MapPin className="h-3 w-3 text-[#F6B99D]" />
            Location:
          </span>
          <button
            type="button"
            onClick={() => onChange({ ...filters, city: "all" })}
            className={`px-3 py-1.5 rounded-full text-xs font-sans tracking-wide transition-all ${
              filters.city === "all"
                ? "bg-[#FFF9F4] text-[#263C50] font-semibold"
                : "bg-white/5 border border-white/10 text-[#FFF9F4]/75 hover:bg-white/10"
            }`}
          >
            All Metros
          </button>
          {CITIES.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => onChange({ ...filters, city })}
              className={`px-3 py-1.5 rounded-full text-xs font-sans tracking-wide transition-all ${
                filters.city === city
                  ? "bg-[#F6B99D] text-[#263C50] font-semibold shadow-sm"
                  : "bg-white/5 border border-white/10 text-[#FFF9F4]/75 hover:bg-white/10"
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Secondary Row: Property Type, Bedrooms & Budget Brackets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-white/10">
          {/* Property Type Dropdown */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#B9D7E8]/80 mb-1.5">
              Property Typology
            </label>
            <div className="relative">
              <select
                value={filters.propertyType}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    propertyType: e.target.value as PropertyFilterState["propertyType"],
                  })
                }
                className="w-full appearance-none rounded-xl border border-white/15 bg-[#263C50] px-3.5 py-2 pr-8 text-xs text-[#FFF9F4] focus:border-[#F6B99D] focus:outline-none"
              >
                <option value="all">All Typologies</option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <Home className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#B9D7E8]/60" />
            </div>
          </div>

          {/* Bedrooms Pills */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#B9D7E8]/80 mb-1.5">
              Bedrooms (Suites)
            </label>
            <div className="flex items-center gap-1.5">
              {[
                { label: "All", val: "all" },
                { label: "3 BHK", val: 3 },
                { label: "4 BHK", val: 4 },
                { label: "5+ BHK", val: 5 },
              ].map((bed) => {
                const isSelected = filters.bedrooms === bed.val;
                return (
                  <button
                    key={bed.label}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...filters,
                        bedrooms: bed.val as PropertyFilterState["bedrooms"],
                      })
                    }
                    className={`flex-1 py-2 text-center rounded-xl text-xs font-sans transition-all ${
                      isSelected
                        ? "bg-[#FFF9F4] text-[#263C50] font-semibold"
                        : "bg-white/5 border border-white/10 text-[#FFF9F4]/75 hover:bg-white/10"
                    }`}
                  >
                    {bed.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget Range Dropdown */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#B9D7E8]/80 mb-1.5">
              Budget Horizon (INR)
            </label>
            <select
              value={filters.priceRange}
              onChange={(e) =>
                onChange({
                  ...filters,
                  priceRange: e.target.value as PropertyFilterState["priceRange"],
                })
              }
              className="w-full appearance-none rounded-xl border border-white/15 bg-[#263C50] px-3.5 py-2 text-xs text-[#FFF9F4] focus:border-[#F6B99D] focus:outline-none"
            >
              <option value="all">Any Investment Scale</option>
              {filters.category !== "rent" && (
                <>
                  <option value="under_15cr">Under ₹15 Crore</option>
                  <option value="15cr_25cr">₹15 Cr – ₹25 Crore</option>
                  <option value="above_25cr">Above ₹25 Crore</option>
                </>
              )}
              {filters.category !== "buy" && (
                <>
                  <option value="under_4l">Under ₹4 Lakh / mo (Lease)</option>
                  <option value="above_4l">Above ₹4 Lakh / mo (Lease)</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* 3. Live Results Count & Active Filter Tags */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="h-2 w-2 rounded-full bg-[#F6B99D] animate-pulse" />
            <span className="text-[#FFF9F4]/90 font-medium">
              Showing {totalMatches} {totalMatches === 1 ? "Curated Residence" : "Curated Residences"}
            </span>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              {filters.category !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/15 px-2.5 py-0.5 text-[10px] font-mono text-[#F6B99D]">
                  Category: {filters.category.toUpperCase()}
                  <button
                    onClick={() => onChange({ ...filters, category: "all" })}
                    aria-label="Remove category filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.city !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/15 px-2.5 py-0.5 text-[10px] font-mono text-[#F6B99D]">
                  City: {filters.city}
                  <button
                    onClick={() => onChange({ ...filters, city: "all" })}
                    aria-label="Remove city filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.propertyType !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/15 px-2.5 py-0.5 text-[10px] font-mono text-[#F6B99D]">
                  Type: {filters.propertyType}
                  <button
                    onClick={() =>
                      onChange({ ...filters, propertyType: "all" })
                    }
                    aria-label="Remove property type filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.bedrooms !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/15 px-2.5 py-0.5 text-[10px] font-mono text-[#F6B99D]">
                  Suites: {filters.bedrooms}+ BHK
                  <button
                    onClick={() => onChange({ ...filters, bedrooms: "all" })}
                    aria-label="Remove bedrooms filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.priceRange !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/15 px-2.5 py-0.5 text-[10px] font-mono text-[#F6B99D]">
                  Budget Filtered
                  <button
                    onClick={() => onChange({ ...filters, priceRange: "all" })}
                    aria-label="Remove budget filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.favoritesOnly && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F6B99D]/20 border border-[#F6B99D]/40 px-2.5 py-0.5 text-[10px] font-mono text-[#F6B99D]">
                  Saved Only
                  <button
                    onClick={() => onChange({ ...filters, favoritesOnly: false })}
                    aria-label="Remove favorites only filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {/* Clear All Button */}
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#B9D7E8] hover:text-[#FFF9F4] underline ml-2 transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
