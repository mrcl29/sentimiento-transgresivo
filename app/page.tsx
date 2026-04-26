'use client'

import { useAlbumData } from '@/app/_hooks/useAlbumData'
import { useAlbumModal } from '@/app/_hooks/useAlbumModal'
import { useDynamicBackground } from '@/app/_hooks/useDynamicBackground'
import { useTrackSort } from '@/app/_hooks/useTrackSort'
import Header from '@/app/_components/Header'
import ArtistSection from '@/app/_components/ArtistSection'
import AlbumDetailModal from '@/app/_components/AlbumDetailModal'
import { useLyricsModal } from '@/app/_hooks/useLyricsModal'
import LyricsModal from '@/app/_components/LyricsModal'

export default function Home() {
  const { extremoduroAlbums, robeAlbums } = useAlbumData()
  const { selectedAlbum, isAnimating, openAlbum, closeAlbum } = useAlbumModal()
  const { hoverColor, handleMouseEnter, handleMouseLeave } = useDynamicBackground()
  const { sortKey, sortDirection, handleSort, resetSort, sortedTracks } = useTrackSort(
    selectedAlbum?.tracks ?? []
  )
  const {
    selectedTrack,
    isAnimating: isLyricsAnimating,
    lyrics,
    isLoadingLyrics,
    sentiment,
    isLoadingSentiment,
    openLyrics,
    closeLyrics,
    analyzeSentiment
  } = useLyricsModal()

  const handleOpenAlbum = (album: Parameters<typeof openAlbum>[0]) => {
    resetSort()
    openAlbum(album)
  }

  return (
    <main className="p-8 font-sans text-stone-100 min-h-screen relative">
      {/* Fondo dinámico y animado */}
      <div
        className="fixed inset-0 -z-10 transition-colors duration-1000 ease-out pointer-events-none"
        style={{ backgroundColor: hoverColor }}
      >
        <div className="absolute inset-0 bg-linear-to-br from-transparent to-stone-950" />
      </div>

      <Header />

      {/* Secciones por Artista */}
      {[
        { title: 'Extremoduro', albums: extremoduroAlbums, eagerCount: 5 },
        { title: 'Robe', albums: robeAlbums },
      ].map((section) => (
        <ArtistSection
          key={section.title}
          title={section.title}
          albums={section.albums}
          eagerCount={section.eagerCount}
          onOpenAlbum={handleOpenAlbum}
          onHoverStart={handleMouseEnter}
          onHoverEnd={handleMouseLeave}
        />
      ))}

      {/* Modal de detalle del álbum */}
      {selectedAlbum && (
        <AlbumDetailModal
          album={selectedAlbum}
          isAnimating={isAnimating}
          sortKey={sortKey}
          sortDirection={sortDirection}
          sortedTracks={sortedTracks}
          onSort={handleSort}
          onViewLyrics={openLyrics}
          onClose={closeAlbum}
        />
      )}

      {/* Modal de letra y sentimiento */}
      {selectedTrack && (
        <LyricsModal
          track={selectedTrack}
          isAnimating={isLyricsAnimating}
          lyrics={lyrics}
          isLoadingLyrics={isLoadingLyrics}
          sentiment={sentiment}
          isLoadingSentiment={isLoadingSentiment}
          onAnalyze={analyzeSentiment}
          onClose={closeLyrics}
        />
      )}
    </main>
  )
}
