"use client"

import { format, addDays } from "date-fns"
import { ja } from "date-fns/locale"
import { Bell, BellOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

// 仮の学習セッションデータ
const upcomingSessionsData = [
  {
    id: 1,
    title: "プログラミング基礎",
    date: addDays(new Date(), 0),
    startTime: "19:00",
    endTime: "20:00",
    notificationsEnabled: true,
  },
  {
    id: 2,
    title: "英語リスニング",
    date: addDays(new Date(), 1),
    startTime: "18:30",
    endTime: "19:30",
    notificationsEnabled: true,
  },
  {
    id: 3,
    title: "データ分析",
    date: addDays(new Date(), 1),
    startTime: "21:00",
    endTime: "22:00",
    notificationsEnabled: false,
  },
  {
    id: 4,
    title: "プログラミング基礎",
    date: addDays(new Date(), 2),
    startTime: "20:00",
    endTime: "21:00",
    notificationsEnabled: true,
  },
  {
    id: 5,
    title: "マーケティング基礎",
    date: addDays(new Date(), 3),
    startTime: "19:00",
    endTime: "21:00",
    notificationsEnabled: true,
  },
]

export function UpcomingStudySessions() {
  return (
    <div className="space-y-4">
      {upcomingSessionsData.slice(0, 4).map((session, index) => (
        <div key={session.id}>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">{session.title}</h4>
              <div className="flex items-center text-sm text-muted-foreground">
                <span className={cn(index === 0 ? "text-destructive font-medium" : "")}>
                  {format(session.date, "M月d日(E)", { locale: ja })}
                </span>
                <span className="mx-1">・</span>
                <span>
                  {session.startTime} - {session.endTime}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <Switch id={`notify-${session.id}`} checked={session.notificationsEnabled} aria-label="通知の切り替え" />
              <label htmlFor={`notify-${session.id}`} className="ml-2">
                {session.notificationsEnabled ? (
                  <Bell className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <BellOff className="h-4 w-4 text-muted-foreground" />
                )}
              </label>
            </div>
          </div>
          {index < upcomingSessionsData.slice(0, 4).length - 1 && <Separator className="mt-3" />}
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full">
        すべてのセッションを表示
      </Button>
    </div>
  )
}

