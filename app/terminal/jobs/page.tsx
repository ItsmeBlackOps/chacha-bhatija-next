import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'

export default async function JobsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const jobs = await prisma.job.findMany({
    include: { staff: { include: { user: true } }, payments: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const typeClass: Record<string, string> = {
    REPAIR: 'tag-repair',
    TOW: 'tag-tow',
    IMPOUND: 'tag-impound',
    WASH: 'tag-wash',
    ROADSIDE: 'tag-tow',
  }

  const typeLabel: Record<string, string> = {
    REPAIR: 'repair',
    TOW: 'tow',
    IMPOUND: 'impound',
    WASH: 'wash',
    ROADSIDE: 'roadside',
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] text-[#5a4248] uppercase mb-1">
          Service Bay Board
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-[0.04em] uppercase">
          Active Jobs
        </h1>
        <div className="font-[family-name:var(--font-body)] text-sm text-[#9d8589] mt-1">
          {jobs.length} visible · {jobs.filter((j) => ['PENDING', 'EN_ROUTE', 'IN_PROGRESS'].includes(j.status)).length} in progress · {jobs.filter((j) => !j.paid && j.amount).length} awaiting payment
        </div>
      </div>

      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.05)] text-left">
              {['Record', 'Type', 'Description', 'Plate', 'Status', 'Assigned', 'Amount'].map((h) => (
                <th key={h} className="px-4 py-3 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[#5a4248] uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                <td className="px-4 py-3">
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-[#e63946]">{job.id.slice(0, 12)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`tag ${typeClass[job.type]}`}>{typeLabel[job.type]}</span>
                </td>
                <td className="px-4 py-3 text-sm text-[#e8e0e2]">{job.vehicleDesc || job.notes || '—'}</td>
                <td className="px-4 py-3">
                  {job.plate ? (
                    <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider px-2 py-0.5 border border-[rgba(255,255,255,0.08)] rounded">
                      {job.plate}
                    </span>
                  ) : (
                    <span className="font-[family-name:var(--font-mono)] text-[10px] text-[#5a4248]">—</span>
                  )}
                </td>
                <td className="px-4 py-3 font-[family-name:var(--font-mono)] text-[11px] text-[#9d8589]">{job.status}</td>
                <td className="px-4 py-3">
                  {job.staff ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#c11a26] to-[#6b0f15] grid place-items-center font-[family-name:var(--font-display)] text-[9px] font-bold text-white">
                        {job.staff.user.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <span className="text-sm text-[#e8e0e2]">{job.staff.user.name}</span>
                    </div>
                  ) : (
                    <span className="font-[family-name:var(--font-mono)] text-[10px] text-[#5a4248]">Unassigned</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {job.amount ? (
                    <span className={`font-[family-name:var(--font-mono)] text-sm ${job.paid ? 'text-[#5cd297]' : 'text-[#d18a2c]'}`}>
                      {formatCurrency(job.amount)}
                    </span>
                  ) : (
                    <span className="font-[family-name:var(--font-mono)] text-[10px] text-[#5a4248]">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
