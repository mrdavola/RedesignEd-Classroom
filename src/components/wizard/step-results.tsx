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
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useWizard } from "@/lib/store/wizard-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SlideOver } from "@/components/ui/slide-over";
import { Card } from "@/components/ui/card";
import type { ToolType, LayoutOption } from "@/types";

const colorMap: Record<string, { border: string; bg: string; text: string; accent: string }> = {
  green: { border: "border-green-300", bg: "bg-green-50", text: "text-green-700", accent: "bg-green-500" },
  indigo: { border: "border-indigo-300", bg: "bg-indigo-50", text: "text-indigo-700", accent: "bg-indigo-500" },
  purple: { border: "border-purple-300", bg: "bg-purple-50", text: "text-purple-700", accent: "bg-purple-500" },
  amber: { border: "border-amber-300", bg: "bg-amber-50", text: "text-amber-700", accent: "bg-amber-500" },
  rose: { border: "border-rose-300", bg: "bg-rose-50", text: "text-rose-700", accent: "bg-rose-500" },
  blue: { border: "border-blue-300", bg: "bg-blue-50", text: "text-blue-700", accent: "bg-blue-500" },
};

const toolLabels: Partial<Record<ToolType, { label: string; icon: typeof FileText }>> = {
  grant: { label: "Write a Grant", icon: FileText },
  norms: { label: "Generate Norms", icon: Scale },
  lesson: { label: "Adapt a Lesson", icon: BookOpen },
};

interface SlideOverState {
  open: boolean;
  type: ToolType;
  layoutTitle: string;
  layoutContext: string;
}

export function StepResults() {
  const { state, result, setResult, reset } = useWizard();
  const [images, setImages] = useState<Record<number, string>>({});
  const [slideOver, setSlideOver] = useState<SlideOverState>({
    open: false,
    type: "grant",
    layoutTitle: "",
    layoutContext: "",
  });
  const [toolContent, setToolContent] = useState<string | null>(null);
  const [toolLoading, setToolLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lessonTopic, setLessonTopic] = useState("");
  const [lessonPromptIndex, setLessonPromptIndex] = useState<number | null>(null);

  // Generate images for each option
  useEffect(() => {
    if (!result) return;

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
      // For lesson tool, show topic prompt first
      if (type === "lesson") {
        setLessonPromptIndex(result?.options.indexOf(option) ?? null);
        return;
      }

      setSlideOver({
        open: true,
        type,
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
            type,
            context: {
              layoutTitle: option.title,
              layoutContext: option.why,
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

  const handleCopy = async () => {
    if (!toolContent) return;
    await navigator.clipboard.writeText(toolContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Loading state
  if (!result) {
    return (
      <div className="space-y-6">
        <Skeleton className="w-full h-48" />
        <Skeleton className="w-full h-48" />
        <Skeleton className="w-full h-48" />
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
              <div className="flex flex-wrap gap-2 px-6 pb-5 relative">
                {(Object.keys(toolLabels) as ToolType[]).map((type) => {
                  const tool = toolLabels[type]!;
                  const Icon = tool.icon;
                  return (
                    <Button
                      key={type}
                      variant="secondary"
                      size="sm"
                      onClick={() => openTool(type, option)}
                    >
                      <Icon className="w-4 h-4 mr-1.5" />
                      {tool.label}
                    </Button>
                  );
                })}

                {/* Lesson topic inline input */}
                {lessonPromptIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 w-full mt-2"
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
        }}
        title={`${toolLabels[slideOver.type]?.label ?? slideOver.type} — ${slideOver.layoutTitle}`}
        footer={
          toolContent ? (
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
        ) : toolContent ? (
          <div className="prose prose-sm prose-stone max-w-none">
            <ReactMarkdown>{toolContent}</ReactMarkdown>
          </div>
        ) : null}
      </SlideOver>
    </div>
  );
}
