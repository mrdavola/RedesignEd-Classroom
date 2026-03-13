# Classroom Redesigner v1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a polished Next.js classroom redesign wizard that teachers can use to generate research-backed layout options using AI.

**Architecture:** Next.js App Router with TypeScript. Wizard flow as a single page with step state managed via React Context. API routes proxy to Gemini (images) and Claude (text). Framer Motion for all transitions. Tailwind CSS with rose/maroon design tokens. No emojis, no heavy gradients, no sparkle animations.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion, Lucide React, react-markdown, Anthropic SDK, Google Generative AI SDK

---

## Task 1: Project Scaffold & Configuration

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `.env.local.example`
- Create: `.gitignore`

**Step 1: Initialize Next.js project**

```bash
cd "/Users/md/RedesignEd Classroom"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Accept defaults. This creates the base project.

**Step 2: Install dependencies**

```bash
npm install framer-motion lucide-react react-markdown @anthropic-ai/sdk @google/generative-ai
```

**Step 3: Configure Tailwind with rose/maroon design tokens**

Edit `src/app/globals.css` to include Inter font import and custom CSS variables:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
@import "tailwindcss";

:root {
  --color-primary: #be123c;
  --color-primary-dark: #881337;
  --color-primary-light: #ffe4e6;
}

body {
  font-family: 'Inter', sans-serif;
}
```

**Step 4: Create .env.local.example**

```
ANTHROPIC_API_KEY=your_anthropic_key_here
GEMINI_API_KEY=your_gemini_key_here
```

**Step 5: Set up base layout**

Edit `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Classroom Redesigner",
  description: "Align physical space with pedagogical goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-stone-50 min-h-screen text-stone-900 antialiased">
        {children}
      </body>
    </html>
  );
}
```

**Step 6: Verify dev server starts**

```bash
npm run dev
```

Expected: Server starts on localhost:3000, blank page renders.

**Step 7: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Next.js project with dependencies and design tokens"
```

---

## Task 2: TypeScript Types & Research Data

**Files:**
- Create: `src/types/index.ts`
- Create: `src/lib/research/data.ts`
- Create: `src/lib/research/prompts.ts`

**Step 1: Define core types**

Create `src/types/index.ts`:

```ts
export type LearnerProfile = "UPK" | "K-1" | "2-5" | "6-8" | "9-12" | "Adult Learners" | "Custom";

export type Philosophy =
  | "Flexible"
  | "Socratic"
  | "Inclusive"
  | "Reggio Emilia"
  | "Montessori-Inspired"
  | "STEAM/Maker";

export interface Inventory {
  studentDesks: number;
  teacherDesks: number;
  kidneyTables: number;
  studentChairs: number;
  carpets: number;
  shelves: number;
  easels: number;
  bins: number;
}

export interface WizardState {
  step: number;
  image: string | null; // base64
  inventory: Inventory;
  learnerProfile: LearnerProfile;
  philosophy: Philosophy;
  goals: string;
}

export interface LayoutOption {
  title: string;
  archetype: string;
  pedagogyShift: string;
  why: string;
  researchNote: string;
  moves: string[];
  visualPrompt: string;
  color: string;
  imageUrl?: string;
}

export interface AnalysisResult {
  baseRoomDescription: string;
  options: LayoutOption[];
}

export type ToolType = "grant" | "lesson" | "norms";
```

**Step 2: Create research data as structured TypeScript**

Create `src/lib/research/data.ts` containing the Thornburg archetypes, philosophy descriptions, statistics, and sensory/inclusion content — all as typed objects that can be rendered contextually in the UI.

```ts
export interface ResearchCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  designImplication: string;
  color: string; // tailwind color name
}

export interface PhilosophyInfo {
  id: Philosophy;
  label: string;
  color: string;
  icon: string; // lucide icon name
  shortDescription: string;
  researchHint: string;
  layoutDescription: string;
}

