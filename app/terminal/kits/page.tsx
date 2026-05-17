import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'

export default async function KitsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const kits = await prisma.inventory.findMany({ orderBy: { stock: 'asc' } })
  const lowStock = kits.filter((k) => k.stock <= k.lowThreshold)

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] text-[#5a4248] uppercase mb-1">
          Parts Inventory Station
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-[0.04em] uppercase">
          Repair Kits
        </h1>
        <div className="font-[family-name:var(--font-body)] text-sm text-[#9d8589] mt-1">
          {kits.length} SKUs tracked · {lowStock.length} low-stock alerts · {formatCurrency(kits.reduce((acc, k) => acc + k.stock * k.cost, 0))} inventory value
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="flex items-start gap-3 px-4 py-3 border border-[#d18a2c] bg-[rgba(209,138,44,0.06)] rounded mb-4">
          <span className="text-[#d18a2c] mt-0.5">📦</span>
          <div>
            <div className="font-[family-name:var(--font-display)] text-sm tracking-wider text-[#d18a2c]">Restock Needed</div>
            <div className="font-[family-name:var(--font-body)] text-xs text-[#9d8589] mt-0.5">
              {lowStock.map((k) => `${k.name} (${k.stock}/${k.maxStock})`).join(' · ')}. Manager approval required to adjust.
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kits.map((kit) => {
          const isLow = kit.stock <= kit.lowThreshold
          const pct = Math.min(100, (kit.stock / kit.maxStock) * 100)
          return (
            <div key={kit.id} className={`border rounded p-4 relative overflow-hidden ${
              isLow ? 'border-[#c11a26]' : 'border-[rgba(255,255,255,0.08)]'
            }`}>
              {isLow && (
                <div className="absolute top-3 right-3 font-[family-name:var(--font-mono)] text-[9px] tracking-[0.2em] text-[#e63946] bg-[rgba(193,26,38,0.15)] border border-[#c11a26] px-1.5 py-0.5">
                  LOW STOCK
                </div>
              )}
              <div className="font-[family-name:var(--font-display)] text-base tracking-[0.08em] uppercase">{kit.name}</div>
              <div className="font-[family-name:var(--font-mono)] text-[10px] text-[#5a4248] tracking-[0.12em] mt-0.5">{kit.sku}</div>

              <div className="mt-3.5 h-1.5 bg-black/50 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${isLow ? 'bg-gradient-to-r from-[#e63946] to-[#c11a26]' : 'bg-gradient-to-r from-[#5cd297] to-[#2c9c63]'} shadow-[0_0_8px_${isLow ? 'rgba(230,57,70,0.3)' : 'rgba(92,210,151,0.3)'}]`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex justify-between mt-2 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.12em] text-[#9d8589]">
                <span>Stock: <span className="text-[#e8e0e2]">{kit.stock} / {kit.maxStock}</span></span>
                <span>Cost: <span className="text-[#e8e0e2]">{formatCurrency(kit.cost)}</span> · Sell: <span className="text-[#e8e0e2]">{formatCurrency(kit.sell)}</span></span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
