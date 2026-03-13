"use client";

import { User, ThumbsUp, AlertTriangle, Lightbulb, Quote } from "lucide-react";
import type { PhilosopherCritique } from "@/types";

interface PhilosopherCritiqueViewProps {
  data: PhilosopherCritique;
}

export function PhilosopherCritiqueView({ data }: PhilosopherCritiqueViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
        <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-800">
          <User className="w-6 h-6" />
        </div>
        <div>
          <p className="font-bold text-stone-900 text-lg">{data.educator}</p>
          <p className="text-xs text-stone-500">Classroom Critique</p>
        </div>
      </div>

      <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <ThumbsUp className="w-4 h-4 text-emerald-700" />
          <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">What They Would Praise</p>
        </div>
        <p className="text-sm text-emerald-900 leading-relaxed">{data.praise}</p>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-amber-700" />
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide">What They Would Challenge</p>
        </div>
        <p className="text-sm text-amber-900 leading-relaxed">{data.challenge}</p>
      </div>

      <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-blue-700" />
          <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide">Their Suggestion</p>
        </div>
        <p className="text-sm text-blue-900 leading-relaxed">{data.suggestion}</p>
      </div>

      <div className="bg-stone-50 rounded-xl border border-stone-200 p-4">
        <div className="flex items-start gap-2">
          <Quote className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-stone-700 italic leading-relaxed">&ldquo;{data.quote}&rdquo;</p>
            <p className="text-xs text-stone-500 mt-2">&mdash; {data.quoteSource}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
