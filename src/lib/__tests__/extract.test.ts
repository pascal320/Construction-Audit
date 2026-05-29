import { describe, it, expect } from 'vitest'
import { parseExtractionResponse } from '../extract'

describe('parseExtractionResponse()', () => {
  it('parses a well-formed Claude JSON response into ExtractionResult', () => {
    const raw = JSON.stringify({
      siteCode: 'ES_AMADORA',
      siteName: 'ES Amadora – Ampliação da Biblioteca',
      minuteCode: 'AR_CO_026',
      minuteNumber: 26,
      minuteDate: '2026-03-19',
      entities: [
        {
          role: 'DONO_DE_OBRA',
          name: 'Câmara Municipal da Amadora',
          issues: [
            {
              sequenceNumber: 1,
              title: 'Fechaduras',
              description: 'Decisão sobre fechaduras.',
              observations: 'Aguarda decisão.',
              status: 'PENDING',
            },
          ],
        },
      ],
    })

    const result = parseExtractionResponse(raw)

    expect(result.siteCode).toBe('ES_AMADORA')
    expect(result.minuteNumber).toBe(26)
    expect(result.entities).toHaveLength(1)
    expect(result.entities[0].issues).toHaveLength(1)
    expect(result.entities[0].issues[0].title).toBe('Fechaduras')
  })

  it('throws when response is not valid JSON', () => {
    expect(() => parseExtractionResponse('not json')).toThrow()
  })

  it('throws when required fields are missing', () => {
    const raw = JSON.stringify({ siteCode: 'X' })
    expect(() => parseExtractionResponse(raw)).toThrow()
  })

  it('normalises status values to uppercase', () => {
    const raw = JSON.stringify({
      siteCode: 'X',
      siteName: 'X Site',
      minuteCode: 'AR_CO_001',
      minuteNumber: 1,
      minuteDate: '2026-01-01',
      entities: [
        {
          role: 'PROJETISTA',
          name: 'Arch Co',
          issues: [{ sequenceNumber: 1, title: 'T', description: 'D', observations: 'O', status: 'pending' }],
        },
      ],
    })
    const result = parseExtractionResponse(raw)
    expect(result.entities[0].issues[0].status).toBe('PENDING')
  })
})
