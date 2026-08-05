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

const CACHE_DURATION = 20000 // 20 seconds

function fallbackFlights(reason: string): Flight[] {
  if (flightCache) {
    console.warn(`OpenSky unavailable (${reason}) — returning stale cache`)
    return flightCache.data
  }
  console.warn(`OpenSky unavailable (${reason}), no cache available — returning empty`)
  return []
}

export async function getAusnzAirspaceFlights(): Promise<Flight[]> {
  // Return cached data if fresh
  if (flightCache && Date.now() - flightCache.timestamp < CACHE_DURATION) {
    console.log('OpenSky cache hit — returning cached data')
    return flightCache.data
  }

  console.log('OpenSky cache miss — fetching fresh data')

  let res: Response
  try {
    res = await fetch(
      'https://opensky-network.org/api/states/all?lamin=-50&lomin=110&lamax=-10&lomax=180',
      {
        cache: 'no-store',
        headers: {
          'User-Agent': 'FlightTrack/1.0 (portfolio project)'
        }
      }
    )
  } catch (err) {
    // Network-level failure (DNS, connection refused, timeout, etc.) —
    // fetch() throws before we ever get a response to check .ok on
    console.error('OpenSky fetch threw:', err)
    return fallbackFlights('network error')
  }

  if (!res.ok) {
    if (res.status === 429) {
      return fallbackFlights('rate limited')
    }
    console.error('OpenSky response status:', res.status)
    return fallbackFlights(`HTTP ${res.status}`)
  }

  let data: any
  try {
    data = await res.json()
  } catch (err) {
    console.error('OpenSky response was not valid JSON:', err)
    return fallbackFlights('invalid JSON')
  }

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
  console.log(`OpenSky fetched ${flights.length} flights, cached for ${CACHE_DURATION / 1000}s`)

  return flights
}

export async function getAusnzRegisteredFlights(): Promise<Flight[]> {
  // All Australian and NZ registered aircraft globally
  try {
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
  } catch (err) {
    console.error('OpenSky registered-flights fetch failed:', err)
    return []
  }
}