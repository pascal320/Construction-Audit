import type { EntityWithIssues, IssueFull } from '@/types'
import { roleLabel, type Locale } from '@/lib/i18n'
import { IssueTable } from './IssueTable'

interface Props {
  entity: EntityWithIssues
  filteredIssues: IssueFull[]
  locale: Locale
  index: number
}

export function EntitySection({ entity, filteredIssues, locale, index }: Props) {
  if (filteredIssues.length === 0) return null
  return (
    <section className="mb-8">
      <div className="border-t-4 border-slate-700 pt-3 mb-3">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
          {index}. {roleLabel(locale, entity.role)} – {entity.name}
        </h2>
      </div>
      <IssueTable issues={filteredIssues} locale={locale} />
    </section>
  )
}
