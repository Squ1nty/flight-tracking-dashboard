// app/components/SearchBar.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '../contextFiles/ThemeContext'
import { getAirlineInfo } from '@/lib/airlines'
import type { Flight } from '@/lib/opensky'

interface Props {
  initialFlights: Flight[]
}

export default function SearchBar({ initialFlights }: Props) {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [flights, setFlights] = useState<Flight[]>(initialFlights)
  const [results, setResults] = useState<Flight[]>([])
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Keep flights fresh with same polling as suggested grid
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/opensky')
        if (res.ok) {
          const data: Flight[] = await res.json()
          setFlights(data)
        }
      } catch (err) {
        console.error('SearchBar refresh failed:', err)
      }
    }, 20000)
    return () => clearInterval(interval)
  }, [])

  // Filter on every keystroke
  useEffect(() => {
    const q = query.trim().toUpperCase()
    if (!q) {
      setResults([])
      setOpen(false)
      return
    }

    const filtered = flights
      .filter(f => {
        if (!f.callsign || f.callsign === 'N/A') return false
        const airline = getAirlineInfo(f.callsign)
        if (!airline) return false

        const matchesCallsign = f.callsign.toUpperCase().includes(q)
        const matchesAirline = airline.name.toUpperCase().includes(q)
        return matchesCallsign || matchesAirline
      })
      .slice(0, 5)

    setResults(filtered)
    setOpen(filtered.length > 0)
  }, [query, flights])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim().toUpperCase()
    if (!trimmed) return
    setOpen(false)
    router.push(`/flight/${trimmed}`)
  }

  const handleSelect = (flight: Flight) => {
    setQuery(flight.callsign)
    setOpen(false)
    router.push(`/flight/${flight.callsign}`)
  }

  return (
    <div className="w-full flex flex-col items-center py-8">
      <label
        htmlFor="flight-search"
        className="text-xs font-semibold uppercase tracking-wider mb-2"
        style={{ color: 'var(--text-secondary)' }}
      >
        Search flights
      </label>

      <div ref={wrapperRef} className="w-full max-w-xl relative">
        <form role="search" aria-label="Flight search" onSubmit={handleSubmit}>
          <div
            className={`flex items-center gap-3 rounded-lg border px-5 py-3 transition-all duration-150 focus-within:border-[var(--jade-600)] focus-within:shadow-[0_0_0_3px_rgba(46,140,94,0.15)] ${
              dark
                ? 'bg-[var(--bg-surface)] border-[var(--bg-border)]'
                : 'bg-[var(--bg-surface)] border-[var(--bg-border)]'
            }`}
          >

            <input
              type="text"
              id="flight-search"
              name="flight-search"
              placeholder="e.g. QFA001, VOZ897, Qantas..."
              autoComplete="off"
              aria-describedby="search-helper"
              aria-expanded={open}
              aria-autocomplete="list"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setOpen(true)}
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: 'var(--text-primary)' }}
            />

            <button
              type="submit"
              aria-label="Search for flight"
              className="flex-shrink-0 rounded-md px-5 py-2 text-sm font-medium transition-colors duration-150 cursor-pointer"
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
            Enter a flight number, callsign, or airline name
          </p>
        </form>

        {/* Dropdown */}
        {open && results.length > 0 && (
          <div
            className="absolute top-full left-0 right-0 mt-1 rounded-lg border overflow-hidden z-50 shadow-lg"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--bg-border)',
            }}
            role="listbox"
            aria-label="Flight suggestions"
          >
            {results.map((flight, i) => {
              const airline = getAirlineInfo(flight.callsign)
              const color = airline?.color ?? '#b8b8b8'
              const status = flight.on_ground ? 'On ground' : 'Airborne'
              const isLast = i === results.length - 1

              return (
                <button
                  key={flight.icao24}
                  role="option"
                  onClick={() => handleSelect(flight)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                  style={{
                    borderBottom: isLast ? 'none' : `0.5px solid var(--bg-border)`,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Airline color dot */}
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: color }}
                    aria-hidden="true"
                  />

                  {/* Flight info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {flight.callsign}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                      {airline?.name ?? 'Unknown'} · {flight.origin_country}
                    </p>
                  </div>

                  {/* Status pill */}
                  <span
                    className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium"
                    style={{
                      background: flight.on_ground ? '#1a1a2e' : '#0d2818',
                      color: flight.on_ground ? '#8b949e' : '#3fb950',
                    }}
                  >
                    {status}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}