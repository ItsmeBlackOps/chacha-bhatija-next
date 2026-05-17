'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, Radio, Wrench, Truck, Lock, Package, Users, UserCog, Banknote, BarChart3, FileText, Shield, Settings } from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
  roles?: string[]
  count?: string
}

const NAV_SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: 'OPERATIONS',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid size={18} />, href: '/terminal/dashboard' },
      { id: 'dispatch', label: 'Dispatch', icon: <Radio size={18} />, href: '/terminal/dispatch', count: '3' },
      { id: 'jobs', label: 'Jobs', icon: <Wrench size={18} />, href: '/terminal/jobs', count: '12' },
      { id: 'vehicles', label: 'Vehicles', icon: <Truck size={18} />, href: '/terminal/vehicles' },
      { id: 'impound', label: 'Impound', icon: <Truck size={18} />, href: '/terminal/impound', count: '5', roles: ['OWNER', 'MANAGER'] },
    ],
  },
  {
    title: 'INVENTORY',
    items: [
      { id: 'kits', label: 'Repair Kits', icon: <Package size={18} />, href: '/terminal/kits', roles: ['OWNER', 'MANAGER'] },
    ],
  },
  {
    title: 'PEOPLE',
    items: [
      { id: 'customers', label: 'Customers', icon: <Users size={18} />, href: '/terminal/customers' },
      { id: 'staff', label: 'Staff', icon: <UserCog size={18} />, href: '/terminal/staff', roles: ['OWNER', 'MANAGER'] },
    ],
  },
  {
    title: 'RECORDS',
    items: [
      { id: 'payments', label: 'Payments', icon: <Banknote size={18} />, href: '/terminal/payments', count: '4', roles: ['OWNER', 'MANAGER'] },
      { id: 'reports', label: 'Reports', icon: <BarChart3 size={18} />, href: '/terminal/reports', roles: ['OWNER', 'MANAGER'] },
      { id: 'rplogs', label: 'RP Logs', icon: <FileText size={18} />, href: '/terminal/rplogs' },
      { id: 'private', label: 'Private Records', icon: <Lock size={18} />, href: '/terminal/private', roles: ['OWNER'] },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { id: 'audit', label: 'Audit Log', icon: <Shield size={18} />, href: '/terminal/audit', roles: ['OWNER'] },
      { id: 'settings', label: 'Settings', icon: <Settings size={18} />, href: '/terminal/settings', roles: ['OWNER'] },
    ],
  },
]

interface SidebarProps {
  userRole: string
}

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()

  const filteredSections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => !item.roles || item.roles.includes(userRole)),
  })).filter((section) => section.items.length > 0)

  return (
    <aside className="w-[220px] min-h-screen bg-[rgba(5,2,7,0.95)] border-r border-[rgba(255,255,255,0.08)] flex flex-col fixed left-0 top-0 z-40">
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[rgba(255,255,255,0.05)]">
        <div className="w-9 h-9 rounded-sm bg-gradient-to-br from-[#c11a26] to-[#6b0f15] flex items-center justify-center text-white font-[family-name:var(--font-display)] text-sm font-bold">
          CB
        </div>
        <div>
          <div className="font-[family-name:var(--font-display)] text-[13px] tracking-[0.18em] uppercase leading-tight">
            Chacha Bhatija
          </div>
          <div className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.2em] text-[#5a4248] uppercase">
            Operations · v2.4
          </div>
        </div>
      </div>

      {/* Duty Toggle */}
      <div className="mx-3 my-3 px-3 py-2.5 border border-[rgba(255,255,255,0.05)] rounded bg-black/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#5cd297] shadow-[0_0_8px_#5cd297]" />
          <div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[#9d8589]">On-duty</div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[#5cd297]">Active</div>
          </div>
        </div>
        <div className="w-8 h-4 rounded-full bg-[#5cd297] relative cursor-pointer">
          <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white shadow" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2.5">
        {filteredSections.map((section) => (
          <div key={section.title} className="mb-3">
            <div className="px-2 py-1.5 font-[family-name:var(--font-mono)] text-[9px] tracking-[0.25em] text-[#5a4248] uppercase">
              {section.title}
            </div>
            {section.items.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-2.5 py-2 text-[13px] rounded cursor-pointer transition-all duration-150 relative ${
                    isActive
                      ? 'text-[#e8e0e2] bg-gradient-to-r from-[rgba(193,26,38,0.18)] via-[rgba(193,26,38,0.04)] to-transparent'
                      : 'text-[#9d8589] hover:text-[#e8e0e2] hover:bg-[rgba(193,26,38,0.05)]'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-[#e63946] rounded-full shadow-[0_0_10px_var(--color-red-glow)]" />
                  )}
                  <span className={`flex-shrink-0 ${isActive ? 'text-[#e63946]' : 'opacity-70'}`}>
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {item.count && (
                    <span className="font-[family-name:var(--font-mono)] text-[10px] text-[#5a4248] bg-[rgba(255,255,255,0.04)] px-1.5 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* System Strip */}
      <div className="mx-3 mb-3 p-2 border border-[rgba(255,255,255,0.05)] rounded bg-black/30">
        {[
          { label: 'Dispatch', status: 'Ready', ok: true },
          { label: 'Garage', status: 'Online', ok: true },
          { label: 'Webhook', status: 'Synced', ok: true },
          { label: 'Build', status: 'cbc-2.4.1', ok: false },
        ].map((row) => (
          <div key={row.label} className="flex justify-between items-center font-[family-name:var(--font-mono)] text-[9px] tracking-[0.15em] text-[#5a4248] uppercase py-0.5">
            <span>{row.label}</span>
            {row.ok ? (
              <span className="text-[#5cd297] font-medium">● {row.status}</span>
            ) : (
              <span>{row.status}</span>
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}
