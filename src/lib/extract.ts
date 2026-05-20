import Anthropic from '@anthropic-ai/sdk'
import type { ExtractionResult } from '@/types'

const EXTRACTION_PROMPT = `You are extracting structured data from a Portuguese construction site meeting minutes document (Lista de Assuntos Pendentes).

Extract the following and return ONLY valid JSON matching this exact structure:
{
  "siteCode": "string (uppercase, underscored, e.g. ES_AMADORA)",
  "siteName": "string (full project name)",
  "minuteCode": "string (e.g. AR_CO_026)",
  "minuteNumber": number,
  "minuteDate": "YYYY-MM-DD",
  "entities": [
    {
      "role": "one of: DONO_DE_OBRA | FISCALIZACAO | PROJETISTA | ENTIDADE_EXECUTANTE",
      "name": "string (full entity name)",
      "issues": [
        {
          "sequenceNumber": number,
          "title": "string",
          "description": "string (full description text)",
          "observations": "string (Observações / Estado text)",
          "status": "one of: PENDING | IN_PROGRESS | RESOLVED"
        }
      ]
    }
  ]
}

Rules:
- Infer status from observations: commitments to resolve soon = IN_PROGRESS, already resolved = RESOLVED, waiting/no action = PENDING
- siteCode: derive from site name (uppercase, replace spaces/special chars with underscores)
- Exclude the Entidade Executante (contractor) entity if the document says it is excluded
- Return ONLY the JSON object, no markdown, no explanation`

export function parseExtractionResponse(raw: string): ExtractionResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error(`Claude returned invalid JSON: ${raw.slice(0, 100)}`)
  }

  const data = parsed as Record<string, unknown>
  if (!data.siteCode || !data.siteName || !data.minuteCode || !data.minuteNumber || !data.minuteDate || !Array.isArray(data.entities)) {
    throw new Error('Extracted data is missing required fields')
  }

  return {
    siteCode: String(data.siteCode),
    siteName: String(data.siteName),
    minuteCode: String(data.minuteCode),
    minuteNumber: Number(data.minuteNumber),
    minuteDate: String(data.minuteDate),
    entities: (data.entities as Array<Record<string, unknown>>).map((e) => ({
      role: String(e.role),
      name: String(e.name),
      issues: (Array.isArray(e.issues) ? e.issues : []).map((i: Record<string, unknown>) => ({
        sequenceNumber: Number(i.sequenceNumber),
        title: String(i.title),
        description: String(i.description),
        observations: String(i.observations ?? ''),
        status: String(i.status ?? 'PENDING').toUpperCase(),
      })),
    })),
  }
}

export async function extractFromText(rawText: string): Promise<ExtractionResult> {
  const client = new Anthropic()
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `${EXTRACTION_PROMPT}\n\nDocument text:\n${rawText}`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type from Claude')

  return parseExtractionResponse(content.text)
}
