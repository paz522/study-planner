import { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/login-form"

export const metadata: Metadata = {
  title: "ログイン - StudyPlanner",
  description: "アカウントにログインして学習を管理しましょう",
}

export default function LoginPage() {
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
              アカウントにログイン
            </h1>
            <p className="text-sm text-muted-foreground">
              メールアドレスとパスワードを入力してください
            </p>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            アカウントをお持ちでない場合は{" "}
            <Link
              href="/register"
              className="underline underline-offset-4 hover:text-primary"
            >
              新規登録
            </Link>
            してください
          </p>
        </div>
      </div>
    </div>
  )
} 