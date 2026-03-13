"use client";

import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-stone-200 pb-6">
      <div className="flex flex-col gap-1">
        <span className="bg-rose-100 text-rose-900 rounded-full text-xs font-bold uppercase tracking-wide border border-rose-200 px-3 py-0.5 w-fit">
          Professional Development Tool
        </span>
        <h1 className="text-4xl font-extrabold text-rose-950 tracking-tight">
          Classroom Redesigner
        </h1>
        <p className="text-stone-600 text-sm font-medium">
          Align physical space with pedagogical goals.
        </p>
      </div>

      <div>
        <Button
          variant="secondary"
          onClick={() => console.log("Research Guide clicked")}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Research Guide
        </Button>
      </div>
    </header>
  );
}
