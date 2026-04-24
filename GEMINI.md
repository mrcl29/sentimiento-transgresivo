# Contexto del Proyecto: Sentimiento Transgresivo

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## 🎯 Objetivo
Aplicación web interactiva que visualiza y compara métricas musicales (valencia, energía, bailabilidad) y análisis de sentimiento (NLP) de las discografías de Extremoduro y Robe.

## 🛠️ Stack Tecnológico Principal
- **Framework Web:** Next.js (App Router, versión 14/15+)
- **Lenguaje:** TypeScript (Tipado estricto obligatorio)
- **Estilos:** Tailwind CSS (Uso de clases utilitarias, diseño oscuro por defecto).
- **Runtime y Paquetes:** Bun
- **Procesamiento de Datos (Offline):** Python, `pandas`, `pysentimiento`.

## 🏗️ Reglas de Arquitectura y Desarrollo

1. **Estrategia de Datos (Pre-computados):** - La aplicación web NO procesa Machine Learning en tiempo real.
   - Todo el análisis complejo de Python se exporta estáticamente a `src/data/dataset.json`.
   - La web debe consumir este JSON directamente para garantizar tiempos de carga instantáneos (0ms de latencia de base de datos).

2. **Convenciones de Código (Next.js & React):**
   - Usa Server Components por defecto por motivos de rendimiento.
   - Usa Client Components (`"use client"`) ÚNICAMENTE para interactividad (ej. gráficos, sliders, selectores de canciones).
   - Crea interfaces en TypeScript para la estructura del `dataset.json` (ej. `interface Track`, `interface SentimentMertrics`).

3. **Interfaz de Usuario (UI):**
   - Diseño brutalista, oscuro y limpio (acorde a la temática del Rock Transgresivo).
   - Componentes modulares dentro de `src/components/`.

4. **Reglas para la IA:**
   - Escribe código conciso, sin explicaciones redundantes a menos que se solicite.
   - Prioriza soluciones nativas de Tailwind CSS antes que crear CSS personalizado.
   - Al sugerir scripts de Python, asegúrate de que el output final siempre formatee correctamente el JSON esperado por el frontend.
