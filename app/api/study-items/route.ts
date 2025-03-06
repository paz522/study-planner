import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { addHours } from "date-fns"

export async function POST(req: Request) {
  try {
    // リクエストボディを取得
    const body = await req.json().catch(error => {
      console.error("リクエストボディの解析エラー:", error);
      throw new Error("リクエストボディの解析に失敗しました");
    });
    
    console.log("受信したリクエストボディ:", body);

    // 必須フィールドの検証
    if (!body.title) {
      return NextResponse.json(
        { error: "タイトルは必須です" },
        { status: 400 }
      );
    }

    // Prismaスキーマに存在するフィールドのみを抽出
    const studyItemData = {
      title: body.title,
      description: body.description || null,
      priority: body.priority || 1,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
    };

    console.log("作成する学習項目データ:", studyItemData);

    // トランザクションを使用して学習項目とセッションを同時に作成
    const result = await prisma.$transaction(async (tx) => {
      // 学習項目を作成
      const studyItem = await tx.studyItem.create({
        data: studyItemData,
      });
      
      // 学習項目に対応するセッションを作成（期限がある場合）
      if (studyItemData.dueDate) {
        const sessionStartTime = new Date(); // 現在時刻から始める
        const sessionEndTime = addHours(sessionStartTime, 1); // 1時間のセッション
        
        // 学習セッションを作成
        const studySession = await tx.studySession.create({
          data: {
            startTime: sessionStartTime,
            endTime: sessionEndTime,
            completed: false,
            notes: `${studyItem.title}の学習セッション`,
            studyItemId: studyItem.id,
          },
        });
        
        console.log("作成された学習セッション:", studySession);
        
        // 学習項目とセッションを返す
        return {
          studyItem,
          studySession
        };
      }
      
      // 期限がない場合は学習項目のみ返す
      return {
        studyItem,
        studySession: null
      };
    });

    console.log("作成された結果:", result);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Study item creation error:", error);
    return NextResponse.json(
      { 
        error: "学習項目の作成に失敗しました", 
        details: error.message || String(error),
        stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const studyItems = await prisma.studyItem.findMany({
      orderBy: [
        { priority: "desc" },
        { createdAt: "desc" },
      ],
    }).catch(error => {
      console.error("Prisma学習項目取得エラー:", error);
      throw new Error(`Prismaエラー: ${error.message}`);
    });

    // 日付をISO文字列に変換
    const formattedStudyItems = studyItems.map(item => ({
      ...item,
      dueDate: item.dueDate?.toISOString() || null,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedStudyItems);
  } catch (error: any) {
    console.error("Study items fetch error:", error);
    return NextResponse.json(
      { 
        error: "学習項目の取得に失敗しました",
        details: error.message || String(error)
      },
      { status: 500 }
    );
  }
} 