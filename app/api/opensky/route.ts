// app/api/opensky/route.ts

import { NextResponse } from 'next/server'
import { getAusnzAirspaceFlights } from '@/lib/opensky'

export async function GET() {
  try {
    const flights = await getAusnzAirspaceFlights()
    return NextResponse.json(flights)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch flights' }, { status: 500 })
  }
}