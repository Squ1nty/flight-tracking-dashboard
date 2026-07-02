// lib/useLastPage.ts
'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const LAST_PAGE_KEY = 'flighttrack_last_page'
const MAP_STATE_KEY = 'flighttrack_map_state'

export function useRecordLastPage() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname.startsWith('/flight/')) {
      localStorage.setItem(LAST_PAGE_KEY, pathname)
    }
  }, [pathname])
}

export function getLastPage(): string {
  if (typeof window === 'undefined') return '/'
  return localStorage.getItem(LAST_PAGE_KEY) ?? '/'
}

export type MapState = {
  center: [number, number]
  zoom: number
  openAirportIata: string | null
}

export function saveMapState(state: MapState) {
  localStorage.setItem(MAP_STATE_KEY, JSON.stringify(state))
}

export function getMapState(): MapState | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(MAP_STATE_KEY)
  return stored ? JSON.parse(stored) : null
}

export function clearMapState() {
  localStorage.removeItem(MAP_STATE_KEY)
}