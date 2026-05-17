import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { impoundSchema } from '@/lib/validation'
import { standardLimit, mutationLimit } from '@/lib/rate-limit'

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

    const impounds = await prisma.impound.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(impounds)
  } catch (error) {
    console.error('Impounds GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || !['OWNER', 'MANAGER'].includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const ip = req.headers.get('x-forwarded-for') ?? 'anonymous'
    const { success } = await mutationLimit.limit(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await req.json()
    const parsed = impoundSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const impound = await prisma.impound.create({ data: parsed.data })

    await prisma.activityLog.create({
      data: {
        type: 'IMPOUND_CREATED',
        recordId: impound.id,
        description: `Vehicle ${impound.plate} impounded`,
        actorId: session.user.id as string,
      },
    })

    return NextResponse.json(impound, { status: 201 })
  } catch (error) {
    console.error('Impounds POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
