'use client'

import { useState } from 'react'

export default function PrivateRecordsPage() {
  const [pin, setPin] = useState('')
  const [unlocked, setUnlocked] = useState(false)

  const handleUnlock = () => {
    if (pin.length === 6) setUnlocked(true)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] text-[#5a4248] uppercase mb-1">
          Locked Section · Owner / Manager Only
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-[0.04em] uppercase">
          Private Records
        </h1>
        <div className="font-[family-name:var(--font-body)] text-sm text-[#9d8589] mt-1">
          PIN required · all actions logged · favor / debt / hidden-note tags
        </div>
      </div>

      {!unlocked ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 border border-[rgba(255,255,255,0.08)] bg-[#0c060a] rounded min-h-[400px] items-center"
          style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(193, 26, 38, 0.08), transparent 70%), #0c060a' }}
        >
          <div className="flex items-center justify-center">
            <div className="w-32 h-32 border-2 border-[#c11a26] rounded-full grid place-items-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c11a26" strokeWidth="1.5">
                <rect x="5" y="11" width="14" height="10" rx="1.5" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
            </div>
          </div>
          <div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.32em] text-[#e63946] uppercase">
              ◢ Authentication Required
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-[0.06em] uppercase leading-none mt-3">
              Enter Vault PIN
            </h2>
            <p className="text-sm text-[#9d8589] mt-4 leading-relaxed max-w-md">
              Private records contain off-the-books favors, debt arrangements, hidden notes,
              and under-the-table jobs. Access is restricted to Owner and Manager roles
              and every unlock is recorded in the audit log.
            </p>

            <div className="flex gap-2.5 mt-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-12 h-14 grid place-items-center rounded border font-[family-name:var(--font-mono)] text-xl ${
                    i < pin.length
                      ? 'border-[#c11a26] text-[#e63946] shadow-[0_0_12px_rgba(230,57,70,0.25)]'
                      : 'border-[rgba(255,255,255,0.08)] text-[#5a4248]'
                  }`}
                >
                  {i < pin.length ? '●' : '—'}
                </div>
              ))}
            </div>

            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="absolute opacity-0 pointer-events-none"
              autoFocus
            />

            <div className="flex gap-3 mt-8">
              <button onClick={handleUnlock} className="btn-primary text-xs py-2.5 px-5">
                Unlock Vault
              </button>
              <button onClick={() => setPin('')} className="btn-ghost py-2.5 px-5">
                Cancel
              </button>
            </div>

            <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.22em] text-[#5a4248] uppercase mt-6 space-y-1">
              <div>◉ Authenticated as: S. Khanna · Owner</div>
              <div>◉ Last unlock: yesterday · 22:14</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="panel p-8 text-center">
          <div className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.3em] text-[#5a4248] uppercase">
            Vault Unlocked
          </div>
          <div className="font-[family-name:var(--font-display)] text-2xl tracking-[0.06em] uppercase mt-3">
            Private Records
          </div>
          <div className="text-[#9d8589] mt-3 max-w-md mx-auto">
            This module contains restricted records. Production data will appear here once connected.
          </div>
        </div>
      )}
    </div>
  )
}
