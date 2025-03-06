"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Icons } from "@/components/icons"
import { useToast } from "@/components/ui/use-toast"

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

export function StudyItemsList({ detailed = false }: { detailed?: boolean }) {
  const router = useRouter()
  const { toast } = useToast()
  const [items, setItems] = useState<StudyItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStudyItems()
  }, [])

  async function fetchStudyItems() {
    try {
      const response = await fetch("/api/study-items")
      if (!response.ok) {
        throw new Error("学習項目の取得に失敗しました")
      }
      const data = await response.json()
      setItems(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "エラー",
        description: error instanceof Error ? error.message : "学習項目の取得に失敗しました",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function updateProgress(id: string, newProgress: number) {
    try {
      const response = await fetch(`/api/study-items/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ progress: newProgress }),
      })

      if (!response.ok) {
        throw new Error("進捗の更新に失敗しました")
      }

      setItems(items.map(item =>
        item.id === id ? { ...item, progress: newProgress } : item
      ))

      toast({
        title: "更新完了",
        description: "進捗が更新されました",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "エラー",
        description: error instanceof Error ? error.message : "進捗の更新に失敗しました",
      })
    }
  }

  async function deleteStudyItem(id: string) {
    try {
      const response = await fetch(`/api/study-items/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("学習項目の削除に失敗しました")
      }

      setItems(items.filter(item => item.id !== id))
      toast({
        title: "削除完了",
        description: "学習項目が削除されました",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "エラー",
        description: error instanceof Error ? error.message : "学習項目の削除に失敗しました",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Icons.fileText className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">学習項目がありません</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          新しい学習項目を追加してください
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {item.title}
            </CardTitle>
            <div className="flex items-center space-x-2">
              {detailed && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push(`/study-items/${item.id}`)}
                >
                  <Icons.arrowRight className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteStudyItem(item.id)}
              >
                <Icons.trash className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {detailed && item.description && (
              <p className="mt-2 text-sm text-muted-foreground">
                {item.description}
              </p>
            )}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span>進捗</span>
                <span>{item.progress}%</span>
              </div>
              <Progress
                value={item.progress}
                className="mt-2"
                onClick={() => {
                  const newProgress = Math.min(100, item.progress + 10)
                  updateProgress(item.id, newProgress)
                }}
              />
            </div>
            {detailed && (
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <div>優先度: {["低", "中", "高"][item.priority - 1]}</div>
                {item.dueDate && (
                  <div>期限: {new Date(item.dueDate).toLocaleDateString()}</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

