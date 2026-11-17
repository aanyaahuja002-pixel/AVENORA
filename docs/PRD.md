# AVENORA — Product Requirements Document (PRD)

**Project Name**: AVENORA  
**Brand Tagline**: *Find a place that feels like you.*  
**Document Version**: 1.0.0 (Hackathon Release)  
**Status**: Implemented & Verified  

---

## 1. Executive Summary & Product Overview

AVENORA is an ultra-luxury real estate discovery platform created to redefine how architectural sanctuaries and high-end residences are discovered, experienced, and acquired. Unlike traditional transactional listing portals that overwhelm users with cluttered advertising and low-resolution data, AVENORA approaches real estate through the lens of architectural curation, editorial design, and spatial storytelling.

AVENORA bridges international trophy estates (e.g. cliffside villas on the Amalfi Coast, Kyoto timber pavilions, Engadin alpine retreats) with prime urban residences across premier Indian metropolitan enclaves (**Mumbai, Pune, Bangalore, and Hyderabad**).

---

## 2. Problem Statement

### 2.1 The High-End Real Estate Dilemma
1. **Lack of Architectural Storytelling**: Traditional platforms treat multi-million dollar architectural masterpieces like generic commodities, prioritizing grid density over spatial emotion and materiality.
2. **Disregard for Discretion & Privacy**: High-Net-Worth Individuals (HNWIs) and family offices demand confidential representation. Mainstream portals distribute contact details to third-party brokers without client consent.
3. **Impersonal Search Experience**: Standard dropdown filters fail to capture lifestyle nuances (e.g. cantilever sea horizon, banyan tree canopy, private lap pool, soundproof acoustic glazing).
4. **Disjointed Digital Immersion**: Buyers rarely get a sense of light, orientation, or craftsmanship before booking a physical walkthrough.

---

## 3. User Personas

### Persona A: The Industrialist / Family Office Principal
- **Profile**: 48–65 years old, based in Mumbai/London. Looking for legacy penthouses or sea-facing trophy properties.
- **Pain Points**: Rejection of mass-market portals; values total confidentiality, architectural pedigree, and white-glove advisory.
- **Needs**: Discrete viewing scheduling, high-resolution architectural monographs, direct partner access.

### Persona B: The Design Connoisseur / Creative Entrepreneur
- **Profile**: 32–45 years old, tech or creative founder in Bangalore or Pune.
- **Pain Points**: Frustrated by standard cookie-cutter layouts; seeks biophilic atriums, exposed concrete, and basalt courtyards.
- **Needs**: Interactive architectural hotspot inspection, material transparency, intelligent conversational search.

### Persona C: The Global Executive / NRI Relocator
- **Profile**: 38–52 years old, returning from Zurich or Singapore to Hyderabad or Bangalore.
- **Pain Points**: Difficult to evaluate neighborhood orientation and high-end leasehold vs. acquisition options remotely.
- **Needs**: Clean INR budget horizons, transparent demo data labeling, natural language AI property consultation.

---

## 4. User Stories & Acceptance Criteria

### Epics Overview

| Epic ID | Epic Name | Scope |
| :--- | :--- | :--- |
| **EPIC-01** | Architectural Hero & Brand Reveal | Section 1: Pinned scroll-scrubbed hero with GSAP ScrollTrigger |
| **EPIC-02** | Metropolitan Property Discovery | Section 2: Combined filtering, INR pricing, and responsive card grid |
| **EPIC-03** | Residence Detail Inspection | Full-screen interactive modal with gallery, specs, and inquiry CTA |
| **EPIC-04** | Private Office Advisory & Viewing | Section 3: Contact inquiry & viewing booking with honest persistence |
| **EPIC-05** | Conversational AI Consultant | Floating intelligent concierge with real estate entity matching |

### Detailed User Stories

#### US-101: Immersive Architectural Hero
- *As a visitor*, I want to scroll through a pinned, cinematic expanding image hero, so that I experience the emotional weight and craftsmanship of the architecture.
- **Acceptance Criteria**:
  - The hero frame smoothly scales from a centered portal (`56vw × 50vh`) to full-bleed (`100vw × 100vh`).
  - Typography lifts with counter-parallax dolly camera zoom.
  - Interactive radar hotspots appear on the photograph to reveal material specifications.
  - Three international sanctuary scenes (Amalfi, Kyoto, St. Moritz) can be switched with instant crossfade.
  - Audio atmosphere synthesizer generates soothing ambient soundscapes via Web Audio API.

