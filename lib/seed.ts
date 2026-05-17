import { PrismaClient, UserRole } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Seed owner
  const ownerPassword = await hash('owner123', 12)
  const owner = await prisma.user.upsert({
    where: { email: 'skhanna@chacha.local' },
    update: {},
    create: {
      email: 'skhanna@chacha.local',
      passwordHash: ownerPassword,
      role: UserRole.OWNER,
      name: 'S. Khanna',
      phone: '555-010-0001',
    },
  })

  await prisma.staff.upsert({
    where: { userId: owner.id },
    update: {},
    create: {
      userId: owner.id,
      badge: 'CB-001',
      role: UserRole.OWNER,
      unit: 'HQ',
      onDuty: true,
    },
  })

  // Seed manager
  const managerPassword = await hash('manager123', 12)
  const manager = await prisma.user.upsert({
    where: { email: 'amehta@chacha.local' },
    update: {},
    create: {
      email: 'amehta@chacha.local',
      passwordHash: managerPassword,
      role: UserRole.MANAGER,
      name: 'A. Mehta',
      phone: '555-010-0002',
    },
  })

  await prisma.staff.upsert({
    where: { userId: manager.id },
    update: {},
    create: {
      userId: manager.id,
      badge: 'CB-002',
      role: UserRole.MANAGER,
      unit: 'Bay 03',
      onDuty: true,
    },
  })

  // Seed dispatcher
  const dispatchPassword = await hash('dispatch123', 12)
  const dispatcher = await prisma.user.upsert({
    where: { email: 'rchowdhury@chacha.local' },
    update: {},
    create: {
      email: 'rchowdhury@chacha.local',
      passwordHash: dispatchPassword,
      role: UserRole.DISPATCHER,
      name: 'R. Chowdhury',
      phone: '555-010-0003',
    },
  })

  await prisma.staff.upsert({
    where: { userId: dispatcher.id },
    update: {},
    create: {
      userId: dispatcher.id,
      badge: 'CB-003',
      role: UserRole.DISPATCHER,
      unit: 'Unit 04',
      onDuty: true,
    },
  })

  // Seed mechanics
  const mechPassword = await hash('mechanic123', 12)
  const vIyer = await prisma.user.upsert({
    where: { email: 'viyer@chacha.local' },
    update: {},
    create: {
      email: 'viyer@chacha.local',
      passwordHash: mechPassword,
      role: UserRole.MECHANIC,
      name: 'V. Iyer',
      phone: '555-010-0004',
    },
  })

  await prisma.staff.upsert({
    where: { userId: vIyer.id },
    update: {},
    create: {
      userId: vIyer.id,
      badge: 'CB-004',
      role: UserRole.MECHANIC,
      unit: 'Bay 02',
      onDuty: false,
    },
  })

  const nJoshi = await prisma.user.upsert({
    where: { email: 'njoshi@chacha.local' },
    update: {},
    create: {
      email: 'njoshi@chacha.local',
      passwordHash: mechPassword,
      role: UserRole.TOW_DRIVER,
      name: 'N. Joshi',
      phone: '555-010-0005',
    },
  })

  await prisma.staff.upsert({
    where: { userId: nJoshi.id },
    update: {},
    create: {
      userId: nJoshi.id,
      badge: 'CB-005',
      role: UserRole.TOW_DRIVER,
      unit: 'Unit 07',
      onDuty: true,
    },
  })

  // Seed inventory
  const inventoryItems = [
    { sku: 'KIT-BS01', name: 'Basic Kit', stock: 28, maxStock: 50, cost: 4500, sell: 12000, lowThreshold: 10 },
    { sku: 'KIT-AD12', name: 'Advanced Kit', stock: 2, maxStock: 20, cost: 18000, sell: 42000, lowThreshold: 5 },
    { sku: 'KIT-EM07', name: 'Engine Mod', stock: 8, maxStock: 15, cost: 32000, sell: 78000, lowThreshold: 3 },
    { sku: 'KIT-CH04', name: 'Tow Chain', stock: 4, maxStock: 15, cost: 8000, sell: 20000, lowThreshold: 5 },
    { sku: 'KIT-WX02', name: 'Wax & Polish', stock: 22, maxStock: 30, cost: 2500, sell: 8000, lowThreshold: 8 },
    { sku: 'KIT-NX09', name: 'Nitro Refill', stock: 12, maxStock: 20, cost: 14000, sell: 36000, lowThreshold: 5 },
  ]

  for (const item of inventoryItems) {
    await prisma.inventory.upsert({
      where: { sku: item.sku },
      update: {},
      create: item,
    })
  }

  // Seed sample jobs
  const jobs = [
    { type: 'REPAIR' as const, urgency: 'STANDARD' as const, status: 'IN_PROGRESS' as const, plate: '12AKR81', vehicleDesc: 'Sultan RS · Silver', location: 'Bay 03', customerName: 'M. Cortez', customerPhone: '555-040-1101', amount: 125000, paid: false },
    { type: 'TOW' as const, urgency: 'HIGH' as const, status: 'EN_ROUTE' as const, plate: '22XKR81', vehicleDesc: 'Bati 801 · Black', location: 'Vespucci Beach', customerName: 'D. Mendez', customerPhone: '555-040-2202', amount: 64000, paid: false },
    { type: 'WASH' as const, urgency: 'STANDARD' as const, status: 'COMPLETE' as const, plate: '88KFR04', vehicleDesc: 'Elegy RH8 · White', location: 'Bay 02', customerName: 'L. Park', customerPhone: '555-040-3303', amount: 18000, paid: true },
    { type: 'IMPOUND' as const, urgency: 'CRITICAL' as const, status: 'HOLDING' as const, plate: '44KRH02', vehicleDesc: 'Sultan RS · Red', location: 'Impound Yard', customerName: 'Unknown', customerPhone: '—', amount: 240000, paid: false },
    { type: 'REPAIR' as const, urgency: 'STANDARD' as const, status: 'COMPLETE' as const, plate: '21BLK14', vehicleDesc: 'Buffalo S · Black', location: 'Bay 01', customerName: 'P. Khan', customerPhone: '555-040-4404', amount: 385000, paid: true },
  ]

  for (const job of jobs) {
    await prisma.job.create({ data: job })
  }

  // Seed impounds
  const impounds = [
    { plate: '22XKR81', model: 'Bati 801 · Black', owner: 'D. Mendez', authBy: 'PD · Officer Singh', held: true, released: false, releaseFee: 240000, auditTrail: JSON.stringify([{ time: '14:18', action: 'created', actor: 'S. Khanna' }, { time: '14:22', action: 'plate-scan', actor: 'system' }]) },
    { plate: '44KRH02', model: 'Sultan RS · Red', owner: 'L. Park', authBy: 'Manager auth', held: true, released: false, releaseFee: 240000, auditTrail: JSON.stringify([{ time: '11:02', action: 'created', actor: 'A. Mehta' }]) },
    { plate: '17PYR21', model: 'Elegy Retro · White', owner: 'M. Cortez', authBy: 'PD · Officer Sharma', held: true, released: false, releaseFee: 180000, auditTrail: JSON.stringify([{ time: 'Yesterday', action: 'created', actor: 'R. Chowdhury' }]) },
    { plate: '08RBT19', model: 'Buffalo S · Silver', owner: 'P. Khan', authBy: 'PD release', held: false, released: true, releaseFee: 120000, auditTrail: JSON.stringify([{ time: '2 days ago', action: 'released', actor: 'S. Khanna' }]) },
  ]

  for (const impound of impounds) {
    await prisma.impound.create({ data: impound })
  }

  console.log('Seed complete!')
  console.log('Owner login: skhanna@chacha.local / owner123')
  console.log('Manager login: amehta@chacha.local / manager123')
  console.log('Dispatcher login: rchowdhury@chacha.local / dispatch123')
  console.log('Mechanic login: viyer@chacha.local / mechanic123')
  console.log('Tow driver login: njoshi@chacha.local / mechanic123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
