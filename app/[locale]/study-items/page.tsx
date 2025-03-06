"use client"

import { StudyItemAddForm } from "@/components/study-item-add-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StudyItemsList } from "@/components/study-items-list"
import { useTranslations } from 'next-intl'

export default function StudyItemsPage() {
  const t = useTranslations();
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('studyItems.title')}</h1>
        <StudyItemAddForm />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('studyItems.list.title')}</CardTitle>
          <CardDescription>{t('studyItems.list.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <StudyItemsList detailed />
        </CardContent>
      </Card>
    </div>
  )
} 