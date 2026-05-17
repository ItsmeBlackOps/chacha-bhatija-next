import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { bookingSchema } from '@/lib/validation'
import { standardLimit, mutationLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') ?? 'anonymous'
    const { success: stdOk } = await standardLimit.limit(ip)
    if (!stdOk) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
    const { success: mutOk } = await mutationLimit.limit(ip)
    if (!mutOk) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await req.json()
    const parsed = bookingSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const data = parsed.data

    const job = await prisma.job.create({
      data: {
        type: data.service,
        urgency: data.urgency,
        plate: data.plate,
        vehicleDesc: data.vehicleModel,
        location: data.location,
        notes: data.notes,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        status: 'PENDING',
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        type: 'JOB_CREATED',
        recordId: job.id,
        description: `Guest booking: ${data.service} for ${data.plate}`,
        actorId: 'system',
        metadata: JSON.stringify({ source: 'landing', urgency: data.urgency }),
      },
    })

    return NextResponse.json({ success: true, jobId: job.id }, { status: 201 })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
