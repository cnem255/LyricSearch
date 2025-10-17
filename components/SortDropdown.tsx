"use client"

const options = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'title', label: 'Title' },
  { value: 'artist', label: 'Artist' },
  { value: 'release_date', label: 'Release Date' },
] as const

export default function SortDropdown({ value, onChange }: { value: typeof options[number]['value'], onChange: (v: any) => void }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="text-neutral-500 dark:text-neutral-400">Sort by</span>
      <select
        className="input w-auto"
        value={value}
        onChange={(e) => onChange(e.target.value as any)}
        aria-label="Sort results"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  )
}
