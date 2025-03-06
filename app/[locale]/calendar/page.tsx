import type { Metadata } from "next"
import { CalendarView } from "@/components/calendar-view"
import { useTranslations } from 'next-intl'

export const metadata: Metadata = {
  title: "カレンダー - StudyPlanner",
  description: "学習スケジュールと予定を確認できます",
}

export default function CalendarPage() {
  const t = useTranslations();
  
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t('calendar.title')}</h1>
      </div>
      <CalendarView fullSize />
    </div>
  )
} 