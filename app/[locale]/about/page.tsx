"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Users, Zap, Target, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useTranslations } from 'next-intl'

export default function AboutPage() {
  const t = useTranslations();
  const locale = t('common.locale') === 'ja' ? 'ja' : 'en';

  const aiOptimizationBenefits = [
    t('about.features.aiOptimization.benefits.0'),
    t('about.features.aiOptimization.benefits.1'),
    t('about.features.aiOptimization.benefits.2')
  ];

  const personalizedBenefits = [
    t('about.features.personalizedExperience.benefits.0'),
    t('about.features.personalizedExperience.benefits.1'),
    t('about.features.personalizedExperience.benefits.2')
  ];

  return (
    <div className="container py-12">
      {/* メインセクション */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">{t('about.intro.title')}</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t('about.intro.description')}
        </p>
      </div>

      {/* 主な特徴 */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <Card>
          <CardHeader>
            <Brain className="w-12 h-12 text-primary mb-4" />
            <CardTitle>{t('about.features.aiOptimization.title')}</CardTitle>
            <CardDescription>
              {t('about.features.aiOptimization.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {aiOptimizationBenefits.map((benefit: string) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="w-12 h-12 text-primary mb-4" />
            <CardTitle>{t('about.features.personalizedExperience.title')}</CardTitle>
            <CardDescription>
              {t('about.features.personalizedExperience.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {personalizedBenefits.map((benefit: string) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* 利用シーン */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">{t('about.recommended.title')}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: t('about.recommended.students.title'),
              description: t('about.recommended.students.description'),
            },
            {
              title: t('about.recommended.professionals.title'),
              description: t('about.recommended.professionals.description'),
            },
            {
              title: t('about.recommended.selfImprovement.title'),
              description: t('about.recommended.selfImprovement.description'),
            },
          ].map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTAセクション */}
      <div className="text-center bg-primary/5 rounded-lg py-12 px-4">
        <h2 className="text-3xl font-bold mb-4">{t('about.cta.title')}</h2>
        <p className="text-lg text-muted-foreground mb-8">
          {t('about.cta.description')}
        </p>
        <Button size="lg" asChild>
          <Link href={`/${locale}/dashboard`}>
            {t('common.start')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
} 