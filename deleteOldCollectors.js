import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB7hssnDbxtUeTsbaqJ0vT-7SfqkLqe5p0",
    authDomain: "jignasa-2026.firebaseapp.com",
    projectId: "jignasa-2026",
    storageBucket: "jignasa-2026.firebasestorage.app",
    messagingSenderId: "195318175361",
    appId: "1:195318175361:web:04c52a8c6087182fee1f80"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Names to delete (case-insensitive partial match)
const NAMES_TO_DELETE = ['srikar', 'srikath', 'pandu', 'sarayu', 'salman', 'sainath'];

async function deleteOldCollectors() {
    console.log("Fetching all collectors from Firestore...");
    const q = query(collection(db, 'users'), where('role', '==', 'collector'));
    const snap = await getDocs(q);

    const toDelete = [];
    snap.docs.forEach(d => {
        const data = d.data();
        const nameRaw = (data.displayName || data.name || data.email || '').toLowerCase();
        const shouldDelete = NAMES_TO_DELETE.some(n => nameRaw.includes(n));
        if (shouldDelete) {
            toDelete.push({ id: d.id, name: data.displayName || data.name || data.email });
        }
    });

    if (toDelete.length === 0) {
        console.log("No matching collectors found to delete.");
        process.exit(0);
    }

    console.log(`Found ${toDelete.length} collectors to delete:`);
    toDelete.forEach(c => console.log(`  - [${c.id}] ${c.name}`));

    for (const c of toDelete) {
        await deleteDoc(doc(db, 'users', c.id));
        console.log(`  ✓ Deleted: ${c.name}`);
    }

    console.log("\nDone! All old collectors removed.");
    process.exit(0);
}

deleteOldCollectors().catch(err => {
    console.error(err);
    process.exit(1);
});
