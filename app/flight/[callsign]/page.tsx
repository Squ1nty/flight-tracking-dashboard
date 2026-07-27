// app/flight/[callsign]/page.tsx

import Link from 'next/link'
import { getAusnzAirspaceFlights, type Flight } from '@/lib/opensky'
import FlightHeader from '../../components/FlightHeader'
import { getAirlineInfo, toIataCallsign } from '@/lib/airlines'
import ScheduleTimes from '../../components/ScheduleTimes'
import DataDisclaimer from '../../components/DataDisclaimer'
import BackButton from '@/app/components/BackButton'
import LivePosition from '../../components/LivePosition'
import ScheduleSection from '@/app/components/ScheduleSection'
import { AIRPORT_COORDS } from '@/lib/airports'
import { getGroundStatus } from '@/lib/eta'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectDB } from "@/lib/db"
import SavedFlight from "@/models/SavedFlight"
import SaveFlightButton from "@/app/components/SaveFlightButton"

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

  const today = new Date().toISOString().split('T')[0]
  const todayMatch = results.find((f: any) => f.flight_date === today)
  const result = todayMatch ?? results[0]

  const depIata = result?.departure?.iata
  const arrIata = result?.arrival?.iata
  if (depIata && !AIRPORT_COORDS[depIata]) return null
  if (arrIata && !AIRPORT_COORDS[arrIata]) return null

  return result
}

async function getLivePosition(callsign: string): Promise<Flight | null> {
  const flights = await getAusnzAirspaceFlights()
  return flights.find(f => f.callsign.toUpperCase() === callsign) ?? null
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className={`rounded-lg border p-5 ${title === 'Route' ? 'mb-4' : ''}`}
      style={{ background: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}
    >
      <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>{title}</p>
      {children}
    </div>
  )
}

function resolveStatus(
  liveData: Flight | null,
  scheduleData: any
): 'Airborne' | 'On ground' | 'Departing' | 'Arrived' | 'Taxiing' | 'N/A' {
  if (!liveData) return 'N/A'
  if (!liveData.on_ground) return 'Airborne'

  const ground = getGroundStatus(
    liveData.latitude,
    liveData.longitude,
    scheduleData?.departure?.iata,
    scheduleData?.arrival?.iata
  )

  if (ground === 'arrived') {
    return liveData.velocity && liveData.velocity > 1.5 ? 'Taxiing' : 'Arrived'
  }
  if (ground === 'departing') return 'Departing'
  return 'On ground'
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

  const status = resolveStatus(liveData, scheduleData)
  const airline = getAirlineInfo(decoded)
  const originCountry = liveData?.origin_country ?? scheduleData?.airline?.country_name ?? 'N/A'

  // Auth + saved-state check — session drives both whether the button
  // prompts a login redirect and whether it renders as already-saved
  const session = await getServerSession(authOptions)
  let initiallySaved = false

  if (session?.user?.id) {
    await connectDB()
    const existing = await SavedFlight.findOne({
      userId: session.user.id,
      callsign: decoded,
    })
    initiallySaved = !!existing
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <BackButton />

      <div className="flex items-start justify-between gap-4">
        <FlightHeader
          callsign={decoded}
          originCountry={originCountry}
          status={status}
        />
        <SaveFlightButton
          callsign={decoded}
          airlineName={airline?.name ?? null}
          originCountry={originCountry === 'N/A' ? null : originCountry}
          isAuthenticated={!!session?.user?.id}
          initiallySaved={initiallySaved}
        />
      </div>

      {airline?.isFifo ? (
        <div className="mb-4">
          <span
            className="text-xs px-3 py-1 rounded-full font-medium"
            style={{ background: '#3d1a0a', color: '#C1440E' }}
          >
            ⛏ FIFO Flight · WA Mining Operations
          </span>
        </div>
      ) : null}

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

      <SectionCard title="Schedule">
        <ScheduleSection
          initialFlight={liveData}
          callsign={decoded}
          scheduledDeparture={scheduleData?.departure?.scheduled}
          arrivalIata={scheduleData?.arrival?.iata}
        />
      </SectionCard>
      <DataDisclaimer />

      <SectionCard title="Live position">
        <LivePosition
          callsign={decoded}
          initialFlight={liveData}
        />
      </SectionCard>
    </main>
  )
}