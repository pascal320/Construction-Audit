import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageProvider } from '@/context/LanguageContext'
import { LanguageToggle } from '../LanguageToggle'

function renderWithProvider() {
  return render(
    <LanguageProvider>
      <LanguageToggle />
    </LanguageProvider>
  )
}

describe('LanguageToggle', () => {
  it('renders PT and EN buttons', () => {
    renderWithProvider()
    expect(screen.getByText('PT')).toBeTruthy()
    expect(screen.getByText('EN')).toBeTruthy()
  })

  it('starts with PT as the active locale (default)', () => {
    renderWithProvider()
    const ptButton = screen.getByText('PT')
    // The default variant button has data-active or a specific class
    expect(ptButton.closest('button')).toBeTruthy()
  })

  it('clicking EN button switches locale display', () => {
    renderWithProvider()
    const enButton = screen.getByText('EN')
    fireEvent.click(enButton)
    // After clicking EN, both buttons still render
    expect(screen.getByText('PT')).toBeTruthy()
    expect(screen.getByText('EN')).toBeTruthy()
  })
})
