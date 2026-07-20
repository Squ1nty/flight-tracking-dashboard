// app/components/FlightMap.tsx
'use client'

import { saveMapState, getMapState, type MapState } from '@/lib/useLastPage'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '../contextFiles/ThemeContext'
import type { Flight } from '@/lib/opensky'
import { getAirlineInfo } from '@/lib/airlines'
import { AUS_NZ_AIRPORTS, getNearestAirport, type Airport } from '@/lib/airports'
import AirportPanel from './AirportPanel'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

type Props = {
  initialFlights: Flight[]
}

type AirportSelection = {
  airport: Airport
  flights: Flight[]
}

function groupGroundedByAirport(flights: Flight[]): Map<string, { airport: Airport; flights: Flight[] }> {
  const map = new Map<string, { airport: Airport; flights: Flight[] }>()
  for (const flight of flights) {
    if (!flight.on_ground || !flight.latitude || !flight.longitude) continue
    const airport = getNearestAirport(flight.latitude, flight.longitude)
    if (!airport) continue
    if (!map.has(airport.iata)) map.set(airport.iata, { airport, flights: [] })
    map.get(airport.iata)!.flights.push(flight)
  }
  return map
}

function createPlaneIcon(color: string, heading: number, isFifo: boolean = false) {
  const correctedHeading = heading - 90
  const size = isFifo ? 32 : 28
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}"
      style="transform:rotate(${correctedHeading}deg);transform-origin:center;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4))">
      <path d="M407.72,224c-3.4,0-14.79.1-18,.3l-64.9,1.7a1.83,1.83,0,0,1-1.69-.9L193.55,67.56A9,9,0,0,0,186.89,64H160l73,161a2.35,2.35,0,0,1-2.26,3.35l-121.69,1.8a8.06,8.06,0,0,1-6.6-3.1l-37-45c-3-3.9-8.62-6-13.51-6H33.08c-1.29,0-1.1,1.21-.75,2.43L52.17,249.9a16.3,16.3,0,0,1,0,11.9L32.31,333c-.59,1.95-.52,3,1.77,3H52c8.14,0,9.25-1.06,13.41-6.3l37.7-45.7a8.19,8.19,0,0,1,6.6-3.1l120.68,2.7a2.7,2.7,0,0,1,2.43,3.74L160,448h26.64a9,9,0,0,0,6.65-3.55L323.14,287c.39-.6,2-.9,2.69-.9l63.9,1.7c3.3.2,14.59.3,18,.3C452,288.1,480,275.93,480,256S452.12,224,407.72,224Z"
        fill="${color}" stroke="white" stroke-width="12"/>
    </svg>
  `
  return L.divIcon({ html: svg, className: '', iconSize: [size, size], iconAnchor: [size / 2, size / 2] })
}

function createAirportIcon(count: number) {
  const html = `
    <div style="
      background:#2e8c5e;border:2px solid white;border-radius:50%;
      width:32px;height:32px;display:flex;align-items:center;
      justify-content:center;font-size:11px;font-weight:600;
      color:white;box-shadow:0 2px 6px rgba(0,0,0,0.4);font-family:sans-serif;
      cursor:pointer;
    ">${count}</div>
  `
  return L.divIcon({ html, className: '', iconSize: [32, 32], iconAnchor: [16, 16] })
}

export default function FlightMap({ initialFlights }: Props) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<L.Layer[]>([])
  const [flights, setFlights] = useState<Flight[]>(initialFlights)
  const [selectedAirport, setSelectedAirport] = useState<AirportSelection | null>(null)
  const router = useRouter()
  const { theme } = useTheme()
  const dark = theme === 'dark'

  const tileUrl = dark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
  const tileAttribution = '&copy; <a href="https://carto.com/">CARTO</a>'

  // Initialise map
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return

    // Check for saved state
    const saved = getMapState()

    mapRef.current = L.map(mapContainerRef.current, {
      center: saved?.center ?? [-25, 135],
      zoom: saved?.zoom ?? 5,
      zoomControl: true,
    })

    L.tileLayer(tileUrl, { attribution: tileAttribution }).addTo(mapRef.current)

    // Restore open airport panel if there was one
    if (saved?.openAirportIata) {
      const airport = AUS_NZ_AIRPORTS.find(a => a.iata === saved.openAirportIata)
      if (airport) {
        // flights haven't loaded into markers yet, so derive grounded from initialFlights
        const grounded = groupGroundedByAirport(initialFlights)
        const entry = grounded.get(saved.openAirportIata)
        if (entry) {
          setSelectedAirport({ airport, flights: entry.flights })
        }
      }
    }

    return () => { mapRef.current?.remove(); mapRef.current = null }
  }, [])

  const saveCurrentMapState = (openAirportIata: string | null = null) => {
    if (!mapRef.current) return
    const center = mapRef.current.getCenter()
    saveMapState({
      center: [center.lat, center.lng],
      zoom: mapRef.current.getZoom(),
      openAirportIata,
    })
  }

  // Swap tiles on theme change
  useEffect(() => {
    if (!mapRef.current) return
    mapRef.current.eachLayer(layer => {
      if (layer instanceof L.TileLayer) mapRef.current!.removeLayer(layer)
    })
    L.tileLayer(tileUrl, { attribution: tileAttribution }).addTo(mapRef.current)
  }, [dark])

  // Draw markers
  useEffect(() => {
    console.log('Markers useEffect ran, mapRef:', !!mapRef.current, 'flights:', flights.length)
    if (!mapRef.current) return

    try {
      markersRef.current.forEach(m => {
        try {
          mapRef.current!.removeLayer(m)
        } catch (e) {
          // Marker already removed, ignore
        }
      })
      markersRef.current = []
    } catch (e) {
      console.warn('Error clearing markers:', e)
      return
    }
    console.log('Clearing', markersRef.current.length, 'old markers')
    markersRef.current.forEach(m => mapRef.current!.removeLayer(m))
    markersRef.current = []

    const airborne = flights.filter(f => !f.on_ground && f.latitude && f.longitude)
    console.log('Airborne flights to plot:', airborne.length)
    const groundedGroups = groupGroundedByAirport(flights)

    // Airborne markers
    for (const flight of airborne) {
      const airline = getAirlineInfo(flight.callsign)
      const color = airline?.color ?? '#b8b8b8'
      let altM = flight.altitude ? Math.round(flight.altitude) : 0
      if(altM < 0) altM = 0  // Ensure altitude is not negative
      const speedKmh = flight.velocity ? Math.round(flight.velocity * 3.6) : 0
      const isFifo = airline?.isFifo ?? false
      const icon = createPlaneIcon(color, flight.heading ?? 0 - 90, isFifo)

      const marker = L.marker([flight.latitude!, flight.longitude!], { icon })

      marker.bindTooltip(`
        <div style="font-family:sans-serif;font-size:12px;line-height:1.6;min-width:140px">
          <strong style="font-size:13px">${flight.callsign}</strong><br/>
          ${airline?.name ?? 'Unknown Airline'} · ${flight.origin_country}<br/>
          <span style="color:#8b949e">Alt</span> ${altM.toLocaleString()} m &nbsp;
          <span style="color:#8b949e">Speed</span> ${speedKmh.toLocaleString()} km/h
        </div>
      `, { direction: 'top', offset: [0, -14] })

      marker.on('click', () => {
        saveCurrentMapState(null)
        router.push(`/flight/${flight.callsign}`)
      })
      marker.addTo(mapRef.current!)
      markersRef.current.push(marker)
    }

    // Airport markers
    // Show ALL airports from fixed list
    for (const airport of AUS_NZ_AIRPORTS) {
      const entry = groundedGroups.get(airport.iata)
      const count = entry?.flights.length ?? 0
      const icon = createAirportIcon(count)

      const marker = L.marker([airport.lat, airport.lon], { icon })

      marker.bindTooltip(`
        <div style="font-family:sans-serif;font-size:12px;line-height:1.6">
          <strong>${airport.iata} · ${airport.name}</strong><br/>
          <span style="color:#8b949e">
            ${count > 0 ? `${count} aircraft on ground` : 'No tracked aircraft'}
          </span>
          ${count > 0 ? '<br/><span style="color:#5bbd8a;font-size:11px">Click to view all</span>' : ''}
        </div>
      `, { direction: 'top', offset: [0, -16] })

      if (count > 0) {
        marker.on('click', () => {
          saveCurrentMapState(airport.iata)
          setSelectedAirport({ airport, flights: entry!.flights })
        })
      }

      marker.addTo(mapRef.current!)
      markersRef.current.push(marker)
    }
  }, [flights])

  // Auto-refresh
  useEffect(() => {
  // Run once immediately on mount to get latest data
  const fetchFlights = async () => {
    try {
      const res = await fetch('/api/opensky')
      if (res.ok) {
        const data = await res.json()
        setFlights(data)
      }
    } catch (err) {
      console.error('Auto-refresh failed:', err)
    }
  }

  fetchFlights() // ← immediate fetch on mount

  const interval = setInterval(fetchFlights, 20000)
  return () => clearInterval(interval)
}, [])

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapContainerRef}
        className="w-full h-full"
        aria-label="Live flight map showing AUS/NZ airspace"
        role="application"
      />

      {/* Airport side panel */}
      {selectedAirport && (
        <AirportPanel
          airport={selectedAirport.airport}
          flights={selectedAirport.flights}
          onClose={() => {
            saveCurrentMapState(null)  // panel closing, clear airport from state
            setSelectedAirport(null)
          }}
          onFlightClick={() => saveCurrentMapState(selectedAirport.airport.iata)}
        />
      )}
    </div>
  )
}