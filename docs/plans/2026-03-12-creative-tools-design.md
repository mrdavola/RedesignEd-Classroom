# Creative Classroom Tools — Design Document

**Date:** 2026-03-12
**Status:** Approved

---

## Overview

8 new interactive tools accessible per-layout on the results page (Step 4), following the same pattern as existing power-up tools (grant writer, lesson adapter, norms). Each tool calls Claude via API for analysis, then renders interactive SVG/Canvas visualizations in the existing SlideOver panel.

## Design Principles

- All visualizations are interactive SVG (hover, click, tooltips)
- Recharts for radar chart (Classroom DNA only), hand-built SVG for everything else
- Shared `RoomGrid` SVG component for spatial tools (Heatmap, Seat Perspective, Sound Zones)
- All AI calls go through existing `/api/tools/route.ts` with new type cases
- Each tool receives the full layout context (archetype, moves, furniture inventory, philosophy, goals)
- No emojis, warm rose/stone palette, Inter font

## Dependencies

- **Recharts** — radar chart for Classroom DNA
- Everything else: raw SVG components

---

## Tool 1: Classroom DNA

**Type:** `"dna"`

**API returns:**
```typescript
interface ClassroomDNA {
  archetypes: {
    campfire: number;    // 0-100
    wateringHole: number;
    cave: number;
  };
  sensory: {
    stimulation: number;   // 0-100
    predictability: number;
    movementFreedom: number;
  };
  philosophyAlignment: Array<{
    philosophy: string;
    percentage: number;
  }>;
  personality: string;  // e.g., "Flexible-Cave Hybrid"
  summary: string;
}
```

**Frontend:**
- Recharts `RadarChart` with 6 axes (3 archetypes + 3 sensory dimensions)
- Personality label prominently displayed above chart
- Philosophy alignment shown as horizontal bars below
- "Copy as image" button to capture SVG to clipboard

---

## Tool 2: What Would Montessori Say?

**Type:** `"philosopher-critique"`

**UI:** Dropdown selector for educator: Montessori, Dewey, Freire, Reggio Emilia, Vygotsky, bell hooks

**API returns:**
```typescript
interface PhilosopherCritique {
  educator: string;
  praise: string;
  challenge: string;
  suggestion: string;
  quote: string;         // real quote from the thinker
  quoteSource: string;   // citation
}
```

**Frontend:**
- Styled as a "letter" from the educator
- Educator name + Lucide icon at top
- Three sections: What they'd praise, what they'd challenge, one specific change
- Real quote as footnote with citation
- Dropdown to switch educators and regenerate

---

## Tool 3: Movement Heatmap

**Type:** `"movement-heatmap"`

**API returns:**
```typescript
interface MovementHeatmap {
  grid: number[][];          // 10x10 grid, values 0-1
  teacherPath: Array<{ x: number; y: number }>;
  studentFlows: Array<{
    from: { x: number; y: number };
    to: { x: number; y: number };
    intensity: number;
  }>;
  bottlenecks: Array<{
    x: number;
    y: number;
    description: string;
    fix: string;
  }>;
}
```

**Frontend:**
- `RoomGrid` SVG base with furniture outlines
- Color-coded heatmap overlay (green → yellow → red)
- Dashed line for teacher path
- Arrows for student flow vectors
- Pulsing dots on bottlenecks with hover tooltips showing description + fix

---

## Tool 4: The $200 Question

**Type:** `"budget-optimizer"`

**API returns:**
```typescript
interface BudgetOptimizer {
  recommendations: Array<{
    rank: number;
    name: string;
    cost: number;
    impactScore: number;     // 0-100
    rationale: string;
    researchSource: string;
  }>;
  summary: string;
}
```

**Frontend:**
- Ranked cards, top recommendation visually highlighted
- Horizontal impact-per-dollar bar per item (SVG)
- Research citation inline per item
- Running total shown at bottom

---

## Tool 5: Seasonal Layout Calendar

**Type:** `"seasonal-calendar"`

**API returns:**
```typescript
interface SeasonalCalendar {
  phases: Array<{
    name: string;
    startMonth: number;    // 1-12
    endMonth: number;
    focus: string;
    archetype: string;     // primary archetype emphasis
    moves: string[];       // 2-3 specific furniture moves
    rationale: string;
  }>;
}
```

