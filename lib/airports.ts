// lib/airports.ts

export type Airport = {
  iata: string
  name: string
  city: string
  lat: number
  lon: number
}

export const AUS_NZ_AIRPORTS: Airport[] = [
  // Australia — Major
  { iata: 'SYD', name: 'Sydney Kingsford Smith',   city: 'Sydney',      lat: -33.9461, lon: 151.1772 },
  { iata: 'MEL', name: 'Melbourne Tullamarine',     city: 'Melbourne',   lat: -37.6690, lon: 144.8410 },
  { iata: 'BNE', name: 'Brisbane International',    city: 'Brisbane',    lat: -27.3842, lon: 153.1175 },
  { iata: 'PER', name: 'Perth International',       city: 'Perth',       lat: -31.9385, lon: 115.9672 },
  { iata: 'ADL', name: 'Adelaide International',    city: 'Adelaide',    lat: -34.9461, lon: 138.5306 },
  { iata: 'OOL', name: 'Gold Coast Airport',        city: 'Gold Coast',  lat: -28.1644, lon: 153.5047 },
  { iata: 'CNS', name: 'Cairns International',      city: 'Cairns',      lat: -16.8858, lon: 145.7520 },
  { iata: 'CBR', name: 'Canberra Airport',          city: 'Canberra',    lat: -35.3069, lon: 149.1950 },
  { iata: 'HBA', name: 'Hobart International',      city: 'Hobart',      lat: -42.8361, lon: 147.5078 },
  { iata: 'DRW', name: 'Darwin International',      city: 'Darwin',      lat: -12.4147, lon: 130.8765 },
  { iata: 'TSV', name: 'Townsville Airport',        city: 'Townsville',  lat: -19.2525, lon: 146.7653 },
  { iata: 'MKY', name: 'Mackay Airport',            city: 'Mackay',      lat: -21.1717, lon: 149.1797 },
  { iata: 'ROK', name: 'Rockhampton Airport',       city: 'Rockhampton', lat: -23.3819, lon: 150.4753 },
  { iata: 'LST', name: 'Launceston Airport',        city: 'Launceston',  lat: -41.5453, lon: 147.2147 },
  { iata: 'AVV', name: 'Avalon Airport',            city: 'Geelong',     lat: -38.0394, lon: 144.4692 },
  { iata: 'BME', name: 'Broome International',      city: 'Broome',      lat: -17.9447, lon: 122.2322 },
  { iata: 'KTA', name: 'Karratha Airport',          city: 'Karratha',    lat: -20.7122, lon: 116.7736 },
  { iata: 'PHE', name: 'Port Hedland International',city: 'Port Hedland',lat: -20.3778, lon: 118.6253 },
  { iata: 'NTL', name: 'Newcastle Airport',         city: 'Newcastle',   lat: -32.7950, lon: 151.8342 },
  { iata: 'MCY', name: 'Sunshine Coast Airport',    city: 'Sunshine Coast', lat: -26.6033, lon: 153.0914 },

  // New Zealand — Major
  { iata: 'AKL', name: 'Auckland Airport',          city: 'Auckland',      lat: -37.0082, lon: 174.7850 },
  { iata: 'CHC', name: 'Christchurch Airport',      city: 'Christchurch',  lat: -43.4894, lon: 172.5320 },
  { iata: 'WLG', name: 'Wellington Airport',        city: 'Wellington',    lat: -41.3272, lon: 174.8053 },
  { iata: 'ZQN', name: 'Queenstown Airport',        city: 'Queenstown',    lat: -45.0211, lon: 168.7392 },
  { iata: 'DUD', name: 'Dunedin Airport',           city: 'Dunedin',       lat: -45.9281, lon: 170.1983 },
  { iata: 'HLZ', name: 'Hamilton Airport',          city: 'Hamilton',      lat: -37.8667, lon: 175.3322 },
  { iata: 'NPE', name: 'Napier Airport',            city: 'Napier',        lat: -39.4658, lon: 176.8700 },
  { iata: 'NSN', name: 'Nelson Airport',            city: 'Nelson',        lat: -41.2983, lon: 173.2211 },
  { iata: 'PMR', name: 'Palmerston North Airport',  city: 'Palmerston North', lat: -40.3206, lon: 175.6167 },
  { iata: 'ROT', name: 'Rotorua Airport',           city: 'Rotorua',       lat: -38.1092, lon: 176.3172 },

  // Pacific Islands (within bounding box)
  { iata: 'NAN', name: 'Nadi International',        city: 'Nadi',          lat: -17.7553, lon: 177.4431 },
  { iata: 'SUV', name: 'Nausori Airport',           city: 'Suva',          lat: -18.0433, lon: 178.5592 },
  { iata: 'PPT', name: 'Faa\'a International',      city: 'Papeete',       lat: -17.5534, lon: -149.6067 },
  { iata: 'POM', name: 'Port Moresby Airport',      city: 'Port Moresby',  lat: -9.4433,  lon: 147.2200 },
  { iata: 'INU', name: 'Nauru International',       city: 'Nauru',         lat: -0.5469,  lon: 166.9189 },
  { iata: 'VLI', name: 'Bauerfield International',  city: 'Port Vila',     lat: -17.6994, lon: 168.3197 },
  { iata: 'HIR', name: 'Honiara International',     city: 'Honiara',       lat: -9.4280,  lon: 160.0547 },
]

// Assign grounded flights to their nearest airport
export function getNearestAirport(lat: number, lon: number): Airport | null {
  if (lat == null || lon == null) return null

  let nearest: Airport | null = null
  let minDistance = Infinity

  for (const airport of AUS_NZ_AIRPORTS) {
    const dLat = airport.lat - lat
    const dLon = airport.lon - lon
    const dist = Math.sqrt(dLat * dLat + dLon * dLon) // rough distance, no need for haversine here
    if (dist < minDistance) {
      minDistance = dist
      nearest = airport
    }
  }

  // Only assign if within ~1 degree (~100km) — avoids mismatching remote ground vehicles
  return minDistance < 1 ? nearest : null
}