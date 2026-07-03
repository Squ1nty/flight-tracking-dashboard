// app/components/FlightStatusPill.tsx

type Status = 'Airborne' | 'On ground' | 'Departing' | 'Arrived' | 'N/A'

type Props = {
  status: Status
}

const STATUS_STYLES: Record<Status, { bg: string; text: string }> = {
  'Airborne':  { bg: '#0d2818', text: '#3fb950' },
  'Departing': { bg: '#0a1f3d', text: '#388bfd' },  // blue — like climbing
  'Arrived':   { bg: '#1a1a2e', text: '#5bbd8a' },  // jade — positive completion
  'On ground': { bg: '#1a1a2e', text: '#8b949e' },
  'N/A':       { bg: '#1a1a2e', text: '#8b949e' },
}

export default function FlightStatusPill({ status }: Props) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES['N/A']
  return (
    <span
      className="text-xs px-3 py-1 rounded-full font-medium"
      style={{ background: style.bg, color: style.text }}
    >
      {status}
    </span>
  )
}