import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: "../.env" });

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `
You are E-Suraksha AI Assistant.
Rules:
- Answer only about e-waste, recycling, product listing, reward system, and environmental safety.
- Keep responses under 120 words.
- Use simple language.
- Encourage eco-friendly actions.
- If the question is unrelated to e-waste or E-Suraksha, respond:
  "I can only help with E-Suraksha and e-waste related queries."
`;

const KNOWLEDGE_BASE = {
    "items": "We accept a wide range of e-waste including: smartphones, laptops, tablets, chargers, batteries, desktop computers, monitors, printers, and small household appliances like microwaves and toasters.",
    "recycle": "Recycling e-waste with E-Suraksha is easy! Just schedule a pickup or drop off your items at a certified collection center. You'll earn Green Points for every item recycled!",
    "purpose": "Our mission is to reduce environmental impact by ensuring electronic waste is disposed of responsibly, recovering precious metals and preventing toxic leakages into the soil.",
    "collectors": "Our certified collectors are trained professionals who ensure secure handling and transportation of your electronic waste to authorized recycling facilities.",
    "rewards": "You earn Green Points for every successful recycling transaction. These points can be redeemed for discounts with our sustainable partner brands!",
    "contact": "You can reach our support team at support@e-suraksha.com or via the contact form in the footer."
};

app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const lowerMsg = message.toLowerCase();

        // 1. Check Knowledge Base
        let predefinedReply = null;
        if (lowerMsg.includes("item") || lowerMsg.includes("what can i")) {
            predefinedReply = KNOWLEDGE_BASE.items;
        } else if (lowerMsg.includes("recycle") || lowerMsg.includes("how to")) {
            predefinedReply = KNOWLEDGE_BASE.recycle;
        } else if (lowerMsg.includes("purpose") || lowerMsg.includes("why")) {
            predefinedReply = KNOWLEDGE_BASE.purpose;
        } else if (lowerMsg.includes("collector")) {
            predefinedReply = KNOWLEDGE_BASE.collectors;
        } else if (lowerMsg.includes("reward") || lowerMsg.includes("point")) {
            predefinedReply = KNOWLEDGE_BASE.rewards;
        } else if (lowerMsg.includes("contact") || lowerMsg.includes("help")) {
            predefinedReply = KNOWLEDGE_BASE.contact;
        }

        if (predefinedReply) {
            return res.json({ reply: predefinedReply });
        }

        // 2. Fallback to Gemini AI
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nUser Question: ${message}`);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: "Failed to fetch response from Gemini AI" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
