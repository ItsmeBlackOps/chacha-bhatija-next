import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { standardLimit } from '@/lib/rate-limit'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ip = req.headers.get('x-forwarded-for') ?? 'anonymous'
    const { success } = await standardLimit.limit(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') ?? '20')

    const logs = await prisma.activityLog.findMany({
      include: { actor: { select: { name: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100),
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Activity GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
