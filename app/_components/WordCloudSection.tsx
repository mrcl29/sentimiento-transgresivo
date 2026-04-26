'use client'

import { useState, useEffect } from 'react'
import type { Track } from '@/app/_types'

export default function WordCloudSection({ tracks }: { tracks: Track[] }) {
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (tracks.length === 0) return

        let isMounted = true
        const controller = new AbortController()

        const generateWordCloud = async () => {
            setIsLoading(true)
            setError(null)
            setProgress(0)

            try {
                // 1. Fetch lyrics for all tracks
                let allLyrics = ''
                for (let i = 0; i < tracks.length; i++) {
                    const track = tracks[i]
                    try {
                        const res = await fetch(
                            `/api/lyrics?song=${encodeURIComponent(track.track_name)}&artist=${encodeURIComponent(track.artista_busqueda)}`,
                            { signal: controller.signal }
                        )
                        if (res.ok) {
                            const data = await res.json()
                            if (data.lyrics) {
                                allLyrics += data.lyrics + ' '
                            }
                        }
                    } catch (e: any) {
                        if (e.name === 'AbortError') throw e;
                        console.warn(`Error fetching lyrics for ${track.track_name}:`, e)
                    }
                    if (isMounted) setProgress(Math.round(((i + 1) / tracks.length) * 50))
                }

                if (!allLyrics.trim()) {
                    throw new Error("No se encontraron letras para las canciones seleccionadas.")
                }

                // 2. Fetch wordcloud image
                const wcRes = await fetch('/api/wordcloud', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: allLyrics }),
                    signal: controller.signal
                })

                if (!wcRes.ok) {
                    const errorData = await wcRes.json()
                    throw new Error(errorData.detail || "Error al generar la nube de palabras.")
                }

                const blob = await wcRes.blob()
                if (isMounted) {
                    const url = URL.createObjectURL(blob)
                    setImageUrl(url)
                    setProgress(100)
                }
            } catch (err: any) {
                if (err.name !== 'AbortError' && isMounted) {
                    setError(err.message || 'Ocurrió un error.')
                }
            } finally {
                if (isMounted) setIsLoading(false)
            }
        }

        generateWordCloud()

        return () => {
            isMounted = false
            controller.abort()
        }
    }, [tracks]) // Re-run when selected tracks change

    if (tracks.length === 0) return null

    return (
        <div className="mt-12 mb-8 flex flex-col gap-6">
            <div>
                <h3 className="text-2xl font-black text-stone-50 uppercase tracking-tighter">
                    Nube de Palabras
                </h3>
                <p className="text-stone-400 text-sm mt-1">
                    Análisis de términos más frecuentes en las letras de las canciones seleccionadas.
                </p>
            </div>

            <div className="w-full bg-stone-900/40 border border-stone-800 p-4 sm:p-6 rounded-sm shadow-inner min-h-[450px] flex items-center justify-center relative">
                {isLoading ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-stone-800 border-t-red-600 rounded-full animate-spin" />
                        <div className="text-stone-400 text-sm uppercase tracking-widest font-bold">
                            Analizando letras... {progress}%
                        </div>
                    </div>
                ) : error ? (
                    <div className="text-red-500 font-bold uppercase tracking-wider bg-red-950/50 p-4 rounded-sm border border-red-900">
                        {error}
                    </div>
                ) : imageUrl ? (
                    <img 
                        src={imageUrl} 
                        alt="Nube de palabras de las letras" 
                        className="max-w-full h-auto max-h-[400px] object-contain rounded-sm shadow-xl shadow-black/50"
                    />
                ) : null}
            </div>
        </div>
    )
}
