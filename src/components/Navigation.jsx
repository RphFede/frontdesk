import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import '../styles/navigation-react.css';

// Definición de los elementos de navegación (igual que en Navigation.astro)
const navigationItems = [
  {
    icon: "/svg/dollar.svg",
    label: "Resumen",
    customClass: "nav-dashboard",
    target: "dashboard"
  },
  {
    icon: "/svg/bill.svg",
    label: "Cargar Factura",
    customClass: "nav-loadbill",
    target: "loadbill"
  },
  {
    icon: "/svg/bill-list.svg",
    label: "Listado de facturas",
    customClass: "nav-invoices",
    target: "invoices"
  },
  {
    icon: "/svg/settings.svg",
    label: "Configuración",
    customClass: "nav-settings",
    target: "settings"
  }
];

// Mapeo de gradientes para los estilos (igual que en Navigation.astro)
const gradientMapping = {
  orange: "linear-gradient(#FF8C00, #FFA500)",
  lightBlue: "linear-gradient(#87CEEB, #ADD8E6)",
  offWhite: "#F5F5F5"
};

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeView, setActiveView] = useState('');
  
  // Efecto para determinar la vista activa basada en la URL actual
  useEffect(() => {
    // Verificar que estamos en el cliente antes de acceder a APIs del navegador
    if (typeof window !== 'undefined') {
      // Extraer el nombre de la vista de la URL (sin el '/')
      const currentPath = location.pathname.substring(1) || 'dashboard';
      setActiveView(currentPath);
      
      // Llamar a la función global showView para mantener compatibilidad con el sistema existente
      if (window.showView) {
        window.showView(currentPath);
      } else {
        // Fallback si la función global no está disponible
        showViewFallback(currentPath);
      }
    }
  }, [location]);
  
  // Función de respaldo para mostrar una vista específica si la global no está disponible
  const showViewFallback = (target) => {
    // Verificar que estamos en el cliente antes de acceder a APIs del navegador
    if (typeof document !== 'undefined') {
      // Ocultar todas las vistas
      document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
      });
      
      // Mostrar la vista seleccionada
      const targetView = document.getElementById(`${target}-view`);
      if (targetView) {
        targetView.classList.add('active');
      }
    }
  };
  
  // Función para manejar la navegación
  const handleNavigation = (target) => {
    // Navegar a la ruta correspondiente usando React Router
    navigate(`/${target === 'dashboard' ? '' : target}`);
    
    // Verificar que estamos en el cliente antes de acceder a APIs del navegador
    if (typeof window !== 'undefined') {
      // Indicar que la navegación viene desde React Router para evitar bucles
      window.reactRouterNavigating = true;
      
      // También podemos llamar a la función global showView para mantener compatibilidad
      if (window.showView) {
        window.showView(target);
      }
      
      // Restablecer la bandera después de un breve retraso
      setTimeout(() => {
        window.reactRouterNavigating = false;
      }, 100);
    }
  };
  
  return (
    <nav>
      {navigationItems.map((item, index) => (
        <div 
          key={index} 
          className={`button-wrapper ${activeView === item.target ? 'active' : ''}`}
        >
          <button
            type="button"
            className={`btn-layout ${item.customClass || ""}`}
            aria-label={item.label}
            onClick={() => handleNavigation(item.target)}
          >
            <div className="icon-wrapper">
              <span className="btn-layout__back"></span>
              <span className="btn-layout__front">
                <span className="btn-layout__icon" aria-hidden="true">
                  <img 
                    src={item.icon} 
                    alt={item.label} 
                    width="24" 
                    height="24" 
                  />
                </span>
              </span> 
            </div>
            <span className="btn-label">{item.label}</span>
          </button>
        </div>
      ))}
    </nav>
  );
};

export default Navigation;