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
 * Get AI response for chatbot from Groq API
 * Restricted to E-Waste related queries only
 */
export const getChatResponse = async (userMessage) => {
    try {
        const apiKey = import.meta.env.VITE_GROQ_API_KEY;
        if (!apiKey) {
            return { text: "Please add VITE_GROQ_API_KEY to your .env file." };
        }

        const SYSTEM_PROMPT = `You are Jignasa AI, the official E-Waste Assistant for the E-Suraksha platform.

STRICT RULES:
- You ONLY answer questions related to e-waste, electronic waste disposal, recycling, eco-coins/rewards, the E-Suraksha platform features, and environmental safety.
- If the user asks anything NOT related to e-waste or E-Suraksha, respond ONLY with: "I can only help with E-Suraksha and e-waste related queries. Please ask me about e-waste disposal, recycling, rewards, or our platform."
- Keep all responses under 120 words.
- Use simple, friendly language.
- Always encourage eco-friendly actions.
- Do NOT answer questions about general topics, coding, politics, entertainment, or anything outside e-waste.`;

        const lowerMsg = userMessage.toLowerCase();

        // Predefined Knowledge Base for fast responses
        const KNOWLEDGE_BASE = {
            "items": "We accept a wide range of e-waste including: smartphones, laptops, tablets, chargers, batteries, desktop computers, monitors, printers, televisions, air conditioners, microwaves, and small household appliances.",
            "recycle": "Recycling e-waste with E-Suraksha is easy! Just go to the Dispose section, select your device category, fill in details, and schedule a pickup. You'll earn Eco-Coins for every item recycled!",
            "purpose": "Our mission is to reduce environmental impact by ensuring electronic waste is disposed of responsibly, recovering precious metals and preventing toxic leakages into soil and water.",
            "collectors": "Our certified collectors are trained professionals who ensure secure handling and transportation of your electronic waste to authorized recycling facilities.",
            "rewards": "You earn Eco-Coins for every successful recycling transaction. These coins can be redeemed in the Rewards Store for vouchers, electronics, merchandise, or donations to green causes!",
            "contact": "You can reach our support team via the contact form on the platform. Use the notification bell for real-time updates on your pickups."
        };

        if (lowerMsg.includes("item") || lowerMsg.includes("what can i") || lowerMsg.includes("accept")) return { text: KNOWLEDGE_BASE.items };
        if (lowerMsg.includes("recycle") || lowerMsg.includes("how to") || lowerMsg.includes("dispose")) return { text: KNOWLEDGE_BASE.recycle };
        if (lowerMsg.includes("purpose") || lowerMsg.includes("mission") || lowerMsg.includes("why")) return { text: KNOWLEDGE_BASE.purpose };
        if (lowerMsg.includes("collector")) return { text: KNOWLEDGE_BASE.collectors };
        if (lowerMsg.includes("reward") || lowerMsg.includes("coin") || lowerMsg.includes("point")) return { text: KNOWLEDGE_BASE.rewards };
        if (lowerMsg.includes("contact") || lowerMsg.includes("support") || lowerMsg.includes("help")) return { text: KNOWLEDGE_BASE.contact };

        // Call Groq API
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: userMessage }
                ],
                max_tokens: 200,
                temperature: 0.5
            }),
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error?.message || `Groq API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return {
            text: data.choices[0].message.content
        };
    } catch (error) {
        console.error("Error getting chat response:", error);
        return {
            text: `⚠️ Chat Error: ${error.message}. Please check your API key and network connection.`
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
