// pages/api/summarize.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Missing content" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Summarize this clearly and concisely." },
        { role: "user", content },
      ],
    });

    const summary = response.choices[0]?.message?.content;
    res.status(200).json({ summary });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ message: "Failed to summarize content." });
  }
}
