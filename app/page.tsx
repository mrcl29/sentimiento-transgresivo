'use client'

import { useAlbumData } from '@/app/_hooks/useAlbumData'
import { useAlbumModal } from '@/app/_hooks/useAlbumModal'
import { useDynamicBackground } from '@/app/_hooks/useDynamicBackground'
import { useTrackSort } from '@/app/_hooks/useTrackSort'
import { useLyricsModal } from '@/app/_hooks/useLyricsModal'
import { useCompareList } from '@/app/_hooks/useCompareList'
import Header from '@/app/_components/Header'
import ArtistSection from '@/app/_components/ArtistSection'
import AlbumDetailModal from '@/app/_components/AlbumDetailModal'
import LyricsModal from '@/app/_components/LyricsModal'
import CompareBar from '@/app/_components/CompareBar'
import CompareModal from '@/app/_components/CompareModal'

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
        analyzeSentiment,
    } = useLyricsModal()
    const {
        tracks: compareTracks,
        isModalOpen: isCompareOpen,
        isModalAnimating: isCompareAnimating,
        toggleTrack,
        removeTrack,
        clearAll,
        isInList,
        openCompareModal,
        closeCompareModal,
    } = useCompareList()

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

            <Header
                actions={
                    compareTracks.length > 0 ? (
                        <button
                            onClick={openCompareModal}
                            className="bg-red-800 text-stone-50 font-bold px-5 py-2.5 uppercase text-sm tracking-wider hover:bg-red-700 hover:scale-105 active:scale-95 transition-all rounded-sm flex items-center gap-2.5 shrink-0"
                        >
                            <span className="bg-red-600 min-w-6 h-6 rounded-full flex items-center justify-center text-xs font-black px-1.5">
                                {compareTracks.length}
                            </span>
                            Comparar
                        </button>
                    ) : undefined
                }
            />

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
                    onToggleCompare={toggleTrack}
                    isInCompareList={isInList}
                    onClose={closeAlbum}
                />
            )}

            {/* Modal de comparación */}
            {isCompareOpen && (
                <CompareModal
                    tracks={compareTracks}
                    isAnimating={isCompareAnimating}
                    onViewLyrics={openLyrics}
                    onToggleCompare={toggleTrack}
                    isInCompareList={isInList}
                    onClose={closeCompareModal}
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

            {/* Barra flotante de comparación */}
            <CompareBar
                tracks={compareTracks}
                onRemove={removeTrack}
                onClear={clearAll}
            />
        </main>
    )
}
