// lib/airlines.ts

export type AirlineInfo = {
  name: string
  domain: string
  color: string
}

export const AIRLINE_MAP: Record<string, AirlineInfo> = {
  // ICAO 3-letter prefixes
  QFA: { name: 'Qantas',           domain: 'qantas.com',          color: '#e00000' },
  JST: { name: 'Jetstar',          domain: 'jetstar.com',         color: '#ff5f00' },
  VOZ: { name: 'Virgin Australia', domain: 'virginaustralia.com', color: '#d10072' },
  ANZ: { name: 'Air New Zealand',  domain: 'airnewzealand.com',   color: '#00b1d2' },
  SIA: { name: 'Singapore Air',    domain: 'singaporeair.com',    color: '#0033a0' },
  UAE: { name: 'Emirates',         domain: 'emirates.com',        color: '#c8102e' },
  ETD: { name: 'Etihad',           domain: 'etihad.com',          color: '#c8a96e' },
  QTR: { name: 'Qatar Airways',    domain: 'qatarairways.com',    color: '#5c0632' },
  CPA: { name: 'Cathay Pacific',   domain: 'cathaypacific.com',   color: '#006564' },
  MAS: { name: 'Malaysia Airlines',domain: 'malaysiaairlines.com',color: '#003087' },
  GIA: { name: 'Garuda Indonesia', domain: 'garuda-indonesia.com',color: '#00843d' },
  FJI: { name: 'Fiji Airways',     domain: 'fijiairways.com',     color: '#005eb8' },
  BAW: { name: 'British Airways',  domain: 'britishairways.com',  color: '#2b5ea7' },
  DLH: { name: 'Lufthansa',        domain: 'lufthansa.com',       color: '#05164d' },
  AFR: { name: 'Air France',       domain: 'airfrance.com',       color: '#002157' },
  KLM: { name: 'KLM',              domain: 'klm.com',             color: '#009ce0' },
  JAL: { name: 'Japan Airlines',   domain: 'jal.com',             color: '#e00000' },
  ANA: { name: 'ANA',              domain: 'ana.co.jp',           color: '#003087' },
  KAL: { name: 'Korean Air',       domain: 'koreanair.com',       color: '#00256c' },
  AAR: { name: 'Asiana Airlines',  domain: 'flyasiana.com',       color: '#e00000' },
  CCA: { name: 'Air China',        domain: 'airchina.com',        color: '#d4232c' },
  CSN: { name: 'China Southern',   domain: 'csair.com',           color: '#0062b2' },
  CES: { name: 'China Eastern',    domain: 'ceair.com',           color: '#e50012' },
  THA: { name: 'Thai Airways',     domain: 'thaiairways.com',     color: '#6b2d8b' },
  PAL: { name: 'Philippine Air',   domain: 'philippineairlines.com', color: '#0038a8' },
  HVN: { name: 'Vietnam Airlines', domain: 'vietnamairlines.com', color: '#004b87' },
  EVA: { name: 'EVA Air',          domain: 'evaair.com',          color: '#007b40' },
  CAL: { name: 'China Airlines',   domain: 'china-airlines.com',  color: '#cc0000' },
  AAL: { name: 'American Airlines',domain: 'aa.com',              color: '#0078d2' },
  UAL: { name: 'United Airlines',  domain: 'united.com',          color: '#005daa' },
  DAL: { name: 'Delta Air Lines',  domain: 'delta.com',           color: '#003366' },
  ACA: { name: 'Air Canada',       domain: 'aircanada.com',       color: '#cc0000' },
  HAL: { name: 'Hawaiian Airlines',domain: 'hawaiianairlines.com',color: '#6b2d8b' },
  AIC: { name: 'Air India',        domain: 'airindia.com',        color: '#e84c0e' },
  ETH: { name: 'Ethiopian Air',    domain: 'ethiopianairlines.com',color: '#007a3d' },
  NYG: { name: 'Air Niugini',      domain: 'airniugini.com.pg',   color: '#ce1126' },
  PCF: { name: 'Air Tahiti Nui',   domain: 'airtahitinui.com',    color: '#003087' },
  SCO: { name: 'Scoot',            domain: 'flyscoot.com',        color: '#ffcd00' },
  AXB: { name: 'AirAsia X',        domain: 'airasiax.com',        color: '#ff0000' },
  AWQ: { name: 'Batik Air',        domain: 'batikair.com',        color: '#8b0000' },
  QLK: { name: 'QantasLink',       domain: 'qantas.com',          color: '#e00000' },
}

export function getAirlineInfo(callsign: string): AirlineInfo | null {
  if (!callsign || callsign === 'N/A') return null
  // Try 3-char ICAO prefix first, fall back to 2-char IATA
  const icao = callsign.slice(0, 3).toUpperCase()
  const iata = callsign.slice(0, 2).toUpperCase()
  return AIRLINE_MAP[icao] ?? AIRLINE_MAP[iata] ?? null
}