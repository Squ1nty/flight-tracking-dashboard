import type { Flight } from '@/lib/opensky'
import { getGroundStatus } from '@/lib/eta'

export type FlightStatus = 'Airborne' | 'On ground' | 'Departing' | 'Arrived' | 'Taxiing' | 'N/A'

export function resolveStatus(
  liveData: Flight | null,
  departureIata: string | null | undefined,
  arrivalIata: string | null | undefined
): FlightStatus {
  if (!liveData) return 'N/A'
  if (!liveData.on_ground) return 'Airborne'

  const ground = getGroundStatus(
    liveData.latitude,
    liveData.longitude,
    departureIata,
    arrivalIata
  )

  if (ground === 'arrived') {
    return liveData.velocity && liveData.velocity > 1.5 ? 'Taxiing' : 'Arrived'
  }
  if (ground === 'departing') return 'Departing'
  return 'On ground'
}