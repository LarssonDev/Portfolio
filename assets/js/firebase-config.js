import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBCNu6_IeMCwiYEYBiCdpgjoRH4_DlasR4",
    authDomain: "portfolio-d9fb3.firebaseapp.com",
    projectId: "portfolio-d9fb3",
    storageBucket: "portfolio-d9fb3.firebasestorage.app",
    messagingSenderId: "800632601412",
    appId: "1:800632601412:web:66353c44bab6133e603511",
    measurementId: "G-XZ3HHG8MRD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

let analytics;
try {
    analytics = getAnalytics(app);
} catch (e) {
    console.log("Firebase Analytics could not be initialized.");
}

export { app, analytics, db, auth, googleProvider };
