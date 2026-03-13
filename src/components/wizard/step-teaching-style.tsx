"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Shuffle,
  MessageCircle,
  Heart,
  Leaf,
  Grid3x3,
  Wrench,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { useWizard } from "@/lib/store/wizard-context";
import { Button } from "@/components/ui/button";
import { PillSelector } from "@/components/ui/pill-selector";
import {
  philosophies,
  learnerProfiles,
} from "@/lib/research/data";
import type { LearnerProfile, Philosophy, AnalysisResult } from "@/types";

const iconMap: Record<string, LucideIcon> = {
  Shuffle,
  MessageCircle,
  Heart,
  Leaf,
  Grid3x3,
  Wrench,
};

const colorMap: Record<string, { border: string; bg: string; text: string; accent: string }> = {
  green: { border: "border-green-300", bg: "bg-green-50", text: "text-green-700", accent: "bg-green-500" },
  indigo: { border: "border-indigo-300", bg: "bg-indigo-50", text: "text-indigo-700", accent: "bg-indigo-500" },
  purple: { border: "border-purple-300", bg: "bg-purple-50", text: "text-purple-700", accent: "bg-purple-500" },
  amber: { border: "border-amber-300", bg: "bg-amber-50", text: "text-amber-700", accent: "bg-amber-500" },
  rose: { border: "border-rose-300", bg: "bg-rose-50", text: "text-rose-700", accent: "bg-rose-500" },
  blue: { border: "border-blue-300", bg: "bg-blue-50", text: "text-blue-700", accent: "bg-blue-500" },
};

export function StepTeachingStyle() {
  const { state, setState, setResult, nextStep, prevStep } = useWizard();
  const [loading, setLoading] = useState(false);

  const learnerOptions = learnerProfiles.map((lp) => ({
    value: lp.id,
    label: lp.id,
  }));

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      const data: AnalysisResult = await res.json();
      setResult(data);
      nextStep();
    } catch {
      // Allow retry on failure
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Learner Profile */}
      <section>
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">
          Learner Profile
        </h3>
        <PillSelector
          options={learnerOptions}
          value={state.learnerProfile}
          onChange={(v) =>
            setState((prev) => ({ ...prev, learnerProfile: v as LearnerProfile }))
          }
        />
      </section>

      {/* Philosophy */}
      <section>
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">
          Teaching Philosophy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {philosophies.map((p) => {
            const isActive = state.philosophy === p.id;
            const colors = colorMap[p.color] ?? colorMap.green;
            const Icon = iconMap[p.icon] ?? Shuffle;

            return (
              <div key={p.id}>
                <button
                  type="button"
                  onClick={() =>
                    setState((prev) => ({ ...prev, philosophy: p.id as Philosophy }))
                  }
                  className={`w-full text-left rounded-xl border-2 p-4 transition-colors ${
                    isActive
                      ? `${colors.border} ${colors.bg}`
                      : "border-stone-200 bg-white hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`shrink-0 w-1 h-10 rounded-full ${colors.accent}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${colors.text}`} />
                        <span className="font-semibold text-stone-900 text-sm">
                          {p.label}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        {p.shortDescription}
                      </p>
                    </div>
                  </div>
                </button>

                {/* Research hint */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div
                        className={`mt-2 rounded-lg ${colors.bg} px-4 py-3 text-xs ${colors.text} leading-relaxed`}
                      >
                        {p.researchHint}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Goals */}
      <section>
        <label
          htmlFor="goals"
          className="block text-sm font-semibold text-stone-700 uppercase tracking-wide mb-2"
        >
          Pedagogical Goals &amp; Constraints
        </label>
        <textarea
          id="goals"
          rows={3}
          placeholder="e.g., I have 4 students who trigger each other..."
          value={state.goals}
          onChange={(e) =>
            setState((prev) => ({ ...prev, goals: e.target.value }))
          }
          className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-800 focus:border-transparent resize-none"
        />
      </section>

      {/* Navigation */}
      <div className="flex justify-between pt-2">
        <Button variant="secondary" onClick={prevStep}>
          Back
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Research-Backed Layouts"
          )}
        </Button>
      </div>
    </div>
  );
}
