'use client'

import Image from 'next/image'
import { getAlbumCoverUrl } from '@/app/_lib/format'
import type { Album } from '@/app/_types'

interface AlbumCardProps {
  album: Album
  priority?: boolean
  onOpen: (album: Album) => void
  onHoverStart: (album: Album) => void
  onHoverEnd: () => void
  onToggleAlbum: (album: Album) => void
  isFullySelected: boolean
}

/**
 * Tarjeta de álbum con carátula, nombre y año.
 * Client Component — maneja onClick y onMouseEnter/Leave.
 */
export default function AlbumCard({ album, priority, onOpen, onHoverStart, onHoverEnd, onToggleAlbum, isFullySelected }: AlbumCardProps) {
  return (
    <div
      onClick={() => onOpen(album)}
      onMouseEnter={() => onHoverStart(album)}
      onMouseLeave={onHoverEnd}
      className="group flex flex-col text-left hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onOpen(album) }}
    >
      <div className="relative w-full aspect-square border border-stone-800 bg-stone-900 overflow-hidden rounded-sm group-hover:scale-105 group-hover:shadow-[0_10px_40px_-10px_rgba(185,28,28,0.5)] transition-all duration-300 mb-3">
        <Image
          src={getAlbumCoverUrl(album.name)}
          alt={`Carátula de ${album.name}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          priority={priority}
          className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
        />
      </div>
      <div className="transition-transform duration-300 origin-left group-hover:scale-105 mt-4 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold leading-tight group-hover:text-red-600 transition-colors">
            {album.name}
          </h2>
          <p className="text-stone-400 mt-1 font-serif italic text-lg">{album.year}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleAlbum(album)
          }}
          className={`p-2 rounded-full border transition-all shrink-0 mb-1 cursor-pointer ${
            isFullySelected
              ? 'bg-red-800 border-red-700 text-white hover:bg-red-700 shadow-[0_0_15px_rgba(153,27,27,0.5)]'
              : 'bg-stone-900 border-stone-700 text-stone-400 hover:text-red-500 hover:border-red-800 hover:bg-stone-950'
          }`}
          title={isFullySelected ? "Desmarcar todas del comparador" : "Añadir todas al comparador"}
          aria-label={isFullySelected ? "Desmarcar álbum" : "Añadir álbum"}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isFullySelected ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            )}
          </svg>
        </button>
      </div>
    </div>
  )
}
