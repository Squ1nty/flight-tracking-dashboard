// app/components/Navbar.tsx
'use client'

import { useRecordLastPage } from '@/lib/useLastPage'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '../contextFiles/ThemeContext'
import { useSession, signOut } from 'next-auth/react'
import ThemeToggle from '@/app/components/ThemeToggle'
import MapTab from '@/app/components/MapTab'

export default function Navbar() {
  useRecordLastPage()
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()
  const dark = theme === 'dark'

  const { data: session } = useSession()
  const isLoggedIn = !!session

  return (
    <nav
      className={`sticky top-0 left-0 right-0 z-50 w-full px-8 py-4 flex items-center justify-between border-b ${
        dark
          ? 'bg-[var(--bg-surface)] border-[var(--bg-border)]'
          : 'bg-[var(--bg-surface)] border-[var(--bg-border)]'
      }`}
    >
      {/* Logo and Map Button*/}
      <div className="flex items-center md:gap-8">
        <Link
          className="order-2 md:order-1 col-start-2 text-lg font-extrabold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
          href="/"
        >
          Where's my<span style={{ color: 'var(--jade-600)' }}> Flight?</span>
        </Link>

        <MapTab pathname={pathname} />

      </div>

      {/* Theme Toggle, Login/Acc and SignUp buttons */}
      <div className="hidden md:block flex items-center gap-2">

        {/* Theme toggle */}
        <ThemeToggle onClickHandler={toggleTheme} theme={theme} />

        {/* Auth buttons */}
        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            <Link
              href="/account"
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-[var(--bg-hover)]"
              style={{ color: 'var(--text-secondary)' }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                style={{ background: 'var(--jade-800)', color: 'var(--jade-100)' }}
              >
                {session.user?.name?.[0].toUpperCase() ?? 'U'}
              </div>
              {session.user?.name ?? 'Account'}
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-[var(--bg-hover)] cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-[var(--bg-hover)]"
              style={{ color: 'var(--text-secondary)' }}
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
              style={{ background: 'var(--jade-600)', color: 'var(--jade-100)' }}
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}