import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SiteListItem } from '@/types'
import type { Locale } from '@/lib/i18n'
import { SiteSummaryStats } from './SiteSummaryStats'

export function SiteCard({ site, locale }: { site: SiteListItem; locale: Locale }) {
  return (
    <Link href={`/sites/${site.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-2">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wide">{site.code}</div>
          <CardTitle className="text-base leading-snug text-slate-800">{site.name}</CardTitle>
          {site.location && <p className="text-xs text-slate-500">{site.location}</p>}
        </CardHeader>
        <CardContent>
          <SiteSummaryStats
            total={site._count.issues}
            pending={site.pendingCount}
            inProgress={site.inProgressCount}
            resolved={site.resolvedCount}
            locale={locale}
          />
        </CardContent>
      </Card>
    </Link>
  )
}
