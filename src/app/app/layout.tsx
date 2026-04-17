import type { Metadata, Viewport } from 'next'
import AppNav from '@/components/AppNav'
import GlobalParticles from '@/components/GlobalParticles'

export const metadata: Metadata = {
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Recienllegue',
    statusBarStyle: 'default',
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: '#163832',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#f8faf8', minHeight: '100dvh', position: 'relative' }}>
      {/* Partículas flotantes — fondo global, detrás de todo el contenido */}
      <GlobalParticles />

      {/* Contenido por encima del canvas (z-index: 0) */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <AppNav />
        <main className="pb-16 lg:pb-0">
          {children}
        </main>
      </div>
    </div>
  )
}
