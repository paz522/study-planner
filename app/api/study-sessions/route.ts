import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { sessions } = body

    if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
      return NextResponse.json(
        { error: "有効なセッションデータが提供されていません" },
        { status: 400 }
      )
    }

    // 複数のセッションを一括作成
    const createdSessions = await prisma.$transaction(
      sessions.map((session) => 
        prisma.studySession.create({
          data: {
            startTime: new Date(session.startTime),
            endTime: new Date(session.endTime),
            completed: session.completed || false,
            notes: session.notes || null,
            studyItemId: session.studyItemId,
          },
        })
      )
    )

    return NextResponse.json(createdSessions)
  } catch (error) {
    console.error("Study sessions creation error:", error)
    return NextResponse.json(
      { error: "学習セッションの作成に失敗しました" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const studyItemId = searchParams.get("studyItemId")
    
    const whereClause = studyItemId 
      ? { studyItemId } 
      : {}
    
    const studySessions = await prisma.studySession.findMany({
      where: whereClause,
      orderBy: { startTime: "asc" },
      include: {
        studyItem: true,
      },
    })

    // 日付をISO文字列に変換
    const formattedSessions = studySessions.map(session => ({
      ...session,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime.toISOString(),
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
      studyItem: {
        ...session.studyItem,
        dueDate: session.studyItem.dueDate?.toISOString() || null,
        createdAt: session.studyItem.createdAt.toISOString(),
        updatedAt: session.studyItem.updatedAt.toISOString(),
      }
    }))

    return NextResponse.json(formattedSessions)
  } catch (error) {
    console.error("Study sessions fetch error:", error)
    return NextResponse.json(
      { error: "学習セッションの取得に失敗しました" },
      { status: 500 }
    )
  }
} 