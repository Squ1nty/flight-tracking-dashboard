// app/components/BackButton.tsx
'use client'

import { useRouter } from 'next/navigation'
import { getLastPage } from '@/lib/useLastPage'

export default function BackButton() {
  const router = useRouter()

  const handleBack = () => {
    router.push(getLastPage())
  }

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-sm rounded-md px-4 py-2 mb-6 cursor-pointer"
      style={{
        background: 'var(--bg-surface)',
        color: 'var(--text-secondary)',
        border: '0.5px solid var(--bg-border)'
      }}
    >
      ← Back
    </button>
  )
}