// app/components/LivePosition.tsx
'use client'

import { useOpenSkyFlight } from '@/lib/useOpenSkyFlight'
import type { Flight } from '@/lib/opensky'

type Props = {
  callsign: string
  initialFlight: Flight | null
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md p-3" style={{ background: 'var(--bg-hover)' }}>
      <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{value}</p>
    </div>
  )
}

export default function LivePosition({ callsign, initialFlight }: Props) {
  const liveData = useOpenSkyFlight(callsign, initialFlight)

  let altM = liveData?.altitude ? Math.round(liveData.altitude) : 0
  if(altM < 0) altM = 0  // Ensure altitude is not negative
  const speedKmh = liveData?.velocity ? Math.round(liveData.velocity * 3.6) : 0
  const heading = liveData?.heading ? Math.round(liveData.heading) : 0
  const status = liveData ? (liveData.on_ground ? 'On ground' : 'Airborne') : 'N/A'

  return (
    <div className="grid grid-cols-2 gap-2">
      <StatBox label="Altitude" value={liveData ? `${altM.toLocaleString()} m` : 'N/A'} />
      <StatBox label="Speed" value={liveData ? `${speedKmh.toLocaleString()} km/h` : 'N/A'} />
      <StatBox label="Heading" value={liveData ? `${heading}°` : 'N/A'} />
      <StatBox label="Status" value={status} />
    </div>
  )
}