export interface ArchitecturalHotspot {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  title: string;
  subtitle: string;
  detail: string;
  metric?: string;
  category: "Architecture" | "Landscape" | "Materiality" | "Sanctuary";
}

export interface SanctuaryScene {
  id: string;
  slug: string;
  code: string;
  title: string;
  subtitle: string;
  location: string;
  coordinates: string;
  architect: string;
  yearBuilt: string;
  elevation: string;
  valuation: string;
  exposure: string;
  status: string;
  image: string;
  imageAlt: string;
  description: string;
  curatorNote: string;
  hotspots: ArchitecturalHotspot[];
  specs: {
    interior: string;
    grounds: string;
    suites: number;
    baths: number;
  };
}

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

export type PropertyCity = "Pune" | "Mumbai" | "Bangalore" | "Hyderabad";
export type PropertyType =
  | "Penthouse"
  | "Architectural Villa"
  | "Sky Residence"
  | "Garden Duplex"
  | "Heritage Estate";
export type ListingCategory = "buy" | "rent";

export interface PropertyListing {
  id: string;
  code: string;
  title: string;
  tagline: string;
  city: PropertyCity;
  locality: string;
  price: number; // In INR (e.g. 185000000 for ₹18.5 Cr, or 450000 for ₹4.5 L/mo)
  priceFormatted: string; // e.g. "₹18.50 Cr" or "₹4.50 L / mo"
  category: ListingCategory;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  areaFormatted: string; // e.g. "5,200 sq.ft"
  images: string[];
  description: string;
  amenities: string[];
  specifications: {
    flooring: string;
    ceilingHeight: string;
    facing: string;
    parking: string;
    furnishing: string;
    possession: string;
    reraId: string;
  };
  isFeatured?: boolean;
  isDemo: boolean;
}

export interface PropertyFilterState {
  category: "all" | "buy" | "rent";
  city: "all" | PropertyCity;
  propertyType: "all" | PropertyType;
  bedrooms: "all" | 3 | 4 | 5; // 5 means 5+
  priceRange: "all" | "under_15cr" | "15cr_25cr" | "above_25cr" | "under_4l" | "above_4l";
  searchQuery: string;
  sortBy: "featured" | "price_asc" | "price_desc" | "area_desc";
  favoritesOnly: boolean;
}

// Stage 3 Types
export interface ContactInquiryData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  propertyType: string;
  budget: string;
  message: string;
  createdAt?: string;
}

export interface ViewingRequestData {
  id?: string;
  propertyId: string;
  propertyTitle: string;
  propertyCity: string;
  preferredDate: string;
  timeSlot: string;
  name: string;
  phone: string;
  email: string;
  notes?: string;
  createdAt?: string;
}

export interface StorageSubmissionResult {
  success: boolean;
  referenceId: string;
  mode: "local_demo" | "supabase";
  message: string;
  details?: Record<string, unknown>;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  content: string;
  matchedProperties?: PropertyListing[];
  suggestedQueries?: string[];
  mode?: "ai_live" | "demo_rule_based";
  timestamp: string;
}
