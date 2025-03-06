import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: {
    id: string
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const studyItem = await prisma.studyItem.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!studyItem) {
      return NextResponse.json(
        { error: "学習項目が見つかりません" },
        { status: 404 }
      )
    }

    const data = await req.json()

    const updatedStudyItem = await prisma.studyItem.update({
      where: {
        id: params.id,
      },
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        progress: data.progress !== undefined ? data.progress : undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
    })

    return NextResponse.json(updatedStudyItem)
  } catch (error) {
    console.error("Study item update error:", error)
    return NextResponse.json(
      { error: "学習項目の更新に失敗しました" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const studyItem = await prisma.studyItem.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!studyItem) {
      return NextResponse.json(
        { error: "学習項目が見つかりません" },
        { status: 404 }
      )
    }

    await prisma.studyItem.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Study item deletion error:", error)
    return NextResponse.json(
      { error: "学習項目の削除に失敗しました" },
      { status: 500 }
    )
  }
} 