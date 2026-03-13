# Full Website Buildout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the single-page wizard into a multi-page website with persistent navigation, marketing homepage, footer, Learning Hub, and Dashboard.

**Architecture:** Next.js App Router with 4 routes (`/`, `/redesign`, `/learning-hub`, `/dashboard`). Persistent `SiteHeader` and `SiteFooter` live in the root layout. The existing wizard moves to `/redesign` untouched. New pages are server components where possible, with `"use client"` only for interactive parts (mobile nav toggle, dashboard localStorage reads).

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS 4, Framer Motion, Lucide React, existing `data.ts` research data.

**Design doc:** `docs/plans/2026-03-12-full-website-buildout-design.md`

**Key constraints from design doc:**
- No emojis anywhere — use Lucide icons
- No heavy gradients — subtle background washes only
- Rose/stone palette, Inter font
- Warm professional aesthetic

---

### Task 1: Create SiteHeader component

**Files:**
- Create: `src/components/layout/site-header.tsx`

**Step 1: Create the site header**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/learning-hub", label: "Learning Hub" },
  { href: "/dashboard", label: "Dashboard" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-stone-50/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-extrabold text-rose-950 tracking-tight">
            Classroom Redesigner
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-rose-800"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <Link
          href="/redesign"
          className="hidden md:inline-flex items-center justify-center rounded-xl font-medium transition-colors bg-rose-800 text-white hover:bg-rose-900 px-4 py-2 text-sm"
        >
          Start Redesigning
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-stone-600 hover:text-stone-900"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-stone-200 bg-stone-50 px-4 pb-4">
          <nav className="flex flex-col gap-2 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                  pathname === link.href
                    ? "text-rose-800 bg-rose-50"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/redesign"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-xl font-medium bg-rose-800 text-white hover:bg-rose-900 px-4 py-2 text-sm"
            >
              Start Redesigning
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/layout/site-header.tsx
git commit -m "feat: add persistent site header with responsive nav"
```

---

### Task 2: Create SiteFooter component

**Files:**
- Create: `src/components/layout/site-footer.tsx`

**Step 1: Create the footer**

```tsx
import Link from "next/link";

const productLinks = [
  { href: "/", label: "Home" },
  { href: "/redesign", label: "Redesign Tool" },
  { href: "/dashboard", label: "Dashboard" },
];

const learnLinks = [
  { href: "/learning-hub", label: "Learning Hub" },
  { href: "/learning-hub#research", label: "The Research" },
  { href: "/learning-hub#philosophies", label: "Teaching Philosophies" },
];

export function SiteFooter() {
  return (
    <footer className="bg-stone-100 border-t border-stone-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wide mb-3">
              Product
            </h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wide mb-3">
              Learn
            </h3>
            <ul className="space-y-2">
              {learnLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wide mb-3">
              About
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Built with research from Hattie, Thornburg, and MIT TEAL.
              Classroom Redesigner helps educators align physical space with
              pedagogical goals.
            </p>
          </div>
        </div>

        <div className="border-t border-stone-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-stone-500">
            Built for educators.
          </p>
          <p className="text-xs text-stone-400">
            &copy; {new Date().getFullYear()} Classroom Redesigner
          </p>
        </div>
      </div>
    </footer>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/layout/site-footer.tsx
git commit -m "feat: add site footer with links and research credits"
```

---

### Task 3: Update root layout to include SiteHeader and SiteFooter

**Files:**
- Modify: `src/app/layout.tsx`

**Step 1: Update the root layout**

Replace the current `layout.tsx` content with:

```tsx
import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Classroom Redesigner",
  description: "Align physical space with pedagogical goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-stone-50 min-h-screen text-stone-900 antialiased flex flex-col">
        <Providers>
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
```

Key changes: added `flex flex-col` to body, wrapped children in `flex-1` div, added SiteHeader above and SiteFooter below.

**Step 2: Verify the app still builds**

Run: `npx next build`
Expected: Successful build (may show warnings, no errors)

**Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: add site header and footer to root layout"
```

---

### Task 4: Move wizard to /redesign route

**Files:**
- Create: `src/app/redesign/page.tsx`
- Modify: `src/app/page.tsx` (will be replaced in Task 5)

**Step 1: Create the /redesign page**

This is the existing `page.tsx` content moved to a new route. It keeps the wizard-specific `Header` component as a sub-header.

```tsx
import { Header } from "@/components/layout/header";
import { WizardShell } from "@/components/wizard/wizard-shell";

export default function RedesignPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      <Header />
      <main className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px] border border-stone-100">
        <WizardShell />
      </main>
    </div>
  );
}
```

**Step 2: Verify `/redesign` works**

Run: `npx next dev` and navigate to `http://localhost:3000/redesign`
Expected: The wizard displays exactly as it did on the homepage, with the site header above it.

**Step 3: Commit**

```bash
git add src/app/redesign/page.tsx
git commit -m "feat: move wizard tool to /redesign route"
```

---

### Task 5: Build the homepage

**Files:**
- Modify: `src/app/page.tsx` (full rewrite)

**Step 1: Replace page.tsx with the marketing homepage**

The homepage imports research data from `src/lib/research/data.ts` (the `statistics`, `philosophies`, and `archetypes` arrays) to avoid duplicating content. It's a server component — no `"use client"` needed.

```tsx
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
```

**Step 2: Verify homepage and /redesign both work**

Run: `npx next dev`
- Navigate to `http://localhost:3000` — should show marketing homepage
- Navigate to `http://localhost:3000/redesign` — should show the wizard

**Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add marketing homepage with hero, features, research stats, and CTAs"
```

---

### Task 6: Build the Learning Hub page

**Files:**
- Create: `src/app/learning-hub/page.tsx`

**Step 1: Create the Learning Hub**

This page pulls all content from `data.ts` — no hardcoded research content.

```tsx
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
```

**Step 2: Verify**

Navigate to `http://localhost:3000/learning-hub`
Expected: Page renders with 3 sections, all content from data.ts, anchor links (#research, #philosophies) work.

**Step 3: Commit**

```bash
git add src/app/learning-hub/page.tsx
git commit -m "feat: add Learning Hub page with archetypes, research, and philosophies"
```

---

### Task 7: Build the Dashboard page

**Files:**
- Create: `src/app/dashboard/page.tsx`

**Step 1: Create the Dashboard**

This is a client component since it reads from localStorage.

```tsx
"use client";

import Link from "next/link";
import { useWizard } from "@/lib/store/wizard-context";
import { ArrowRight, Layout, Plus } from "lucide-react";

export default function DashboardPage() {
  const { state, result } = useWizard();

  const hasDesign = result !== null && result.options.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-rose-950 tracking-tight mb-2">
            Dashboard
          </h1>
          <p className="text-stone-600">
            Your saved classroom designs and recent work.
          </p>
        </div>
        <Link
          href="/redesign"
          className="inline-flex items-center justify-center rounded-xl font-medium bg-rose-800 text-white hover:bg-rose-900 transition-colors px-5 py-2.5 text-sm shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Design
        </Link>
      </div>

      {hasDesign ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Current design card */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-800">
                <Layout className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900">
                  Recent Redesign
                </h3>
                <p className="text-xs text-stone-500">
                  {state.philosophy} &middot; {state.learnerProfile}
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Layout options</span>
                <span className="font-medium text-stone-900">
                  {result.options.length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Philosophy</span>
                <span className="font-medium text-stone-900">
                  {state.philosophy}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Learner profile</span>
                <span className="font-medium text-stone-900">
                  {state.learnerProfile}
                </span>
              </div>
              {state.goals && (
                <div className="text-sm">
                  <span className="text-stone-500">Goals: </span>
                  <span className="text-stone-700 line-clamp-2">
                    {state.goals}
                  </span>
                </div>
              )}
            </div>

            <Link
              href="/redesign"
              className="inline-flex items-center text-sm font-medium text-rose-800 hover:text-rose-900 transition-colors"
            >
              Continue this design
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-12 text-center max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto mb-5 text-rose-800">
            <Layout className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">
            No designs yet
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed mb-6">
            Upload a photo of your classroom, describe your teaching style, and
            get AI-generated layout options backed by research.
          </p>
          <Link
            href="/redesign"
            className="inline-flex items-center justify-center rounded-xl font-medium bg-rose-800 text-white hover:bg-rose-900 transition-colors px-5 py-2.5 text-sm"
          >
            Start Your First Redesign
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Verify**

- Navigate to `http://localhost:3000/dashboard` with no localStorage data — should show empty state
- Complete a wizard flow, then revisit `/dashboard` — should show the design card

**Step 3: Commit**

```bash
git add src/app/dashboard/page.tsx
git commit -m "feat: add Dashboard page with saved designs and empty state"
```

---

### Task 8: Update print styles and verify full build

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Update print styles to hide site header/footer**

Add to the existing `@media print` block in `globals.css`:

```css
  /* Hide site chrome */
  .site-header,
  .site-footer {
    display: none !important;
  }
```

Also add the `site-header` className to `SiteHeader` and `site-footer` to `SiteFooter` outer elements. In `site-header.tsx`, change the `<header>` to include `className="site-header sticky top-0 ..."`. In `site-footer.tsx`, change the `<footer>` to include `className="site-footer bg-stone-100 ..."`.

**Step 2: Run full build**

Run: `npx next build`
Expected: Build succeeds with no errors. All 4 routes (`/`, `/redesign`, `/learning-hub`, `/dashboard`) compile.

**Step 3: Manual smoke test**

Run: `npx next dev` and verify:
1. `/` — Homepage loads, all sections render, nav links work
2. `/redesign` — Wizard works as before, sub-header visible
3. `/learning-hub` — All research content renders, anchor links scroll
4. `/dashboard` — Empty state shows, or saved design if one exists
5. Site header is sticky and highlights current page
6. Mobile: hamburger menu opens/closes, links navigate
7. Footer appears on all pages

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: update print styles for site-wide layout, verify full build"
```

---

## Task Dependency Order

```
Task 1 (SiteHeader) ──┐
Task 2 (SiteFooter) ──┼── Task 3 (Layout) ── Task 4 (Move Wizard) ── Task 5 (Homepage)
                       │
                       ├── Task 6 (Learning Hub) ── independent after Task 3
                       ├── Task 7 (Dashboard) ── independent after Task 3
                       └── Task 8 (Print + Verify) ── after all others
```

Tasks 5, 6, and 7 can be parallelized after Task 4 completes.
