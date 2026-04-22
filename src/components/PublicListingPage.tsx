import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PublicShareButton from '@/components/PublicShareButton'

export default function PublicListingPage({
  item,
  kind,
  backHref,
}: {
  item: any
  kind: 'comercio' | 'hospedaje'
  backHref: string
}) {
  const images = Array.isArray(item.images) ? item.images : []
  const title = item.name ?? (kind === 'comercio' ? 'Comercio' : 'Hospedaje')
  const publicPath = `/${kind === 'comercio' ? 'comercios' : 'hospedajes'}/${item.id}`

  return (
    <main style={{ background: '#F8FAFC', color: '#0F172A' }}>
      <Navbar />
      <section className="px-4 py-10">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
          <div>
            {images[0] && <img src={images[0]} alt={title} className="w-full aspect-video object-cover rounded-2xl mb-5" />}
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: '#1E3A5F' }}>{kind === 'comercio' ? item.category ?? 'Comercio' : item.type ?? 'Hospedaje'}</p>
            <h1 className="text-4xl font-black tracking-tight">{title}</h1>
            {item.address && <p className="text-base mt-4" style={{ color: 'rgba(15,23,42,0.62)' }}>{item.address}</p>}
            {kind === 'hospedaje' && <p className="text-xl font-black mt-4" style={{ color: '#1E3A5F' }}>{[item.price, item.priceMax].filter(Boolean).join(' - ')}</p>}
            {item.description && <p className="text-base leading-relaxed mt-5" style={{ color: 'rgba(15,23,42,0.68)' }}>{item.description}</p>}
            {images.length > 1 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                {images.slice(1).map((url: string) => <img key={url} src={url} alt="" className="aspect-video object-cover rounded-2xl" />)}
              </div>
            )}
          </div>
          <aside className="rounded-2xl p-5 h-fit space-y-3" style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.08)' }}>
            {item.phone && <a href={`tel:${String(item.phone).replace(/\D/g, '')}`} className="block text-center rounded-xl px-4 py-3 text-sm font-bold" style={{ background: '#0F172A', color: '#FFFFFF' }}>Contactar</a>}
            {item.googleMapsUrl && <a href={item.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="block text-center rounded-xl px-4 py-3 text-sm font-bold" style={{ background: 'rgba(15,23,42,0.06)', color: '#0F172A' }}>Ver mapa</a>}
            <PublicShareButton title={title} text="Mirá este detalle en Recién Llegué" url={publicPath} />
            <Link href={backHref} className="block text-center rounded-xl px-4 py-3 text-sm font-bold" style={{ color: 'rgba(15,23,42,0.62)' }}>Ver más en la app</Link>
          </aside>
        </div>
      </section>
      <Footer />
    </main>
  )
}
