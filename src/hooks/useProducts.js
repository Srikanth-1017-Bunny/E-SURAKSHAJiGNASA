import { useState, useEffect } from 'react';
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    doc,
    deleteDoc,
    updateDoc,
    orderBy,
    serverTimestamp,
    getDoc,
    runTransaction,
    increment
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();

    const fetchProducts = async (filters = {}) => {
        setLoading(true);
        try {
            let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));

            if (filters.category && filters.category !== 'All') {
                q = query(q, where('category', '==', filters.category));
            }

            // Client-side filtering for some props might be needed if composite indexes aren't set up yet
            // but let's try to stick to queries where possible.

            const querySnapshot = await getDocs(q);
            const fetchedProducts = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setProducts(fetchedProducts);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserProducts = async (userId) => {
        setLoading(true);
        try {
            const q = query(collection(db, 'products'), where('sellerId', '==', userId));
            const querySnapshot = await getDocs(q);
            const fetchedProducts = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            setProducts(fetchedProducts);
            return fetchedProducts;
        } catch (error) {
            console.error("Error fetching user products:", error);
            // toast.error("Failed to load your products"); // Suppress if e.g. index issue
            return [];
        } finally {
            setLoading(false);
        }
    };

    const getProductById = async (id) => {
        setLoading(true);
        try {
            const docRef = doc(db, 'products', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            }
            return null;
        } catch (error) {
            console.error("Error getting product:", error);
            return null;
        } finally {
            setLoading(false);
        }
    }

    const addProduct = async (productData) => {
        setLoading(true);
        try {
            let newProductId = null;

            await runTransaction(db, async (transaction) => {
                const productsRef = collection(db, 'products');
                const productDocRef = doc(productsRef);
                newProductId = productDocRef.id;

                const userRef = doc(db, 'users', currentUser.uid);

                // 1. Create product document
                const fullProductData = {
                    status: 'pending',
                    verificationStatus: 'pending',
                    views: 0,
                    ...productData,
                    sellerId: currentUser.uid,
                    sellerName: currentUser.displayName || currentUser.email.split('@')[0],
                    createdAt: serverTimestamp()
                };

                transaction.set(productDocRef, fullProductData);

                // 2. Identify reward type and amount
                const condition = (productData.condition || '').toLowerCase();
                let amount = 0;
                let type = "";
                let message = "";

                if (condition === 'working' || condition === 'good' || condition === 'fair') {
                    // Credit Wallet
                    amount = Number(productData.price) || 0;
                    type = 'money';
                    transaction.update(userRef, {
                        walletBalance: increment(amount)
                    });
                    message = `Instant credit: ₹${amount} added to your wallet for listing ${productData.title}.`;
                } else {
                    // Credit Coins
                    amount = Number(productData.aiScanData?.ecoPoints) || 100;
                    type = 'coins';
                    transaction.update(userRef, {
                        coinsBalance: increment(amount)
                    });
                    message = `Instant reward: ${amount} EcoCoins credited for listing ${productData.title}.`;
                }

                // 3. Add Transaction Record
                const transRef = doc(collection(userRef, 'transactions'));
                transaction.set(transRef, {
                    type: type,
                    amount: amount,
                    title: productData.title,
                    description: type === 'money' ? 'Instant payout for listing' : 'Instant points for listing',
                    status: 'completed',
                    createdAt: serverTimestamp()
                });

                // 4. Add Notification
                const notifRef = doc(collection(db, 'notifications'));
                transaction.set(notifRef, {
                    userId: currentUser.uid,
                    title: "Listing Reward Credited",
                    message: message,
                    type: 'success',
                    read: false,
                    createdAt: serverTimestamp()
                });
            });

            toast.success("Product listed & Reward credited!");
            return newProductId;
        } catch (error) {
            console.error("Error adding product with reward:", error);
            toast.error("Failed to list product or credit reward");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        setLoading(true);
        try {
            await deleteDoc(doc(db, 'products', id));
            setProducts(prev => prev.filter(p => p.id !== id));
            toast.success("Product deleted");
        } catch (error) {
            console.error("Error deleting product", error);
            toast.error("Failed to delete product");
        } finally {
            setLoading(false);
        }
    }

    return {
        products,
        loading,
        fetchProducts,
        fetchUserProducts,
        addProduct,
        getProductById,
        deleteProduct
    };
};
