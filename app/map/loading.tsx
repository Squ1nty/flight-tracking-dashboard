export default function MapLoading() {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: 'var(--bg-page)' }}
    >
      <p className="text-sm animate-pulse" style={{ color: 'var(--text-muted)' }}>
        Loading map...
      </p>
    </div>
  )
}