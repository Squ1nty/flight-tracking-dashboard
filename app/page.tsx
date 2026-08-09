// app/page.tsx
import SearchBar from './components/SearchBar'
import { getAusnzAirspaceFlights } from '@/lib/opensky'
import { getAirlineInfo } from '@/lib/airlines'
import SuggestedFlights from './components/SuggestedFlights'

function getRandomFlights(flights: any[], count: number) {
  const shuffled = [...flights].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export default async function Home() {
  const flights = await getAusnzAirspaceFlights()
  const suggested = getRandomFlights(
    flights.filter(f => 
      f.callsign && 
      f.callsign !== 'N/A' && 
      getAirlineInfo(f.callsign) !== null  // ← only known airlines
    ),
    12
  )

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-10 w-full h-full flex flex-col flex-1 min-h-0">
      <SearchBar initialFlights={flights} />
      <SuggestedFlights initialFlights={flights} />
    </main>
  )
}