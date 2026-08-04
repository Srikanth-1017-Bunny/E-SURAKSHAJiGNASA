import { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    writeBatch,
    limit
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export const useNotifications = (limitCount = 20) => {
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setNotifications([]);
            setUnreadCount(0);
            setLoading(false);
            return;
        }

        setLoading(true);

        // Query for notifications
        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', currentUser.uid),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            }));

            setNotifications(items);

            // Calculate unread count (client-side for simplicity with limit, 
            // for production with millions, use a separate aggregation query or counter in user doc)
            const unread = items.filter(n => !n.read).length;
            setUnreadCount(unread);

            setLoading(false);
        }, (error) => {
            console.error("Error fetching notifications:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser, limitCount]);

    const markAsRead = async (id) => {
        try {
            const ref = doc(db, 'notifications', id);
            await updateDoc(ref, { read: true });
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        const batch = writeBatch(db);
        const unreadNotifications = notifications.filter(n => !n.read);

        if (unreadNotifications.length === 0) return;

        unreadNotifications.forEach(n => {
            const ref = doc(db, 'notifications', n.id);
            batch.update(ref, { read: true });
        });

        try {
            await batch.commit();
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    return {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead
    };
};
