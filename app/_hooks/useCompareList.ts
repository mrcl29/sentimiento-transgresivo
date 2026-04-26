import { useState, useCallback } from 'react'
import type { Track } from '@/app/_types'

/**
 * Gestiona la lista de canciones seleccionadas para comparación.
 * Permite añadir, eliminar y hacer toggle de tracks.
 */
export function useCompareList() {
    const [tracks, setTracks] = useState<Track[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalAnimating, setIsModalAnimating] = useState(false)

    const toggleTrack = useCallback((track: Track) => {
        setTracks(prev => {
            if (prev.some(t => t.track_id === track.track_id)) {
                return prev.filter(t => t.track_id !== track.track_id)
            }
            return [...prev, track]
        })
    }, [])

    const removeTrack = useCallback((trackId: string) => {
        setTracks(prev => prev.filter(t => t.track_id !== trackId))
    }, [])

    const toggleAlbumTracks = useCallback((albumTracks: Track[]) => {
        setTracks(prev => {
            if (!albumTracks || albumTracks.length === 0) return prev
            const allInList = albumTracks.every(track => 
                prev.some(t => t.track_id === track.track_id)
            )
            if (allInList) {
                return prev.filter(t => !albumTracks.some(at => at.track_id === t.track_id))
            } else {
                const missing = albumTracks.filter(track => 
                    !prev.some(t => t.track_id === track.track_id)
                )
                return [...prev, ...missing]
            }
        })
    }, [])

    const clearAll = useCallback(() => setTracks([]), [])

    const isInList = useCallback(
        (trackId: string) => tracks.some(t => t.track_id === trackId),
        [tracks]
    )

    const isAlbumFullySelected = useCallback(
        (albumTracks: Track[]) => {
            if (!albumTracks || albumTracks.length === 0) return false
            return albumTracks.every(track => tracks.some(t => t.track_id === track.track_id))
        },
        [tracks]
    )

    const openCompareModal = useCallback(() => {
        setIsModalOpen(true)
        setTimeout(() => setIsModalAnimating(true), 10)
    }, [])

    const closeCompareModal = useCallback(() => {
        setIsModalAnimating(false)
        setTimeout(() => setIsModalOpen(false), 300)
    }, [])

    return {
        tracks,
        isModalOpen,
        isModalAnimating,
        toggleTrack,
        removeTrack,
        toggleAlbumTracks,
        clearAll,
        isInList,
        isAlbumFullySelected,
        openCompareModal,
        closeCompareModal,
    }
}
