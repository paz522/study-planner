"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format, addDays } from "date-fns"
import { ja } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface AddStudyItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddStudyItemDialog({ open, onOpenChange }: AddStudyItemDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [date, setDate] = useState<Date>()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [totalHours, setTotalHours] = useState<number>(10)
  const [priority, setPriority] = useState<string>("medium")
  const [category, setCategory] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const priorityMap = {
    "high": 3,
    "medium": 2,
    "low": 1
  }

  const handleSubmit = async () => {
    if (!title) {
      toast({
        variant: "destructive",
        title: "エラー",
        description: "タイトルを入力してください",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // 1. 学習項目を作成
      const studyItemResponse = await fetch("/api/study-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          priority: priorityMap[priority as keyof typeof priorityMap] || 2,
          dueDate: date ? date.toISOString() : null
        }),
      })

      if (!studyItemResponse.ok) {
        const errorData = await studyItemResponse.json().catch(() => ({}));
        console.error("学習項目作成エラー:", errorData);
        throw new Error(errorData.error || "学習項目の作成に失敗しました");
      }

      const studyItemData = await studyItemResponse.json()
      console.log("作成された学習項目:", studyItemData);

      // 2. 学習セッションを作成（カレンダーに表示するための予定）
      // 今日から1週間分の学習セッションを自動生成
      const studyItemId = studyItemData.studyItem ? studyItemData.studyItem.id : studyItemData.id;
      const sessionsToCreate = generateStudySessions(studyItemId, totalHours)
      console.log("作成する学習セッション:", sessionsToCreate);
      
      const sessionResponse = await fetch("/api/study-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessions: sessionsToCreate
        }),
      })

      if (!sessionResponse.ok) {
        const errorData = await sessionResponse.json().catch(() => ({}));
        console.error("学習セッション作成エラー:", errorData);
        throw new Error(errorData.error || "学習セッションの作成に失敗しました");
      }

      const createdSessions = await sessionResponse.json();
      console.log("作成された学習セッション:", createdSessions);

      toast({
        title: "追加完了",
        description: "学習項目がカレンダーに追加されました",
      })

      // フォームをリセット
      setTitle("")
      setDescription("")
      setTotalHours(10)
      setPriority("medium")
      setCategory("")
      setDate(undefined)
      
      // ダイアログを閉じる
      onOpenChange(false)
      
      // カレンダーページを更新
      router.refresh()
      
      // ページを再読み込みして、新しい学習項目を表示する
      window.location.reload();
    } catch (error) {
      console.error("学習項目追加エラー:", error);
      toast({
        variant: "destructive",
        title: "エラー",
        description: error instanceof Error ? error.message : "学習項目の追加に失敗しました",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 学習セッションを自動生成する関数
  const generateStudySessions = (studyItemId: string, totalHours: number) => {
    const sessions = []
    const today = new Date()
    
    // 1日あたりの学習時間（1〜2時間）
    const dailyHours = Math.min(2, totalHours / 7)
    
    // 残りの時間
    let remainingHours = totalHours
    
    // 7日間分のセッションを生成
    for (let i = 0; i < 7 && remainingHours > 0; i++) {
      const sessionDate = addDays(today, i)
      const sessionHours = Math.min(dailyHours, remainingHours)
      
      // 18:00〜20:00の間でセッションを設定
      const startTime = new Date(sessionDate)
      startTime.setHours(18, 0, 0, 0)
      
      const endTime = new Date(sessionDate)
      endTime.setHours(18 + sessionHours, 0, 0, 0)
      
      sessions.push({
        studyItemId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        completed: false
      })
      
      remainingHours -= sessionHours
    }
    
    return sessions
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>学習項目を追加</DialogTitle>
          <DialogDescription>新しい学習項目の詳細を入力してください。</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">タイトル</Label>
            <Input 
              id="title" 
              placeholder="例: プログラミング基礎" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">説明</Label>
            <Textarea 
              id="description" 
              placeholder="学習内容の詳細" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="total-hours">合計時間（時間）</Label>
              <Input 
                id="total-hours" 
                type="number" 
                min="1" 
                placeholder="20" 
                value={totalHours}
                onChange={(e) => setTotalHours(parseInt(e.target.value) || 10)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">優先度</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">高</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="low">低</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">カテゴリ</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="it">IT</SelectItem>
                <SelectItem value="language">語学</SelectItem>
                <SelectItem value="business">ビジネス</SelectItem>
                <SelectItem value="hobby">趣味</SelectItem>
                <SelectItem value="other">その他</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="deadline">期限</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="deadline"
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ja }) : "日付を選択"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={ja} />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            キャンセル
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "追加中..." : "追加"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

