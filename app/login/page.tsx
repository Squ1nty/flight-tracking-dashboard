// app/login/page.tsx
import { Suspense } from 'react'
import Link from 'next/link'
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <div
      className="h-[calc(100vh-57px)] flex items-center justify-center relative overflow-hidden"
    >
      {/* Map background */}
      <img
        src="/map-preview.jpg"
        alt="Live flight map"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.6)' }}
      />

      {/* Jade tint */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(46,140,94,0.06)' }}
      />

      {/* Centered card */}
      <div
        className="relative z-10 w-full max-w-md mx-4 rounded-xl p-8 border flex flex-col"
        style={{
          background: 'rgba(20,20,20,0.85)',
          borderColor: 'rgba(91,189,138,0.15)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Logo */}
        <div className='self-center'>
          <h1 className="text-3xl font-extrabold tracking-tight">
            <span style={{ color: '#ffffff' }}>Where's my </span>
            <span style={{ color: '#5bbd8a' }}>Flight?</span>
          </h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Log in to access your saved flights and more!
          </p>
        </div>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

        <p className="text-sm mt-6 text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Don't have an account?{' '}
          <Link
            href="/register"
            className="font-medium"
            style={{ color: '#5bbd8a' }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}