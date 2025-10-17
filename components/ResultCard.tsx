import type { SearchItem } from '@/lib/types'
import { highlight } from '@/lib/utils'

export default function ResultCard({ item, query }: { item: SearchItem, query: string }) {
  return (
    <article className="card">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold" dangerouslySetInnerHTML={{ __html: highlight(item.title, query) }} />
          <p className="text-sm text-neutral-600 dark:text-neutral-400" dangerouslySetInnerHTML={{ __html: highlight(item.artist, query) }} />
          {item.snippet && (
            <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300" dangerouslySetInnerHTML={{ __html: highlight(item.snippet, query) }} />
          )}
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral-500">
            {typeof item.popularity === 'number' && (
              <span className="rounded bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800">Popularity: {item.popularity}</span>
            )}
            {item.releaseDate && (
              <span className="rounded bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800">Released: {item.releaseDate}</span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {item.links?.spotifyUrl && (
            <a className="btn" href={item.links.spotifyUrl} target="_blank" rel="noreferrer">Open in Spotify</a>
          )}
          {item.links?.appleMusicUrl && (
            <a className="btn" href={item.links.appleMusicUrl} target="_blank" rel="noreferrer">Apple Music</a>
          )}
          {item.links?.url && !item.links.spotifyUrl && !item.links.appleMusicUrl && (
            <a className="btn" href={item.links.url} target="_blank" rel="noreferrer">Song Link</a>
          )}
        </div>
      </div>
    </article>
  )
}
