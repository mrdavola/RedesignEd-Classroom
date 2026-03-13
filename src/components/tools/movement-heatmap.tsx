"use client";

import { useState } from "react";
import { RoomGrid } from "@/components/ui/room-grid";
import type { MovementHeatmapData } from "@/types";

interface MovementHeatmapViewProps {
  data: MovementHeatmapData;
}

function intensityColor(value: number): string {
  if (value < 0.25) return "rgba(34, 197, 94, 0.3)";
  if (value < 0.5) return "rgba(234, 179, 8, 0.4)";
  if (value < 0.75) return "rgba(249, 115, 22, 0.5)";
  return "rgba(239, 68, 68, 0.6)";
}

const SVG_SIZE = 400;
const GRID_SIZE = 10;
const CELL = SVG_SIZE / GRID_SIZE;

export function MovementHeatmapView({ data }: MovementHeatmapViewProps) {
  const [hoveredBottleneck, setHoveredBottleneck] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <RoomGrid width={SVG_SIZE} height={SVG_SIZE} gridSize={GRID_SIZE}>
        {data.grid.map((row, y) =>
          row.map((value, x) => (
            <rect key={`${x}-${y}`} x={x * CELL} y={y * CELL} width={CELL} height={CELL} fill={intensityColor(value)} />
          )),
        )}
        {data.teacherPath.length > 1 && (
          <polyline
            points={data.teacherPath.map((p) => `${p.x * CELL + CELL / 2},${p.y * CELL + CELL / 2}`).join(" ")}
            fill="none" stroke="#7c3aed" strokeWidth={2} strokeDasharray="6 4" strokeLinecap="round"
          />
        )}
        {data.studentFlows.map((flow, i) => (
          <line key={`flow-${i}`}
            x1={flow.from.x * CELL + CELL / 2} y1={flow.from.y * CELL + CELL / 2}
            x2={flow.to.x * CELL + CELL / 2} y2={flow.to.y * CELL + CELL / 2}
            stroke="#3b82f6" strokeWidth={Math.max(1, flow.intensity * 3)} strokeOpacity={0.6} markerEnd="url(#arrowhead)"
          />
        ))}
        <defs>
          <marker id="arrowhead" markerWidth={8} markerHeight={6} refX={8} refY={3} orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#3b82f6" />
          </marker>
        </defs>
        {data.bottlenecks.map((bn, i) => (
          <g key={`bn-${i}`} onMouseEnter={() => setHoveredBottleneck(i)} onMouseLeave={() => setHoveredBottleneck(null)} className="cursor-pointer">
            <circle cx={bn.x * CELL + CELL / 2} cy={bn.y * CELL + CELL / 2} r={8} fill="#ef4444" opacity={0.8}>
              <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
            </circle>
            <text x={bn.x * CELL + CELL / 2} y={bn.y * CELL + CELL / 2 + 3} textAnchor="middle" fontSize={9} fontWeight={700} fill="white">!</text>
          </g>
        ))}
      </RoomGrid>

      <div className="flex items-center gap-4 text-xs text-stone-500">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm" style={{ background: "rgba(34, 197, 94, 0.3)" }} />Low</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm" style={{ background: "rgba(234, 179, 8, 0.4)" }} />Medium</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm" style={{ background: "rgba(239, 68, 68, 0.6)" }} />High</div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Bottlenecks</p>
        {data.bottlenecks.map((bn, i) => (
          <div key={i} className={`rounded-lg border p-3 text-sm transition-colors ${hoveredBottleneck === i ? "border-red-300 bg-red-50" : "border-stone-200 bg-white"}`}>
            <p className="font-medium text-stone-900">{bn.description}</p>
            <p className="text-stone-500 mt-1">Fix: {bn.fix}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
