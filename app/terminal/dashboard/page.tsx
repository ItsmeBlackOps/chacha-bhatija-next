import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const [activeJobs, todayRevenue, towCalls, staffOnDuty, recentJobs, lowStock] = await Promise.all([
    prisma.job.count({ where: { status: { in: ['PENDING', 'EN_ROUTE', 'IN_PROGRESS'] } } }),
    prisma.payment.aggregate({
      where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, status: 'PAID' },
      _sum: { amount: true },
    }),
    prisma.job.count({ where: { type: 'TOW', status: { in: ['PENDING', 'EN_ROUTE', 'IN_PROGRESS'] } } }),
    prisma.staff.count({ where: { onDuty: true } }),
    prisma.job.findMany({
      where: { status: { in: ['PENDING', 'EN_ROUTE', 'IN_PROGRESS', 'COMPLETE'] } },
      include: { staff: { include: { user: true } } },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.inventory.findMany({ where: { stock: { lte: prisma.inventory.fields.lowThreshold } } }),
  ])

  const stats = [
    { label: 'Active Jobs', value: activeJobs, delta: '+3', color: 'text-[#e63946]', dotColor: 'bg-[#e63946]' },
    { label: 'Revenue Today', value: formatCurrency(todayRevenue._sum.amount ?? 0), delta: '+18.4%', color: 'text-[#4a90e2]', dotColor: 'bg-[#4a90e2]' },
    { label: 'Tow Calls', value: towCalls, delta: '-2 closed', color: 'text-[#d18a2c]', dotColor: 'bg-[#d18a2c]' },
    { label: 'Staff On-Duty', value: `${staffOnDuty} / 14`, delta: '3 on roadside', color: 'text-[#5cd297]', dotColor: 'bg-[#5cd297]' },
  ]

  const typeClass: Record<string, string> = {
    REPAIR: 'tag-repair',
    TOW: 'tag-tow',
    IMPOUND: 'tag-impound',
    WASH: 'tag-wash',
    ROADSIDE: 'tag-tow',
  }

  const typeLabels: Record<string, string> = {
    REPAIR: 'repair',
    TOW: 'tow',
    IMPOUND: 'impound',
    WASH: 'wash',
    ROADSIDE: 'roadside',
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] text-[#5a4248] uppercase mb-1">
            Command Center · Live
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-[0.04em] uppercase">
            Operations Dashboard
          </h1>
          <div className="font-[family-name:var(--font-body)] text-sm text-[#9d8589] mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · {activeJobs} active units · 3 incoming calls
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="panel p-4">
            <div className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.12em] text-[#9d8589] uppercase mb-2">
              <span className={`w-1.5 h-1.5 rounded-full ${stat.dotColor}`} />
              {stat.label}
            </div>
            <div className={`font-[family-name:var(--font-display)] text-2xl ${stat.color}`}>
              {stat.value}
            </div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[#5a4248] mt-1">
              {stat.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-[1.4fr_1fr] gap-4">
        {/* Live Feed */}
        <div className="panel">
          <div className="panel-head">
            <div className="flex items-center gap-2 font-[family-name:var(--font-display)] text-sm tracking-[0.06em] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#e63946] animate-pulse" />
              Live Operations Feed
            </div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[#5a4248]">
              Streaming · 200ms
            </div>
          </div>
          <div className="p-4">
            {/* Map placeholder */}
            <div className="relative h-[180px] bg-[#0a0608] border border-[rgba(255,255,255,0.05)] rounded overflow-hidden mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full relative">
                  {/* Radar sweep */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] border border-[rgba(92,210,151,0.15)] rounded-full" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80px] h-[80px] border border-[rgba(92,210,151,0.1)] rounded-full" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40px] h-[40px] border border-[rgba(92,210,151,0.08)] rounded-full" />
                  {/* Blips */}
                  <div className="absolute top-[35%] left-[40%] w-2 h-2 bg-[#e63946] rounded-full shadow-[0_0_8px_#e63946] animate-pulse" />
                  <div className="absolute top-[55%] left-[60%] w-2 h-2 bg-[#4a90e2] rounded-full shadow-[0_0_8px_#4a90e2]" />
                  <div className="absolute top-[45%] left-[30%] w-2 h-2 bg-[#5cd297] rounded-full shadow-[0_0_8px_#5cd297]" />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 font-[family-name:var(--font-mono)] text-[9px] tracking-wider text-[#5a4248]">
                UNIT 04 · TOW
              </div>
              <div className="absolute bottom-2 right-2 font-[family-name:var(--font-mono)] text-[9px] tracking-wider text-[#5a4248]">
                DISPATCH
              </div>
            </div>

            {/* Activity rows */}
            <div className="space-y-2">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center gap-3 py-2 border-b border-[rgba(255,255,255,0.03)] last:border-0">
                  <div className="font-[family-name:var(--font-mono)] text-[10px] text-[#5a4248] w-16">
                    {job.createdAt.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <span className={`tag ${typeClass[job.type]}`}>{typeLabels[job.type]}</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-[family-name:var(--font-mono)] text-[10px] text-[#e63946]">{job.id.slice(0, 8)}</span>
                    <div className="text-sm text-[#e8e0e2] truncate">{job.vehicleDesc ?? job.notes ?? 'No description'}</div>
                  </div>
                  <div className="font-[family-name:var(--font-mono)] text-[10px] text-[#5a4248] text-right">
                    {job.staff?.user.name ?? 'Unassigned'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Low Stock Alert */}
          {lowStock.length > 0 && (
            <div className="flex items-start gap-3 px-4 py-3 border border-[#d18a2c] bg-[rgba(209,138,44,0.06)] rounded">
              <span className="text-[#d18a2c] mt-0.5">⚠</span>
              <div>
                <div className="font-[family-name:var(--font-display)] text-sm tracking-wider text-[#d18a2c]">
                  {lowStock.length} Low-Stock Alerts
                </div>
                <div className="font-[family-name:var(--font-body)] text-xs text-[#9d8589] mt-0.5">
                  {lowStock.map((i) => `${i.name} at ${i.stock}/${i.maxStock}`).join(' · ')}
                </div>
              </div>
            </div>
          )}

          {/* Reminders */}
          <div className="panel">
            <div className="panel-head">
              <div className="flex items-center gap-2 font-[family-name:var(--font-display)] text-sm tracking-[0.06em] uppercase">
                <span className="w-2 h-2 rounded-full bg-[#e63946]" />
                Reminders
              </div>
              <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[#5a4248]">4 active</div>
            </div>
            <div className="p-4 space-y-3">
              {[
                { title: 'PD callback · Officer Singh', sub: 'Impound IMP-0117 release window', time: '15:00', done: false },
                { title: 'Restock chain pulleys', sub: '4 remaining · low stock', time: 'Tomorrow', done: false },
                { title: 'Customer follow-up · debt', sub: 'CUS-074 · $3,400 outstanding', time: '16:30', done: false },
                { title: 'EMS support call · closed', sub: 'JOB-4815 · waived', time: '13:10', done: true },
              ].map((r, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${r.done ? 'bg-[#5a4248]' : 'bg-[#e63946]'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[#e8e0e2]">{r.title}</div>
                    <div className="text-xs text-[#9d8589]">{r.sub}</div>
                  </div>
                  <div className="font-[family-name:var(--font-mono)] text-[10px] text-[#5a4248] flex-shrink-0">
                    {r.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Holo Car */}
          <div className="panel">
            <div className="panel-head">
              <div className="font-[family-name:var(--font-display)] text-sm tracking-[0.06em] uppercase">Holo Vehicle Scan</div>
              <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[#5a4248]">VEH-2294</div>
            </div>
            <div className="p-4">
              <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid meet" className="w-full">
                <defs>
                  <linearGradient id="hg" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#4a90e2" stopOpacity="0" />
                    <stop offset=".5" stopColor="#4a90e2" stopOpacity=".8" />
                    <stop offset="1" stopColor="#4a90e2" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <g fill="none" stroke="#4a90e2" strokeWidth="1.3" opacity="0.85">
                  <path d="M30 130 Q 50 96 92 92 L 130 76 Q 160 70 200 76 L 240 92 Q 282 96 296 122 L 296 140 L 30 140 Z" />
                  <path d="M92 92 L 130 76 L 200 76 L 240 92" />
                  <path d="M120 76 L 138 92 L 220 92 L 232 78" opacity="0.5" />
                  <circle cx="84" cy="138" r="14" />
                  <circle cx="84" cy="138" r="6" />
                  <circle cx="244" cy="138" r="14" />
                  <circle cx="244" cy="138" r="6" />
                  <rect x="50" y="118" width="8" height="6" />
                  <rect x="276" y="118" width="8" height="6" />
                </g>
                <rect x="20" y="40" width="280" height="2" fill="url(#hg)">
                  <animate attributeName="y" values="40;150;40" dur="3s" repeatCount="indefinite" />
                </rect>
                <text x="20" y="22" fontFamily="JetBrains Mono" fontSize="9" fill="#4a90e2" letterSpacing="2">VEH-2294 · ELEGY RH8 · BLACK</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
