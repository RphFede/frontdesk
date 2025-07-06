# Guía de Navegación SPA con React Router DOM en FrontDesk

## Descripción General

Este documento explica cómo se ha implementado la navegación SPA (Single Page Application) utilizando React Router DOM en la aplicación FrontDesk, manteniendo la compatibilidad con los componentes Astro existentes.

## Componentes Principales

### 1. Navigation.jsx

Este componente React reemplaza al componente `Navigation.astro` original y proporciona la navegación SPA utilizando React Router DOM.

```jsx
// Características principales:
// - Utiliza useNavigate y useLocation de react-router-dom
// - Mantiene el estado de la vista activa
// - Conserva los estilos y la estructura del componente original
// - Maneja la navegación entre vistas
```

### 2. AppRouter.jsx

Este componente configura las rutas de la aplicación utilizando React Router DOM.

```jsx
// Características principales:
// - Configura BrowserRouter, Routes y Route
// - Define las rutas para cada vista
// - Integra el componente Navigation
// - Mantiene la estructura de la aplicación
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

2. **Navegación**: Al hacer clic en un botón de navegación:
   - `Navigation.jsx` utiliza `useNavigate` para cambiar la URL sin recargar la página
   - React Router DOM actualiza el componente correspondiente a la ruta
   - `spa-init.js` muestra la vista Astro correspondiente

3. **Integración con Astro**: Las vistas Astro originales se mantienen en el DOM pero ocultas, y se muestran/ocultan según la navegación.

## Ventajas de esta Implementación

1. **Sin recarga de página**: Transiciones fluidas entre vistas
2. **Mantenimiento de estado**: El estado de la aplicación se mantiene durante la navegación
3. **URLs amigables**: Las URLs reflejan la vista actual
4. **Compatibilidad con Astro**: No es necesario reescribir las vistas existentes
5. **Escalabilidad**: Facilita la adición de nuevas rutas y vistas

## Consideraciones para el Desarrollo

### Añadir Nuevas Vistas

Para añadir una nueva vista:

1. Crear el componente Astro en la carpeta `views`
2. Añadir el elemento de navegación en `Navigation.jsx`
3. Añadir la ruta en `AppRouter.jsx`
4. Añadir el contenedor de la vista en `index.astro`

### Estilos

Los estilos se mantienen en los archivos originales:

- `app.styl`: Estilos principales de la aplicación
- `navigation.css`: Estilos específicos para la navegación

### Consideraciones de Rendimiento

- Las vistas Astro se cargan todas al inicio, lo que puede afectar el tiempo de carga inicial
- Para aplicaciones más grandes, considerar la carga bajo demanda de las vistas

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

## Conclusión

Esta implementación proporciona una navegación SPA moderna utilizando React Router DOM, manteniendo la compatibilidad con los componentes Astro existentes y preservando los estilos originales. La arquitectura es flexible y escalable, permitiendo añadir nuevas vistas y funcionalidades fácilmente.