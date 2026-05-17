import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { inventoryUpdateSchema } from '@/lib/validation'
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

    const items = await prisma.inventory.findMany({ orderBy: { stock: 'asc' } })
    return NextResponse.json(items)
  } catch (error) {
    console.error('Inventory GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
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
    const parsed = inventoryUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { id, ...updateData } = body

    const item = await prisma.inventory.update({
      where: { id },
      data: updateData,
    })

    await prisma.activityLog.create({
      data: {
        type: 'INVENTORY_UPDATED',
        recordId: item.id,
        description: `Inventory ${item.sku} updated`,
        actorId: session.user.id as string,
        metadata: JSON.stringify(updateData),
      },
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Inventory PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
