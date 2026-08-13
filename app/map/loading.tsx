export default function MapLoading() {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-4"
      style={{ background: 'var(--bg-page)' }}
    >
      <svg
        viewBox="0 0 512 512"
        className="w-2/3 max-w-md animate-pulse"
        style={{ color: 'var(--bg-hover)' }}
        fill="currentColor"
      >
        <path d="M118 132c14-11 33-14 49-9 11-9 26-13 39-9 9-15 27-23 44-20 16-18 43-24 66-15 21-6 45 2 58 19 16 3 29 15 34 30 14 5 24 18 26 33 13 8 20 23 18 38 10 10 14 25 10 39 8 12 8 28 0 41 4 15-1 32-13 42 1 16-8 32-22 39-6 15-21 25-37 26-9 13-25 20-41 18-13 10-31 12-46 5-15 8-33 6-47-5-16 2-32-5-42-17-16-2-29-14-34-29-14-4-24-17-26-32-12-8-19-22-18-36-9-11-12-27-7-40-6-13-4-29 5-40-3-15 3-30 15-39-1-16 9-31 24-38 3-15 15-27 30-31z" />
      </svg>
      <p className="text-sm animate-pulse" style={{ color: 'var(--text-muted)' }}>
        Loading map...
      </p>
    </div>
  )
}