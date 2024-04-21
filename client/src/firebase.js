// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-blog-18ba3.firebaseapp.com",
    projectId: "mern-blog-18ba3",
    storageBucket: "mern-blog-18ba3.appspot.com",
    messagingSenderId: "813960313436",
    appId: "1:813960313436:web:0cc82234c8c99ef5c90499",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
