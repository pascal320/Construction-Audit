import type { IssueFull } from '@/types'
import { t, type Locale } from '@/lib/i18n'
import { IssueRow } from './IssueRow'

export function IssueTable({ issues, locale }: { issues: IssueFull[]; locale: Locale }) {
  if (issues.length === 0) {
    return <p className="text-sm text-slate-400 py-4 px-2">{t(locale, 'noIssuesFound')}</p>
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            <th className="py-2 px-4">{t(locale, 'colNumber')}</th>
            <th className="py-2 px-4">{t(locale, 'colSubject')}</th>
            <th className="py-2 px-4">{t(locale, 'colMinute')}</th>
            <th className="py-2 px-4">{t(locale, 'colDate')}</th>
            <th className="py-2 px-4">{t(locale, 'colObservations')}</th>
            <th className="py-2 px-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <IssueRow key={issue.id} issue={issue} locale={locale} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
