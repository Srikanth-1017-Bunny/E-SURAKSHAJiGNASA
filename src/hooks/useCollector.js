import { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    doc,
    addDoc,
    serverTimestamp,
    updateDoc,
    runTransaction,
    increment
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

export const useCollector = () => {
    const { currentUser } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [availableRequests, setAvailableRequests] = useState([]);
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState({
        totalCollections: 0,
        pendingPickups: 0,
        totalEarnings: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        setLoading(true);

        // Fetch Assignments (Pending Pickups)
        const assignmentsQuery = query(
            collection(db, 'collections'),
            where('collectorId', '==', currentUser.uid),
            where('status', 'in', ['assigned', 'collected'])
        );

        const unsubAssignments = onSnapshot(assignmentsQuery, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Client-side sort by updatedAt
            list.sort((a, b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0));
            setAssignments(list);
            setStats(prev => ({ ...prev, pendingPickups: list.length }));
        }, (error) => {
            console.error("Error fetching assignments:", error);
            // Don't leave it loading forever
            setLoading(false);
        });

        // Fetch History
        const historyQuery = query(
            collection(db, 'collections'),
            where('collectorId', '==', currentUser.uid),
            where('status', '==', 'recycled')
        );

        const unsubHistory = onSnapshot(historyQuery, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Client-side sort by completedAt
            list.sort((a, b) => (b.completedAt?.seconds || 0) - (a.completedAt?.seconds || 0));
            setHistory(list);

            const earnings = list.reduce((sum, item) => sum + (item.incentive || 0), 0);
            setStats(prev => ({
                ...prev,
                totalCollections: list.length,
                totalEarnings: earnings
            }));
            setLoading(false);
        }, (error) => {
            console.error("Error fetching history:", error);
            setLoading(false);
        });

        // Fetch Available Requests (Listed pieces)
        // Fetch Available Requests (Listed pieces)
        // NOTE: Removed orderBy('createdAt', 'desc') to avoid requiring a composite index.
        const availableQuery = query(
            collection(db, 'products'),
            where('status', '==', 'pending'),
            where('condition', '==', 'not-working')
        );

        const unsubAvailable = onSnapshot(availableQuery, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Client-side sort
            list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            setAvailableRequests(list);
        }, (error) => {
            console.error("Error fetching available requests:", error);
        });

        return () => {
            unsubAssignments();
            unsubHistory();
            unsubAvailable();
        };
    }, [currentUser]);

    const acceptRequest = async (product, conditionData = {}) => {
        try {
            // 1. Create collection record
            const collectionData = {
                productId: product.id,
                productTitle: product.title,
                productCondition: conditionData.condition || product.condition, // Verified condition
                productPrice: conditionData.value || product.price || 0, // Verified value
                productEcoPoints: product.aiScanData?.ecoPoints || 0,
                collectorId: currentUser.uid,
                collectorName: currentUser.displayName,
                sellerId: product.sellerId,
                status: 'assigned', // In Transit
                assignedAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                userAddress: product.location,
                incentive: 10
            };

            const collectionRef = await addDoc(collection(db, 'collections'), collectionData);

            // 2. Update product status
            const productRef = doc(db, 'products', product.id);
            await updateDoc(productRef, {
                status: 'in_collection',
                verifiedCondition: conditionData.condition || product.condition
            });

            // Notify User
            await addDoc(collection(db, 'notifications'), {
                userId: product.sellerId,
                title: "Collector Assigned",
                message: `Collector ${currentUser.displayName} is on their way to pick up ${product.title}.`,
                type: 'info',
                read: false,
                createdAt: serverTimestamp()
            });

            toast.success("Request accepted & Route calculated!");
            return collectionRef.id;
        } catch (error) {
            console.error("Error accepting request:", error);
            toast.error("Failed to accept request");
            throw error;
        }
    };

    const rejectRequest = async (product, reason) => {
        try {
            const productRef = doc(db, 'products', product.id);
            // Option A: Set to 'rejected'
            // Option B: Set back to 'pending' just releasing it.
            await updateDoc(productRef, {
                status: 'rejected',
                rejectionReason: reason,
                rejectedBy: currentUser.uid
            });
            toast.info("Request rejected");
        } catch (error) {
            console.error("Error rejecting:", error);
            toast.error("Failed to reject");
        }
    };

    const markAsCollected = async (collectionId) => {
        // This is mainly a wrapper, but real logic is in submitUTR usually. 
        // We will keep it but rely on submitUTR for the heavy lifting including notifications.
        // Actually, let's make sure updateStatusModal uses submitUTR.
        try {
            const collectionRef = doc(db, 'collections', collectionId);
            await updateDoc(collectionRef, {
                status: 'collected',
                collectedAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            toast.success("Item marked as Collected!");
        } catch (error) {
            console.error("Error marking collected:", error);
            toast.error("Update failed");
        }
    };

    const assignToRecycler = async (collectionId, recyclerName) => {
        try {
            const collectionRef = doc(db, 'collections', collectionId);
            // Fetch first to get sellerId for notification
            // (Ideally pass it in, but for safety we fetch or rely on localized state if possible. 
            // collectionRef update doesn't return data. We need to read it or rely on existing state)
            // We can read it in a transaction or just update. 
            // Let's read it to be safe for the notification.

            await runTransaction(db, async (transaction) => {
                const docSnap = await transaction.get(collectionRef);
                if (!docSnap.exists()) throw "Document missing";
                const data = docSnap.data();

                transaction.update(collectionRef, {
                    status: 'recycled', // Moves to History and updates User Dashboard 'Recycled' count
                    recyclerName: recyclerName,
                    shippedAt: serverTimestamp(),
                    completedAt: serverTimestamp(), // Critical for history sort
                    updatedAt: serverTimestamp()
                });

                // Update corresponding product status to 'recycled'
                const productRef = doc(db, 'products', data.productId);
                transaction.update(productRef, {
                    status: 'recycled',
                    recycledAt: serverTimestamp()
                });

                // Notify User
                const notifRef = doc(collection(db, 'notifications'));
                transaction.set(notifRef, {
                    userId: data.sellerId,
                    title: "Item Recycled",
                    message: `Your item ${data.productTitle} has been successfully sent to ${recyclerName}. Thank you for contributing to a greener planet!`,
                    type: 'success',
                    read: false,
                    createdAt: serverTimestamp()
                });
            });

            toast.success(`Sent to ${recyclerName}!`);
        } catch (error) {
            console.error("Error assigning recycler:", error);
            toast.error("Assignment failed");
        }
    };

    const submitUTR = async (collectionId, utr) => {
        if (!utr) {
            toast.warning("Please enter UTR or ID");
            return;
        }

        try {
            await runTransaction(db, async (transaction) => {
                const collectionRef = doc(db, 'collections', collectionId);
                const collectionSnap = await transaction.get(collectionRef);

                if (!collectionSnap.exists()) {
                    throw "Collection record does not exist!";
                }

                const collectionData = collectionSnap.data();
                const userRef = doc(db, 'users', collectionData.sellerId);
                const productRef = doc(db, 'products', collectionData.productId);

                // Update collection
                transaction.update(collectionRef, {
                    utr,
                    status: 'collected', // Item with Collector
                    collectedAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });

                // Update product
                transaction.update(productRef, {
                    status: 'collected'
                });

                // Notify User of Collection (Reward was already sent at listing)
                const notifRef = doc(collection(db, 'notifications'));
                transaction.set(notifRef, {
                    userId: collectionData.sellerId,
                    title: "Item Collected",
                    message: `Your item ${collectionData.productTitle} has been collected by ${currentUser.displayName}.`,
                    type: 'info',
                    read: false,
                    createdAt: serverTimestamp()
                });
            });

            toast.success("Transaction verified & Rewards sent!");
        } catch (error) {
            console.error("Error submitting UTR:", error);
            toast.error("Failed to log pickup");
        }
    };

    const submitComplaint = async (complaintData) => {
        await addDoc(collection(db, 'complaints'), {
            ...complaintData,
            collectorId: currentUser.uid,
            collectorName: currentUser.displayName,
            createdAt: serverTimestamp(),
            status: 'pending'
        });
    };

    return {
        assignments,
        availableRequests,
        history,
        stats,
        loading,
        submitUTR,
        submitComplaint,
        acceptRequest,
        rejectRequest,
        markAsCollected,
        assignToRecycler
    };
};
