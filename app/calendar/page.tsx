import type { Metadata } from "next"
import Link from "next/link"
import { GraduationCap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarView } from "@/components/calendar-view"

export const metadata: Metadata = {
  title: "カレンダー - StudyPlanner",
  description: "学習スケジュールと予定を確認できます",
}

export default function CalendarPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <GraduationCap className="h-6 w-6" />
        <h1 className="text-lg font-semibold">StudyPlanner</h1>
        <nav className="ml-auto flex gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">ダッシュボード</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1 p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">カレンダー</h2>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>学習スケジュール</CardTitle>
              <CardDescription>自動生成された学習スケジュールと予定を確認できます</CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarView fullSize />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

