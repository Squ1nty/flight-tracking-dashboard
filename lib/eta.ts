// lib/eta.ts

export type FlightPhase = 
  | 'cruising'
  | 'descending'
  | 'on_approach'
  | 'landing'
  | 'on_ground'
  | 'unknown'

export type EtaResult = {
  phase: FlightPhase
  etaMinutes: number | null
  display: string
  subtext: string
}

function toRad(deg: number) {
  return (deg * Math.PI) / 180
}

export function haversineKm(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function getFlightPhase(altitudeM: number | null, onGround: boolean): FlightPhase {
  if (onGround) return 'on_ground'
  if (altitudeM === null) return 'unknown'
  if (altitudeM <= 152)  return 'landing'      // < 500ft — on runway
  if (altitudeM <= 457)  return 'landing'      // < 1,500ft — landing imminent
  if (altitudeM <= 3048) return 'descending'   // < 10,000ft — descent/approach phase
  return 'cruising'
}

export function calculateEta(
  currentLat: number,
  currentLon: number,
  destLat: number,
  destLon: number,
  speedMs: number | null,
  altitudeM: number | null,
  onGround: boolean
): EtaResult {
  const phase = getFlightPhase(altitudeM, onGround)
  const distanceKm = haversineKm(currentLat, currentLon, destLat, destLon)

  if (phase === 'on_ground') {
    return {
      phase,
      etaMinutes: null,
      display: 'On ground',
      subtext: 'Not currently airborne'
    }
  }

  if (phase === 'landing') {
    return {
      phase,
      etaMinutes: 0,
      display: 'Landing',
      subtext: 'Now on approach to runway'
    }
  }

  // On approach — under 3,048m AND within 50km of destination
  if (phase === 'descending' && distanceKm < 50) {
    const speedKmh = speedMs ? speedMs * 3.6 : null
    const minutes = speedKmh && speedKmh > 0
      ? Math.round((distanceKm / speedKmh) * 60)
      : null

    return {
      phase: 'on_approach',
      etaMinutes: minutes,
      display: minutes !== null ? `~${minutes} min` : 'On approach',
      subtext: 'On final approach'
    }
  }

  // Descending but far from destination — could be holding or early descent
  if (phase === 'descending' && distanceKm >= 50) {
    return {
      phase: 'descending',
      etaMinutes: null,
      display: 'Descending',
      subtext: 'ETA unavailable during descent'
    }
  }

  // Cruising — most reliable ETA
  if (!speedMs || speedMs <= 0) {
    return {
      phase,
      etaMinutes: null,
      display: 'N/A',
      subtext: 'Speed data unavailable'
    }
  }

  const speedKmh = speedMs * 3.6
  const hoursLeft = distanceKm / speedKmh
  const minutes = Math.round(hoursLeft * 60)

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  const formatted = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`

  return {
    phase: 'cruising',
    etaMinutes: minutes,
    display: formatted,
    subtext: `~${Math.round(distanceKm)} km remaining`
  }
}