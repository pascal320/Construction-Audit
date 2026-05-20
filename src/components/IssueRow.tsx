import type { IssueFull } from '@/types'
import type { Locale } from '@/lib/i18n'
import { StatusBadge } from './StatusBadge'

export function IssueRow({ issue, locale }: { issue: IssueFull; locale: Locale }) {
  const date = new Date(issue.date).toLocaleDateString(locale === 'pt' ? 'pt-PT' : 'en-GB')
  return (
    <tr className="border-b hover:bg-slate-50 align-top">
      <td className="py-3 px-4 text-sm font-medium text-slate-700 w-12">{issue.sequenceNumber}</td>
      <td className="py-3 px-4">
        <p className="text-sm font-semibold text-slate-800">{issue.title}</p>
        <p className="text-xs text-slate-500 mt-1 line-clamp-3">{issue.description}</p>
      </td>
      <td className="py-3 px-4 text-sm text-slate-600 whitespace-nowrap">{issue.minute.code}</td>
      <td className="py-3 px-4 text-sm text-slate-600 whitespace-nowrap">{date}</td>
      <td className="py-3 px-4 text-xs text-slate-500 max-w-xs">{issue.observations}</td>
      <td className="py-3 px-4 whitespace-nowrap">
        <StatusBadge status={issue.status} locale={locale} />
      </td>
    </tr>
  )
}
