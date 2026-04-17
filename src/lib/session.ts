import { cookies } from 'next/headers'
import type { AuthUser } from 'matecitodb'

export interface Session {
  token:        string
  refreshToken: string
  user:         AuthUser
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const token        = cookieStore.get('mb_token')?.value
  const refreshToken = cookieStore.get('mb_refresh')?.value
  const userRaw      = cookieStore.get('mb_user')?.value
  if (!token || !userRaw) return null
  try {
    return {
      token,
      refreshToken: refreshToken ?? '',
      user: JSON.parse(userRaw) as AuthUser,
    }
  } catch {
    return null
  }
}

export async function getUser(): Promise<AuthUser | null> {
  const session = await getSession()
  return session?.user ?? null
}
