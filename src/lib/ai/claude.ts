import Anthropic from "@anthropic-ai/sdk";
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

const MODEL = "claude-sonnet-4-20250514";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

/**
 * Generates 3 classroom layout options using Claude, grounded in research.
 */
export async function generateLayouts(
  state: WizardState,
): Promise<AnalysisResult> {
  const client = getClient();
  const systemPrompt = buildAnalysisPrompt(state);

  const userContent: Anthropic.MessageCreateParams["messages"][number]["content"] =
    [];

  if (state.image) {
    userContent.push({
      type: "image",
      source: {
        type: "base64",
        media_type: "image/jpeg",
        data: state.image,
      },
    });
  }

  userContent.push({
    type: "text",
    text: "Analyze the classroom context and generate 3 distinct zero-budget layout redesign options. Return valid JSON only.",
  });

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: `${systemPrompt}\n\n${RESEARCH_CONTEXT}`,
    messages: [{ role: "user", content: userContent }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  const cleaned = textBlock.text
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .trim();
  return JSON.parse(cleaned) as AnalysisResult;
}

/**
 * Runs a specialized tool (grant, lesson, or norms) using Claude.
 */
export async function runTool(
  type: ToolType,
  context: { layoutTitle: string; layoutContext: string; topic?: string },
  state: WizardState,
): Promise<string> {
  const client = getClient();

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

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  return textBlock.text;
}

/**
 * Runs a structured tool that returns parsed JSON, for creative analysis tools.
 */
export async function runStructuredTool<T>(
  type: ToolType,
  context: { layoutTitle: string; layoutContext: string; educator?: string },
  state: WizardState,
): Promise<T> {
  const client = getClient();

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

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  const cleaned = textBlock.text
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .trim();
  return JSON.parse(cleaned) as T;
}
