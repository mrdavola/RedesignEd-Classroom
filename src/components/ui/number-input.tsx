"use client";

import { Plus, Minus } from "lucide-react";

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function NumberInput({
  label,
  value,
  onChange,
  min = 0,
  max,
}: NumberInputProps) {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  const increment = () => {
    if (max === undefined || value < max) onChange(value + 1);
  };

  return (
    <div className="bg-stone-50 rounded-xl border border-stone-100 p-3">
      <span className="block text-xs font-medium text-stone-500 mb-2">
        {label}
      </span>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          className="flex items-center justify-center w-8 h-8 rounded-full border border-stone-200 bg-white text-stone-600 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="text-lg font-semibold text-stone-800 tabular-nums">
          {value}
        </span>
        <button
          type="button"
          onClick={increment}
          disabled={max !== undefined && value >= max}
          className="flex items-center justify-center w-8 h-8 rounded-full border border-stone-200 bg-white text-stone-600 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
