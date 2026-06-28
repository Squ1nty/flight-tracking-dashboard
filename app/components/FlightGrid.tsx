// app/components/FlightGrid.tsx
'use client'

import { useTheme } from '../contextFiles/ThemeContext'
import type { Flight } from '@/lib/opensky'
import { getAirlineInfo } from '@/lib/airlines'
import FlightStatusPill from './FlightStatusPill'
import AirlineIcon from './AirlineIcon'
import Link from 'next/link'

type Props = {
  flights: Flight[]
}

export default function FlightGrid({ flights }: Props) {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  if (!flights || flights.length === 0) return null

  return (
    <section aria-label="Suggested flights" className="w-full mt-8">
      <h2
        className="text-sm font-semibold mb-4"
        style={{ color: 'var(--text-secondary)' }}
      >
        Suggested flights
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {flights.map((flight) => {
          const airline = getAirlineInfo(flight.callsign)
          const altM = flight.altitude ? Math.round(flight.altitude) : 0
          const speedKmh = flight.velocity ? Math.round(flight.velocity * 3.6) : 0
          const heading = flight.heading ? Math.round(flight.heading) : 0
          const status = flight.on_ground ? 'On ground' : 'Airborne'

          return (
            <Link href={`/flight/${flight.callsign}`} key={flight.icao24} className="block">
              <article
                key={flight.icao24}
                className={`rounded-lg overflow-hidden border transition-all duration-300 hover:border-[var(--jade-600-low-opa)] shadow-md hover:shadow-lg hover:translate-y-[-3px] cursor-pointer active:scale-95 active:shadow-sm ${
                  dark
                    ? 'bg-[var(--bg-surface)] border-[var(--bg-border)]'
                    : 'bg-white border-[var(--bg-border)]'
                }`}
                aria-label={`Flight ${flight.callsign} from ${flight.origin_country}`}
              >
                <div
                  className="h-24 flex items-center justify-center"
                  style={{ background: `${airline?.color ?? '#b8b8b8'}18` }}
                >
                  <AirlineIcon callsign={flight.callsign} size={72} />
                </div>

                <div className="p-3 border-t" style={{ borderColor: 'var(--bg-border)' }}>
                  <div className="flex items-center mb-0.5">
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {flight.callsign || 'N/A'}
                    </p>
                    <div className="ml-auto">
                      <FlightStatusPill status={status} />
                    </div>
                  </div>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                    {airline?.name ?? 'Unknown Airline'} · {flight.origin_country}
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
    </section>
  )
}