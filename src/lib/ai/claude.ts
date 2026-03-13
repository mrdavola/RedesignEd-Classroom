import { GoogleGenerativeAI } from "@google/generative-ai";
import type { WizardState, AnalysisResult, ToolType } from "@/types";
import {
  buildAnalysisPrompt,
  buildGrantPrompt,
  buildLessonPrompt,
  buildNormsPrompt,
  buildDnaPrompt,
  buildPhilosopherCritiquePrompt,
  buildMovementHeatmapPrompt,
  buildBudgetOptimizerPrompt,
  buildSeasonalCalendarPrompt,
  buildPrincipalEmailPrompt,
  buildSeatPerspectivePrompt,
  buildSoundZonesPrompt,
  RESEARCH_CONTEXT,
} from "@/lib/research/prompts";

const MODEL = "gemini-2.5-flash";

function getModel() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  return genAI.getGenerativeModel({ model: MODEL });
}

/**
 * Generates 3 classroom layout options using Gemini, grounded in research.
 */
export async function generateLayouts(
  state: WizardState,
): Promise<AnalysisResult> {
  const model = getModel();
  const systemPrompt = buildAnalysisPrompt(state);

  const parts: (string | { inlineData: { mimeType: string; data: string } })[] = [];

  if (state.image) {
    const rawBase64 = state.image.replace(/^data:image\/\w+;base64,/, "");
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: rawBase64,
      },
    });
  }

  parts.push(
    "Analyze the classroom context and generate 3 distinct zero-budget layout redesign options. Return valid JSON only.",
  );

  const result = await model.generateContent({
    contents: [{ role: "user" as const, parts: parts.map(p => typeof p === "string" ? { text: p } : p) }],
    systemInstruction: { role: "model" as const, parts: [{ text: `${systemPrompt}\n\n${RESEARCH_CONTEXT}` }] },
  });

  const text = result.response.text();
  const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  return JSON.parse(cleaned) as AnalysisResult;
}

/**
 * Runs a specialized tool (grant, lesson, or norms) using Gemini.
 */
export async function runTool(
  type: ToolType,
  context: { layoutTitle: string; layoutContext: string; topic?: string },
  state: WizardState,
): Promise<string> {
  const model = getModel();

  let prompt: string;
  switch (type) {
    case "grant":
      prompt = buildGrantPrompt(context.layoutTitle, context.layoutContext, state);
      break;
    case "lesson":
      prompt = buildLessonPrompt(
        context.topic ?? "General lesson",
        context.layoutTitle,
        state,
      );
      break;
    case "norms":
      prompt = buildNormsPrompt(context.layoutTitle, state);
      break;
    default:
      throw new Error(`Unknown tool type: ${type}`);
  }

  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Runs a structured tool that returns parsed JSON, for creative analysis tools.
 */
export async function runStructuredTool<T>(
  type: ToolType,
  context: { layoutTitle: string; layoutContext: string; educator?: string },
  state: WizardState,
): Promise<T> {
  const model = getModel();

  let prompt: string;
  switch (type) {
    case "dna":
      prompt = buildDnaPrompt(context.layoutTitle, context.layoutContext, state);
      break;
    case "philosopher-critique":
      prompt = buildPhilosopherCritiquePrompt(
        context.educator ?? "Maria Montessori",
        context.layoutTitle,
        context.layoutContext,
        state,
      );
      break;
    case "movement-heatmap":
      prompt = buildMovementHeatmapPrompt(context.layoutTitle, context.layoutContext, state);
      break;
    case "budget-optimizer":
      prompt = buildBudgetOptimizerPrompt(context.layoutTitle, context.layoutContext, state);
      break;
    case "seasonal-calendar":
      prompt = buildSeasonalCalendarPrompt(context.layoutTitle, context.layoutContext, state);
      break;
    case "principal-email":
      prompt = buildPrincipalEmailPrompt(context.layoutTitle, context.layoutContext, state);
      break;
    case "seat-perspective":
      prompt = buildSeatPerspectivePrompt(context.layoutTitle, context.layoutContext, state);
      break;
    case "sound-zones":
      prompt = buildSoundZonesPrompt(context.layoutTitle, context.layoutContext, state);
      break;
    default:
      throw new Error(`Not a structured tool: ${type}`);
  }

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  return JSON.parse(cleaned) as T;
}
