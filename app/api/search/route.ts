import { NextRequest } from 'next/server'
import type { SearchItem, SearchResponse } from '@/lib/types'
import { sortItems } from '@/lib/utils'
import { searchSpotifyPopularity } from '@/lib/spotify'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').trim()
  const artistsParam = searchParams.get('artists') || ''
  const sort = searchParams.get('sort') || 'relevance'

  if (!q) return Response.json({ error: 'Missing q parameter' }, { status: 400 })
  const token = process.env.AUDD_API_TOKEN
  if (!token) {
    return Response.json({ error: 'Server is not configured with AUDD_API_TOKEN. Please add it to .env.local.' }, { status: 400 })
  }

  try {
    // AudD doesn't have a public "lyrics search" by phrase documented in the standard endpoint,
    // but they support returning lyrics with apple_music/spotify and searching by URL/audio.
    // We'll use their lyrics search parameter via the unofficial 'lyrics' method if available.
    // Fallback: use the standard recognition with "return=apple_music,spotify" on a sample url is not applicable.
    // Instead, use their lyrics search endpoint documented in examples: https://api.audd.io/findLyrics/
    const apiUrl = 'https://api.audd.io/findLyrics/'
    const body = new URLSearchParams({ q, api_token: token })
    const res = await fetch(apiUrl, { method: 'POST', body })
    const json = await res.json()
    if (!res.ok || json?.status === 'error') {
      const msg = json?.error?.error_message || 'AudD error'
      return Response.json({ error: msg }, { status: 502 })
    }
    const results: any[] = Array.isArray(json?.result) ? json.result : []

    let items: SearchItem[] = results.map((r, idx) => ({
      id: String(r.id ?? idx),
      title: r.title || r.full_title || r.song_title || 'Unknown',
      artist: r.artist || r.artist_name || 'Unknown',
      snippet: r.text || r.snippet || undefined,
      links: { url: r.song_link || r.url }
    }))

    // Filter by artists if provided
    const filterArtists = artistsParam
      ? artistsParam.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
      : null
    if (filterArtists && filterArtists.length) {
      items = items.filter(i => filterArtists!.includes(i.artist.toLowerCase()))
    }

    // Optional popularity enrichment using Spotify
    const canEnrich = !!(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET)
    if (canEnrich) {
      const enriched = await Promise.all(items.slice(0, 20).map(async (i) => {
        try {
          const info = await searchSpotifyPopularity(i.title, i.artist)
          return { 
            ...i, 
            popularity: info?.popularity, 
            albumArt: info?.albumArt,
            album: info?.album,
            links: { ...i.links, spotifyUrl: info?.spotifyUrl } 
          }
        } catch {
          return i
        }
      }))
      // append rest without enrichment if > 20
      items = enriched.concat(items.slice(20))
    }

    // Sort
    items = sortItems(items, sort)

    const payload: SearchResponse = { items }
    return Response.json(payload)
  } catch (e: any) {
    return Response.json({ error: e?.message || 'Unexpected server error' }, { status: 500 })
  }
}
