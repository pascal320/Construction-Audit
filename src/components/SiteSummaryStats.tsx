import { t, type Locale } from '@/lib/i18n'

interface Props {
  total: number
  pending: number
  inProgress: number
  resolved: number
  locale: Locale
}

export function SiteSummaryStats({ total, pending, inProgress, resolved, locale }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <span className="text-sm text-slate-500">{total} {t(locale, 'issues')}</span>
      <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-xs font-medium">
        {pending} {t(locale, 'statusPending')}
      </span>
      {inProgress > 0 && (
        <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-xs font-medium">
          {inProgress} {t(locale, 'statusInProgress')}
        </span>
      )}
      {resolved > 0 && (
        <span className="inline-flex items-center rounded-full bg-green-100 text-green-800 px-2 py-0.5 text-xs font-medium">
          {resolved} {t(locale, 'statusResolved')}
        </span>
      )}
    </div>
  )
}
