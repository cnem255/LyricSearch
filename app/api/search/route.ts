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
  
  const geniusToken = process.env.GENIUS_ACCESS_TOKEN
  if (!geniusToken) {
    return Response.json({ 
      error: 'Server is not configured with GENIUS_ACCESS_TOKEN. Please add it to your environment variables. Get one at https://genius.com/api-clients' 
    }, { status: 400 })
  }

  try {
    // Use Genius API to search for songs by lyrics
    const searchUrl = `https://api.genius.com/search?q=${encodeURIComponent(q)}`
    const res = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${geniusToken}` }
    })
    
    if (!res.ok) {
      return Response.json({ error: 'Genius API error' }, { status: 502 })
    }
    
    const json = await res.json()
    const hits = json?.response?.hits || []
    
    // Map Genius results to our format
    // For each hit, fetch the Genius song page and extract a lyric snippet containing the query
    async function fetchSnippet(songUrl: string, query: string): Promise<string | undefined> {
      try {
        const pageRes = await fetch(songUrl)
        if (!pageRes.ok) return undefined
        const html = await pageRes.text()
        // Genius lyrics are inside <div data-lyrics-container="true">...</div>
        const matches = Array.from(html.matchAll(/<div[^>]*data-lyrics-container="true"[^>]*>([\s\S]*?)<\/div>/gi))
        let lyrics = matches.map(m => m[1])
          .join('\n')
          .replace(/<br\s*\/?>(\s*)/gi, '\n')
          .replace(/<[^>]+>/g, '')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .trim()
        if (!lyrics) return undefined
        // Find a snippet around the query
        const idx = lyrics.toLowerCase().indexOf(query.toLowerCase())
        if (idx !== -1) {
          const start = Math.max(0, idx - 60)
          const end = Math.min(lyrics.length, idx + query.length + 60)
          return (start > 0 ? '...' : '') + lyrics.substring(start, end) + (end < lyrics.length ? '...' : '')
        }
        // Fallback: first 120 chars
        return lyrics.substring(0, 120) + (lyrics.length > 120 ? '...' : '')
      } catch {
        return undefined
      }
    }

    let items: SearchItem[] = []
    for (let idx = 0; idx < hits.length; idx++) {
      const hit = hits[idx]
      const song = hit.result
      let snippet: string | undefined = undefined
      if (song.url) {
        snippet = await fetchSnippet(song.url, q)
      }
      items.push({
        id: String(song.id ?? idx),
        title: song.title || song.full_title || 'Unknown',
        artist: song.primary_artist?.name || song.artist_names || 'Unknown',
        snippet,
        albumArt: song.song_art_image_thumbnail_url || song.header_image_thumbnail_url || undefined,
        album: song.album?.name || undefined,
        releaseDate: song.release_date_for_display || undefined,
        links: { url: song.url }
      })
    }

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
