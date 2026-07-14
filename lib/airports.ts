// lib/airports.ts

export type Airport = {
  iata: string
  name: string
  city: string
  lat: number
  lon: number
}

// Bounding box matching your OpenSky fetch
const AUS_NZ_BOUNDS = {
  latMin: -50,
  latMax: -0.5,  // slightly above equator to catch Nauru
  lonMin: 110,
  lonMax: 180,
}

export const AIRPORT_COORDS: Record<string, { lat: number; lon: number; name: string }> = {

  // ── NEW SOUTH WALES ──────────────────────────────────────────
  SYD: { lat: -33.9461, lon: 151.1772, name: 'Sydney Kingsford Smith' },
  NTL: { lat: -32.7950, lon: 151.8342, name: 'Newcastle' },
  CBR: { lat: -35.3069, lon: 149.1950, name: 'Canberra' },         // ACT
  OAG: { lat: -33.3817, lon: 149.1328, name: 'Orange' },
  NTN: { lat: -29.0394, lon: 167.9411, name: 'Norfolk Island' },

  // ── VICTORIA ─────────────────────────────────────────────────
  MEL: { lat: -37.6690, lon: 144.8410, name: 'Melbourne Tullamarine' },
  AVV: { lat: -38.0394, lon: 144.4692, name: 'Avalon' },
  MQL: { lat: -34.2303, lon: 142.0853, name: 'Mildura' },
  ABX: { lat: -36.0675, lon: 146.9578, name: 'Albury' },

  // ── QUEENSLAND ───────────────────────────────────────────────
  BNE: { lat: -27.3842, lon: 153.1175, name: 'Brisbane International' },
  OOL: { lat: -28.1644, lon: 153.5047, name: 'Gold Coast' },
  MCY: { lat: -26.6033, lon: 153.0914, name: 'Sunshine Coast' },
  CNS: { lat: -16.8858, lon: 145.7520, name: 'Cairns International' },
  TSV: { lat: -19.2525, lon: 146.7653, name: 'Townsville' },
  ROK: { lat: -23.3819, lon: 150.4753, name: 'Rockhampton' },
  MKY: { lat: -21.1717, lon: 149.1797, name: 'Mackay' },
  HTI: { lat: -20.3583, lon: 148.9517, name: 'Hamilton Island' },
  ZBR: { lat: -24.8941, lon: 152.3236, name: 'Bundaberg' },
  ISA: { lat: -20.6639, lon: 139.4886, name: 'Mount Isa' },
  LRE: { lat: -23.4344, lon: 144.2803, name: 'Longreach' },

  // ── SOUTH AUSTRALIA ──────────────────────────────────────────
  ADL: { lat: -34.9461, lon: 138.5306, name: 'Adelaide International' },
  MGB: { lat: -37.7456, lon: 140.7747, name: 'Mount Gambier' },
  PUG: { lat: -33.7219, lon: 138.0797, name: 'Port Augusta' },
  COB: { lat: -31.4897, lon: 145.7944, name: 'Coober Pedy' },

  // ── WESTERN AUSTRALIA ─────────────────────────────────────────
  PER: { lat: -31.9385, lon: 115.9672, name: 'Perth International' },
  BME: { lat: -17.9447, lon: 122.2322, name: 'Broome International' },
  KTA: { lat: -20.7122, lon: 116.7736, name: 'Karratha' },
  PHE: { lat: -20.3778, lon: 118.6253, name: 'Port Hedland International' },
  GET: { lat: -28.7961, lon: 114.7078, name: 'Geraldton' },
  KGI: { lat: -30.7894, lon: 121.4617, name: 'Kalgoorlie' },
  ESS: { lat: -33.8489, lon: 121.8919, name: 'Esperance' },
  MJK: { lat: -25.8953, lon: 113.5772, name: 'Monkey Mia Shark Bay' },

  // ── NORTHERN TERRITORY ────────────────────────────────────────
  DRW: { lat: -12.4147, lon: 130.8765, name: 'Darwin International' },
  ASP: { lat: -23.8069, lon: 133.9022, name: 'Alice Springs' },
  KTR: { lat: -14.5228, lon: 132.5272, name: 'Katherine' },
  GOV: { lat: -12.2694, lon: 136.8178, name: 'Gove (Nhulunbuy)' },

  // ── TASMANIA ─────────────────────────────────────────────────
  HBA: { lat: -42.8361, lon: 147.5078, name: 'Hobart International' },
  LST: { lat: -41.5453, lon: 147.2147, name: 'Launceston' },
  DPO: { lat: -41.1797, lon: 145.7228, name: 'Devonport' },
  BWT: { lat: -41.9419, lon: 145.7317, name: 'Burnie Wynyard' },

  // ── NEW ZEALAND ───────────────────────────────────────────────
  AKL: { lat: -37.0082, lon: 174.7850, name: 'Auckland International' },
  CHC: { lat: -43.4894, lon: 172.5320, name: 'Christchurch International' },
  WLG: { lat: -41.3272, lon: 174.8053, name: 'Wellington International' },
  ZQN: { lat: -45.0211, lon: 168.7392, name: 'Queenstown' },
  DUD: { lat: -45.9281, lon: 170.1983, name: 'Dunedin' },
  HLZ: { lat: -37.8667, lon: 175.3322, name: 'Hamilton' },
  NPE: { lat: -39.4658, lon: 176.8700, name: 'Napier Hawke\'s Bay' },
  NSN: { lat: -41.2983, lon: 173.2211, name: 'Nelson' },
  PMR: { lat: -40.3206, lon: 175.6167, name: 'Palmerston North' },
  ROT: { lat: -38.1092, lon: 176.3172, name: 'Rotorua' },
  TUO: { lat: -38.7397, lon: 176.0842, name: 'Taupo' },
  IVC: { lat: -46.4122, lon: 168.3131, name: 'Invercargill' },
  GIS: { lat: -38.6631, lon: 177.9781, name: 'Gisborne' },
  BHE: { lat: -41.5183, lon: 173.8703, name: 'Blenheim' },
  WSZ: { lat: -41.7372, lon: 171.5806, name: 'Westport' },

  // ── PACIFIC ISLANDS ───────────────────────────────────────────
  NAN: { lat: -17.7553, lon: 177.4431, name: 'Nadi International' },
  SUV: { lat: -18.0433, lon: 178.5592, name: 'Suva Nausori' },
  POM: { lat: -9.4433,  lon: 147.2200, name: 'Port Moresby Jacksons' },
  VLI: { lat: -17.6994, lon: 168.3197, name: 'Port Vila Bauerfield' },
  HIR: { lat: -9.4280,  lon: 160.0547, name: 'Honiara International' },
  INU: { lat: -0.5469,  lon: 166.9189, name: 'Nauru International' },
  TBU: { lat: -21.2419, lon: -175.1492, name: 'Tonga Fua\'amotu' },
  APW: { lat: -13.8300, lon: -172.0081, name: 'Apia Faleolo' },
  RAR: { lat: -21.2025, lon: -159.8056, name: 'Rarotonga International' },
  PPT: { lat: -17.5534, lon: -149.6067, name: 'Papeete Faa\'a' },

  // ── INTERNATIONAL (common AUS/NZ routes) ──────────────────────
  SIN: { lat: 1.3644,   lon: 103.9915, name: 'Singapore Changi' },
  HKG: { lat: 22.3080,  lon: 113.9185, name: 'Hong Kong International' },
  NRT: { lat: 35.7720,  lon: 140.3929, name: 'Tokyo Narita' },
  HND: { lat: 35.5494,  lon: 139.7798, name: 'Tokyo Haneda' },
  KIX: { lat: 34.4347,  lon: 135.2440, name: 'Osaka Kansai' },
  ICN: { lat: 37.4602,  lon: 126.4407, name: 'Seoul Incheon' },
  PVG: { lat: 31.1443,  lon: 121.8083, name: 'Shanghai Pudong' },
  PEK: { lat: 40.0799,  lon: 116.6031, name: 'Beijing Capital' },
  PKX: { lat: 39.5098,  lon: 116.4105, name: 'Beijing Daxing' },
  CAN: { lat: 23.3924,  lon: 113.2988, name: 'Guangzhou Baiyun' },
  DXB: { lat: 25.2532,  lon: 55.3657,  name: 'Dubai International' },
  DOH: { lat: 25.2609,  lon: 51.6138,  name: 'Doha Hamad' },
  AUH: { lat: 24.4330,  lon: 54.6511,  name: 'Abu Dhabi' },
  LHR: { lat: 51.4775,  lon: -0.4614,  name: 'London Heathrow' },
  LAX: { lat: 33.9425,  lon: -118.4081, name: 'Los Angeles International' },
  SFO: { lat: 37.6213,  lon: -122.3790, name: 'San Francisco International' },
  YVR: { lat: 49.1947,  lon: -123.1792, name: 'Vancouver International' },
  KUL: { lat: 2.7456,   lon: 101.7099, name: 'Kuala Lumpur International' },
  BKK: { lat: 13.6900,  lon: 100.7501, name: 'Bangkok Suvarnabhumi' },
  DMK: { lat: 13.9126,  lon: 100.6067, name: 'Bangkok Don Mueang' },
  CGK: { lat: -6.1256,  lon: 106.6559, name: 'Jakarta Soekarno-Hatta' },
  DPS: { lat: -8.7482,  lon: 115.1672, name: 'Bali Ngurah Rai' },
  MNL: { lat: 14.5086,  lon: 121.0194, name: 'Manila Ninoy Aquino' },
  HAN: { lat: 21.2212,  lon: 105.8072, name: 'Hanoi Noi Bai' },
  SGN: { lat: 10.8188,  lon: 106.6520, name: 'Ho Chi Minh City' },
  TPE: { lat: 25.0777,  lon: 121.2327, name: 'Taipei Taoyuan' },
  MFM: { lat: 22.1496,  lon: 113.5916, name: 'Macau International' },
  ADD: { lat: 8.9779,   lon: 38.7993,  name: 'Addis Ababa Bole' },
  JNB: { lat: -26.1392, lon: 28.2460,  name: 'Johannesburg O.R. Tambo' },
  DEL: { lat: 28.5665,  lon: 77.1031,  name: 'New Delhi Indira Gandhi' },
  BOM: { lat: 19.0896,  lon: 72.8656,  name: 'Mumbai Chhatrapati Shivaji' },
  HNL: { lat: 21.3245,  lon: -157.9251, name: 'Honolulu International' },
  // WA Mining airports
  ZNE: { lat: -23.4178, lon: 119.8031, name: 'Newman' },
  PPP: { lat: -20.4950, lon: 148.5522, name: 'Paraburdoo' },
  WLP: { lat: -21.4781, lon: 120.1161, name: 'Marble Bar' },
  OCM: { lat: -24.6897, lon: 117.8428, name: 'Pannawonica' },
  MER: { lat: -26.2417, lon: 119.5878, name: 'Meekatharra' },
  WKB: { lat: -24.3311, lon: 120.1181, name: 'Warburton' },
  }

export const AUS_NZ_AIRPORTS: Airport[] = Object.entries(AIRPORT_COORDS)
  .filter(([, data]) =>
    data.lat >= AUS_NZ_BOUNDS.latMin &&
    data.lat <= AUS_NZ_BOUNDS.latMax &&
    data.lon >= AUS_NZ_BOUNDS.lonMin &&
    data.lon <= AUS_NZ_BOUNDS.lonMax
  )
  .map(([iata, data]) => ({
    iata,
    name: data.name,
    city: data.name.split(' ')[0],
    lat: data.lat,
    lon: data.lon,
  }))

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