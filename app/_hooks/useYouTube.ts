import { useState, useCallback } from 'react'
import type { Track } from '@/app/_types'

export function useYouTube() {
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
    const [isAnimating, setIsAnimating] = useState(false)
    const [iframeUrl, setIframeUrl] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const openYouTube = useCallback(async (track: Track) => {
        setSelectedTrack(track)
        setIframeUrl(null)
        setTimeout(() => setIsAnimating(true), 10)

        setIsLoading(true)
        try {
            const res = await fetch(`/api/youtube/iframe?song=${encodeURIComponent(track.track_name)}&artist=${encodeURIComponent(track.artista_busqueda)}`)
            const data = await res.json()
            setIframeUrl(data.iframe_url)
        } catch (e) {
            console.error('Error fetching YouTube iframe:', e)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const closeYouTube = useCallback(() => {
        setIsAnimating(false)
        setTimeout(() => {
            setSelectedTrack(null)
            setIframeUrl(null)
        }, 300)
    }, [])

    return {
        selectedTrack,
        isAnimating,
        iframeUrl,
        isLoading,
        openYouTube,
        closeYouTube,
    }
}
