import { useState, useRef, useCallback } from 'react'
import { getAlbumCoverUrl } from '@/app/_lib/format'
import { DEFAULT_HOVER_COLOR } from '@/app/_lib/constants'
import type { Album } from '@/app/_types'

/**
 * Gestiona el color de fondo dinámico basado en el color dominante
 * de la carátula del álbum sobre el que se hace hover.
 * Cachea los colores ya extraídos para evitar recálculos.
 */
export function useDynamicBackground() {
  const [hoverColor, setHoverColor] = useState<string>(DEFAULT_HOVER_COLOR)
  const colorCache = useRef<Record<string, string>>({})

  // Extrae y calcula el color predominante de la carátula
  const handleMouseEnter = useCallback((album: Album) => {
    if (colorCache.current[album.name]) {
      setHoverColor(colorCache.current[album.name])
      return
    }

    const url = getAlbumCoverUrl(album.name)
    const img = document.createElement('img')
    img.src = url
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = 1
        canvas.height = 1
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, 1, 1)
          const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
          // Multiplicamos por 0.4 para oscurecer el color y mantener la atmósfera oscura
          const color = `rgb(${Math.floor(r * 0.4)}, ${Math.floor(g * 0.4)}, ${Math.floor(b * 0.4)})`
          colorCache.current[album.name] = color
          setHoverColor(color)
        }
      } catch (e) {
        console.error('Error extrayendo color', e)
      }
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoverColor(DEFAULT_HOVER_COLOR)
  }, [])

  return { hoverColor, handleMouseEnter, handleMouseLeave }
}
