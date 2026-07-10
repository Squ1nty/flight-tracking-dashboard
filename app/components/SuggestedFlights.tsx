// app/components/SuggestedFlights.tsx
'use client'

import { useEffect, useState } from 'react'
import { getAirlineInfo } from '@/lib/airlines'
import type { Flight } from '@/lib/opensky'
import FlightGrid from './FlightGrid'

function getRandomFlights(flights: Flight[], count: number) {
  const shuffled = [...flights].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

type Props = {
  initialFlights: Flight[]
}

export default function SuggestedFlights({ initialFlights }: Props) {
  const [suggested, setSuggested] = useState<Flight[]>([]) // ← start empty

  // Only randomise after mount — never during SSR
  useEffect(() => {
    const known = initialFlights.filter(f =>
      f.callsign &&
      f.callsign !== 'N/A' &&
      getAirlineInfo(f.callsign) !== null
    )
    setSuggested(getRandomFlights(known, 12))
  }, [initialFlights])

  // Refresh every 20 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/opensky')
        if (res.ok) {
          const data: Flight[] = await res.json()
          const known = data.filter(f =>
            f.callsign &&
            f.callsign !== 'N/A' &&
            getAirlineInfo(f.callsign) !== null
          )
          setSuggested(getRandomFlights(known, 12))
        }
      } catch (err) {
        console.error('Suggested flights refresh failed:', err)
      }
    }, 20000)

    return () => clearInterval(interval)
  }, [])

  return <FlightGrid flights={suggested} />
}