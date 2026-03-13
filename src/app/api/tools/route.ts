import { NextRequest, NextResponse } from "next/server";
import { runTool } from "@/lib/ai/claude";
import type { ToolType, WizardState } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { type, context, state } = (await req.json()) as {
      type: ToolType;
      context: { layoutTitle: string; layoutContext: string; topic?: string };
      state: WizardState;
    };

    if (!type || !context || !state) {
      return NextResponse.json(
        { error: "type, context, and state are required" },
        { status: 400 },
      );
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
