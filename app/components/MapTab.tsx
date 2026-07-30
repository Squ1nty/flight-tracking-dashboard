'use client'

import Link from 'next/link'

export default function MapTab({ pathname } : {pathname: String}){
  const mapActive = pathname === '/map'

  return(
    <Link
      href="/map"
      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hidden md:block ${
        mapActive
          ? 'bg-[var(--jade-800)] text-[var(--jade-100)]'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
      }`}
    >
      Map
    </Link>
  );
}