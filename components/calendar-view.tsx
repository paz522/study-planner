"use client"

import { useState, useEffect } from "react"
import { addDays, format, startOfWeek, subDays, parseISO, endOfWeek, isWithinInterval } from "date-fns"
import { ja } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface CalendarViewProps {
  fullSize?: boolean
}

interface StudySession {
  id: string
  startTime: string
  endTime: string
  completed: boolean
  notes: string | null
  studyItemId: string
  studyItem: {
    id: string
    title: string
    description: string | null
    progress: number
    priority: number
  }
}

interface CalendarEvent {
  day: number
  time: string
  duration: number
  title: string
  id?: string
  completed?: boolean
}

export function CalendarView({ fullSize = false }: CalendarViewProps) {
  const { toast } = useToast()
  const [date, setDate] = useState<Date>(new Date())
  const [view, setView] = useState<"all" | "study" | "appointments">("all")
  const [studySessions, setStudySessions] = useState<StudySession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 今週の開始日（日曜日）を取得
  const weekStart = startOfWeek(date, { weekStartsOn: 0 })

  useEffect(() => {
    fetchStudySessions()
  }, [date])

  async function fetchStudySessions() {
    setIsLoading(true)
    try {
      const response = await fetch("/api/study-sessions")
      if (!response.ok) {
        throw new Error("学習セッションの取得に失敗しました")
      }
      const data = await response.json()
      setStudySessions(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "エラー",
        description: error instanceof Error ? error.message : "学習セッションの取得に失敗しました",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 予定（仕事や睡眠など）のデータ
  const appointmentData: CalendarEvent[] = [
    // サンプルデータを削除
  ]

  // 曜日の配列
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(weekStart, i)
    return {
      date: day,
      dayName: format(day, "E", { locale: ja }),
      dayNumber: format(day, "d"),
    }
  })

  // 時間の配列（0時から23時まで）
  const hours = Array.from({ length: 24 }, (_, i) => {
    return `${i.toString().padStart(2, "0")}:00`
  })

  const handleViewChange = (newView: "all" | "study" | "appointments") => {
    setView(newView)
  }

  // 学習セッションをカレンダー表示用に変換
  const getStudySessionsForCalendar = (): CalendarEvent[] => {
    // 現在表示中の週の開始日と終了日
    const currentWeekStart = startOfWeek(date, { weekStartsOn: 0 });
    const currentWeekEnd = endOfWeek(date, { weekStartsOn: 0 });
    
    // 現在の週に含まれるセッションのみをフィルタリング
    return studySessions
      .filter(session => {
        const sessionDate = parseISO(session.startTime);
        return isWithinInterval(sessionDate, {
          start: currentWeekStart,
          end: currentWeekEnd
        });
      })
      .map(session => {
        const startTime = parseISO(session.startTime);
        const endTime = parseISO(session.endTime);
        
        // 開始日の曜日（0-6）を取得
        const startDay = startTime.getDay();
        
        // 開始時間を "HH:MM" 形式で取得
        const timeStr = format(startTime, "HH:mm");
        
        // 所要時間（時間単位）を計算
        const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
        
        return {
          day: startDay,
          time: timeStr,
          duration: durationHours,
          title: session.studyItem.title,
          id: session.id,
          completed: session.completed
        };
      });
  };

  if (fullSize) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "PPP", { locale: ja })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                  locale={ja}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              <Button
                variant={view === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => handleViewChange("all")}
              >
                すべて
              </Button>
              <Button
                variant={view === "study" ? "default" : "outline"}
                size="sm"
                onClick={() => handleViewChange("study")}
              >
                学習
              </Button>
              <Button
                variant={view === "appointments" ? "default" : "outline"}
                size="sm"
                onClick={() => handleViewChange("appointments")}
              >
                予定
              </Button>
            </div>
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" onClick={() => setDate(subDays(date, 7))}>
                前の週
              </Button>
              <Button variant="outline" size="sm" onClick={() => setDate(new Date())}>
                今日
              </Button>
              <Button variant="outline" size="sm" onClick={() => setDate(addDays(date, 7))}>
                次の週
              </Button>
            </div>
          </div>
        </div>
        <div className="rounded-md border">
          <div className="grid grid-cols-8 border-b">
            <div className="border-r p-2 text-center font-medium">時間</div>
            {weekDays.map((day) => (
              <div
                key={day.dayNumber}
                className={cn(
                  "p-2 text-center",
                  format(day.date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") ? "bg-primary/10" : "",
                )}
              >
                <div className="font-medium">{day.dayName}</div>
                <div>{day.dayNumber}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-8">
            <div className="border-r">
              {hours.map((hour) => (
                <div key={hour} className="border-b p-2 text-center text-sm">
                  {hour}
                </div>
              ))}
            </div>
            {weekDays.map((day, dayIndex) => (
              <div key={dayIndex} className="relative">
                {hours.map((hour, hourIndex) => (
                  <div
                    key={`${dayIndex}-${hourIndex}`}
                    className={cn(
                      "border-b border-r p-2 text-center text-sm h-12",
                      format(day.date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") ? "bg-primary/10" : "",
                    )}
                  ></div>
                ))}
                {(view === "all" || view === "study") &&
                  getStudySessionsForCalendar()
                    .filter((item) => item.day === dayIndex)
                    .map((schedule, index) => {
                      const [scheduleHour, scheduleMinute] = schedule.time.split(":").map(Number)
                      const topPosition = scheduleHour * 48 + scheduleMinute * 0.8
                      const height = schedule.duration * 48

                      return (
                        <div
                          key={`schedule-${dayIndex}-${index}`}
                          className={cn(
                            "absolute rounded-md p-1 text-xs text-primary-foreground",
                            schedule.completed ? "bg-green-600" : "bg-primary"
                          )}
                          style={{
                            top: `${topPosition}px`,
                            left: "4px",
                            right: "4px",
                            height: `${height}px`,
                            zIndex: 10,
                          }}
                        >
                          {schedule.time} {schedule.title}
                        </div>
                      )
                    })}
                {(view === "all" || view === "appointments") &&
                  appointmentData
                    .filter((item) => item.day === dayIndex)
                    .map((appointment, index) => {
                      const [appointmentHour, appointmentMinute] = appointment.time.split(":").map(Number)
                      const topPosition = appointmentHour * 48 + appointmentMinute * 0.8
                      const height = appointment.duration * 48

                      return (
                        <div
                          key={`appointment-${dayIndex}-${index}`}
                          className="absolute rounded-md bg-muted p-1 text-xs text-muted-foreground hover:bg-muted/80 transition-colors"
                          style={{
                            top: `${topPosition}px`,
                            left: "4px",
                            right: "4px",
                            height: `${height}px`,
                            zIndex: 5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            opacity: appointment.time.startsWith("00:") ? 0.7 : 1,
                          }}
                        >
                          {appointment.time} {appointment.title}
                        </div>
                      )
                    })}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // 簡易表示（ダッシュボード用）
  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-8 border-b">
        <div className="border-r p-2 text-center text-xs font-medium">時間</div>
        {weekDays.map((day) => (
          <div
            key={day.dayNumber}
            className={cn(
              "p-2 text-center text-xs",
              format(day.date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") ? "bg-primary/10" : "",
            )}
          >
            <div className="font-medium">{day.dayName}</div>
            <div>{day.dayNumber}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-8">
        <div className="border-r">
          {hours.slice(12, 24).map((hour) => (
            <div key={hour} className="border-b p-1 text-center text-xs">
              {hour}
            </div>
          ))}
        </div>
        {weekDays.map((day, dayIndex) => (
          <div key={dayIndex} className="relative">
            {hours.slice(12, 24).map((hour, hourIndex) => (
              <div
                key={`${dayIndex}-${hourIndex}`}
                className={cn(
                  "border-b border-r p-1 text-center text-xs h-8",
                  format(day.date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") ? "bg-primary/10" : "",
                )}
              ></div>
            ))}
            {getStudySessionsForCalendar()
              .filter((item) => item.day === dayIndex && Number.parseInt(item.time.split(":")[0]) >= 12)
              .map((schedule, index) => {
                const [scheduleHour, scheduleMinute] = schedule.time.split(":").map(Number)
                const topPosition = (scheduleHour - 12) * 32 + scheduleMinute * 0.53
                const height = schedule.duration * 32

                return (
                  <div
                    key={`schedule-${dayIndex}-${index}`}
                    className={cn(
                      "absolute rounded-md p-1 text-xs text-primary-foreground",
                      schedule.completed ? "bg-green-600" : "bg-primary"
                    )}
                    style={{
                      top: `${topPosition}px`,
                      left: "2px",
                      right: "2px",
                      height: `${height}px`,
                      zIndex: 10,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontSize: "0.65rem",
                    }}
                  >
                    {schedule.time} {schedule.title}
                  </div>
                )
              })}
            {(view === "all" || view === "appointments") &&
              appointmentData
                .filter((item) => item.day === dayIndex && Number.parseInt(item.time.split(":")[0]) >= 12)
                .map((appointment, index) => {
                  const [appointmentHour, appointmentMinute] = appointment.time.split(":").map(Number)
                  const topPosition = (appointmentHour - 12) * 32 + appointmentMinute * 0.53
                  const height = appointment.duration * 32

                  return (
                    <div
                      key={`appointment-${dayIndex}-${index}`}
                      className="absolute rounded-md bg-muted p-1 text-xs text-muted-foreground"
                      style={{
                        top: `${topPosition}px`,
                        left: "2px",
                        right: "2px",
                        height: `${height}px`,
                        zIndex: 5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: "0.65rem",
                      }}
                    >
                      {appointment.time} {appointment.title}
                    </div>
                  )
                })}
          </div>
        ))}
      </div>
    </div>
  )
}

