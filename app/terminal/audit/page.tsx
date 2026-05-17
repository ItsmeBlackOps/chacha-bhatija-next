import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function AuditPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const logs = await prisma.activityLog.findMany({
    include: { actor: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] text-[#5a4248] uppercase mb-1">
          Restricted · Security Log
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-[0.04em] uppercase">Audit Log</h1>
      </div>

      <div className="panel overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.05)] text-left">
              {['Time', 'Type', 'Record', 'Description', 'Actor'].map((h) => (
                <th key={h} className="px-4 py-3 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[#5a4248] uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-[rgba(255,255,255,0.03)]">
                <td className="px-4 py-3 font-[family-name:var(--font-mono)] text-[10px] text-[#5a4248]">
                  {log.createdAt.toLocaleTimeString()}
                </td>
                <td className="px-4 py-3">
                  <span className="tag tag-repair">{log.type}</span>
                </td>
                <td className="px-4 py-3 font-[family-name:var(--font-mono)] text-[10px] text-[#e63946]">
                  {log.recordId?.slice(0, 12) ?? '—'}
                </td>
                <td className="px-4 py-3 text-sm text-[#e8e0e2]">{log.description}</td>
                <td className="px-4 py-3 font-[family-name:var(--font-mono)] text-[11px] text-[#9d8589]">
                  {log.actor.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
