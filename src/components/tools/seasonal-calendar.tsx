"use client";

import { useState } from "react";
import { Flame, Droplets, Mountain } from "lucide-react";
import type { SeasonalCalendar } from "@/types";

interface SeasonalCalendarViewProps {
  data: SeasonalCalendar;
}

const MONTHS = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const MONTH_NUMBERS = [8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6];

const archetypeIcons: Record<string, typeof Flame> = {
  Campfire: Flame, "Watering Hole": Droplets, Cave: Mountain,
};

const phaseColors = [
  "bg-amber-100 border-amber-300 text-amber-900",
  "bg-blue-100 border-blue-300 text-blue-900",
  "bg-purple-100 border-purple-300 text-purple-900",
  "bg-green-100 border-green-300 text-green-900",
  "bg-rose-100 border-rose-300 text-rose-900",
];

const barColors = ["#fbbf24", "#60a5fa", "#a78bfa", "#34d399", "#fb7185"];

function monthIndex(m: number): number {
  return MONTH_NUMBERS.indexOf(m);
}

export function SeasonalCalendarView({ data }: SeasonalCalendarViewProps) {
  const [selected, setSelected] = useState<number>(0);
  const currentMonth = new Date().getMonth() + 1;
  const SVG_W = 440;
  const SVG_H = 80;
  const colW = SVG_W / MONTHS.length;

  return (
    <div className="space-y-6">
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full">
        {MONTHS.map((label, i) => (
          <text key={label} x={i * colW + colW / 2} y={14} textAnchor="middle" fontSize={10}
            fill={MONTH_NUMBERS[i] === currentMonth ? "#be123c" : "#78716c"}
            fontWeight={MONTH_NUMBERS[i] === currentMonth ? 700 : 400}>{label}</text>
        ))}
        {MONTH_NUMBERS.includes(currentMonth) && (
          <line x1={monthIndex(currentMonth) * colW + colW / 2} y1={18}
            x2={monthIndex(currentMonth) * colW + colW / 2} y2={SVG_H - 4}
            stroke="#be123c" strokeWidth={1.5} strokeDasharray="3 3" />
        )}
        {data.phases.map((phase, i) => {
          const startIdx = monthIndex(phase.startMonth);
          const endIdx = monthIndex(phase.endMonth);
          if (startIdx === -1 || endIdx === -1) return null;
          const x = startIdx * colW + 2;
          const w = (endIdx - startIdx + 1) * colW - 4;
          const y = 24 + (i % 2) * 26;
          return (
            <g key={i} onClick={() => setSelected(i)} className="cursor-pointer">
              <rect x={x} y={y} width={Math.max(w, colW - 4)} height={22} rx={6}
                fill={barColors[i % barColors.length]} opacity={selected === i ? 0.9 : 0.5}
                stroke={selected === i ? "#44403c" : "none"} strokeWidth={1} />
              <text x={x + Math.max(w, colW - 4) / 2} y={y + 14} textAnchor="middle" fontSize={9} fontWeight={600} fill="#1c1917">
                {phase.name}
              </text>
            </g>
          );
        })}
      </svg>

      {data.phases[selected] && (
        <div className={`rounded-xl border p-5 ${phaseColors[selected % phaseColors.length]}`}>
          <div className="flex items-center gap-2 mb-3">
            {(() => { const Icon = archetypeIcons[data.phases[selected].archetype] ?? Flame; return <Icon className="w-5 h-5" />; })()}
            <h4 className="font-bold text-lg">{data.phases[selected].name}</h4>
          </div>
          <p className="text-sm mb-3">{data.phases[selected].focus}</p>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2 opacity-70">Furniture Moves</p>
          <ul className="space-y-1 mb-3">
            {data.phases[selected].moves.map((move, i) => (
              <li key={i} className="text-sm flex items-start gap-2"><span className="shrink-0">&bull;</span>{move}</li>
            ))}
          </ul>
          <p className="text-sm opacity-80 italic">{data.phases[selected].rationale}</p>
        </div>
      )}
    </div>
  );
}
