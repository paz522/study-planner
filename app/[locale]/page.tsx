"use client"

import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Calendar, Clock, Target } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const t = useTranslations();
  const locale = t('common.locale') === 'ja' ? 'ja' : 'en';
  
  return (
    <div className="container py-12">
      {/* ヒーローセクション */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6">{t('home.hero.title')}</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t('home.hero.description')}
        </p>
        <div className="flex justify-center">
          <Button size="lg" variant="outline" asChild>
            <Link href={`/${locale}/about`}>
              {t('common.learnMore')}
            </Link>
          </Button>
        </div>
      </div>

      {/* 特徴セクション */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">{t('home.features.title')}</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="text-center">
              <GraduationCap className="w-12 h-12 mx-auto text-primary mb-2" />
              <CardTitle>{t('home.features.aiOptimization.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                {t('home.features.aiOptimization.description')}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <Calendar className="w-12 h-12 mx-auto text-primary mb-2" />
              <CardTitle>{t('home.features.scheduleManagement.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                {t('home.features.scheduleManagement.description')}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <Clock className="w-12 h-12 mx-auto text-primary mb-2" />
              <CardTitle>{t('home.features.progressTracking.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                {t('home.features.progressTracking.description')}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <Target className="w-12 h-12 mx-auto text-primary mb-2" />
              <CardTitle>{t('home.features.goalAchievement.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                {t('home.features.goalAchievement.description')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Steps Section */}
      <div className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">{t('home.steps.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('home.steps.setGoals.title')}</h3>
            <p className="text-muted-foreground">{t('home.steps.setGoals.description')}</p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('home.steps.generateSchedule.title')}</h3>
            <p className="text-muted-foreground">{t('home.steps.generateSchedule.description')}</p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('home.steps.startLearning.title')}</h3>
            <p className="text-muted-foreground">{t('home.steps.startLearning.description')}</p>
          </div>
        </div>
      </div>

      {/* CTAセクション */}
      <div className="text-center bg-primary/5 rounded-lg py-12 px-4">
        <h2 className="text-3xl font-bold mb-4">{t('home.cta.title')}</h2>
        <p className="text-lg text-muted-foreground mb-8">
          {t('home.cta.description')}
        </p>
        <Button size="lg" asChild>
          <Link href={`/${locale}/dashboard`}>
            {t('common.start')}
          </Link>
        </Button>
      </div>
    </div>
  )
} 