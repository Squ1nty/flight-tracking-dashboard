// app/map/page.tsx — Server Component, just fetches data
import { getAusnzAirspaceFlights } from '@/lib/opensky'
import MapClient from '../components/MapClient'

export default async function MapPage() {
  const flights = await getAusnzAirspaceFlights()
  return <MapClient initialFlights={flights} />
}