"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CalendarView } from "@/components/calendar-view"
import { StudyItemAddForm } from "@/components/study-item-add-form"
import { Clock, BookOpen, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useTranslations } from 'next-intl'
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"

// 学習項目の型定義
interface StudyItem {
  id: string
  title: string
  description: string | null
  progress: number
  priority: number
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const t = useTranslations();
  const locale = t('common.locale') === 'ja' ? 'ja' : 'en';
  const [studyItems, setStudyItems] = useState<StudyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 学習項目を取得する
  useEffect(() => {
    const fetchStudyItems = async () => {
      try {
        const response = await fetch('/api/study-items');
        if (!response.ok) {
          throw new Error('学習項目の取得に失敗しました');
        }
        const data = await response.json();
        setStudyItems(data);
      } catch (error) {
        console.error('学習項目の取得エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudyItems();
  }, []);
  
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/${locale}/progress`}>
              {t('dashboard.progress.viewProgress')}
            </Link>
          </Button>
          <StudyItemAddForm />
        </div>
      </div>

      {/* メトリクス */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.metrics.weeklyStudyHours')}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <Progress value={0} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.metrics.completedItems')}
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <Progress value={0} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.metrics.continuityDays')}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <Progress value={0} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.metrics.upcomingSessions')}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <Progress value={0} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* 進行中の学習項目 */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('dashboard.ongoingItems.title')}</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/${locale}/study-items`}>{t('dashboard.ongoingItems.viewAll')}</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <p className="text-sm text-muted-foreground">読み込み中...</p>
                </div>
              ) : studyItems.length > 0 ? (
                studyItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{item.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.priority === 3 ? 'bg-red-100 text-red-800' : 
                        item.priority === 2 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.priority === 3 ? '高' : item.priority === 2 ? '中' : '低'}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    )}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Progress value={item.progress * 100} className="h-2 w-24 mr-2" />
                        <span className="text-xs text-muted-foreground">{Math.round(item.progress * 100)}%</span>
                      </div>
                      {item.dueDate && (
                        <span className="text-xs text-muted-foreground">
                          期限: {format(new Date(item.dueDate), 'yyyy/MM/dd', { locale: ja })}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center p-4">
                  <p className="text-sm text-muted-foreground">
                    {t('dashboard.ongoingItems.noItems')}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 今日のスケジュール */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('dashboard.todaySchedule.title')}</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/${locale}/calendar`}>{t('dashboard.todaySchedule.viewCalendar')}</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <CalendarView />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 