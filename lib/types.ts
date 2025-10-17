export type SearchItem = {
  id: string
  title: string
  artist: string
  snippet?: string
  links?: { url?: string; spotifyUrl?: string; appleMusicUrl?: string }
  popularity?: number
  releaseDate?: string
}

export type SearchResponse = { items: SearchItem[] }
