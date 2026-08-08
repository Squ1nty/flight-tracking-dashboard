// app/components/FlightStatusPill.tsx

type Status = 'Airborne' | 'On ground' | 'Departing' | 'Arrived' | 'Taxiing' | 'N/A'
type Size = 'sm' | 'lg'

type Props = {
  status: Status
  size?: Size
}

const STATUS_STYLES: Record<Status, { bg: string; text: string }> = {
  'Airborne':  { bg: '#0d2818', text: '#3fb950' },
  'Departing': { bg: '#0a1f3d', text: '#388bfd' },  // blue — like climbing
  'Arrived':   { bg: '#1a1a2e', text: '#5bbd8a' },  // jade — positive completion
  'Taxiing':   { bg: '#1a2a1a', text: '#5bbd8a' },
  'On ground': { bg: '#1a1a2e', text: '#8b949e' },
  'N/A':       { bg: '#1a1a2e', text: '#8b949e' },
}

const SIZE_STYLES: Record<Size, string> = {
  sm: 'text-[10px] px-2 py-0.5 whitespace-nowrap',
  lg: 'text-sm px-3 py-1',
}

export default function FlightStatusPill({ status, size='lg' }: Props) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES['N/A']
  return (
    <span
      className={`rounded-full font-medium ${SIZE_STYLES[size]}`}
      style={{ background: style.bg, color: style.text }}
    >
      {status}
    </span>
  )
}