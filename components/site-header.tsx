"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"
import { useTranslations } from 'next-intl'

export function SiteHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations()
  const locale = t('common.locale') === 'ja' ? 'ja' : 'en'

  const switchLanguage = (locale: string) => {
    const segments = pathname.split('/')
    segments[1] = locale
    router.push(segments.join('/'))
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href={`/${locale}`} className="mr-6 flex items-center space-x-2" prefetch={true}>
            <Icons.logo className="h-6 w-6" />
            <span className="font-bold">StudyPlanner</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href={`/${locale}/dashboard`} className="transition-colors hover:text-foreground/80" prefetch={true}>
              {t('navigation.dashboard')}
            </Link>
            <Link href={`/${locale}/calendar`} className="transition-colors hover:text-foreground/80" prefetch={true}>
              {t('navigation.calendar')}
            </Link>
            <Link href={`/${locale}/study-items`} className="transition-colors hover:text-foreground/80" prefetch={true}>
              {t('navigation.studyItems')}
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Icons.languages className="h-5 w-5" />
                <span className="sr-only">{t('common.switchLanguage')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => switchLanguage('ja')}>
                日本語
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchLanguage('en')}>
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
} 