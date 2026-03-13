"use client";

import { useState } from "react";
import { RoomGrid, RoomFeature } from "@/components/ui/room-grid";
import type { SeatPerspective } from "@/types";

interface SeatPerspectiveViewProps {
  data: SeatPerspective;
}

const SVG_SIZE = 400;
const GRID_SIZE = 10;
const CELL = SVG_SIZE / GRID_SIZE;

function seatColor(seat: SeatPerspective["seats"][0]): string {
  const scores = Object.values(seat.udlProfile);
  const goods = scores.filter((s) => s === "good").length;
  if (goods >= 2) return "#22c55e";
  if (goods >= 1) return "#eab308";
  return "#ef4444";
}

function sightlineStroke(status: "clear" | "partial" | "blocked"): { dash: string; opacity: number } {
  if (status === "clear") return { dash: "none", opacity: 0.6 };
  if (status === "partial") return { dash: "4 4", opacity: 0.4 };
  return { dash: "2 2", opacity: 0 };
}

export function SeatPerspectiveView({ data }: SeatPerspectiveViewProps) {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const selected = data.seats.find((s) => s.id === selectedSeat);

  return (
    <div className="space-y-4">
      <RoomGrid width={SVG_SIZE} height={SVG_SIZE} gridSize={GRID_SIZE}>
        {data.roomFeatures.map((feat, i) => (
          <RoomFeature key={i} x={feat.x} y={feat.y} type={feat.type} gridSize={GRID_SIZE} svgSize={SVG_SIZE} />
        ))}
        {selected && data.roomFeatures.map((feat, i) => {
          const key = feat.type as keyof typeof selected.sightlines;
          const status = selected.sightlines[key];
          if (!status) return null;
          const { dash, opacity } = sightlineStroke(status);
          if (opacity === 0) return null;
          return (
            <line key={`sight-${i}`}
              x1={selected.x * CELL + CELL / 2} y1={selected.y * CELL + CELL / 2}
              x2={feat.x * CELL + CELL / 2} y2={feat.y * CELL + CELL / 2}
              stroke="#78716c" strokeWidth={1.5} strokeDasharray={dash} opacity={opacity} />
          );
        })}
        {data.seats.map((seat) => (
          <g key={seat.id} onClick={() => setSelectedSeat(seat.id)} className="cursor-pointer">
            <circle cx={seat.x * CELL + CELL / 2} cy={seat.y * CELL + CELL / 2}
              r={selectedSeat === seat.id ? 10 : 7} fill={seatColor(seat)}
              stroke={selectedSeat === seat.id ? "#1c1917" : "none"} strokeWidth={2} opacity={0.8} />
            <text x={seat.x * CELL + CELL / 2} y={seat.y * CELL + CELL / 2 + 3}
              textAnchor="middle" fontSize={8} fontWeight={600} fill="white">{seat.id}</text>
          </g>
        ))}
      </RoomGrid>

      <div className="flex items-center gap-4 text-xs text-stone-500">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500" />Good UDL</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-yellow-500" />Fair</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500" />Needs attention</div>
      </div>

      {selected ? (
        <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-stone-900">Seat {selected.id}</h4>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              selected.distractionProximity === "low" ? "bg-green-100 text-green-800" :
              selected.distractionProximity === "medium" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
            }`}>Distraction: {selected.distractionProximity}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(selected.sightlines) as [string, string][]).map(([key, val]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-stone-500 capitalize">{key.replace("_", " ")}</span>
                <span className={`font-medium ${val === "clear" ? "text-green-700" : val === "partial" ? "text-amber-700" : "text-red-700"}`}>{val}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">UDL Profile</p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(selected.udlProfile) as [string, string][]).map(([key, val]) => (
                <div key={key} className="text-center">
                  <p className="text-xs text-stone-500 capitalize">{key}</p>
                  <p className={`text-sm font-medium ${val === "good" ? "text-green-700" : val === "fair" ? "text-amber-700" : "text-red-700"}`}>{val}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-stone-600">{selected.suggestedFor}</p>
          <p className="text-xs text-stone-400 italic">{selected.notes}</p>
        </div>
      ) : (
        <p className="text-sm text-stone-400 text-center">Click a seat to see its perspective analysis</p>
      )}
    </div>
  );
}
