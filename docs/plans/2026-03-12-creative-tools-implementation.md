# Creative Classroom Tools Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 8 new interactive visualization tools to the results page: Classroom DNA, Philosopher Critique, Movement Heatmap, Budget Optimizer, Seasonal Calendar, Principal Email, Seat Perspective, and Sound Zones.

**Architecture:** Each tool follows the same pattern: a prompt builder in `prompts.ts` that returns structured JSON, a case in `runTool` that parses JSON instead of returning raw markdown, a React component that renders interactive SVG/charts in the SlideOver panel. The existing `step-results.tsx` action bar is extended with grouped tool buttons.

**Tech Stack:** Next.js 16, Tailwind CSS 4, Framer Motion, Recharts (new — for radar chart), Lucide React, raw SVG for spatial visualizations.

**Design doc:** `docs/plans/2026-03-12-creative-tools-design.md`

---

### Task 1: Install Recharts and extend ToolType

**Files:**
- Modify: `package.json` (via npm)
- Modify: `src/types/index.ts`

**Step 1: Install recharts**

```bash
npm install recharts
```

**Step 2: Extend ToolType**

In `src/types/index.ts`, replace the existing `ToolType` line with:

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

**Step 3: Add response type interfaces**

Append to `src/types/index.ts`:

```typescript
// Creative tool response types

export interface ClassroomDNA {
  archetypes: {
    campfire: number;
    wateringHole: number;
    cave: number;
  };
  sensory: {
    stimulation: number;
    predictability: number;
    movementFreedom: number;
  };
  philosophyAlignment: Array<{
    philosophy: string;
    percentage: number;
  }>;
  personality: string;
  summary: string;
}

export interface PhilosopherCritique {
  educator: string;
  praise: string;
  challenge: string;
  suggestion: string;
  quote: string;
  quoteSource: string;
}

export interface MovementHeatmapData {
  grid: number[][];
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

export interface BudgetOptimizer {
  recommendations: Array<{
    rank: number;
    name: string;
    cost: number;
    impactScore: number;
    rationale: string;
    researchSource: string;
  }>;
  summary: string;
}

export interface SeasonalCalendar {
  phases: Array<{
    name: string;
    startMonth: number;
    endMonth: number;
    focus: string;
    archetype: string;
    moves: string[];
    rationale: string;
  }>;
}

export interface PrincipalEmail {
  subject: string;
  body: string;
  citations: Array<{
    claim: string;
    source: string;
  }>;
}

export interface SeatPerspective {
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
    type: string;
    x: number;
    y: number;
  }>;
}

export interface SoundZonesData {
  zones: Array<{
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    type: "quiet" | "moderate" | "loud";
    dbEstimate: string;
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

**Step 4: Verify and commit**

```bash
npx tsc --noEmit
git add package.json package-lock.json src/types/index.ts
git commit -m "feat: install recharts and extend ToolType with creative tool interfaces"
```

---

### Task 2: Add prompt builders for all 8 tools

**Files:**
- Modify: `src/lib/research/prompts.ts`

**Step 1: Add 8 new prompt builder functions**

Append to `src/lib/research/prompts.ts` after the existing `buildNormsPrompt`:

```typescript
/**
 * Builds the prompt for Classroom DNA analysis.
 */
export function buildDnaPrompt(
  layoutTitle: string,
  layoutContext: string,
  state: WizardState,
): string {
  return `You are an Educational Space Analyst. Analyze a classroom layout and produce a "Classroom DNA" profile.

${RESEARCH_CONTEXT}

CONTEXT:
- Layout: "${layoutTitle}"
- Layout Details: ${layoutContext}
- Learner Profile: ${state.learnerProfile}
- Philosophy: ${state.philosophy}
- Inventory: ${inventoryToString(state)}
- Goals: ${state.goals || "None specified"}

YOUR TASK:
Analyze this classroom layout and return a DNA profile as JSON.

Score each dimension 0-100 based on how strongly the layout supports it:
- Archetypes: campfire (direct instruction space), wateringHole (collaboration space), cave (reflection/quiet space)
- Sensory: stimulation (visual/auditory richness), predictability (routine-friendly structure), movementFreedom (ease of physical movement)

Also provide:
- philosophyAlignment: how well the layout aligns with each of the 6 teaching philosophies (Flexible, Socratic, Inclusive, Reggio Emilia, Montessori-Inspired, STEAM/Maker) as percentages
- personality: a short label like "Flexible-Cave Hybrid" or "Campfire-Dominant Explorer"
- summary: 2-3 sentences describing the classroom's spatial personality

Return ONLY valid JSON matching this interface:
{
  "archetypes": { "campfire": number, "wateringHole": number, "cave": number },
  "sensory": { "stimulation": number, "predictability": number, "movementFreedom": number },
  "philosophyAlignment": [{ "philosophy": string, "percentage": number }],
  "personality": string,
  "summary": string
}

Return raw JSON only -- no markdown fences.`;
}

/**
 * Builds the prompt for philosopher critique.
 */
export function buildPhilosopherCritiquePrompt(
  educator: string,
  layoutTitle: string,
  layoutContext: string,
  state: WizardState,
): string {
  return `You are ${educator}, the famous educational thinker. You are visiting a modern classroom and providing your critique in your authentic voice and perspective.

${RESEARCH_CONTEXT}

CLASSROOM CONTEXT:
- Layout: "${layoutTitle}"
- Layout Details: ${layoutContext}
- Learner Profile: ${state.learnerProfile}
- Philosophy: ${state.philosophy}
- Inventory: ${inventoryToString(state)}
- Goals: ${state.goals || "None specified"}

YOUR TASK:
Write a critique of this classroom layout from ${educator}'s perspective. Stay true to their educational philosophy and writing style.

Return ONLY valid JSON:
{
  "educator": "${educator}",
  "praise": "What ${educator} would genuinely admire about this layout (2-3 sentences, in their voice)",
  "challenge": "What ${educator} would push back on or find lacking (2-3 sentences, in their voice)",
  "suggestion": "One specific, actionable change ${educator} would make (2-3 sentences)",
  "quote": "A real, verified quote from ${educator} that relates to the layout design",
  "quoteSource": "The source/work the quote comes from"
}

Return raw JSON only -- no markdown fences.`;
}

/**
 * Builds the prompt for movement heatmap analysis.
 */
export function buildMovementHeatmapPrompt(
  layoutTitle: string,
  layoutContext: string,
  state: WizardState,
): string {
  return `You are a Classroom Traffic Flow Analyst specializing in student and teacher movement patterns.

${RESEARCH_CONTEXT}

CONTEXT:
- Layout: "${layoutTitle}"
- Layout Details: ${layoutContext}
- Learner Profile: ${state.learnerProfile}
- Philosophy: ${state.philosophy}
- Inventory: ${inventoryToString(state)}

YOUR TASK:
Analyze the movement patterns in this classroom layout during a typical class period. Consider transitions between Thornburg zones, teacher circulation, and student traffic.

Return ONLY valid JSON:
{
  "grid": [[number]] (10x10 grid where each cell is 0.0-1.0 representing traffic intensity. 0=no traffic, 1=constant traffic. Consider door locations, desk arrangements, and common paths),
  "teacherPath": [{"x": number, "y": number}] (5-8 waypoints of the typical teacher circulation path, coordinates 0-9),
  "studentFlows": [{"from": {"x": number, "y": number}, "to": {"x": number, "y": number}, "intensity": number}] (3-5 major student movement vectors during transitions),
  "bottlenecks": [{"x": number, "y": number, "description": string, "fix": string}] (2-4 traffic congestion points with suggested fixes)
}

Return raw JSON only -- no markdown fences.`;
}

/**
 * Builds the prompt for budget optimization.
 */
