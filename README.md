# Guía de JavaScript en Astro

## Índice
1. [Introducción a Astro](#introducción-a-astro)
2. [Estructura de un componente Astro](#estructura-de-un-componente-astro)
3. [JavaScript en Astro](#javascript-en-astro)
4. [Análisis detallado de la línea de código](#análisis-detallado-de-la-línea-de-código)
5. [Event Listeners en Astro](#event-listeners-en-astro)
6. [Ejemplo adicional con Event Listeners](#ejemplo-adicional-con-event-listeners)
7. [Tabla de comandos y sintaxis JavaScript en Astro](#tabla-de-comandos-y-sintaxis-javascript-en-astro)
8. [Referencias y documentación](#referencias-y-documentación)

## Introducción a Astro

Astro es un framework web moderno que permite construir sitios web rápidos con menos JavaScript. Combina lo mejor de los frameworks modernos con un enfoque en la velocidad y la simplicidad.

Astro funciona de manera diferente a otros frameworks como React o Vue, ya que utiliza un enfoque de "islas" (islands architecture), donde solo se envía JavaScript al navegador cuando es necesario.

## Estructura de un componente Astro

Un componente Astro tiene tres partes principales:

1. **Frontmatter** - El código entre los guiones triples (`---`) al principio del archivo
2. **Plantilla HTML** - El código HTML después del frontmatter
3. **Estilos y Scripts** - Etiquetas `<style>` y `<script>` al final del archivo

```astro
---
// 1. Frontmatter (JavaScript/TypeScript)
// Aquí se ejecuta en el servidor durante la compilación
---

<!-- 2. Plantilla HTML (con expresiones JavaScript) -->
<div>Contenido HTML</div>

<style>
  /* 3. Estilos CSS */
</style>

<script>
  // 4. JavaScript del lado del cliente
  // Este código se ejecuta en el navegador
</script>
```

## JavaScript en Astro

### JavaScript en el Frontmatter

El código JavaScript en el frontmatter (entre los `---`) se ejecuta **solo en el servidor** durante la compilación. Aquí es donde defines variables, importas componentes, haces peticiones a APIs, etc.

```astro
---
// Esto se ejecuta en el servidor durante la compilación
const miVariable = "Hola mundo";
const { pathname } = Astro.url; // Obtiene la ruta actual

// Puedes definir interfaces, tipos, etc. (TypeScript)
interface MiInterfaz {
  propiedad: string;
}

// Puedes definir arrays, objetos, etc.
const miArray = [1, 2, 3];
---
```

### ¿Por qué hay que definir variables en el frontmatter?

En Astro, el código en el frontmatter se ejecuta en el servidor durante la compilación, mientras que el código en las etiquetas `<script>` se ejecuta en el navegador. Por lo tanto:

- Las variables definidas en el frontmatter están disponibles para usar en la plantilla HTML
- Las variables definidas en el frontmatter NO están disponibles en las etiquetas `<script>` (a menos que las pases explícitamente)
- El código en el frontmatter no aumenta el tamaño del JavaScript enviado al navegador

### JavaScript en la plantilla HTML

Puedes usar expresiones JavaScript en la plantilla HTML usando llaves `{}`:

```astro
<div>{miVariable}</div>

<!-- Condicionales -->
{condicion && <p>Se muestra si la condición es verdadera</p>}

<!-- Mapeo de arrays -->
{miArray.map(item => <li>{item}</li>)}

<!-- Operador ternario -->
<div class={condicion ? 'clase1' : 'clase2'}></div>
```

### JavaScript en etiquetas `<script>`

El código en las etiquetas `<script>` se ejecuta en el navegador. Aquí es donde defines comportamientos interactivos, event listeners, etc.

```astro
<script>
  // Esto se ejecuta en el navegador
  document.querySelector('button').addEventListener('click', () => {
    console.log('Botón clickeado');
  });
</script>
```

## Análisis detallado de la línea de código

Vamos a analizar la línea de código que mencionaste:

```astro
class={`button-wrapper ${item.href === pathname ? 'active' : ''}`.trim()}
```

Esta línea está asignando clases CSS a un elemento `<a>` de manera dinámica. Vamos a descomponerla:

1. **Template String (Plantilla de cadena)**: Los backticks `` ` `` permiten crear cadenas de texto que pueden incluir expresiones JavaScript entre `${}`.

2. **Clase base**: `button-wrapper` es la clase CSS que siempre se aplicará al elemento.

3. **Operador de comparación estricta**: `item.href === pathname` compara si la URL del enlace (`item.href`) es exactamente igual a la ruta actual de la página (`pathname`).
   - `item.href` viene del array `navigationItems` definido en el frontmatter
   - `pathname` viene de `const { pathname } = Astro.url;` que obtiene la ruta actual de la URL

4. **Operador ternario**: `? 'active' : ''` es una forma concisa de escribir un condicional:
   - Si `item.href === pathname` es verdadero, añade la clase `active`
   - Si es falso, añade una cadena vacía `''`

5. **Método trim()**: `.trim()` elimina los espacios en blanco al principio y al final de la cadena. Esto es útil para evitar espacios adicionales cuando la condición es falsa.

En lenguaje natural, esta línea dice:

> "Aplica siempre la clase 'button-wrapper' a este elemento. Además, si la URL de este enlace coincide exactamente con la ruta actual de la página, añade también la clase 'active'. Finalmente, asegúrate de que no haya espacios innecesarios en la lista de clases."

Esta técnica se usa comúnmente para resaltar el elemento de navegación correspondiente a la página actual, proporcionando retroalimentación visual al usuario sobre dónde se encuentra en el sitio web.

## Event Listeners en Astro

Los event listeners en JavaScript permiten que tu código responda a eventos como clics, desplazamientos, cambios de formulario, etc. En Astro, generalmente se definen en la etiqueta `<script>`.

### Estructura básica de un event listener

```javascript
document.addEventListener('evento', función);
```

Donde:
- `evento` es el nombre del evento (como 'click', 'scroll', 'submit', etc.)
- `función` es la función que se ejecutará cuando ocurra el evento

### Análisis del script en Navigation.astro

```javascript
// Función para actualizar el estado activo de los enlaces de navegación
function updateActiveNavLinks() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('nav .button-wrapper');
  
  navLinks.forEach(link => {
    // Comparamos la ruta del enlace con la ruta actual
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Ejecutar cuando la página se carga inicialmente
updateActiveNavLinks();

// Ejecutar cuando hay una transición de página con Astro
document.addEventListener('astro:page-load', updateActiveNavLinks);
```

Este script hace lo siguiente:

1. Define una función `updateActiveNavLinks` que:
   - Obtiene la ruta actual con `window.location.pathname`
   - Selecciona todos los enlaces de navegación con `document.querySelectorAll('nav .button-wrapper')`
   - Para cada enlace, compara su atributo `href` con la ruta actual
   - Si coinciden, añade la clase `active`; si no, la elimina

2. Ejecuta la función inmediatamente cuando se carga el script

3. Añade un event listener para el evento `astro:page-load`, que es específico de Astro y se dispara cuando se completa una transición de página. Esto asegura que los enlaces de navegación se actualicen correctamente cuando el usuario navega entre páginas sin recargar completamente el sitio.

### Diferencia entre JavaScript en el servidor y en el cliente

Es importante entender la diferencia entre:

1. **JavaScript en el frontmatter (servidor)**:
   ```astro
   ---
   const { pathname } = Astro.url; // Se ejecuta en el servidor durante la compilación
   ---
   <a class={pathname === '/ruta' ? 'active' : ''}>Enlace</a>
   ```

2. **JavaScript en el script (cliente)**:
   ```astro
   <script>
     const currentPath = window.location.pathname; // Se ejecuta en el navegador
     // Código para actualizar clases basado en la ruta
   </script>
   ```

La primera versión establece las clases durante la compilación y no cambiará hasta que la página se vuelva a cargar o compilar. La segunda versión puede responder a cambios en tiempo real en el navegador.

## Ejemplo adicional con Event Listeners

Aquí hay un ejemplo de un contador simple que utiliza event listeners:

```astro
---
// Este código se ejecuta en el servidor durante la compilación
const valorInicial = 0;
---

<div class="contador">
  <h2>Contador: <span id="valor">{valorInicial}</span></h2>
  <button id="incrementar">Incrementar</button>
  <button id="decrementar">Decrementar</button>
  <button id="reiniciar">Reiniciar</button>
</div>

<script>
  // Este código se ejecuta en el navegador
  let contador = 0;
  const valorElement = document.getElementById('valor');
  
  // Event listener para el botón incrementar
  document.getElementById('incrementar').addEventListener('click', () => {
    contador++;
    valorElement.textContent = contador;
  });
  
  // Event listener para el botón decrementar
  document.getElementById('decrementar').addEventListener('click', () => {
    contador--;
    valorElement.textContent = contador;
  });
  
  // Event listener para el botón reiniciar
  document.getElementById('reiniciar').addEventListener('click', () => {
    contador = 0;
    valorElement.textContent = contador;
  });
  
  // También podemos escuchar otros eventos, como el teclado
  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
      contador++;
    } else if (event.key === 'ArrowDown') {
      contador--;
    } else if (event.key === 'r') {
      contador = 0;
    }
    valorElement.textContent = contador;
  });
</script>
```

## Tabla de comandos y sintaxis JavaScript en Astro

### Sintaxis básica de JavaScript

| Sintaxis | Descripción | Ejemplo |
|----------|-------------|--------|
| `const` | Define una variable constante (no se puede reasignar) | `const nombre = "Juan";` |
| `let` | Define una variable que puede cambiar | `let contador = 0;` |
| `function` | Define una función | `function saludar() { return "Hola"; }` |
| `=>` | Define una función flecha (arrow function) | `const saludar = () => "Hola";` |
| `if/else` | Estructura condicional | `if (condicion) { /* código */ } else { /* código */ }` |
| `? :` | Operador ternario (condicional abreviado) | `condicion ? valorSiVerdadero : valorSiFalso` |
| `&&` | AND lógico (también usado para renderizado condicional) | `condicion && <p>Visible si es verdadero</p>` |
| `||` | OR lógico | `const valor = entrada || valorPorDefecto;` |
| `??` | Operador de coalescencia nula | `const valor = entrada ?? valorPorDefecto;` |
| `.map()` | Transforma cada elemento de un array | `array.map(item => <li>{item}</li>)` |
| `.filter()` | Filtra elementos de un array | `array.filter(item => item > 10)` |
| `.find()` | Encuentra un elemento en un array | `array.find(item => item.id === 5)` |
| `...` | Operador spread (para copiar arrays/objetos) | `const nuevoArray = [...arrayOriginal];` |

### Manipulación del DOM en JavaScript

| Comando | Descripción | Ejemplo |
|---------|-------------|--------|
| `document.querySelector()` | Selecciona el primer elemento que coincida con el selector | `const elemento = document.querySelector('.miClase');` |
| `document.querySelectorAll()` | Selecciona todos los elementos que coincidan | `const elementos = document.querySelectorAll('li');` |
| `document.getElementById()` | Selecciona un elemento por su ID | `const elemento = document.getElementById('miId');` |
| `element.addEventListener()` | Añade un event listener a un elemento | `elemento.addEventListener('click', miFuncion);` |
| `element.classList.add()` | Añade una clase CSS a un elemento | `elemento.classList.add('activo');` |
| `element.classList.remove()` | Elimina una clase CSS de un elemento | `elemento.classList.remove('activo');` |
| `element.classList.toggle()` | Alterna una clase CSS (añade/elimina) | `elemento.classList.toggle('activo');` |
| `element.setAttribute()` | Establece un atributo en un elemento | `elemento.setAttribute('disabled', true);` |
| `element.getAttribute()` | Obtiene el valor de un atributo | `const valor = elemento.getAttribute('href');` |
| `element.textContent` | Obtiene/establece el contenido de texto | `elemento.textContent = 'Nuevo texto';` |
| `element.innerHTML` | Obtiene/establece el HTML interno | `elemento.innerHTML = '<span>HTML</span>';` |

### Comandos específicos de Astro

| Comando | Descripción | Ejemplo |
|---------|-------------|--------|
| `import` | Importa componentes, estilos, etc. | `import MiComponente from '../components/MiComponente.astro';` |
| `Astro.props` | Accede a las props pasadas al componente | `const { titulo } = Astro.props;` |
| `Astro.url` | Obtiene información sobre la URL actual | `const { pathname } = Astro.url;` |
| `Astro.request` | Accede a la información de la solicitud HTTP | `const { headers } = Astro.request;` |
| `Astro.redirect()` | Redirige a otra URL | `return Astro.redirect('/otra-pagina');` |
| `Astro.slots` | Trabaja con slots (contenido insertado) | `const tieneSlot = await Astro.slots.has('nombre');` |
| `astro:page-load` | Evento cuando se completa una transición de página | `document.addEventListener('astro:page-load', callback);` |
| `astro:after-swap` | Evento después de que el contenido se intercambia | `document.addEventListener('astro:after-swap', callback);` |

## Referencias y documentación

- [Documentación oficial de Astro](https://docs.astro.build/es/)
- [Guía de JavaScript en MDN](https://developer.mozilla.org/es/docs/Web/JavaScript)
- [Guía de CSS en MDN](https://developer.mozilla.org/es/docs/Web/CSS)
- [Astro View Transitions](https://docs.astro.build/es/guides/view-transitions/)
- [Componentes en Astro](https://docs.astro.build/es/core-concepts/astro-components/)
- [Scripts en Astro](https://docs.astro.build/es/guides/client-side-scripts/)