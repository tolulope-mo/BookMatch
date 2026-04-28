import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_KEY,
    });

    const { prompt } = req.body;

    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    let text = result.text;

    const match = text.match(/\[.*\]/s);

    if (!match) {
      return res.status(500).json({ error: "Invalid AI response" });
    }

    const parsed = JSON.parse(match[0]);

    return res.status(200).json(parsed);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}