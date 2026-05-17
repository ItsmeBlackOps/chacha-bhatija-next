import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/terminal/sidebar'
import Topbar from '@/components/terminal/topbar'

export default async function TerminalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#050207]">
      <Sidebar userRole={session.user.role as string} />
      <Topbar
        user={{
          name: session.user.name ?? 'User',
          role: session.user.role as string,
          badge: (session.user as { badge?: string | null }).badge ?? null,
        }}
      />
      <main className="ml-[220px] pt-[52px] min-h-screen">
        {children}
      </main>
    </div>
  )
}
