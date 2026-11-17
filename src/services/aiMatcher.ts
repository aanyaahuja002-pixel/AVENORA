import { DEMO_PROPERTIES } from "@/data/properties";
import { PropertyListing } from "@/types";

export interface AIProcessedResponse {
  content: string;
  matchedProperties: PropertyListing[];
  suggestedQueries?: string[];
  mode: "ai_live" | "demo_rule_based";
}

/**
 * Intelligent Rule-Based Luxury Natural Language Matcher
 * Parses natural language queries against the real DEMO_PROPERTIES dataset.
 */
export function processPropertyQuery(rawQuery: string): AIProcessedResponse {
  const query = rawQuery.toLowerCase().trim();

  // 1. SPECIFIC PROMPT: "2BHK in Pune" or similar small configurations in Pune
  if (
    (query.includes("2bhk") || query.includes("2 bhk") || query.includes("2 bed")) &&
    query.includes("pune")
  ) {
    const puneProperties = DEMO_PROPERTIES.filter((p) => p.city === "Pune");
    return {
      mode: "demo_rule_based",
      content:
        "AVENORA's curated collection in Pune focuses on ultra-luxury estates starting from 3 BHK (such as our Lane 6 Canopy Residence) up to 5 BHK standalone villas. While we currently do not host 2 BHK configurations in Pune, here are the closest boutique sanctuaries in Koregaon Park and Kalyani Nagar that offer generous natural light and private garden terraces:",
      matchedProperties: puneProperties,
      suggestedQueries: [
        "rental properties in Pune",
        "luxury villa in Pune",
        "penthouses in Mumbai",
      ],
    };
  }

  // 2. SPECIFIC PROMPT: "under ₹80 lakh" or small capital budget
  if (
    query.includes("80 lakh") ||
    query.includes("80l") ||
    query.includes("under 80") ||
    query.includes("1 crore") ||
    query.includes("under 1 cr")
  ) {
    const rentalProperties = DEMO_PROPERTIES.filter(
      (p) => p.category === "rent"
    );
    return {
      mode: "demo_rule_based",
      content:
        "AVENORA specializes in flagship prime estates where capital acquisitions generally commence from ₹9.80 Crore. However, for a refined annual residence horizon, we curate sovereign leasehold properties starting from ₹3.20 Lakh/month across Mumbai, Pune, Bangalore, and Hyderabad. Here are our premier rental residences:",
      matchedProperties: rentalProperties,
      suggestedQueries: [
        "rental properties",
        "luxury villa",
        "3 BHK in Bangalore",
      ],
    };
  }

  // 3. SPECIFIC PROMPT: "luxury villa" / "villas"
  if (
    query.includes("villa") ||
    query.includes("bungalow") ||
    query.includes("mansion") ||
    query.includes("estate")
  ) {
    const villas = DEMO_PROPERTIES.filter(
      (p) =>
        p.propertyType === "Architectural Villa" ||
        p.propertyType === "Garden Duplex"
    );
    return {
      mode: "demo_rule_based",
      content:
        "We curate four exceptional standalone architectural villas and garden estates featuring private lap pools, monolithic stone courtyards, and mature tree canopies across Pune, Bangalore, and Hyderabad:",
      matchedProperties: villas,
      suggestedQueries: [
        "villas in Hyderabad",
        "villas in Pune",
        "penthouses in Mumbai",
      ],
    };
  }

  // 4. SPECIFIC PROMPT: "rental properties" / "rent" / "lease"
  if (
    query.includes("rent") ||
    query.includes("lease") ||
    query.includes("tenant")
  ) {
    const rentals = DEMO_PROPERTIES.filter((p) => p.category === "rent");
    return {
      mode: "demo_rule_based",
      content:
        "Here are AVENORA's sovereign residences available for private lease across South Mumbai's Marine Drive, Koregaon Park in Pune, Sadashivanagar in Bangalore, and Banjara Hills in Hyderabad:",
      matchedProperties: rentals,
      suggestedQueries: [
        "Marine Drive lease",
        "Pune rental residence",
        "penthouses for sale",
      ],
    };
  }

  // 5. EXTRACT ENTITIES: City, Bedrooms, Property Type, Keywords
  const extractedCity = ["mumbai", "pune", "bangalore", "bengaluru", "hyderabad"].find((c) =>
    query.includes(c)
  );
  const normalizedCity =
    extractedCity === "bengaluru" ? "bangalore" : extractedCity;

  const extractedType = [
    "penthouse",
    "villa",
    "duplex",
    "heritage",
    "sky residence",
  ].find((t) => query.includes(t));

  const hasPool = query.includes("pool") || query.includes("jacuzzi");
  const hasSea =
    query.includes("sea") ||
    query.includes("ocean") ||
    query.includes("marine") ||
    query.includes("worli");

  // Filter dataset
  const matches = DEMO_PROPERTIES.filter((p) => {
    let score = 0;

    if (normalizedCity && p.city.toLowerCase() === normalizedCity) score += 4;
    if (extractedType) {
      if (
        extractedType === "villa" &&
        p.propertyType === "Architectural Villa"
      )
        score += 3;
      else if (
        extractedType === "penthouse" &&
        p.propertyType === "Penthouse"
      )
        score += 3;
      else if (extractedType === "duplex" && p.propertyType === "Garden Duplex")
        score += 3;
      else if (
        extractedType === "heritage" &&
        p.propertyType === "Heritage Estate"
      )
        score += 3;
      else if (
        extractedType === "sky residence" &&
        p.propertyType === "Sky Residence"
      )
        score += 3;
    }

    if (hasSea && p.locality.toLowerCase().includes("sea")) score += 3;
    if (hasPool && p.amenities.some((a) => a.toLowerCase().includes("pool")))
      score += 2;

    if (query.includes("3 bhk") && p.bedrooms === 3) score += 3;
    if (query.includes("4 bhk") && p.bedrooms === 4) score += 3;
    if (query.includes("5 bhk") && p.bedrooms >= 5) score += 3;

    if (p.locality.toLowerCase().includes(query)) score += 5;
    if (p.title.toLowerCase().includes(query)) score += 5;

    return score > 0;
  });

  if (matches.length > 0) {
    const topMatches = matches.slice(0, 3);
    const cityLabel = normalizedCity
      ? normalizedCity.charAt(0).toUpperCase() + normalizedCity.slice(1)
      : "our portfolio";
    return {
      mode: "demo_rule_based",
      content: `I've discovered ${matches.length} curated residence${
        matches.length > 1 ? "s" : ""
      } in ${cityLabel} aligning with your architectural brief:`,
      matchedProperties: topMatches,
      suggestedQueries: [
        "schedule a private viewing",
        "view architectural specs",
        "explore all residences",
      ],
    };
  }

  // 6. DEFAULT / FALLBACK MATCH
  const featured = DEMO_PROPERTIES.filter((p) => p.isFeatured).slice(0, 3);
  return {
    mode: "demo_rule_based",
    content:
      "I couldn't find an exact match for that specific inquiry in our current private collection. However, here are three of our most celebrated flagship estates across Mumbai, Pune, and Hyderabad that exemplify the AVENORA architectural vision:",
    matchedProperties: featured,
    suggestedQueries: [
      "luxury villa",
      "penthouses in Mumbai",
      "rental properties",
      "2BHK in Pune",
    ],
  };
}
