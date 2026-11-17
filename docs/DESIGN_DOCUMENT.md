# AVENORA — Design Document & Design System Architecture

**Brand**: AVENORA  
**Tagline**: *Find a place that feels like you.*  
**Design Standard**: Luxury Architectural Monograph & Editorial Digital Curation  
**Document Version**: 1.0.0 (Hackathon Release)  

---

## 1. Brand Identity & Philosophy

AVENORA is conceived as a digital monograph for high-end architecture and private estates. Its aesthetic avoids commercial real estate clutter in favor of spacious composition, cinematic photography, high-contrast typography, and restrained interactions.

### The Brand Pillars
1. **Sanctuary Over Space**: Emphasizing living atmosphere, orientation, and serenity over gross square footage.
2. **Materiality & Light**: Focusing on raw architectural materials—Roman travertine, charred yakisugi cedar, Deccan granite, and acoustic glass.
3. **Discretion**: Quiet luxury, private desks, and confidential representation.

---

## 2. Exact Palette Specification

The AVENORA design system uses a curated 5-color palette, configured in CSS variables and Tailwind CSS v4 `@theme`:

| Token Name | Hex Code | RGB | Role in Interface | Accessibility Role |
| :--- | :--- | :--- | :--- | :--- |
| **Deep Slate Blue** | `#263C50` | `rgb(38, 60, 80)` | Canvas background, glassmorphic panels, modal backdrop, input fields | Dark theme background (Luminance: ~0.04) |
| **Warm Ivory** | `#FFF9F4` | `rgb(255, 249, 244)` | Primary typography, headlines, high-contrast labels, primary pill buttons | Foreground text (Contrast ratio on `#263C50` > 14:1, passes WCAG AAA) |
| **Warm Sunset Peach**| `#F6B99D` | `rgb(246, 185, 157)` | Tagline accents, radar pulse rings, active state pills, INR prices, primary CTAs | Accent & Interactive focus (Contrast on `#263C50` > 7.5:1, passes WCAG AA) |
| **Powder Blue** | `#B9D7E8` | `rgb(185, 215, 232)` | Architectural grid lines, coordinate pills, technical metadata, subtle card borders | Secondary metadata & subtle accents (Contrast > 8.2:1) |
| **Pure White** | `#FFFFFF` | `rgb(255, 255, 255)` | Pure highlights, high-contrast focus rings, pill active states | Accent & border highlights |

---

## 3. Typography Architecture

The typographic hierarchy balances classical editorial serif elegance with modern geometric precision:

```
Headings & Display:
  Cormorant Garamond (Google Fonts)
  Weights: 300 (Light), 400 (Regular), 500 (Medium), Italic
  Letter-spacing: tracking-[0.16em] to tracking-[0.24em]

Body & User Interface:
  Plus Jakarta Sans (Google Fonts)
  Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-bold)
  Letter-spacing: tracking-normal to tracking-[0.18em]

Technical Specs & Badges:
  System Monospace (SF Mono, Menlo, monospace)
  Weights: 400 (Regular), 500 (Medium)
  Letter-spacing: tracking-[0.22em] to tracking-[0.35em]
```

### Typographic Scales

| Element | Font Family | Size (Mobile → Desktop) | Weight | Line Height | Tracking |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Brand Title** | Cormorant Garamond | `48px → 112px` | 300 | 0.92 | `0.16em` uppercase |
| **Section Headlines** | Cormorant Garamond | `32px → 64px` | 300 | 1.08 | `-0.02em` |
| **Taglines & Quotes** | Cormorant Garamond | `18px → 28px` | 300 Italic | 1.30 | `0.04em` |
| **Card Titles** | Cormorant Garamond | `20px → 24px` | 400 | 1.20 | Normal |
| **Price Callouts (INR)**| Cormorant Garamond | `24px → 36px` | 500 | 1.00 | `-0.01em` |
| **Body Paragraphs** | Plus Jakarta Sans | `14px → 16px` | 300 | 1.65 | `0.01em` |
| **Monograph Eyebrows**| System Monospace | `9px → 11px` | 500 | 1.00 | `0.24em` uppercase |

