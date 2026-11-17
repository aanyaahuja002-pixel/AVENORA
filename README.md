# AVENORA — Luxury Real Estate Discovery Platform

> *"Find a place that feels like you."*

AVENORA is an ultra-luxury international real estate discovery platform that combines architectural storytelling, editorial design, and interactive discovery. Built with **Next.js 15 App Router**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **GSAP ScrollTrigger**, AVENORA bridges international trophy retreats with curated residences across India's premier metropolitan enclaves (**Mumbai, Pune, Bangalore, and Hyderabad**).

---

## Visual Showcase & Screenshots

| View | Description | File Link |
| :--- | :--- | :--- |
| **Section 1: Initial Monograph Hero** | Centered architectural portal with serif branding, coordinates, and live progress ticker | `screenshot-desktop-initial.png` |
| **Section 1: Scroll Scrubbed Expansion** | Pinned portal expanding dynamically from `56vw` to full `100vw × 100vh` bleed | `screenshot-desktop-midscroll.png` |
| **Section 1: Deep Brand Reveal** | Full-bleed editorial narrative with interactive radar hotspots and 3-scene switcher | `screenshot-desktop-revealed.png` |
| **Section 2: Curated Indian Residences** | Combined parametric filters, INR pricing, and responsive luxury card grid | `screenshot-section2-cards-grid.png` |
| **Section 2: Interactive Residence Modal**| Multi-photo gallery viewer, technical specifications table, and inquiry form | `screenshot-section2-modal-loaded.png` |
| **Section 3: Contact Advisory & Desks** | Validated acquisition brief form, desk directory, and local storage persistence receipt | `screenshot-stage3-inquiry-confirmed-success.png` |
| **Section 3: Residence Viewing Scheduler**| Property selector with date, time horizon slots, and access pass generation | `screenshot-stage3-viewing-confirmed-success.png` |
| **Stage 3: Floating AI Property Consultant**| Natural language assistant answering queries (*"2BHK in Pune"*, *"luxury villa"*) with in-chat cards | `screenshot-stage3-ai-chat-2bhk-pune.png` |
| **Mobile Responsiveness** | Fully responsive experience tested on 390px mobile viewports | `screenshot-section2-mobile-view.png` |

---

## Core Features

### 1. Immersive Pinned, Scroll-Scrubbed Expanding Image Hero (Section 1)
- **Expanding Portal**: GSAP ScrollTrigger scrubs the central framed portal from `56vw × 50vh` with `28px` rounded corners into a seamless `100vw × 100vh` full-bleed viewport.
- **Counter-Parallax Optical Zoom**: Image counter-zooms from `scale: 1.25` down to `1.05` to create a lifelike camera dolly approach.
- **Interactive Architectural Hotspot Pins**: Pulsing radar pins positioned over key architectural elements (e.g. *24m Cantilevered Seawater Pool*, *Roman Travertine Terraces*, *Acoustic Horizon Glazing*) that open detailed specification popovers.
- **Instant Sanctuary Switcher**: Seamless crossfade between 3 global sanctuaries (*Villa Solaria, Positano*, *Kanso Pavilions, Kyoto*, *The Engadin Solitude, St. Moritz*).
- **Ambient Soundscape Synthesizer**: Built using the native Web Audio API playing a soothing 432Hz harmonic chord with low-pass filtered ocean breeze.

### 2. Interactive Metropolitan Property Discovery (Section 2)
- **12 Indian Luxury Demo Listings**: Detailed residences across **Mumbai** (*Worli Sea Face, Pali Hill, Marine Drive*), **Pune** (*Koregaon Park, Kalyani Nagar*), **Bangalore** (*Lavelle Road, Indiranagar, Sadashivanagar*), and **Hyderabad** (*Jubilee Hills, Gachibowli, Banjara Hills*).
- **Combined Multi-Parametric Filter Engine**:
  - Category segmented switch (*All / Buy / Rent*).
  - City filter pills (*Mumbai, Pune, Bangalore, Hyderabad*).
  - Typology dropdown (*Penthouse, Architectural Villa, Sky Residence, Garden Duplex, Heritage Estate*).
  - Bedroom selector (*All, 3 BHK, 4 BHK, 5+ BHK*).
  - INR Budget scales for capital acquisitions and monthly leases.
  - Live keyword search across localities, titles, and architects.
  - Sort by *Curated, Price: Low to High, Price: High to Low, Area: Largest First*.
