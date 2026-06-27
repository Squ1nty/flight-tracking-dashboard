// app/components/DataDisclaimer.tsx

export default function DataDisclaimer() {
  return (
    <p
      className="text-xs mt-1 mb-4 flex items-center gap-1.5"
      style={{ color: 'var(--text-muted)' }}
    >
      <span aria-hidden="true">ⓘ</span>
      Schedule data is provided by a third-party source and may not always reflect real-time changes.
    </p>
  )
}