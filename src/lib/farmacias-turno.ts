export interface FarmaciaTurno {
  name: string
  address: string
  phone: string
  mapsUrl: string
}

export interface FarmaciasTurnoData {
  dateLabel: string
  schedule: string
  sourceUrl: string
  fetchedAt: string
  farmacias: FarmaciaTurno[]
}

const SOURCE_URL = 'http://www.ampergamino.com.ar/index.php?seccion_generica_id=1430'

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&aacute;/gi, 'á')
    .replace(/&eacute;/gi, 'é')
    .replace(/&iacute;/gi, 'í')
    .replace(/&oacute;/gi, 'ó')
    .replace(/&uacute;/gi, 'ú')
    .replace(/&Aacute;/g, 'Á')
    .replace(/&Eacute;/g, 'É')
    .replace(/&Iacute;/g, 'Í')
    .replace(/&Oacute;/g, 'Ó')
    .replace(/&Uacute;/g, 'Ú')
    .replace(/&ntilde;/gi, 'ñ')
    .replace(/&Ntilde;/g, 'Ñ')
    .replace(/&amp;/gi, '&')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
}

function cleanText(value: string) {
  return decodeEntities(value)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function decodeIsoHtml(buffer: ArrayBuffer) {
  return new TextDecoder('iso-8859-1').decode(buffer)
}

export function parseFarmaciasTurno(html: string): Omit<FarmaciasTurnoData, 'sourceUrl' | 'fetchedAt'> {
  const dateMatch = html.match(/([A-ZÁÉÍÓÚÑ]+)\s+\d{2}\/\d{2}\/\d{4}/i)
  const scheduleMatch = html.match(/El turno comienza[^<]+/i)
  const cardMatches = html.matchAll(/<td[^>]*background-image:url\('imagenes\/cliente\/farmacia\.png'\)[\s\S]*?<\/td>/gi)

  const farmacias: FarmaciaTurno[] = []
  for (const match of cardMatches) {
    const block = match[0]
    const name = cleanText(block.match(/<div[^>]*color:\s*#2678AA[^>]*>([\s\S]*?)<\/div>/i)?.[1] ?? '')
    const mapsUrl = decodeEntities(block.match(/<a\s+href="([^"]+)"/i)?.[1] ?? '')
    const plain = cleanText(block)
    const phoneMatch = plain.match(/Tel\.\s*([()0-9\s-]+)/i)
    const beforePhone = phoneMatch ? plain.slice(0, phoneMatch.index).trim() : plain
    const address = beforePhone.replace(name, '').trim()
    const phone = phoneMatch?.[1]?.replace(/\s+/g, ' ').trim() ?? ''

    if (name) {
      farmacias.push({ name, address, phone, mapsUrl })
    }
  }

  return {
    dateLabel: cleanText(dateMatch?.[0] ?? ''),
    schedule: cleanText(scheduleMatch?.[0] ?? 'El turno comienza 08:30 hs. y finaliza 08:30 hs. del día siguiente.'),
    farmacias,
  }
}

export async function fetchFarmaciasTurno(): Promise<FarmaciasTurnoData> {
  const response = await fetch(SOURCE_URL, {
    next: { revalidate: 60 * 30 },
    headers: { 'User-Agent': 'RecienLlegue/1.0 (+https://recienllegue.com)' },
  })
  if (!response.ok) {
    throw new Error(`No se pudo consultar AM Pergamino (${response.status})`)
  }
  const html = decodeIsoHtml(await response.arrayBuffer())
  return {
    ...parseFarmaciasTurno(html),
    sourceUrl: SOURCE_URL,
    fetchedAt: new Date().toISOString(),
  }
}
