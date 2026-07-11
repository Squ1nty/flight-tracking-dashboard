// app/components/ScheduleSection.tsx
'use client'

import { useOpenSkyFlight } from '@/lib/useOpenSkyFlight'
import type { Flight } from '@/lib/opensky'
import ScheduleTimes from './ScheduleTimes'
import EtaDisplay from './EtaDisplay'

type Props = {
  initialFlight: Flight | null
  callsign: string
  scheduledDeparture?: string
  arrivalIata?: string | null
}

export default function ScheduleSection({
  initialFlight,
  callsign,
  scheduledDeparture,
  arrivalIata,
}: Props) {
  const liveData = useOpenSkyFlight(callsign, initialFlight)

  return (
    <div className="grid grid-cols-2 gap-2">
      <ScheduleTimes scheduledDeparture={scheduledDeparture} />
      <EtaDisplay
        currentLat={liveData?.latitude ?? null}
        currentLon={liveData?.longitude ?? null}
        speedMs={liveData?.velocity ?? null}
        altitudeM={liveData?.altitude ?? null}
        onGround={liveData?.on_ground ?? false}
        arrivalIata={arrivalIata}
        verticalRate={liveData?.verticalRate ?? null}
      />
    </div>
  )
}