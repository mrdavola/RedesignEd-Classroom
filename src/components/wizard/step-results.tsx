"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  BookOpen,
  Scale,
  Printer,
  RotateCcw,
  Loader2,
  Check as CheckIcon,
  ClipboardCopy,
  ArrowRight,
  Fingerprint,
  User,
  MapPin,
  DollarSign,
  Calendar,
  Mail,
  Eye,
  Volume2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useWizard } from "@/lib/store/wizard-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SlideOver } from "@/components/ui/slide-over";
import { Card } from "@/components/ui/card";
import { ClassroomDnaView } from "@/components/tools/classroom-dna";
import { PhilosopherCritiqueView } from "@/components/tools/philosopher-critique";
import { MovementHeatmapView } from "@/components/tools/movement-heatmap";
import { BudgetOptimizerView } from "@/components/tools/budget-optimizer";
import { SeasonalCalendarView } from "@/components/tools/seasonal-calendar";
import { PrincipalEmailView } from "@/components/tools/principal-email";
import { SeatPerspectiveView } from "@/components/tools/seat-perspective";
import { SoundZonesView } from "@/components/tools/sound-zones";
import type {
  ToolType,
  LayoutOption,
  ClassroomDNA,
  PhilosopherCritique,
  MovementHeatmapData,
  BudgetOptimizer,
  SeasonalCalendar,
  PrincipalEmail,
  SeatPerspective,
  SoundZonesData,
} from "@/types";

const colorMap: Record<string, { border: string; bg: string; text: string; accent: string }> = {
  green: { border: "border-green-300", bg: "bg-green-50", text: "text-green-700", accent: "bg-green-500" },
  indigo: { border: "border-indigo-300", bg: "bg-indigo-50", text: "text-indigo-700", accent: "bg-indigo-500" },
  purple: { border: "border-purple-300", bg: "bg-purple-50", text: "text-purple-700", accent: "bg-purple-500" },
  amber: { border: "border-amber-300", bg: "bg-amber-50", text: "text-amber-700", accent: "bg-amber-500" },
  rose: { border: "border-rose-300", bg: "bg-rose-50", text: "text-rose-700", accent: "bg-rose-500" },
  blue: { border: "border-blue-300", bg: "bg-blue-50", text: "text-blue-700", accent: "bg-blue-500" },
};

const STRUCTURED_TOOLS: ToolType[] = [
  "dna",
  "philosopher-critique",
  "movement-heatmap",
  "budget-optimizer",
  "seasonal-calendar",
  "principal-email",
  "seat-perspective",
  "sound-zones",
];

const WIDE_TOOLS: ToolType[] = [
  "movement-heatmap",
  "seat-perspective",
  "sound-zones",
];

interface ToolConfig {
  label: string;
  icon: typeof FileText;
  group: string;
}

const toolConfig: Record<ToolType, ToolConfig> = {
  grant: { label: "Write a Grant", icon: FileText, group: "Create" },
  norms: { label: "Generate Norms", icon: Scale, group: "Create" },
  lesson: { label: "Adapt a Lesson", icon: BookOpen, group: "Create" },
  dna: { label: "Classroom DNA", icon: Fingerprint, group: "Analyze" },
  "movement-heatmap": { label: "Movement Map", icon: MapPin, group: "Analyze" },
  "seat-perspective": { label: "Seat Perspective", icon: Eye, group: "Analyze" },
  "sound-zones": { label: "Sound Zones", icon: Volume2, group: "Analyze" },
  "budget-optimizer": { label: "The $200 Question", icon: DollarSign, group: "Plan" },
  "seasonal-calendar": { label: "Seasonal Calendar", icon: Calendar, group: "Plan" },
  "principal-email": { label: "Email Principal", icon: Mail, group: "Communicate" },
  "philosopher-critique": { label: "Philosopher Critique", icon: User, group: "Communicate" },
};

const toolGroups = ["Analyze", "Plan", "Communicate", "Create"];

interface SlideOverState {
  open: boolean;
  type: ToolType;
  layoutTitle: string;
  layoutContext: string;
}

