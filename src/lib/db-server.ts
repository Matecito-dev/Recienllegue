import { createClient } from 'matecitodb'

// Solo servidor, podemos usar las variables sin NEXT_PUBLIC_
const URL         = process.env.MATECITODB_URL!
const ANON_KEY    = process.env.NEXT_PUBLIC_MATECITODB_ANON_KEY!
const SERVICE_KEY = process.env.MATECITODB_SERVICE_KEY!

/** 
 * Cliente público para servidor — usa anon key.
 * IDEAL para Login y Register desde Server Actions.
 */
export const publicServerDb = createClient(URL, {
  apiKey: ANON_KEY,
  apiVersion: 'v2',
})

/** 
 * Cliente admin — service key, bypassa permisos. 
 * SOLO USAR EN SERVER ACTIONS / SERVER COMPONENTS PARA ADMINISTRACIÓN.
 */
export const serverDb = createClient(URL, {
  apiKey: SERVICE_KEY,
  apiVersion: 'v2',
})

/** 
 * Cliente con permisos de usuario — usa cookies para obtener la sesión.
 * Solo para servidor.
 */
export async function getAuthenticatedDb() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const token = cookieStore.get('mb_token_pub')?.value ?? ''
  
  const db = createClient(URL, {
    apiKey: ANON_KEY,
    apiVersion: 'v2',
  })
  
  if (token) {
    db.auth.setSession({
      access_token:  token,
      refresh_token: '',
      user:          {} as any,
    })
  }
  
  return db
}
