import type { Metadata } from 'next'
import SimplePublicPage from '@/components/SimplePublicPage'

export const metadata: Metadata = {
  title: 'Cómo verificamos datos | Recién Llegué',
  description: 'Conocé qué significa verificado, qué revisa el equipo y cómo reportar información incorrecta en Recién Llegué.',
  alternates: { canonical: 'https://recienllegue.com/como-verificamos' },
}

export default function ComoVerificamosPage() {
  return (
    <SimplePublicPage
      kicker="Confianza y datos"
      title="Cómo verificamos la información"
      intro="Recién Llegué combina datos públicos, revisión manual, reclamos de propietarios y reportes de usuarios para mejorar la calidad de cada publicación."
      canonicalPath="/como-verificamos"
      ctaHref="/app/inicio"
      sections={[
        { title: 'Qué significa verificado', body: 'Un badge verificado indica que el equipo revisó señales de identidad o responsabilidad del comercio/hospedaje. No reemplaza una visita ni una contratación responsable.' },
        { title: 'Qué revisamos', body: 'Nombre, contacto, dirección, consistencia de imágenes, datos enviados por el propietario y reportes previos de usuarios.' },
        { title: 'Qué no garantizamos', body: 'No somos inmobiliaria ni intermediarios. Los precios, condiciones y disponibilidad pueden cambiar y deben confirmarse con el responsable.' },
        { title: 'Cómo reportar errores', body: 'En cada detalle público podés reportar dirección incorrecta, teléfono que no responde, precio desactualizado o disponibilidad vencida.' },
      ]}
    />
  )
}