export const archetypes: ResearchCard[] = [
  {
    id: "campfire",
    title: "The Campfire",
    subtitle: "The Home of Attention",
    description: "Space for storytelling & direct instruction. A one-to-many gathering spot where wisdom is shared.",
    designImplication: "Rugs, tiered seating, or a focal point.",
    color: "amber",
  },
  {
    id: "watering-hole",
    title: "The Watering Hole",
    subtitle: "The Home of Discourse",
    description: "Space for social learning & peer collaboration. Many-to-many interaction.",
    designImplication: "High tables, whiteboard surfaces, breakout clusters.",
    color: "blue",
  },
  {
    id: "cave",
    title: "The Cave",
    subtitle: "The Home of Reflection",
    description: "Critical for introverted or neurodivergent students. Space for withdrawal, metacognition, and quiet synthesis.",
    designImplication: "Study carrels, bean bags in corners, noise-canceling headphones.",
    color: "purple",
  },
];

export const philosophies: PhilosophyInfo[] = [
  {
    id: "Flexible",
    label: "Flexible / Agile",
    color: "green",
    icon: "Shuffle",
    shortDescription: "Adaptable zones. Supports Thornburg's Campfire & Watering Hole.",
    researchHint: "Hattie's meta-analysis ranks flexible grouping layouts at d=0.47 — well above the average effect size of 0.40.",
    layoutDescription: "Adaptable zones that can shift between individual, small group, and whole class configurations.",
  },
  {
    id: "Socratic",
    label: "Socratic",
    color: "indigo",
    icon: "MessageCircle",
    shortDescription: "Seminar style. Removes 'sage on the stage'.",
    researchHint: "Eye contact between all participants increases discussion quality by enabling natural turn-taking.",
    layoutDescription: "Circles, U-shapes, or facing pairs that prioritize student-to-student eye contact.",
  },
  {
    id: "Inclusive",
    label: "Inclusive / UDL",
    color: "purple",
    icon: "Heart",
    shortDescription: "Sensory-aware. Prioritizes Caves for neurodiverse needs.",
    researchHint: "UDL research shows designing for the margins benefits all learners, not just those with identified needs.",
    layoutDescription: "Clear pathways, reduced visual clutter, defined quiet zones, and multiple seating options.",
  },
  {
    id: "Reggio Emilia",
    label: "Reggio Emilia",
    color: "amber",
    icon: "Leaf",
    shortDescription: "The environment as the 'Third Teacher'. Natural flows.",
    researchHint: "Reggio views the classroom as a living organism — materials should be visible, accessible, and invite exploration.",
    layoutDescription: "Natural flows, accessible materials at child height, documentation of learning on walls.",
  },
  {
    id: "Montessori-Inspired",
    label: "Montessori-Inspired",
    color: "rose",
    icon: "Grid3x3",
    shortDescription: "Order, accessibility, and floor work. Fosters independence.",
    researchHint: "Montessori research shows students who can self-select materials show 30% more sustained engagement.",
    layoutDescription: "Low open shelves, designated floor work areas with rugs, clearly defined stations.",
  },
  {
    id: "STEAM/Maker",
    label: "STEAM / Maker",
    color: "blue",
    icon: "Wrench",
    shortDescription: "Project-based. Focus on Thornburg's 'Life' archetype.",
    researchHint: "MIT's TEAL Project found active learning layouts reduced failure rates by 50%.",
    layoutDescription: "Robust surfaces, visible tools, movable storage, accessible power outlets.",
  },
];
```

**Step 3: Create system prompt builder**

Create `src/lib/research/prompts.ts` — extract the RESEARCH_CONTEXT string and prompt builders from the original HTML into typed functions.

```ts
import { WizardState } from "@/types";

export const RESEARCH_CONTEXT = `...`; // Full research context from original

export function buildAnalysisPrompt(state: WizardState): string {
  // Returns the system prompt for layout generation
}

export function buildGrantPrompt(layout: LayoutOption, state: WizardState): string {
  // Returns prompt for grant writer tool
}

