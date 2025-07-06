import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import Navigation from './Navigation';

// Componente para renderizar solo en el cliente
const ClientOnly = ({ children }) => {
  const [isMounted, setIsMounted] = React.useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null;
  }
  
  return <>{children}</>;
};

/**
 * AppRouter - Componente principal para la navegación SPA
 * 
 * Este componente configura React Router DOM para manejar la navegación SPA
 * y se integra con las vistas Astro existentes a través del sistema de clases
 * y el script spa-init.js.
 */
const AppRouter = () => {
  // Efecto para inicializar el sistema SPA cuando el componente se monta
  useEffect(() => {
    // Asegurarse de que el script spa-init.js se ha cargado
    if (typeof window !== 'undefined' && !window.showView) {
      console.warn('La función showView no está disponible. Asegúrate de que spa-init.js está cargado correctamente.');
    }
  }, []);

  // Verificar si estamos en el cliente o en el servidor
  if (typeof window === 'undefined') {
    // Renderizado en el servidor: devolver un marcador de posición mínimo
    return <div>Cargando...</div>;
  }
  
  // Renderizado en el cliente
  return (
    <ClientOnly>
      <BrowserRouter>
        <div className="main-layout">
          <Navigation />
          <main className="content">
            <Routes>
              {/* 
                Nota: Estas rutas no renderizan directamente el contenido,
                sino que actúan como puntos de entrada para la navegación.
                El contenido real se muestra/oculta mediante las clases CSS
                controladas por la función showView en spa-init.js
              */}
              <Route path="/" element={<div className="route-container"></div>} />
              <Route path="/dashboard" element={<div className="route-container"></div>} />
              <Route path="/loadbill" element={<div className="route-container"></div>} />
              <Route path="/invoices" element={<div className="route-container"></div>} />
              <Route path="/settings" element={<div className="route-container"></div>} />
              
              {/* Ruta para manejar URLs no encontradas */}
              <Route path="*" element={<div>404 - Página no encontrada</div>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ClientOnly>
  );
};

export default AppRouter;