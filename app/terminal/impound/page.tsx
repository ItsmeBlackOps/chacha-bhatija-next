import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'

export default async function ImpoundPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const impounds = await prisma.impound.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] text-[#5a4248] uppercase mb-1">
          Authorized Holds · Restricted
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-[0.04em] uppercase">
          Impound Yard
        </h1>
        <div className="font-[family-name:var(--font-body)] text-sm text-[#9d8589] mt-1">
          {impounds.filter((i) => i.held && !i.released).length} vehicles held · {impounds.filter((i) => i.released).length} released today · Capacity {impounds.filter((i) => i.held && !i.released).length} / 50
        </div>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 px-4 py-3 border border-[#d18a2c] bg-[rgba(209,138,44,0.06)] rounded mb-4">
        <span className="text-[#d18a2c] mt-0.5">🔒</span>
        <div>
          <div className="font-[family-name:var(--font-display)] text-sm tracking-wider text-[#d18a2c]">Authorization Required</div>
          <div className="font-[family-name:var(--font-body)] text-xs text-[#9d8589] mt-0.5">
            Releases must be co-signed by PD or Manager. Audit trail enforced.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1.4fr_1fr] gap-4">
        <div className="space-y-3">
          {impounds.map((imp) => (
            <div key={imp.id} className={`grid grid-cols-[auto_1fr_auto] gap-4 items-center p-4 border rounded relative overflow-hidden ${
              imp.released ? 'border-[#5cd297]' : 'border-[rgba(255,255,255,0.08)]'
            }`}>
              <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${imp.released ? 'bg-[#5cd297]' : 'bg-[#c11a26]'}`} />
              <div className="w-[90px] h-[60px] bg-gradient-to-br from-[#1a0a0d] to-[#08040a] border border-[rgba(255,255,255,0.05)] rounded grid place-items-center font-[family-name:var(--font-mono)] text-[8px] tracking-[0.15em] text-[#5a4248]">
                VEHICLE
                <br />
                SILHOUETTE
              </div>
              <div>
                <div className="font-[family-name:var(--font-display)] text-base tracking-[0.06em] uppercase">
                  <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider px-2 py-0.5 border border-[rgba(255,255,255,0.08)] rounded mr-2">
                    {imp.plate}
                  </span>
                  {imp.model}
                </div>
                <div className="font-[family-name:var(--font-mono)] text-[11px] tracking-wider text-[#9d8589] mt-1">
                  Owner · {imp.owner} · {imp.authBy} · {imp.date.toLocaleDateString()}
                </div>
              </div>
              <div className={`font-[family-name:var(--font-display)] text-[11px] tracking-[0.22em] uppercase px-2.5 py-1 border rounded ${
                imp.released ? 'border-[#5cd297] text-[#5cd297]' : 'border-[#c11a26] text-[#e63946]'
              }`}>
                {imp.released ? 'Released' : 'Held'}
              </div>
            </div>
          ))}
        </div>

        {/* Release Authorization */}
        <div className="panel">
          <div className="panel-head">
            <div className="flex items-center gap-2 font-[family-name:var(--font-display)] text-sm tracking-[0.06em] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#e63946]" />
              Release Authorization
            </div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[#5a4248]">IMP-0117</div>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <label className="block font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[#9d8589] uppercase mb-1.5">Vehicle</label>
              <input className="field-input" defaultValue="22XKR81 · Bati 801" />
            </div>
            <div>
              <label className="block font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[#9d8589] uppercase mb-1.5">Authorizing Officer</label>
              <input className="field-input" defaultValue="Officer Singh · Badge 4421" />
            </div>
            <div>
              <label className="block font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[#9d8589] uppercase mb-1.5">Reason</label>
              <input className="field-input" defaultValue="Charges dropped · owner cleared" />
            </div>
            <div>
              <label className="block font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[#9d8589] uppercase mb-1.5">Settlement Fee</label>
              <input className="field-input" defaultValue="$2,400" />
            </div>
            <div className="flex gap-2 pt-2">
              <button className="btn-primary flex-1 justify-center text-xs py-2.5">Authorize Release</button>
              <button className="btn-ghost py-2.5">Deny</button>
            </div>

            <div className="mt-4 p-3 border border-[rgba(255,255,255,0.05)] bg-black/30 rounded">
              <div className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.22em] text-[#5a4248] uppercase mb-2">Audit Trail</div>
              <div className="font-[family-name:var(--font-mono)] text-[11px] text-[#9d8589] leading-relaxed space-y-1">
                <div>14:18 · IMP-0117 · created · S. Khanna</div>
                <div>14:22 · plate-scan · 22XKR81</div>
                <div>14:28 · holding-fee · $2,400 · pending</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
