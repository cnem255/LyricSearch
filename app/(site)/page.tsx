"use client"
import Link from 'next/link'
import SearchBar from '@/components/SearchBar'
import SortDropdown from '@/components/SortDropdown'
import ArtistFilter from '@/components/ArtistFilter'
import ResultCard from '@/components/ResultCard'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import EmptyState from '@/components/EmptyState'
import ErrorState from '@/components/ErrorState'
import Footer from '@/components/Footer'
import { useEffect, useState } from 'react'

type Item = import('@/lib/types').SearchItem

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">LyricSearch</h1>
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          Find songs by lyrics. Powered by AudD. <Link href="https://audd.io/" className="underline" target="_blank">Learn more</Link>
        </div>
      </header>

      <ClientHome />

      <Footer />
    </main>
  )
}

function ClientHome() {
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<'relevance'|'popularity'|'title'|'artist'|'release_date'>('relevance')
  const [selectedArtists, setSelectedArtists] = useState<string[]>([])
  const [items, setItems] = useState<Item[]|null>(null)
  const [artists, setArtists] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!items) return
    const unique = Array.from(new Set(items.map((i: Item) => i.artist))).sort()
    setArtists(unique)
    setSelectedArtists(unique)
  }, [items])

  async function fetchResults(nextQ: string, nextArtists: string[] = selectedArtists, nextSort = sort) {
    if (!nextQ.trim()) return
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ q: nextQ, sort: nextSort })
      if (nextArtists.length && nextArtists.length !== artists.length) {
        params.set('artists', nextArtists.join(','))
      }
      const res = await fetch(`/api/search?${params.toString()}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to search')
      setItems(data.items)
    } catch (e:any) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function onSubmit(value: string) {
    setQ(value)
    fetchResults(value)
  }

  function onSortChange(val: typeof sort) {
    setSort(val)
    if (q) fetchResults(q, selectedArtists, val)
  }

  function onArtistChange(list: string[]) {
    setSelectedArtists(list)
    if (q) fetchResults(q, list)
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <section className="lg:col-span-9">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar defaultValue={q} onSubmit={onSubmit} />
          <SortDropdown value={sort} onChange={onSortChange} />
        </div>
        {loading && (
          <div className="grid gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        )}
        {!loading && error && <ErrorState message={error} />}
        {!loading && !error && items && items.length === 0 && <EmptyState />}
        {!loading && !error && items && items.length > 0 && (
          <div className="grid gap-3">
            {items.map((item: Item) => (
              <ResultCard key={item.id} item={item} query={q} />
            ))}
          </div>
        )}
      </section>
      <aside className="lg:col-span-3">
        <ArtistFilter
          artists={artists}
          selected={selectedArtists}
          onChange={onArtistChange}
          disabled={!items || items.length === 0}
        />
      </aside>
    </div>
  )
}
