import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { IssueStatus } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const siteId       = searchParams.get('siteId')       ?? undefined
    const entityId     = searchParams.get('entityId')     ?? undefined
    const status       = searchParams.get('status')       as IssueStatus | null
    const minuteNumber = searchParams.get('minuteNumber')
    const q            = searchParams.get('q')            ?? undefined

    const issues = await db.issue.findMany({
      where: {
        ...(siteId   && { siteId }),
        ...(entityId && { entityId }),
        ...(status   && { status }),
        ...(minuteNumber && { minute: { number: parseInt(minuteNumber, 10) } }),
        ...(q && {
          OR: [
            { title:        { contains: q, mode: 'insensitive' } },
            { description:  { contains: q, mode: 'insensitive' } },
            { observations: { contains: q, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy: [{ entityId: 'asc' }, { sequenceNumber: 'asc' }],
      include: {
        entity: { select: { id: true, role: true, name: true } },
        minute: { select: { id: true, code: true, number: true, date: true } },
      },
    })
    return NextResponse.json(issues)
  } catch (error) {
    console.error('[GET /api/issues]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
