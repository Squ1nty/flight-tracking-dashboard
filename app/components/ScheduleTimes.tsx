// app/components/ScheduleTimes.tsx
'use client'

import { useState, useEffect } from 'react'
import { formatLocalTime } from '@/lib/formatTime'

type Props = {
  scheduledDeparture?: string
}

export default function ScheduleTimes({ scheduledDeparture }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="rounded-md px-3 py-5 grid items-center" style={{ background: 'var(--bg-hover)' }}>
      <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>Scheduled departure</p>
      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
        {mounted ? formatLocalTime(scheduledDeparture) : '—'}
      </p>
    </div>
  )
}