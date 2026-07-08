// lib/useOpenSkyFlight.ts
'use client'

import { useEffect, useState } from 'react'
import type { Flight } from '@/lib/opensky'

export function useOpenSkyFlight(callsign: string, initialFlight: Flight | null) {
  const [liveData, setLiveData] = useState<Flight | null>(initialFlight)

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/opensky')
        if (res.ok) {
          const data: Flight[] = await res.json()
          const match = data.find(f => f.callsign.toUpperCase() === callsign.toUpperCase())
          setLiveData(match ?? null)
        }
      } catch (err) {
        console.error('Live flight refresh failed:', err)
      }
    }, 20000)
    return () => clearInterval(interval)
  }, [callsign])

  return liveData
}