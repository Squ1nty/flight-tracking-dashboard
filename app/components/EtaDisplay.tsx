// app/components/EtaDisplay.tsx
'use client'

import { calculateEta } from '@/lib/eta'
import { AIRPORT_COORDS } from '@/lib/airports'

type Props = {
  currentLat: number | null
  currentLon: number | null
  speedMs: number | null
  altitudeM: number | null
  onGround: boolean
  arrivalIata: string | null | undefined
  verticalRate: number | null
}

const PHASE_COLORS: Record<string, { bg: string; text: string }> = {
  climbing:    { bg: '#0a1f3d', text: '#388bfd' },
  cruising:    { bg: '#0d2818', text: '#3fb950' },
  on_approach: { bg: '#2d1a0a', text: '#f0883e' },
  descending:  { bg: '#2d1a0a', text: '#f0883e' },
  landing:     { bg: '#2d0f0e', text: '#f85149' },
  on_ground:   { bg: '#1a1a2e', text: '#8b949e' },
  unknown:     { bg: '#1a1a2e', text: '#8b949e' },
}  // ← was missing this closing brace

const PHASE_LABELS: Record<string, string> = {
  climbing:    'Climbing',
  cruising:    'Cruising',
  on_approach: 'On approach',
  descending:  'Descending',
  landing:     'Landing',
  on_ground:   'On ground',
  unknown:     'Unknown',
}

export default function EtaDisplay({
  currentLat,
  currentLon,
  speedMs,
  altitudeM,
  onGround,
  arrivalIata,
  verticalRate,  // ← was missing from destructuring
}: Props) {
  if (!currentLat || !currentLon || !arrivalIata) {
    return (
      <div className="rounded-md px-3 py-5 grid items-center" style={{ background: 'var(--bg-hover)' }}>
        <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>Estimated arrival</p>
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>N/A</p>
      </div>
    )
  }

  const dest = AIRPORT_COORDS[arrivalIata]

  if (!dest) {
    return (
      <div className="rounded-md px-3 py-5 grid items-center" style={{ background: 'var(--bg-hover)' }}>
        <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>Estimated arrival</p>
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>N/A</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {arrivalIata} not in airport database
        </p>
      </div>
    )
  }

  const eta = calculateEta(
    currentLat,
    currentLon,
    dest.lat,
    dest.lon,
    speedMs,
    altitudeM,
    onGround,
    verticalRate
  )

  const colors = PHASE_COLORS[eta.phase] ?? PHASE_COLORS.unknown
  console.log('ETA result:', eta)
  return (
    <div className="rounded-md px-3 py-5 grid items-center" style={{ background: 'var(--bg-hover)' }}>
      {PHASE_LABELS[eta.phase] !== 'Climbing' && (
        <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Estimated arrival</p>
      )}
      <div className="flex items-center gap-2 mb-1">
        {eta.display && eta.display !== 'N/A' && PHASE_LABELS[eta.phase] !== 'Climbing' && (
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            &ensp;{eta.display}
          </p>
        )}
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: colors.bg, color: colors.text }}
        >
          {PHASE_LABELS[eta.phase] ?? 'Unknown'}
        </span>
      </div>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{eta.subtext}</p>
    </div>
  )
}