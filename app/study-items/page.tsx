import type { Metadata } from "next"
import Link from "next/link"
import { GraduationCap, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StudyItemsList } from "@/components/study-items-list"

export const metadata: Metadata = {
  title: "学習項目 - StudyPlanner",
  description: "学習項目の管理と追加",
}

export default function StudyItemsPage() {
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
            <h2 className="text-3xl font-bold tracking-tight">学習項目</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              学習項目を追加
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>学習項目一覧</CardTitle>
              <CardDescription>登録されている学習項目を管理できます</CardDescription>
            </CardHeader>
            <CardContent>
              <StudyItemsList detailed />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

