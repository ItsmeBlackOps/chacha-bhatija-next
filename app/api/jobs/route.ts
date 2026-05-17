import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { jobUpdateSchema } from '@/lib/validation'
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

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (type) where.type = type

    const jobs = await prisma.job.findMany({
      where,
      include: { staff: { include: { user: true } }, payments: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Jobs GET error:', error)
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
    const parsed = jobUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { id, ...updateData } = body

    const job = await prisma.job.update({
      where: { id },
      data: updateData,
    })

    await prisma.activityLog.create({
      data: {
        type: 'JOB_UPDATED',
        recordId: job.id,
        description: `Job ${job.id} updated`,
        actorId: session.user.id as string,
        metadata: JSON.stringify(updateData),
      },
    })

    return NextResponse.json(job)
  } catch (error) {
    console.error('Jobs PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
