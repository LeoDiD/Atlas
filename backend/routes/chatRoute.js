import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
You are Atlas Coffee's friendly AI barista assistant ☕.
You only talk about coffee, drinks, pastries, or Atlas Café.
If someone asks unrelated questions, reply:
"I'm sorry, I can only help with coffee or Atlas Café-related questions."
Keep replies short and friendly.
`;

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("✅ /api/chat hit with:", message);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // fast + cheap model
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0]?.message?.content?.trim();

    return res.json({ reply });
  } catch (error) {
    console.error("⚠️ OpenAI Error:", error);
    res.status(500).json({ error: "Chatbot backend error" });
  }
});

export default router;
