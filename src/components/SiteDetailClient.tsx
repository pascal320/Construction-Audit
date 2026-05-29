'use client'
import { useState, useMemo } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/i18n'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { SiteDetail, IssueFilters, IssueFull } from '@/types'
import { FilterBar } from './FilterBar'
import { EntitySection } from './EntitySection'
import { MinuteSection } from './MinuteSection'

export function SiteDetailClient({ site }: { site: SiteDetail }) {
  const { locale } = useLanguage()
  const [filters, setFilters] = useState<IssueFilters>({})

  const allIssues: IssueFull[] = site.entities.flatMap((e) => e.issues)

  const filteredIssues = useMemo(() => {
    return allIssues.filter((issue) => {
      if (filters.entityId && issue.entity.id !== filters.entityId) return false
      if (filters.status   && issue.status !== filters.status)     return false
      if (filters.minuteNumber && issue.minute.number !== filters.minuteNumber) return false
      if (filters.q) {
        const lq = filters.q.toLowerCase()
        return (
          issue.title.toLowerCase().includes(lq) ||
          issue.description.toLowerCase().includes(lq) ||
          (issue.observations ?? '').toLowerCase().includes(lq)
        )
      }
      return true
    })
  }, [allIssues, filters])

  const entities = site.entities.map((e) => ({ id: e.id, role: e.role as string, name: e.name }))
  const minuteNumbers = Array.from(new Set(allIssues.map((i) => i.minute.number))).sort((a, b) => a - b)

  const latestDate = site.latestMinute
    ? new Date(site.latestMinute.date).toLocaleDateString(locale === 'pt' ? 'pt-PT' : 'en-GB')
    : ''

  // Sorted minutes newest-first for the By Minutes tab
  const sortedMinutes = [...site.allMinutes].sort((a, b) => b.number - a.number)

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-slate-500">
          {t(locale, 'situation')} {latestDate}
          {site.latestMinute && ` (${t(locale, 'minuteRef')} ${site.latestMinute.number})`}
        </p>
      </div>

      <FilterBar
        entities={entities}
        minuteNumbers={minuteNumbers}
        filters={filters}
        onChange={setFilters}
        locale={locale}
      />

      <Tabs defaultValue="entity">
        <TabsList className="mb-6">
          <TabsTrigger value="entity">{t(locale, 'byEntity')}</TabsTrigger>
          <TabsTrigger value="minutes">{t(locale, 'byMinutes')}</TabsTrigger>
        </TabsList>

        <TabsContent value="minutes">
          {sortedMinutes.map((minute, idx) => (
            <MinuteSection
              key={minute.id}
              minute={minute}
              allIssues={filteredIssues}
              entities={site.entities}
              locale={locale}
              defaultOpen={idx === 0}
            />
          ))}
        </TabsContent>

        <TabsContent value="entity">
          {site.entities.map((entity, idx) => (
            <EntitySection
              key={entity.id}
              entity={entity}
              filteredIssues={filteredIssues.filter((i) => i.entity.id === entity.id)}
              locale={locale}
              index={idx + 1}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
