import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { staffUpdateSchema } from '@/lib/validation'
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

    const staff = await prisma.staff.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(staff)
  } catch (error) {
    console.error('Staff GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ip = req.headers.get('x-forwarded-for') ?? 'anonymous'
    const { success } = await mutationLimit.limit(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await req.json()
    const parsed = staffUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { id, ...updateData } = body

    const staff = await prisma.staff.update({
      where: { id },
      data: updateData,
    })

    await prisma.activityLog.create({
      data: {
        type: 'STAFF_UPDATED',
        recordId: staff.id,
        description: `Staff ${staff.badge} status updated`,
        actorId: session.user.id as string,
        metadata: JSON.stringify(updateData),
      },
    })

    return NextResponse.json(staff)
  } catch (error) {
    console.error('Staff PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
