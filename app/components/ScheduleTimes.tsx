// app/components/ScheduleTimes.tsx
'use client'

import { useState, useEffect } from 'react'
import { formatLocalTime } from '@/lib/formatTime'

type Props = {
  scheduledDeparture?: string
  estimatedArrival?: string
}

export default function ScheduleTimes({ scheduledDeparture, estimatedArrival }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="rounded-md p-3" style={{ background: 'var(--bg-hover)' }}>
        <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>Scheduled departure</p>
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {mounted ? formatLocalTime(scheduledDeparture) : '—'}
        </p>
      </div>
      <div className="rounded-md p-3" style={{ background: 'var(--bg-hover)' }}>
        <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>Estimated arrival</p>
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {mounted ? formatLocalTime(estimatedArrival) : '—'}
        </p>
      </div>
    </div>
  )
}