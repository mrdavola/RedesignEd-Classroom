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
