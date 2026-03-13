"use client";

import { type ReactNode } from "react";

interface RoomGridProps {
  width?: number;
  height?: number;
  gridSize?: number;
  children?: ReactNode;
  onCellClick?: (x: number, y: number) => void;
  className?: string;
}

export function RoomGrid({
  width = 400,
  height = 400,
  gridSize = 10,
  children,
  onCellClick,
  className = "",
}: RoomGridProps) {
  const cellW = width / gridSize;
  const cellH = height / gridSize;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`w-full ${className}`}
      style={{ maxHeight: height }}
    >
      {Array.from({ length: gridSize + 1 }).map((_, i) => (
        <g key={i}>
          <line x1={i * cellW} y1={0} x2={i * cellW} y2={height} stroke="#e7e5e4" strokeWidth={0.5} />
          <line x1={0} y1={i * cellH} x2={width} y2={i * cellH} stroke="#e7e5e4" strokeWidth={0.5} />
        </g>
      ))}

      <rect x={0} y={0} width={width} height={height} fill="none" stroke="#a8a29e" strokeWidth={2} rx={4} />

      {onCellClick &&
        Array.from({ length: gridSize * gridSize }).map((_, idx) => {
          const x = idx % gridSize;
          const y = Math.floor(idx / gridSize);
          return (
            <rect
              key={`click-${idx}`}
              x={x * cellW}
              y={y * cellH}
              width={cellW}
              height={cellH}
              fill="transparent"
              className="cursor-pointer"
              onClick={() => onCellClick(x, y)}
            />
          );
        })}

      {children}
    </svg>
  );
}

export function RoomFeature({
  x, y, type, gridSize = 10, svgSize = 400,
}: {
  x: number; y: number; type: string; gridSize?: number; svgSize?: number;
}) {
  const cellSize = svgSize / gridSize;
  const cx = x * cellSize + cellSize / 2;
  const cy = y * cellSize + cellSize / 2;

  const labels: Record<string, string> = {
    board: "B", teacher_desk: "T", door: "D", window: "W",
  };

  return (
    <g>
      <rect x={cx - 10} y={cy - 10} width={20} height={20} rx={4} fill="#fafaf9" stroke="#78716c" strokeWidth={1.5} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={10} fontWeight={600} fill="#44403c">
        {labels[type] ?? "?"}
      </text>
    </g>
  );
}
