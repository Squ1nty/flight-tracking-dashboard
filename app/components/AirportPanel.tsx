// app/components/AirportPanel.tsx
'use client'

import { useEffect, useState } from 'react'
import { useTheme } from '../contextFiles/ThemeContext'
import { getAirlineInfo, toIataCallsign } from '@/lib/airlines'
import type { Flight } from '@/lib/opensky'
import type { Airport } from '@/lib/airports'
import Link from 'next/link'

type Props = {
  airport: Airport
  flights: Flight[]
  onClose: () => void
  onFlightClick: () => void
}

export default function AirportPanel({ airport, flights, onClose, onFlightClick }: Props) {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const [visible, setVisible] = useState(false)

  // Trigger slide-in after mount
  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(timeout)
  }, [])

  const handleClose = () => {
    // Slide out first, then call onClose after animation finishes
    setVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <div
      className={`absolute top-0 right-0 h-full w-80 z-[1000] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
        visible ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{
        background: 'var(--bg-surface)',
        borderLeft: '0.5px solid var(--bg-border)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-start justify-between p-5 border-b flex-shrink-0"
        style={{ borderColor: 'var(--bg-border)' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded"
              style={{ background: 'var(--jade-800)', color: 'var(--jade-100)' }}
            >
              {airport.iata}
            </span>
            <h2
              className="text-sm font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              {airport.city}
            </h2>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {airport.name}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {flights.length} aircraft on ground
          </p>
        </div>
        <button
          onClick={handleClose}
          className="text-lg leading-none rounded-md p-1 transition-colors cursor-pointer hover:bg-[var(--bg-hover)] active:scale-90"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Close airport panel"
        >
          ✕
        </button>
      </div>

      {/* Flight list */}
      <div className="flex-1 overflow-y-auto">
        {flights.length === 0 ? (
          <p
            className="text-sm text-center p-8"
            style={{ color: 'var(--text-muted)' }}
          >
            No grounded flights found
          </p>
        ) : (
          <ul>
            {flights.map((flight) => {
              const airline = getAirlineInfo(flight.callsign)
              const color = airline?.color ?? '#b8b8b8'
              const iata = toIataCallsign(flight.callsign)

              return (
                <li key={flight.icao24}>
                  <Link
                    href={`/flight/${flight.callsign}`}
                    className="flex items-center gap-3 px-5 py-3 transition-colors border-b"
                    style={{ borderColor: 'var(--bg-border)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    onClick={onFlightClick}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: color }}
                      aria-hidden="true"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-semibold truncate"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {flight.callsign}
                        {iata && iata !== flight.callsign && (
                          <span
                            className="ml-1.5 font-normal text-xs"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            ({iata})
                          </span>
                        )}
                      </p>
                      <p
                        className="text-xs truncate"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {airline?.name ?? 'Unknown Airline'} · {flight.origin_country}
                      </p>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: '#1a1a2e', color: '#8b949e' }}
                    >
                      On ground
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div
        className="p-4 border-t flex-shrink-0"
        style={{ borderColor: 'var(--bg-border)' }}
      >
        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          Click any flight to view live details
        </p>
      </div>
    </div>
  )
}