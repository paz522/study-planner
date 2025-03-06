import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: {
    id: string
    sessionId: string
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

    const studySession = await prisma.studySession.findUnique({
      where: {
        id: params.sessionId,
        studyItemId: params.id,
      },
    })

    if (!studySession) {
      return NextResponse.json(
        { error: "学習セッションが見つかりません" },
        { status: 404 }
      )
    }

    await prisma.studySession.delete({
      where: {
        id: params.sessionId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Study session deletion error:", error)
    return NextResponse.json(
      { error: "学習セッションの削除に失敗しました" },
      { status: 500 }
    )
  }
} 