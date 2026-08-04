import { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export const useChats = () => {
    const { currentUser } = useAuth();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        const chatsRef = collection(db, 'chats');
        // Query chats where current user is in participants array
        const q = query(
            chatsRef,
            where('participants', 'array-contains', currentUser.uid),
            orderBy('updatedAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const chatList = await Promise.all(snapshot.docs.map(async (docSnap) => {
                const data = docSnap.data();

                // Identify other participant
                const otherUserId = data.participants.find(uid => uid !== currentUser.uid);
                let otherUser = { displayName: 'Unknown User', photoURL: null };

                if (otherUserId) {
                    try {
                        const userDoc = await getDoc(doc(db, 'users', otherUserId));
                        if (userDoc.exists()) {
                            otherUser = userDoc.data();
                        }
                    } catch (err) {
                        console.error("Error fetching user details", err);
                    }
                }

                return {
                    id: docSnap.id,
                    ...data,
                    otherUser,
                    productInfo: {
                        title: data.productTitle,
                        image: data.productImage,
                        id: data.productId
                    }
                };
            }));

            setChats(chatList);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching chats:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    return { chats, loading };
};
