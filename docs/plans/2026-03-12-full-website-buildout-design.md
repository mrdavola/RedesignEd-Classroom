# Full Website Buildout — Design Document

**Date:** 2026-03-12
**Status:** Approved

---

## Overview

Transform the Classroom Redesigner from a single-page wizard tool into a full multi-page website. Add a marketing homepage, persistent site navigation, footer, Learning Hub (research content), and Dashboard (saved designs). Move the existing wizard to its own `/redesign` route.

## Design Principles

Inherited from the main design doc:
- Warm & editorial meets playful & interactive
- No emojis — Lucide icons only
- No heavy gradients — subtle background washes only
- Professional and warm, not gimmicky
- Rose/stone color palette, Inter typography

---

## Site Structure & Routing

| Route | Page | Description |
|-------|------|-------------|
| `/` | Homepage | Full marketing landing page |
| `/redesign` | Redesign Tool | Current wizard (moved from `/`) |
| `/learning-hub` | Learning Hub | Research content organized by topic |
| `/dashboard` | Dashboard | Saved classrooms from localStorage |

---

## Persistent Site Header

Moved into `layout.tsx` so it appears on every page.

- **Left:** Logo/wordmark "Classroom Redesigner" linking to `/`
- **Center/Right:** Nav links — Home, Learning Hub, Dashboard
- **Far right:** Primary CTA button "Start Redesigning" linking to `/redesign`
- Sticky on scroll with subtle `border-b border-stone-200` and `bg-stone-50/80 backdrop-blur`
- Mobile: hamburger menu with slide-out nav
- The existing wizard-specific sub-header (Professional Development Tool badge, Research Guide button) stays inside `/redesign` page

---

## Homepage (`/`)

Sections in scroll order:

1. **Hero** — Bold headline ("Redesign your classroom with research, not guesswork"), subheadline about AI-powered + research-backed, primary CTA "Start Redesigning", secondary link "Learn the Research" to `/learning-hub`

2. **How It Works** — 3-step visual with Lucide icons:
   - Upload a photo of your classroom
   - Describe your teaching style and goals
   - Get AI-generated, research-backed layout options

3. **Feature Highlights** — 3 cards:
   - AI Room Analysis (photo scanning, furniture detection)
   - Research-Backed Layouts (Thornburg archetypes, Hattie effect sizes)
   - Power-Up Tools (grant writing, lesson adaptation, classroom norms)

4. **Research Credibility** — The 3 `statistics` from `data.ts` displayed as prominent stat cards (peer proximity -9pts, Hattie d=0.47, TEAL 50% reduction)

5. **Philosophy Preview** — All 6 philosophies from `data.ts` as small cards with icon, name, and `shortDescription`, linking to `/learning-hub`

6. **Testimonial/Quote Block** — Pull quote from UDL research ("Design for the margins, not the average") styled as a testimonial

7. **Final CTA** — "Ready to reimagine your space?" with primary button

---

## Footer

3-column layout on `stone-100` background:

- **Product:** Home, Redesign Tool, Dashboard
- **Learn:** Learning Hub, Research Guide
- **About:** Built with research from Hattie, Thornburg, MIT TEAL
- Bottom row: copyright line, "Built for educators"

---

## Learning Hub (`/learning-hub`)

Page header with title and intro copy. Content organized into 3 sections:

### Thornburg's Archetypes
- 3 cards from `archetypes` array in `data.ts`
- Each shows title, subtitle, description, and design implication
- Uses the existing color coding (amber, blue, purple)

### The Research
- 3 stat cards from `statistics` array in `data.ts`
- Each shows value prominently, label, source/year, and full detail text

### Teaching Philosophies
- 6 cards from `philosophies` array in `data.ts`
- Each shows icon, label, short description, research hint, and layout description
- Uses existing color coding per philosophy

All content sourced from `src/lib/research/data.ts` — no duplication.

---

## Dashboard (`/dashboard`)

### With saved data
- Reads `wizard-state` and `wizard-result` from localStorage
- Shows the most recent design as a card with: philosophy, learner profile, number of layout options generated, timestamp
- "Continue This Design" and "Start New Design" actions

### Empty state
- Friendly copy ("No designs yet")
- Description of what the tool does
- Prominent "Start Your First Redesign" CTA

### Architecture note
Single-design localStorage for now. Structure allows future migration to multi-design storage with database.

---

## Components to Create

| Component | Location | Description |
|-----------|----------|-------------|
| `SiteHeader` | `src/components/layout/site-header.tsx` | Persistent nav with logo, links, CTA |
| `MobileNav` | `src/components/layout/mobile-nav.tsx` | Hamburger menu for mobile |
| `SiteFooter` | `src/components/layout/site-footer.tsx` | 3-column footer |
| Homepage sections | `src/app/page.tsx` | Hero, HowItWorks, Features, Stats, Philosophies, Quote, FinalCTA |
| Learning Hub | `src/app/learning-hub/page.tsx` | Research content page |
| Dashboard | `src/app/dashboard/page.tsx` | Saved designs page |

## Files to Modify

| File | Change |
|------|--------|
| `src/app/layout.tsx` | Add SiteHeader and SiteFooter wrapping children |
| `src/app/page.tsx` | Replace wizard with homepage content |
| `src/components/layout/header.tsx` | Keep as wizard sub-header, used only in `/redesign` |

## Files to Create

| File | Purpose |
|------|---------|
| `src/app/redesign/page.tsx` | Wizard tool (moved from current `page.tsx`) |
| `src/app/learning-hub/page.tsx` | Learning Hub page |
| `src/app/dashboard/page.tsx` | Dashboard page |
| `src/components/layout/site-header.tsx` | Persistent site navigation |
| `src/components/layout/mobile-nav.tsx` | Mobile hamburger menu |
| `src/components/layout/site-footer.tsx` | Site footer |