**Frontend:**
- Horizontal SVG timeline spanning Aug-June (school year)
- Each phase is a colored block with archetype icon
- Current month highlighted with indicator
- Click a phase to expand detail card below timeline with moves and rationale

---

## Tool 6: Principal Email Generator

**Type:** `"principal-email"`

**API returns:**
```typescript
interface PrincipalEmail {
  subject: string;
  body: string;          // markdown-formatted
  citations: Array<{
    claim: string;
    source: string;
  }>;
}
```

**Frontend:**
- Styled like an email client (To/From/Subject header fields)
- Body rendered with react-markdown
- "Copy to Clipboard" and "Open in Mail" (mailto: link) buttons
- Editable textarea mode toggle so teacher can tweak before sending

---

## Tool 7: Student Seat Perspective

**Type:** `"seat-perspective"`

**API returns:**
```typescript
interface SeatPerspective {
  seats: Array<{
    id: number;
    x: number;
    y: number;
    sightlines: {
      board: "clear" | "partial" | "blocked";
      teacher: "clear" | "partial" | "blocked";
      exits: "clear" | "partial" | "blocked";
      windows: "clear" | "partial" | "blocked";
    };
    distractionProximity: "low" | "medium" | "high";
    udlProfile: {
      adhd: "good" | "fair" | "poor";
      anxiety: "good" | "fair" | "poor";
      visualImpairment: "good" | "fair" | "poor";
    };
    suggestedFor: string;
    notes: string;
  }>;
  roomFeatures: Array<{
    type: string;      // "board", "teacher_desk", "door", "window"
    x: number;
    y: number;
  }>;
}
```

**Frontend:**
- `RoomGrid` SVG with room features plotted
- Clickable seat dots, color-coded by overall UDL suitability (green/yellow/red)
- Click a seat → sightline rays drawn as lines to room features (solid=clear, dashed=partial, absent=blocked)
- Detail panel shows UDL assessment for selected seat
- Legend for color coding

---

## Tool 8: Room Sound Zones

**Type:** `"sound-zones"`

**API returns:**
```typescript
interface SoundZones {
  zones: Array<{
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    type: "quiet" | "moderate" | "loud";
    dbEstimate: string;     // relative, e.g., "~45dB"
    description: string;
    interventions: string[];
  }>;
  lombardRisks: Array<{
    x: number;
    y: number;
    description: string;
  }>;
  overallAssessment: string;
}
```

**Frontend:**
- `RoomGrid` SVG with furniture outlines
- Colored zone overlays (blue=quiet, orange=moderate, red=loud)
- Lombard Effect hotspots marked with warning indicator icons
- Click a zone → detail panel with dB estimate, description, suggested interventions
- Overall acoustic assessment text below the diagram

---

## Shared Infrastructure

### RoomGrid Component

Reusable SVG component used by Heatmap, Seat Perspective, and Sound Zones.

**Props:**
```typescript
interface RoomGridProps {
  width?: number;
  height?: number;
  furniture: Inventory;          // from wizard state
  layoutMoves: string[];         // from selected layout
  children?: React.ReactNode;    // overlay content (heatmap cells, seats, zones)
  onCellClick?: (x: number, y: number) => void;
}
```

Renders a simplified top-down floor plan based on the furniture inventory and layout description. Furniture pieces shown as labeled rectangles. Grid lines for spatial reference.

### Extended ToolType

```typescript
export type ToolType =
  | "grant"
  | "lesson"
  | "norms"
  | "dna"
  | "philosopher-critique"
  | "movement-heatmap"
  | "budget-optimizer"
  | "seasonal-calendar"
  | "principal-email"
  | "seat-perspective"
  | "sound-zones";
```

### API Route Extension

Existing `/api/tools/route.ts` gains new cases in its switch/match for each tool type. Each case constructs a specialized Claude prompt that returns structured JSON matching the interfaces above.

### Results Page Changes

The existing per-layout action bar in `step-results.tsx` gains 8 new tool buttons, organized into groups:
- **Analyze:** Classroom DNA, Movement Heatmap, Sound Zones, Seat Perspective
- **Plan:** Seasonal Calendar, $200 Question
- **Communicate:** Principal Email, What Would Montessori Say
- (Existing) **Create:** Grant, Lesson, Norms

### SlideOver Panel

The existing SlideOver panel already handles variable content. SVG visualizations render inside it. May need a wider variant for spatial diagrams — add a `size="wide"` prop option.
