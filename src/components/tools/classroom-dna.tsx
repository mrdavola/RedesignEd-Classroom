"use client";

import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from "recharts";
import type { ClassroomDNA } from "@/types";

interface ClassroomDnaViewProps {
  data: ClassroomDNA;
}

export function ClassroomDnaView({ data }: ClassroomDnaViewProps) {
  const arch = data.archetypes ?? { campfire: 0, wateringHole: 0, cave: 0 };
  const sens = data.sensory ?? { stimulation: 0, predictability: 0, movementFreedom: 0 };
  const radarData = [
    { axis: "Campfire", value: arch.campfire ?? 0 },
    { axis: "Watering Hole", value: arch.wateringHole ?? 0 },
    { axis: "Cave", value: arch.cave ?? 0 },
    { axis: "Stimulation", value: sens.stimulation ?? 0 },
    { axis: "Predictability", value: sens.predictability ?? 0 },
    { axis: "Movement", value: sens.movementFreedom ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">Classroom Personality</p>
        <p className="text-2xl font-extrabold text-rose-950">{data.personality}</p>
      </div>

      <div className="w-full" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e7e5e4" />
            <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: "#57534e" }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: "#a8a29e" }} />
            <Radar dataKey="value" stroke="#be123c" fill="#be123c" fillOpacity={0.2} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-sm text-stone-600 leading-relaxed">{data.summary}</p>

      <div>
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">Philosophy Alignment</p>
        <div className="space-y-2">
          {data.philosophyAlignment.map((item) => (
            <div key={item.philosophy} className="flex items-center gap-3">
              <span className="text-xs text-stone-600 w-32 shrink-0">{item.philosophy}</span>
              <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-600 rounded-full transition-all" style={{ width: `${item.percentage}%` }} />
              </div>
              <span className="text-xs font-medium text-stone-700 w-8 text-right">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
