import { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, runTransaction } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export const useRewards = () => {
    const { currentUser } = useAuth();
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRewards();
    }, []);

    const fetchRewards = async () => {
        setLoading(true);
        try {
            const rewardsRef = collection(db, 'rewards');
            // Check if rewards collection exists or just try to fetch
            const snapshot = await getDocs(rewardsRef);
            const rewardsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRewards(rewardsList);
        } catch (error) {
            console.error("Error fetching rewards:", error);
        } finally {
            setLoading(false);
        }
    };

    const redeemReward = async (reward) => {
        if (!currentUser) throw new Error("Must be logged in");

        try {
            await runTransaction(db, async (transaction) => {
                const userRef = doc(db, 'users', currentUser.uid);
                const userDoc = await transaction.get(userRef);

                if (!userDoc.exists()) throw new Error("User does not exist!");

                const userData = userDoc.data();
                const currentBalance = reward.costType === 'coins' ? userData.coinsBalance : userData.walletBalance;

                if ((currentBalance || 0) < reward.cost) {
                    throw new Error(`Insufficient ${reward.costType}!`);
                }

                // Deduct balance
                const updates = {};
                if (reward.costType === 'coins') {
                    updates.coinsBalance = (userData.coinsBalance || 0) - reward.cost;
                } else {
                    updates.walletBalance = (userData.walletBalance || 0) - reward.cost;
                }
                transaction.update(userRef, updates);

                // Create Transaction Record
                const newTransactionRef = doc(collection(db, 'users', currentUser.uid, 'transactions'));
                transaction.set(newTransactionRef, {
                    type: 'debit',
                    amount: reward.cost,
                    currency: reward.costType === 'coins' ? 'COINS' : 'INR',
                    description: `Redeemed: ${reward.title}`,
                    rewardId: reward.id,
                    createdAt: serverTimestamp()
                });
            });
            return true;
        } catch (error) {
            console.error("Redemption failed:", error);
            throw error;
        }
    };

    return { rewards, loading, redeemReward, refreshRewards: fetchRewards };
};
