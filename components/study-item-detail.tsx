"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Icons } from "@/components/icons"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface StudySession {
  id: string
  startTime: string
  endTime: string
  completed: boolean
  notes: string | null
}

interface StudyItem {
  id: string
  title: string
  description: string | null
  progress: number
  priority: number
  dueDate: string | null
  createdAt: string
  updatedAt: string
  sessions: StudySession[]
}

interface StudyItemDetailProps {
  studyItem: StudyItem
}

export function StudyItemDetail({ studyItem: initialStudyItem }: StudyItemDetailProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSessionDeleteDialogOpen, setIsSessionDeleteDialogOpen] = useState(false)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [studyItem, setStudyItem] = useState<StudyItem>(initialStudyItem)

  async function updateProgress(newProgress: number) {
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/study-items/${studyItem.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ progress: newProgress }),
      })

      if (!response.ok) {
        throw new Error("進捗の更新に失敗しました")
      }

      const updatedStudyItem = await response.json()
      setStudyItem({
        ...studyItem,
        progress: updatedStudyItem.progress,
      })

      toast({
        title: "更新完了",
        description: "進捗が更新されました",
      })
    } catch (error) {
      console.error("Progress update error:", error)
      toast({
        variant: "destructive",
        title: "エラー",
        description: error instanceof Error ? error.message : "進捗の更新に失敗しました",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteStudyItem() {
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/study-items/${studyItem.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("学習項目の削除に失敗しました")
      }

      setIsDeleteDialogOpen(false)
      
      toast({
        title: "削除完了",
        description: "学習項目が削除されました",
      })
      
      router.push("/study-items")
    } catch (error) {
      console.error("Study item deletion error:", error)
      toast({
        variant: "destructive",
        title: "エラー",
        description: error instanceof Error ? error.message : "学習項目の削除に失敗しました",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteStudySession(sessionId: string) {
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/study-items/${studyItem.id}/sessions/${sessionId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("学習セッションの削除に失敗しました")
      }

      setIsSessionDeleteDialogOpen(false)
      setSelectedSessionId(null)
      
      setStudyItem({
        ...studyItem,
        sessions: studyItem.sessions.filter(session => session.id !== sessionId)
      })
      
      toast({
        title: "削除完了",
        description: "学習セッションが削除されました",
      })
    } catch (error) {
      console.error("Study session deletion error:", error)
      toast({
        variant: "destructive",
        title: "エラー",
        description: error instanceof Error ? error.message : "学習セッションの削除に失敗しました",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
        >
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          戻る
        </Button>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/study-items/${studyItem.id}/edit`)}
          >
            <svg
              className="mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            編集
          </Button>
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Icons.trash className="mr-2 h-4 w-4" />
                削除
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>学習項目の削除</DialogTitle>
                <DialogDescription>
                  本当にこの学習項目を削除しますか？この操作は取り消せません。
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={isLoading}
                >
                  キャンセル
                </Button>
                <Button
                  variant="destructive"
                  onClick={deleteStudyItem}
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  削除
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{studyItem.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {studyItem.description && (
              <p className="text-muted-foreground mb-4">
                {studyItem.description}
              </p>
            )}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>進捗</span>
                  <span>{studyItem.progress}%</span>
                </div>
                <Progress
                  value={studyItem.progress}
                  className="h-2"
                  onClick={() => {
                    const newProgress = Math.min(100, studyItem.progress + 10)
                    updateProgress(newProgress)
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div>優先度: {["低", "中", "高"][studyItem.priority - 1]}</div>
                {studyItem.dueDate && (
                  <div>期限: {new Date(studyItem.dueDate).toLocaleDateString()}</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>学習セッション履歴</CardTitle>
          </CardHeader>
          <CardContent>
            {studyItem.sessions.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                学習セッションの記録がありません
              </p>
            ) : (
              <div className="space-y-4">
                {studyItem.sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <div className="font-medium">
                        {new Date(session.startTime).toLocaleString()}
                      </div>
                      {session.notes && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {session.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={session.completed ? "default" : "secondary"}>
                        {session.completed ? "完了" : "進行中"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedSessionId(session.id)
                          setIsSessionDeleteDialogOpen(true)
                        }}
                      >
                        <Icons.trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Dialog open={isSessionDeleteDialogOpen} onOpenChange={setIsSessionDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>学習セッションの削除</DialogTitle>
            <DialogDescription>
              本当にこの学習セッションを削除しますか？この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsSessionDeleteDialogOpen(false)
                setSelectedSessionId(null)
              }}
              disabled={isLoading}
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedSessionId && deleteStudySession(selectedSessionId)}
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              削除
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 