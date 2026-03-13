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
