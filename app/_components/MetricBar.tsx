/**
 * Barra de progreso reutilizable para métricas de tracks (0–1).
 * Client Component porque usa clases dinámicas de hover del grupo padre.
 */

interface MetricBarProps {
  value: number
}

export default function MetricBar({ value }: MetricBarProps) {
  const percent = Math.min(Math.max(value * 100, 0), 100)

  return (
    <td className="p-4 align-middle">
      <div className="flex flex-col gap-2">
        <span className="text-stone-200 text-sm font-bold tracking-tighter">
          {percent.toFixed(0)}%
        </span>
        <div className="w-full bg-stone-900 h-2.5 rounded-full overflow-hidden border border-stone-700">
          <div
            className="bg-red-700 h-full rounded-full transition-all duration-500 ease-out group-hover:bg-red-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </td>
  )
}
