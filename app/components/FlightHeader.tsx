// app/components/FlightHeader.tsx

import AirlineIcon from './AirlineIcon'
import FlightStatusPill from './FlightStatusPill'
import { getAirlineInfo } from '@/lib/airlines'

type Props = {
  callsign: string
  originCountry: string
  status: 'Airborne' | 'On ground' | 'Departing' | 'Arrived' | 'N/A'
}

export default function FlightHeader({ callsign, originCountry, status }: Props) {
  const airline = getAirlineInfo(callsign)

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <AirlineIcon callsign={callsign} />
        <div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            {callsign}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {airline?.name ?? 'Unknown Airline'} · {originCountry}
          </p>
        </div>
      </div>
      <FlightStatusPill status={status} />
    </div>
  )
}