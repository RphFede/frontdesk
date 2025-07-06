/**
 * Inicialización del sistema de navegación SPA
 * Este script se encarga de inicializar la navegación SPA y gestionar la visualización de las vistas
 * 
 * Modificado para trabajar en conjunto con React Router DOM
 */

// Verificar que estamos en el cliente antes de acceder a APIs del navegador
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la navegación SPA
    initSPA();
  });
}

/**
 * Inicializa el sistema de navegación SPA
 */
function initSPA() {
  // Obtener la ruta actual de la URL
  const currentPath = window.location.pathname.substring(1) || 'dashboard';
  
  // Mostrar la vista correspondiente a la ruta actual
  showView(currentPath);
  
  // No agregamos el listener popstate aquí porque React Router DOM ya maneja los eventos de navegación
  // window.addEventListener('popstate', handlePopState);
}

/**
 * Muestra una vista específica y oculta las demás
 * @param {string} viewName - Nombre de la vista a mostrar (dashboard, invoices, loadbill, settings)
 */
function showView(viewName) {
  // Normalizar el nombre de la vista
  const target = viewName || 'dashboard';
  
  // Ocultar todas las vistas
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });
  
  // Mostrar la vista seleccionada
  const targetView = document.getElementById(`${target}-view`);
  if (targetView) {
    targetView.classList.add('active');
  } else {
    console.warn(`Vista no encontrada: ${target}-view`);
  }
  
  // Actualizar la clase activa en los botones de navegación
  updateActiveNavButton(target);
  
  // Actualizar la URL si no estamos siendo llamados desde React Router
  // (evita bucles infinitos de navegación)
  if (!window.reactRouterNavigating) {
    // Usar history.pushState para cambiar la URL sin recargar la página
    const newPath = target === 'dashboard' ? '/' : `/${target}`;
    window.history.pushState({}, '', newPath);
  }
}

/**
 * Actualiza el botón de navegación activo
 * @param {string} target - Nombre de la vista activa
 */
function updateActiveNavButton(target) {
  // Eliminar la clase 'active' de todos los botones
  document.querySelectorAll('.button-wrapper').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Añadir la clase 'active' al botón correspondiente
  const activeButton = document.querySelector(`.nav-${target}`).closest('.button-wrapper');
  if (activeButton) {
    activeButton.classList.add('active');
  }
}

/**
 * Maneja los eventos de navegación del historial del navegador
 * @param {PopStateEvent} event - Evento popstate
 */
function handlePopState(event) {
  const path = window.location.pathname.substring(1) || 'dashboard';
  showView(path);
}

// Exponer la función showView globalmente para que pueda ser utilizada por otros scripts
window.showView = showView;