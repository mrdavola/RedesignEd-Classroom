"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { RoomGrid } from "@/components/ui/room-grid";
import type { SoundZonesData } from "@/types";

interface SoundZonesViewProps {
  data: SoundZonesData;
}

const SVG_SIZE = 400;
const GRID_SIZE = 10;
const CELL = SVG_SIZE / GRID_SIZE;

const zoneColors: Record<string, string> = {
  quiet: "rgba(59, 130, 246, 0.25)", moderate: "rgba(249, 115, 22, 0.25)", loud: "rgba(239, 68, 68, 0.3)",
};
const zoneBorders: Record<string, string> = {
  quiet: "#3b82f6", moderate: "#f97316", loud: "#ef4444",
};

export function SoundZonesView({ data }: SoundZonesViewProps) {
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const selected = data.zones.find((z) => z.id === selectedZone);

  return (
    <div className="space-y-4">
      <RoomGrid width={SVG_SIZE} height={SVG_SIZE} gridSize={GRID_SIZE}>
        {data.zones.map((zone) => (
          <g key={zone.id} onClick={() => setSelectedZone(zone.id)} className="cursor-pointer">
            <rect x={zone.x * CELL} y={zone.y * CELL} width={zone.width * CELL} height={zone.height * CELL}
              fill={zoneColors[zone.type]} stroke={zoneBorders[zone.type]}
              strokeWidth={selectedZone === zone.id ? 2.5 : 1} rx={4} />
            <text x={zone.x * CELL + (zone.width * CELL) / 2} y={zone.y * CELL + (zone.height * CELL) / 2 - 4}
              textAnchor="middle" fontSize={10} fontWeight={600} fill="#1c1917">{zone.type}</text>
            <text x={zone.x * CELL + (zone.width * CELL) / 2} y={zone.y * CELL + (zone.height * CELL) / 2 + 10}
              textAnchor="middle" fontSize={8} fill="#57534e">{zone.dbEstimate}</text>
          </g>
        ))}
        {data.lombardRisks.map((risk, i) => (
          <g key={`lom-${i}`}>
            <circle cx={risk.x * CELL + CELL / 2} cy={risk.y * CELL + CELL / 2} r={12} fill="#fef3c7" stroke="#f59e0b" strokeWidth={1.5} />
            <text x={risk.x * CELL + CELL / 2} y={risk.y * CELL + CELL / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#d97706">L</text>
          </g>
        ))}
      </RoomGrid>

      <div className="flex items-center gap-4 text-xs text-stone-500">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm" style={{ background: zoneColors.quiet }} />Quiet</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm" style={{ background: zoneColors.moderate }} />Moderate</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm" style={{ background: zoneColors.loud }} />Loud</div>
        <div className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-amber-500" />Lombard Risk</div>
      </div>

      <p className="text-sm text-stone-600 leading-relaxed">{data.overallAssessment}</p>

      {selected && (
        <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-stone-900">{selected.description}</h4>
            <span className="text-xs font-medium text-stone-500">{selected.dbEstimate}</span>
          </div>
          {selected.interventions.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">Suggested Interventions</p>
              <ul className="space-y-1">
                {selected.interventions.map((int, i) => (
                  <li key={i} className="text-sm text-stone-600 flex items-start gap-2"><span className="shrink-0">&bull;</span>{int}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {data.lombardRisks.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">Lombard Effect Risks</p>
          {data.lombardRisks.map((risk, i) => (
            <div key={i} className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 mb-2">{risk.description}</div>
          ))}
        </div>
      )}
    </div>
  );
}
