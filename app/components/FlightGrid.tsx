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
        className="w-[72px] h-[72px] rounded-lg items-center justify-center text-white text-2xl p-3"
        style={{
          background: color,
          display: airline ? 'none' : 'flex'
        }}
        aria-hidden="true"
      >
        <svg width="800px" height="800px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"> // Default plane icon from Ionicons v5 (MIT License)
          <title>ionicons-v5-a</title>
          <path d="M407.72,224c-3.4,0-14.79.1-18,.3l-64.9,1.7a1.83,1.83,0,0,1-1.69-.9L193.55,67.56A9,9,0,0,0,186.89,64H160l73,161a2.35,2.35,0,0,1-2.26,3.35l-121.69,1.8a8.06,8.06,0,0,1-6.6-3.1l-37-45c-3-3.9-8.62-6-13.51-6H33.08c-1.29,0-1.1,1.21-.75,2.43L52.17,249.9a16.3,16.3,0,0,1,0,11.9L32.31,333c-.59,1.95-.52,3,1.77,3H52c8.14,0,9.25-1.06,13.41-6.3l37.7-45.7a8.19,8.19,0,0,1,6.6-3.1l120.68,2.7a2.7,2.7,0,0,1,2.43,3.74L160,448h26.64a9,9,0,0,0,6.65-3.55L323.14,287c.39-.6,2-.9,2.69-.9l63.9,1.7c3.3.2,14.59.3,18,.3C452,288.1,480,275.93,480,256S452.12,224,407.72,224Z" 
                style={{ fill: 'none', 
                  stroke: '#000000', 
                  strokeLinecap: 'round', 
                  strokeLinejoin: 'round', 
                  strokeWidth: '24px' 
                }}
              />
        </svg>
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
          const accentColor = airline?.color ?? '#b8b8b8'
          const altM = flight.altitude ? Math.round(flight.altitude) : 0
          const speedKmh = flight.velocity ? Math.round(flight.velocity * 3.6) : 0
          const heading = flight.heading ? Math.round(flight.heading) : 0

          return (
            <article
              key={flight.icao24}
              className={`rounded-lg overflow-hidden border transition-all duration-300 hover:border-[var(--jade-600-low-opa)] shadow-md hover:shadow-lg hover:translate-y-[-3px] cursor-pointer ${
                dark
                  ? 'bg-[var(--bg-surface)] border-[var(--bg-border)]'
                  : 'bg-white border-[var(--bg-border)]'
              }`}
              aria-label={`Flight ${flight.callsign} from ${flight.origin_country}`}
            >
              <AirlineHeader callsign={flight.callsign} color={accentColor} />

              <div className="p-3 border-t" style={{ borderColor: 'var(--bg-border)' }}>
                <div className="flex items-center mb-0.5">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {flight.callsign || 'N/A'}
                  </p>
                  <div className="ml-auto">
                    <StatusPill onGround={flight.on_ground} />
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
          )
        })}
      </div>
    </section>
  )
}