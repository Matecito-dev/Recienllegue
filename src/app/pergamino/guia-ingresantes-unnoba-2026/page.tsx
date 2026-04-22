import type { Metadata } from 'next'
import SimplePublicPage from '@/components/SimplePublicPage'

export const metadata: Metadata = {
  title: 'Guía para ingresantes UNNOBA 2026 en Pergamino | Recién Llegué',
  description: 'Alojamiento, transporte, comida, trámites, costos y checklist para estudiantes ingresantes UNNOBA 2026 en Pergamino.',
  alternates: { canonical: 'https://recienllegue.com/pergamino/guia-ingresantes-unnoba-2026' },
}

export default function GuiaIngresantesPage() {
  return (
    <SimplePublicPage
      kicker="UNNOBA 2026"
      title="Guía para ingresantes UNNOBA en Pergamino"
      intro="Una página pilar para organizar alojamiento, transporte, comida, costos y primeras decisiones antes de llegar a la ciudad."
      canonicalPath="/pergamino/guia-ingresantes-unnoba-2026"
      ctaHref="/app/inicio"
      sections={[
        { title: 'Alojamiento', body: 'Compará pensiones, habitaciones y departamentos. Confirmá precio total, servicios incluidos, reglas y distancia real a tu sede.' },
        { title: 'Transporte', body: 'Revisá colectivos, mapa combinado y alternativas para moverte durante las primeras semanas.' },
        { title: 'Comida y compras', body: 'Identificá comercios, supermercados, kioscos, cafeterías y lugares útiles cerca de zonas universitarias.' },
        { title: 'Costos iniciales', body: 'Además del alquiler, calculá mudanza, depósito, internet, materiales, transporte y comida del primer mes.' },
        { title: 'Salud y urgencias', body: 'Guardá farmacias de turno, contactos útiles y opciones cercanas para resolver emergencias simples.' },
        { title: 'Primeros días', body: 'Llegá con margen, recorré tu zona, probá el transporte y guardá alternativas antes de cerrar una decisión larga.' },
      ]}
    />
  )
}
