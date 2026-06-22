// lib/airlines.ts

export type AirlineInfo = {
  name: string
  domain: string
  color: string
  iata: string  // ← add this
}

export const AIRLINE_MAP: Record<string, AirlineInfo> = {
  QFA: { name: 'Qantas',           domain: 'qantas.com',          color: '#e00000', iata: 'QF' },
  JST: { name: 'Jetstar',          domain: 'jetstar.com',         color: '#ff5f00', iata: 'JQ' },
  VOZ: { name: 'Virgin Australia', domain: 'virginaustralia.com', color: '#d10072', iata: 'VA' },
  ANZ: { name: 'Air New Zealand',  domain: 'airnewzealand.com',   color: '#00b1d2', iata: 'NZ' },
  SIA: { name: 'Singapore Air',    domain: 'singaporeair.com',    color: '#0033a0', iata: 'SQ' },
  UAE: { name: 'Emirates',         domain: 'emirates.com',        color: '#c8102e', iata: 'EK' },
  ETD: { name: 'Etihad',           domain: 'etihad.com',          color: '#c8a96e', iata: 'EY' },
  QTR: { name: 'Qatar Airways',    domain: 'qatarairways.com',    color: '#5c0632', iata: 'QR' },
  CPA: { name: 'Cathay Pacific',   domain: 'cathaypacific.com',   color: '#006564', iata: 'CX' },
  MAS: { name: 'Malaysia Airlines',domain: 'malaysiaairlines.com',color: '#003087', iata: 'MH' },
  GIA: { name: 'Garuda Indonesia', domain: 'garuda-indonesia.com',color: '#00843d', iata: 'GA' },
  FJI: { name: 'Fiji Airways',     domain: 'fijiairways.com',     color: '#005eb8', iata: 'FJ' },
  BAW: { name: 'British Airways',  domain: 'britishairways.com',  color: '#2b5ea7', iata: 'BA' },
  DLH: { name: 'Lufthansa',        domain: 'lufthansa.com',       color: '#05164d', iata: 'LH' },
  AFR: { name: 'Air France',       domain: 'airfrance.com',       color: '#002157', iata: 'AF' },
  KLM: { name: 'KLM',              domain: 'klm.com',             color: '#009ce0', iata: 'KL' },
  JAL: { name: 'Japan Airlines',   domain: 'jal.com',             color: '#e00000', iata: 'JL' },
  ANA: { name: 'ANA',              domain: 'ana.co.jp',           color: '#003087', iata: 'NH' },
  KAL: { name: 'Korean Air',       domain: 'koreanair.com',       color: '#00256c', iata: 'KE' },
  AAR: { name: 'Asiana Airlines',  domain: 'flyasiana.com',       color: '#e00000', iata: 'OZ' },
  CCA: { name: 'Air China',        domain: 'airchina.com',        color: '#d4232c', iata: 'CA' },
  CSN: { name: 'China Southern',   domain: 'csair.com',           color: '#0062b2', iata: 'CZ' },
  CES: { name: 'China Eastern',    domain: 'ceair.com',           color: '#e50012', iata: 'MU' },
  THA: { name: 'Thai Airways',     domain: 'thaiairways.com',     color: '#6b2d8b', iata: 'TG' },
  PAL: { name: 'Philippine Air',   domain: 'philippineairlines.com', color: '#0038a8', iata: 'PR' },
  HVN: { name: 'Vietnam Airlines', domain: 'vietnamairlines.com', color: '#004b87', iata: 'VN' },
  EVA: { name: 'EVA Air',          domain: 'evaair.com',          color: '#007b40', iata: 'BR' },
  CAL: { name: 'China Airlines',   domain: 'china-airlines.com',  color: '#cc0000', iata: 'CI' },
  AAL: { name: 'American Airlines',domain: 'aa.com',              color: '#0078d2', iata: 'AA' },
  UAL: { name: 'United Airlines',  domain: 'united.com',          color: '#005daa', iata: 'UA' },
  DAL: { name: 'Delta Air Lines',  domain: 'delta.com',           color: '#003366', iata: 'DL' },
  ACA: { name: 'Air Canada',       domain: 'aircanada.com',       color: '#cc0000', iata: 'AC' },
  HAL: { name: 'Hawaiian Airlines',domain: 'hawaiianairlines.com',color: '#6b2d8b', iata: 'HA' },
  AIC: { name: 'Air India',        domain: 'airindia.com',        color: '#e84c0e', iata: 'AI' },
  ETH: { name: 'Ethiopian Air',    domain: 'ethiopianairlines.com',color: '#007a3d', iata: 'ET' },
  NYG: { name: 'Air Niugini',      domain: 'airniugini.com.pg',   color: '#ce1126', iata: 'PX' },
  PCF: { name: 'Air Tahiti Nui',   domain: 'airtahitinui.com',    color: '#003087', iata: 'TN' },
  SCO: { name: 'Scoot',            domain: 'flyscoot.com',        color: '#ffcd00', iata: 'TR' },
  AXB: { name: 'AirAsia X',        domain: 'airasiax.com',        color: '#ff0000', iata: 'D7' },
  AWQ: { name: 'Batik Air',        domain: 'batikair.com',        color: '#8b0000', iata: 'ID' },
  QLK: { name: 'QantasLink',       domain: 'qantas.com',          color: '#e00000', iata: 'QF' },
}

export function getAirlineInfo(callsign: string): AirlineInfo | null {
  if (!callsign || callsign === 'N/A') return null
  const icao = callsign.slice(0, 3).toUpperCase()
  const iata = callsign.slice(0, 2).toUpperCase()
  return AIRLINE_MAP[icao] ?? AIRLINE_MAP[iata] ?? null
}

// New: converts a full ICAO callsign (e.g. "QFA557") to IATA format (e.g. "QF557")
export function toIataCallsign(callsign: string): string | null {
  const icaoPrefix = callsign.slice(0, 3).toUpperCase()
  const airline = AIRLINE_MAP[icaoPrefix]
  if (!airline) return null

  const flightNumber = callsign.slice(3)
  return `${airline.iata}${flightNumber}`
}