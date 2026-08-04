import { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    where,
    getDocs
} from 'firebase/firestore';

export const useController = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRecycled: 0, // In tons or kgs, mocked or calculated
        activeCollectors: 0,
        openComplaints: 0
    });
    const [requests, setRequests] = useState([]);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        // 1. Fetch Requests (Collections)
        const requestsQuery = query(collection(db, 'collections'), orderBy('createdAt', 'desc'));
        const unsubRequests = onSnapshot(requestsQuery, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRequests(list);

            // Calculate stats from requests
            const recycled = list.filter(r => r.status === 'completed').length * 5; // Approx 5kg per device for demo
            setStats(prev => ({ ...prev, totalRecycled: recycled }));
        });

        // 2. Fetch Users
        const usersQuery = query(collection(db, 'users'));
        const unsubUsers = onSnapshot(usersQuery, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(list);

            const collectors = list.filter(u => u.role === 'collector').length;
            setStats(prev => ({
                ...prev,
                totalUsers: list.length,
                activeCollectors: collectors
            }));
        });

        // 3. Fetch Products (if different from collections, assuming 'products' collection exists for listing)
        // Check if we have a separate 'products' collection or if 'collections' covers it.
        // Based on previous code, user lists products which become 'collections'. 
        // Let's assume 'products' might be the initial listing before it enters collection flow, 
        // or we just use 'collections' as the source of truth for products.
        // For 'ProductsManagementPage', we might want to see all items. 
        // Let's rely on 'collections' for now as that's what we built.

        setLoading(false);

        return () => {
            unsubRequests();
            unsubUsers();
        };
    }, []);

    const updateRequestStatus = async (id, status, additionalData = {}) => {
        const ref = doc(db, 'collections', id);
        await updateDoc(ref, { status, ...additionalData });
    };

    const updateUserRole = async (uid, role) => {
        const ref = doc(db, 'users', uid);
        await updateDoc(ref, { role });
    };

    const assignCollector = async (requestId, collectorId) => {
        const ref = doc(db, 'collections', requestId);
        await updateDoc(ref, {
            status: 'assigned',
            collectorId,
            assignedAt: new Date()
        });
    };

    return {
        stats,
        requests,
        users,
        loading,
        updateRequestStatus,
        updateUserRole,
        assignCollector
    };
};
