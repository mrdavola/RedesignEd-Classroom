import { NextRequest, NextResponse } from "next/server";
import { generateRoomImage } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  try {
    const { prompt, base64Image } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    const imageData = await generateRoomImage(prompt, base64Image);

    if (!imageData) {
      return NextResponse.json(
        { error: "Failed to generate image" },
        { status: 500 },
      );
    }

    const imageUrl = `data:image/png;base64,${imageData}`;
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 },
    );
  }
}
