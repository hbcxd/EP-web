import React, { useEffect, useState } from 'react';
// Conexión limpia en minúsculas
import { db } from './firebaseconfig'; 
import { doc, onSnapshot } from 'firebase/firestore';

// ID de la plataforma que vas a renderizar
const PLATFORMA_ID = "Dov8ARmYu9dtt4sOrZq6"; 

export default function App() {
  const [platform, setPlatform] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // CORREGIDO: Ahora apunta directamente a tu colección 'plataformas'
    const docRef = doc(db, 'plataformas', PLATFORMA_ID); 
    
    // Escucha en tiempo real con manejo de errores incorporado
    const unsubscribe = onSnapshot(docRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          setPlatform(docSnap.data());
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error crítico de Firestore:", error);
        setLoading(false); // Evita el bucle de carga infinito si las reglas bloquean el acceso
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-sans">
        <p className="text-sm animate-pulse">Cargando sitio web...</p>
      </div>
    );
  }

  if (!platform) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-sans">
        <p className="text-sm">El sitio web solicitado no se encuentra disponible.</p>
      </div>
    );
  }

  const { appearance = {}, navigation = { links: [] }, blocks = [] } = platform;

  // Estilos base controlados en vivo desde tu plataforma madre
  const mainStyle = {
    backgroundColor: appearance.bgColor || '#0f172a',
    color: appearance.textColor || '#ffffff'
  };

  return (
    <div style={mainStyle} className="min-h-screen font-sans transition-colors duration-300">
      
      {/* 1. BARRA DE NAVEGACIÓN DINÁMICA */}
      <nav 
        style={{ backgroundColor: appearance.surfaceColor || '#1e293b' }} 
        className="sticky top-0 z-50 border-b border-white/10 px-6 py-4 shadow-md"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-lg font-bold" style={{ color: appearance.textColor }}>
            {platform.name}
          </span>
          <ul className="flex gap-6 text-sm font-medium">
            {navigation.links && navigation.links.map((link, idx) => (
              <li key={idx}>
                <a href={link.url} className="hover:opacity-80 transition-opacity" style={{ color: appearance.textColor }}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* 2. PROCESADOR DE BLOQUES DINÁMICOS */}
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-20">
        {blocks && blocks.map((block, idx) => {
          
          // CASO A: HERO (PORTADA PRINCIPAL)
          if (block.type === 'hero') {
            return (
              <section key={idx} className="grid md:grid-cols-2 gap-8 items-center py-8">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ color: appearance.textColor }}>
                    {block.title}
                  </h1>
                  <p className="text-lg opacity-80">{block.content || block.subtitle}</p>
                  {block.buttonText && (
                    <button 
                      style={{ backgroundColor: appearance.primaryColor || '#3b82f6', color: '#ffffff' }}
                      className="px-6 py-3 rounded-xl font-semibold shadow-lg hover:brightness-110 transition-all text-sm"
                    >
                      {block.buttonText}
                    </button>
                  )}
                </div>
                {block.imageUrl && (
                  <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    <img src={block.imageUrl} alt={block.title} className="w-full h-auto object-cover max-h-[400px]" />
                  </div>
                )}
              </section>
            );
          }

          // CASO B: TARJETAS (CATÁLOGO / SERVICIOS) - Vinculado con tu Panel Madre
          if (block.type === 'tarjetas') {
            return (
              <section key={idx} className="space-y-6">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <h2 className="text-2xl font-bold" style={{ color: appearance.textColor }}>{block.title}</h2>
                  <p className="text-sm opacity-80">{block.content || block.subtitle}</p>
                </div>
                
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {block.items && block.items.map((item, itemIdx) => (
                    <div 
                      key={itemIdx} 
                      style={{ backgroundColor: appearance.surfaceColor || '#1e293b' }}
                      className="rounded-2xl p-5 border border-white/5 shadow-xl flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        {item.imageUrl && (
                          <div className="rounded-xl overflow-hidden h-48 bg-black/20">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <h3 className="font-bold text-lg" style={{ color: appearance.textColor }}>{item.title}</h3>
                        <p className="text-sm opacity-70 line-clamp-3">{item.description}</p>
                      </div>
                      
                      {item.price && (
                        <div className="pt-2 flex items-center justify-between">
                          <span className="font-bold text-lg" style={{ color: appearance.primaryColor }}>{item.price}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          return null;
        })}
      </main>
    </div>
  );
}