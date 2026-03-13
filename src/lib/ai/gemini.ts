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
    model: "gemini-2.5-flash-preview-05-20",
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

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Image,
      },
    },
  ]);

  const text = result.response.text();
  const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  return JSON.parse(cleaned) as Partial<Inventory>;
}

/**
 * Generates or redesigns a classroom image using Gemini.
 * - With base64Image: uses Gemini Flash for image-to-image redesign.
 * - Without base64Image: uses Imagen 4.0 via REST API for text-to-image generation.
 */
export async function generateRoomImage(
  prompt: string,
  base64Image?: string,
): Promise<string | null> {
  try {
    if (base64Image) {
      // Image-to-image redesign with Gemini Flash
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-preview-05-20",
        generationConfig: {
          responseModalities: ["IMAGE"],
        } as unknown as import("@google/generative-ai").GenerationConfig,
      });

      const result = await model.generateContent([
        `Redesign this classroom based on the following description. Generate a photorealistic image:\n\n${prompt}`,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        },
      ]);

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
    } else {
      // Text-to-image with Imagen via REST API
      const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: {
            sampleCount: 1,
          },
        }),
      });

      if (!response.ok) {
        console.error("Imagen API error:", response.status, await response.text());
        return null;
      }

      const data = await response.json();
      const predictions = data.predictions;
      if (!predictions || predictions.length === 0) return null;

      return predictions[0].bytesBase64Encoded ?? null;
    }
  } catch (error) {
    console.error("Image generation error:", error);
    return null;
  }
}
