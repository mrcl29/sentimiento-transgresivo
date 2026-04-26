import { useState, useEffect, useCallback } from 'react'
import type { Album } from '@/app/_types'

/**
 * Encapsula el estado del modal de detalle de álbum:
 * - Apertura/cierre con animación
 * - Bloqueo de scroll del body
 * - Cierre con tecla ESC
 */
export function useAlbumModal() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const openAlbum = useCallback((album: Album) => {
    setSelectedAlbum(album)
    // Retraso mínimo para permitir que el DOM se monte antes de aplicar las clases de transición
    setTimeout(() => setIsAnimating(true), 10)
  }, [])

  const closeAlbum = useCallback(() => {
    setIsAnimating(false)
    // Espera a que termine la animación antes de desmontar el componente
    setTimeout(() => setSelectedAlbum(null), 300)
  }, [])

  useEffect(() => {
    if (selectedAlbum) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = '0px'
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAlbum()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedAlbum, closeAlbum])

  return { selectedAlbum, isAnimating, openAlbum, closeAlbum }
}
