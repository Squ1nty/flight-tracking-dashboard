// app/components/FlightGrid.tsx
'use client'

import { useTheme } from '../contextFiles/ThemeContext'
import type { Flight } from '@/lib/opensky'
import { getAirlineInfo } from '@/lib/airlines'

type Props = {
  flights: Flight[]
}

function StatusPill({ onGround }: { onGround: boolean }) {
  return onGround ? (
    <span
      className="inline-block text-xs px-3 py-1 rounded-full font-medium"
      style={{ background: '#1a1a2e', color: '#8b949e' }}
    >
      On ground
    </span>
  ) : (
    <span
      className="inline-block text-xs px-3 py-1 rounded-full font-medium"
      style={{ background: '#0d2818', color: '#3fb950' }}
    >
      Airborne
    </span>
  )
}

function AirlineHeader({ callsign, color }: { callsign: string; color: string }) {
  const airline = getAirlineInfo(callsign)

  return (
    <div
      className="h-24 flex items-center justify-center relative"
      style={{ background: `${color}18` }}  // 10% opacity tint
    >
      {airline ? (
        <img
          src={`https://img.logo.dev/${airline.domain}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&size=92`}
          alt={`${airline.name} logo`}
          width={72}
          height={72}
          className="object-contain rounded-lg"
          onError={(e) => {
            const img = e.currentTarget
            img.style.display = 'none'
            const fallback = img.nextElementSibling as HTMLElement
            if (fallback) fallback.style.display = 'flex'
          }}
        />
      ) : null}
      <div
        className="w-16 h-16 rounded-lg items-center justify-center text-white text-2xl"
        style={{
          background: color,
          display: airline ? 'none' : 'flex'
        }}
        aria-hidden="true"
      >
        ✈
      </div>
    </div>
  )
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
          const accentColor = airline?.color ?? '#2e8c5e'
          const altM = flight.altitude ? Math.round(flight.altitude) : 0
          const speedKmh = flight.velocity ? Math.round(flight.velocity * 3.6) : 0
          const heading = flight.heading ? Math.round(flight.heading) : 0

          return (
            <article
              key={flight.icao24}
              className={`rounded-lg overflow-hidden border transition-all duration-200 hover:border-[var(--jade-600)] hover:translate-y-[-2px] ${
                dark
                  ? 'bg-[var(--bg-surface)] border-[var(--bg-border)]'
                  : 'bg-white border-[var(--bg-border)]'
              }`}
              aria-label={`Flight ${flight.callsign} from ${flight.origin_country}`}
            >
              <AirlineHeader callsign={flight.callsign} color={accentColor} />

              <div
                className="p-3 border-t"
                style={{ borderColor: 'var(--bg-border)' }}
              >
                <p
                  className="text-sm font-semibold mb-0.5"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {flight.callsign || 'N/A'}
                </p>
                <p
                  className="text-xs mb-3"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {airline?.name ?? 'Unknown'} · {flight.origin_country}
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
                  <div className="mt-2">
                    <StatusPill onGround={flight.on_ground} />
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}