'use client'

import { useState, useMemo } from 'react'
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts'
import type { Track } from '@/app/_types'
import { METRIC_COLUMNS } from '@/app/_lib/constants'

// Colores brutales para los álbumes (paleta vibrante para contrastar con el fondo oscuro)
const ALBUM_COLORS = [
    '#ef4444', // red-500
    '#3b82f6', // blue-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#06b6d4', // cyan-500
    '#84cc16', // lime-500
    '#f97316', // orange-500
    '#6366f1', // indigo-500
    '#14b8a6', // teal-500
    '#d946ef', // fuchsia-500
]

// Añadimos Tempo a las métricas disponibles para el gráfico
const CHART_METRICS = [
    ...METRIC_COLUMNS,
    { label: 'Tempo', key: 'tempo', className: '', justifyClass: '' }
]

export default function FeatureScatterPlot({ tracks }: { tracks: Track[] }) {
    const [xKey, setXKey] = useState<keyof Track>('energy')
    const [yKey, setYKey] = useState<keyof Track>('acousticness')

    // Agrupar tracks por álbum para el gráfico
    const { datasets, xLabel, yLabel } = useMemo(() => {
        const groups: Record<string, any[]> = {}
        
        tracks.forEach(t => {
            if (!groups[t.album_name]) groups[t.album_name] = []
            // Convertimos posibles valores booleanos o string a números si es necesario
            // pero las métricas que elegimos ya deberían ser números
            groups[t.album_name].push({
                name: t.track_name,
                album: t.album_name,
                x: Number(t[xKey]) || 0,
                y: Number(t[yKey]) || 0,
                z: t.duration_ms, // tamaño basado en duración
                duration: t.duration_ms
            })
        })

        const datasets = Object.keys(groups).map((album, idx) => ({
            album,
            color: ALBUM_COLORS[idx % ALBUM_COLORS.length],
            data: groups[album]
        }))

        const xLabel = CHART_METRICS.find(m => m.key === xKey)?.label || String(xKey)
        const yLabel = CHART_METRICS.find(m => m.key === yKey)?.label || String(yKey)

        return { datasets, xLabel, yLabel }
    }, [tracks, xKey, yKey])

    if (tracks.length === 0) return null

    // Tooltip personalizado para el gráfico
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div className="bg-stone-900 border border-stone-700 p-3 shadow-xl max-w-[250px]">
                    <p className="text-stone-100 font-bold text-sm mb-1 leading-tight">{data.name}</p>
                    <p className="text-stone-400 text-xs italic mb-2 border-b border-stone-800 pb-2">{data.album}</p>
                    <div className="flex flex-col gap-1">
                        <p className="text-stone-300 text-xs flex justify-between gap-4">
                            <span className="font-bold text-stone-500 uppercase">{xLabel}:</span> 
                            <span>{typeof data.x === 'number' ? data.x.toFixed(2) : data.x}</span>
                        </p>
                        <p className="text-stone-300 text-xs flex justify-between gap-4">
                            <span className="font-bold text-stone-500 uppercase">{yLabel}:</span> 
                            <span>{typeof data.y === 'number' ? data.y.toFixed(2) : data.y}</span>
                        </p>
                        <p className="text-stone-300 text-xs flex justify-between gap-4 mt-1 border-t border-stone-800 pt-1">
                            <span className="font-bold text-stone-500 uppercase">Duración:</span> 
                            <span>{Math.floor(data.duration / 60000)}:{(Math.floor((data.duration % 60000) / 1000)).toString().padStart(2, '0')}</span>
                        </p>
                    </div>
                </div>
            )
        }
        return null
    }

    return (
        <div className="mt-12 mb-8 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h3 className="text-2xl font-black text-stone-50 uppercase tracking-tighter">
                        Característica vs Característica
                    </h3>
                    <p className="text-stone-400 text-sm mt-1">
                        El tamaño del punto indica la duración de la canción. Pasa el ratón para ver detalles.
                    </p>
                </div>
                
                <div className="flex gap-4 shrink-0">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-stone-500 font-bold uppercase tracking-wider">Eje X</label>
                        <select
                            value={xKey as string}
                            onChange={(e) => setXKey(e.target.value as keyof Track)}
                            className="bg-stone-900 border border-stone-700 text-stone-100 text-sm rounded-sm px-3 py-2 focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
                        >
                            {CHART_METRICS.map(m => (
                                <option key={m.key} value={m.key}>{m.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-stone-500 font-bold uppercase tracking-wider">Eje Y</label>
                        <select
                            value={yKey as string}
                            onChange={(e) => setYKey(e.target.value as keyof Track)}
                            className="bg-stone-900 border border-stone-700 text-stone-100 text-sm rounded-sm px-3 py-2 focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
                        >
                            {CHART_METRICS.map(m => (
                                <option key={m.key} value={m.key}>{m.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="w-full bg-stone-900/40 border border-stone-800 p-4 sm:p-6 rounded-sm shadow-inner">
                <ResponsiveContainer width="100%" height={500}>
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={true} horizontal={true} />
                        <XAxis 
                            type="number" 
                            dataKey="x" 
                            name={xLabel} 
                            tick={{ fill: '#78716c', fontSize: 12 }}
                            tickFormatter={(val) => val.toFixed(1)}
                            tickMargin={10}
                            domain={['auto', 'auto']}
                        />
                        <YAxis 
                            type="number" 
                            dataKey="y" 
                            name={yLabel} 
                            tick={{ fill: '#78716c', fontSize: 12 }} 
                            tickFormatter={(val) => val.toFixed(1)}
                            tickMargin={10}
                            domain={['auto', 'auto']}
                        />
                        {/* ZAxis controla el tamaño del punto (range es el área min/max) */}
                        <ZAxis type="number" dataKey="z" range={[100, 800]} name="Duración" />
                        <Tooltip 
                            content={<CustomTooltip />} 
                            cursor={{ strokeDasharray: '3 3', stroke: '#57534e' }} 
                            isAnimationActive={false}
                        />
                        <Legend 
                            wrapperStyle={{ fontSize: '12px', paddingTop: '20px', color: '#a8a29e' }}
                            iconType="circle"
                        />
                        {datasets.map((ds) => (
                            <Scatter 
                                key={ds.album} 
                                name={ds.album} 
                                data={ds.data} 
                                fill={ds.color} 
                                opacity={0.75}
                            />
                        ))}
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
