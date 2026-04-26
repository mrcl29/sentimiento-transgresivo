'use client'

import { useEffect } from 'react'
import type { Track, SortKey, SortDirection } from '@/app/_types'
import { METRIC_COLUMNS } from '@/app/_lib/constants'
import { useTrackSort } from '@/app/_hooks/useTrackSort'
import SortableHeader from './SortableHeader'
import TrackRow from './TrackRow'
import FeatureScatterPlot from './FeatureScatterPlot'
import WordCloudSection from './WordCloudSection'

interface CompareModalProps {
    tracks: Track[]
    isAnimating: boolean
    onViewLyrics: (track: Track) => void
    onToggleCompare: (track: Track) => void
    isInCompareList: (trackId: string) => boolean
    onClose: () => void
}

/**
 * Modal a pantalla completa para comparar las canciones seleccionadas.
 * Incluye columnas extra de Artista y Álbum, además de las métricas habituales.
 */
export default function CompareModal({
    tracks,
    isAnimating,
    onViewLyrics,
    onToggleCompare,
    isInCompareList,
    onClose,
}: CompareModalProps) {
    const { sortKey, sortDirection, handleSort, sortedTracks } = useTrackSort(tracks)

    useEffect(() => {
        // Bloquear scroll del body mientras el modal está abierto
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
        document.body.style.overflow = 'hidden'
        document.body.style.paddingRight = `${scrollbarWidth}px`

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleKeyDown)

        return () => {
            document.body.style.overflow = ''
            document.body.style.paddingRight = ''
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [onClose])

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-stone-950/90 backdrop-blur-sm p-2 sm:p-4 transition-opacity duration-300 ${
                isAnimating ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={onClose}
        >
            <div
                className={`bg-stone-950 border border-red-800 w-[95vw] h-[95vh] overflow-hidden flex flex-col transition-all duration-500 ease-out transform shadow-2xl shadow-red-900/20 rounded-sm ${
                    isAnimating ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Cabecera del modal */}
                <div className="bg-stone-950/95 backdrop-blur border-b border-red-800 p-6 flex justify-between items-start shrink-0 z-20">
                    <div>
                        <h2 className="text-4xl sm:text-5xl font-black text-stone-50 uppercase tracking-tighter">
                            Comparación
                        </h2>
                        <p className="text-xl text-red-600 font-serif italic mt-2">
                            {tracks.length} {tracks.length === 1 ? 'canción seleccionada' : 'canciones seleccionadas'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-red-800 text-stone-50 font-bold px-4 py-2 uppercase hover:bg-red-600 hover:scale-105 active:scale-95 transition-all rounded-sm"
                    >
                        Cerrar (ESC)
                    </button>
                </div>

                {/* Contenido (Tabla + Gráfico) */}
                <div className="flex-1 overflow-y-auto bg-stone-950 block relative">
                    {tracks.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-stone-500 font-sans font-bold uppercase tracking-widest text-lg min-h-[300px]">
                            No hay canciones seleccionadas
                        </div>
                    ) : (
                        <div className="min-h-max pb-8">
                            {/* Tabla */}
                            <div className="overflow-x-auto border-b border-stone-800 relative">
                                <table className="w-full text-left border-collapse min-w-300">
                                    <thead className="sticky top-0 bg-stone-900 border-b border-stone-800 text-stone-300 text-sm uppercase font-sans z-10 shadow-md">
                                        <tr>
                                            <SortableHeader
                                                label="#"
                                                columnKey="track_number"
                                                className="w-16"
                                                justifyClass="justify-center"
                                                sortKey={sortKey}
                                                sortDirection={sortDirection}
                                                onSort={handleSort}
                                            />
                                            <th className="p-4 font-medium min-w-62.5">Título</th>
                                            <SortableHeader
                                                label="Artista"
                                                columnKey="artista_busqueda"
                                                className="w-32"
                                                justifyClass="justify-start"
                                                sortKey={sortKey}
                                                sortDirection={sortDirection}
                                                onSort={handleSort}
                                            />
                                            <SortableHeader
                                                label="Álbum"
                                                columnKey="album_name"
                                                className="w-44"
                                                justifyClass="justify-start"
                                                sortKey={sortKey}
                                                sortDirection={sortDirection}
                                                onSort={handleSort}
                                            />
                                            <SortableHeader
                                                label="Duración"
                                                columnKey="duration_ms"
                                                className="w-24"
                                                justifyClass="justify-center"
                                                sortKey={sortKey}
                                                sortDirection={sortDirection}
                                                onSort={handleSort}
                                            />
                                            {METRIC_COLUMNS.map((col) => (
                                                <SortableHeader
                                                    key={col.key}
                                                    label={col.label}
                                                    columnKey={col.key}
                                                    className={col.className}
                                                    justifyClass={col.justifyClass}
                                                    sortKey={sortKey}
                                                    sortDirection={sortDirection}
                                                    onSort={handleSort}
                                                />
                                            ))}
                                            <SortableHeader
                                                label="Tempo"
                                                columnKey="tempo"
                                                className="w-28"
                                                justifyClass="justify-end"
                                                sortKey={sortKey}
                                                sortDirection={sortDirection}
                                                onSort={handleSort}
                                            />
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-800/50">
                                        {sortedTracks.map((track) => (
                                            <TrackRow
                                                key={track.track_id}
                                                track={track}
                                                showArtistAlbum
                                                onViewLyrics={onViewLyrics}
                                                onToggleCompare={onToggleCompare}
                                                isInCompareList={isInCompareList(track.track_id)}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Gráfico de Características */}
                            <div className="px-4 sm:px-8">
                                <FeatureScatterPlot tracks={tracks} />
                            </div>

                            {/* Nube de Palabras */}
                            <div className="px-4 sm:px-8 pb-12">
                                <WordCloudSection tracks={tracks} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
