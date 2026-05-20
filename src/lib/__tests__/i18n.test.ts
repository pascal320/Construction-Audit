import { describe, it, expect } from 'vitest'
import { t, roleLabel, statusLabel } from '../i18n'

describe('t()', () => {
  it('returns English string for en locale', () => {
    expect(t('en', 'statusPending')).toBe('Pending')
  })

  it('returns Portuguese string for pt locale', () => {
    expect(t('pt', 'statusPending')).toBe('Pendente')
  })

  it('returns Portuguese app subtitle for pt locale', () => {
    expect(t('pt', 'appSubtitle')).toBe('Interface de Acompanhamento de Obra')
  })
})

describe('roleLabel()', () => {
  it('returns English role label for DONO_DE_OBRA', () => {
    expect(roleLabel('en', 'DONO_DE_OBRA')).toBe('Project Owner')
  })

  it('returns Portuguese role label for FISCALIZACAO', () => {
    expect(roleLabel('pt', 'FISCALIZACAO')).toBe('Fiscalização')
  })

  it('returns Portuguese label for PROJETISTA', () => {
    expect(roleLabel('pt', 'PROJETISTA')).toBe('Projetista')
  })
})

describe('statusLabel()', () => {
  it('returns Pending for PENDING in English', () => {
    expect(statusLabel('en', 'PENDING')).toBe('Pending')
  })

  it('returns Em Curso for IN_PROGRESS in Portuguese', () => {
    expect(statusLabel('pt', 'IN_PROGRESS')).toBe('Em Curso')
  })

  it('returns Resolvido for RESOLVED in Portuguese', () => {
    expect(statusLabel('pt', 'RESOLVED')).toBe('Resolvido')
  })
})
