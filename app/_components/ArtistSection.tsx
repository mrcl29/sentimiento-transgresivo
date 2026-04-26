import type { Album } from '@/app/_types'
import AlbumCard from './AlbumCard'

interface ArtistSectionProps {
  title: string
  albums: Album[]
  /** Número de tarjetas que se cargan con priority (above the fold) */
  eagerCount?: number
  onOpenAlbum: (album: Album) => void
  onHoverStart: (album: Album) => void
  onHoverEnd: () => void
  onToggleAlbum: (album: Album) => void
  isAlbumFullySelected: (album: Album) => boolean
}

/**
 * Sección por artista: título + grid de AlbumCards.
 * No es "use client" porque delega la interactividad a AlbumCard.
 */
export default function ArtistSection({
  title,
  albums,
  eagerCount = 0,
  onOpenAlbum,
  onHoverStart,
  onHoverEnd,
  onToggleAlbum,
  isAlbumFullySelected,
}: ArtistSectionProps) {
  return (
    <section className="mb-12 last:mb-0">
      <h2 className="text-3xl font-bold mb-6 text-stone-100 border-l-4 border-red-800 pl-4 uppercase tracking-tighter">
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {albums.map((album, index) => (
          <AlbumCard
            key={album.name}
            album={album}
            priority={index < eagerCount}
            onOpen={onOpenAlbum}
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
            onToggleAlbum={onToggleAlbum}
            isFullySelected={isAlbumFullySelected(album)}
          />
        ))}
      </div>
    </section>
  )
}
