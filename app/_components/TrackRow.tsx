import type { Track } from '@/app/_types'
import { METRIC_KEYS } from '@/app/_lib/constants'
import { formatDuration } from '@/app/_lib/format'
import MetricBar from './MetricBar'

interface TrackRowProps {
  track: Track
}

/**
 * Fila <tr> de la tabla de detalle del álbum.
 * Renderiza número, título, duración, barras de métricas y tempo.
 */
export default function TrackRow({ track }: TrackRowProps) {
  return (
    <tr className="hover:bg-stone-900/30 transition-colors group">
      <td className="p-4 text-red-700 font-sans font-bold text-2xl text-center">
        {track.track_number}
      </td>
      <td className="p-4">
        <h3 className="text-lg font-bold text-stone-100 group-hover:text-red-500 transition-colors">
          {track.track_name}
        </h3>
      </td>
      <td className="p-4 text-stone-400 font-sans text-base text-center">
        {formatDuration(track.duration_ms)}
      </td>
      {METRIC_KEYS.map((key) => (
        <MetricBar key={key} value={track[key] as number} />
      ))}
      <td className="p-4 text-stone-300 font-sans text-base font-medium text-right whitespace-nowrap">
        {Math.round(track.tempo)} <span className="text-sm text-stone-500">BPM</span>
      </td>
    </tr>
  )
}
