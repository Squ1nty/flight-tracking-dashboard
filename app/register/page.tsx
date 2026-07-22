// app/register/page.tsx
import Link from 'next/link'
import RegisterForm from './RegisterForm'

export default function RegisterPage() {
  return (
    <div className="h-[calc(100vh-69px)] flex">

      {/* Left — Register form */}
      <div
        className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 py-12"
        style={{ background: 'var(--bg-page)' }}
      >
        {/* Logo */}
        <Link href="/" className="mb-5 inline-block">
          <span className="text-4xl font-extrabold tracking-tight">
            <span style={{ color: 'var(--text-primary)' }}>Where's my </span>
            <span style={{ color: 'var(--jade-600)' }}>Flight?</span>
          </span>
        </Link>

        <h1
          className="text-2xl font-extrabold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Create your account
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
          Track live flights across AUS/NZ airspace
        </p>

        <RegisterForm />

        <p className="text-sm mt-6 text-center" style={{ color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium"
            style={{ color: 'var(--jade-400)' }}
          >
            Log in
          </Link>
        </p>
      </div>

      {/* Right — Map preview with stats overlay */}
      <div className="hidden md:flex md:items-center md:w-1/2 relative overflow-hidden">

        {/* Map screenshot background */}
        <img
          src="/map-preview.jpg"
          alt="Live flight map"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.55)' }}
        />

        {/* Jade tint overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(46,140,94,0.08)' }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-end p-12 w-full">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { value: '300+', label: 'Live flights' },
              { value: 'AUS/NZ', label: 'Coverage' },
              { value: 'Real-time', label: 'Updates' },
            ].map(stat => (
              <div
                key={stat.label}
                className="rounded-lg p-4"
                style={{ background: 'rgba(0,0,0,0.4)', border: '0.5px solid rgba(91,189,138,0.2)' }}
              >
                <p
                  className="text-lg font-extrabold mb-0.5"
                  style={{ color: '#5bbd8a' }}
                >
                  {stat.value}
                </p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Tagline */}
          <h2
            className="text-3xl font-extrabold mb-3"
            style={{ color: '#ffffff' }}
          >
            Track every flight,{' '}
            <span style={{ color: '#5bbd8a' }}>live.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '360px' }}>
            Real-time AUS/NZ flight tracking powered by live ADS-B data.
            From Perth FIFO shuttles to international arrivals — all in one place.
          </p>
        </div>
      </div>
    </div>
  )
}