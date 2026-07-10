import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';

// 1. CREDENCIALES DE TU BASE DE DATOS MAESTRA
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
const db = getFirestore(app);

// 2. EL FILTRO MAESTRO: ID único que diferencia esta web de las demás
const CONFIG_DOCUMENT_ID = "Dov8ARmYu9dtt4sOrZq6";

export default function App() {
  const [appearance, setAppearance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escucha únicamente el documento asignado a este proyecto
    const docRef = doc(db, "plataformas", CONFIG_DOCUMENT_ID);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setAppearance(docSnap.data().appearance);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-white">
        <p className="animate-pulse text-xs">Cargando identidad visual...</p>
      </div>
    );
  }

  const dynamicStyles = `
    :root {
      --child-bg: ${appearance?.bgColor || '#0f172a'};
      --child-surface: ${appearance?.surfaceColor || '#1e293b'};
      --child-primary: ${appearance?.primaryColor || '#3b82f6'};
      --child-text: ${appearance?.textColor || '#ffffff'};
    }
    .custom-bg { background-color: var(--child-bg) !important; }
    .custom-surface { background-color: var(--child-surface) !important; }
    .custom-text { color: var(--child-text) !important; }
    .custom-btn { background-color: var(--child-primary) !important; }
  `;

  return (
    <div className="min-h-screen custom-bg custom-text p-6 flex flex-col items-center justify-center">
      <style>${dynamicStyles}</style>
      <div className="custom-surface p-8 rounded-2xl max-w-md w-full text-center border border-white/5 shadow-2xl">
        <h1 className="text-xl font-bold mb-2">Plataforma Sincronizada</h1>
        <p className="text-xs opacity-70 mb-6">Controlada con el ID: ${CONFIG_DOCUMENT_ID}</p>
        <button className="custom-btn w-full py-3 rounded-xl font-medium text-white shadow-lg">Estructura Base</button>
      </div>
    </div>
  );
}