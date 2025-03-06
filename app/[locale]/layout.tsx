"use client"

import './globals.css'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { NextIntlClientProvider } from 'next-intl'
import { Analytics } from '@vercel/analytics/react'
import { Providers } from '../providers'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { fontSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Toasterをクライアントサイドでのみレンダリング
const ClientToaster = dynamic(() => import('@/components/ui/toaster').then(mod => mod.Toaster), {
  ssr: false
});

export default function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<any>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const msgs = (await import(`../../messages/${locale}.json`)).default;
        setMessages(msgs);
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
      setMounted(true);
    };
    
    loadMessages();
  }, [locale]);

  // サーバーサイドレンダリング時またはメッセージ読み込み中は最小限のレイアウトを表示
  if (!mounted || !messages) {
    return (
      <html lang={locale} suppressHydrationWarning>
        <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)} suppressHydrationWarning>
          <div className="flex min-h-screen flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Providers>
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <div className="flex-1">{children}</div>
                <SiteFooter />
              </div>
              {mounted && <ClientToaster />}
            </Providers>
          </NextIntlClientProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
} 