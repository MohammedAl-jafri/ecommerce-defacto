// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB3q3W8ZI2YpAv54Mwg1S00WZwydnAEpug",
  authDomain: "defacto-ecommerce.firebaseapp.com",
  projectId: "defacto-ecommerce",
  storageBucket: "defacto-ecommerce.firebasestorage.app",
  messagingSenderId: "862659967617",
  appId: "1:862659967617:web:1ce966467b80d9df046b80"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
