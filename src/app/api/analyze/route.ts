import { NextRequest, NextResponse } from "next/server";
import { generateLayouts } from "@/lib/ai/claude";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await generateLayouts(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to generate layouts" },
      { status: 500 },
    );
  }
}
