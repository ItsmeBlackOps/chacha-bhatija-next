import type { Metadata } from 'next'
import { Barlow_Condensed, Oswald, JetBrains_Mono, IBM_Plex_Sans } from 'next/font/google'
import './globals.css'

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display-alt',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Chacha Bhatija — Emergency Garage Operations',
  description: 'One Call. We\'re There. Mechanic · Tow · Impound · Roadside Assistance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${barlowCondensed.variable} ${oswald.variable} ${jetbrainsMono.variable} ${ibmPlexSans.variable}`}>
      <body className="bg-[#050207] text-[#e8e0e2] antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
