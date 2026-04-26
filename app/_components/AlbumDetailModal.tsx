'use client'

import type { Album, Track, SortKey, SortDirection } from '@/app/_types'
import { METRIC_COLUMNS } from '@/app/_lib/constants'
import SortableHeader from './SortableHeader'
import TrackRow from './TrackRow'

interface AlbumDetailModalProps {
  album: Album
  isAnimating: boolean
  sortKey: SortKey
  sortDirection: SortDirection
  sortedTracks: Track[]
  onSort: (key: keyof Track) => void
  onViewLyrics: (track: Track) => void
  onClose: () => void
}

/**
 * Modal a pantalla completa con la tabla de tracks del álbum.
 * Client Component — gestiona animación, cierre y tabla ordenable.
 */
export default function AlbumDetailModal({
  album,
  isAnimating,
  sortKey,
  sortDirection,
  sortedTracks,
  onSort,
  onViewLyrics,
  onClose,
}: AlbumDetailModalProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-stone-950/90 backdrop-blur-sm p-4 sm:p-8 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-stone-950 border border-red-800 w-[95vw] max-w-350 h-full max-h-[90vh] overflow-hidden flex flex-col transition-all duration-500 ease-out transform shadow-2xl shadow-red-900/20 rounded-sm ${
          isAnimating ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del modal */}
        <div className="bg-stone-950/95 backdrop-blur border-b border-red-800 p-6 flex justify-between items-start shrink-0 z-20">
          <div>
            <h2 className="text-4xl sm:text-5xl font-black text-stone-50 uppercase tracking-tighter">
              {album.name}
            </h2>
            <p className="text-xl text-red-600 font-serif italic mt-2">
              {album.artist} — {album.year}
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-red-800 text-stone-50 font-bold px-4 py-2 uppercase hover:bg-red-600 hover:scale-105 active:scale-95 transition-all rounded-sm"
          >
            Cerrar (ESC)
          </button>
        </div>

        {/* Tabla de tracks */}
        <div className="flex-1 overflow-y-auto overflow-x-auto bg-stone-950">
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
                  onSort={onSort}
                />
                <th className="p-4 font-medium min-w-62.5">Título</th>
                <SortableHeader
                  label="Duración"
                  columnKey="duration_ms"
                  className="w-24"
                  justifyClass="justify-center"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={onSort}
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
                    onSort={onSort}
                  />
                ))}
                <SortableHeader
                  label="Tempo"
                  columnKey="tempo"
                  className="w-28"
                  justifyClass="justify-end"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={onSort}
                />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/50">
              {sortedTracks.map((track) => (
                <TrackRow key={track.track_id} track={track} onViewLyrics={onViewLyrics} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
