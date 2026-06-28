// app/flight/[callsign]/loading.tsx

export default function FlightLoading() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-10">

      {/* Back button skeleton */}
      <div
        className="h-9 w-32 rounded-md mb-6 animate-pulse"
        style={{ background: 'var(--bg-surface)' }}
      />

      {/* Header skeleton */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-14 h-14 rounded-md animate-pulse flex-shrink-0"
          style={{ background: 'var(--bg-surface)' }}
        />
        <div className="flex flex-col gap-2">
          <div
            className="h-5 w-28 rounded animate-pulse"
            style={{ background: 'var(--bg-surface)' }}
          />
          <div
            className="h-3 w-40 rounded animate-pulse"
            style={{ background: 'var(--bg-surface)' }}
          />
        </div>
      </div>

      {/* Section card skeletons */}
      {['Route', 'Schedule', 'Live position'].map(title => (
        <div
          key={title}
          className="rounded-lg border p-5 mb-4 animate-pulse"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}
        >
          <div
            className="h-3 w-20 rounded mb-4"
            style={{ background: 'var(--bg-hover)' }}
          />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-14 rounded-md" style={{ background: 'var(--bg-hover)' }} />
            <div className="h-14 rounded-md" style={{ background: 'var(--bg-hover)' }} />
          </div>
        </div>
      ))}

    </main>
  )
}