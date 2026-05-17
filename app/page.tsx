'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { LandingScene } from '@/components/three/LandingScene'
import { BookingForm } from '@/components/landing/BookingForm'

const CHAPTERS = [
  { id: 'hero', label: 'Intro', num: '00 / 07' },
  { id: 'dispatch', label: 'Dispatch', num: '01 / 07' },
  { id: 'repair', label: 'Repair', num: '02 / 07' },
  { id: 'tow', label: 'Tow', num: '03 / 07' },
  { id: 'impound', label: 'Impound', num: '04 / 07' },
  { id: 'wash', label: 'Detail', num: '05 / 07' },
  { id: 'network', label: 'Network', num: '06 / 07' },
]

const SERVICES = [
  { icon: 'radio', num: '01', title: 'Dispatch', desc: 'Live operator 24/7 — voice or text' },
  { icon: 'wrench', num: '02', title: 'Mechanic', desc: 'Roadside or full-shop repair' },
  { icon: 'truck', num: '03', title: 'Tow', desc: 'Flatbed and recovery anywhere' },
  { icon: 'shield', num: '04', title: 'Impound', desc: 'PD-certified secure custody' },
]

export default function LandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeChapter, setActiveChapter] = useState(0)
  const [hudTime, setHudTime] = useState('')
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollEl = document.scrollingElement || document.documentElement
      const max = scrollEl.scrollHeight - scrollEl.clientHeight
      const p = max > 0 ? scrollEl.scrollTop / max : 0
      setScrollProgress(p)

      const mid = scrollEl.scrollTop + window.innerHeight * 0.4
      const chapters = document.querySelectorAll('.chapter')
      let activeIdx = 0
      chapters.forEach((c, i) => {
        if ((c as HTMLElement).offsetTop <= mid) activeIdx = i
      })
      setActiveChapter(activeIdx)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      setHudTime(
        `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
      )
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <LandingScene scrollProgress={scrollProgress} />
      </div>

      {/* Vignette */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 35%, transparent 25%, rgba(6, 3, 6, 0.55) 70%, #060306 100%), linear-gradient(180deg, rgba(6,3,6,0.4) 0%, transparent 25%, transparent 70%, rgba(6,3,6,0.65) 100%)',
        }}
      />

      {/* Scanlines */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none opacity-[0.06] mix-blend-screen"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(230, 57, 70, 0.2) 2px, rgba(230, 57, 70, 0.2) 3px)',
        }}
      />

      {/* Corners */}
      <div className="fixed top-6 left-6 w-12 h-12 border-l border-t border-[rgba(255,255,255,0.1)] z-20 pointer-events-none" />
      <div className="fixed top-6 right-6 w-12 h-12 border-r border-t border-[rgba(255,255,255,0.1)] z-20 pointer-events-none" />
      <div className="fixed bottom-6 left-6 w-12 h-12 border-l border-b border-[rgba(255,255,255,0.1)] z-20 pointer-events-none" />
      <div className="fixed bottom-6 right-6 w-12 h-12 border-r border-b border-[rgba(255,255,255,0.1)] z-20 pointer-events-none" />

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-8 py-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-[#c11a26] to-[#6b0f15] flex items-center justify-center text-white font-[family-name:var(--font-display)] text-base font-bold">
            CB
          </div>
          <div>
            <div className="font-[family-name:var(--font-display)] text-sm tracking-[0.2em] uppercase">Chacha Bhatija</div>
            <div className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.3em] text-[#5a4248] uppercase">
              Emergency Garage · v2.4
            </div>
          </div>
        </Link>
        <nav className="flex items-center gap-6">
          <a href="#what" className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.2em] text-[#9d8589] uppercase hover:text-[#e8e0e2] transition-colors">
            Services
          </a>
          <a href="#network" className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.2em] text-[#9d8589] uppercase hover:text-[#e8e0e2] transition-colors">
            Coverage
          </a>
          <Link
            href="/terminal/dashboard"
            className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.2em] text-[#9d8589] uppercase hover:text-[#e8e0e2] transition-colors hidden md:block"
          >
            Operations Terminal ↗
          </Link>
          <a href="#book" className="btn-primary text-xs py-2.5 px-5">
            Book Now
          </a>
        </nav>
      </header>

      {/* Scroll Rail */}
      <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-3">
        {CHAPTERS.map((ch, i) => (
          <a
            key={ch.id}
            href={`#${ch.id}`}
            className={`flex items-center gap-3 group transition-all duration-300 ${activeChapter === i ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
          >
            <span
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeChapter === i ? 'bg-[#e63946] shadow-[0_0_8px_#e63946]' : 'bg-[#5a4248]'
              }`}
            />
            <span
              className={`font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] uppercase transition-all duration-300 ${
                activeChapter === i ? 'text-[#e8e0e2] translate-x-0' : 'text-[#5a4248] -translate-x-1 group-hover:translate-x-0'
              }`}
            >
              {ch.label}
            </span>
          </a>
        ))}
      </nav>

      {/* Bottom HUD */}
      <div className="fixed bottom-0 left-0 right-0 z-20 flex items-center px-6 py-3 border-t border-[rgba(255,255,255,0.05)] bg-gradient-to-t from-[#050207] to-transparent">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5cd297] animate-pulse" />
          <span className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.2em] text-[#5a4248] uppercase hidden sm:inline">
            CBC-TERM-04 · NODE LS-SOUTH
          </span>
        </div>
        <div className="flex-1 mx-4 h-[3px] bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#c11a26] to-[#e63946] rounded-full transition-all duration-100"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
        <div className="font-[family-name:var(--font-display)] text-sm tracking-[0.18em] text-[#e63946]">
          {hudTime}
        </div>
      </div>

      {/* Main Content */}
      <main ref={mainRef} className="relative z-10">
        {/* Hero */}
        <section className="chapter min-h-screen flex flex-col justify-center px-8 md:px-16 pt-24" id="hero">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 border border-[rgba(255,255,255,0.08)] bg-black/40 rounded-full font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[#9d8589] uppercase mb-6">
              No login required · Book as guest
            </div>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-9 h-[1px] bg-[#e63946] shadow-[0_0_6px_#e63946]" />
              <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.4em] text-[#9d8589] uppercase">
                One Call. We're There.
              </span>
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(48px,8vw,96px)] font-bold tracking-[0.04em] leading-[0.95] uppercase">
              CHACHA
              <br />
              <span className="text-[#e63946]" style={{ textShadow: '0 0 24px rgba(230, 57, 70, 0.35)' }}>
                BHATIJA
              </span>
            </h1>
            <p className="font-[family-name:var(--font-display)] text-lg md:text-xl tracking-[0.35em] uppercase text-[#e8e0e2] mt-4">
              ◢ Mechanic · Tow · Impound · Roadside
            </p>
            <div className="flex items-center gap-4 mt-10">
              <a href="#book" className="btn-primary">
                Book a Service
              </a>
              <a href="#dispatch" className="btn-ghost">
                Scroll to Tour
              </a>
            </div>
          </div>

          {/* Status Chips */}
          <div className="absolute bottom-20 left-8 md:left-16 right-8 md:right-16 flex flex-wrap gap-2.5">
            {[
              { dot: 'bg-[#5cd297]', text: 'Dispatch Ready' },
              { dot: 'bg-[#4a90e2]', text: 'Garage Online' },
              { dot: 'bg-[#d18a2c]', text: 'Tow Unit Standby' },
              { dot: 'bg-[#e63946]', text: '3 Impounds Active' },
              { dot: 'bg-[#5cd297]', text: 'City-Wide Roadside' },
              { dot: 'bg-[#4a90e2]', text: '24/7 · 365' },
            ].map((chip, i) => (
              <div key={i} className="chip">
                <span className={`w-1.5 h-1.5 rounded-full ${chip.dot}`} />
                {chip.text}
              </div>
            ))}
          </div>
        </section>

        {/* Dispatch Chapter */}
        <section className="chapter min-h-screen flex flex-col justify-center items-end px-8 md:px-16" id="dispatch">
          <div className="max-w-lg text-right">
            <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] text-[#e63946] uppercase">◢ STEP ONE</span>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(40px,6vw,72px)] font-bold tracking-[0.04em] leading-[0.95] uppercase mt-3">
              YOU
              <br />
              <span className="text-[#e63946]" style={{ textShadow: '0 0 24px rgba(230, 57, 70, 0.35)' }}>
                CALL
              </span>
            </h2>
            <p className="font-[family-name:var(--font-body)] text-base text-[#9d8589] mt-4">No app · No login · No paperwork</p>
            <div className="flex justify-end gap-6 mt-6">
              {[
                { val: '4m 22s', label: 'Avg pickup' },
                { val: '24/7', label: 'Live channel' },
                { val: '120+', label: 'Active drivers' },
              ].map((stat, i) => (
                <div key={i} className="text-right">
                  <div className="font-[family-name:var(--font-display)] text-xl text-[#e8e0e2]">{stat.val}</div>
                  <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[#5a4248] uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Repair Chapter */}
        <section className="chapter min-h-screen flex flex-col justify-center px-8 md:px-16" id="repair">
          <div className="max-w-lg">
            <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] text-[#e63946] uppercase">◢ STEP TWO</span>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(40px,6vw,72px)] font-bold tracking-[0.04em] leading-[0.95] uppercase mt-3">
              WE
              <br />
              <span className="text-[#e63946]" style={{ textShadow: '0 0 24px rgba(230, 57, 70, 0.35)' }}>
                FIX
              </span>
            </h2>
            <p className="font-[family-name:var(--font-body)] text-base text-[#9d8589] mt-4">Engines · Suspension · Electrical · Body</p>
            <div className="flex gap-6 mt-6">
              {[
                { val: '1,420', label: 'Repairs / month' },
                { val: '98%', label: 'First-fix rate' },
                { val: '9', label: 'Master techs' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="font-[family-name:var(--font-display)] text-xl text-[#e8e0e2]">{stat.val}</div>
                  <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[#5a4248] uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tow Chapter */}
        <section className="chapter min-h-screen flex flex-col justify-center items-end px-8 md:px-16" id="tow">
          <div className="max-w-lg text-right">
            <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] text-[#e63946] uppercase">◢ STEP THREE</span>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(40px,6vw,72px)] font-bold tracking-[0.04em] leading-[0.95] uppercase mt-3">
              WE
              <br />
              <span className="text-[#e63946]" style={{ textShadow: '0 0 24px rgba(230, 57, 70, 0.35)' }}>
                HAUL
              </span>
            </h2>
            <p className="font-[family-name:var(--font-body)] text-base text-[#9d8589] mt-4">Anywhere in the city · Anywhere off-road</p>
            <div className="flex justify-end gap-6 mt-6">
              {[
                { val: '14', label: 'Tow trucks' },
                { val: '0–60 min', label: 'Citywide ETA' },
                { val: '4.9★', label: 'Driver rating' },
              ].map((stat, i) => (
                <div key={i} className="text-right">
                  <div className="font-[family-name:var(--font-display)] text-xl text-[#e8e0e2]">{stat.val}</div>
                  <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[#5a4248] uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impound Chapter */}
        <section className="chapter min-h-screen flex flex-col justify-center px-8 md:px-16" id="impound">
          <div className="max-w-lg">
            <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] text-[#e63946] uppercase">◢ ALSO</span>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(40px,6vw,72px)] font-bold tracking-[0.04em] leading-[0.95] uppercase mt-3">
              WE
              <br />
              <span className="text-[#e63946]" style={{ textShadow: '0 0 24px rgba(230, 57, 70, 0.35)' }}>
                HOLD
              </span>
            </h2>
            <p className="font-[family-name:var(--font-body)] text-base text-[#9d8589] mt-4">PD partner · 50-bay secure yard · 24h CCTV</p>
            <div className="flex gap-6 mt-6">
              {[
                { val: '32 / 50', label: 'Held today' },
                { val: 'PD-Cert', label: 'Co-signed releases' },
                { val: '$240', label: 'Daily holding fee' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="font-[family-name:var(--font-display)] text-xl text-[#e8e0e2]">{stat.val}</div>
                  <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[#5a4248] uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detail/Wash Chapter */}
        <section className="chapter min-h-screen flex flex-col justify-center items-end px-8 md:px-16" id="wash">
          <div className="max-w-lg text-right">
            <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] text-[#e63946] uppercase">◢ AND</span>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(40px,6vw,72px)] font-bold tracking-[0.04em] leading-[0.95] uppercase mt-3">
              WE
              <br />
              <span className="text-[#e63946]" style={{ textShadow: '0 0 24px rgba(230, 57, 70, 0.35)' }}>
                SHINE
              </span>
            </h2>
            <p className="font-[family-name:var(--font-body)] text-base text-[#9d8589] mt-4">Wash · Wax · Interior · Ceramic coat</p>
            <div className="flex justify-end gap-6 mt-6">
              {[
                { val: '15 min', label: 'Express wash' },
                { val: '3 tiers', label: 'Basic · Premium · Pro' },
                { val: '+25 pts', label: 'Loyalty per visit' },
              ].map((stat, i) => (
                <div key={i} className="text-right">
                  <div className="font-[family-name:var(--font-display)] text-xl text-[#e8e0e2]">{stat.val}</div>
                  <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[#5a4248] uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Network Chapter */}
        <section className="chapter min-h-screen flex flex-col justify-center items-center px-8 md:px-16 text-center" id="network">
          <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] text-[#e63946] uppercase">◢ ALWAYS</span>
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(40px,6vw,72px)] font-bold tracking-[0.04em] leading-[0.95] uppercase mt-3">
            ONE CALL.
            <br />
            <span className="text-[#e63946]" style={{ textShadow: '0 0 24px rgba(230, 57, 70, 0.35)' }}>
              WE'RE THERE.
            </span>
          </h2>
          <p className="font-[family-name:var(--font-body)] text-base text-[#9d8589] mt-4">7 garages · 14 tow units · 32 mechanics · 1 phone number</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-3xl w-full">
            {SERVICES.map((svc) => (
              <div key={svc.num} className="border border-[rgba(255,255,255,0.08)] bg-black/30 p-5 rounded text-center hover:border-[rgba(255,255,255,0.14)] hover:bg-[rgba(193,26,38,0.04)] transition-all group">
                <div className="font-[family-name:var(--font-mono)] text-[10px] text-[#e63946] mb-2">{svc.num}</div>
                <div className="font-[family-name:var(--font-display)] text-lg tracking-[0.1em] uppercase mb-1">{svc.title}</div>
                <div className="font-[family-name:var(--font-body)] text-xs text-[#9d8589]">{svc.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Booking Section */}
      <section className="relative z-10 py-20 px-8 md:px-16 bg-gradient-to-b from-transparent via-[#050207] to-[#050207]" id="book">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] text-[#e63946] uppercase mb-3">
            ◢ Guest Booking · No Login Required
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(32px,4vw,48px)] font-bold tracking-[0.04em] uppercase">
            Tell us where.
            <br />
            <span className="text-[#e63946]" style={{ textShadow: '0 0 24px rgba(230, 57, 70, 0.35)' }}>
              We're there in minutes.
            </span>
          </h2>
          <p className="font-[family-name:var(--font-body)] text-base text-[#9d8589] mt-4 max-w-lg mx-auto">
            Three short steps. No account, no app download — just tell us what's wrong and where you are.
          </p>
        </div>

        <BookingForm />

        <div className="text-center mt-12 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.32em] text-[#5a4248] uppercase">
          Need help? Call <span className="text-[#e8e0e2]">555-CB-HELP</span> · Open 24/7 · <span className="text-[#5cd297]">● Live Now</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 px-8 md:px-16 text-center border-t border-[rgba(255,255,255,0.08)] bg-[#050207]">
        <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.32em] text-[#5a4248] uppercase">
          Chacha Bhatija Co. · <span className="text-[#e63946]">One Call. We're There.</span> · 7 garages · 14 tow units · 32 mechanics
        </div>
        <div className="mt-3">
          <Link href="/terminal/dashboard" className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[#9d8589] hover:text-[#e8e0e2] transition-colors border-b border-dotted border-[rgba(255,255,255,0.08)]">
            Operations Terminal →
          </Link>
        </div>
      </footer>
    </div>
  )
}
