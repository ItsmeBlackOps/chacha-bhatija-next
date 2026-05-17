'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Invalid credentials')
      return
    }

    router.push('/terminal/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#c11a26] opacity-[0.04] blur-[120px]" />
      </div>

      {/* Corner frames */}
      <div className="absolute top-6 left-6 w-8 h-8 border-l border-t border-[rgba(255,255,255,0.12)]" />
      <div className="absolute top-6 right-6 w-8 h-8 border-r border-t border-[rgba(255,255,255,0.12)]" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-l border-b border-[rgba(255,255,255,0.12)]" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-r border-b border-[rgba(255,255,255,0.12)]" />

      <div className="relative z-10 w-full max-w-sm px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-sm bg-gradient-to-br from-[#c11a26] to-[#6b0f15] text-white font-[family-name:var(--font-display)] text-lg font-bold mb-4">
            CB
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-[0.12em] uppercase">
            Operations Terminal
          </h1>
          <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] uppercase text-[#5a4248] mt-2">
            Authorized Personnel Only
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="px-4 py-3 border border-[#c11a26] bg-[rgba(193,26,38,0.08)] text-[#e63946] text-sm font-[family-name:var(--font-mono)] text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] uppercase text-[#9d8589] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input"
              placeholder="skhanna@chacha.local"
              required
            />
          </div>

          <div>
            <label className="block font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] uppercase text-[#9d8589] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field-input"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center mt-2"
          >
            {loading ? 'Authenticating...' : 'Enter Terminal'}
          </button>
        </form>

        <div className="mt-8 text-center font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[#5a4248]">
          <p>v2.4.1 · CBC-TERM-04</p>
          <p className="mt-1">All access is logged and audited</p>
        </div>
      </div>
    </div>
  )
}
