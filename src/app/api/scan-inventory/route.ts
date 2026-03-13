import { NextRequest, NextResponse } from "next/server";
import { scanInventory } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  try {
    const { base64Image } = await req.json();

    if (!base64Image) {
      return NextResponse.json(
        { error: "base64Image is required" },
        { status: 400 },
      );
    }

    const inventory = await scanInventory(base64Image);
    return NextResponse.json(inventory);
  } catch (error) {
    console.error("Scan inventory error:", error);
    return NextResponse.json(
      { error: "Failed to scan inventory" },
      { status: 500 },
    );
  }
}
