import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: { siteId: string } }) {
  try {
    const site = await db.constructionSite.findUnique({
      where: { id: params.siteId },
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
    if (!site) return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    return NextResponse.json(site)
  } catch (error) {
    console.error('[GET /api/sites/:id]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
