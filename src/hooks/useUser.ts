'use client'
import { useState, useEffect } from 'react'

export function useUser() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const entry = document.cookie
        .split('; ')
        .find(row => row.startsWith('mb_user='))
      const cookie = entry?.split('=').slice(1).join('=')
      if (cookie) {
        setUser(JSON.parse(decodeURIComponent(cookie)))
      }
    } catch {}
    setLoading(false)
  }, [])

  return { user, loading, isLoggedIn: !!user }
}
