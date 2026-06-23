// lib/formatTime.ts
'use client'

export function formatLocalTime(isoString: string | null | undefined): string {
  if (!isoString) return 'N/A'

  const date = new Date(isoString)
  if (isNaN(date.getTime())) return 'N/A'

  return date.toLocaleString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}