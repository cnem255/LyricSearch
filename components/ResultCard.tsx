import type { SearchItem } from '@/lib/types'
import { highlight } from '@/lib/utils'
import Image from 'next/image'

export default function ResultCard({ item, query }: { item: SearchItem, query: string }) {
  return (
    <article className="card">
      <div className="flex gap-4">
        {/* Album Art */}
        {item.albumArt && (
          <div className="hidden shrink-0 sm:block">
            <Image 
              src={item.albumArt} 
              alt={`${item.title} album art`}
              width={96}
              height={96}
              className="h-24 w-24 rounded-lg object-cover shadow-md"
              unoptimized
            />
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold" dangerouslySetInnerHTML={{ __html: highlight(item.title, query) }} />
              <p className="text-sm text-neutral-600 dark:text-neutral-400" dangerouslySetInnerHTML={{ __html: highlight(item.artist, query) }} />
              {item.album && (
                <p className="text-xs text-neutral-500 dark:text-neutral-500">Album: {item.album}</p>
              )}
              
              {/* Lyric Snippet */}
              {item.snippet && (
                <div className="mt-3 rounded-lg bg-neutral-50 p-3 dark:bg-neutral-900/50">
                  <p className="text-sm italic text-neutral-700 dark:text-neutral-300" dangerouslySetInnerHTML={{ __html: highlight(item.snippet, query) }} />
                </div>
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
            
            {/* Action Buttons */}
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {item.links?.spotifyUrl && (
                <a className="btn text-sm" href={item.links.spotifyUrl} target="_blank" rel="noreferrer">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                  Spotify
                </a>
              )}
              {item.links?.appleMusicUrl && (
                <a className="btn text-sm" href={item.links.appleMusicUrl} target="_blank" rel="noreferrer">Apple Music</a>
              )}
              {item.links?.url && !item.links.spotifyUrl && !item.links.appleMusicUrl && (
                <a className="btn text-sm" href={item.links.url} target="_blank" rel="noreferrer">Song Link</a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
