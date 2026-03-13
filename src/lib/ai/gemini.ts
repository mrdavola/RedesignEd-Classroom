import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Inventory } from "@/types";

const apiKey = process.env.GEMINI_API_KEY!;

/**
 * Uses Gemini Flash to scan a classroom photo and count visible furniture.
 */
export async function scanInventory(
  base64Image: string,
): Promise<Partial<Inventory>> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `Analyze this classroom photo and count the visible furniture items.
Return ONLY valid JSON matching this structure (use 0 for items not visible):

{
  "studentDesks": number,
  "teacherDesks": number,
  "kidneyTables": number,
  "studentChairs": number,
  "carpets": number,
  "shelves": number,
  "easels": number,
  "bins": number
}

Return raw JSON only -- no markdown fences, no commentary.`;

  // Strip data URL prefix if present (e.g. "data:image/jpeg;base64,...")
  const rawBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: rawBase64,
      },
    },
  ]);

  const text = result.response.text();
  const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  return JSON.parse(cleaned) as Partial<Inventory>;
}

/**
 * Generates or redesigns a classroom image using Gemini 2.5 Flash Image (Nano Banana).
 * - With base64Image: image-to-image redesign.
 * - Without base64Image: text-to-image generation.
 */
export async function generateRoomImage(
  prompt: string,
  base64Image?: string,
): Promise<string | null> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-image",
      generationConfig: {
        responseModalities: ["IMAGE"],
      } as unknown as import("@google/generative-ai").GenerationConfig,
    });

    const contents: (string | { inlineData: { mimeType: string; data: string } })[] = [];

    if (base64Image) {
      const rawBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");
      contents.push(
        `Redesign this classroom based on the following description. Generate a photorealistic image:\n\n${prompt}`,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: rawBase64,
          },
        },
      );
    } else {
      contents.push(prompt);
    }

    const result = await model.generateContent(contents);

    const response = result.response;
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) return null;

    const parts = candidates[0].content?.parts;
    if (!parts) return null;

    for (const part of parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    return null;
  } catch (error) {
    console.error("Image generation error:", error);
    return null;
  }
}
