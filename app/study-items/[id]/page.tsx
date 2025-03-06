import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { StudyItemDetail } from "@/components/study-item-detail"

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
    title: `${studyItem.title} - StudyPlanner`,
    description: studyItem.description || undefined,
  }
}

export default async function StudyItemPage({ params }: PageProps) {
  const studyItem = await prisma.studyItem.findUnique({
    where: {
      id: params.id,
    },
    include: {
      sessions: {
        orderBy: {
          startTime: "desc",
        },
      },
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
    sessions: studyItem.sessions.map(session => ({
      ...session,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime.toISOString(),
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
    })),
  }

  return <StudyItemDetail studyItem={formattedStudyItem} />
} 