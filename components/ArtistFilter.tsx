"use client"
import { useMemo, useState } from 'react'

export default function ArtistFilter({ artists, selected, onChange, disabled }: { artists: string[], selected: string[], onChange: (list: string[]) => void, disabled?: boolean }) {
  const [open, setOpen] = useState(false)
  const allSelected = selected.length === artists.length

  function toggle(artist: string) {
    if (selected.includes(artist)) onChange(selected.filter(a => a !== artist))
    else onChange([...selected, artist])
  }

  function toggleAll() {
    onChange(allSelected ? [] : artists)
  }

  return (
    <div className="card">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-medium">Filter by Artist</h2>
        <button className="text-sm text-brand-600 hover:underline sm:hidden" onClick={() => setOpen(s => !s)}>{open ? 'Hide' : 'Show'}</button>
      </div>
      <div className={`space-y-2 ${open ? 'block' : 'hidden sm:block'}`}>
        <div className="flex items-center justify-between">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" className="checkbox" checked={allSelected} onChange={toggleAll} disabled={disabled} />
            All artists
          </label>
          <span className="text-xs text-neutral-500">{artists.length}</span>
        </div>
        <div className="max-h-72 space-y-1 overflow-auto pr-1">
          {artists.map(artist => (
            <label key={artist} className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="checkbox" checked={selected.includes(artist)} onChange={() => toggle(artist)} disabled={disabled} />
              <span className="truncate">{artist}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
