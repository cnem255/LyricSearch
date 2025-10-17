import type { SearchItem } from './types'

export function escapeHtml(str: string) {
  return str.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c] as string))
}

export function highlight(text: string | undefined, query: string) {
  if (!text) return ''
  if (!query) return escapeHtml(text)
  const escaped = escapeRegExp(query)
  const re = new RegExp(`(${escaped})`, 'ig')
  return escapeHtml(text).replace(re, '<mark class="bg-yellow-200 dark:bg-yellow-700">$1</mark>')
}

export function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function sortItems(items: SearchItem[], sort: string) {
  const arr = [...items]
  switch (sort) {
    case 'popularity':
      return arr.sort((a, b) => (b.popularity ?? -1) - (a.popularity ?? -1))
    case 'title':
      return arr.sort((a, b) => a.title.localeCompare(b.title))
    case 'artist':
      return arr.sort((a, b) => a.artist.localeCompare(b.artist))
    case 'release_date':
      return arr.sort((a, b) => new Date(b.releaseDate ?? 0).getTime() - new Date(a.releaseDate ?? 0).getTime())
    default:
      return items
  }
}

export function uniqueArtists(items: SearchItem[]) {
  return Array.from(new Set(items.map(i => i.artist)))
}
