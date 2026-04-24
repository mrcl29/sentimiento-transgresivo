export type TrackList = Track[]

export interface Track {
  track_id: string
  track_name: string
  album_name: string
  year: number
  duration_ms: number
  track_number: number
  disc_number: number
  explicit: string
  acousticness: number
  analysis_url: string
  danceability: number
  energy: number
  id: string
  instrumentalness: number
  key: number
  liveness: number
  loudness: number
  mode: number
  speechiness: number
  tempo: number
  time_signature: number
  track_href: string
  type: string
  uri: string
  valence: number
  duration_min: number
  letra: string
  artista_busqueda: string
}