export function buildBudgetOptimizerPrompt(
  layoutTitle: string,
  layoutContext: string,
  state: WizardState,
): string {
  return `You are an Educational Procurement Specialist who maximizes research-backed impact per dollar spent on classroom furniture and materials.

${RESEARCH_CONTEXT}

CONTEXT:
- Layout: "${layoutTitle}"
- Layout Details: ${layoutContext}
- Learner Profile: ${state.learnerProfile}
- Philosophy: ${state.philosophy}
- Current Inventory: ${inventoryToString(state)}
- Goals: ${state.goals || "None specified"}

YOUR TASK:
If this teacher had $200 to spend, what would have the highest research-backed impact on this specific layout? Rank 3-5 items by impact-per-dollar. Reference specific research.

Return ONLY valid JSON:
{
  "recommendations": [
    {
      "rank": number,
      "name": "Item name",
      "cost": number (estimated USD),
      "impactScore": number (0-100, based on research evidence),
      "rationale": "Why this item matters for THIS specific layout (1-2 sentences)",
      "researchSource": "Specific research citation supporting this"
    }
  ],
  "summary": "One sentence overview of the spending strategy"
}

Return raw JSON only -- no markdown fences.`;
}

/**
 * Builds the prompt for seasonal layout calendar.
 */
export function buildSeasonalCalendarPrompt(
  layoutTitle: string,
  layoutContext: string,
  state: WizardState,
): string {
  return `You are a Year-Long Classroom Design Strategist who plans layout rotations aligned to the academic calendar and pedagogical rhythms.

${RESEARCH_CONTEXT}

CONTEXT:
- Base Layout: "${layoutTitle}"
- Layout Details: ${layoutContext}
- Learner Profile: ${state.learnerProfile}
- Philosophy: ${state.philosophy}
- Inventory: ${inventoryToString(state)}
- Goals: ${state.goals || "None specified"}

YOUR TASK:
Create a seasonal layout rotation plan for the school year (August-June). The "${layoutTitle}" is the starting point, but the room should evolve through 4-5 phases based on the academic rhythm.

Return ONLY valid JSON:
{
  "phases": [
    {
      "name": "Phase name (e.g., Community Building)",
      "startMonth": number (1-12),
      "endMonth": number (1-12),
      "focus": "What this phase emphasizes pedagogically",
      "archetype": "Primary Thornburg archetype emphasis",
      "moves": ["Specific furniture move 1", "Specific furniture move 2"] (2-3 moves using ONLY existing inventory),
      "rationale": "Why this layout fits this time of year (reference research)"
    }
  ]
}

Return raw JSON only -- no markdown fences.`;
}

/**
 * Builds the prompt for principal email generator.
 */
export function buildPrincipalEmailPrompt(
  layoutTitle: string,
  layoutContext: string,
  state: WizardState,
): string {
  return `You are a Professional Communication Coach for educators. Write an email from a teacher to their principal explaining a classroom redesign.

${RESEARCH_CONTEXT}

CONTEXT:
- Layout: "${layoutTitle}"
- Layout Details: ${layoutContext}
- Learner Profile: ${state.learnerProfile}
- Philosophy: ${state.philosophy}
- Inventory: ${inventoryToString(state)}
- Goals: ${state.goals || "None specified"}

YOUR TASK:
Write a professional, warm email that a teacher can send to their principal explaining what they changed in their classroom and why. Include research citations naturally (not academically). The tone should be confident but collaborative -- inviting the principal to visit.

Return ONLY valid JSON:
{
  "subject": "Email subject line",
  "body": "Full email body in markdown format (3-4 paragraphs). Include greeting and sign-off. Use [Research citations] naturally inline.",
  "citations": [
    {
      "claim": "The specific claim made in the email",
      "source": "The research source backing it"
    }
  ]
}

Return raw JSON only -- no markdown fences.`;
}

/**
 * Builds the prompt for student seat perspective analysis.
 */
export function buildSeatPerspectivePrompt(
  layoutTitle: string,
  layoutContext: string,
  state: WizardState,
): string {
  return `You are a Universal Design for Learning (UDL) Spatial Analyst who evaluates every seat position in a classroom for accessibility and learning quality.

${RESEARCH_CONTEXT}

CONTEXT:
- Layout: "${layoutTitle}"
- Layout Details: ${layoutContext}
- Learner Profile: ${state.learnerProfile}
- Philosophy: ${state.philosophy}
- Inventory: ${inventoryToString(state)}

YOUR TASK:
Analyze the seat positions in this classroom layout. Place seats on a 10x10 grid based on the layout description and furniture inventory. Also place room features (board, teacher desk, door, windows).

For each seat, evaluate sightlines to key room features and UDL suitability.

Return ONLY valid JSON:
{
  "seats": [
    {
      "id": number,
      "x": number (0-9),
      "y": number (0-9),
      "sightlines": {
        "board": "clear" | "partial" | "blocked",
        "teacher": "clear" | "partial" | "blocked",
        "exits": "clear" | "partial" | "blocked",
        "windows": "clear" | "partial" | "blocked"
      },
      "distractionProximity": "low" | "medium" | "high",
      "udlProfile": {
        "adhd": "good" | "fair" | "poor",
        "anxiety": "good" | "fair" | "poor",
        "visualImpairment": "good" | "fair" | "poor"
      },
      "suggestedFor": "Brief description of ideal student profile for this seat",
      "notes": "One specific observation about this seat position"
    }
  ] (generate seats based on the number of student desks/chairs in inventory),
  "roomFeatures": [
    { "type": "board" | "teacher_desk" | "door" | "window", "x": number, "y": number }
  ]
}

Return raw JSON only -- no markdown fences.`;
}

/**
 * Builds the prompt for room sound zones analysis.
 */
export function buildSoundZonesPrompt(
  layoutTitle: string,
  layoutContext: string,
  state: WizardState,
): string {
  return `You are an Acoustic Design Specialist for educational spaces, with expertise in the Lombard Effect and sensory-friendly environments.

${RESEARCH_CONTEXT}

CONTEXT:
- Layout: "${layoutTitle}"
- Layout Details: ${layoutContext}
- Learner Profile: ${state.learnerProfile}
- Philosophy: ${state.philosophy}
- Inventory: ${inventoryToString(state)}

YOUR TASK:
Analyze the acoustic profile of this classroom layout. Identify quiet zones, collaboration zones (naturally louder), and transition areas. Flag Lombard Effect risks and suggest interventions.

Map zones onto a 10x10 grid. Zones should not overlap and should cover the full room.

Return ONLY valid JSON:
{
  "zones": [
    {
      "id": number,
      "x": number (0-9, top-left corner),
      "y": number (0-9, top-left corner),
      "width": number (in grid cells),
      "height": number (in grid cells),
      "type": "quiet" | "moderate" | "loud",
      "dbEstimate": "Relative dB estimate (e.g., ~40dB, ~55dB, ~65dB)",
      "description": "What happens in this zone",
      "interventions": ["Suggested acoustic intervention 1", "Intervention 2"]
    }
  ] (4-6 zones covering the room),
  "lombardRisks": [
    {
      "x": number (0-9),
      "y": number (0-9),
      "description": "Why the Lombard Effect is a risk here and how it propagates"
    }
  ] (1-3 risk points),
  "overallAssessment": "2-3 sentence summary of the room's acoustic personality and top recommendation"
}

Return raw JSON only -- no markdown fences.`;
}
```

**Step 2: Verify and commit**

```bash
npx tsc --noEmit
git add src/lib/research/prompts.ts
git commit -m "feat: add prompt builders for 8 creative classroom tools"
```

---

### Task 3: Extend runTool to handle structured JSON tools

**Files:**
- Modify: `src/lib/ai/claude.ts`

**Step 1: Import new prompt builders and add structured tool runner**

Add the new imports at the top of `claude.ts`:

```typescript
import {
  buildAnalysisPrompt,
  buildGrantPrompt,
  buildLessonPrompt,
  buildNormsPrompt,
  buildDnaPrompt,
  buildPhilosopherCritiquePrompt,
  buildMovementHeatmapPrompt,
  buildBudgetOptimizerPrompt,
  buildSeasonalCalendarPrompt,
  buildPrincipalEmailPrompt,
  buildSeatPerspectivePrompt,
  buildSoundZonesPrompt,
  RESEARCH_CONTEXT,
} from "@/lib/research/prompts";
```

**Step 2: Add a `runStructuredTool` function**

Add below the existing `runTool` function:

```typescript
/**
 * Runs a structured tool that returns parsed JSON instead of raw markdown.
 */
