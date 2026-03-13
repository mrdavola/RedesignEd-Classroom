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
