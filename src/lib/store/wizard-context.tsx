"use client";
import { createContext, useContext, useRef, useCallback, ReactNode } from "react";
import { useLocalStorage } from "./use-local-storage";
import { WizardState, Inventory, AnalysisResult } from "@/types";

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
  const [persisted, setPersisted] = useLocalStorage<Omit<WizardState, "image">>(
    "wizard-state",
    { step: 0, inventory: DEFAULT_INVENTORY, learnerProfile: "UPK", philosophy: "Flexible", goals: "" },
  );
  const [result, setResult] = useLocalStorage<AnalysisResult | null>("wizard-result", null);

  // Keep the image in memory only — it's too large for localStorage
  const imageRef = useRef<string | null>(null);

  const state: WizardState = { ...persisted, image: imageRef.current };

  const setState = useCallback(
    (value: WizardState | ((prev: WizardState) => WizardState)) => {
      setPersisted((prev) => {
        const full: WizardState = { ...prev, image: imageRef.current };
        const next = value instanceof Function ? value(full) : value;
        imageRef.current = next.image;
        // Strip image before persisting to localStorage
        const { image: _, ...rest } = next;
        return rest as Omit<WizardState, "image">;
      });
    },
    [setPersisted],
  );

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
