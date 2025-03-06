import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// 学習セッションの詳細を取得
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    const studySession = await prisma.studySession.findUnique({
      where: { id },
      include: {
        studyItem: true,
      },
    })
    
    if (!studySession) {
      return NextResponse.json(
        { error: "学習セッションが見つかりません" },
        { status: 404 }
      )
    }
    
    // 日付をISO文字列に変換
    const formattedSession = {
      ...studySession,
      startTime: studySession.startTime.toISOString(),
      endTime: studySession.endTime.toISOString(),
      createdAt: studySession.createdAt.toISOString(),
      updatedAt: studySession.updatedAt.toISOString(),
      studyItem: {
        ...studySession.studyItem,
        dueDate: studySession.studyItem.dueDate?.toISOString() || null,
        createdAt: studySession.studyItem.createdAt.toISOString(),
        updatedAt: studySession.studyItem.updatedAt.toISOString(),
      }
    }
    
    return NextResponse.json(formattedSession)
  } catch (error) {
    console.error("Study session fetch error:", error)
    return NextResponse.json(
      { error: "学習セッションの取得に失敗しました" },
      { status: 500 }
    )
  }
}

// 学習セッションを更新
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await req.json()
    
    // 更新するフィールドを検証
    const updateData: any = {}
    
    if (body.completed !== undefined) {
      updateData.completed = body.completed
    }
    
    if (body.notes !== undefined) {
      updateData.notes = body.notes
    }
    
    if (body.startTime !== undefined) {
      updateData.startTime = new Date(body.startTime)
    }
    
    if (body.endTime !== undefined) {
      updateData.endTime = new Date(body.endTime)
    }
    
    // 更新するデータがない場合
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "更新するデータがありません" },
        { status: 400 }
      )
    }
    
    // 学習セッションを更新
    const updatedSession = await prisma.studySession.update({
      where: { id },
      data: updateData,
    })
    
    // 学習セッションが完了した場合、学習項目の進捗を更新
    if (body.completed === true) {
      // 学習項目の全セッションを取得
      const allSessions = await prisma.studySession.findMany({
        where: { studyItemId: updatedSession.studyItemId },
      })
      
      // 完了したセッションの数
      const completedSessions = allSessions.filter(session => session.completed).length
      
      // 進捗率を計算（完了したセッション数 / 全セッション数）
      const progress = Math.min(completedSessions / allSessions.length, 1)
      
      // 学習項目の進捗を更新
      await prisma.studyItem.update({
        where: { id: updatedSession.studyItemId },
        data: { progress },
      })
    }
    
    return NextResponse.json(updatedSession)
  } catch (error) {
    console.error("Study session update error:", error)
    return NextResponse.json(
      { error: "学習セッションの更新に失敗しました" },
      { status: 500 }
    )
  }
}

// 学習セッションを削除
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // 学習セッションを削除
    await prisma.studySession.delete({
      where: { id },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Study session delete error:", error)
    return NextResponse.json(
      { error: "学習セッションの削除に失敗しました" },
      { status: 500 }
    )
  }
} 