export function buildLessonPrompt(topic: string, layout: LayoutOption, state: WizardState): string {
  // Returns prompt for lesson adapter tool
}

export function buildNormsPrompt(layout: LayoutOption, state: WizardState): string {
  // Returns prompt for management scripts tool
}
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add TypeScript types, research data, and prompt builders"
```

---

## Task 3: State Management (WizardProvider + localStorage)

**Files:**
- Create: `src/lib/store/wizard-context.tsx`
- Create: `src/lib/store/use-local-storage.ts`

**Step 1: Create localStorage hook**

Create `src/lib/store/use-local-storage.ts`:

```ts
"use client";
import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) setStored(JSON.parse(item));
    } catch (e) {
      console.error(e);
    }
  }, [key]);

  const setValue = (value: T | ((prev: T) => T)) => {
    const valueToStore = value instanceof Function ? value(stored) : value;
    setStored(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [stored, setValue];
}
```

**Step 2: Create WizardProvider context**

Create `src/lib/store/wizard-context.tsx`:

```tsx
"use client";
import { createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "./use-local-storage";
import { WizardState, Inventory, LearnerProfile, Philosophy, AnalysisResult } from "@/types";

const DEFAULT_INVENTORY: Inventory = {
  studentDesks: 25,
  teacherDesks: 1,
  kidneyTables: 1,
  studentChairs: 25,
  carpets: 1,
  shelves: 2,
  easels: 1,
  bins: 10,
};

const DEFAULT_STATE: WizardState = {
  step: 0,
  image: null,
  inventory: DEFAULT_INVENTORY,
  learnerProfile: "UPK",
  philosophy: "Flexible",
  goals: "",
};

interface WizardContextType {
  state: WizardState;
  result: AnalysisResult | null;
  setState: (state: WizardState | ((prev: WizardState) => WizardState)) => void;
  setResult: (result: AnalysisResult | null) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
}

const WizardContext = createContext<WizardContextType | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useLocalStorage<WizardState>("wizard-state", DEFAULT_STATE);
  const [result, setResult] = useLocalStorage<AnalysisResult | null>("wizard-result", null);

  const nextStep = () => setState((prev) => ({ ...prev, step: Math.min(prev.step + 1, 3) }));
  const prevStep = () => setState((prev) => ({ ...prev, step: Math.max(prev.step - 1, 0) }));
  const goToStep = (step: number) => setState((prev) => ({ ...prev, step }));
  const reset = () => { setState(DEFAULT_STATE); setResult(null); };

  return (
    <WizardContext.Provider value={{ state, result, setState, setResult, nextStep, prevStep, goToStep, reset }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within WizardProvider");
  return ctx;
}
```

**Step 3: Wrap layout with provider**

Edit `src/app/layout.tsx` to wrap `{children}` with `<WizardProvider>`.

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add WizardProvider context with localStorage persistence"
```

---

## Task 4: Shared UI Components

**Files:**
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/number-input.tsx`
- Create: `src/components/ui/pill-selector.tsx`
- Create: `src/components/ui/skeleton.tsx`
- Create: `src/components/ui/slide-over.tsx`
- Create: `src/components/ui/step-indicator.tsx`

**Step 1: Build all shared UI components**

These are the foundational building blocks. Key details:

- `button.tsx`: Variants — `primary` (solid rose-800), `secondary` (white with border), `ghost` (transparent). Subtle scale-on-hover via Framer Motion. No gradients.
- `card.tsx`: Rounded-2xl, stone border, subtle shadow. Hover state with slight lift.
- `number-input.tsx`: Card-style input with +/- buttons (Lucide `Plus`/`Minus` icons), min 0. Replaces raw `<input type="number">`.
- `pill-selector.tsx`: Row of pill buttons, one active at a time. Active state = rose-700 bg, white text. Framer Motion `layoutId` for sliding indicator.
- `skeleton.tsx`: Shimmer loading placeholder. CSS animation only (keyframe shimmer left-to-right on a stone-100 bg).
- `slide-over.tsx`: Right-side panel that slides in over the content. Framer Motion `AnimatePresence`. Contains header with title + close button, scrollable body, footer with action buttons.
- `step-indicator.tsx`: Horizontal step bar with numbered circles, labels, and connecting lines. Current step = rose-700 filled. Completed steps = rose-200 with check icon. Upcoming = stone-300 outline. Framer Motion for progress animation.

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add shared UI component library"
```

---

## Task 5: Wizard Step Components

**Files:**
- Create: `src/components/wizard/step-upload.tsx`
- Create: `src/components/wizard/step-inventory.tsx`
- Create: `src/components/wizard/step-teaching-style.tsx`
- Create: `src/components/wizard/step-results.tsx`
- Create: `src/components/wizard/wizard-shell.tsx`

**Step 1: Build WizardShell**

`wizard-shell.tsx` — the container that renders the step indicator and animates between step components using Framer Motion `AnimatePresence` with slide transitions.

```tsx
"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useWizard } from "@/lib/store/wizard-context";
import { StepIndicator } from "@/components/ui/step-indicator";
import { StepUpload } from "./step-upload";
import { StepInventory } from "./step-inventory";
import { StepTeachingStyle } from "./step-teaching-style";
import { StepResults } from "./step-results";

const steps = [
  { label: "Your Space", icon: "Camera" },
  { label: "Your Inventory", icon: "Package" },
  { label: "Your Teaching", icon: "BookOpen" },
  { label: "Your Redesign", icon: "Sparkles" },
];

const stepComponents = [StepUpload, StepInventory, StepTeachingStyle, StepResults];

export function WizardShell() {
  const { state } = useWizard();
  const StepComponent = stepComponents[state.step];

  return (
    <div>
      <StepIndicator steps={steps} currentStep={state.step} />
      <AnimatePresence mode="wait">
        <motion.div
          key={state.step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <StepComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
```

**Step 2: Build StepUpload**

`step-upload.tsx` — drag-and-drop zone with Lucide Camera icon, warm copy, file handler that converts to base64 and stores in context. Skip button as secondary action. Photo preview with Framer Motion zoom-in. On upload or skip, calls `nextStep()`.

**Step 3: Build StepInventory**

`step-inventory.tsx` — uses `NumberInput` components grouped in two sections ("Big Items" and "The Details"). If `state.image` exists, shows a brief scanning state then auto-populates (calls `/api/scan-inventory`). "Continue" button calls `nextStep()`. "Back" button calls `prevStep()`.

**Step 4: Build StepTeachingStyle**

`step-teaching-style.tsx` — `PillSelector` for learner profile. Philosophy cards using the data from `research/data.ts`, each with its muted color and Lucide icon. When a philosophy is selected, a Framer Motion `AnimatePresence` card slides in below it showing the `researchHint`. Goals textarea. "Generate Layouts" button (primary, prominent) calls the analysis flow.

**Step 5: Build StepResults**

`step-results.tsx` — the most complex component. Handles:
1. Loading state: skeleton shimmers for 3 card placeholders
2. Staggered reveal: each `LayoutOption` card fades in with `motion.div` and `delay: index * 0.15`
3. Layout cards: left side = image (skeleton while loading, then AI image), right side = research rationale, pedagogy shift callout, implementation checklist
4. Per-card action bar: three buttons ("Write a Grant", "Generate Norms", "Adapt a Lesson") that open the `SlideOver` panel
5. Footer: "Print Report" and "Start New Design" buttons

**Step 6: Commit**

```bash
git add .
git commit -m "feat: add all wizard step components with animations"
```

---

## Task 6: API Routes

**Files:**
- Create: `src/app/api/analyze/route.ts`
- Create: `src/app/api/generate-image/route.ts`
- Create: `src/app/api/scan-inventory/route.ts`
- Create: `src/app/api/tools/route.ts`
- Create: `src/lib/ai/gemini.ts`
- Create: `src/lib/ai/claude.ts`

**Step 1: Create Gemini client helper**

`src/lib/ai/gemini.ts`:
- `scanInventory(base64Image: string)` — sends image to Gemini Flash, asks for JSON inventory count, returns `Partial<Inventory>`
- `generateRoomImage(prompt: string, base64Image?: string)` — if base64Image provided, sends to Gemini Flash Image for redesign; otherwise uses Imagen for generic generation. Returns base64 image string or null.

**Step 2: Create Claude client helper**

`src/lib/ai/claude.ts`:
- `generateLayouts(state: WizardState)` — sends analysis prompt to Claude, expects JSON response matching `AnalysisResult`
- `runTool(type: ToolType, context: object)` — sends appropriate prompt for grant/lesson/norms, returns markdown string

**Step 3: Create API routes**

Each route is a thin POST handler:

`/api/analyze/route.ts`:
```ts
import { NextRequest, NextResponse } from "next/server";
import { generateLayouts } from "@/lib/ai/claude";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await generateLayouts(body);
  return NextResponse.json(result);
}
```

Same pattern for `/api/scan-inventory` (calls Gemini), `/api/generate-image` (calls Gemini), `/api/tools` (calls Claude).

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add API routes for Claude and Gemini integration"
```

---

## Task 7: App Header & Main Page Assembly

**Files:**
- Create: `src/components/layout/header.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Build header**

`header.tsx` — "Classroom Redesigner" title with "Professional Development Tool" badge. "Research Guide" button (opens research modal — placeholder for now). Responsive layout matching design doc.

**Step 2: Assemble main page**

`src/app/page.tsx`:

```tsx
import { Header } from "@/components/layout/header";
import { WizardShell } from "@/components/wizard/wizard-shell";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      <Header />
      <main className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px] border border-stone-100">
        <WizardShell />
      </main>
    </div>
  );
}
```

**Step 3: Verify full flow works end-to-end**

```bash
npm run dev
```

Navigate through all 4 steps, verify transitions work, verify API calls fire (will need real API keys in `.env.local`).

**Step 4: Commit**

```bash
git add .
git commit -m "feat: assemble main page with header and wizard flow"
```

---

## Task 8: Print/PDF Styles & Polish

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/wizard/step-results.tsx`

**Step 1: Add print media queries**

Port the `@media print` styles from the original HTML into `globals.css`. Hide wizard nav, buttons, modals. Show only the results content. Force print colors.

**Step 2: Wire up print button**

In StepResults, the "Print Report" button calls `window.print()`.

**Step 3: Final visual polish pass**

- Verify all animations feel smooth
- Check mobile responsiveness
- Ensure loading skeletons appear correctly
- Test slide-over panel on mobile (should be full-width)

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add print styles and final polish"
```

---

## Task 9: Deploy to Vercel

**Step 1: Push to GitHub**

```bash
git remote add origin <repo-url>
git push -u origin main
```

**Step 2: Connect to Vercel**

- Import project on vercel.com
- Add environment variables: `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`
- Deploy

**Step 3: Verify production build**

```bash
npm run build
```

Expected: No errors, all pages build successfully.

**Step 4: Commit any build fixes**

```bash
git add .
git commit -m "fix: resolve any build issues for production"
```

---

## Execution Notes

- **Tasks 1-3** are sequential (each depends on the previous)
- **Tasks 4 and 6** can run in parallel after Task 2 (types must exist)
- **Task 5** depends on Tasks 3 and 4 (needs context + UI components)
- **Task 7** depends on Tasks 5 and 6 (needs wizard + API routes)
- **Tasks 8-9** are sequential after Task 7

**Dependency graph:**
```
Task 1 → Task 2 → Task 3 ──→ Task 5 → Task 7 → Task 8 → Task 9
                  ↘ Task 4 ↗        ↗
                  ↘ Task 6 ────────↗
```
