import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from 'matecitodb'

const DB_URL = process.env.MATECITODB_URL ?? process.env.NEXT_PUBLIC_MATECITODB_URL ?? ''
const ANON_KEY = process.env.NEXT_PUBLIC_MATECITODB_ANON_KEY ?? ''

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
}

export async function POST(request: Request) {
  if (!DB_URL || !ANON_KEY) {
    return NextResponse.json({ error: 'MatecitoDB no está configurado' }, { status: 500 })
  }

  const { token } = await request.json().catch(() => ({ token: '' }))
  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Token FCM inválido' }, { status: 400 })
  }

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('mb_token')?.value ?? cookieStore.get('mb_token_pub')?.value ?? ''
  const refreshToken = cookieStore.get('mb_refresh')?.value ?? ''

  if (!accessToken) {
    return NextResponse.json({ error: 'No hay sesión activa' }, { status: 401 })
  }

  const db = createClient(DB_URL, {
    apiKey: ANON_KEY,
    apiVersion: 'v2',
    autoRefresh: true,
  })

  db.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
    user: {} as any,
  })

  const beforeToken = db.auth.token
  const { error } = await db.notifications.registerToken(token)

  if (error) {
    return NextResponse.json({
      error: error.message,
      status: error.status,
      raw: error.raw ?? null,
    }, { status: error.status || 500 })
  }

  const response = NextResponse.json({ ok: true })
  const refreshedToken = db.auth.token
  const refreshedRefresh = db.auth.refreshToken

  if (refreshedToken && refreshedToken !== beforeToken) {
    response.cookies.set('mb_token', refreshedToken, COOKIE_OPTS)
    response.cookies.set('mb_token_pub', refreshedToken, {
      ...COOKIE_OPTS,
      httpOnly: false,
    })
  }
  if (refreshedRefresh && refreshedRefresh !== refreshToken) {
    response.cookies.set('mb_refresh', refreshedRefresh, COOKIE_OPTS)
  }

  return response
}
