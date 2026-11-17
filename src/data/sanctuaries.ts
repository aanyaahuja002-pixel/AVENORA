import { SanctuaryScene } from "@/types";

export const SANCTUARIES: SanctuaryScene[] = [
  {
    id: "amalfi-villa-solaria",
    slug: "villa-solaria",
    code: "AVN-01/IT",
    title: "Villa Solaria",
    subtitle: "Cantilevered Cliffside Sanctuary",
    location: "Positano, Amalfi Coast, Italy",
    coordinates: "40.6281° N, 14.4850° E",
    architect: "Studio Valenza & Associati",
    yearBuilt: "2024",
    elevation: "185m Above Tyrrhenian Sea",
    valuation: "€24,800,000",
    exposure: "Full South-Southwest",
    status: "Private Treaty",
    image:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=2560&q=90",
    imageAlt: "Villa Solaria modern luxury cliffside residence overlooking the Amalfi sea",
    description:
      "Sculpted directly into the limestone bluffs of Positano, Villa Solaria fuses monolithic Roman travertine with frameless floor-to-ceiling glass. A 24-meter cantilevered infinity pool appears suspended between sky and Mediterranean azure.",
    curatorNote:
      "A rare architectural composition where interior volumes breathe with marine mist and golden hour illumination.",
    specs: {
      interior: "1,140 m²",
      grounds: "6,800 m²",
      suites: 6,
      baths: 8,
    },
    hotspots: [
      {
        id: "pool-cantilever",
        x: 48,
        y: 64,
        category: "Architecture",
        title: "24m Cantilevered Seawater Pool",
        subtitle: "Suspended Monolith",
        detail:
          "Engineered with post-tensioned volcanic basalt and heated filtered seawater, projecting 12 meters over the cliff edge.",
        metric: "12m Overhang",
      },
      {
        id: "travertine-terrace",
        x: 28,
        y: 72,
        category: "Materiality",
        title: "Roman Travertine Terraces",
        subtitle: "Quarried Tivoli Stone",
        detail:
          "Hand-honed slabs treated with sea-salt resilient sealants, keeping stone naturally tempered through Mediterranean summers.",
        metric: "420 m² Terrace",
      },
      {
        id: "glass-atrium",
        x: 68,
        y: 44,
        category: "Sanctuary",
        title: "Acoustic Horizon Glazing",
        subtitle: "Motorized Minimalist Glass",
        detail:
          "Triple-glazed acoustic glass panels sliding effortlessly into subterranean pockets, dissolving the threshold to the horizon.",
        metric: "98% Light Transmission",
      },
    ],
  },
  {
    id: "kyoto-kanso-pavilion",
    slug: "kanso-pavilion",
    code: "AVN-02/JP",
    title: "Kanso Pavilions",
    subtitle: "Cedars, Mist & Charred Hinoki",
    location: "Higashiyama, Kyoto, Japan",
    coordinates: "35.0037° N, 135.7820° E",
    architect: "Kensho Arata & Atelier",
    yearBuilt: "2023",
    elevation: "240m Above Ancient Kyoto",
    valuation: "¥3,850,000,000",
    exposure: "Eastward Sunrise Alignment",
    status: "Private Treaty",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2560&q=90",
    imageAlt: "Kanso Pavilions minimalist luxury architectural compound with evening pool reflection",
    description:
      "Nestled along the misted cedar slopes of Higashiyama, Kanso reinterprets Sukiya-zukuri architecture through Japanese black granite, yakisugi charred cedar, and thermal reflection basins.",
    curatorNote:
      "The layout orchestrates silence. Each room frames a living seasonal scroll of bamboo and morning light.",
    specs: {
      interior: "860 m²",
      grounds: "12,400 m²",
      suites: 5,
      baths: 6,
    },
    hotspots: [
      {
        id: "onsen-basin",
        x: 36,
        y: 68,
        category: "Sanctuary",
        title: "Natural Geothermal Onsen",
        subtitle: "Mineral Spring Well",
        detail:
          "Private mineral-rich geothermal flow feeding a continuous-edge black basalt thermal plunge.",
        metric: "41.5°C Geothermal",
      },
      {
        id: "shou-sugi-ban",
        x: 62,
        y: 38,
        category: "Materiality",
        title: "Yakisugi Charred Hinoki",
        subtitle: "Traditional Fire Preservation",
        detail:
          "Charred cypress cladding crafted by Kyoto wood masters, offering natural weather resistance and tactile matte texture.",
        metric: "100-Year Longevity",
      },
    ],
  },
  {
    id: "engadin-alpine-solitude",
    slug: "alpine-solitude",
    code: "AVN-03/CH",
    title: "The Engadin Solitude",
    subtitle: "Brutalist Larch & Glacial Crest",
    location: "St. Moritz, Engadin Valley, Switzerland",
    coordinates: "46.4908° N, 9.8355° E",
    architect: "Atelier Steiger Architekten",
    yearBuilt: "2025",
    elevation: "1,822m Alpine Peak",
    valuation: "CHF 31,500,000",
    exposure: "360° Alpine Panorama",
    status: "Private Treaty",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2560&q=90",
    imageAlt: "The Engadin Solitude luxury contemporary estate illuminated at twilight",
    description:
      "A monumental sanctuary anchored into granite bedrock. Expansive Swiss larch ceilings meet polished poured terrazzo and triple-glazed panoramic apertures capturing the Bernina Range.",
    curatorNote:
      "An alpine refuge engineered for deep contemplation and extreme temperature resilience.",
    specs: {
      interior: "1,320 m²",
      grounds: "9,500 m²",
      suites: 7,
      baths: 9,
    },
    hotspots: [
      {
        id: "larch-vault",
        x: 52,
        y: 34,
        category: "Architecture",
        title: "Cantilevered Glacial Lounge",
        subtitle: "Frameless Panoramic Bow",
        detail:
          "A dramatic 8-meter cantilever framing unbroken views of Lake Silvaplana and alpine crests.",
        metric: "270° Mountain View",
      },
      {
        id: "thermal-hearth",
        x: 32,
        y: 58,
        category: "Materiality",
        title: "Monolithic Granite Hearth",
        subtitle: "Alpine Thermal Core",
        detail:
          "Single-block grey Andeer granite fireplace radiating steady geothermal warmth throughout the main salon.",
        metric: "18-Ton Monolith",
      },
    ],
  },
];