export async function runStructuredTool<T>(
  type: ToolType,
  context: { layoutTitle: string; layoutContext: string; educator?: string },
  state: WizardState,
): Promise<T> {
  const client = getClient();

  let prompt: string;
  switch (type) {
    case "dna":
      prompt = buildDnaPrompt(context.layoutTitle, context.layoutContext, state);
      break;
    case "philosopher-critique":
      prompt = buildPhilosopherCritiquePrompt(
        context.educator ?? "Maria Montessori",
        context.layoutTitle,
        context.layoutContext,
        state,
      );
      break;
    case "movement-heatmap":
      prompt = buildMovementHeatmapPrompt(context.layoutTitle, context.layoutContext, state);
      break;
    case "budget-optimizer":
      prompt = buildBudgetOptimizerPrompt(context.layoutTitle, context.layoutContext, state);
      break;
    case "seasonal-calendar":
      prompt = buildSeasonalCalendarPrompt(context.layoutTitle, context.layoutContext, state);
      break;
    case "principal-email":
      prompt = buildPrincipalEmailPrompt(context.layoutTitle, context.layoutContext, state);
      break;
    case "seat-perspective":
      prompt = buildSeatPerspectivePrompt(context.layoutTitle, context.layoutContext, state);
      break;
    case "sound-zones":
      prompt = buildSoundZonesPrompt(context.layoutTitle, context.layoutContext, state);
      break;
    default:
      throw new Error(`Not a structured tool: ${type}`);
  }

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  const cleaned = textBlock.text
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .trim();
  return JSON.parse(cleaned) as T;
}
```

**Step 3: Verify and commit**

```bash
npx tsc --noEmit
git add src/lib/ai/claude.ts
git commit -m "feat: add runStructuredTool for JSON-returning creative tools"
```

---

### Task 4: Update API route to handle structured tools

**Files:**
- Modify: `src/app/api/tools/route.ts`

**Step 1: Update the route to dispatch to the right runner**

Replace the entire file:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { runTool, runStructuredTool } from "@/lib/ai/claude";
import type { ToolType, WizardState } from "@/types";

const STRUCTURED_TOOLS: ToolType[] = [
  "dna",
  "philosopher-critique",
  "movement-heatmap",
  "budget-optimizer",
  "seasonal-calendar",
  "principal-email",
  "seat-perspective",
  "sound-zones",
];

export async function POST(req: NextRequest) {
  try {
    const { type, context, state } = (await req.json()) as {
      type: ToolType;
      context: {
        layoutTitle: string;
        layoutContext: string;
        topic?: string;
        educator?: string;
      };
      state: WizardState;
    };

    if (!type || !context || !state) {
      return NextResponse.json(
        { error: "type, context, and state are required" },
        { status: 400 },
      );
    }

    if (STRUCTURED_TOOLS.includes(type)) {
      const data = await runStructuredTool(type, context, state);
      return NextResponse.json({ data });
    }

    const content = await runTool(type, context, state);
    return NextResponse.json({ content });
  } catch (error) {
    console.error("Tool error:", error);
    return NextResponse.json(
      { error: "Failed to run tool" },
      { status: 500 },
    );
  }
}
```

Key change: structured tools return `{ data }` (parsed JSON), while existing text tools return `{ content }` (raw markdown string).

**Step 2: Verify and commit**

```bash
npx tsc --noEmit
git add src/app/api/tools/route.ts
git commit -m "feat: update API route to dispatch structured and text tools"
```

---

### Task 5: Add SlideOver wide variant

**Files:**
- Modify: `src/components/ui/slide-over.tsx`

**Step 1: Add size prop**

Update the `SlideOverProps` interface and component to accept a `size` prop:

```typescript
interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "default" | "wide";
}
```

In the component signature, add `size = "default"` to the destructured props.

Change the panel className to use the size:

```typescript
className={`fixed inset-y-0 right-0 w-full ${
  size === "wide" ? "max-w-2xl" : "max-w-lg"
} bg-white shadow-xl z-50 flex flex-col`}
```

**Step 2: Verify and commit**

```bash
npx tsc --noEmit
git add src/components/ui/slide-over.tsx
git commit -m "feat: add wide variant to SlideOver panel"
```

---

### Task 6: Create RoomGrid shared SVG component

**Files:**
- Create: `src/components/ui/room-grid.tsx`

**Step 1: Create the reusable room grid**

```tsx
"use client";

import { type ReactNode } from "react";

interface RoomGridProps {
  width?: number;
  height?: number;
  gridSize?: number;
  children?: ReactNode;
  onCellClick?: (x: number, y: number) => void;
  className?: string;
}

export function RoomGrid({
  width = 400,
  height = 400,
  gridSize = 10,
  children,
  onCellClick,
  className = "",
}: RoomGridProps) {
  const cellW = width / gridSize;
  const cellH = height / gridSize;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`w-full ${className}`}
      style={{ maxHeight: height }}
    >
      {/* Grid lines */}
      {Array.from({ length: gridSize + 1 }).map((_, i) => (
        <g key={i}>
          <line
            x1={i * cellW}
            y1={0}
            x2={i * cellW}
            y2={height}
            stroke="#e7e5e4"
            strokeWidth={0.5}
          />
          <line
            x1={0}
            y1={i * cellH}
            x2={width}
            y2={i * cellH}
            stroke="#e7e5e4"
            strokeWidth={0.5}
          />
        </g>
      ))}

      {/* Room border */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="none"
        stroke="#a8a29e"
        strokeWidth={2}
        rx={4}
      />

      {/* Click targets */}
      {onCellClick &&
        Array.from({ length: gridSize * gridSize }).map((_, idx) => {
          const x = idx % gridSize;
          const y = Math.floor(idx / gridSize);
          return (
            <rect
              key={`click-${idx}`}
              x={x * cellW}
              y={y * cellH}
              width={cellW}
              height={cellH}
              fill="transparent"
              className="cursor-pointer"
              onClick={() => onCellClick(x, y)}
            />
          );
        })}

      {/* Overlay content (heatmap cells, seats, zones, etc.) */}
      {children}
    </svg>
  );
}

/**
 * Helper: render a room feature icon at grid coordinates.
 */
export function RoomFeature({
  x,
  y,
  type,
  gridSize = 10,
  svgSize = 400,
}: {
  x: number;
  y: number;
  type: string;
  gridSize?: number;
  svgSize?: number;
}) {
  const cellSize = svgSize / gridSize;
  const cx = x * cellSize + cellSize / 2;
  const cy = y * cellSize + cellSize / 2;

  const labels: Record<string, string> = {
    board: "B",
    teacher_desk: "T",
    door: "D",
    window: "W",
  };

  return (
    <g>
      <rect
        x={cx - 10}
        y={cy - 10}
        width={20}
        height={20}
        rx={4}
        fill="#fafaf9"
        stroke="#78716c"
        strokeWidth={1.5}
      />
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fontSize={10}
        fontWeight={600}
        fill="#44403c"
      >
        {labels[type] ?? "?"}
      </text>
    </g>
  );
}
```

**Step 2: Verify and commit**

```bash
npx tsc --noEmit
git add src/components/ui/room-grid.tsx
git commit -m "feat: add shared RoomGrid SVG component for spatial tools"
```

