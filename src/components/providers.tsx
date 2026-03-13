"use client";
import { WizardProvider } from "@/lib/store/wizard-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <WizardProvider>{children}</WizardProvider>;
}
