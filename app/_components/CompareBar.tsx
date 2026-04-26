'use client'

import { useState } from 'react'
import type { Track } from '@/app/_types'

interface CompareBarProps {
    tracks: Track[]
    onRemove: (trackId: string) => void
    onClear: () => void
}

/**
 * Barra flotante fija que muestra las canciones seleccionadas para comparar.
 * Se expande/colapsa al hacer clic. Permite eliminar tracks individuales.
 */
export default function CompareBar({ tracks, onRemove, onClear }: CompareBarProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    if (tracks.length === 0) return null

    return (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
            {/* Lista expandida */}
            {isExpanded && (
                <div className="bg-stone-900 border border-stone-700 rounded-sm shadow-2xl shadow-black/50 w-80 max-h-80 overflow-hidden flex flex-col animate-in">
                    <div className="p-3 border-b border-stone-800 flex justify-between items-center shrink-0">
                        <span className="text-stone-300 text-xs font-bold uppercase tracking-wider">
                            {tracks.length} {tracks.length === 1 ? 'canción' : 'canciones'}
                        </span>
                        <button
                            onClick={onClear}
                            className="text-red-500 text-xs font-bold uppercase hover:text-red-400 transition-colors cursor-pointer"
                        >
                            Limpiar
                        </button>
                    </div>
                    <ul className="divide-y divide-stone-800/50 overflow-y-auto">
                        {tracks.map(track => (
                            <li
                                key={track.track_id}
                                className="p-3 flex justify-between items-center gap-3 hover:bg-stone-800/50 transition-colors group"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="text-stone-100 text-sm font-bold truncate">
                                        {track.track_name}
                                    </p>
                                    <p className="text-stone-500 text-xs truncate">
                                        {track.artista_busqueda} — {track.album_name}
                                    </p>
                                </div>
                                <button
                                    onClick={() => onRemove(track.track_id)}
                                    className="text-stone-600 hover:text-red-500 transition-colors shrink-0 w-6 h-6 flex items-center justify-center text-lg font-bold cursor-pointer"
                                    title="Eliminar de la comparación"
                                >
                                    ×
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Botón flotante */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-red-800 text-stone-50 px-4 py-2.5 rounded-sm font-bold text-sm uppercase tracking-wider shadow-lg shadow-red-900/30 hover:bg-red-700 hover:shadow-red-900/50 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer"
            >
                <span className="bg-red-600 min-w-6 h-6 rounded-full flex items-center justify-center text-xs font-black px-1.5">
                    {tracks.length}
                </span>
                {isExpanded ? 'Ocultar' : 'Comparar'}
            </button>
        </div>
    )
}
