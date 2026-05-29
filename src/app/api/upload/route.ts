import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { extractFromText, parseExtractionResponse } from '@/lib/extract'
import type { EntityRole, IssueStatus } from '@prisma/client'

export const dynamic = 'force-dynamic'

async function extractText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())

  if (file.name.endsWith('.pdf')) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse') as (buf: Buffer) => Promise<{ text: string }>
    const data = await pdfParse(buffer)
    return data.text
  }

  if (file.name.endsWith('.docx')) {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  }

  throw new Error(`Unsupported file type: ${file.name}`)
}

async function upsertExtraction(extraction: Awaited<ReturnType<typeof parseExtractionResponse>>, fileName: string) {
  const site = await db.constructionSite.upsert({
    where: { code: extraction.siteCode },
    update: { name: extraction.siteName },
    create: { code: extraction.siteCode, name: extraction.siteName },
  })

  const minute = await db.minute.upsert({
    where: { siteId_number: { siteId: site.id, number: extraction.minuteNumber } },
    update: { sourceDocumentName: fileName },
    create: {
      siteId: site.id,
      code: extraction.minuteCode,
      number: extraction.minuteNumber,
      date: new Date(extraction.minuteDate),
      sourceDocumentName: fileName,
    },
  })

  let totalIssues = 0

  for (const entityData of extraction.entities) {
    const entity = await db.entity.upsert({
      where: { siteId_role: { siteId: site.id, role: entityData.role as EntityRole } },
      update: { name: entityData.name },
      create: { siteId: site.id, role: entityData.role as EntityRole, name: entityData.name },
    })

    for (const issueData of entityData.issues) {
      await db.issue.upsert({
        where: { entityId_sequenceNumber: { entityId: entity.id, sequenceNumber: issueData.sequenceNumber } },
        update: {
          title: issueData.title,
          description: issueData.description,
          observations: issueData.observations,
          status: issueData.status as IssueStatus,
          minuteId: minute.id,
          date: new Date(extraction.minuteDate),
        },
        create: {
          siteId: site.id,
          entityId: entity.id,
          minuteId: minute.id,
          sequenceNumber: issueData.sequenceNumber,
          title: issueData.title,
          description: issueData.description,
          observations: issueData.observations,
          status: issueData.status as IssueStatus,
          date: new Date(extraction.minuteDate),
        },
      })
      totalIssues++
    }
  }

  return {
    siteName: site.name,
    minuteCode: minute.code,
    entityCount: extraction.entities.length,
    issueCount: totalIssues,
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
      return NextResponse.json({ error: 'Only .pdf and .docx files are supported' }, { status: 400 })
    }

    const rawText = await extractText(file)
    const extraction = await extractFromText(rawText)
    const summary = await upsertExtraction(extraction, file.name)

    return NextResponse.json(summary)
  } catch (error) {
    console.error('[POST /api/upload]', error)
    const message = error instanceof Error ? error.message : 'Extraction failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
