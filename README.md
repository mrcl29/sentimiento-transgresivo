# 🎸 Sentimiento Transgresivo

> **Análisis musical y de sentimiento de las discografías de Extremoduro y Robe**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://sentimiento-transgresivo.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

**[→ Ver en vivo](https://sentimiento-transgresivo.vercel.app/)**

---

## ¿Qué es esto?

Una aplicación web interactiva que permite explorar, comparar y analizar la **discografía completa de Extremoduro** y la carrera en solitario de **Robe Iniesta**, cruzando datos musicales de Spotify con análisis de sentimiento de sus letras.

El proyecto nace de una pregunta: *¿es la música de Extremoduro tan oscura como parece, o es una paradoja emocional donde la crudeza sonora convive con algo más?*

---

## ✨ Funcionalidades

### 🎵 Explorador de Discografías
- Galería visual de álbumes con portadas para **Extremoduro** y **Robe en solitario**
- Fondo dinámico que reacciona al hover sobre cada álbum
- Modal de detalle con la lista completa de canciones, ordenable por cualquier columna

### 📊 Métricas de Spotify (Audio Features)
Para cada canción se visualizan los datos extraídos de la Spotify Web API:

| Feature | Descripción |
|---|---|
| **Bailable** | Aptitud para el baile (ritmo, estabilidad del compás) |
| **Energía** | Intensidad y actividad percibida |
| **Valencia** | Positividad musical (1 = eufórico, 0 = triste) |
| **Acústica** | Probabilidad de que la pista sea acústica |
| **Instrumental** | Probabilidad de ausencia de voces |
| **Directo** | Probabilidad de grabación en vivo |
| **Hablado** | Presencia de palabra hablada no musical |
| **Tempo** | Velocidad en BPM |

> Una leyenda interactiva integrada en los modales explica cada métrica en contexto.

### 🔄 Modo Comparación
- Selección múltiple de canciones (individualmente o álbumes enteros)
- Barra flotante de selección con acceso rápido al comparador
- Modal de comparación con cuatro pestañas:
  - **Lista de Canciones** — tabla ordenable con columnas de artista y álbum
  - **Características** — scatter plot interactivo (eje X e Y configurables, tamaño = duración)
  - **Nube de Palabras** — generada dinámicamente por el backend a partir de las letras
  - **Sentimiento** — análisis NLP de negatividad por canción o por álbum (violin plot + bar chart)

### 📜 Análisis de Letra Individual
- Visualizador de letra integrado (vía Genius API)
- Análisis de sentimiento on-demand con `pysentimiento` (POS / NEG / NEU + score de confianza)

---

## 🏗️ Arquitectura

```
sentimiento-transgresivo/
├── app/                   # Next.js App Router (frontend)
│   ├── _components/       # Componentes React (modales, gráficos, tabla)
│   ├── _hooks/            # Custom hooks (estado del modal, comparación, letras…)
│   ├── _lib/              # Constantes compartidas (columnas de métricas)
│   └── _types/            # Interfaces TypeScript (Track, Album, MetricColumn…)
├── backend/               # API FastAPI (Python)
│   ├── routes/            # Endpoints: sentiment, lyrics, wordcloud, violinplot, genius
│   └── services/          # Lógica: pysentimiento, lyricsgenius, lyrics.ovh
├── data/
│   └── dataset.json       # Dataset pre-computado (274 KB, carga instantánea)
└── public/assets/         # Portadas de álbumes
```

### Estrategia de datos

El frontend **no ejecuta Machine Learning en tiempo real**. Todo el análisis pesado de Python fue pre-computado y exportado a `data/dataset.json`. La web consume ese JSON directamente → **0 ms de latencia de base de datos**.

El backend (FastAPI en Render.com) solo se activa para operaciones on-demand:
- Buscar y obtener letras (Genius API / lyrics.ovh)
- Analizar sentimiento de una letra concreta (`pysentimiento` con modelo en español)
- Generar la nube de palabras y el violin plot para la comparación

---

## 🚀 Despliegue local

### Requisitos previos

- [Bun](https://bun.sh/) ≥ 1.0
- Python ≥ 3.10 + `pip`
- Cuentas en [Genius API](https://genius.com/api-clients), [Spotify for Developers](https://developer.spotify.com/) y [Hugging Face](https://huggingface.co/)

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/sentimiento-transgresivo.git
cd sentimiento-transgresivo
```

### 2. Frontend (Next.js)

```bash
bun install
bun dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### 3. Backend (FastAPI)

```bash
cd backend

# Crear y activar entorno virtual
python -m venv venv
source venv/bin/activate   # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.template .env
# Editar .env con tus claves de API
```

El archivo `.env` debe contener:

```env
GENIUS_CLIENT_ID=...
GENIUS_CLIENT_SECRET=...
GENIUS_ACCESS_TOKEN=...

SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...

HF_TOKEN=...          # Token de Hugging Face (para pysentimiento)
```

Arrancar el servidor:

```bash
uvicorn index:app --reload --port 8080
```

La API estará disponible en [http://localhost:8080](http://localhost:8080) con documentación automática en `/docs`.

> Para que la web apunte a tu backend local debes crear un `.env` en la raíz del proyecto con `NODE_ENV=development`.

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework web | Next.js 16 (App Router) |
| Lenguaje frontend | TypeScript 5 |
| Estilos | Tailwind CSS 4 |
| Runtime / Package manager | Bun |
| Gráficos | Recharts |
| Backend API | FastAPI (Python) |
| Análisis de sentimiento | `pysentimiento` (modelo `robertuito`) |
| Letras | Genius API + lyrics.ovh (fallback) |
| Visualizaciones Python | `matplotlib`, `seaborn`, `wordcloud` |
| Despliegue frontend | Vercel |
| Despliegue backend | Render.com |

---

## 📄 Licencia

MIT — úsalo, fórkalo, transgrédeselo.
