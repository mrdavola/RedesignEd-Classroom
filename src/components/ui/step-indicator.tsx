"use client";

import { motion } from "framer-motion";
import {
  Check,
  Camera,
  Package,
  Users,
  Lightbulb,
  Target,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

interface Step {
  label: string;
  icon: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const iconMap: Record<string, LucideIcon> = {
  Camera,
  Package,
  Users,
  Lightbulb,
  Target,
  Sparkles,
  Check,
};

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center w-full">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = onStepClick && (isCompleted || isCurrent);
        const Icon = isCompleted
          ? Check
          : iconMap[step.icon] ?? Camera;

        return (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            {/* Step circle */}
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick(index)}
              className={`flex flex-col items-center ${isClickable ? "cursor-pointer" : "cursor-default"}`}
            >
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted
                    ? "rgb(228 201 201)" // rose-200 approx
                    : isCurrent
                    ? "rgb(158 47 47)" // rose-700 approx
                    : "transparent",
                  borderColor: isCompleted
                    ? "rgb(228 201 201)"
                    : isCurrent
                    ? "rgb(158 47 47)"
                    : "rgb(214 211 209)", // stone-300
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center w-10 h-10 rounded-full border-2"
              >
                <Icon
                  className={`w-5 h-5 ${
                    isCompleted
                      ? "text-rose-800"
                      : isCurrent
                      ? "text-white"
                      : "text-stone-400"
                  }`}
                />
              </motion.div>
              <span
                className={`mt-1.5 text-xs font-medium whitespace-nowrap ${
                  isCurrent ? "text-rose-800" : "text-stone-400"
                }`}
              >
                {step.label}
              </span>
            </button>

            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 bg-stone-200 relative self-start mt-5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: isCompleted ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-y-0 left-0 bg-rose-200"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
