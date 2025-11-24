import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyD0-jbIqlCHQO_2bngJ1Y1NPPRw6ibr_lw",
    authDomain: "mastercookerypdf.firebaseapp.com",
    projectId: "mastercookerypdf",
    storageBucket: "mastercookerypdf.firebasestorage.app",
    messagingSenderId: "569645052898",
    appId: "1:569645052898:web:7cd8802c15a9e64875bfbb",
    measurementId: "G-HTNRBR1KD0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export { auth, db, provider };
