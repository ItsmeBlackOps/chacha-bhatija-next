import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function ReportsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] text-[#5a4248] uppercase mb-1">
          Daily Command Summary
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-[0.04em] uppercase">Reports</h1>
      </div>
      <div className="panel p-12 text-center">
        <div className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.3em] text-[#5a4248] uppercase">Module preview</div>
        <div className="font-[family-name:var(--font-display)] text-2xl tracking-[0.06em] uppercase mt-3">Reports</div>
        <div className="text-[#9d8589] mt-3 max-w-md mx-auto">Daily, weekly, and monthly operational reports with KPI tracking.</div>
      </div>
    </div>
  )
}
