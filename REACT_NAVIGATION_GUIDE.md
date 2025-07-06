# Guía de Navegación SPA con React Router DOM en FrontDesk

Este documento explica cómo se ha implementado la navegación SPA (Single Page Application) utilizando React Router DOM en la aplicación FrontDesk, manteniendo la compatibilidad con las vistas Astro existentes.

## Componentes Principales

### 1. Navigation.jsx

Este componente React reemplaza al componente `Navigation.astro` original y proporciona la navegación SPA utilizando React Router DOM.

```jsx
// Características principales:
// - Utiliza useNavigate y useLocation de react-router-dom
// - Mantiene compatibilidad con la función global showView
// - Preserva los estilos originales de Navigation.astro
```

### 2. AppRouter.jsx

Este componente configura las rutas de la aplicación utilizando React Router DOM.

```jsx
// Características principales:
// - Configura BrowserRouter, Routes y Route
// - Integra el componente Navigation
// - Define rutas para todas las vistas de la aplicación
```

### 3. spa-init.js

Este script inicializa el sistema de navegación SPA y gestiona la visualización de las vistas Astro.

```js
// Características principales:
// - Se ejecuta al cargar la página
// - Muestra la vista correspondiente a la URL actual
// - Expone la función showView globalmente
// - Maneja eventos de navegación del historial
```

## Cómo Funciona

1. **Inicialización**: Cuando se carga la página, `AppRouter.jsx` configura las rutas y `spa-init.js` inicializa el sistema de navegación.

2. **Navegación**: Cuando el usuario hace clic en un botón de navegación:
   - `Navigation.jsx` utiliza `useNavigate` para cambiar la URL sin recargar la página
   - También llama a la función global `showView` para mostrar la vista correspondiente

3. **Visualización de Vistas**: La función `showView` en `spa-init.js`:
   - Oculta todas las vistas (eliminando la clase `active`)
   - Muestra la vista seleccionada (añadiendo la clase `active`)
   - Actualiza la clase `active` en los botones de navegación

4. **Integración con React Router**: Para evitar bucles infinitos de navegación:
   - Se utiliza una bandera `reactRouterNavigating` para indicar cuando la navegación viene desde React Router
   - La función `showView` no actualiza la URL si es llamada desde React Router

## Archivos Modificados

1. **Navigation.jsx**: Convertido desde Navigation.astro, manteniendo los estilos y la estructura original.

2. **AppRouter.jsx**: Configuración de rutas con React Router DOM.

3. **spa-init.js**: Modificado para trabajar en conjunto con React Router DOM.

4. **navigation-react.css**: Estilos convertidos desde el Stylus original en Navigation.astro.

## Ventajas de esta Implementación

1. **Sin Recarga de Página**: La navegación SPA proporciona una experiencia de usuario más fluida.

2. **URLs Amigables**: Las URLs reflejan la vista actual, permitiendo el uso de marcadores y compartir enlaces.

3. **Compatibilidad con Vistas Existentes**: No es necesario convertir las vistas Astro a componentes React.

4. **Mantenimiento de Estilos**: Se preservan los estilos originales de Navigation.astro.

## Consideraciones Futuras

1. **Conversión Completa a React**: Si se desea, las vistas Astro pueden convertirse gradualmente a componentes React.

2. **Mejora de la Gestión de Estado**: Implementar una solución de gestión de estado como Redux o Context API.

3. **Optimización de Rendimiento**: Implementar carga perezosa (lazy loading) para las vistas.

## Ejemplo de Uso

```jsx
// Navegación programática desde cualquier componente React
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/invoices');
  };
  
  return (
    <button onClick={handleClick}>Ver Facturas</button>
  );
};
```

## Solución de Problemas

1. **Las vistas no se muestran correctamente**: Asegúrate de que los elementos tienen los IDs correctos (dashboard-view, invoices-view, etc.).

2. **Navegación en bucle**: Verifica que la bandera `reactRouterNavigating` se está utilizando correctamente.

3. **Estilos no aplicados**: Comprueba que navigation-react.css está siendo importado correctamente.