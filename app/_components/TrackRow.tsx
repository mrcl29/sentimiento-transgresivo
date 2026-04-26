import type { Track } from '@/app/_types'
import { METRIC_KEYS } from '@/app/_lib/constants'
import { formatDuration } from '@/app/_lib/format'
import MetricBar from './MetricBar'

interface TrackRowProps {
    track: Track
    /** Mostrar columnas de Artista y Álbum (para la vista de comparación) */
    showArtistAlbum?: boolean
    onViewLyrics?: (track: Track) => void
    onToggleCompare?: (track: Track) => void
    isInCompareList?: boolean
}

/**
 * Fila <tr> de la tabla de detalle del álbum.
 * Renderiza número, título, duración, barras de métricas y tempo.
 * Opcionalmente muestra artista/álbum y botón de comparación.
 */
export default function TrackRow({
    track,
    showArtistAlbum,
    onViewLyrics,
    onToggleCompare,
    isInCompareList,
}: TrackRowProps) {
    return (
        <tr className="hover:bg-stone-900/30 transition-colors group">
            <td className="p-4 text-red-700 font-sans font-bold text-2xl text-center">
                {track.track_number}
            </td>
            <td className="p-4">
                <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-stone-100 group-hover:text-red-500 transition-colors">
                        {track.track_name}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                        {onToggleCompare && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onToggleCompare(track)
                                }}
                                className={`w-7 h-7 flex items-center justify-center text-sm font-bold rounded-sm border transition-all cursor-pointer ${
                                    isInCompareList
                                        ? 'bg-red-800 border-red-700 text-stone-100 hover:bg-red-700'
                                        : 'border-stone-700 text-stone-500 hover:bg-stone-800 hover:text-stone-100'
                                }`}
                                title={isInCompareList ? 'Quitar de comparación' : 'Añadir a comparación'}
                            >
                                {isInCompareList ? '✓' : '+'}
                            </button>
                        )}
                        {onViewLyrics && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onViewLyrics(track)
                                }}
                                className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-stone-400 border border-stone-700 rounded-sm hover:bg-stone-800 hover:text-stone-100 transition-colors shrink-0 cursor-pointer"
                                title="Ver letra"
                            >
                                Letra
                            </button>
                        )}
                    </div>
                </div>
            </td>
            {showArtistAlbum && (
                <>
                    <td className="p-4 text-stone-300 font-sans text-sm whitespace-nowrap">
                        {track.artista_busqueda}
                    </td>
                    <td className="p-4 text-stone-400 font-sans text-sm truncate max-w-44">
                        {track.album_name}
                    </td>
                </>
            )}
            <td className="p-4 text-stone-400 font-sans text-base text-center">
                {formatDuration(track.duration_ms)}
            </td>
            {METRIC_KEYS.map((key) => (
                <MetricBar key={key} value={track[key] as number} />
            ))}
            <td className="p-4 text-stone-300 font-sans text-base font-medium text-right whitespace-nowrap">
                {Math.round(track.tempo)} <span className="text-sm text-stone-500">BPM</span>
            </td>
        </tr>
    )
}
