// app/components/MapClient.tsx — Client Component, handles dynamic import
'use client'

import dynamic from 'next/dynamic'
import type { Flight } from '@/lib/opensky'

const FlightMap = dynamic(() => import('./FlightMap'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-[calc(100vh-56px)] flex items-center justify-center"
      style={{ background: 'var(--bg-page)' }}
    >
      <p className="text-sm animate-pulse" style={{ color: 'var(--text-muted)' }}>
        Loading map...
      </p>
    </div>
  )
})

type Props = {
  initialFlights: Flight[]
}

export default function MapClient({ initialFlights }: Props) {
  return (
    <div className="w-full h-[calc(100vh-56px)]">
      <FlightMap initialFlights={initialFlights} />
    </div>
  )
}