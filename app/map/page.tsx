// app/map/page.tsx

import dynamic from 'next/dynamic'
import { getAusnzAirspaceFlights } from '@/lib/opensky'

const FlightMap = dynamic(() => import('../components/FlightMap'), {
  loading: () => (
    <div
      className="w-full h-[calc(100vh-56px)] flex items-center justify-center"
      style={{ background: 'var(--bg-page)' }}
    >
      <p className="text-sm animate-pulse" style={{ color: 'var(--text-muted)' }}>
        Loading map...
      </p>
    </div>
  )
})

export default async function MapPage() {
  const flights = await getAusnzAirspaceFlights()

  return (
    <div className="w-full h-[calc(100vh-56px)]">
      <FlightMap initialFlights={flights} />
    </div>
  )
}