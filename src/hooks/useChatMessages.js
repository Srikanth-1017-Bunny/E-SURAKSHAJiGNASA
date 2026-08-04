import { useState, useEffect, useRef } from 'react';
import { db } from '../utils/firebase';
import {
    collection, query, orderBy, limit, onSnapshot,
    addDoc, serverTimestamp, updateDoc, doc, getDoc
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export const useChatMessages = (chatId) => {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const unsubscribeRef = useRef(null);

    useEffect(() => {
        if (!chatId) return;

        setLoading(true);
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'), limit(50));

        unsubscribeRef.current = onSnapshot(q, async (snapshot) => {
            const chatDoc = await getDoc(doc(db, 'chats', chatId));
            const chatData = chatDoc.data();

            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                chatInfo: chatData
            }));
            setMessages(msgs);
            setLoading(false);
        }, (err) => {
            console.error("Error sub messages:", err);
            setLoading(false);
        });

        return () => {
            if (unsubscribeRef.current) unsubscribeRef.current();
        };
    }, [chatId]);

    const sendMessage = async (text, type = 'text', attachment = null) => {
        if (!text && !attachment) return;

        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const chatRef = doc(db, 'chats', chatId);

        try {
            await addDoc(messagesRef, {
                text,
                senderId: currentUser.uid,
                createdAt: serverTimestamp(),
                type,
                attachment // URL if image/file
            });

            // Update last message on main chat doc
            await updateDoc(chatRef, {
                lastMessage: {
                    text: type === 'image' ? 'Image sent' : text,
                    senderId: currentUser.uid,
                    createdAt: serverTimestamp()
                },
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    };

    return { messages, loading, sendMessage };
};
