import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PipeSketchPro — Pipe Isometric Tool for the Field',
  description: 'Draw pipe runs on your phone. Generate isometric drawings and material lists instantly. Export PDF and send to your crew. Built for plumbers, pipefitters, welders, and HVAC techs.',
  keywords: 'pipe isometric, pipe sketch, plumbing tool, pipefitter app, HVAC drawing, pipe takeoff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="font-montserrat antialiased">{children}</body>
    </html>
  )
}
