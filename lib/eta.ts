// lib/eta.ts

import { AIRPORT_COORDS } from "./airports"

export type FlightPhase = 
  | 'climbing'
  | 'cruising'
  | 'descending'
  | 'on_approach'
  | 'landing'
  | 'taxiing'
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

// How close to an airport counts as "at" it (in km)
const AIRPORT_PROXIMITY_KM = 5

export function isNearAirport(
  lat: number,
  lon: number,
  airportIata: string
): boolean {
  const airport = AIRPORT_COORDS[airportIata]
  if (!airport) return false
  const dist = haversineKm(lat, lon, airport.lat, airport.lon)
  return dist < AIRPORT_PROXIMITY_KM
}

export type GroundStatus = 'departing' | 'arrived' | 'on_ground'

export function getGroundStatus(
  lat: number | null,
  lon: number | null,
  departureIata: string | null | undefined,
  arrivalIata: string | null | undefined
): GroundStatus {
  if (!lat || !lon) return 'on_ground'

  if (arrivalIata && isNearAirport(lat, lon, arrivalIata)) return 'arrived'
  if (departureIata && isNearAirport(lat, lon, departureIata)) return 'departing'
  return 'on_ground'
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

export function getFlightPhase(
  altitudeM: number | null,
  onGround: boolean,
  speedMs?: number | null,
  distanceToDestKm?: number | null,
  verticalRate?: number | null
): FlightPhase {
  if (onGround) {
    // Taxiing speed is typically 15-30 km/h (4-8 m/s)
    // Stationary or very slow = parked, moving = taxiing
    if (speedMs != null && speedMs > 1.5) return 'taxiing'
    return 'on_ground'
  }

  // Check vertical rate FIRST — positive rate always means climbing
  if (verticalRate != null && verticalRate > 1.0) return 'climbing'

  if (altitudeM === null) {
    if (speedMs != null && speedMs < 50) return 'landing'
    if (distanceToDestKm != null && distanceToDestKm < 10) return 'landing'
    return 'unknown'
  }

  // Only check altitude thresholds if NOT climbing
  if (altitudeM <= 457) return 'landing'

  if (verticalRate != null && verticalRate < -1.0) {
    if (altitudeM <= 3048 && distanceToDestKm != null && distanceToDestKm < 50) {
      return 'on_approach'
    }
    return 'descending'
  }

  if (altitudeM <= 3048) {
    if (distanceToDestKm != null && distanceToDestKm < 50) return 'on_approach'
    return 'descending'
  }

  return 'cruising'
}

export function calculateEta(
  currentLat: number,
  currentLon: number,
  destLat: number,
  destLon: number,
  speedMs: number | null,
  altitudeM: number | null,
  onGround: boolean,
  verticalRate: number | null  // ← add this
): EtaResult {
  const distanceKm = haversineKm(currentLat, currentLon, destLat, destLon)
  const phase = getFlightPhase(altitudeM, onGround, speedMs, distanceKm, verticalRate)

  if (phase === 'on_ground') {
    return {
      phase,
      etaMinutes: null,
      display: 'Arrived',
      subtext: 'Not currently airborne'
    }
  }

  if (phase === 'taxiing') {
    return {
      phase,
      etaMinutes: null,
      display: 'Taxiing',
      subtext: 'Aircraft taxiing on ground'
    }
  }

  if (phase === 'climbing') {
    return {
      phase,
      etaMinutes: null,
      display: 'Climbing',
      subtext: 'Recently departed — ETA not yet available'
    }
  }

  if (phase === 'landing') {
    return {
      phase,
      etaMinutes: 0,
      display: 'Arriving',
      subtext: 'At or near destination'
    }
  }

  if (phase === 'on_approach') {
    const speedKmh = speedMs ? speedMs * 3.6 : null
    const minutes = speedKmh && speedKmh > 0
      ? Math.round((distanceKm / speedKmh) * 60)
      : null

    return {
      phase,
      etaMinutes: minutes,
      display: minutes !== null ? `~${minutes} min` : 'On approach',
      subtext: 'On final approach'
    }
  }

  if (phase === 'descending') {
    return {
      phase,
      etaMinutes: null,
      display: 'Descending',
      subtext: 'Climbing or descending — ETA unavailable'
    }
  }

  if (phase === 'unknown') {
    return {
      phase,
      etaMinutes: null,
      display: 'N/A',
      subtext: 'Insufficient data'
    }
  }

  // Cruising
  if (!speedMs || speedMs <= 0) {
    return {
      phase,
      etaMinutes: null,
      display: 'N/A',
      subtext: 'Speed data unavailable'
    }
  }

  const speedKmh = speedMs * 3.6
  const minutes = Math.round((distanceKm / speedKmh) * 60)
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  const formatted = hours > 0 ? `${hours}hr ${mins}min` : `${mins}min`

  return {
    phase: 'cruising',
    etaMinutes: minutes,
    display: formatted,
    subtext: `~${Math.round(distanceKm)} km remaining`
  }
}