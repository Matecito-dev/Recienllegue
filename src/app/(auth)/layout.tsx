'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const contextualLink =
    pathname === '/login' ? (
      <span className="text-sm text-[#051f20]/60">
        ¿No tenés cuenta?{' '}
        <Link href="/registro" className="font-semibold text-[#163832] hover:underline">
          Registrate
        </Link>
      </span>
    ) : (
      <span className="text-sm text-[#051f20]/60">
        ¿Ya tenés cuenta?{' '}
        <Link href="/login" className="font-semibold text-[#163832] hover:underline">
          Iniciá sesión
        </Link>
      </span>
    )

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f8faf8' }}>
      <header className="w-full border-b border-[rgba(22,56,50,0.08)] bg-white/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Recien Llegue" className="h-8 w-auto" />
            <span className="font-extrabold text-lg tracking-tight" style={{ color: '#051f20' }}>
              Recien Llegue
            </span>
          </Link>
          <div>{contextualLink}</div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        {children}
      </main>
    </div>
  )
}
