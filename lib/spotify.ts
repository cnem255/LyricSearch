type Token = { access_token: string; token_type: string; expires_in: number }

let cachedToken: { token: string; expiresAt: number } | null = null

export async function getSpotifyToken(): Promise<string | null> {
  const id = process.env.SPOTIFY_CLIENT_ID
  const secret = process.env.SPOTIFY_CLIENT_SECRET
  if (!id || !secret) return null
  const now = Date.now()
  if (cachedToken && cachedToken.expiresAt > now + 60_000) return cachedToken.token
  const params = new URLSearchParams({ grant_type: 'client_credentials' })
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  })
  if (!res.ok) return null
  const data = await res.json() as Token
  cachedToken = { token: data.access_token, expiresAt: Date.now() + (data.expires_in * 1000) }
  return cachedToken.token
}

export async function searchSpotifyPopularity(q: string, artist: string): Promise<{ popularity?: number; spotifyUrl?: string } | null> {
  const token = await getSpotifyToken()
  if (!token) return null
  const spQ = encodeURIComponent(`${q} artist:${artist}`)
  const res = await fetch(`https://api.spotify.com/v1/search?type=track&limit=1&q=${spQ}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) return null
  const data = await res.json()
  const item = data?.tracks?.items?.[0]
  if (!item) return null
  return { popularity: item.popularity as number, spotifyUrl: item.external_urls?.spotify as string | undefined }
}