export function StepResults() {
  const { state, result, setResult, reset, goToStep } = useWizard();
  const [images, setImages] = useState<Record<number, string>>({});
  const [slideOver, setSlideOver] = useState<SlideOverState>({
    open: false,
    type: "grant",
    layoutTitle: "",
    layoutContext: "",
  });
  const [toolContent, setToolContent] = useState<string | null>(null);
  const [toolData, setToolData] = useState<unknown>(null);
  const [toolLoading, setToolLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lessonTopic, setLessonTopic] = useState("");
  const [lessonPromptIndex, setLessonPromptIndex] = useState<number | null>(null);
  const [selectedEducator, setSelectedEducator] = useState("Maria Montessori");
  const [educatorPromptIndex, setEducatorPromptIndex] = useState<number | null>(null);

  // Generate images for each option
  useEffect(() => {
    if (!result?.options) return;

    result.options.forEach((option, index) => {
      if (images[index]) return;

      fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: option.visualPrompt,
          base64Image: state.image || undefined,
        }),
      })
        .then((res) => res.json())
        .then((data: { imageUrl?: string }) => {
          if (data.imageUrl) {
            setImages((prev) => ({ ...prev, [index]: data.imageUrl as string }));

            // Also update result so it persists
            if (result) {
              const updated = { ...result };
              updated.options = updated.options.map((opt, i) =>
                i === index ? { ...opt, imageUrl: data.imageUrl } : opt,
              );
              setResult(updated);
            }
          }
        })
        .catch(() => {
          // Image generation failed — leave as skeleton
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const openTool = useCallback(
    async (type: ToolType, option: LayoutOption) => {
      if (type === "lesson") {
        setLessonPromptIndex(result?.options.indexOf(option) ?? null);
        return;
      }

      if (type === "philosopher-critique") {
        setEducatorPromptIndex(result?.options.indexOf(option) ?? null);
        return;
      }

      setSlideOver({
        open: true,
        type,
        layoutTitle: option.title,
        layoutContext: option.why,
      });
      setToolContent(null);
      setToolData(null);
      setToolLoading(true);

      try {
        const res = await fetch("/api/tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type,
            context: {
              layoutTitle: option.title,
              layoutContext: option.why,
            },
            state,
          }),
        });
        const json = await res.json();

        if (STRUCTURED_TOOLS.includes(type)) {
          setToolData(json.data);
        } else {
          setToolContent(json.content ?? json.result ?? "No content returned.");
        }
      } catch {
        setToolContent("Something went wrong. Please try again.");
      } finally {
        setToolLoading(false);
      }
    },
    [state, result],
  );

  const handleLessonSubmit = async (option: LayoutOption) => {
    setLessonPromptIndex(null);

    setSlideOver({
      open: true,
      type: "lesson",
      layoutTitle: option.title,
      layoutContext: option.why,
    });
    setToolContent(null);
    setToolLoading(true);

    try {
      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "lesson" as ToolType,
          context: {
            layoutTitle: option.title,
            layoutContext: option.why,
            topic: lessonTopic,
          },
          state,
        }),
      });
      const data = await res.json();
      setToolContent(data.content ?? data.result ?? "No content returned.");
    } catch {
      setToolContent("Something went wrong. Please try again.");
    } finally {
      setToolLoading(false);
      setLessonTopic("");
    }
  };

  const handleEducatorSubmit = async (option: LayoutOption) => {
    setEducatorPromptIndex(null);

    setSlideOver({
      open: true,
      type: "philosopher-critique",
      layoutTitle: option.title,
      layoutContext: option.why,
    });
    setToolContent(null);
    setToolData(null);
    setToolLoading(true);

    try {
      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "philosopher-critique" as ToolType,
          context: {
            layoutTitle: option.title,
            layoutContext: option.why,
            educator: selectedEducator,
          },
          state,
        }),
      });
      const json = await res.json();
      setToolData(json.data);
    } catch {
      setToolContent("Something went wrong. Please try again.");
    } finally {
      setToolLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!toolContent) return;
    await navigator.clipboard.writeText(toolContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // No results available — prompt user to go back and generate layouts
  if (!result || !result.options) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
        <h2 className="text-xl font-semibold text-stone-900">
          No layout results yet
        </h2>
        <p className="text-stone-500 text-sm max-w-md">
          Complete the previous steps and generate research-backed layouts to see your redesign options here.
        </p>
        <Button onClick={() => goToStep(0)} className="mt-2">
          <RotateCcw className="w-4 h-4 mr-2" />
          Start from the beginning
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Base room description */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-stone-900 mb-2">
          Your Redesigned Classroom
        </h2>
        <p className="text-stone-500 text-sm max-w-xl mx-auto">
          {result.baseRoomDescription}
        </p>
      </div>

      {/* Layout option cards */}
      {result.options.map((option, index) => {
        const colors = colorMap[option.color] ?? colorMap.green;
        const imageUrl = images[index] || option.imageUrl;

        return (
          <motion.div
            key={option.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.4 }}
          >
            <Card className="overflow-hidden" data-print-card>
              {/* Top bar */}
              <div className="flex items-center gap-3 px-6 py-3 border-b border-stone-100">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${colors.bg} ${colors.text}`}
                >
                  Option {index + 1}: {option.title}
                </span>
                <span className="text-xs text-stone-400">{option.archetype}</span>
              </div>

              {/* Two-column layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {/* Left column */}
                <div className="space-y-4">
                  {/* Image */}
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={`${option.title} layout visualization`}
                      className="w-full aspect-video object-cover rounded-xl"
                    />
                  ) : (
                    <Skeleton className="w-full aspect-video" />
                  )}

                  {/* Pedagogy shift callout */}
                  <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                    <p className="text-xs font-semibold text-amber-800 mb-1">
                      Required Pedagogy Shift
                    </p>
                    <p className="text-sm text-amber-700 leading-relaxed">
                      {option.pedagogyShift}
                    </p>
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-4">
                  {/* Research rationale */}
                  <blockquote className="border-l-4 border-stone-200 pl-4 text-sm text-stone-600 italic leading-relaxed">
                    {option.why}
                  </blockquote>

                  {/* Evidence basis */}
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
                    <p className="text-xs font-semibold text-emerald-800 mb-1">
                      Evidence Basis
                    </p>
                    <p className="text-sm text-emerald-700 leading-relaxed">
                      {option.researchNote}
                    </p>
                  </div>

                  {/* Implementation moves */}
                  <div>
                    <p className="text-xs font-semibold text-stone-700 mb-2">
                      Implementation Moves
                    </p>
                    <ul className="space-y-1.5">
                      {option.moves.map((move, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-stone-600"
                        >
                          <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{move}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action bar */}
              <div className="px-6 pb-5 space-y-3 relative">
                {toolGroups.map((group) => {
                  const groupTools = (Object.entries(toolConfig) as [ToolType, ToolConfig][])
                    .filter(([, cfg]) => cfg.group === group);
                  return (
                    <div key={group}>
                      <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1.5">
                        {group}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {groupTools.map(([type, cfg]) => {
                          const Icon = cfg.icon;
                          return (
                            <Button
                              key={type}
                              variant="secondary"
                              size="sm"
                              onClick={() => openTool(type, option)}
                            >
                              <Icon className="w-4 h-4 mr-1.5" />
                              {cfg.label}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Lesson topic inline input */}
                {lessonPromptIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 w-full"
                  >
                    <input
                      type="text"
                      placeholder="Enter lesson topic..."
                      value={lessonTopic}
                      onChange={(e) => setLessonTopic(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && lessonTopic.trim()) {
                          handleLessonSubmit(option);
                        }
                      }}
                      className="flex-1 rounded-lg border border-stone-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleLessonSubmit(option)}
                      disabled={!lessonTopic.trim()}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                )}

                {/* Educator selector */}
                {educatorPromptIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 w-full"
                  >
                    <select
                      value={selectedEducator}
                      onChange={(e) => setSelectedEducator(e.target.value)}
                      className="flex-1 rounded-lg border border-stone-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800 bg-white"
                    >
                      {["Maria Montessori", "John Dewey", "Paulo Freire", "Loris Malaguzzi", "Lev Vygotsky", "bell hooks"].map(
                        (name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ),
                      )}
                    </select>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleEducatorSubmit(option)}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        );
      })}

      {/* Footer */}
      <div className="flex justify-between pt-4 pb-8" data-print-hide>
        <Button variant="secondary" onClick={() => window.print()}>
          <Printer className="w-4 h-4 mr-2" />
          Print Report
        </Button>
        <Button variant="primary" onClick={reset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Start New Design
        </Button>
      </div>

      {/* Tool slide-over */}
      <SlideOver
        isOpen={slideOver.open}
        onClose={() => {
          setSlideOver((prev) => ({ ...prev, open: false }));
          setToolContent(null);
          setToolData(null);
        }}
        title={`${toolConfig[slideOver.type]?.label ?? slideOver.type} — ${slideOver.layoutTitle}`}
        size={WIDE_TOOLS.includes(slideOver.type) ? "wide" : "default"}
        footer={
          toolContent && !STRUCTURED_TOOLS.includes(slideOver.type) ? (
            <Button variant="secondary" onClick={handleCopy} className="w-full">
              {copied ? (
                <>
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <ClipboardCopy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </>
              )}
            </Button>
          ) : undefined
        }
      >
        {toolLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-6 h-6 text-rose-700 animate-spin" />
            <p className="text-sm text-stone-500">Generating content...</p>
          </div>
        ) : toolData && STRUCTURED_TOOLS.includes(slideOver.type) ? (
          <>
            {slideOver.type === "dna" && <ClassroomDnaView data={toolData as ClassroomDNA} />}
            {slideOver.type === "philosopher-critique" && <PhilosopherCritiqueView data={toolData as PhilosopherCritique} />}
            {slideOver.type === "movement-heatmap" && <MovementHeatmapView data={toolData as MovementHeatmapData} />}
            {slideOver.type === "budget-optimizer" && <BudgetOptimizerView data={toolData as BudgetOptimizer} />}
            {slideOver.type === "seasonal-calendar" && <SeasonalCalendarView data={toolData as SeasonalCalendar} />}
            {slideOver.type === "principal-email" && <PrincipalEmailView data={toolData as PrincipalEmail} />}
            {slideOver.type === "seat-perspective" && <SeatPerspectiveView data={toolData as SeatPerspective} />}
            {slideOver.type === "sound-zones" && <SoundZonesView data={toolData as SoundZonesData} />}
          </>
        ) : toolContent ? (
          <div className="prose prose-sm prose-stone max-w-none">
            <ReactMarkdown>{toolContent}</ReactMarkdown>
          </div>
        ) : null}
      </SlideOver>
    </div>
  );
}
