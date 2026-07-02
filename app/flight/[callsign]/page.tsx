// app/flight/[callsign]/page.tsx

import Link from 'next/link'
import { getAusnzAirspaceFlights, type Flight } from '@/lib/opensky'
import FlightHeader from '../../components/FlightHeader'
import { toIataCallsign } from '@/lib/airlines'
import ScheduleTimes from '../../components/ScheduleTimes'
import DataDisclaimer from '../../components/DataDisclaimer'
import BackButton from '@/app/components/BackButton'

type Props = {
  params: Promise<{ callsign: string }>
}

async function getAviationStackData(callsign: string) {
  const iataCallsign = toIataCallsign(callsign) ?? callsign

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/flights?q=${iataCallsign}`,
    { cache: 'no-store' }
  )
  if (!res.ok) return null
  const json = await res.json()
  const results = json?.data ?? []

  if (results.length === 0) return null

  // Prefer today's flight_date if multiple results exist
  const today = new Date().toISOString().split('T')[0] // "2026-06-21"
  const todayMatch = results.find((f: any) => f.flight_date === today)

  return todayMatch ?? results[0] // fallback to first result if no exact date match
}

async function getLivePosition(callsign: string): Promise<Flight | null> {
  const flights = await getAusnzAirspaceFlights()
  return flights.find(f => f.callsign.toUpperCase() === callsign) ?? null
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md p-3" style={{ background: 'var(--bg-hover)' }}>
      <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{value}</p>
    </div>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className={`rounded-lg border p-5 ${title === "Route" ? 'mb-4' : ''}`}
      style={{ background: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}
    >
      <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>{title}</p>
      {children}
    </div>
  )
}

export default async function FlightDetailPage({ params }: Props) {
  const { callsign } = await params
  const decoded = decodeURIComponent(callsign).toUpperCase()

  const [scheduleData, liveData] = await Promise.all([
    getAviationStackData(decoded),
    getLivePosition(decoded),
  ])

  if (!scheduleData && !liveData) {
    return (
      <main className="max-w-xl mx-auto px-6 py-20 text-center">
        <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Flight not found
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          We couldn't find any data for "{decoded}". Check the flight number and try again.
        </p>
        <Link
          href="/"
          className="inline-block rounded-md px-5 py-2 text-sm font-medium"
          style={{ background: 'var(--jade-600)', color: 'var(--jade-100)' }}
        >
          ← Back to search
        </Link>
      </main>
    )
  }

  const altM = liveData?.altitude ? Math.round(liveData.altitude) : 0
  const speedKmh = liveData?.velocity ? Math.round(liveData.velocity * 3.6) : 0
  const heading = liveData?.heading ? Math.round(liveData.heading) : 0
  const status = liveData ? (liveData.on_ground ? 'On ground' : 'Airborne') : 'N/A'

  const showSchedule = !liveData || liveData.on_ground

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <BackButton />

      <FlightHeader
        callsign={decoded}
        originCountry={liveData?.origin_country ?? scheduleData?.airline?.country_name ?? 'N/A'}
        status={status}
      />

      <SectionCard title="Route">
        <div className="flex items-center gap-4">
          <div className="flex-1 text-center">
            <p className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
              {scheduleData?.departure?.iata ?? 'N/A'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {scheduleData?.departure?.airport ?? 'Unknown'}
            </p>
          </div>
          <div className="flex-1 h-px" style={{ background: 'var(--bg-border)' }} />
          <div className="flex-1 text-center">
            <p className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
              {scheduleData?.arrival?.iata ?? 'N/A'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {scheduleData?.arrival?.airport ?? 'Unknown'}
            </p>
          </div>
        </div>
      </SectionCard>

      {showSchedule && scheduleData && (
        <>
          <SectionCard title="Schedule">
            <ScheduleTimes
              scheduledDeparture={scheduleData?.departure?.scheduled}
              estimatedArrival={scheduleData?.arrival?.estimated}
            />
          </SectionCard>
          <DataDisclaimer />
        </>
      )}

      <SectionCard title="Live position">
        <div className="grid grid-cols-2 gap-2">
          <StatBox label="Altitude" value={liveData ? `${altM.toLocaleString()} m` : 'N/A'} />
          <StatBox label="Speed" value={liveData ? `${speedKmh.toLocaleString()} km/h` : 'N/A'} />
          <StatBox label="Heading" value={liveData ? `${heading}°` : 'N/A'} />
          <StatBox label="Status" value={status} />
        </div>
      </SectionCard>
    </main>
  )
}