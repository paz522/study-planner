"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { useToast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StudyItem {
  id: string
  title: string
  description: string | null
  progress: number
  priority: number
  dueDate: string | null
}

interface StudyItemEditFormProps {
  studyItem: StudyItem
}

export function StudyItemEditForm({ studyItem }: StudyItemEditFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      priority: parseInt(formData.get("priority") as string),
      dueDate: formData.get("dueDate") as string,
    }

    try {
      const response = await fetch(`/api/study-items/${studyItem.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("学習項目の更新に失敗しました")
      }

      router.push(`/study-items/${studyItem.id}`)
      router.refresh()
      toast({
        title: "更新完了",
        description: "学習項目が更新されました",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "エラー",
        description: error instanceof Error ? error.message : "学習項目の更新に失敗しました",
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
      </div>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="title">タイトル</Label>
            <Input
              id="title"
              name="title"
              defaultValue={studyItem.title}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={studyItem.description || ""}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">優先度</Label>
            <Select
              name="priority"
              defaultValue={studyItem.priority.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="優先度を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">低</SelectItem>
                <SelectItem value="2">中</SelectItem>
                <SelectItem value="3">高</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">期限</Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              defaultValue={studyItem.dueDate?.split("T")[0] || ""}
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              更新
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 