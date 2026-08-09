// app/components/FlightGrid.tsx
'use client'

import { useTheme } from '../contextFiles/ThemeContext'
import type { Flight } from '@/lib/opensky'
import { getAirlineInfo } from '@/lib/airlines'
import FlightStatusPill from './FlightStatusPill'
import AirlineIcon from './AirlineIcon'
import Link from 'next/link'

type Status = 'loading' | 'ready' | 'error'

type Props = {
  flights: Flight[]
  status?: Status
}

function FlightCardSkeleton({ dark }: { dark: boolean }) {
  return (
    <div
      className={`animate-pulse rounded-lg overflow-hidden border ${
        dark ? 'bg-[var(--bg-surface)] border-[var(--bg-border)]' : 'bg-white border-[var(--bg-border)]'
      }`}
    >
      <div className="h-24" style={{ background: 'var(--bg-hover)' }} />
      <div className="p-3 border-t space-y-2" style={{ borderColor: 'var(--bg-border)' }}>
        <div className="flex items-center justify-between">
          <div className="h-3 w-14 rounded" style={{ background: 'var(--bg-hover)' }} />
          <div className="h-4 w-12 rounded-full" style={{ background: 'var(--bg-hover)' }} />
        </div>
        <div className="h-3 w-24 rounded" style={{ background: 'var(--bg-hover)' }} />
        <div className="space-y-1.5 pt-1">
          <div className="h-2.5 w-full rounded" style={{ background: 'var(--bg-hover)' }} />
          <div className="h-2.5 w-full rounded" style={{ background: 'var(--bg-hover)' }} />
          <div className="h-2.5 w-full rounded" style={{ background: 'var(--bg-hover)' }} />
        </div>
      </div>
    </div>
  )
}

export default function FlightGrid({ flights, status = 'ready' }: Props) {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  function truncateAirlineName(name: string, maxChars: number) {
    return name.length > maxChars ? `${name.slice(0, maxChars)}…` : name
  }

  return (
    // FlightGrid.tsx
    <section aria-label="Suggested flights" className="w-full mt-8 flex flex-1 flex-col">
      <h2
        className="text-sm font-semibold mb-4"
        style={{ color: 'var(--text-secondary)' }}
      >
        Suggested flights
      </h2>

      {status === 'loading' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <FlightCardSkeleton key={i} dark={dark} />
          ))}
        </div>
      )}

      {status === 'error' && (
        <div
          className="flex flex-1 min-h-[280px] items-center justify-center rounded-lg border p-6 text-center text-sm"
          style={{ borderColor: 'var(--bg-border)', color: 'var(--text-secondary)' }}
        >
          Unable to load flights right now. This can happen when live flight
          data is temporarily unavailable — try again shortly.
        </div>
      )}

      {status === 'ready' && flights.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {flights.map((flight) => {
            const airline = getAirlineInfo(flight.callsign)
            const altM = flight.altitude ? Math.round(flight.altitude) : 0
            const speedKmh = flight.velocity ? Math.round(flight.velocity * 3.6) : 0
            const heading = flight.heading ? Math.round(flight.heading) : 0
            const flightStatus = flight.on_ground ? 'On ground' : 'Airborne'

            return (
              <Link href={`/flight/${flight.callsign}`} key={flight.icao24} className="block">
                <article
                  className={`relative rounded-lg overflow-hidden border transition-all duration-300 hover:border-[var(--jade-600-low-opa)] shadow-md hover:shadow-lg hover:translate-y-[-3px] cursor-pointer active:scale-95 active:shadow-sm ${
                    dark
                      ? 'bg-[var(--bg-surface)] border-[var(--bg-border)]'
                      : 'bg-white border-[var(--bg-border)]'
                  }`}
                  aria-label={`Flight ${flight.callsign} from ${flight.origin_country}`}
                >
                  <div
                    className="h-24 flex items-center justify-center"
                    style={{ background: `${airline?.color ?? '#b8b8b8'}0d` }}
                  >
                    <AirlineIcon callsign={flight.callsign} size={72} />
                  </div>
                  {airline?.isFifo && (
                    <span
                      className="absolute top-1 right-1 sm:top-4 sm:right-4 text-xs px-1.5 py-0.5 rounded font-medium"
                      style={{ background: '#3d1a0a', color: '#C1440E' }}
                    >
                      FIFO
                    </span>
                  )}

                  <div className="p-3 border-t" style={{ borderColor: 'var(--bg-border)' }}>
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-[12px] font-semibold sm:text-sm" style={{ color: 'var(--text-primary)' }}>
                        {flight.callsign || 'N/A'}
                      </p>
                      <FlightStatusPill status={flightStatus} size="sm" />
                    </div>
                    <p className="text-xs mb-3 whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                      <span className="xs:hidden">
                        {truncateAirlineName(
                          `${airline?.name ?? 'Unknown Airline'} · ${flight.origin_country}`,
                          15
                        )}
                      </span>
                      <span className="hidden xs:inline">
                        {airline?.name ?? 'Unknown Airline'} · {flight.origin_country}
                      </span>
                    </p>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--text-muted)' }}>Alt</span>
                        <span style={{ color: 'var(--text-primary)' }}>{altM.toLocaleString()} m</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--text-muted)' }}>Speed</span>
                        <span style={{ color: 'var(--text-primary)' }}>{speedKmh.toLocaleString()} km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--text-muted)' }}>Heading</span>
                        <span style={{ color: 'var(--text-primary)' }}>{heading}°</span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}