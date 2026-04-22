import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, CheckCircle2, MessageCircle, Pencil, ShieldCheck, Store, Upload } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PublicShareButton from '@/components/PublicShareButton'
import HeroParticles from '@/components/HeroParticles'

const title = 'Soy propietario | Publicá gratis en Recién Llegué'
const description = 'Publicá tu hospedaje o comercio para llegar a estudiantes y recién llegados a Pergamino, sin intermediarios y con WhatsApp directo.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://recienllegue.com/soy-propietario' },
  openGraph: { title, description, url: 'https://recienllegue.com/soy-propietario', siteName: 'Recién Llegué', locale: 'es_AR' },
}

export default function SoyPropietarioPage() {
  return (
    <main style={{ background: '#F1F5F9', color: '#0F172A' }}>
      <Navbar />

      <section className="px-4 pt-28 sm:pt-32 pb-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_380px] gap-5">
          <div className="rounded-3xl p-7 sm:p-10 relative overflow-hidden min-h-[440px] flex flex-col justify-between" style={{ background: '#0F172A' }}>
            <HeroParticles />
            <div className="relative z-10">
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: '#E2E8F0', color: '#0F172A' }}>
                  <Store size={10} /> Propietarios · Pergamino
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: 'rgba(255,255,255,0.14)', color: '#FFFFFF' }}>
                  Publicar gratis
                </span>
              </div>
              <h1 className="font-black tracking-tight leading-[1.04] max-w-4xl" style={{ color: '#fff', fontSize: 'clamp(2.4rem, 7vw, 4.7rem)' }}>
                Publicá tu lugar donde buscan estudiantes
              </h1>
              <p className="text-base sm:text-lg leading-relaxed mt-6 max-w-2xl" style={{ color: 'rgba(226,232,240,0.76)' }}>
                Sumá tu hospedaje o comercio a Recién Llegué, recibí contacto directo y mantené tu información actualizada desde un panel simple.
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap gap-3 mt-10">
              <Link href="/registro" className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition-transform hover:scale-[1.02]" style={{ background: '#FFFFFF', color: '#0F172A' }}>
                Crear cuenta <ArrowRight size={15} />
              </Link>
              <Link href="/app/propietario" className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold" style={{ background: 'rgba(226,232,240,0.12)', color: '#E2E8F0' }}>
                Ir al panel
              </Link>
            </div>
          </div>

          <aside className="rounded-3xl p-6 flex flex-col justify-between gap-6" style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.08)' }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: 'rgba(15,23,42,0.48)' }}>Panel propietario</p>
              <h2 className="font-black text-2xl mb-4">Qué podés hacer</h2>
              {[
                ['Cargar alojamiento o comercio', Upload],
                ['Actualizar fotos, dirección y contacto', Pencil],
                ['Reclamar un comercio ya listado', ShieldCheck],
                ['Pedir badge verificado', BadgeCheck],
              ].map(([label, Icon]) => {
                const I = Icon as typeof Upload
                return (
                  <div key={String(label)} className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid rgba(15,23,42,0.08)' }}>
                    <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: '#F1F5F9', color: '#0F172A' }}>
                      <I size={16} />
                    </div>
                    <p className="text-sm font-bold">{String(label)}</p>
                  </div>
                )
              })}
            </div>
            <div className="space-y-3">
              <PublicShareButton title={title} text={description} url="/soy-propietario" />
              <a href="https://wa.me/5491124025239?text=Hola%2C%20quiero%20activar%20el%20badge%20verificado%20en%20Recien%20Llegue" className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold" style={{ background: '#0F172A', color: '#FFFFFF' }}>
                Consultar verificado <MessageCircle size={15} />
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-5">
          <article className="lg:col-span-2 rounded-2xl p-7 sm:p-9" style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.08)' }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: 'rgba(15,23,42,0.48)' }}>Crecimiento local</p>
            <h2 className="text-3xl font-black tracking-tight mb-6">Por qué publicar en Recién Llegué</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                ['Gratis para empezar', 'Publicá sin costo y validá si la plataforma te trae consultas reales.'],
                ['Sin intermediarios', 'La gente ve tus datos y te contacta directo por teléfono o WhatsApp.'],
                ['Audiencia específica', 'La app está pensada para estudiantes, familias e ingresantes que están resolviendo su llegada.'],
                ['Datos actualizables', 'Podés pedir cambios de fotos, precios, contacto o dirección desde tu panel.'],
              ].map(([h, p]) => (
                <div key={h} className="rounded-2xl p-5" style={{ background: '#F8FAFC' }}>
                  <h3 className="font-black text-lg mb-2">{h}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(15,23,42,0.62)' }}>{p}</p>
                </div>
              ))}
            </div>
          </article>
          <article className="rounded-2xl p-7" style={{ background: '#0F172A', color: '#fff' }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: '#CBD5E1' }}>Cómo funciona</p>
            {['Creás una cuenta como propietario', 'Cargás o reclamás tu lugar', 'El equipo revisa los datos', 'Tu publicación queda visible para estudiantes'].map((step, index) => (
              <div key={step} className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid rgba(226,232,240,0.14)' }}>
                <CheckCircle2 size={16} style={{ color: '#FFFFFF' }} />
                <p className="text-sm font-semibold" style={{ color: '#E2E8F0' }}>0{index + 1}. {step}</p>
              </div>
            ))}
          </article>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="max-w-5xl mx-auto rounded-2xl p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5" style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.08)' }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: 'rgba(15,23,42,0.48)' }}>Empezá ahora</p>
            <h2 className="text-2xl font-black">Sumá tu comercio u hospedaje</h2>
            <p className="text-sm mt-2" style={{ color: 'rgba(15,23,42,0.62)' }}>Si ya aparece listado, también podés reclamarlo y pedir correcciones.</p>
          </div>
          <Link href="/registro" className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold" style={{ background: '#0F172A', color: '#FFFFFF' }}>
            Crear cuenta <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