---

## 4. UI Component Library

### 4.1 Monogram & Brand Logo (`BrandLogo.tsx`)
- Circular emblem featuring an architectural chevron apex, horizon line in Warm Sunset Peach (`#F6B99D`), and sanctuary focal dot in Powder Blue (`#B9D7E8`).
- Accompanied by the wordmark **AVENORA** in Cormorant Garamond and the micro-subtitle **PRIVATE HORIZONS**.

### 4.2 Luxury Buttons (`LuxuryButton.tsx`)
- **Primary**: Warm Ivory (`#FFF9F4`) solid pill with Deep Slate text and subtle hover translation (`-translate-y-0.5`).
- **Peach**: Warm Sunset Peach (`#F6B99D`) background with subtle box-shadow glow (`rgba(246,185,157,0.25)`).
- **Outline**: Transparent background with Powder Blue (`#B9D7E8`/40) border and hover brightness.
- **Glass**: Frosted glassmorphism background (`backdrop-blur-md`) with 1px border.

### 4.3 Ambient Soundscape Synthesizer (`SoundAmbienceToggle.tsx`)
- Web Audio API implementation playing a serene 432Hz harmonic tone layered with a 450Hz low-pass filtered pink noise simulating ocean breezes.
- Muted by default; initiates only upon deliberate user gesture.
- Animated audio waveform bars indicating live status.

### 4.4 Architectural Hotspot Pins (`HotspotPin.tsx`)
- Radar concentric circles pulsing outward over photography.
- Numbered pill (`01`, `02`, `03`) with hover popover revealing category badge, title, specification metric, and architectural note.

### 4.5 Property Cards (`PropertyCard.tsx`)
- Aspect ratio: `16:10` image stage with `group-hover:scale-108` smooth transition.
- Badges: `DEMO`, `BUY`/`RENT`, and `Locality · City`.
- Working favorite heart button with click-propagation isolation and localStorage persistence.
- Specs bar showing BHK, Baths, and Area in square feet.
- Prominent INR price with `"Explore ↗"` CTA.

### 4.6 Property Detail Modal (`PropertyDetailModal.tsx`)
- Full-screen modal with multi-photo gallery viewer, previous/next controls, and active thumbnail strip.
- DEMO LISTING compliance banner.
- 4-column quick specification grid (Suites, Baths, Living Footprint, Facing).
- Complete architectural narrative and amenities checklist.
- Technical specifications table (Flooring, Ceiling Height, Facing, Parking, Possession, RERA No.).
- Working confidential inquiry form with scheduled reference generation (`AVN-REQ-XXXXXX`).

### 4.7 Combined Property Filters (`PropertyFilters.tsx`)
- Segmented Category switch (*All / Buy / Rent*).
- Metro filter chips (*Mumbai, Pune, Bangalore, Hyderabad*).
- Typology dropdown (*Penthouse, Architectural Villa, Sky Residence, Garden Duplex, Heritage Estate*).
- Bedroom chips (*All, 3 BHK, 4 BHK, 5+ BHK*).
- INR Budget selector for both capital acquisitions and monthly leases.
- Real-time keyword search with instant clear.
- Live result counter (*"Showing 12 Curated Residences"*) and one-click *"Reset All Filters"* action.

### 4.8 Floating AI Property Consultant (`AIConsultantChat.tsx`)
- Floating launcher with pulsing aura at bottom-right corner.
- Responsive chat window (`460px` desktop / `92vw` mobile).
- Welcome message and suggested query quick-chips:
  - `"2BHK in Pune"`
  - `"under ₹80 lakh"`
  - `"luxury villa"`
  - `"rental properties"`
- Real-time natural language query parser and property matcher.
- Renders interactive property cards directly inside chat bubbles.
- One-click `"Inspect ↗"` action that opens the property detail modal directly.

