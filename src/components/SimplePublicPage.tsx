import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PublicShareButton from '@/components/PublicShareButton'

export default function SimplePublicPage({
  kicker,
  title,
  intro,
  sections,
  ctaHref = '/app/inicio',
  canonicalPath,
}: {
  kicker: string
  title: string
  intro: string
  sections: { title: string; body: string }[]
  ctaHref?: string
  canonicalPath: string
}) {
  return (
    <main style={{ background: '#F1F5F9', color: '#0F172A' }}>
      <Navbar />
      <section className="px-4 pt-28 sm:pt-32 pb-12">
        <div className="max-w-5xl mx-auto rounded-3xl p-7 sm:p-10" style={{ background: '#0F172A', color: '#fff' }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: '#CBD5E1' }}>{kicker}</p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight max-w-3xl">{title}</h1>
          <p className="text-base sm:text-lg leading-relaxed mt-5 max-w-2xl" style={{ color: 'rgba(226,232,240,0.76)' }}>{intro}</p>
          <div className="flex flex-wrap gap-3 mt-7">
            <Link href={ctaHref} className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold" style={{ background: '#fff', color: '#0F172A' }}>Abrir Recién Llegué <ArrowRight size={14} /></Link>
            <PublicShareButton title={title} text={intro} url={canonicalPath} />
          </div>
        </div>
      </section>
      <section className="px-4 py-10">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4">
          {sections.map((section) => (
            <article key={section.title} className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.08)' }}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#F1F5F9', color: '#0F172A' }}>
                <CheckCircle2 size={18} />
              </div>
              <h2 className="font-black text-xl mb-2">{section.title}</h2>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(15,23,42,0.62)' }}>{section.body}</p>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  )
}
