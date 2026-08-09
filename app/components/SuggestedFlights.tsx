'use client'

import { useEffect, useState } from 'react'
import { getAirlineInfo } from '@/lib/airlines'
import type { Flight } from '@/lib/opensky'
import FlightGrid from './FlightGrid'

type Status = 'loading' | 'ready' | 'error'

function getRandomFlights(flights: Flight[], count: number) {
  const shuffled = [...flights].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

type Props = {
  initialFlights: Flight[]
}

export default function SuggestedFlights({ initialFlights }: Props) {
  const [suggested, setSuggested] = useState<Flight[]>([])
  const [status, setStatus] = useState<Status>('loading')

  // Only randomise after mount — never during SSR
  useEffect(() => {
    const known = initialFlights.filter(f =>
      f.callsign &&
      f.callsign !== 'N/A' &&
      getAirlineInfo(f.callsign) !== null
    )
    if (known.length > 0) {
      setSuggested(getRandomFlights(known, 12))
      setStatus('ready')
    } else {
      // Empty could mean a genuinely quiet airspace, but far more likely
      // means the upstream fetch failed and lib/opensky.ts's fallback
      // silently returned an empty array — treat as an error either way
      setStatus('error')
    }
  }, [initialFlights])

  // Refresh every 20 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/opensky')
        if (!res.ok) {
          setStatus('error')
          return
        }
        const data: Flight[] = await res.json()
        const known = data.filter(f =>
          f.callsign &&
          f.callsign !== 'N/A' &&
          getAirlineInfo(f.callsign) !== null
        )
        if (known.length > 0) {
          setSuggested(getRandomFlights(known, 12))
          setStatus('ready')
        } else {
          setStatus('error')
        }
      } catch (err) {
        console.error('Suggested flights refresh failed:', err)
        setStatus('error')
      }
    }, 20000)

    return () => clearInterval(interval)
  }, [])

  return <FlightGrid flights={suggested} status={status} />
}