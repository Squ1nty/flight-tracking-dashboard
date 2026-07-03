// lib/opensky.ts

export type Flight = {
  icao24: string          // unique aircraft identifier
  callsign: string        // flight number e.g. "QFA001"
  origin_country: string  // e.g. "Australia"
  longitude: number | null
  latitude: number | null
  altitude: number | null // metres
  velocity: number | null // m/s
  heading: number | null  // degrees 0-360
  on_ground: boolean
  verticalRate: number | null
}

let flightCache: {
  data: Flight[]
  timestamp: number
} | null = null

const CACHE_DURATION = 20000 // 15 seconds

export async function getAusnzAirspaceFlights(): Promise<Flight[]> {
  // Return cached data if fresh
  if (flightCache && Date.now() - flightCache.timestamp < CACHE_DURATION) {
    console.log('OpenSky cache hit — returning cached data')
    return flightCache.data
  }

  console.log('OpenSky cache miss — fetching fresh data')

  const res = await fetch(
    'https://opensky-network.org/api/states/all?lamin=-50&lomin=110&lamax=-10&lomax=180',
    {
      cache: 'no-store',
      headers: {
        'User-Agent': 'FlightTrack/1.0 (portfolio project)'
      }
    }
  )

  if (!res.ok) {
    // If rate limited but we have stale cache, return it rather than crashing
    if (res.status === 429 && flightCache) {
      console.warn('OpenSky rate limited — returning stale cache')
      return flightCache.data
    }
    console.error('OpenSky response status:', res.status)
    throw new Error(`Failed to fetch airspace data: ${res.status}`)
  }

  const data = await res.json()

  const flights = (data.states ?? []).map((s: any[]) => ({
    icao24:         s[0],
    callsign:       s[1]?.trim() ?? 'N/A',
    origin_country: s[2],
    longitude:      s[5],
    latitude:       s[6],
    altitude:       s[7],
    on_ground:      s[8],
    velocity:       s[9],
    heading:        s[10],
    verticalRate:   s[11],
  }))

  // Store in cache
  flightCache = { data: flights, timestamp: Date.now() }
  console.log(`OpenSky fetched ${flights.length} flights, cached for 15s`)

  return flights
}

export async function getAusnzRegisteredFlights(): Promise<Flight[]> {
  // All Australian and NZ registered aircraft globally
  const [ausRes, nzRes] = await Promise.all([
    fetch('https://opensky-network.org/api/states/all?origin_country=Australia', { next: { revalidate: 15 } }),
    fetch('https://opensky-network.org/api/states/all?origin_country=New Zealand', { next: { revalidate: 15 } }),
  ])

  const [ausData, nzData] = await Promise.all([
    ausRes.json(),
    nzRes.json(),
  ])

  const mapFlight = (s: any[]): Flight => ({
    icao24:         s[0],
    callsign:       s[1]?.trim() ?? 'N/A',
    origin_country: s[2],
    longitude:      s[5],
    latitude:       s[6],
    altitude:       s[7],
    velocity:       s[9],
    heading:        s[10],
    on_ground:      s[8],
    verticalRate:  s[11],
  })

  return [
    ...(ausData.states ?? []).map(mapFlight),
    ...(nzData.states ?? []).map(mapFlight),
  ]
}