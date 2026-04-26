'use client'

import { useState, useEffect, useMemo } from 'react'
import type { Track } from '@/app/_types'
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Cell,
    BarChart,
    Bar
} from 'recharts'

interface SentimentData {
    track_id: string
    track_name: string
    album_name: string
    prob_negativa: number
    duration_ms: number
    jitteredX: number
    albumIndex: number
}

// Colores por álbum (similar al scatter plot anterior)
const ALBUM_COLORS = [
    '#e11d48', // rose-600
    '#3b82f6', // blue-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#8b5cf6', // violet-500
    '#06b6d4', // cyan-500
    '#ec4899', // pink-500
    '#84cc16', // lime-500
    '#f97316', // orange-500
    '#6366f1', // indigo-500
]

export default function SentimentSection({ tracks, isActive = true }: { tracks: Track[], isActive?: boolean }) {
    const [data, setData] = useState<SentimentData[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<'album' | 'track'>('album')
    const [violinImageUrl, setViolinImageUrl] = useState<string | null>(null)

    useEffect(() => {
        if (tracks.length === 0) return

        let isMounted = true
        const controller = new AbortController()

        const analyzeSentiments = async () => {
            setIsLoading(true)
            setError(null)
            setProgress(0)
            setData([])

            try {
                const results: SentimentData[] = []

                // Extraer álbumes únicos para asignar índices
                const uniqueAlbums = Array.from(new Set(tracks.map(t => t.album_name)))

                for (let i = 0; i < tracks.length; i++) {
                    const track = tracks[i]
                    let probNegativa = null

                    try {
                        // 1. Fetch lyrics
                        const resLyrics = await fetch(
                            `/api/lyrics?song=${encodeURIComponent(track.track_name)}&artist=${encodeURIComponent(track.artista_busqueda)}`,
                            { signal: controller.signal }
                        )
                        if (resLyrics.ok) {
                            const dataLyrics = await resLyrics.json()
                            if (dataLyrics.lyrics && dataLyrics.lyrics.trim().length > 0) {
                                // 2. Analyze sentiment (recortamos a 2000 chars por seguridad)
                                const textToAnalyze = dataLyrics.lyrics.substring(0, 2000)
                                const resSent = await fetch('/api/analyze', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ text: textToAnalyze }),
                                    signal: controller.signal
                                })

                                if (resSent.ok) {
                                    const dataSent = await resSent.json()
                                    if (dataSent.output && typeof dataSent.output.NEG === 'number') {
                                        probNegativa = dataSent.output.NEG
                                    }
                                }
                            }
                        }
                    } catch (e: any) {
                        if (e.name === 'AbortError') throw e;
                        console.warn(`Error analyzing sentiment for ${track.track_name}:`, e)
                    }

                    if (probNegativa !== null) {
                        const albumIndex = uniqueAlbums.indexOf(track.album_name)
                        // Añadir jittering (ruido) entre -0.3 y 0.3 para separar los puntos en el eje X
                        const jitter = (Math.random() - 0.5) * 0.6

                        results.push({
                            track_id: track.track_id,
                            track_name: track.track_name,
                            album_name: track.album_name,
                            prob_negativa: probNegativa,
                            duration_ms: track.duration_ms,
                            albumIndex: albumIndex,
                            jitteredX: albumIndex + jitter
                        })
                    }

                    if (isMounted) setProgress(Math.round(((i + 1) / tracks.length) * 100))
                }

                if (results.length === 0) {
                    throw new Error("No se pudo analizar el sentimiento de ninguna canción (quizá no tienen letra).")
                }

                // Request the violin plot image from the backend
                try {
                    const resViolin = await fetch('/api/violinplot', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            data: results.map(r => ({
                                album_name: r.album_name,
                                prob_negativa: r.prob_negativa
                            }))
                        }),
                        signal: controller.signal
                    })

                    if (resViolin.ok) {
                        const blob = await resViolin.blob()
                        if (isMounted) {
                            setViolinImageUrl(URL.createObjectURL(blob))
                        }
                    } else {
                        console.warn("Failed to generate violin plot image")
                    }
                } catch (e: any) {
                    if (e.name !== 'AbortError') {
                        console.warn("Error requesting violin plot image:", e)
                    }
                }

                if (isMounted) setData(results)
            } catch (err: any) {
                if (err.name !== 'AbortError' && isMounted) {
                    setError(err.message || 'Ocurrió un error en el análisis de sentimiento.')
                }
            } finally {
                if (isMounted) setIsLoading(false)
            }
        }

        analyzeSentiments()

        return () => {
            isMounted = false
            controller.abort()
        }
    }, [tracks])

    const uniqueAlbums = useMemo(() => Array.from(new Set(data.map(d => d.album_name))), [data])

    if (tracks.length === 0) return null

    return (
        <div className="mt-12 mb-8 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h3 className="text-2xl font-black text-stone-50 uppercase tracking-tighter">
                        Sentimiento Negativo
                    </h3>
                    <p className="text-stone-400 text-sm mt-1">
                        Probabilidad de negatividad en la letra (0 a 1).
                    </p>
                </div>

                {data.length > 0 && !isLoading && (
                    <div className="flex bg-stone-900 border border-stone-800 p-1 rounded-sm">
                        <button
                            onClick={() => setViewMode('album')}
                            className={`px-4 py-1 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer ${
                                viewMode === 'album' ? 'bg-red-900 text-white' : 'text-stone-400 hover:text-stone-200'
                            }`}
                        >
                            Por Álbum
                        </button>
                        <button
                            onClick={() => setViewMode('track')}
                            className={`px-4 py-1 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer ${
                                viewMode === 'track' ? 'bg-red-900 text-white' : 'text-stone-400 hover:text-stone-200'
                            }`}
                        >
                            Por Canción
                        </button>
                    </div>
                )}
            </div>

            <div className="w-full bg-stone-900/40 border border-stone-800 p-4 sm:p-6 rounded-sm shadow-inner relative min-h-[450px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                        <div className="w-12 h-12 border-4 border-stone-800 border-t-red-600 rounded-full animate-spin" />
                        <div className="text-stone-400 text-sm uppercase tracking-widest font-bold">
                            Analizando emociones... {progress}%
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-[400px]">
                        <div className="text-red-500 font-bold uppercase tracking-wider bg-red-950/50 p-4 rounded-sm border border-red-900">
                            {error}
                        </div>
                    </div>
                ) : data.length > 0 ? (
                    <div className="w-full h-[500px]">
                        {viewMode === 'album' ? (
                            violinImageUrl ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <img
                                        src={violinImageUrl}
                                        alt="Gráfico de violín de sentimiento"
                                        className="max-w-full h-auto max-h-[500px] object-contain rounded-sm"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-stone-500 font-bold uppercase tracking-wider text-sm">
                                    Generando gráfico...
                                </div>
                            )
                        ) : (
                            isActive && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data} margin={{ top: 20, right: 20, bottom: 80, left: 10 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                                        <XAxis
                                            dataKey="track_name"
                                            tick={{ fill: '#78716c', fontSize: 10 }}
                                            angle={-45}
                                            textAnchor="end"
                                            interval={0}
                                            height={80}
                                        />
                                        <YAxis
                                            domain={[0, 1]}
                                            tick={{ fill: '#78716c', fontSize: 12 }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: '#1c1917' }}
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const d = payload[0].payload as SentimentData
                                                    return (
                                                        <div className="bg-stone-950 border border-red-900 p-3 shadow-2xl rounded-sm max-w-[250px]">
                                                            <p className="text-stone-100 font-bold uppercase text-sm mb-1">{d.track_name}</p>
                                                            <p className="text-stone-400 text-xs mb-2">{d.album_name}</p>
                                                            <div className="flex justify-between items-center text-sm border-t border-stone-800 pt-2">
                                                                <span className="text-stone-500">Negatividad:</span>
                                                                <span className="text-red-500 font-mono font-bold">{(d.prob_negativa * 100).toFixed(1)}%</span>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                return null
                                            }}
                                        />
                                        <ReferenceLine y={0.5} stroke="#ef4444" strokeDasharray="3 3" opacity={0.5} />
                                        <Bar dataKey="prob_negativa">
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={ALBUM_COLORS[entry.albumIndex % ALBUM_COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    )
}
