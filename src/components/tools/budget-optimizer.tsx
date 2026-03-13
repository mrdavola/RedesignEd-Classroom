"use client";

import type { BudgetOptimizer } from "@/types";

interface BudgetOptimizerViewProps {
  data: BudgetOptimizer;
}

export function BudgetOptimizerView({ data }: BudgetOptimizerViewProps) {
  const maxImpact = Math.max(...data.recommendations.map((r) => r.impactScore));

  return (
    <div className="space-y-6">
      <p className="text-sm text-stone-600 leading-relaxed">{data.summary}</p>
      <div className="space-y-4">
        {data.recommendations.map((item, i) => (
          <div key={i} className={`rounded-xl border p-4 ${i === 0 ? "border-rose-200 bg-rose-50" : "border-stone-200 bg-white"}`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-400">#{item.rank}</span>
                  <h4 className="font-semibold text-stone-900">{item.name}</h4>
                </div>
                <p className="text-sm font-medium text-rose-800 mt-0.5">${item.cost}</p>
              </div>
              <span className="text-2xl font-extrabold text-rose-800">{item.impactScore}</span>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-xs text-stone-500 mb-1">
                <span>Impact Score</span><span>{item.impactScore}/100</span>
              </div>
              <svg viewBox="0 0 200 12" className="w-full">
                <rect x={0} y={0} width={200} height={12} rx={6} fill="#f5f5f4" />
                <rect x={0} y={0} width={(item.impactScore / maxImpact) * 200} height={12} rx={6} fill={i === 0 ? "#be123c" : "#78716c"} />
              </svg>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed mb-2">{item.rationale}</p>
            <p className="text-xs text-stone-400 italic">{item.researchSource}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-stone-200">
        <span className="text-sm font-medium text-stone-500">Total</span>
        <span className="text-lg font-bold text-stone-900">${data.recommendations.reduce((sum, r) => sum + r.cost, 0)}</span>
      </div>
    </div>
  );
}
