import { db } from "../utils/firebase";
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
    serverTimestamp
} from "firebase/firestore";

/**
 * Get AI response for chatbot from Gemini API directly on Client Side
 */
export const getChatResponse = async (userMessage) => {
    try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            return { text: "Please add VITE_GEMINI_API_KEY to your .env file." };
        }

        const SYSTEM_PROMPT = `
You are E-Suraksha AI Assistant.
Rules:
- Answer only about e-waste, recycling, product listing, reward system, and environmental safety.
- Keep responses under 120 words.
- Use simple language.
- Encourage eco-friendly actions.
- If the question is unrelated to e-waste or E-Suraksha, respond:
  "I can only help with E-Suraksha and e-waste related queries."`;

        const lowerMsg = userMessage.toLowerCase();

        // 1. Predefined Knowledge Base checks
        const KNOWLEDGE_BASE = {
            "items": "We accept a wide range of e-waste including: smartphones, laptops, tablets, chargers, batteries, desktop computers, monitors, printers, and small household appliances like microwaves and toasters.",
            "recycle": "Recycling e-waste with E-Suraksha is easy! Just schedule a pickup or drop off your items at a certified collection center. You'll earn Green Points for every item recycled!",
            "purpose": "Our mission is to reduce environmental impact by ensuring electronic waste is disposed of responsibly, recovering precious metals and preventing toxic leakages into the soil.",
            "collectors": "Our certified collectors are trained professionals who ensure secure handling and transportation of your electronic waste to authorized recycling facilities.",
            "rewards": "You earn Green Points for every successful recycling transaction. These points can be redeemed for discounts with our sustainable partner brands!",
            "contact": "You can reach our support team at support@e-suraksha.com or via the contact form in the footer."
        };

        if (lowerMsg.includes("item") || lowerMsg.includes("what can i")) return { text: KNOWLEDGE_BASE.items };
        if (lowerMsg.includes("recycle") || lowerMsg.includes("how to")) return { text: KNOWLEDGE_BASE.recycle };
        if (lowerMsg.includes("purpose") || lowerMsg.includes("why")) return { text: KNOWLEDGE_BASE.purpose };
        if (lowerMsg.includes("collector")) return { text: KNOWLEDGE_BASE.collectors };
        if (lowerMsg.includes("reward") || lowerMsg.includes("point")) return { text: KNOWLEDGE_BASE.rewards };
        if (lowerMsg.includes("contact") || lowerMsg.includes("help")) return { text: KNOWLEDGE_BASE.contact };

        // 2. Direct call to Google Gemini API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Question: ${userMessage}` }]
                }]
            }),
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error?.message || `API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return {
            text: data.candidates[0].content.parts[0].text
        };
    } catch (error) {
        console.error("Error getting chat response:", error);
        return {
            text: `⚠️ Chat Error: ${error.message}. Please verify your Gemini API key and network connection.`
        };
    }
};

/**
 * Save message to Firestore
 */
export const saveChatMessage = async (userId, message, sender) => {
    try {
        const chatRef = collection(db, "chats");
        await addDoc(chatRef, {
            userId,
            message,
            sender,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error("Error saving chat message:", error);
    }
};

/**
 * Get chat history from Firestore
 */
export const getChatHistory = async (userId) => {
    try {
        const chatRef = collection(db, "chats");
        const q = query(
            chatRef,
            where("userId", "==", userId),
            orderBy("timestamp", "asc")
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error getting chat history:", error);
        return [];
    }
};
