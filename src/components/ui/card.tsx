"use client";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-stone-200 shadow-sm ${
        hover
          ? "hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
