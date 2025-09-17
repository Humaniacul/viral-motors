'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

export default function Analytics() {
  const pathname = usePathname()
  const measurementId = process.env.NEXT_PUBLIC_GA_ID

  useEffect(() => {
    if (!measurementId) return
    if (typeof window === 'undefined') return
    if (typeof window.gtag === 'function') {
      window.gtag('config', measurementId, {
        page_path: pathname,
      })
    }
  }, [pathname, measurementId])

  return null
}


