import { useState, useMemo, useCallback } from 'react'
import type { Track, SortKey, SortDirection } from '@/app/_types'

/**
 * Encapsula la lógica de ordenación de tracks por columna.
 * Cicla entre: sin orden → ascendente → descendente → sin orden.
 */
export function useTrackSort(tracks: Track[]) {
  const [sortKey, setSortKey] = useState<SortKey>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  const handleSort = useCallback(
    (key: keyof Track) => {
      if (sortKey === key) {
        if (sortDirection === 'asc') setSortDirection('desc')
        else if (sortDirection === 'desc') {
          setSortKey(null)
          setSortDirection(null)
        }
      } else {
        setSortKey(key)
        setSortDirection('asc')
      }
    },
    [sortKey, sortDirection]
  )

  const resetSort = useCallback(() => {
    setSortKey(null)
    setSortDirection(null)
  }, [])

  const sortedTracks = useMemo(() => {
    const sorted = [...tracks]
    if (sortKey && sortDirection) {
      sorted.sort((a, b) => {
        const aVal = a[sortKey] as string | number
        const bVal = b[sortKey] as string | number
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
    } else {
      sorted.sort((a, b) => a.track_number - b.track_number)
    }
    return sorted
  }, [tracks, sortKey, sortDirection])

  return { sortKey, sortDirection, handleSort, resetSort, sortedTracks }
}
