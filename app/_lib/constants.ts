import type { MetricColumn } from '@/app/_types'

/** Color de fondo por defecto (rojo oscuro, acorde a la temática Extremoduro) */
export const DEFAULT_HOVER_COLOR = '#380a0a'

/** Columnas de métricas de la tabla de tracks, en orden de aparición */
export const METRIC_COLUMNS: MetricColumn[] = [
  { label: 'Bailable', key: 'danceability', className: 'w-28', justifyClass: 'justify-start' },
  { label: 'Energía', key: 'energy', className: 'w-28', justifyClass: 'justify-start' },
  { label: 'Valencia', key: 'valence', className: 'w-28', justifyClass: 'justify-start' },
  { label: 'Acústica', key: 'acousticness', className: 'w-28', justifyClass: 'justify-start' },
  { label: 'Instrum.', key: 'instrumentalness', className: 'w-28', justifyClass: 'justify-start' },
  { label: 'Directo', key: 'liveness', className: 'w-28', justifyClass: 'justify-start' },
  { label: 'Hablado', key: 'speechiness', className: 'w-28', justifyClass: 'justify-start' },
]

/** Keys de las métricas en el mismo orden que METRIC_COLUMNS, para acceder a los valores del track */
export const METRIC_KEYS = METRIC_COLUMNS.map((col) => col.key) as (keyof import('@/app/_types').Track)[]
