import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB3gW3B2TYPAv54MWg1S80WZwyndAEPug",
  authDomain: "defacto-ecommerce.firebaseapp.com",
  projectId: "defacto-ecommerce",
  storageBucket: "defacto-ecommerce.appspot.com",
  messagingSenderId: "862659967617",
  appId: "1:862659967617:web:1ce196467ab89df046b80e"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
