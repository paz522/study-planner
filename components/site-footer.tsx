"use client"

import { useTranslations } from 'next-intl'
import { Icons } from './icons'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from '@/hooks/use-toast'

export function SiteFooter() {
  const t = useTranslations()
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()
  const [showShareToast, setShowShareToast] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  // クライアントサイドでのみ実行される処理
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // シェア用のURLとテキストを生成
  const shareUrl = isMounted ? `${window.location.origin}${pathname}` : ''
  const shareText = `StudyPlanner - ${t('common.shareText')}`
  
  // Xでシェアする関数
  const shareOnX = () => {
    if (!isMounted) return;
    
    const url = `https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank')
    
    // シェア後にトーストを表示
    toast({
      title: t('common.thankYouForSharing'),
      description: t('common.shareSuccessMessage'),
      duration: 3000,
    })
  }

  // スクロールに応じてシェアトーストを表示
  useEffect(() => {
    if (!isMounted) return;
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const pageHeight = document.body.scrollHeight
      const windowHeight = window.innerHeight
      const scrollPercentage = (scrollPosition / (pageHeight - windowHeight)) * 100
      
      // ページの50%以上スクロールしたらトーストを表示
      if (scrollPercentage > 50 && !showShareToast) {
        setShowShareToast(true)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showShareToast, isMounted])

  return (
    <>
      {/* フローティングシェアボタン - クライアントサイドでのみ表示 */}
      {isMounted && (
        <div className="fixed bottom-20 right-6 z-50 flex flex-col gap-2">
          <div className="animate-bounce bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={shareOnX}
              aria-label={t('common.shareOnX')}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
                />
              </svg>
            </Button>
          </div>
          <span className="text-xs text-center bg-background rounded-md p-1 shadow-sm">
            {t('common.shareOnX')}
          </span>
        </div>
      )}

      {/* フッター */}
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2 md:items-center">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              &copy; {currentYear} StudyPlanner. {t('common.allRightsReserved')}
            </p>
          </div>
        </div>
      </footer>
    </>
  )
} 