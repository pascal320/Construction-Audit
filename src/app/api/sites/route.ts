import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const sites = await db.constructionSite.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { issues: true } },
        issues: { select: { status: true } },
      },
    })
    return NextResponse.json(
      sites.map((site) => ({
        id: site.id,
        code: site.code,
        name: site.name,
        location: site.location,
        _count: site._count,
        pendingCount:    site.issues.filter((i) => i.status === 'PENDING').length,
        inProgressCount: site.issues.filter((i) => i.status === 'IN_PROGRESS').length,
        resolvedCount:   site.issues.filter((i) => i.status === 'RESOLVED').length,
      }))
    )
  } catch (error) {
    console.error('[GET /api/sites]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
