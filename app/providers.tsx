"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  // プリフェッチを強化するための効果
  useEffect(() => {
    // ページ読み込み時に主要なルートをプリフェッチ
    const prefetchRoutes = async () => {
      // 主要なルートをプリフェッチ
      const routes = ['/dashboard', '/calendar', '/study-items']
      routes.forEach(route => {
        router.prefetch(route)
      })
    }
    
    prefetchRoutes()
  }, [router])

  return children
} 