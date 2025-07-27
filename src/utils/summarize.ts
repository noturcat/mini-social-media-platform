// utils/openaiSummarize.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // store your key in .env
  dangerouslyAllowBrowser: true, // allows running in client-side (only use if needed)
});

export async function summarizeText(text: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that summarizes text." },
        { role: "user", content: `Summarize this: ${text}` },
      ],
    });

    const summary = response.choices[0]?.message?.content;
    return summary || "No summary returned.";
  } catch (error) {
    console.error("Summarization Error:", error);
    return "Error summarizing text.";
  }
}

