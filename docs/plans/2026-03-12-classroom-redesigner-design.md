# Classroom Redesigner — Full Redesign Design Document

**Date:** 2026-03-12
**Status:** Approved

---

## Overview

Ground-up rebuild of the Classroom Redesigner from a single HTML file into a full Next.js application. The tool helps teachers redesign their physical classroom layout based on educational research (Thornburg's Archetypes, Hattie's effect sizes, UDL principles). Secondary audiences include coaches/facilitators (teaching about flexible learning spaces) and administrators (evaluating environments, imagining future spaces).

## Design Principles

- **Warm & editorial** meets **playful & interactive** — calm enough for a stressed teacher, engaging enough to feel like a tool they *want* to use
- **No emojis** — anywhere, ever. Use Lucide icons instead
- **No heavy gradients** — subtle background washes only (e.g., faint stone-50 to white). Buttons are solid colors
- **No "sparkle" or "shine" CSS animations** — movement should feel purposeful, not decorative
- **Professional and warm, not gimmicky**

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS + custom rose/maroon design tokens |
| Animations | Framer Motion |
| Markdown | react-markdown |
| Icons | Lucide React |
| State | React Context + localStorage (designed for future DB swap) |
| AI (text) | Claude API via Next.js API routes |
| AI (images) | Gemini API via Next.js API routes |

---

## Project Structure

```
src/
  app/
    page.tsx                  ← landing/wizard
    dashboard/page.tsx        ← future: saved classrooms
    learning-hub/page.tsx     ← future: standalone research
    api/
      analyze/route.ts        ← Claude: generate layouts
      generate-image/route.ts ← Gemini: room visuals
      scan-inventory/route.ts ← Gemini: photo analysis
      tools/route.ts          ← Claude: power-up tools
  components/
    wizard/                   ← step components
    ui/                       ← shared buttons, cards, modals
    layout/                   ← header, footer, navigation
  lib/
    ai/                       ← Gemini + Claude client helpers
    store/                    ← context + localStorage persistence
    research/                 ← Thornburg content, stats, etc. as structured data
  types/
```

---

## Visual Identity

### Palette
- **Primary:** Rose/maroon family (rose-700 `#be123c` through rose-950 `#881337`)
- **Surface:** Stone/warm grays (stone-50 through stone-900)
- **Accents:** Muted category colors for philosophies (green for Flexible, indigo for Socratic, purple for UDL, amber for Reggio, rose for Montessori, blue for STEAM) — desaturated and professional
- **Status colors:** Soft emerald, soft blue — never bright/neon

### Typography
- Font: Inter
- Strong weight hierarchy: extrabold headings, medium body, semibold labels

### Animation Philosophy
- Every transition has a purpose (guiding attention, confirming action, reducing perceived wait time)
- Staggered fade-ins for lists/cards
- Smooth slide transitions between wizard steps
- Skeleton shimmers for loading states (not spinners)
- Micro-interactions on buttons/cards (subtle scale on hover)
- Results reveal: staggered fade-in with upward motion per card (no confetti, no sparkles)

### Copy Tone
- Warm, professional, encouraging — like a knowledgeable colleague
- No jargon without context
- Short sentences, active voice

---

## v1 — Core Wizard Flow (Tomorrow's Demo)

### Step Indicator
Animated progress bar at top with labeled steps and Lucide icons. Framer Motion transitions between steps.

### Step 1: "Your Space"
- Drag-and-drop photo upload with a friendly illustration (not just a dashed box)
- Animated camera icon, warm copy ("Let's see what we're working with")
- Skip option styled as a soft secondary action
- Photo preview with subtle zoom-in animation on upload

### Step 2: "Your Inventory"
- If photo uploaded: scanning animation (pulsing overlay, "Counting your furniture..."), auto-populates
- Card-based number inputs with +/- buttons (not raw number fields)
- Grouped: "Big Items" (desks, tables) and "The Details" (rugs, bins, shelves)
- Feels like a fun quiz, not a form

### Step 3: "Your Teaching Style"
- Learner profile: pill buttons with small illustrations per grade band
- Philosophy cards: larger, more visual, distinct muted color accent + icon per philosophy
- Contextual research hint: selecting a philosophy slides in a 1-2 sentence research card
- Goals textarea with smart placeholder prompts

### Step 4: "Your Redesign" (Results)
- Staggered card reveal animation
- 3 layout options as large cards with:
  - AI-generated room visualization (skeleton shimmer while loading)
  - Research rationale with highlighted stats
  - "Required Pedagogy Shift" as a warm callout (not a warning)
  - Implementation moves as a checklist
- Per-layout contextual actions: "Write a Grant", "Generate Norms", "Adapt a Lesson"
- Print/PDF and "Start New Design" actions

### Power-Up Tools (Rethought)
Tools are **contextual per-layout actions**, not a separate section:
- Each layout card has an action bar with tool buttons
- Tools open in a **slide-over panel** with markdown rendering, copy button, "Regenerate" option
- Tools receive specific layout context for better output

**v1 Tools:**
1. Grant Proposal Writer
2. Lesson Plan Adapter
3. Classroom Management Scripts

### Contextual Research Hints (v1)
- Philosophy selection triggers animated research cards
- Results reference specific research inline as subtle clickable footnotes

### Additional v1 Requirements
- Gemini API routes for inventory scan + image generation
- Claude API route for layout generation + tool text
- localStorage for current session
- Print/PDF support
- Deploy to Vercel

---

## v2 — Near-Term Roadmap

### Dashboard
- Saved classrooms and past designs
- Quick-access to recent work
- "Start New Design" prominent action

### Learning Hub (`/learning-hub`)
- Organized by topic:
  - Thornburg's Archetypes (Campfire, Watering Hole, Cave, Life)
  - The Research (Hattie, peer influence stats, TEAL Project)
  - Inclusion & Sensory Design (UDL, Lombard Effect, Sensory Paradox)
  - Philosophy Deep Dives (Socratic, Reggio Emilia, Montessori, STEAM)
- Beautiful cards that expand into article-style layouts
- Sources cited per piece

### Expanded Power-Ups
- Parent Communication Letter ("Here's why the classroom looks different")
- Admin Walkthrough Script (for principal visits)
- Student Voice Survey Generator
- Before/After Comparison Report

### Persistence
- localStorage across sessions, architected for future DB swap

---

## v3 — Future Vision

- **User accounts** — Google SSO (teacher Chromebooks)
- **Database persistence** — Supabase or similar
- **Interactive drag-and-drop floor plan builder**
- **Animated 2D room walkthroughs**
- **Furniture Swap Finder** — trade with other teachers in the building
- **Multi-provider AI** — swap Claude/Gemini configuration easily
- **Coach/Admin views** — different dashboards per role

---

## Research Content (Preserved from Original)

The app's research framework must reference:

1. **Thornburg's Archetypes:** Campfire (one-to-many instruction), Watering Hole (many-to-many discourse), Cave (individual reflection), Life (application/maker space)
2. **Hattie's Effect Sizes:** Small Group Learning (d=0.47), Classroom Cohesion (d=0.44)
3. **Peer Proximity Effect (2024):** Students near inattentive peers score 9 points lower
4. **TEAL Project (MIT):** Active learning layouts reduced failure rates by 50%
5. **Sensory Paradox:** ADHD brains seek stimulation; autistic brains seek regulation — design must provide "Zones of Regulation"
6. **Lombard Effect:** Escalating noise feedback loop — mitigated with absorptive materials in collaboration zones
7. **Rosan Bosch Principles:** Design dictates behavior (Mountain Top, Cave, Campfire)
8. **UDL:** Design for the margins, not the average
