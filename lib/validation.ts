import { z } from 'zod'
import { UserRole, JobType, Urgency, JobStatus } from '@prisma/client'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const bookingSchema = z.object({
  service: z.nativeEnum(JobType),
  urgency: z.nativeEnum(Urgency),
  plate: z.string().min(1, 'Plate is required').max(8),
  vehicleModel: z.string().min(1, 'Vehicle model is required'),
  customerName: z.string().min(1, 'Name is required'),
  customerPhone: z.string().min(7, 'Phone is required'),
  location: z.string().min(1, 'Location is required'),
  notes: z.string().optional(),
})

export const jobUpdateSchema = z.object({
  status: z.nativeEnum(JobStatus).optional(),
  staffId: z.string().optional(),
  amount: z.number().int().optional(),
  paid: z.boolean().optional(),
})

export const impoundSchema = z.object({
  plate: z.string().min(1),
  model: z.string().min(1),
  owner: z.string().min(1),
  authBy: z.string().min(1),
  releaseFee: z.number().int().optional(),
})

export const inventoryUpdateSchema = z.object({
  stock: z.number().int().min(0),
})

export const staffUpdateSchema = z.object({
  onDuty: z.boolean(),
})

export const privateRecordSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  tags: z.array(z.string()).optional(),
})

export const pinSchema = z.object({
  pin: z.string().length(6, 'PIN must be 6 digits').regex(/^\d+$/, 'PIN must be numeric'),
})
