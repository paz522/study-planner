import type { Metadata } from "next"
import Link from "next/link"
import { GraduationCap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "設定 - StudyPlanner",
  description: "アプリケーションの設定を管理します",
}

export default function SettingsPage() {
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
            <h2 className="text-3xl font-bold tracking-tight">設定</h2>
          </div>
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">一般</TabsTrigger>
              <TabsTrigger value="notifications">通知</TabsTrigger>
              <TabsTrigger value="calendar">カレンダー</TabsTrigger>
              <TabsTrigger value="account">アカウント</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>一般設定</CardTitle>
                  <CardDescription>アプリケーションの基本設定を管理します</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">言語</Label>
                    <Select defaultValue="ja">
                      <SelectTrigger id="language">
                        <SelectValue placeholder="言語を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ja">日本語</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="theme">テーマ</Label>
                    <Select defaultValue="system">
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="テーマを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">ライト</SelectItem>
                        <SelectItem value="dark">ダーク</SelectItem>
                        <SelectItem value="system">システム設定に合わせる</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-save">自動保存</Label>
                      <div className="text-sm text-muted-foreground">変更を自動的に保存します</div>
                    </div>
                    <Switch id="auto-save" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>通知設定</CardTitle>
                  <CardDescription>通知の設定を管理します</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="study-reminders">学習リマインダー</Label>
                      <div className="text-sm text-muted-foreground">学習セッションの開始前に通知を受け取ります</div>
                    </div>
                    <Switch id="study-reminders" defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reminder-time">リマインダー時間</Label>
                    <Select defaultValue="15">
                      <SelectTrigger id="reminder-time">
                        <SelectValue placeholder="時間を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5分前</SelectItem>
                        <SelectItem value="10">10分前</SelectItem>
                        <SelectItem value="15">15分前</SelectItem>
                        <SelectItem value="30">30分前</SelectItem>
                        <SelectItem value="60">1時間前</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="daily-summary">デイリーサマリー</Label>
                      <div className="text-sm text-muted-foreground">毎日の学習予定と進捗状況の要約を受け取ります</div>
                    </div>
                    <Switch id="daily-summary" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weekly-summary">週間サマリー</Label>
                      <div className="text-sm text-muted-foreground">
                        週間の学習進捗と次週の予定の要約を受け取ります
                      </div>
                    </div>
                    <Switch id="weekly-summary" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="calendar" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>カレンダー設定</CardTitle>
                  <CardDescription>カレンダーと同期の設定を管理します</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-view">デフォルト表示</Label>
                    <Select defaultValue="week">
                      <SelectTrigger id="default-view">
                        <SelectValue placeholder="表示を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">日</SelectItem>
                        <SelectItem value="week">週</SelectItem>
                        <SelectItem value="month">月</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="start-day">週の開始日</Label>
                    <Select defaultValue="0">
                      <SelectTrigger id="start-day">
                        <SelectValue placeholder="開始日を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">日曜日</SelectItem>
                        <SelectItem value="1">月曜日</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="google-calendar">Googleカレンダー連携</Label>
                      <div className="text-sm text-muted-foreground">Googleカレンダーと予定を同期します</div>
                    </div>
                    <Switch id="google-calendar" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="apple-calendar">Appleカレンダー連携</Label>
                      <div className="text-sm text-muted-foreground">Appleカレンダーと予定を同期します</div>
                    </div>
                    <Switch id="apple-calendar" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="account" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>アカウント設定</CardTitle>
                  <CardDescription>アカウント情報を管理します</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">名前</Label>
                    <Input id="name" defaultValue="ユーザー" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">メールアドレス</Label>
                    <Input id="email" type="email" defaultValue="user@example.com" />
                  </div>
                  <div className="pt-4">
                    <Button variant="outline" className="w-full">
                      パスワードを変更
                    </Button>
                  </div>
                  <div className="pt-2">
                    <Button variant="destructive" className="w-full">
                      ログアウト
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

