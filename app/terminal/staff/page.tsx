import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function StaffPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const staff = await prisma.staff.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] text-[#5a4248] uppercase mb-1">
          Operations Roster
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-[0.04em] uppercase">
          Staff
        </h1>
        <div className="font-[family-name:var(--font-body)] text-sm text-[#9d8589] mt-1">
          {staff.length} total · {staff.filter((s) => s.onDuty).length} on duty · {staff.filter((s) => !s.onDuty).length} off duty
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((s) => (
          <div key={s.id} className="border border-[rgba(255,255,255,0.08)] bg-[#0c060a] p-4 rounded flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c11a26] to-[#6b0f15] grid place-items-center font-[family-name:var(--font-display)] text-lg font-bold text-white flex-shrink-0">
              {s.user.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-[family-name:var(--font-display)] text-base tracking-[0.08em] uppercase">{s.user.name}</div>
              <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[#e63946] uppercase">{s.role}</div>
              <div className="font-[family-name:var(--font-mono)] text-[10px] text-[#5a4248] mt-0.5">
                {s.badge} · {s.unit}
              </div>
            </div>
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.onDuty ? 'bg-[#5cd297] shadow-[0_0_8px_#5cd297]' : 'bg-[#5a4248]'}`} />
          </div>
        ))}
      </div>
    </div>
  )
}
