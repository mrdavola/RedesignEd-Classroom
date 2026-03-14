"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Loader2,
  RotateCcw,
  ClipboardCopy,
  Check as CheckIcon,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurriculumUnits, getAvailableSubjects } from "@/lib/curriculum/parser";
import {
  MONTHS,
  type GradeLevel,
  type SchoolMonth,
  type CurriculumSubject,
  type LayoutOption,
  type WizardState,
  type ClassroomDNA,
  type LessonPlanResponse,
} from "@/types";

const GRADES: GradeLevel[] = ["K", "1", "2", "3", "4", "5"];

interface LessonPlanAdapterProps {
  layout: LayoutOption;
  state: WizardState;
  dna?: ClassroomDNA;
}

function detectGrade(profile: WizardState["learnerProfile"]): GradeLevel {
  if (profile === "UPK" || profile === "K-1") return "K";
  if (profile === "2-5") return "3";
  return "3";
}

function detectMonth(): SchoolMonth {
  const now = new Date();
  const m = now.getMonth(); // 0-indexed
  // Map calendar months to school months
  // Sept=8, Oct=9, Nov=10, Dec=11, Jan=0, Feb=1, Mar=2, Apr=3, May=4, Jun=5
  const mapping: Record<number, SchoolMonth> = {
    8: "September",
    9: "October",
    10: "November",
    11: "December",
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
  };
  return mapping[m] ?? "September";
}

export function LessonPlanAdapter({ layout, state, dna }: LessonPlanAdapterProps) {
  const [grade, setGrade] = useState<GradeLevel>(() => detectGrade(state.learnerProfile));
  const [month, setMonth] = useState<SchoolMonth>(() => detectMonth());
  const [selectedSubjects, setSelectedSubjects] = useState<CurriculumSubject[]>([]);
  const [subjectsInitialized, setSubjectsInitialized] = useState(false);

  const [response, setResponse] = useState<LessonPlanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});

  // Available subjects for the selected grade
  const availableSubjects = useMemo(() => getAvailableSubjects(grade), [grade]);

  // Initialize selected subjects to all available when grade changes
  useEffect(() => {
    setSelectedSubjects(availableSubjects);
    setSubjectsInitialized(true);
  }, [availableSubjects]);

  // Preview units from client-side parser
  const previewUnits = useMemo(
    () => (subjectsInitialized ? getCurriculumUnits(grade, month, selectedSubjects) : []),
    [grade, month, selectedSubjects, subjectsInitialized],
  );

  const toggleSubject = useCallback((subject: CurriculumSubject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject],
    );
  }, []);

  const canGenerate = selectedSubjects.length > 0 && previewUnits.length > 0;

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/lesson-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade, month, subjects: selectedSubjects, layout, state, dna }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Request failed (${res.status})`);
      }
      const data: LessonPlanResponse = await res.json();
      setResponse(data);
      // Expand all sections by default
      const sections = data.lessonPlan.split("## ").filter(Boolean);
      const expanded: Record<number, boolean> = {};
      sections.forEach((_, i) => { expanded[i] = true; });
      setExpandedSections(expanded);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [grade, month, selectedSubjects, layout, state, dna]);

  const handleCopy = useCallback(async () => {
    if (!response) return;
    await navigator.clipboard.writeText(response.lessonPlan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [response]);

  const handleRegenerate = useCallback(() => {
    setResponse(null);
    setError(null);
  }, []);

  const toggleSection = useCallback((index: number) => {
    setExpandedSections((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);

  // --- Loading State ---
  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <Loader2 className="w-8 h-8 text-rose-700 animate-spin" />
          <p className="text-sm text-stone-500">Generating your curriculum-aligned lesson plan...</p>
        </div>
      </Card>
    );
  }

  // --- Output Panel ---
  if (response) {
    const sections = response.lessonPlan
      .split("## ")
      .filter(Boolean)
      .map((s) => {
        const newline = s.indexOf("\n");
        return {
          heading: newline > -1 ? s.slice(0, newline).trim() : s.trim(),
          content: newline > -1 ? s.slice(newline).trim() : "",
        };
      });

    return (
      <Card className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rose-700" />
            <h3 className="text-lg font-bold text-stone-900">Curriculum-Aligned Lesson Plan</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? (
                <><CheckIcon className="w-4 h-4 mr-1.5" /> Copied</>
              ) : (
                <><ClipboardCopy className="w-4 h-4 mr-1.5" /> Copy</>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleRegenerate}>
              <RotateCcw className="w-4 h-4 mr-1.5" /> Regenerate
            </Button>
          </div>
        </div>

        {/* Metadata bar: matched units */}
        {response.units.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
              Matched Curriculum Units
            </p>
            <div className="flex flex-wrap gap-2">
              {response.units.map((unit, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-stone-700">
                  <span className="font-medium">{unit.subject}:</span> {unit.unitName}
                  {unit.resourceUrl && (
                    <a
                      href={unit.resourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-600 hover:text-rose-800 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Standards pills */}
        {response.standards.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
              Standards Alignment
            </p>
            <div className="flex flex-wrap gap-1.5">
              {response.standards.map((std, i) => (
                <span
                  key={i}
                  className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-2.5 py-0.5 font-medium"
                  title={std.standardStatement}
                >
                  {std.standardCode}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Collapsible sections */}
        <div className="space-y-1">
          {sections.map((section, i) => (
            <div key={i} className="border border-stone-100 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleSection(i)}
                className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-stone-50 transition-colors"
              >
                {expandedSections[i] ? (
                  <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                )}
                <span className="text-sm font-semibold text-stone-800">{section.heading}</span>
              </button>
              <AnimatePresence initial={false}>
                {expandedSections[i] && section.content && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 prose prose-sm prose-stone max-w-none">
                      <ReactMarkdown>{section.content}</ReactMarkdown>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // --- Selector Card (default) ---
  return (
    <Card className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-rose-700" />
        <h3 className="text-lg font-bold text-stone-900">Curriculum-Aligned Lesson Plan</h3>
      </div>

      {/* Grade + Month selectors */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">
            Grade
          </label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value as GradeLevel)}
            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-800 focus:ring-offset-1"
          >
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {g === "K" ? "Kindergarten" : `Grade ${g}`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">
            Month
          </label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value as SchoolMonth)}
            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-800 focus:ring-offset-1"
          >
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subject pills */}
      <div>
        <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2 block">
          Subjects
        </label>
        <div className="flex flex-wrap gap-2">
          {availableSubjects.map((subject) => {
            const selected = selectedSubjects.includes(subject);
            return (
              <button
                key={subject}
                onClick={() => toggleSubject(subject)}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors font-medium ${
                  selected
                    ? "bg-rose-50 border-rose-200 text-rose-800"
                    : "bg-white border-stone-200 text-stone-400 hover:border-stone-300"
                }`}
              >
                {subject}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview units */}
      {previewUnits.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
            Preview Units ({previewUnits.length})
          </p>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {previewUnits.map((unit, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-stone-600">
                <span className="font-medium text-stone-700 w-24 shrink-0">{unit.subject}</span>
                <span className="truncate">{unit.unitName}</span>
                {unit.resourceUrl && (
                  <a
                    href={unit.resourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-600 hover:text-rose-800 transition-colors shrink-0"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      {/* Generate button */}
      <Button variant="primary" size="md" onClick={generate} disabled={!canGenerate} className="w-full">
        <BookOpen className="w-4 h-4 mr-2" />
        Generate Lesson Plan
      </Button>
    </Card>
  );
}