- **Working Favorites System**: Heart button toggles save to `localStorage` with cross-tab event synchronization and a dedicated "Saved (X)" view.
- **Property Detail Modal**: Full-screen modal with multi-photo gallery, previous/next controls, thumbnail strip, specifications table, and private viewing inquiry form.
- **Luxury Empty State**: Shows an architectural compass with a one-click *"Reset All Filters"* action when no listings match.

### 3. Premium Contact Advisory & Viewing Requests (Stage 3)
- **Confidential Acquisition Brief**: Validated form with name, email, phone, target location, property typology, INR budget, and requirements.
- **Private Viewing Scheduler**: Property selection dropdown, date picker, time slot selector (*Morning Light, Afternoon Tour, Golden Hour*), and contact validation.
- **Honest Persistence Model**: Saves to Supabase if configured; otherwise logs into `localStorage` and provides an honest demo disclosure confirming no message was transmitted to an external agent.
- **Metropolitan Desks Directory**: Direct lines and response SLAs for private desks in Mumbai, Pune, Bangalore, and Hyderabad.

### 4. Floating AVENORA AI Property Consultant (Stage 3)
- **Floating Launcher**: Bottom-right launcher with concentric radar pulse aura.
- **Welcome Message**: *"Hello! Welcome to AVENORA. I’m your personal property consultant. Tell me what kind of home you're dreaming of."*
- **Suggested Query Quick-Chips**:
  - `"2BHK in Pune"`: Explains that the Pune collection begins at 3 BHK and presents the closest boutique residences in Koregaon Park and Kalyani Nagar.
  - `"under ₹80 lakh"`: Explains capital acquisition price thresholds and recommends premier rental lease residences.
  - `"luxury villa"`: Filters and presents standalone villas in Pune, Bangalore, and Hyderabad.
  - `"rental properties"`: Surfaces all leasehold residences with monthly pricing in INR.
- **In-Chat Interactive Property Cards**: Mini cards rendered inside the chat flow with photo, title, price, and an `"Inspect ↗"` button that triggers the full property modal.
- **Server-Side AI API Route**: `/api/chat` handles queries server-side. Connects to Google Gemini 1.5 Flash if `GEMINI_API_KEY` is configured; otherwise falls back gracefully to the built-in rule-based natural language matcher.

---

## Exact Brand Color Palette

Configured in `src/app/globals.css` and Tailwind CSS v4 `@theme`:

| Name | Hex Code | RGB | Role |
| :--- | :--- | :--- | :--- |
| **Deep Slate Blue** | `#263C50` | `rgb(38, 60, 80)` | Canvas background, glassmorphism panels, modal backdrop |
| **Warm Ivory** | `#FFF9F4` | `rgb(255, 249, 244)` | Primary typography, headlines, high-contrast numerals |
| **Warm Sunset Peach**| `#F6B99D` | `rgb(246, 185, 157)` | Tagline accents, radar pulse rings, active state pills, INR prices |
| **Powder Blue** | `#B9D7E8` | `rgb(185, 215, 232)` | Architectural grid lines, coordinate pills, technical metadata |
| **Pure White** | `#FFFFFF` | `rgb(255, 255, 255)` | Pure highlights, focus rings, pill active states |

---

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 (`@theme inline`)
- **Animation**: GSAP 3.12 & ScrollTrigger
- **Typography**: Cormorant Garamond (Serif) & Plus Jakarta Sans via `next/font/google`
- **Audio**: Web Audio API (Native Browser)
- **Icons**: Lucide React
- **Persistence**: Dual-layer (Supabase PostgreSQL / Client LocalStorage)
- **AI Engine**: Google Gemini 1.5 Flash (`/api/chat`) with Rule-Based NLP Fallback
- **QA Testing**: Puppeteer Core & Headless Chrome

