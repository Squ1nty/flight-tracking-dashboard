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
}

export async function getAusnzAirspaceFlights(): Promise<Flight[]> {
  // Bounding box for AUS/NZ airspace
  const res = await fetch(
    'https://opensky-network.org/api/states/all?lamin=-50&lomin=110&lamax=-10&lomax=180',
    { next: { revalidate: 15 } }  // cache for 15 seconds
  )

  if (!res.ok) throw new Error('Failed to fetch airspace data')

  const data = await res.json()

  return (data.states ?? []).map((s: any[]) => ({
    icao24:         s[0],
    callsign:       s[1]?.trim() ?? 'N/A',
    origin_country: s[2],
    longitude:      s[5],
    latitude:       s[6],
    altitude:       s[7],
    velocity:       s[9],
    heading:        s[10],
    on_ground:      s[8],
  }))
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
  })

  return [
    ...(ausData.states ?? []).map(mapFlight),
    ...(nzData.states ?? []).map(mapFlight),
  ]
}