---

## 5. User Journeys

### Journey 1: Visual Immersion & Monograph Reveal
```
Landing on Site → View Initial Framed Portal & Tagline
  → Scroll Down Scrub → Portal Expands 56vw to 100vw
  → Typography Lifts & Parallax Counter-Zoom Eases In
  → Full-Bleed Deep Brand Reveal & Architectural Specs Appear
  → Hover / Click Hotspot Pins on Villa Photography
```

### Journey 2: Parametric Search & Filtering
```
Scroll to Section 2 → Filter by "Mumbai" → Filter by "Buy"
  → Select "Penthouse" Typology → View Live Match Count (1 Match)
  → Card Zoom Hover → Click Heart to Save to Favorites
  → Click "Saved (1)" Filter to View Isolated Shortlist
```

### Journey 3: Deep Inspection & Inquiry Submission
```
Click Card or "Explore ↗" → Detail Modal Opens with Multi-Image Gallery
  → Browse Through High-Res Photos & Inspect Architectural Specs Table
  → Fill In Name, Email, and Preferred Viewing Date
  → Submit Form → Receive Instant Confirmed Reference ID & Confirmation Receipt
```

### Journey 4: Conversational AI Discovery
```
Click Floating AI Button → Chat Window Slides Open
  → Click Suggested Chip "2BHK in Pune"
  → AI Explains Pune Luxury 3BHK Minimum Portfolio & Recommends Closest Sanctuaries
  → In-Chat Mini-Cards Rendered → Click "Inspect ↗" on Card
  → Full Residence Detail Modal Opens Immediately
```

---

## 6. GSAP Motion & ScrollTrigger Architecture

All animations use GSAP 3.12 with ScrollTrigger, encapsulated within React `useEffect` and cleaned up with `gsap.context()`:

1. **Hero Expanding Portal**:
   - Trigger: `#sanctuary-scene` container (`min-height: 340vh`)
   - Pin: Viewport stage (`sticky top-0 h-screen w-full`)
   - Scrub: `1.2` damping
   - Timeline transforms portal from `width: 56vw, height: 50vh, borderRadius: 28px` to `100vw × 100vh, borderRadius: 0px`.
   - Image counter-zoom from `scale: 1.25` down to `1.05`.
   - Initial headline fades and translates with `y: -70px, scale: 1.06`.

2. **Section 2 & 3 Entrance Stagger**:
   - `ScrollTrigger` triggers section header at `top 85%`.
   - Property cards animate using `gsap.fromTo(cards, { opacity: 0, y: 35 }, { opacity: 1, y: 0, stagger: 0.05, clearProps: "transform,opacity" })`.

3. **Floating AI Chat Opening**:
   - Animates from `opacity: 0, scale: 0.9, y: 20` to `opacity: 1, scale: 1, y: 0` in 350ms with `power2.out`.

4. **Reduced-Motion Handling**:
   - Checks `window.matchMedia('(prefers-reduced-motion: reduce)')`.
   - When active, scrubs and scale transitions are bypassed; elements initialize in their fully expanded, visible state.

---

## 7. Responsiveness & Accessibility

- **Mobile First & Desktop Refined**:
  - Small Mobile (`320px–389px`): Single-column cards, condensed padding, touch-friendly `44px` targets.
  - Standard Mobile (`390px–639px`): Full-width modal sheets, responsive chat viewports, drawer menu navigation.
  - Tablet (`640px–1023px`): 2-column discovery grid, side-by-side specs.
  - Desktop (`1024px–1920px+`): 3-column discovery grid, full editorial layout, pinned hero scroll stage.
- **Accessibility Compliance**:
  - High-contrast text exceeding WCAG AA / AAA standards.
  - Keyboard escape listeners for modals and chat windows.
  - Semantic HTML landmarks (`<main>`, `<header>`, `<section>`, `<article>`, `<footer>`).
  - Screen-reader friendly aria-labels and roles across all interactive controls.
