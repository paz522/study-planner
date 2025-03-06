import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(req: Request, { params }: RouteParams) {
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

    const studySessions = await prisma.studySession.findMany({
      where: {
        studyItemId: params.id,
      },
      orderBy: {
        startTime: "asc",
      },
    })

    return NextResponse.json(studySessions)
  } catch (error) {
    console.error("Study sessions fetch error:", error)
    return NextResponse.json(
      { error: "学習セッションの取得に失敗しました" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request, { params }: RouteParams) {
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

    if (!data.startTime || !data.endTime) {
      return NextResponse.json(
        { error: "開始時間と終了時間は必須です" },
        { status: 400 }
      )
    }

    const studySession = await prisma.studySession.create({
      data: {
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        completed: data.completed || false,
        notes: data.notes || null,
        studyItemId: params.id,
      },
    })

    return NextResponse.json(studySession)
  } catch (error) {
    console.error("Study session creation error:", error)
    return NextResponse.json(
      { error: "学習セッションの作成に失敗しました" },
      { status: 500 }
    )
  }
} 