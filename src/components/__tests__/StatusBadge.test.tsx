import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from '../StatusBadge'

describe('StatusBadge', () => {
  it('renders "Pending" for PENDING in English', () => {
    render(<StatusBadge status="PENDING" locale="en" />)
    expect(screen.getByText('Pending')).toBeTruthy()
  })

  it('renders "Pendente" for PENDING in Portuguese', () => {
    render(<StatusBadge status="PENDING" locale="pt" />)
    expect(screen.getByText('Pendente')).toBeTruthy()
  })

  it('renders "Em Curso" for IN_PROGRESS in Portuguese', () => {
    render(<StatusBadge status="IN_PROGRESS" locale="pt" />)
    expect(screen.getByText('Em Curso')).toBeTruthy()
  })

  it('applies amber color class for PENDING', () => {
    const { container } = render(<StatusBadge status="PENDING" locale="en" />)
    expect(container.firstChild).toHaveClass('bg-amber-100')
  })

  it('applies blue color class for IN_PROGRESS', () => {
    const { container } = render(<StatusBadge status="IN_PROGRESS" locale="en" />)
    expect(container.firstChild).toHaveClass('bg-blue-100')
  })

  it('applies green color class for RESOLVED', () => {
    const { container } = render(<StatusBadge status="RESOLVED" locale="en" />)
    expect(container.firstChild).toHaveClass('bg-green-100')
  })
})
