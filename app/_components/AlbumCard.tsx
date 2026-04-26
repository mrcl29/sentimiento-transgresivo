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
}

/**
 * Tarjeta de álbum con carátula, nombre y año.
 * Client Component — maneja onClick y onMouseEnter/Leave.
 */
export default function AlbumCard({ album, priority, onOpen, onHoverStart, onHoverEnd }: AlbumCardProps) {
  return (
    <button
      onClick={() => onOpen(album)}
      onMouseEnter={() => onHoverStart(album)}
      onMouseLeave={onHoverEnd}
      className="group flex flex-col text-left hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
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
      <div className="transition-transform duration-300 origin-left group-hover:scale-105 mt-4">
        <h2 className="text-xl font-bold leading-tight group-hover:text-red-600 transition-colors">
          {album.name}
        </h2>
        <p className="text-stone-400 mt-1 font-serif italic text-lg">{album.year}</p>
      </div>
    </button>
  )
}
