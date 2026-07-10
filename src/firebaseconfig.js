import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAP79oeDD4d6stMPXwMToQhQQTEneb6iww",
  authDomain: "base-de-datos-maestra-5a5a7.firebaseapp.com",
  projectId: "base-de-datos-maestra-5a5a7",
  storageBucket: "base-de-datos-maestra-5a5a7.firebasestorage.app",
  messagingSenderId: "998538522792",
  appId: "1:998538522792:web:b80a0239fcc749282b929d",
  measurementId: "G-TTVVXRQR37"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
