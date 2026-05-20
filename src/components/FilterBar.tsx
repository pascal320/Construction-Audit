'use client'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { t, roleLabel, statusLabel, type Locale } from '@/lib/i18n'
import type { IssueFilters } from '@/types'
import { IssueStatus } from '@prisma/client'

interface Props {
  entities: Array<{ id: string; role: string; name: string }>
  minuteNumbers: number[]
  filters: IssueFilters
  onChange: (filters: IssueFilters) => void
  locale: Locale
}

export function FilterBar({ entities, minuteNumbers, filters, onChange, locale }: Props) {
  const [searchInput, setSearchInput] = useState(filters.q ?? '')

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange({ ...filters, q: searchInput || undefined })
    }, 300)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  const hasActiveFilters = !!(filters.entityId || filters.status || filters.minuteNumber || filters.q)

  function clear() {
    setSearchInput('')
    onChange({})
  }

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-white border rounded-lg shadow-sm mb-6">
      <Input
        placeholder={t(locale, 'searchPlaceholder')}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="w-64"
      />
      <Select
        value={filters.entityId ?? 'all'}
        onValueChange={(v: string | null) => onChange({ ...filters, entityId: !v || v === 'all' ? undefined : v })}
      >
        <SelectTrigger className="w-52">
          <SelectValue placeholder={t(locale, 'allEntities')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t(locale, 'allEntities')}</SelectItem>
          {entities.map((e) => (
            <SelectItem key={e.id} value={e.id}>{roleLabel(locale, e.role)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.status ?? 'all'}
        onValueChange={(v: string | null) => onChange({ ...filters, status: !v || v === 'all' ? undefined : v as IssueStatus })}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder={t(locale, 'allStatuses')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t(locale, 'allStatuses')}</SelectItem>
          {(['PENDING', 'IN_PROGRESS', 'RESOLVED'] as IssueStatus[]).map((s) => (
            <SelectItem key={s} value={s}>{statusLabel(locale, s)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.minuteNumber?.toString() ?? 'all'}
        onValueChange={(v: string | null) => onChange({ ...filters, minuteNumber: !v || v === 'all' ? undefined : parseInt(v) })}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder={t(locale, 'allMinutes')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t(locale, 'allMinutes')}</SelectItem>
          {minuteNumbers.map((n) => (
            <SelectItem key={n} value={n.toString()}>Acta nº {n}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clear}>{t(locale, 'clearFilters')}</Button>
      )}
    </div>
  )
}
