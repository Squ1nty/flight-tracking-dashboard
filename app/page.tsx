// app/page.tsx
import SearchBar from './components/SearchBar'
import FlightGrid from './components/FlightGrid'
import { getAusnzAirspaceFlights } from '@/lib/opensky'

function getRandomFlights(flights: any[], count: number) {
  const shuffled = [...flights].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export default async function Home() {
  const flights = await getAusnzAirspaceFlights()
  const suggested = getRandomFlights(
    flights.filter(f => f.callsign && f.callsign !== 'N/A'),
    12  // fetch 12, CSS grid shows fewer on smaller screens
  )

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-10 w-full">
      <SearchBar />
      <FlightGrid flights={suggested} />
    </main>
  )
}