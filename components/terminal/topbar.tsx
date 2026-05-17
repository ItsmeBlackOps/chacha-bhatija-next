'use client'

import { Search, Bell, Plus } from 'lucide-react'
import { signOut } from 'next-auth/react'

interface TopbarProps {
  user: {
    name: string
    role: string
    badge: string | null
  }
}

export default function Topbar({ user }: TopbarProps) {
  return (
    <header className="h-[52px] border-b border-[rgba(255,255,255,0.08)] bg-[rgba(8,3,6,0.72)] backdrop-blur-xl flex items-center px-4 gap-3.5 fixed top-0 right-0 left-[220px] z-30">
      {/* Search */}
      <div className="flex-1 max-w-[460px] flex items-center gap-2 bg-black/35 border border-[rgba(255,255,255,0.05)] px-3 py-1.5 rounded font-[family-name:var(--font-mono)] text-xs text-[#5a4248]">
        <Search size={14} className="flex-shrink-0" />
        <input
          type="text"
          placeholder="Search records, plates, customers, IDs..."
          className="flex-1 bg-transparent border-none outline-none text-[#e8e0e2] text-xs font-[family-name:var(--font-mono)] placeholder:text-[#5a4248]"
        />
        <span className="font-[family-name:var(--font-mono)] text-[9px] px-1 border border-[rgba(255,255,255,0.05)] rounded text-[#5a4248]">⌘K</span>
      </div>

      {/* Actions */}
      <div className="ml-auto flex items-center gap-2.5">
        {/* Notifications */}
        <button className="w-[30px] h-[30px] grid place-items-center border border-[rgba(255,255,255,0.05)] bg-black/30 rounded cursor-pointer text-[#9d8589] hover:text-[#e8e0e2] hover:border-[rgba(255,255,255,0.14)] transition-all relative">
          <Bell size={14} />
          <span className="absolute top-1 right-1 w-[7px] h-[7px] rounded-full bg-[#e63946] shadow-[0_0_8px_#e63946] animate-pulse" />
        </button>

        {/* New Job */}
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-b from-[#c11a26] to-[#6b0f15] border border-[#e63946] text-white font-[family-name:var(--font-display)] text-[11px] font-semibold tracking-[0.16em] uppercase rounded cursor-pointer shadow-[0_0_18px_rgba(230,57,70,0.25)]">
          <Plus size={11} />
          New Job
        </button>

        {/* User Badge */}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-2 px-2.5 py-1 border border-[rgba(255,255,255,0.08)] bg-black/35 rounded cursor-pointer hover:border-[rgba(255,255,255,0.14)] transition-colors"
        >
          <div className="w-[22px] h-[22px] rounded-full bg-gradient-to-br from-[#c11a26] to-[#6b0f15] grid place-items-center font-[family-name:var(--font-display)] text-[10px] font-bold text-white">
            {user.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="leading-tight text-left">
            <div className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.08em] uppercase">
              {user.name}
            </div>
            <div className="font-[family-name:var(--font-mono)] text-[8px] tracking-[0.2em] text-[#e63946] uppercase">
              {user.role}
            </div>
          </div>
        </button>
      </div>
    </header>
  )
}
