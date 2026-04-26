'use client'

import type { Track } from '@/app/_types'

interface LyricsModalProps {
  track: Track
  isAnimating: boolean
  lyrics: string | null
  isLoadingLyrics: boolean
  sentiment: { label: string, score: number, output: Record<string, number> } | null
  isLoadingSentiment: boolean
  onAnalyze: () => void
  onClose: () => void
}

export default function LyricsModal({
  track,
  isAnimating,
  lyrics,
  isLoadingLyrics,
  sentiment,
  isLoadingSentiment,
  onAnalyze,
  onClose,
}: LyricsModalProps) {
  const sentimentLabels: Record<string, { text: string, color: string }> = {
    'POS': { text: 'Positivo', color: 'text-green-500' },
    'NEG': { text: 'Negativo', color: 'text-red-500' },
    'NEU': { text: 'Neutro', color: 'text-stone-400' }
  }

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-stone-950/95 backdrop-blur-sm p-4 sm:p-8 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-stone-900 border border-stone-700 w-[95vw] max-w-2xl h-[90vh] overflow-hidden flex flex-col transition-all duration-500 ease-out transform shadow-2xl rounded-sm ${
          isAnimating ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="bg-stone-950 border-b border-stone-800 p-6 flex justify-between items-start shrink-0">
          <div>
            <h2 className="text-3xl font-black text-stone-50 uppercase tracking-tighter pr-4">
              {track.track_name}
            </h2>
            <p className="text-red-600 font-serif italic mt-1">
              {track.artista_busqueda}
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-stone-800 text-stone-50 font-bold px-4 py-2 uppercase hover:bg-stone-700 hover:scale-105 active:scale-95 transition-all rounded-sm text-sm"
          >
            Cerrar
          </button>
        </div>

        {/* Contenido (Letra) */}
        <div className="flex-1 overflow-y-auto p-6 bg-stone-900 text-stone-300 whitespace-pre-wrap font-serif text-lg leading-relaxed">
          {isLoadingLyrics ? (
            <div className="flex items-center justify-center h-full text-stone-500 animate-pulse font-sans font-bold uppercase tracking-widest">
              Obteniendo letra...
            </div>
          ) : lyrics ? (
            lyrics
          ) : (
            <div className="flex items-center justify-center h-full text-red-500 font-sans font-bold">
              No se pudo obtener la letra de esta canción.
            </div>
          )}
        </div>

        {/* Footer (Análisis) */}
        <div className="bg-stone-950 border-t border-stone-800 p-6 flex items-center justify-between shrink-0">
          {!sentiment ? (
            <button
              onClick={onAnalyze}
              disabled={isLoadingSentiment || !lyrics || isLoadingLyrics || lyrics.includes('No se encontró') || lyrics.includes('Error al cargar')}
              className="bg-red-800 text-stone-50 font-bold px-6 py-3 uppercase hover:bg-red-700 hover:scale-105 active:scale-95 transition-all rounded-sm disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoadingSentiment ? 'Analizando...' : 'Analizar Sentimiento'}
            </button>
          ) : (
            <div className="flex flex-col gap-1 w-full font-sans">
              <span className="text-stone-400 text-sm uppercase tracking-wider font-bold">
                Tendencia Sentimental
              </span>
              <div className="flex items-center gap-4">
                <span className={`text-2xl font-black uppercase ${sentimentLabels[sentiment.label]?.color || 'text-stone-100'}`}>
                  {sentimentLabels[sentiment.label]?.text || sentiment.label}
                </span>
                <span className="text-stone-300 font-mono text-xl">
                  {Math.round((sentiment.output[sentiment.label] || 0) * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