---

## Directory Structure

```
AVENORA/
├── docs/
│   ├── PRD.md                      # Product Requirements Document
│   ├── DESIGN_DOCUMENT.md          # Design System, Palette & User Journeys
│   └── ARCHITECTURE.md             # System Topology, Database & API Contracts
├── scripts/
│   ├── verify-ui.mjs               # Section 1 automated visual tests
│   ├── verify-section2.mjs         # Section 2 automated filter & modal tests
│   └── verify-stage3.mjs           # Stage 3 forms & AI chat tests
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/route.ts       # Server-side AI consultant API endpoint
│   │   ├── globals.css             # Tailwind v4 theme, palette & scrollbar styling
│   │   ├── layout.tsx              # Root layout with Cormorant & Plus Jakarta fonts
│   │   └── page.tsx                # Main application page (Sections 1, 2, 3)
│   ├── components/
│   │   ├── ai/
│   │   │   └── AIConsultantChat.tsx        # Floating AI chat window & in-chat cards
│   │   ├── contact/
│   │   ├── discovery/
│   │   ├── hero/
│   │   ├── navigation/
│   │   └── ui/
│   ├── data/
│   ├── hooks/
│   ├── services/
│   └── types/
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Prerequisites & Installation

### Prerequisites
- **Node.js**: v18.17.0 or higher (developed and tested on Node.js v26.13.1)
- **npm**: v9.0.0 or higher (or pnpm / yarn)

### Installation Steps

1. **Clone or Navigate to the Repository**:
   ```bash
   cd AVENORA
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**:
   ```bash
   cp .env.example .env.local
   ```
   *(All features function completely without environment variables in Demo Mode.)*

---

## Local Run Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server at `http://localhost:3000` |
| `npm run build` | Compiles the production build, runs type checking, and pre-renders static pages |
| `npm run start` | Starts the production server at `http://localhost:3000` |
| `npm run lint` | Runs ESLint checks across all TypeScript and React files |

---

## Environment Setup & Configuration

Refer to [`.env.example`](file:///Users/aanyaahuja/NASA/AVENORA/.env.example) for variable definitions.

### Optional Supabase Configuration
To persist acquisition briefs and viewing requests to a live PostgreSQL database:
1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Execute the table schemas documented in [`docs/ARCHITECTURE.md`](file:///Users/aanyaahuja/NASA/AVENORA/docs/ARCHITECTURE.md).
3. Set the following in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### Optional Google Gemini AI Configuration
To enable live generative LLM responses in the AI Property Consultant:
1. Obtain an API key from Google AI Studio.
2. Set the following in `.env.local`:
   ```env
   GEMINI_API_KEY=your-gemini-api-key
   ```
   *(Secrets remain strictly on the server and are never exposed to the client.)*

---

## Deployment Instructions

### Vercel (Recommended)
1. Push the repository to GitHub or GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Vercel automatically detects Next.js.
4. Add optional environment variables in the Vercel dashboard if using Supabase or Gemini.
5. Deploy.

### Node.js / Docker Server
```bash
npm run build
npm run start -- -p 3000
```

---

## Known Limitations & Hackathon Submission Notes

1. **Simulated Portfolio Data**: All Indian property listings and overseas hero sanctuaries are demonstration portfolios labeled with `DEMO` badges for hackathon demonstration.
2. **Honest Persistence Notice**: When running without Supabase credentials, forms persist to browser `localStorage` and explicitly display a confirmation notice stating that no message was dispatched to an external agent.
3. **Sound Ambience**: Built with the native Web Audio API and muted by default in accordance with browser autoplay and user-gesture policies.
4. **AI Property Consultant**: Defaults to the built-in rule-based NLP matcher against the real dataset when no `GEMINI_API_KEY` is present.
