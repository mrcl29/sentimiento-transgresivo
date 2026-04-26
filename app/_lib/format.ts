/**
 * Genera la URL del asset de carátula a partir del nombre del álbum.
 * Normaliza el nombre: elimina acentos, comas y caracteres especiales,
 * reemplaza espacios por guiones bajos.
 */
export function getAlbumCoverUrl(albumName: string): string {
  const slug = albumName
    .toLowerCase()
    .normalize('NFD') // Separa los acentos de las letras
    .replace(/[\u0300-\u036f]/g, '') // Elimina los acentos
    .replace(/,/g, '') // Elimina las comas
    .replace(/[^a-z0-9]+/g, '_') // Reemplaza espacios y caracteres raros por guiones bajos
    .replace(/^_+|_+$/g, '') // Limpia guiones bajos a los bordes
  return `/assets/${slug}.png`
}

/**
 * Formatea una duración en milisegundos a formato M:SS.
 */
export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
    .toString()
    .padStart(2, '0')
  return `${minutes}:${seconds}`
}
