import { useMemo } from 'react'
import data from '@/data/dataset.json'
import type { Track, Album } from '@/app/_types'

/**
 * Agrupa las canciones del dataset por álbum, las ordena por año
 * y las separa por artista (Extremoduro vs Robe).
 */
export function useAlbumData() {
  return useMemo(() => {
    const map = new Map<string, Album>()
    ;(data as Track[]).forEach((track) => {
      if (!map.has(track.album_name)) {
        map.set(track.album_name, {
          name: track.album_name,
          artist: track.artista_busqueda,
          year: track.year,
          tracks: [],
        })
      }
      map.get(track.album_name)!.tracks.push(track)
    })
    const allAlbums = Array.from(map.values()).sort((a, b) => a.year - b.year)
    return {
      extremoduroAlbums: allAlbums.filter((a) => a.artist === 'Extremoduro'),
      robeAlbums: allAlbums.filter((a) => a.artist === 'Robe'),
    }
  }, [])
}
