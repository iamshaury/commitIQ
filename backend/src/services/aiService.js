import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", // Optional: Your site URL
    "X-Title": "CommitIQ", // Optional: Your site name
  },
});

export const generateRecruiterSummary = async (signals) => {
  const prompt = `
You are a senior software engineer helping recruiters.
Summarize the following developer signals into 2–3 short, conservative sentences.
Do NOT exaggerate.
Do NOT claim certainty.
Do NOT use buzzwords.

Signals:
${JSON.stringify(signals, null, 2)}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("AI Service Error:", error);
    return "Summary unavailable (Check API Key).";
  }
};
