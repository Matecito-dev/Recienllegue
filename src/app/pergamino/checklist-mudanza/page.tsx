import type { Metadata } from 'next'
import SimplePublicPage from '@/components/SimplePublicPage'

export const metadata: Metadata = {
  title: 'Checklist para mudarte a Pergamino | Recién Llegué',
  description: 'Checklist compartible para estudiantes que se mudan a Pergamino: alojamiento, transporte, documentos, compras y primeros días.',
  alternates: { canonical: 'https://recienllegue.com/pergamino/checklist-mudanza' },
}

export default function ChecklistMudanzaPage() {
  return (
    <SimplePublicPage
      kicker="Checklist compartible"
      title="Checklist para mudarte a Pergamino"
      intro="Una lista práctica para no olvidarte lo importante antes de viajar, señar un lugar o arrancar las clases."
      canonicalPath="/pergamino/checklist-mudanza"
      ctaHref="/app/inicio"
      sections={[
        { title: 'Antes de viajar', body: 'Confirmá alojamiento, dirección, contacto, horarios de llegada, documentación y presupuesto del primer mes.' },
        { title: 'Alojamiento', body: 'Pedí fotos actuales, precio final, servicios incluidos, reglas, disponibilidad y forma de pago.' },
        { title: 'Transporte', body: 'Guardá recorridos, alternativas para llegar a la sede y un contacto de remis por si llegás tarde.' },
        { title: 'Compras básicas', body: 'Ropa de cama, elementos de higiene, cargadores, botiquín, documentación y algo de efectivo.' },
        { title: 'Primer día', body: 'Ubicá supermercado, farmacia, parada de colectivo, cajero y un lugar para comer cerca.' },
        { title: 'Compartir', body: 'Mandale este checklist a otra persona que esté llegando a Pergamino para coordinar mejor.' },
      ]}
    />
  )
}
