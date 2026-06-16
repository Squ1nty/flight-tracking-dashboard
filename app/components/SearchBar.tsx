// app/components/SearchBar.tsx
'use client'

import { useTheme } from '../contextFiles/ThemeContext'

export default function SearchBar() {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  return (
    <div className="w-full flex flex-col items-center py-8">
      <label
        htmlFor="flight-search"
        className="text-xs font-semibold uppercase tracking-wider mb-2"
        style={{ color: 'var(--text-secondary)' }}
      >
        Search flights
      </label>

      <form role="search" aria-label="Flight search" className="w-full max-w-xl">
        <div
          className={`flex items-center gap-3 rounded-lg border px-5 py-3 transition-all duration-150 focus-within:border-[var(--jade-600)] focus-within:shadow-[0_0_0_3px_rgba(46,140,94,0.15)] ${
            dark
              ? 'bg-[var(--bg-surface)] border-[var(--bg-border)]'
              : 'bg-[var(--bg-surface)] border-[var(--bg-border)]'
          }`}
        >
          <span aria-hidden="true" className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            🔍
          </span>

          <input
            type="text"
            id="flight-search"
            name="flight-search"
            placeholder="e.g. QF001, JQ123, NZ789..."
            autoComplete="off"
            aria-describedby="search-helper"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: 'var(--text-primary)' }}
          />

          <button
            type="submit"
            aria-label="Search for flight"
            className="flex-shrink-0 rounded-md px-5 py-2 text-sm font-medium transition-colors duration-150"
            style={{ background: 'var(--jade-600)', color: 'var(--jade-100)' }}
          >
            Search
          </button>
        </div>

        <p
          id="search-helper"
          className="text-center text-xs mt-2"
          style={{ color: 'var(--text-muted)' }}
        >
          Enter a flight number or callsign to track its live status
        </p>
      </form>
    </div>
  )
}