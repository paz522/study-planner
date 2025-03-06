import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { StudyItemEditForm } from "@/components/study-item-edit-form"

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const studyItem = await prisma.studyItem.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!studyItem) {
    return {
      title: "学習項目が見つかりません",
    }
  }

  return {
    title: `${studyItem.title}の編集 - StudyPlanner`,
    description: "学習項目の情報を編集します",
  }
}

export default async function EditStudyItemPage({ params }: PageProps) {
  const studyItem = await prisma.studyItem.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!studyItem) {
    notFound()
  }

  // 日付をISO文字列に変換
  const formattedStudyItem = {
    ...studyItem,
    dueDate: studyItem.dueDate?.toISOString() || null,
    createdAt: studyItem.createdAt.toISOString(),
    updatedAt: studyItem.updatedAt.toISOString(),
  }

  return <StudyItemEditForm studyItem={formattedStudyItem} />
} 