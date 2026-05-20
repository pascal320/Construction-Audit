import type { IssueStatus } from '@prisma/client'
import { statusLabel, type Locale } from '@/lib/i18n'

const colorMap: Record<IssueStatus, string> = {
  PENDING:     'bg-amber-100 text-amber-800 border-amber-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200',
  RESOLVED:    'bg-green-100 text-green-800 border-green-200',
}

export function StatusBadge({ status, locale }: { status: IssueStatus; locale: Locale }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorMap[status]}`}>
      {statusLabel(locale, status)}
    </span>
  )
}
