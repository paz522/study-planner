import type { Metadata } from 'next'

export function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Metadata {
  return {
    title: 'StudyPlanner',
    description: '効率的な学習計画で目標達成をサポートします。',
  }
} 