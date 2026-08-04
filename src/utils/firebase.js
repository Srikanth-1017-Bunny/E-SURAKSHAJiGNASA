import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyB7hssnDbxtUeTsbaqJ0vT-7SfqkLqe5p0",
    authDomain: "jignasa-2026.firebaseapp.com",
    projectId: "jignasa-2026",
    storageBucket: "jignasa-2026.firebasestorage.app",
    messagingSenderId: "195318175361",
    appId: "1:195318175361:web:04c52a8c6087182fee1f80"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Enable multiple accounts in different tabs by using session persistence
setPersistence(auth, browserSessionPersistence).catch((error) => {
    console.error("Auth persistence error:", error);
});
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
