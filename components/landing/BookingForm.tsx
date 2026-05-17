'use client'

import { useState } from 'react'
enum JobType {
  REPAIR = 'REPAIR',
  TOW = 'TOW',
  IMPOUND = 'IMPOUND',
  WASH = 'WASH',
  ROADSIDE = 'ROADSIDE',
}

enum Urgency {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  STANDARD = 'STANDARD',
  LOW = 'LOW',
}

const SERVICES = [
  { type: JobType.REPAIR, name: 'Repair', meta: 'Mechanical · Electrical', icon: '🔧' },
  { type: JobType.TOW, name: 'Tow', meta: 'Roadside · Recovery', icon: '🚛' },
  { type: JobType.IMPOUND, name: 'Impound', meta: 'Release · Inquiry', icon: '🔒' },
  { type: JobType.WASH, name: 'Detail', meta: 'Wash · Wax · Coat', icon: '💧' },
]

const URGENCY_LEVELS = [
  { type: Urgency.CRITICAL, label: 'Critical · Now', color: 'red' },
  { type: Urgency.HIGH, label: 'High · < 1h', color: 'amber' },
  { type: Urgency.STANDARD, label: 'Standard · Today', color: 'blue' },
]

export function BookingForm() {
  const [step, setStep] = useState(1)
  const [service, setService] = useState<JobType | null>(null)
  const [urgency, setUrgency] = useState<Urgency>(Urgency.STANDARD)
  const [formData, setFormData] = useState({
    plate: '',
    vehicleModel: '',
    customerName: '',
    customerPhone: '',
    location: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [jobId, setJobId] = useState('')

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!service) return
    setSubmitting(true)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service,
          urgency,
          ...formData,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setJobId(data.jobId)
        setSubmitted(true)
        setStep(4)
      }
    } catch (err) {
      console.error('Booking failed:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setStep(1)
    setService(null)
    setUrgency(Urgency.STANDARD)
    setFormData({ plate: '', vehicleModel: '', customerName: '', customerPhone: '', location: '', notes: '' })
    setSubmitted(false)
    setJobId('')
  }

  return (
    <div className="w-full max-w-2xl mx-auto border border-[rgba(255,255,255,0.08)] bg-[rgba(8,3,6,0.72)] backdrop-blur-xl rounded p-6 md:p-8 relative">
      {/* Subtle red border glow */}
      <div className="absolute inset-0 border border-[#e63946] rounded opacity-20 pointer-events-none" />

      {/* Steps */}
      <div className="grid grid-cols-4 gap-2 mb-7">
        {[
          { num: '1', label: 'Service' },
          { num: '2', label: 'Vehicle' },
          { num: '3', label: 'Location' },
          { num: '✓', label: 'Confirm' },
        ].map((s, i) => {
          const stepNum = i + 1
          const isActive = step === stepNum
          const isDone = step > stepNum || (submitted && stepNum === 4)
          return (
            <div
              key={i}
              className={`flex items-center gap-2 px-3 py-2.5 border rounded text-[9px] font-[family-name:var(--font-mono)] tracking-[0.22em] uppercase transition-all ${
                isActive
                  ? 'border-[#c11a26] bg-[rgba(193,26,38,0.12)] text-[#e8e0e2]'
                  : isDone
                  ? 'border-[#5cd297] text-[#5cd297] bg-[rgba(92,210,151,0.08)]'
                  : 'border-[rgba(255,255,255,0.05)] bg-black/30 text-[#5a4248]'
              }`}
            >
              <span
                className={`w-[18px] h-[18px] rounded-full grid place-items-center text-[10px] flex-shrink-0 ${
                  isActive
                    ? 'bg-[#c11a26] border border-[#e63946] text-white shadow-[0_0_12px_rgba(230,57,70,0.35)]'
                    : isDone
                    ? 'bg-[#5cd297] border border-[#5cd297] text-[#0c2a1b]'
                    : 'bg-black/50 border border-[rgba(255,255,255,0.05)]'
                }`}
              >
                {isDone && stepNum !== 4 ? '✓' : s.num}
              </span>
              {s.label}
            </div>
          )
        })}
      </div>

      {/* Step 1: Service */}
      {step === 1 && (
        <div className="animate-[fade-in_350ms_ease-out]">
          <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[#9d8589] uppercase mb-3">
            What do you need?
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {SERVICES.map((svc) => (
              <button
                key={svc.type}
                onClick={() => setService(svc.type)}
                className={`border rounded p-4 text-center cursor-pointer transition-all hover:-translate-y-0.5 ${
                  service === svc.type
                    ? 'border-[#e63946] bg-[rgba(193,26,38,0.14)] shadow-[0_0_18px_rgba(230,57,70,0.2)]'
                    : 'border-[rgba(255,255,255,0.05)] bg-black/35 hover:border-[rgba(255,255,255,0.14)] hover:bg-[rgba(193,26,38,0.06)]'
                }`}
              >
                <div className="text-2xl mb-2">{svc.icon}</div>
                <div className="font-[family-name:var(--font-display)] text-base tracking-[0.1em] uppercase">{svc.name}</div>
                <div className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.22em] text-[#5a4248] uppercase mt-1">
                  {svc.meta}
                </div>
              </button>
            ))}
          </div>

          <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[#9d8589] uppercase mb-3">
            How urgent?
          </div>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {URGENCY_LEVELS.map((u) => (
              <button
                key={u.type}
                onClick={() => setUrgency(u.type)}
                className={`py-3 border rounded text-center cursor-pointer font-[family-name:var(--font-display)] text-xs tracking-[0.18em] uppercase transition-all ${
                  urgency === u.type
                    ? u.color === 'red'
                      ? 'border-[#e63946] bg-[rgba(230,57,70,0.16)] text-[#e63946] shadow-[0_0_12px_rgba(230,57,70,0.2)]'
                      : u.color === 'amber'
                      ? 'border-[#d18a2c] bg-[rgba(209,138,44,0.12)] text-[#d18a2c]'
                      : 'border-[#4a90e2] bg-[rgba(74,144,226,0.12)] text-[#4a90e2]'
                    : 'border-[rgba(255,255,255,0.05)] bg-black/30 text-[#9d8589] hover:border-[rgba(255,255,255,0.14)]'
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center pt-5 border-t border-[rgba(255,255,255,0.05)]">
            <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-wider text-[#9d8589]">
              {service ? `${SERVICES.find((s) => s.type === service)?.name} selected` : 'Select a service to continue'}
            </span>
            <button
              onClick={() => setStep(2)}
              disabled={!service}
              className="btn-primary text-xs py-2.5 px-5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Vehicle */}
      {step === 2 && (
        <div className="animate-[fade-in_350ms_ease-out]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[#9d8589] uppercase mb-2">
                Plate
              </label>
              <input
                className="field-input"
                placeholder="22XKR81"
                maxLength={8}
                value={formData.plate}
                onChange={(e) => updateField('plate', e.target.value)}
              />
            </div>
            <div>
              <label className="block font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[#9d8589] uppercase mb-2">
                Vehicle Model
              </label>
              <input
                className="field-input"
                placeholder="Sultan RS · Red"
                value={formData.vehicleModel}
                onChange={(e) => updateField('vehicleModel', e.target.value)}
              />
            </div>
            <div>
              <label className="block font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[#9d8589] uppercase mb-2">
                Your Name
              </label>
              <input
                className="field-input"
                placeholder="Diego Ramirez"
                value={formData.customerName}
                onChange={(e) => updateField('customerName', e.target.value)}
              />
            </div>
            <div>
              <label className="block font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[#9d8589] uppercase mb-2">
                Phone
              </label>
              <input
                className="field-input"
                placeholder="555-040-2299"
                inputMode="tel"
                value={formData.customerPhone}
                onChange={(e) => updateField('customerPhone', e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-5 border-t border-[rgba(255,255,255,0.05)]">
            <button onClick={() => setStep(1)} className="btn-ghost">
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!formData.plate || !formData.vehicleModel || !formData.customerName || !formData.customerPhone}
              className="btn-primary text-xs py-2.5 px-5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Location */}
      {step === 3 && (
        <div className="animate-[fade-in_350ms_ease-out]">
          <div className="mb-4">
            <label className="block font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[#9d8589] uppercase mb-2">
              Where are you?
            </label>
            <input
              className="field-input"
              placeholder="Vespucci Blvd & Dudley Ave"
              value={formData.location}
              onChange={(e) => updateField('location', e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[#9d8589] uppercase mb-2">
              What's happening? (optional)
            </label>
            <textarea
              className="field-input min-h-[80px] resize-y font-[family-name:var(--font-body)] text-[13px]"
              placeholder="Smoke from hood, won't start after the crash..."
              value={formData.notes}
              onChange={(e) => updateField('notes', e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center pt-5 border-t border-[rgba(255,255,255,0.05)]">
            <button onClick={() => setStep(2)} className="btn-ghost">
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!formData.location || submitting}
              className="btn-primary text-xs py-2.5 px-5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? 'Dispatching...' : 'Dispatch Unit →'}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && submitted && (
        <div className="text-center py-8 animate-[fade-in_350ms_ease-out]">
          <div className="relative w-20 h-20 mx-auto mb-5">
            <div className="absolute inset-0 rounded-full bg-[rgba(92,210,151,0.1)] border border-[#5cd297] grid place-items-center shadow-[0_0_32px_rgba(92,210,151,0.4)]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5cd297" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="absolute inset-[-8px] rounded-full border border-[#5cd297] opacity-40 animate-[ping_1.6s_ease-out_infinite]" />
          </div>

          <div className="font-[family-name:var(--font-mono)] text-[13px] tracking-[0.32em] text-[#e63946] mb-2">
            {jobId || 'REQ-78421'}
          </div>
          <h3 className="font-[family-name:var(--font-display)] text-[clamp(28px,4vw,42px)] tracking-[0.04em] uppercase">
            Unit dispatched
          </h3>
          <p className="text-sm text-[#9d8589] mt-4 max-w-md mx-auto leading-relaxed">
            A driver is on the way and will call you within <span className="text-[#e8e0e2] font-medium">2 minutes</span> to confirm.
            Save your request ID — that's all you need to check in when we arrive.
          </p>

          <div className="inline-flex items-center gap-3 mt-6 px-5 py-3 border border-[#c11a26] bg-[rgba(193,26,38,0.1)] rounded font-[family-name:var(--font-display)] text-sm tracking-[0.22em] uppercase">
            ETA <span className="text-xl text-[#e63946]">06:42</span>
          </div>

          <div className="flex justify-center gap-3 mt-7">
            <button onClick={reset} className="btn-ghost">
              Book Another
            </button>
            <a href="/terminal/dashboard" className="btn-ghost">
              View in Terminal ↗
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
