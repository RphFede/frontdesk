# Decisiones de Diseño - FrontDesk

## Filosofía de Desarrollo: Simplicidad sobre Escalabilidad

### Contexto del Proyecto

FrontDesk es una aplicación de escritorio pequeña y de uso casero, diseñada específicamente para la gestión básica de facturas y datos. Dado su alcance limitado y su propósito específico, se han tomado decisiones arquitectónicas que priorizan la simplicidad y eficiencia de desarrollo.

### Decisiones Clave

#### 1. Simplificación de Clases CSS

**Decisión**: Utilizar clases genéricas (`button`, `nav`, etc.) en lugar de metodologías como BEM (`icon-btn__element`).

**Justificación**:
- **Alcance limitado**: La aplicación no requiere múltiples variantes de componentes
- **Mantenimiento simplificado**: Menos clases = menos lugares donde buscar estilos
- **Eficiencia de desarrollo**: Reducción de verbosidad innecesaria
- **Principio YAGNI**: "You Aren't Gonna Need It" - no necesitamos la flexibilidad que ofrecen patrones más complejos

#### 2. Estructura de Componentes Directa

**Decisión**: Evitar sobre-abstracción en componentes pequeños.

**Justificación**:
- **Contexto apropiado**: Aplicación de uso específico sin planes de escalabilidad masiva
- **Legibilidad**: Código más directo y fácil de entender
- **Pragmatismo**: Aplicar la complejidad justa para el problema a resolver

### Principios Aplicados

1. **"Si funciona, para qué cambiarlo"**: Evitar optimizaciones prematuras
2. **Simplicidad sobre purismo**: Priorizar soluciones directas sobre patrones "perfectos"
3. **Contexto sobre convención**: Adaptar las mejores prácticas al contexto específico

### Consideraciones para el Futuro

Esta decisión arquitectónica es **apropiada para el contexto actual**. Si el proyecto evoluciona hacia:
- Múltiples desarrolladores
- Escalabilidad significativa
- Reutilización de componentes complejos

Entonces sería momento de reevaluar y aplicar patrones más estructurados.

### Conclusión

La **sobreingeniería puede ser tan problemática como la falta de estructura**. Este proyecto demuestra que entender las mejores prácticas incluye saber cuándo aplicarlas apropiadamente según el contexto.

---

*Esta documentación refleja decisiones conscientes de diseño, no limitaciones técnicas.*