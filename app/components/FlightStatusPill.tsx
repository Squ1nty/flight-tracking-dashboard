// app/components/FlightStatusPill.tsx

type Props = {
  status: 'Airborne' | 'On ground' | 'N/A'
}

const STATUS_STYLES: Record<Props['status'], { bg: string; text: string }> = {
  'Airborne':  { bg: '#0d2818', text: '#3fb950' },
  'On ground': { bg: '#1a1a2e', text: '#8b949e' },
  'N/A':       { bg: '#1a1a2e', text: '#8b949e' },
}

export default function FlightStatusPill({ status }: Props) {
  const style = STATUS_STYLES[status]

  return (
    <span
      className="text-xs px-3 py-1 rounded-full font-medium"
      style={{ background: style.bg, color: style.text }}
    >
      {status}
    </span>
  )
}