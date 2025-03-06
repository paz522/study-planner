"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { useTranslations } from 'next-intl'
import Link from "next/link"
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns"
import { ja } from "date-fns/locale"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

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

// 学習セッションの型定義
interface StudySession {
  id: string
  startTime: string
  endTime: string
  completed: boolean
  notes: string | null
  studyItemId: string
  createdAt: string
  updatedAt: string
  studyItem: StudyItem
}

export default function ProgressPage() {
  const t = useTranslations();
  const locale = t('common.locale') === 'ja' ? 'ja' : 'en';
  const { toast } = useToast();
  const [studyItems, setStudyItems] = useState<StudyItem[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  // 学習項目と学習セッションを取得する
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // 学習項目を取得
        const itemsResponse = await fetch('/api/study-items');
        if (!itemsResponse.ok) {
          throw new Error('学習項目の取得に失敗しました');
        }
        const itemsData = await itemsResponse.json();
        setStudyItems(itemsData);
        
        // 学習セッションを取得
        const sessionsResponse = await fetch('/api/study-sessions');
        if (!sessionsResponse.ok) {
          throw new Error('学習セッションの取得に失敗しました');
        }
        const sessionsData = await sessionsResponse.json();
        setStudySessions(sessionsData);
      } catch (error) {
        console.error('データ取得エラー:', error);
        toast({
          variant: "destructive",
          title: "エラー",
          description: error instanceof Error ? error.message : "データの取得に失敗しました",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  // 総学習時間を計算（ミリ秒）
  const totalStudyTimeMs = studySessions
    .filter(session => session.completed)
    .reduce((total, session) => {
      const start = new Date(session.startTime).getTime();
      const end = new Date(session.endTime).getTime();
      return total + (end - start);
    }, 0);
  
  // 総学習時間（時間）
  const totalStudyHours = Math.round(totalStudyTimeMs / (1000 * 60 * 60) * 10) / 10;
  
  // 完了した学習項目の数
  const completedItemsCount = studyItems.filter(item => item.progress >= 100).length;
  
  // 進行中の学習項目の数
  const ongoingItemsCount = studyItems.filter(item => item.progress > 0 && item.progress < 100).length;
  
  // 未着手の学習項目の数
  const notStartedItemsCount = studyItems.filter(item => item.progress === 0).length;
  
  // 優先度別の学習項目数
  const priorityCounts = [
    { name: '低', value: studyItems.filter(item => item.priority === 1).length },
    { name: '中', value: studyItems.filter(item => item.priority === 2).length },
    { name: '高', value: studyItems.filter(item => item.priority === 3).length },
  ];
  
  // 過去7日間の日別学習時間
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i))
    .reverse();
  
  const dailyStudyData = last7Days.map(day => {
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);
    
    const dayStudyTimeMs = studySessions
      .filter(session => {
        const sessionDate = new Date(session.startTime);
        return sessionDate >= dayStart && sessionDate <= dayEnd && session.completed;
      })
      .reduce((total, session) => {
        const start = new Date(session.startTime).getTime();
        const end = new Date(session.endTime).getTime();
        return total + (end - start);
      }, 0);
    
    return {
      date: format(day, 'MM/dd'),
      hours: Math.round(dayStudyTimeMs / (1000 * 60 * 60) * 10) / 10,
    };
  });
  
  // 学習項目別の学習時間
  const itemStudyData = studyItems.map(item => {
    const itemSessions = studySessions.filter(session => 
      session.studyItemId === item.id && session.completed
    );
    
    const itemStudyTimeMs = itemSessions.reduce((total, session) => {
      const start = new Date(session.startTime).getTime();
      const end = new Date(session.endTime).getTime();
      return total + (end - start);
    }, 0);
    
    return {
      name: item.title,
      hours: Math.round(itemStudyTimeMs / (1000 * 60 * 60) * 10) / 10,
    };
  }).sort((a, b) => b.hours - a.hours).slice(0, 5); // 上位5つのみ
  
  // 進捗状況の円グラフデータ
  const progressData = [
    { name: '完了', value: completedItemsCount },
    { name: '進行中', value: ongoingItemsCount },
    { name: '未着手', value: notStartedItemsCount },
  ];
  
  const COLORS = ['#4CAF50', '#2196F3', '#9E9E9E'];
  
  if (isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t('progress.title')}</h1>
        <Button variant="outline" asChild>
          <Link href={`/${locale}/dashboard`}>
            {t('progress.backToDashboard')}
          </Link>
        </Button>
      </div>
      
      {/* 概要メトリクス */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('progress.metrics.totalStudyHours')}
            </CardTitle>
            <Icons.spinner className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudyHours}時間</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('progress.metrics.completedItems')}
            </CardTitle>
            <Icons.check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedItemsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('progress.metrics.ongoingItems')}
            </CardTitle>
            <Icons.fileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ongoingItemsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('progress.metrics.notStartedItems')}
            </CardTitle>
            <Icons.fileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notStartedItemsCount}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* タブ付きの詳細分析 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">
            {t('progress.tabs.overview')}
          </TabsTrigger>
          <TabsTrigger value="daily">
            {t('progress.tabs.daily')}
          </TabsTrigger>
          <TabsTrigger value="items">
            {t('progress.tabs.items')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('progress.charts.progressStatus')}</CardTitle>
                <CardDescription>
                  {t('progress.charts.progressStatusDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={progressData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {progressData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('progress.charts.priorityDistribution')}</CardTitle>
                <CardDescription>
                  {t('progress.charts.priorityDistributionDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={priorityCounts}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>{t('progress.charts.dailyStudyTime')}</CardTitle>
              <CardDescription>
                {t('progress.charts.dailyStudyTimeDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dailyStudyData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis label={{ value: '時間', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="hours" fill="#2196F3" name="学習時間" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="items">
          <Card>
            <CardHeader>
              <CardTitle>{t('progress.charts.itemStudyTime')}</CardTitle>
              <CardDescription>
                {t('progress.charts.itemStudyTimeDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={itemStudyData}
                    layout="vertical"
                    margin={{
                      top: 20,
                      right: 30,
                      left: 100,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={80} />
                    <Tooltip />
                    <Bar dataKey="hours" fill="#4CAF50" name="学習時間" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 