import { archetypes, statistics, philosophies } from "@/lib/research/data";
import {
  Flame,
  Droplets,
  Mountain,
  BookOpen,
  Users,
  Lightbulb,
  BarChart3,
  Palette,
} from "lucide-react";

const archetypeIcons: Record<string, React.ReactNode> = {
  Campfire: <Flame className="w-6 h-6" />,
  "Watering Hole": <Droplets className="w-6 h-6" />,
  Cave: <Mountain className="w-6 h-6" />,
};

const archetypeColors: Record<string, string> = {
  amber: "bg-amber-50 border-amber-200",
  blue: "bg-blue-50 border-blue-200",
  purple: "bg-purple-50 border-purple-200",
};

const philosophyIcons: Record<string, React.ReactNode> = {
  Shuffle: <Palette className="w-6 h-6" />,
  MessageCircle: <Users className="w-6 h-6" />,
  Heart: <Users className="w-6 h-6" />,
  Leaf: <Lightbulb className="w-6 h-6" />,
  Grid3x3: <BookOpen className="w-6 h-6" />,
  Wrench: <BarChart3 className="w-6 h-6" />,
};

const philosophyBgColors: Record<string, string> = {
  green: "bg-green-50 border-green-200",
  indigo: "bg-indigo-50 border-indigo-200",
  purple: "bg-purple-50 border-purple-200",
  amber: "bg-amber-50 border-amber-200",
  rose: "bg-rose-50 border-rose-200",
  blue: "bg-blue-50 border-blue-200",
};

const philosophyAccentColors: Record<string, string> = {
  green: "text-green-800",
  indigo: "text-indigo-800",
  purple: "text-purple-800",
  amber: "text-amber-800",
  rose: "text-rose-800",
  blue: "text-blue-800",
};

export default function LearningHubPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
      {/* Page header */}
      <div className="max-w-3xl mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-rose-950 tracking-tight mb-3">
          Learning Hub
        </h1>
        <p className="text-lg text-stone-600 leading-relaxed">
          The research behind every layout recommendation. Explore the
          frameworks, statistics, and teaching philosophies that power
          Classroom Redesigner.
        </p>
      </div>

      {/* Thornburg's Archetypes */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-stone-900 mb-2">
          Thornburg&apos;s Archetypes
        </h2>
        <p className="text-stone-600 mb-8 max-w-2xl">
          David Thornburg identified three primordial learning spaces that
          appear across every culture. Great classrooms weave all three
          together.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {archetypes.map((arch) => (
            <div
              key={arch.title}
              className={`rounded-2xl border p-6 ${
                archetypeColors[arch.color] ?? "bg-stone-50 border-stone-200"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                {archetypeIcons[arch.title] ?? (
                  <BookOpen className="w-6 h-6" />
                )}
                <div>
                  <h3 className="font-bold text-stone-900">{arch.title}</h3>
                  <p className="text-xs text-stone-500">{arch.subtitle}</p>
                </div>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed mb-4">
                {arch.description}
              </p>
              <div className="bg-white/60 rounded-xl p-3 border border-stone-200/50">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">
                  Design Implication
                </p>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {arch.designImplication}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The Research */}
      <section id="research" className="mb-16">
        <h2 className="text-2xl font-bold text-stone-900 mb-2">
          The Research
        </h2>
        <p className="text-stone-600 mb-8 max-w-2xl">
          Key findings from peer-reviewed studies and meta-analyses that
          inform our layout recommendations.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statistics.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6"
            >
              <p className="text-3xl font-extrabold text-rose-800 mb-1">
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-stone-900 mb-1">
                {stat.label}
              </p>
              <p className="text-xs text-stone-500 mb-4">
                {stat.source} ({stat.year})
              </p>
              <p className="text-sm text-stone-600 leading-relaxed">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Teaching Philosophies */}
      <section id="philosophies" className="mb-16">
        <h2 className="text-2xl font-bold text-stone-900 mb-2">
          Teaching Philosophies
        </h2>
        <p className="text-stone-600 mb-8 max-w-2xl">
          Six approaches to classroom design, each with distinct spatial
          requirements and research backing.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {philosophies.map((phil) => (
            <div
              key={phil.id}
              className={`rounded-2xl border p-6 ${
                philosophyBgColors[phil.color] ??
                "bg-stone-50 border-stone-200"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={
                    philosophyAccentColors[phil.color] ?? "text-stone-800"
                  }
                >
                  {philosophyIcons[phil.icon] ?? (
                    <BookOpen className="w-6 h-6" />
                  )}
                </div>
                <h3 className="font-bold text-stone-900 text-lg">
                  {phil.label}
                </h3>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed mb-4">
                {phil.shortDescription}
              </p>
              <div className="bg-white/60 rounded-xl p-4 border border-stone-200/50 mb-3">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">
                  Research
                </p>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {phil.researchHint}
                </p>
              </div>
              <div className="bg-white/60 rounded-xl p-4 border border-stone-200/50">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">
                  Layout Description
                </p>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {phil.layoutDescription}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
