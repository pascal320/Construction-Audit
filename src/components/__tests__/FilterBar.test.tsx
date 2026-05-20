import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { FilterBar } from '../FilterBar'

const entities = [
  { id: 'e1', role: 'DONO_DE_OBRA', name: 'Câmara Municipal' },
  { id: 'e2', role: 'FISCALIZACAO', name: 'VHM' },
]
const minuteNumbers = [25, 26]

describe('FilterBar', () => {
  it('renders the search input', () => {
    render(
      <FilterBar
        entities={entities}
        minuteNumbers={minuteNumbers}
        filters={{}}
        onChange={vi.fn()}
        locale="en"
      />
    )
    expect(screen.getByPlaceholderText('Search issues…')).toBeTruthy()
  })

  it('shows Clear filters button when a filter is active', () => {
    render(
      <FilterBar
        entities={entities}
        minuteNumbers={minuteNumbers}
        filters={{ entityId: 'e1' }}
        onChange={vi.fn()}
        locale="en"
      />
    )
    expect(screen.getByText('Clear filters')).toBeTruthy()
  })

  it('does not show Clear filters button when no filters active', () => {
    render(
      <FilterBar
        entities={entities}
        minuteNumbers={minuteNumbers}
        filters={{}}
        onChange={vi.fn()}
        locale="en"
      />
    )
    expect(screen.queryByText('Clear filters')).toBeNull()
  })

  it('calls onChange with empty object when Clear filters clicked', () => {
    const onChange = vi.fn()
    render(
      <FilterBar
        entities={entities}
        minuteNumbers={minuteNumbers}
        filters={{ q: 'test' }}
        onChange={onChange}
        locale="en"
      />
    )
    fireEvent.click(screen.getByText('Clear filters'))
    expect(onChange).toHaveBeenCalledWith({})
  })
})
