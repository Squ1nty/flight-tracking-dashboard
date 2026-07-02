// app/components/Navbar.tsx
'use client'

import { useRecordLastPage } from '@/lib/useLastPage'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '../contextFiles/ThemeContext'

export default function Navbar() {
  useRecordLastPage()
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()
  const dark = theme === 'dark'

  const tabs = [
    { label: 'Search', href: '/' },
    { label: 'Map', href: '/map' },
  ]

  return (
    <nav
      className={`w-full px-8 py-4 flex items-center justify-between border-b ${
        dark
          ? 'bg-[var(--bg-surface)] border-[var(--bg-border)]'
          : 'bg-[var(--bg-surface)] border-[var(--bg-border)]'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-8">
        <Link
          className="text-lg font-extrabold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
          href="/"
        >
          Where's my<span style={{ color: 'var(--jade-600)' }}> Flight?</span>
        </Link>

        {/* Tabs */}
        <div className="flex items-center gap-1">
          {tabs.map(tab => {
            const active = pathname === tab.href
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-[var(--jade-800)] text-[var(--jade-100)]'
                    : dark
                    ? 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
          dark
            ? 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
        }`}
      >
        {dark ? 'Dark Mode' : 'Light Mode'}
      </button>
    </nav>
  )
}