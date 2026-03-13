import { NextRequest, NextResponse } from "next/server";
import { runTool, runStructuredTool } from "@/lib/ai/claude";
import type { ToolType, WizardState } from "@/types";

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

export async function POST(req: NextRequest) {
  try {
    const { type, context, state } = (await req.json()) as {
      type: ToolType;
      context: {
        layoutTitle: string;
        layoutContext: string;
        topic?: string;
        educator?: string;
      };
      state: WizardState;
    };

    if (!type || !context || !state) {
      return NextResponse.json(
        { error: "type, context, and state are required" },
        { status: 400 },
      );
    }

    if (STRUCTURED_TOOLS.includes(type)) {
      const data = await runStructuredTool(type, context, state);
      return NextResponse.json({ data });
    }

    const content = await runTool(type, context, state);
    return NextResponse.json({ content });
  } catch (error) {
    console.error("Tool error:", error);
    return NextResponse.json(
      { error: "Failed to run tool" },
      { status: 500 },
    );
  }
}