#### US-201: Curated Metropolitan Discovery Grid
- *As a prospective buyer/tenant*, I want to filter residences across Mumbai, Pune, Bangalore, and Hyderabad by category, price, typology, and bedrooms.
- **Acceptance Criteria**:
  - Combined filters update results instantly with live match counters.
  - All properties feature realistic INR pricing, full specs, and clear `DEMO` badges.
  - Empty states display an architectural compass with a one-click reset action.

#### US-202: Persistent Residence Bookmarking
- *As an active researcher*, I want to save residences to my favorites, so that I can revisit them across sessions.
- **Acceptance Criteria**:
  - Clicking the heart icon toggles the favorite state with immediate `localStorage` synchronization.
  - A dedicated "Saved (X)" filter isolates bookmarked residences.

#### US-301: Residence Inspection & Viewing Form
- *As an interested party*, I want to inspect high-resolution photographs, flooring specs, and ceiling heights, and request a private viewing.
- **Acceptance Criteria**:
  - Clicking any card opens a modal with a multi-photo gallery and thumbnail navigator.
  - The inquiry form validates name, email, phone, and viewing dates.
  - Submissions display an instant reference tracking code (`AVN-REQ-XXXXXX`).

#### US-401: Confidential Advisory & Viewing Booking
- *As a prospective client*, I want to submit an acquisition brief or schedule a private walkthrough.
- **Acceptance Criteria**:
  - Validates all input fields with real-time feedback.
  - Saves to Supabase if configured; otherwise saves to `localStorage` and provides an honest demo disclosure.
  - Explicitly informs the user that no message was dispatched to an external agent during demo mode.

#### US-501: Conversational AI Property Consultant
- *As an exploratory user*, I want to chat with an AI consultant using natural language (e.g., *"2BHK in Pune"*, *"under ₹80 lakh"*, *"luxury villa"*, *"rental properties"*).
- **Acceptance Criteria**:
  - The floating consultant extracts city, budget, bedrooms, and typology.
  - Accurately references the real property dataset.
  - Explains inventory constraints (e.g., Pune collection starting from 3BHK, luxury pricing thresholds vs. rental leases).
  - Renders interactive mini-cards directly in the chat with a one-click `"Inspect ↗"` action that opens the full property detail modal.
  - Supports server-side API keys (`GEMINI_API_KEY`) with a server-side route handler and client-side rule-based fallback.

---

## 5. MVP Scope & Delivery Status

| Feature Component | Target Release | Status | Verification Status |
| :--- | :--- | :--- | :--- |
| Pinned Expanding Image Hero (GSAP) | Section 1 | **Delivered** | Verified in Chromium & WebKit |
| Ambient Acoustic Web Audio Synthesizer | Section 1 | **Delivered** | Verified (432Hz ambient drone) |
| Multi-scene International Switcher | Section 1 | **Delivered** | Verified (Positano, Kyoto, St. Moritz) |
| Interactive Architectural Hotspots | Section 1 | **Delivered** | Verified with radar pulses & popovers |
| 12 Indian Metro Property Listings | Section 2 | **Delivered** | Verified (Mumbai, Pune, BLR, HYD) |
| Combined Multi-Parametric Filter Engine | Section 2 | **Delivered** | Verified (Category, City, Type, BHK, Budget) |
| Favorites System with `localStorage` | Section 2 | **Delivered** | Verified with cross-tab event sync |
| Full Property Modal & Multi-Image Gallery | Section 2 | **Delivered** | Verified with thumbnail strip & keyboard ESC |
| Confidential Contact Advisory Section | Section 3 | **Delivered** | Verified with input validation & honest notices |
| Viewing Request System with Slot Selection | Section 3 | **Delivered** | Verified with date and time-slot validation |
| Floating AI Property Consultant Chat | Section 3 | **Delivered** | Verified with 4 core suggested queries & in-chat cards |
| Server-Side `/api/chat` Route Handler | Section 3 | **Delivered** | Verified with server-side secrets isolation |

---

## 6. Success Metrics & Quality Standards

1. **Performance**: Zero client-side render lag; `next build` static page generation completes in under 1 second.
2. **Accessibility**: Full keyboard navigability (Escape to close modals/chat, Tab focus outlines in Peach `#F6B99D`), semantic landmarks (`main`, `header`, `section`, `article`, `footer`), and native `prefers-reduced-motion` detection.
3. **Code Quality**: Strict TypeScript 5 with zero `any` evasions on domain models, 100% clean ESLint pass with zero warnings or errors.
4. **Data Integrity**: Honest demo disclosures across all forms; strict client-side persistence with clean reference tracking.
