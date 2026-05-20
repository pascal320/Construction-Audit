import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { SiteDetailClient } from '@/components/SiteDetailClient'
import type { SiteDetail } from '@/types'

async function getSiteDetail(siteId: string): Promise<SiteDetail | null> {
  const site = await db.constructionSite.findUnique({
    where: { id: siteId },
    include: {
      minutes: { orderBy: { number: 'desc' } },
      entities: {
        orderBy: { role: 'asc' },
        include: {
          issues: {
            orderBy: { sequenceNumber: 'asc' },
            include: {
              minute: { select: { id: true, code: true, number: true, date: true } },
              entity: { select: { id: true, role: true, name: true } },
            },
          },
        },
      },
    },
  })
  if (!site) return null

  const allMinutes = site.minutes.map((m) => ({
    id: m.id,
    code: m.code,
    number: m.number,
    date: m.date.toISOString(),
  }))

  return {
    id: site.id,
    code: site.code,
    name: site.name,
    location: site.location,
    latestMinute: allMinutes[0] ?? null,
    allMinutes,
    entities: site.entities.map((e) => ({
      id: e.id,
      role: e.role,
      name: e.name,
      issues: e.issues.map((i) => ({
        id: i.id,
        sequenceNumber: i.sequenceNumber,
        title: i.title,
        description: i.description,
        date: i.date.toISOString(),
        observations: i.observations,
        status: i.status,
        minute: { ...i.minute, date: i.minute.date.toISOString() },
        entity: i.entity,
      })),
    })),
  }
}

export default async function SitePage({ params }: { params: { siteId: string } }) {
  const site = await getSiteDetail(params.siteId)
  if (!site) notFound()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 mb-4 inline-block">
        ← Back to sites
      </Link>
      <div className="mb-1 text-xs font-mono text-slate-400 uppercase tracking-wide">{site.code}</div>
      <h1 className="text-2xl font-bold text-slate-800 mb-1">{site.name}</h1>
      <h2 className="text-base font-semibold text-slate-600 mb-6">Lista de Assuntos Pendentes</h2>
      <SiteDetailClient site={site} />
    </div>
  )
}
