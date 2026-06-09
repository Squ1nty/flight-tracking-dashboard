// app/api/flights/route.ts

import { NextRequest, NextResponse } from 'next/server'

const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 1000 * 60 // 1 minute

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'No search query provided' }, { status: 400 })
  }

  // Return cached result if fresh
  const cached = cache.get(query)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`Cache hit for: ${query}`)
    return NextResponse.json(cached.data)
  }

  try {
    const res = await fetch(
      `http://api.aviationstack.com/v1/flights?access_key=${process.env.AVIATIONSTACK_KEY}&flight_iata=${query}&limit=5`,
    )

    if (!res.ok) throw new Error('AviationStack fetch failed')

    const data = await res.json()

    // Store in cache
    cache.set(query, { data, timestamp: Date.now() })
    console.log(`API call made for: ${query} — cache stored`)

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch flight data' }, { status: 500 })
  }
}