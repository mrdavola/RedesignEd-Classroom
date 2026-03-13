import Link from "next/link";
import {
  Camera,
  Palette,
  Lightbulb,
  FileText,
  GraduationCap,
  ArrowRight,
  BarChart3,
  BookOpen,
  Users,
} from "lucide-react";
import { statistics, philosophies } from "@/lib/research/data";

const philosophyIcons: Record<string, React.ReactNode> = {
  Shuffle: <Palette className="w-5 h-5" />,
  MessageCircle: <Users className="w-5 h-5" />,
  Heart: <Users className="w-5 h-5" />,
  Leaf: <Lightbulb className="w-5 h-5" />,
  Grid3x3: <BookOpen className="w-5 h-5" />,
  Wrench: <BarChart3 className="w-5 h-5" />,
};

const philosophyColors: Record<string, string> = {
  green: "bg-green-50 border-green-200 text-green-900",
  indigo: "bg-indigo-50 border-indigo-200 text-indigo-900",
  purple: "bg-purple-50 border-purple-200 text-purple-900",
  amber: "bg-amber-50 border-amber-200 text-amber-900",
  rose: "bg-rose-50 border-rose-200 text-rose-900",
  blue: "bg-blue-50 border-blue-200 text-blue-900",
};

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-3xl mx-auto text-center">
          <span className="bg-rose-100 text-rose-900 rounded-full text-xs font-bold uppercase tracking-wide border border-rose-200 px-3 py-1 inline-block mb-6">
            Professional Development Tool
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-rose-950 tracking-tight leading-tight mb-6">
            Redesign your classroom with research, not guesswork
          </h1>
          <p className="text-lg md:text-xl text-stone-600 mb-10 leading-relaxed">
            Upload a photo of your room, describe your teaching style, and get
            AI-generated layout options grounded in Thornburg, Hattie, and
            Universal Design for Learning.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/redesign"
              className="inline-flex items-center justify-center rounded-xl font-medium bg-rose-800 text-white hover:bg-rose-900 transition-colors px-6 py-3 text-lg"
            >
              Start Redesigning
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/learning-hub"
              className="inline-flex items-center justify-center rounded-xl font-medium bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors px-6 py-3 text-lg"
            >
              Learn the Research
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: <Camera className="w-6 h-6" />,
                title: "Upload Your Space",
                description:
                  "Take a photo of your classroom. Our AI scans it to count desks, chairs, shelves, and more.",
              },
              {
                icon: <Palette className="w-6 h-6" />,
                title: "Describe Your Style",
                description:
                  "Choose your teaching philosophy, learner profile, and goals. From Socratic seminars to maker spaces.",
              },
              {
                icon: <Lightbulb className="w-6 h-6" />,
                title: "Get Your Redesign",
                description:
                  "Receive three research-backed layout options with AI-generated visuals and implementation guides.",
              },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto mb-4 text-rose-800">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-stone-900 text-center mb-12">
          What You Get
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Camera className="w-6 h-6" />,
              title: "AI Room Analysis",
              description:
                "Upload a photo and our AI identifies every piece of furniture in your room. No manual counting needed.",
            },
            {
              icon: <GraduationCap className="w-6 h-6" />,
              title: "Research-Backed Layouts",
              description:
                "Every suggestion is grounded in Thornburg's archetypes, Hattie's effect sizes, and UDL principles.",
            },
            {
              icon: <FileText className="w-6 h-6" />,
              title: "Power-Up Tools",
              description:
                "Generate grant proposals, adapt lesson plans, and create classroom management scripts — all contextual to your layout.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center mb-4 text-rose-800">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Research Stats */}
      <section className="bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900 text-center mb-4">
            Grounded in Research
          </h2>
          <p className="text-stone-600 text-center mb-12 max-w-2xl mx-auto">
            Every layout suggestion is backed by peer-reviewed research and
            real-world classroom studies.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {statistics.map((stat) => (
              <div
                key={stat.label}
                className="bg-stone-50 rounded-2xl border border-stone-200 p-6 text-center"
              >
                <p className="text-3xl font-extrabold text-rose-800 mb-2">
                  {stat.value}
                </p>
                <p className="text-sm font-semibold text-stone-900 mb-1">
                  {stat.label}
                </p>
                <p className="text-xs text-stone-500">
                  {stat.source} ({stat.year})
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Preview */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-stone-900 text-center mb-4">
          Built for Every Teaching Style
        </h2>
        <p className="text-stone-600 text-center mb-12 max-w-2xl mx-auto">
          Six research-backed philosophies, each with tailored layout
          recommendations.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {philosophies.map((phil) => (
            <Link
              key={phil.id}
              href="/learning-hub#philosophies"
              className={`rounded-2xl border p-5 transition-all hover:shadow-md hover:-translate-y-0.5 ${
                philosophyColors[phil.color] ?? "bg-stone-50 border-stone-200 text-stone-900"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {philosophyIcons[phil.icon] ?? <BookOpen className="w-5 h-5" />}
                <h3 className="font-semibold">{phil.label}</h3>
              </div>
              <p className="text-sm opacity-80 leading-relaxed">
                {phil.shortDescription}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Quote Block */}
      <section className="bg-rose-50 border-y border-rose-200">
        <div className="max-w-3xl mx-auto px-4 py-16 md:py-20 text-center">
          <blockquote className="text-xl md:text-2xl font-medium text-rose-950 leading-relaxed mb-4">
            &ldquo;Design for the margins, not the average. When we design
            learning spaces for students with the most complex needs, every
            learner benefits.&rdquo;
          </blockquote>
          <cite className="text-sm text-rose-800 not-italic font-medium">
            Universal Design for Learning (UDL) Principle
          </cite>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
          Ready to reimagine your space?
        </h2>
        <p className="text-stone-600 mb-8 max-w-xl mx-auto">
          It takes about three minutes. Upload a photo, describe your teaching
          style, and get research-backed layouts you can implement tomorrow.
        </p>
        <Link
          href="/redesign"
          className="inline-flex items-center justify-center rounded-xl font-medium bg-rose-800 text-white hover:bg-rose-900 transition-colors px-8 py-4 text-lg"
        >
          Start Redesigning
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </section>
    </div>
  );
}
