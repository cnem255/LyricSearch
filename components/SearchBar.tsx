"use client"
import { useState } from 'react'

export default function SearchBar({ defaultValue = '', onSubmit }: { defaultValue?: string, onSubmit: (q: string) => void }) {
  const [value, setValue] = useState(defaultValue)
  return (
    <form className="flex w-full gap-2" onSubmit={(e) => { e.preventDefault(); onSubmit(value) }}>
      <input
        className="input"
        placeholder="Search lyrics or phrases..."
        value={value}
        onChange={e => setValue(e.target.value)}
        aria-label="Search lyrics"
      />
      <button className="btn" type="submit">Search</button>
    </form>
  )
}
