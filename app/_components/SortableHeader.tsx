import type { Track, SortKey, SortDirection } from '@/app/_types'

interface SortableHeaderProps {
  label: string
  columnKey: keyof Track
  className: string
  justifyClass?: string
  sortKey: SortKey
  sortDirection: SortDirection
  onSort: (key: keyof Track) => void
}

/**
 * Celda <th> reutilizable con indicadores de orden (↑↓↕).
 */
export default function SortableHeader({
  label,
  columnKey,
  className,
  justifyClass = 'justify-start',
  sortKey,
  sortDirection,
  onSort,
}: SortableHeaderProps) {
  const isActive = sortKey === columnKey

  return (
    <th
      className={`p-4 font-bold cursor-pointer hover:text-stone-100 transition-colors select-none group ${className}`}
      onClick={() => onSort(columnKey)}
      title={`Ordenar por ${label}`}
    >
      <div className={`w-full flex items-center gap-2 ${justifyClass}`}>
        {label}
        <span
          className={`w-4 inline-block text-center text-lg font-black transition-opacity ${
            isActive ? 'text-red-500 opacity-100' : 'text-stone-500 opacity-0 group-hover:opacity-50'
          }`}
        >
          {isActive ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </div>
    </th>
  )
}
