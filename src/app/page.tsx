import { db } from '@/lib/db'
import { SitesList } from '@/components/SitesList'

async function getSites() {
  const sites = await db.constructionSite.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { issues: true } },
      issues: { select: { status: true } },
    },
  })
  return sites.map((site) => ({
    id: site.id,
    code: site.code,
    name: site.name,
    location: site.location,
    _count: site._count,
    pendingCount:    site.issues.filter((i) => i.status === 'PENDING').length,
    inProgressCount: site.issues.filter((i) => i.status === 'IN_PROGRESS').length,
    resolvedCount:   site.issues.filter((i) => i.status === 'RESOLVED').length,
  }))
}

export default async function HomePage() {
  const sites = await getSites()
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Construction Sites</h1>
      <SitesList sites={sites} />
    </div>
  )
}
