import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from 'fs';

const firebaseConfig = {
    apiKey: "AIzaSyB7hssnDbxtUeTsbaqJ0vT-7SfqkLqe5p0",
    authDomain: "jignasa-2026.firebaseapp.com",
    projectId: "jignasa-2026",
    storageBucket: "jignasa-2026.firebasestorage.app",
    messagingSenderId: "195318175361",
    appId: "1:195318175361:web:04c52a8c6087182fee1f80"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const cities = {
    Hyderabad: { lat: 17.3850, lng: 78.4867 },
    Nizamabad: { lat: 18.6704, lng: 78.0937 },
    Medchal: { lat: 17.6294, lng: 78.4811 }
};

const collectors = [
    { name: "Sainath Collector", city: "Hyderabad" },
    { name: "Hyd Collector 2", city: "Hyderabad" },
    { name: "Hyd Collector 3", city: "Hyderabad" },
    { name: "Hyd Collector 4", city: "Hyderabad" },
    { name: "Hyd Collector 5", city: "Hyderabad" },
    { name: "Nzb Collector 1", city: "Nizamabad" },
    { name: "Nzb Collector 2", city: "Nizamabad" },
    { name: "Nzb Collector 3", city: "Nizamabad" },
    { name: "Nzb Collector 4", city: "Nizamabad" },
    { name: "Nzb Collector 5", city: "Nizamabad" },
    { name: "Med Collector 1", city: "Medchal" },
    { name: "Med Collector 2", city: "Medchal" },
    { name: "Med Collector 3", city: "Medchal" },
    { name: "Med Collector 4", city: "Medchal" },
    { name: "Med Collector 5", city: "Medchal" }
];

async function seed() {
    let output = "";
    for (const c of collectors) {
        const email = c.name.toLowerCase().replace(/\s+/g, '') + "@esuraksha.com";
        const password = "Password123!";

        console.log(`Creating auth for ${email}...`);

        let user;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            user = userCredential.user;
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                user = userCredential.user;
            } else {
                console.error("Auth error:", error);
                continue;
            }
        }

        console.log(`Setting up Firestore for ${user.uid}...`);

        const baseLat = cities[c.city].lat;
        const baseLng = cities[c.city].lng;

        const lat = baseLat + (Math.random() * 0.05 - 0.025);
        const lng = baseLng + (Math.random() * 0.05 - 0.025);

        try {
            await setDoc(doc(db, "users", user.uid), {
                email: email,
                role: "collector",
                displayName: c.name,
                name: c.name,
                address: {
                    city: c.city,
                    lat: lat,
                    lng: lng
                },
                createdAt: new Date().toISOString()
            });
            output += `Email: ${email} | Password: ${password} | City: ${c.city}\n`;
        } catch (error) {
            console.error("Firestore error:", error);
        }
    }

    fs.writeFileSync('collectors_credentials.txt', output);
    console.log("Done seeding!");
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