---

### Task 7: Build Classroom DNA tool component

**Files:**
- Create: `src/components/tools/classroom-dna.tsx`

**Step 1: Create the component**

```tsx
"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import type { ClassroomDNA } from "@/types";

interface ClassroomDnaViewProps {
  data: ClassroomDNA;
}

export function ClassroomDnaView({ data }: ClassroomDnaViewProps) {
  const radarData = [
    { axis: "Campfire", value: data.archetypes.campfire },
    { axis: "Watering Hole", value: data.archetypes.wateringHole },
    { axis: "Cave", value: data.archetypes.cave },
    { axis: "Stimulation", value: data.sensory.stimulation },
    { axis: "Predictability", value: data.sensory.predictability },
    { axis: "Movement", value: data.sensory.movementFreedom },
  ];

  return (
    <div className="space-y-6">
      {/* Personality label */}
      <div className="text-center">
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">
          Classroom Personality
        </p>
        <p className="text-2xl font-extrabold text-rose-950">{data.personality}</p>
      </div>

      {/* Radar chart */}
      <div className="w-full" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e7e5e4" />
            <PolarAngleAxis
              dataKey="axis"
              tick={{ fontSize: 11, fill: "#57534e" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 9, fill: "#a8a29e" }}
            />
            <Radar
              dataKey="value"
              stroke="#be123c"
              fill="#be123c"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary */}
      <p className="text-sm text-stone-600 leading-relaxed">{data.summary}</p>

      {/* Philosophy alignment bars */}
      <div>
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">
          Philosophy Alignment
        </p>
        <div className="space-y-2">
          {data.philosophyAlignment.map((item) => (
            <div key={item.philosophy} className="flex items-center gap-3">
              <span className="text-xs text-stone-600 w-32 shrink-0">
                {item.philosophy}
              </span>
              <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-600 rounded-full transition-all"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-xs font-medium text-stone-700 w-8 text-right">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Verify and commit**

```bash
npx tsc --noEmit
git add src/components/tools/classroom-dna.tsx
git commit -m "feat: add Classroom DNA radar chart component"
```

---

### Task 8: Build Philosopher Critique tool component

**Files:**
- Create: `src/components/tools/philosopher-critique.tsx`

**Step 1: Create the component**

```tsx
"use client";

import { User, ThumbsUp, AlertTriangle, Lightbulb, Quote } from "lucide-react";
import type { PhilosopherCritique } from "@/types";

interface PhilosopherCritiqueViewProps {
  data: PhilosopherCritique;
}

