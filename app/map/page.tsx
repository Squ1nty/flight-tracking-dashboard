// app/map/page.tsx
import { getAusnzAirspaceFlights, type Flight } from '@/lib/opensky'
import MapClient from '../components/MapClient'

export default async function MapPage() {
  let flights: Flight[] = []

  try {
    flights = await getAusnzAirspaceFlights()
  } catch (err) {
    console.warn('Initial OpenSky fetch failed, starting with empty map:', err)
    // Map will still render, auto-refresh will populate it once rate limit clears
  }

    return (
    <div className="h-[calc(100vh-57px)]">  {/* ← matches navbar height exactly */}
      <MapClient initialFlights={flights} />
    </div>
  )
}