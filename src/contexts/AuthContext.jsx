import { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    signInWithPopup
} from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, googleProvider, db } from "../utils/firebase";
import LoadingSpinner from "../components/common/LoadingSpinner";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const signup = async (email, password, role, additionalData = {}) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user document in Firestore with role
        await setDoc(doc(db, "users", user.uid), {
            email,
            role,
            uid: user.uid,
            createdAt: new Date(),
            isVerified: false, // Default to unverified
            ...additionalData
        });

        setUserRole(role);
        return user;
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const loginWithGoogle = async () => {
        // Logic for google auth would need careful role handling
        // For now, simple popup
        return signInWithPopup(auth, googleProvider);
    }

    const logout = () => {
        return signOut(auth);
    };

    useEffect(() => {
        let unsubscribeSnapshot = null;

        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            // Clean up previous snapshot listener if it exists
            if (unsubscribeSnapshot) {
                unsubscribeSnapshot();
                unsubscribeSnapshot = null;
            }

            if (user) {
                // Subscribe to user document for real-time updates (Balance, Coins, Role)
                const userRef = doc(db, "users", user.uid);

                unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        setCurrentUser({ ...user, ...userData });
                        setUserRole(userData.role);
                    } else {
                        // Fallback if doc doesn't exist yet
                        setCurrentUser(user);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Error fetching user data:", error);
                    setLoading(false);
                });
            } else {
                setCurrentUser(null);
                setUserRole(null);
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeSnapshot) unsubscribeSnapshot();
        };
    }, []);

    const value = {
        currentUser,
        userRole,
        login,
        signup,
        logout,
        loginWithGoogle,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? <LoadingSpinner fullScreen text="Initializing App..." /> : children}
        </AuthContext.Provider>
    );
};
