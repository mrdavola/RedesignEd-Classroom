"use client";

import { motion } from "framer-motion";

interface PillOption {
  value: string;
  label: string;
}

interface PillSelectorProps {
  options: PillOption[];
  value: string;
  onChange: (value: string) => void;
}

export function PillSelector({ options, value, onChange }: PillSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isActive
                ? "text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="pill-indicator"
                className="absolute inset-0 bg-rose-800 rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
