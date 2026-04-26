import { useState, useCallback } from 'react'
import type { Track } from '@/app/_types'

export function useLyricsModal() {
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
    const [isAnimating, setIsAnimating] = useState(false)
    const [lyrics, setLyrics] = useState<string | null>(null)
    const [isLoadingLyrics, setIsLoadingLyrics] = useState(false)

    const [sentiment, setSentiment] = useState<{ label: string, score: number, output: Record<string, number> } | null>(null)
    const [isLoadingSentiment, setIsLoadingSentiment] = useState(false)

    const openLyrics = useCallback(async (track: Track) => {
        setSelectedTrack(track)
        setLyrics(null)
        setSentiment(null)
        setTimeout(() => setIsAnimating(true), 10)

        setIsLoadingLyrics(true)
        try {
            const res = await fetch(`/api/lyrics?song=${encodeURIComponent(track.track_name)}&artist=${encodeURIComponent(track.artista_busqueda)}`)
            const data = await res.json()
            setLyrics(data.lyrics || 'No se encontró la letra.')
        } catch (e) {
            console.error('Error fetching lyrics:', e)
            setLyrics('Error al cargar la letra.')
        } finally {
            setIsLoadingLyrics(false)
        }
    }, [])

    const closeLyrics = useCallback(() => {
        setIsAnimating(false)
        setTimeout(() => {
            setSelectedTrack(null)
            setLyrics(null)
            setSentiment(null)
        }, 300)
    }, [])

    const analyzeSentiment = useCallback(async () => {
        if (!lyrics) return
        setIsLoadingSentiment(true)
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: lyrics })
            })
            const data = await res.json()
            setSentiment(data)
        } catch (e) {
            console.error('Error analizando sentimiento:', e)
        } finally {
            setIsLoadingSentiment(false)
        }
    }, [lyrics])

    return {
        selectedTrack,
        isAnimating,
        lyrics,
        isLoadingLyrics,
        sentiment,
        isLoadingSentiment,
        openLyrics,
        closeLyrics,
        analyzeSentiment
    }
}
