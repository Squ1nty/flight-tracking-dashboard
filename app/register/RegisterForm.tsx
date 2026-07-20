// app/register/RegisterForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong')
        return
      }

      router.push('/login?registered=true')
    } catch (err) {
      setError('Something went wrong — please try again')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '0.5px solid var(--bg-border)',
    background: 'var(--bg-surface)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
  }

  const labelStyle = {
    fontSize: '12px',
    fontWeight: '500',
    color: 'var(--text-secondary)',
    marginBottom: '6px',
    display: 'block',
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Name */}
      <div>
        <label htmlFor="name" style={labelStyle}>Full name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="John Smith"
          required
          value={form.name}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" style={labelStyle}>Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="@email.com"
          required
          value={form.email}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" style={labelStyle}>Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Min. 8 characters"
          required
          value={form.password}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      {/* Confirm password */}
      <div>
        <label htmlFor="confirmPassword" style={labelStyle}>Confirm password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Repeat your password"
          required
          value={form.confirmPassword}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      {/* Error */}
      {error && (
        <p
          className="text-sm px-3 py-2 rounded-md"
          style={{ background: '#2d0f0e', color: '#f85149' }}
        >
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-md text-sm font-semibold transition-all duration-200 mt-2"
        style={{
          background: loading ? 'var(--bg-hover)' : 'var(--jade-600)',
          color: loading ? 'var(--text-muted)' : 'var(--jade-100)',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  )
}