import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] text-[#5a4248] uppercase mb-1">
          System Control Panel
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-[0.04em] uppercase">Settings</h1>
      </div>
      <div className="panel p-12 text-center">
        <div className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.3em] text-[#5a4248] uppercase">Owner Only</div>
        <div className="font-[family-name:var(--font-display)] text-2xl tracking-[0.06em] uppercase mt-3">Settings</div>
        <div className="text-[#9d8589] mt-3 max-w-md mx-auto">System configuration, user management, and global preferences.</div>
      </div>
    </div>
  )
}
