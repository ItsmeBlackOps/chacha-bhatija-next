import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function DispatchPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const pendingJobs = await prisma.job.findMany({
    where: { status: { in: ['PENDING', 'EN_ROUTE'] } },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  const staff = await prisma.staff.findMany({
    where: { onDuty: true },
    include: { user: true },
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] text-[#5a4248] uppercase mb-1">
          Emergency Intake · Open Channel
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-[0.04em] uppercase">
          Dispatch Console
        </h1>
        <div className="font-[family-name:var(--font-body)] text-sm text-[#9d8589] mt-1">
          {pendingJobs.length} calls in queue · Avg response 4m 22s · Region: Los Santos South
        </div>
      </div>

      <div className="grid grid-cols-[1fr_1fr] gap-4">
        {/* New Call Form */}
        <div className="panel">
          <div className="panel-head">
            <div className="flex items-center gap-2 font-[family-name:var(--font-display)] text-sm tracking-[0.06em] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#e63946] animate-pulse" />
              New Call
            </div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[#5a4248]">Channel · 911-OPS</div>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <label className="block font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[#9d8589] uppercase mb-1.5">Caller Name</label>
              <input className="field-input" defaultValue="Diego Ramirez" />
            </div>
            <div>
              <label className="block font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[#9d8589] uppercase mb-1.5">Plate / Vehicle</label>
              <input className="field-input" defaultValue="44KRH02 — Sultan RS" />
            </div>
            <div>
              <label className="block font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[#9d8589] uppercase mb-1.5">Location</label>
              <input className="field-input" defaultValue="Vespucci Blvd & Dudley Ave" />
            </div>
            <div>
              <label className="block font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[#9d8589] uppercase mb-1.5">Urgency</label>
              <div className="grid grid-cols-4 gap-2">
                {['Critical', 'High', 'Standard', 'Low'].map((u, i) => (
                  <div key={u} className={`py-2 text-center border rounded font-[family-name:var(--font-display)] text-[10px] tracking-wider uppercase cursor-pointer ${
                    i === 0 ? 'border-[#e63946] bg-[rgba(230,57,70,0.12)] text-[#e63946]' : 'border-[rgba(255,255,255,0.05)] text-[#9d8589]'
                  }`}>
                    {i === 0 ? '● ' : ''}{u}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button className="btn-primary flex-1 justify-center text-xs py-2.5">Dispatch Unit</button>
              <button className="btn-ghost py-2.5">Hold</button>
            </div>
          </div>
        </div>

        {/* Incoming + Radar */}
        <div className="space-y-4">
          {/* Incoming Call */}
          <div className="border border-[#e63946] bg-[rgba(193,26,38,0.06)] p-4 rounded">
            <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] text-[#e63946] uppercase mb-2">◢ Incoming Call</div>
            <div className="font-[family-name:var(--font-display)] text-lg tracking-wider uppercase">Diego Ramirez</div>
            <div className="font-[family-name:var(--font-mono)] text-[11px] text-[#9d8589] mt-1">
              PLATE 44KRH02 · CRITICAL · Engine fire reported
            </div>
            <div className="font-[family-name:var(--font-mono)] text-[11px] text-[#9d8589] mt-1">
              📞 INBOUND · 00:24 · Channel 911-OPS
            </div>
            <div className="flex gap-2 mt-4">
              <button className="btn-primary text-xs py-2 px-4">Accept</button>
              <button className="btn-ghost py-2 px-4">Transfer</button>
            </div>
          </div>

          {/* Radar */}
          <div className="panel">
            <div className="panel-head">
              <div className="flex items-center gap-2 font-[family-name:var(--font-display)] text-sm tracking-[0.06em] uppercase">
                <span className="w-2 h-2 rounded-full bg-[#5cd297] animate-pulse" />
                Radar · Active Units
              </div>
              <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[#5a4248]">Live · 1s</div>
            </div>
            <div className="p-4">
              <div className="relative h-[160px] bg-[#0a0608] border border-[rgba(255,255,255,0.05)] rounded overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] border border-[rgba(92,210,151,0.15)] rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px] border border-[rgba(92,210,151,0.1)] rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30px] h-[30px] border border-[rgba(92,210,151,0.08)] rounded-full" />
                <div className="absolute top-1/2 left-1/2 w-[1px] h-[60px] bg-[rgba(92,210,151,0.2)] origin-top animate-[spin_4s_linear_infinite]" />
                <div className="absolute top-[30%] left-[45%] w-2 h-2 bg-[#e63946] rounded-full shadow-[0_0_8px_#e63946]" />
                <div className="absolute top-[55%] left-[55%] w-2 h-2 bg-[#4a90e2] rounded-full shadow-[0_0_8px_#4a90e2]" />
                <div className="absolute top-[40%] left-[35%] w-2 h-2 bg-[#5cd297] rounded-full shadow-[0_0_8px_#5cd297]" />
              </div>
              <div className="flex justify-between mt-3 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.12em] text-[#5a4248] uppercase">
                <span>UNIT 04 · 1.2km</span>
                <span>UNIT 02 · 3.4km</span>
                <span>UNIT 07 · 5.1km</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
