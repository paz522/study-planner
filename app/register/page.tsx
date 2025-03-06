import { Metadata } from "next"
import Link from "next/link"
import { RegisterForm } from "@/components/register-form"

export const metadata: Metadata = {
  title: "新規登録 - StudyPlanner",
  description: "アカウントを作成して学習を始めましょう",
}

export default function RegisterPage() {
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/">StudyPlanner</Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "効率的な学習計画で、あなたの目標達成をサポートします。"
            </p>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              アカウントを作成
            </h1>
            <p className="text-sm text-muted-foreground">
              以下の情報を入力して登録してください
            </p>
          </div>
          <RegisterForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            すでにアカウントをお持ちの場合は{" "}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              ログイン
            </Link>
            してください
          </p>
        </div>
      </div>
    </div>
  )
} 