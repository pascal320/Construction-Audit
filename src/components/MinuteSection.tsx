'use client'
import { useState } from 'react'
import type { IssueFull, MinuteSummary, EntityWithIssues } from '@/types'
import { roleLabel, t, type Locale } from '@/lib/i18n'
import { IssueTable } from './IssueTable'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface Props {
  minute: MinuteSummary
  allIssues: IssueFull[]
  entities: EntityWithIssues[]
  locale: Locale
  defaultOpen?: boolean
}

export function MinuteSection({ minute, allIssues, entities, locale, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const minuteIssues = allIssues.filter((i) => i.minute.id === minute.id)
  const date = new Date(minute.date).toLocaleDateString(locale === 'pt' ? 'pt-PT' : 'en-GB')

  return (
    <section className="mb-4 border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          {open ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
          <span className="font-semibold text-slate-800">
            {t(locale, 'minuteRef')} {minute.number}
          </span>
          <span className="text-sm text-slate-500">— {date}</span>
        </div>
        <span className="text-xs text-slate-400 bg-slate-200 rounded-full px-2 py-0.5">
          {minuteIssues.length} {t(locale, 'issues')}
        </span>
      </button>

      {open && (
        <div className="px-4 py-4">
          {minuteIssues.length === 0 ? (
            <p className="text-sm text-slate-400">{t(locale, 'noIssuesInMinute')}</p>
          ) : (
            entities
              .filter((e) => minuteIssues.some((i) => i.entity.id === e.id))
              .map((entity, idx) => {
                const entityIssues = minuteIssues.filter((i) => i.entity.id === entity.id)
                return (
                  <div key={entity.id} className="mb-6">
                    <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide border-t-2 border-slate-300 pt-2 mb-2">
                      {idx + 1}. {roleLabel(locale, entity.role)} – {entity.name}
                    </h3>
                    <IssueTable issues={entityIssues} locale={locale} />
                  </div>
                )
              })
          )}
        </div>
      )}
    </section>
  )
}
