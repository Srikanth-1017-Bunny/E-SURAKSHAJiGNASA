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
 * Get AI response for chatbot from Gemini Backend
 */
export const getChatResponse = async (userMessage) => {
    try {
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const response = await fetch(`${baseUrl}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: userMessage }),
        });

        if (!response.ok) {
            throw new Error("Backend response was not ok");
        }

        const data = await response.json();
        return {
            text: data.reply
        };
    } catch (error) {
        console.error("Error getting chat response:", error);
        return {
            text: "Sorry, I'm having trouble connecting to my brain right now. Please try again soon!"
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
