'use client'

import { Share2 } from 'lucide-react'

export default function PublicShareButton({ title, text, url }: { title: string; text: string; url: string }) {
  const share = async () => {
    const absoluteUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`
    if (navigator.share) {
      await navigator.share({ title, text, url: absoluteUrl }).catch(() => {})
      return
    }
    await navigator.clipboard?.writeText(absoluteUrl).catch(() => {})
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-opacity hover:opacity-80"
      style={{ background: 'rgba(15,23,42,0.06)', color: '#0F172A' }}
    >
      <Share2 size={15} /> Compartir
    </button>
  )
}