export function PhilosopherCritiqueView({ data }: PhilosopherCritiqueViewProps) {
  return (
    <div className="space-y-6">
      {/* Educator header */}
      <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
        <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-800">
          <User className="w-6 h-6" />
        </div>
        <div>
          <p className="font-bold text-stone-900 text-lg">{data.educator}</p>
          <p className="text-xs text-stone-500">Classroom Critique</p>
        </div>
      </div>

      {/* Praise */}
      <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <ThumbsUp className="w-4 h-4 text-emerald-700" />
          <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
            What They Would Praise
          </p>
        </div>
        <p className="text-sm text-emerald-900 leading-relaxed">{data.praise}</p>
      </div>

      {/* Challenge */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-amber-700" />
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
            What They Would Challenge
          </p>
        </div>
        <p className="text-sm text-amber-900 leading-relaxed">{data.challenge}</p>
      </div>

      {/* Suggestion */}
      <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-blue-700" />
          <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide">
            Their Suggestion
          </p>
        </div>
        <p className="text-sm text-blue-900 leading-relaxed">{data.suggestion}</p>
      </div>

      {/* Quote */}
      <div className="bg-stone-50 rounded-xl border border-stone-200 p-4">
        <div className="flex items-start gap-2">
          <Quote className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-stone-700 italic leading-relaxed">
              &ldquo;{data.quote}&rdquo;
            </p>
            <p className="text-xs text-stone-500 mt-2">&mdash; {data.quoteSource}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Verify and commit**

```bash
npx tsc --noEmit
git add src/components/tools/philosopher-critique.tsx
git commit -m "feat: add Philosopher Critique tool component"
```

---

### Task 9: Build Movement Heatmap tool component

**Files:**
- Create: `src/components/tools/movement-heatmap.tsx`

**Step 1: Create the component**

```tsx
"use client";

import { useState } from "react";
import { RoomGrid } from "@/components/ui/room-grid";
import type { MovementHeatmapData } from "@/types";

interface MovementHeatmapViewProps {
  data: MovementHeatmapData;
}

function intensityColor(value: number): string {
  if (value < 0.25) return "rgba(34, 197, 94, 0.3)";
  if (value < 0.5) return "rgba(234, 179, 8, 0.4)";
  if (value < 0.75) return "rgba(249, 115, 22, 0.5)";
  return "rgba(239, 68, 68, 0.6)";
}

const SVG_SIZE = 400;
const GRID_SIZE = 10;
const CELL = SVG_SIZE / GRID_SIZE;

export function MovementHeatmapView({ data }: MovementHeatmapViewProps) {
  const [hoveredBottleneck, setHoveredBottleneck] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <RoomGrid width={SVG_SIZE} height={SVG_SIZE} gridSize={GRID_SIZE}>
        {/* Heatmap cells */}
        {data.grid.map((row, y) =>
          row.map((value, x) => (
            <rect
              key={`${x}-${y}`}
              x={x * CELL}
              y={y * CELL}
              width={CELL}
              height={CELL}
              fill={intensityColor(value)}
            />
          )),
        )}

        {/* Teacher path */}
        {data.teacherPath.length > 1 && (
          <polyline
            points={data.teacherPath
              .map((p) => `${p.x * CELL + CELL / 2},${p.y * CELL + CELL / 2}`)
              .join(" ")}
            fill="none"
            stroke="#7c3aed"
            strokeWidth={2}
            strokeDasharray="6 4"
            strokeLinecap="round"
          />
        )}

        {/* Student flows */}
        {data.studentFlows.map((flow, i) => (
          <line
            key={`flow-${i}`}
            x1={flow.from.x * CELL + CELL / 2}
            y1={flow.from.y * CELL + CELL / 2}
            x2={flow.to.x * CELL + CELL / 2}
            y2={flow.to.y * CELL + CELL / 2}
            stroke="#3b82f6"
            strokeWidth={Math.max(1, flow.intensity * 3)}
            strokeOpacity={0.6}
            markerEnd="url(#arrowhead)"
          />
        ))}

        {/* Arrowhead marker */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth={8}
            markerHeight={6}
            refX={8}
            refY={3}
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Bottlenecks */}
        {data.bottlenecks.map((bn, i) => (
          <g
            key={`bn-${i}`}
            onMouseEnter={() => setHoveredBottleneck(i)}
            onMouseLeave={() => setHoveredBottleneck(null)}
            className="cursor-pointer"
          >
            <circle
              cx={bn.x * CELL + CELL / 2}
              cy={bn.y * CELL + CELL / 2}
              r={8}
              fill="#ef4444"
              opacity={0.8}
            >
              <animate
                attributeName="r"
                values="8;12;8"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <text
              x={bn.x * CELL + CELL / 2}
              y={bn.y * CELL + CELL / 2 + 3}
              textAnchor="middle"
              fontSize={9}
              fontWeight={700}
              fill="white"
            >
              !
            </text>
          </g>
        ))}
      </RoomGrid>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-stone-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ background: "rgba(34, 197, 94, 0.3)" }} />
          Low
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ background: "rgba(234, 179, 8, 0.4)" }} />
          Medium
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ background: "rgba(239, 68, 68, 0.6)" }} />
          High
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-purple-600" style={{ borderTop: "2px dashed #7c3aed" }} />
          Teacher
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-blue-500" />
          Students
        </div>
      </div>

      {/* Bottleneck details */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
          Bottlenecks
        </p>
        {data.bottlenecks.map((bn, i) => (
          <div
            key={i}
            className={`rounded-lg border p-3 text-sm transition-colors ${
              hoveredBottleneck === i
                ? "border-red-300 bg-red-50"
                : "border-stone-200 bg-white"
            }`}
          >
            <p className="font-medium text-stone-900">{bn.description}</p>
            <p className="text-stone-500 mt-1">Fix: {bn.fix}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Verify and commit**

```bash
npx tsc --noEmit
git add src/components/tools/movement-heatmap.tsx
git commit -m "feat: add Movement Heatmap interactive SVG tool component"
```

---

### Task 10: Build Budget Optimizer tool component

**Files:**
- Create: `src/components/tools/budget-optimizer.tsx`

**Step 1: Create the component**

```tsx
"use client";

import type { BudgetOptimizer } from "@/types";

interface BudgetOptimizerViewProps {
  data: BudgetOptimizer;
}

export function BudgetOptimizerView({ data }: BudgetOptimizerViewProps) {
  const maxImpact = Math.max(...data.recommendations.map((r) => r.impactScore));

  return (
    <div className="space-y-6">
      <p className="text-sm text-stone-600 leading-relaxed">{data.summary}</p>

      <div className="space-y-4">
        {data.recommendations.map((item, i) => (
          <div
            key={i}
            className={`rounded-xl border p-4 ${
              i === 0
                ? "border-rose-200 bg-rose-50"
                : "border-stone-200 bg-white"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-400">
                    #{item.rank}
                  </span>
                  <h4 className="font-semibold text-stone-900">{item.name}</h4>
                </div>
                <p className="text-sm font-medium text-rose-800 mt-0.5">
                  ${item.cost}
                </p>
              </div>
              <span className="text-2xl font-extrabold text-rose-800">
                {item.impactScore}
              </span>
            </div>

            {/* Impact bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-stone-500 mb-1">
                <span>Impact Score</span>
                <span>{item.impactScore}/100</span>
              </div>
              <svg viewBox="0 0 200 12" className="w-full">
                <rect
                  x={0}
                  y={0}
                  width={200}
                  height={12}
                  rx={6}
                  fill="#f5f5f4"
                />
                <rect
                  x={0}
                  y={0}
                  width={(item.impactScore / maxImpact) * 200}
                  height={12}
                  rx={6}
                  fill={i === 0 ? "#be123c" : "#78716c"}
                />
              </svg>
            </div>

            <p className="text-sm text-stone-600 leading-relaxed mb-2">
              {item.rationale}
            </p>
            <p className="text-xs text-stone-400 italic">
              {item.researchSource}
            </p>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-3 border-t border-stone-200">
        <span className="text-sm font-medium text-stone-500">Total</span>
        <span className="text-lg font-bold text-stone-900">
          ${data.recommendations.reduce((sum, r) => sum + r.cost, 0)}
        </span>
      </div>
    </div>
  );
}
```

**Step 2: Verify and commit**

```bash
npx tsc --noEmit
git add src/components/tools/budget-optimizer.tsx
git commit -m "feat: add Budget Optimizer tool component"
```

---

### Task 11: Build Seasonal Calendar tool component

**Files:**
- Create: `src/components/tools/seasonal-calendar.tsx`

**Step 1: Create the component**

```tsx
"use client";

import { useState } from "react";
import { Flame, Droplets, Mountain } from "lucide-react";
import type { SeasonalCalendar } from "@/types";

interface SeasonalCalendarViewProps {
  data: SeasonalCalendar;
}

const MONTHS = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const MONTH_NUMBERS = [8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6];

const archetypeIcons: Record<string, typeof Flame> = {
  Campfire: Flame,
  "Watering Hole": Droplets,
  Cave: Mountain,
};

const phaseColors = [
  "bg-amber-100 border-amber-300 text-amber-900",
  "bg-blue-100 border-blue-300 text-blue-900",
  "bg-purple-100 border-purple-300 text-purple-900",
  "bg-green-100 border-green-300 text-green-900",
  "bg-rose-100 border-rose-300 text-rose-900",
];

const barColors = [
  "#fbbf24",
  "#60a5fa",
  "#a78bfa",
  "#34d399",
  "#fb7185",
];

function monthIndex(m: number): number {
  return MONTH_NUMBERS.indexOf(m);
}

export function SeasonalCalendarView({ data }: SeasonalCalendarViewProps) {
  const [selected, setSelected] = useState<number>(0);
  const currentMonth = new Date().getMonth() + 1;

  const SVG_W = 440;
  const SVG_H = 80;
  const colW = SVG_W / MONTHS.length;

  return (
    <div className="space-y-6">
      {/* Timeline */}
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full">
        {/* Month labels */}
        {MONTHS.map((label, i) => (
          <text
            key={label}
            x={i * colW + colW / 2}
            y={14}
            textAnchor="middle"
            fontSize={10}
            fill={MONTH_NUMBERS[i] === currentMonth ? "#be123c" : "#78716c"}
            fontWeight={MONTH_NUMBERS[i] === currentMonth ? 700 : 400}
          >
            {label}
          </text>
        ))}

        {/* Current month indicator */}
        {MONTH_NUMBERS.includes(currentMonth) && (
          <line
            x1={monthIndex(currentMonth) * colW + colW / 2}
            y1={18}
            x2={monthIndex(currentMonth) * colW + colW / 2}
            y2={SVG_H - 4}
            stroke="#be123c"
            strokeWidth={1.5}
            strokeDasharray="3 3"
          />
        )}

        {/* Phase bars */}
        {data.phases.map((phase, i) => {
          const startIdx = monthIndex(phase.startMonth);
          const endIdx = monthIndex(phase.endMonth);
          if (startIdx === -1 || endIdx === -1) return null;
          const x = startIdx * colW + 2;
          const w = (endIdx - startIdx + 1) * colW - 4;
          const y = 24 + (i % 2) * 26;
          return (
            <g
              key={i}
              onClick={() => setSelected(i)}
              className="cursor-pointer"
            >
              <rect
                x={x}
                y={y}
                width={Math.max(w, colW - 4)}
                height={22}
                rx={6}
                fill={barColors[i % barColors.length]}
                opacity={selected === i ? 0.9 : 0.5}
                stroke={selected === i ? "#44403c" : "none"}
                strokeWidth={1}
              />
              <text
                x={x + Math.max(w, colW - 4) / 2}
                y={y + 14}
                textAnchor="middle"
                fontSize={9}
                fontWeight={600}
                fill="#1c1917"
              >
                {phase.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Selected phase detail */}
      {data.phases[selected] && (
        <div
          className={`rounded-xl border p-5 ${phaseColors[selected % phaseColors.length]}`}
        >
          <div className="flex items-center gap-2 mb-3">
            {(() => {
              const Icon = archetypeIcons[data.phases[selected].archetype] ?? Flame;
              return <Icon className="w-5 h-5" />;
            })()}
            <h4 className="font-bold text-lg">{data.phases[selected].name}</h4>
          </div>

          <p className="text-sm mb-3">{data.phases[selected].focus}</p>

          <p className="text-xs font-semibold uppercase tracking-wide mb-2 opacity-70">
            Furniture Moves
          </p>
          <ul className="space-y-1 mb-3">
            {data.phases[selected].moves.map((move, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="shrink-0">&bull;</span>
                {move}
              </li>
            ))}
          </ul>

          <p className="text-sm opacity-80 italic">
            {data.phases[selected].rationale}
          </p>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Verify and commit**

```bash
npx tsc --noEmit
git add src/components/tools/seasonal-calendar.tsx
git commit -m "feat: add Seasonal Calendar timeline SVG tool component"
```

---

### Task 12: Build Principal Email tool component

**Files:**
- Create: `src/components/tools/principal-email.tsx`

**Step 1: Create the component**

```tsx
"use client";

import { useState } from "react";
import { ClipboardCopy, Mail, Check, Pencil, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import type { PrincipalEmail } from "@/types";

interface PrincipalEmailViewProps {
  data: PrincipalEmail;
}

export function PrincipalEmailView({ data }: PrincipalEmailViewProps) {
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(data.body);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      `Subject: ${data.subject}\n\n${body}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mailtoUrl = `mailto:?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="space-y-4">
      {/* Email header */}
      <div className="bg-stone-50 rounded-xl border border-stone-200 p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-stone-500 w-16">To:</span>
          <span className="text-stone-400 italic">Your principal</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-stone-500 w-16">Subject:</span>
          <span className="font-medium text-stone-900">{data.subject}</span>
        </div>
      </div>

      {/* Body */}
      <div className="rounded-xl border border-stone-200 bg-white">
        <div className="flex items-center justify-between px-4 py-2 border-b border-stone-100">
          <span className="text-xs text-stone-400">
            {editing ? "Editing" : "Preview"}
          </span>
          <button
            onClick={() => setEditing(!editing)}
            className="text-xs text-stone-500 hover:text-stone-700 flex items-center gap-1 transition-colors"
          >
            {editing ? (
              <>
                <Eye className="w-3 h-3" /> Preview
              </>
            ) : (
              <>
                <Pencil className="w-3 h-3" /> Edit
              </>
            )}
          </button>
        </div>

        <div className="p-4">
          {editing ? (
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full min-h-[300px] text-sm text-stone-700 leading-relaxed resize-y focus:outline-none"
            />
          ) : (
            <div className="prose prose-sm prose-stone max-w-none">
              <ReactMarkdown>{body}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="primary" size="sm" onClick={handleCopy} className="flex-1">
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-1.5" /> Copied
            </>
          ) : (
            <>
              <ClipboardCopy className="w-4 h-4 mr-1.5" /> Copy to Clipboard
            </>
          )}
        </Button>
        <a href={mailtoUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="secondary" size="sm">
            <Mail className="w-4 h-4 mr-1.5" /> Open in Mail
          </Button>
        </a>
      </div>

      {/* Citations */}
      {data.citations.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
            Research Citations
          </p>
          <div className="space-y-1.5">
            {data.citations.map((cite, i) => (
              <div key={i} className="text-xs text-stone-500">
                <span className="text-stone-700">{cite.claim}</span>
                {" — "}
                <span className="italic">{cite.source}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Verify and commit**

```bash
npx tsc --noEmit
git add src/components/tools/principal-email.tsx
git commit -m "feat: add Principal Email tool component with edit/preview modes"
```

---

### Task 13: Build Seat Perspective tool component

**Files:**
- Create: `src/components/tools/seat-perspective.tsx`

**Step 1: Create the component**

```tsx
"use client";

import { useState } from "react";
import { RoomGrid, RoomFeature } from "@/components/ui/room-grid";
import type { SeatPerspective } from "@/types";

interface SeatPerspectiveViewProps {
  data: SeatPerspective;
}

const SVG_SIZE = 400;
const GRID_SIZE = 10;
const CELL = SVG_SIZE / GRID_SIZE;

function seatColor(seat: SeatPerspective["seats"][0]): string {
  const scores = Object.values(seat.udlProfile);
  const goods = scores.filter((s) => s === "good").length;
  if (goods >= 2) return "#22c55e";
  if (goods >= 1) return "#eab308";
  return "#ef4444";
}

function sightlineStroke(status: "clear" | "partial" | "blocked"): {
  dash: string;
  opacity: number;
} {
  if (status === "clear") return { dash: "none", opacity: 0.6 };
  if (status === "partial") return { dash: "4 4", opacity: 0.4 };
  return { dash: "2 2", opacity: 0 };
}

export function SeatPerspectiveView({ data }: SeatPerspectiveViewProps) {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const selected = data.seats.find((s) => s.id === selectedSeat);

  return (
    <div className="space-y-4">
      <RoomGrid width={SVG_SIZE} height={SVG_SIZE} gridSize={GRID_SIZE}>
        {/* Room features */}
        {data.roomFeatures.map((feat, i) => (
          <RoomFeature
            key={i}
            x={feat.x}
            y={feat.y}
            type={feat.type}
            gridSize={GRID_SIZE}
            svgSize={SVG_SIZE}
          />
        ))}

        {/* Sightlines for selected seat */}
        {selected &&
          data.roomFeatures.map((feat, i) => {
            const key = feat.type as keyof typeof selected.sightlines;
            const status = selected.sightlines[key];
            if (!status) return null;
            const { dash, opacity } = sightlineStroke(status);
            if (opacity === 0) return null;
            return (
              <line
                key={`sight-${i}`}
                x1={selected.x * CELL + CELL / 2}
                y1={selected.y * CELL + CELL / 2}
                x2={feat.x * CELL + CELL / 2}
                y2={feat.y * CELL + CELL / 2}
                stroke="#78716c"
                strokeWidth={1.5}
                strokeDasharray={dash}
                opacity={opacity}
              />
            );
          })}

        {/* Seats */}
        {data.seats.map((seat) => (
          <g
            key={seat.id}
            onClick={() => setSelectedSeat(seat.id)}
            className="cursor-pointer"
          >
            <circle
              cx={seat.x * CELL + CELL / 2}
              cy={seat.y * CELL + CELL / 2}
              r={selectedSeat === seat.id ? 10 : 7}
              fill={seatColor(seat)}
              stroke={selectedSeat === seat.id ? "#1c1917" : "none"}
              strokeWidth={2}
              opacity={0.8}
            />
            <text
              x={seat.x * CELL + CELL / 2}
              y={seat.y * CELL + CELL / 2 + 3}
              textAnchor="middle"
              fontSize={8}
              fontWeight={600}
              fill="white"
            >
              {seat.id}
            </text>
          </g>
        ))}
      </RoomGrid>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-stone-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          Good UDL
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          Fair
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          Needs attention
        </div>
      </div>

      {/* Selected seat detail */}
      {selected ? (
        <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-stone-900">Seat {selected.id}</h4>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                selected.distractionProximity === "low"
                  ? "bg-green-100 text-green-800"
                  : selected.distractionProximity === "medium"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              Distraction: {selected.distractionProximity}
            </span>
          </div>

          {/* Sightlines */}
          <div className="grid grid-cols-2 gap-2">
            {(
              Object.entries(selected.sightlines) as [string, string][]
            ).map(([key, val]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-stone-500 capitalize">
                  {key.replace("_", " ")}
                </span>
                <span
                  className={`font-medium ${
                    val === "clear"
                      ? "text-green-700"
                      : val === "partial"
                        ? "text-amber-700"
                        : "text-red-700"
                  }`}
                >
                  {val}
                </span>
              </div>
            ))}
          </div>

          {/* UDL Profile */}
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">
              UDL Profile
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(
                Object.entries(selected.udlProfile) as [string, string][]
              ).map(([key, val]) => (
                <div key={key} className="text-center">
                  <p className="text-xs text-stone-500 capitalize">{key}</p>
                  <p
                    className={`text-sm font-medium ${
                      val === "good"
                        ? "text-green-700"
                        : val === "fair"
                          ? "text-amber-700"
                          : "text-red-700"
                    }`}
                  >
                    {val}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-stone-600">{selected.suggestedFor}</p>
          <p className="text-xs text-stone-400 italic">{selected.notes}</p>
        </div>
      ) : (
        <p className="text-sm text-stone-400 text-center">
          Click a seat to see its perspective analysis
        </p>
      )}
    </div>
  );
}
```

**Step 2: Verify and commit**

```bash
npx tsc --noEmit
git add src/components/tools/seat-perspective.tsx
git commit -m "feat: add Seat Perspective interactive SVG tool component"
```

---

### Task 14: Build Sound Zones tool component

**Files:**
- Create: `src/components/tools/sound-zones.tsx`

**Step 1: Create the component**

```tsx
"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { RoomGrid } from "@/components/ui/room-grid";
import type { SoundZonesData } from "@/types";

interface SoundZonesViewProps {
  data: SoundZonesData;
}

const SVG_SIZE = 400;
const GRID_SIZE = 10;
const CELL = SVG_SIZE / GRID_SIZE;

const zoneColors: Record<string, string> = {
  quiet: "rgba(59, 130, 246, 0.25)",
  moderate: "rgba(249, 115, 22, 0.25)",
  loud: "rgba(239, 68, 68, 0.3)",
};

const zoneBorders: Record<string, string> = {
  quiet: "#3b82f6",
  moderate: "#f97316",
  loud: "#ef4444",
};

export function SoundZonesView({ data }: SoundZonesViewProps) {
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const selected = data.zones.find((z) => z.id === selectedZone);

  return (
    <div className="space-y-4">
      <RoomGrid width={SVG_SIZE} height={SVG_SIZE} gridSize={GRID_SIZE}>
        {/* Zones */}
        {data.zones.map((zone) => (
          <g
            key={zone.id}
            onClick={() => setSelectedZone(zone.id)}
            className="cursor-pointer"
          >
            <rect
              x={zone.x * CELL}
              y={zone.y * CELL}
              width={zone.width * CELL}
              height={zone.height * CELL}
              fill={zoneColors[zone.type]}
              stroke={zoneBorders[zone.type]}
              strokeWidth={selectedZone === zone.id ? 2.5 : 1}
              rx={4}
            />
            <text
              x={zone.x * CELL + (zone.width * CELL) / 2}
              y={zone.y * CELL + (zone.height * CELL) / 2 - 4}
              textAnchor="middle"
              fontSize={10}
              fontWeight={600}
              fill="#1c1917"
            >
              {zone.type}
            </text>
            <text
              x={zone.x * CELL + (zone.width * CELL) / 2}
              y={zone.y * CELL + (zone.height * CELL) / 2 + 10}
              textAnchor="middle"
              fontSize={8}
              fill="#57534e"
            >
              {zone.dbEstimate}
            </text>
          </g>
        ))}

        {/* Lombard risks */}
        {data.lombardRisks.map((risk, i) => (
          <g key={`lom-${i}`}>
            <circle
              cx={risk.x * CELL + CELL / 2}
              cy={risk.y * CELL + CELL / 2}
              r={12}
              fill="#fef3c7"
              stroke="#f59e0b"
              strokeWidth={1.5}
            />
            <text
              x={risk.x * CELL + CELL / 2}
              y={risk.y * CELL + CELL / 2 + 4}
              textAnchor="middle"
              fontSize={12}
              fontWeight={700}
              fill="#d97706"
            >
              L
            </text>
          </g>
        ))}
      </RoomGrid>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-stone-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ background: zoneColors.quiet }} />
          Quiet
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ background: zoneColors.moderate }} />
          Moderate
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ background: zoneColors.loud }} />
          Loud
        </div>
        <div className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-amber-500" />
          Lombard Risk
        </div>
      </div>

      {/* Overall assessment */}
      <p className="text-sm text-stone-600 leading-relaxed">
        {data.overallAssessment}
      </p>

      {/* Selected zone detail */}
      {selected && (
        <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-stone-900">{selected.description}</h4>
            <span className="text-xs font-medium text-stone-500">
              {selected.dbEstimate}
            </span>
          </div>
          {selected.interventions.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">
                Suggested Interventions
              </p>
              <ul className="space-y-1">
                {selected.interventions.map((int, i) => (
                  <li key={i} className="text-sm text-stone-600 flex items-start gap-2">
                    <span className="shrink-0">&bull;</span>
                    {int}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Lombard risks */}
      {data.lombardRisks.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">
            Lombard Effect Risks
          </p>
          {data.lombardRisks.map((risk, i) => (
            <div
              key={i}
              className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 mb-2"
            >
              {risk.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Step 2: Verify and commit**

```bash
npx tsc --noEmit
git add src/components/tools/sound-zones.tsx
git commit -m "feat: add Sound Zones interactive SVG tool component"
```

---

### Task 15: Wire all tools into step-results.tsx

**Files:**
- Modify: `src/components/wizard/step-results.tsx`

This is the largest integration task. The existing `step-results.tsx` needs to:

1. Expand the tool button bar with 8 new tools grouped into categories
2. Handle structured tool responses (JSON) differently from text tool responses (markdown)
3. Render the correct visualization component per tool type
4. Handle the philosopher-critique educator selector
5. Use the wide SlideOver variant for spatial tools

**Step 1: Update imports**

Add at top of file:

```typescript
import {
  Fingerprint,
  User,
  MapPin,
  DollarSign,
  Calendar,
  Mail,
  Eye,
  Volume2,
} from "lucide-react";
import { ClassroomDnaView } from "@/components/tools/classroom-dna";
import { PhilosopherCritiqueView } from "@/components/tools/philosopher-critique";
import { MovementHeatmapView } from "@/components/tools/movement-heatmap";
import { BudgetOptimizerView } from "@/components/tools/budget-optimizer";
import { SeasonalCalendarView } from "@/components/tools/seasonal-calendar";
import { PrincipalEmailView } from "@/components/tools/principal-email";
import { SeatPerspectiveView } from "@/components/tools/seat-perspective";
import { SoundZonesView } from "@/components/tools/sound-zones";
```

**Step 2: Replace toolLabels with grouped tool config**

Replace the existing `toolLabels` constant with:

```typescript
const STRUCTURED_TOOLS: ToolType[] = [
  "dna",
  "philosopher-critique",
  "movement-heatmap",
  "budget-optimizer",
  "seasonal-calendar",
  "principal-email",
  "seat-perspective",
  "sound-zones",
];

const WIDE_TOOLS: ToolType[] = [
  "movement-heatmap",
  "seat-perspective",
  "sound-zones",
];

interface ToolConfig {
  label: string;
  icon: typeof FileText;
  group: string;
}

const toolConfig: Record<ToolType, ToolConfig> = {
  grant: { label: "Write a Grant", icon: FileText, group: "Create" },
  norms: { label: "Generate Norms", icon: Scale, group: "Create" },
  lesson: { label: "Adapt a Lesson", icon: BookOpen, group: "Create" },
  dna: { label: "Classroom DNA", icon: Fingerprint, group: "Analyze" },
  "movement-heatmap": { label: "Movement Map", icon: MapPin, group: "Analyze" },
  "seat-perspective": { label: "Seat Perspective", icon: Eye, group: "Analyze" },
  "sound-zones": { label: "Sound Zones", icon: Volume2, group: "Analyze" },
  "budget-optimizer": { label: "The $200 Question", icon: DollarSign, group: "Plan" },
  "seasonal-calendar": { label: "Seasonal Calendar", icon: Calendar, group: "Plan" },
  "principal-email": { label: "Email Principal", icon: Mail, group: "Communicate" },
  "philosopher-critique": { label: "Philosopher Critique", icon: User, group: "Communicate" },
};

const toolGroups = ["Analyze", "Plan", "Communicate", "Create"];
```

**Step 3: Add structured data state and educator selector state**

Add alongside existing state in `StepResults`:

```typescript
const [toolData, setToolData] = useState<unknown>(null);
const [selectedEducator, setSelectedEducator] = useState("Maria Montessori");
const [educatorPromptIndex, setEducatorPromptIndex] = useState<number | null>(null);
```

**Step 4: Update openTool to handle structured tools**

Replace the existing `openTool` callback body. Keep the lesson topic prompt handling, and add:
- For `philosopher-critique`: show educator selector first (like lesson shows topic input)
- For structured tools: fetch JSON and store in `toolData`
- For text tools: keep existing behavior storing in `toolContent`

```typescript
const openTool = useCallback(
  async (type: ToolType, option: LayoutOption) => {
    if (type === "lesson") {
      setLessonPromptIndex(result?.options.indexOf(option) ?? null);
      return;
    }

    if (type === "philosopher-critique") {
      setEducatorPromptIndex(result?.options.indexOf(option) ?? null);
      return;
    }

    setSlideOver({
      open: true,
      type,
      layoutTitle: option.title,
      layoutContext: option.why,
    });
    setToolContent(null);
    setToolData(null);
    setToolLoading(true);

    try {
      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          context: {
            layoutTitle: option.title,
            layoutContext: option.why,
          },
          state,
        }),
      });
      const json = await res.json();

      if (STRUCTURED_TOOLS.includes(type)) {
        setToolData(json.data);
      } else {
        setToolContent(json.content ?? json.result ?? "No content returned.");
      }
    } catch {
      setToolContent("Something went wrong. Please try again.");
    } finally {
      setToolLoading(false);
    }
  },
  [state, result],
);
```

**Step 5: Add handleEducatorSubmit**

```typescript
const handleEducatorSubmit = async (option: LayoutOption) => {
  setEducatorPromptIndex(null);

  setSlideOver({
    open: true,
    type: "philosopher-critique",
    layoutTitle: option.title,
    layoutContext: option.why,
  });
  setToolContent(null);
  setToolData(null);
  setToolLoading(true);

  try {
    const res = await fetch("/api/tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "philosopher-critique" as ToolType,
        context: {
          layoutTitle: option.title,
          layoutContext: option.why,
          educator: selectedEducator,
        },
        state,
      }),
    });
    const json = await res.json();
    setToolData(json.data);
  } catch {
    setToolContent("Something went wrong. Please try again.");
  } finally {
    setToolLoading(false);
  }
};
```

**Step 6: Replace the action bar in the layout cards**

Replace the existing action bar `<div className="flex flex-wrap gap-2 px-6 pb-5 relative">` block with:

```tsx
<div className="px-6 pb-5 space-y-3 relative">
  {toolGroups.map((group) => {
    const groupTools = (Object.entries(toolConfig) as [ToolType, ToolConfig][])
      .filter(([, cfg]) => cfg.group === group);
    return (
      <div key={group}>
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1.5">
          {group}
        </p>
        <div className="flex flex-wrap gap-2">
          {groupTools.map(([type, cfg]) => {
            const Icon = cfg.icon;
            return (
              <Button
                key={type}
                variant="secondary"
                size="sm"
                onClick={() => openTool(type, option)}
              >
                <Icon className="w-4 h-4 mr-1.5" />
                {cfg.label}
              </Button>
            );
          })}
        </div>
      </div>
    );
  })}

  {/* Lesson topic inline input */}
  {lessonPromptIndex === index && (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 w-full"
    >
      <input
        type="text"
        placeholder="Enter lesson topic..."
        value={lessonTopic}
        onChange={(e) => setLessonTopic(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && lessonTopic.trim()) {
            handleLessonSubmit(option);
          }
        }}
        className="flex-1 rounded-lg border border-stone-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
      />
      <Button
        variant="primary"
        size="sm"
        onClick={() => handleLessonSubmit(option)}
        disabled={!lessonTopic.trim()}
      >
        <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.div>
  )}

  {/* Educator selector */}
  {educatorPromptIndex === index && (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 w-full"
    >
      <select
        value={selectedEducator}
        onChange={(e) => setSelectedEducator(e.target.value)}
        className="flex-1 rounded-lg border border-stone-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800 bg-white"
      >
        {["Maria Montessori", "John Dewey", "Paulo Freire", "Loris Malaguzzi", "Lev Vygotsky", "bell hooks"].map(
          (name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ),
        )}
      </select>
      <Button
        variant="primary"
        size="sm"
        onClick={() => handleEducatorSubmit(option)}
      >
        <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.div>
  )}
</div>
```

**Step 7: Update the SlideOver rendering**

Replace the existing `<SlideOver>` block with:

```tsx
<SlideOver
  isOpen={slideOver.open}
  onClose={() => {
    setSlideOver((prev) => ({ ...prev, open: false }));
    setToolContent(null);
    setToolData(null);
  }}
  title={`${toolConfig[slideOver.type]?.label ?? slideOver.type} — ${slideOver.layoutTitle}`}
  size={WIDE_TOOLS.includes(slideOver.type) ? "wide" : "default"}
  footer={
    toolContent && !STRUCTURED_TOOLS.includes(slideOver.type) ? (
      <Button variant="secondary" onClick={handleCopy} className="w-full">
        {copied ? (
          <>
            <CheckIcon className="w-4 h-4 mr-2" />
            Copied
          </>
        ) : (
          <>
            <ClipboardCopy className="w-4 h-4 mr-2" />
            Copy to Clipboard
          </>
        )}
      </Button>
    ) : undefined
  }
>
  {toolLoading ? (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 className="w-6 h-6 text-rose-700 animate-spin" />
      <p className="text-sm text-stone-500">Generating content...</p>
    </div>
  ) : toolData && STRUCTURED_TOOLS.includes(slideOver.type) ? (
    <>
      {slideOver.type === "dna" && <ClassroomDnaView data={toolData as import("@/types").ClassroomDNA} />}
      {slideOver.type === "philosopher-critique" && <PhilosopherCritiqueView data={toolData as import("@/types").PhilosopherCritique} />}
      {slideOver.type === "movement-heatmap" && <MovementHeatmapView data={toolData as import("@/types").MovementHeatmapData} />}
      {slideOver.type === "budget-optimizer" && <BudgetOptimizerView data={toolData as import("@/types").BudgetOptimizer} />}
      {slideOver.type === "seasonal-calendar" && <SeasonalCalendarView data={toolData as import("@/types").SeasonalCalendar} />}
      {slideOver.type === "principal-email" && <PrincipalEmailView data={toolData as import("@/types").PrincipalEmail} />}
      {slideOver.type === "seat-perspective" && <SeatPerspectiveView data={toolData as import("@/types").SeatPerspective} />}
      {slideOver.type === "sound-zones" && <SoundZonesView data={toolData as import("@/types").SoundZonesData} />}
    </>
  ) : toolContent ? (
    <div className="prose prose-sm prose-stone max-w-none">
      <ReactMarkdown>{toolContent}</ReactMarkdown>
    </div>
  ) : null}
</SlideOver>
```

**Step 8: Verify and commit**

```bash
npx tsc --noEmit
git add src/components/wizard/step-results.tsx
git commit -m "feat: wire all 8 creative tools into results page with grouped action bar"
```

---

### Task 16: Final build verification

**Files:** None (verification only)

**Step 1: Run full type check**

```bash
npx tsc --noEmit
```

Expected: No errors.

**Step 2: Run full build**

```bash
npx next build
```

Expected: All routes compile. No build errors.

**Step 3: Commit any remaining fixes**

If there are type errors or build issues, fix and commit as:

```bash
git commit -m "fix: resolve build issues for creative tools integration"
```

---

## Task Dependency Order

```
Task 1 (Types + Recharts) ── Task 2 (Prompts) ── Task 3 (runStructuredTool) ── Task 4 (API Route)
                                                                                       │
Task 5 (SlideOver wide) ─────────────────────────────────────────────────────────────── │
Task 6 (RoomGrid) ──────────────────────────────────────────────────────────────────── │
                                                                                       │
Tasks 7-14 (Components) ── can parallelize after Tasks 1, 5, 6 ─────────────────────── │
                                                                                       │
Task 15 (Wire into step-results) ── depends on ALL above ─────────────────────────────┘
Task 16 (Verify) ── after Task 15
```

Tasks 7-14 (all 8 tool components) can be parallelized since they're independent files.
