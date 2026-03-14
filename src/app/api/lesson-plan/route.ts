import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { LessonPlanResponse, LayoutOption, WizardState, ClassroomDNA, GradeLevel, SchoolMonth, CurriculumSubject } from "@/types";
import { getCurriculumUnits } from "@/lib/curriculum/parser";
import { alignStandards } from "@/lib/curriculum/standards";
import { buildCurriculumLessonPrompt } from "@/lib/research/prompts";

const MODEL = "gemini-2.5-flash";

function getModel() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  return genAI.getGenerativeModel({ model: MODEL });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      grade: GradeLevel;
      month: SchoolMonth;
      subjects: CurriculumSubject[];
      layout: LayoutOption;
      state: WizardState;
      dna?: ClassroomDNA;
    };

    const { grade, month, subjects, layout, state, dna } = body;

    if (!grade || !month || !subjects?.length || !layout || !state) {
      return NextResponse.json(
        { error: "grade, month, subjects, layout, and state are required" },
        { status: 400 },
      );
    }

    // Stage 1: Parse curriculum
    const units = getCurriculumUnits(grade, month, subjects);

    // Stage 2: Query Knowledge Graph for standards (graceful degradation)
    let standards: Awaited<ReturnType<typeof alignStandards>> = [];
    try {
      standards = await alignStandards(units);
    } catch (err) {
      console.warn("Standards alignment failed, continuing without:", err);
    }

    // Stage 3: Generate lesson plan via Gemini
    const prompt = buildCurriculumLessonPrompt({
      layout,
      units,
      standards,
      state,
      dna,
    });

    const model = getModel();
    const result = await model.generateContent(prompt);
    const lessonPlan = result.response.text();

    const response: LessonPlanResponse = {
      lessonPlan,
      units,
      standards,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Lesson plan generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate lesson plan" },
      { status: 500 },
    );
  }
}
