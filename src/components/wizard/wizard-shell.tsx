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
  { label: "Inventory", icon: "Package" },
  { label: "Teaching", icon: "Lightbulb" },
  { label: "Redesign", icon: "Sparkles" },
];

const stepComponents = [StepUpload, StepInventory, StepTeachingStyle, StepResults];

export function WizardShell() {
  const { state, goToStep } = useWizard();
  const StepComponent = stepComponents[state.step] ?? StepUpload;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 px-4">
        <StepIndicator steps={steps} currentStep={state.step} onStepClick={goToStep} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={state.step}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <StepComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
