import { useState, useEffect } from 'react';
import { doc, onSnapshot, collection, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';

export const useUserWallet = () => {
    const { currentUser } = useAuth();
    const [wallet, setWallet] = useState({
        walletBalance: 0,
        coinsBalance: 0
    });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        // Wallet Balance Listener
        const unsubWallet = onSnapshot(doc(db, 'users', currentUser.uid), (docSlug) => {
            if (docSlug.exists()) {
                const data = docSlug.data();
                setWallet({
                    walletBalance: data.walletBalance || 0,
                    coinsBalance: data.coinsBalance || 0
                });
            }
        }, (error) => {
            console.error("Error reading wallet:", error);
        });

        // Transactions Listener
        const transactionsRef = collection(db, 'users', currentUser.uid, 'transactions');
        const q = query(transactionsRef, orderBy('createdAt', 'desc'), limit(20));

        const unsubTrans = onSnapshot(q, (snapshot) => {
            const trans = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTransactions(trans);
            setLoading(false);
        }, (error) => {
            console.error("Error reading transactions:", error);
            setLoading(false);
        });

        return () => {
            unsubWallet();
            unsubTrans();
        };
    }, [currentUser]);

    return { wallet, transactions, loading };
};
