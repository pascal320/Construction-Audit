'use client'
import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/i18n'
import { SiteCard } from './SiteCard'
import type { SiteListItem } from '@/types'

export function SitesList({ sites }: { sites: SiteListItem[] }) {
  const { locale } = useLanguage()
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">{t(locale, 'constructionSites')}</h1>
      {sites.length === 0 ? (
        <p className="text-slate-400">{t(locale, 'noSites')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sites.map((site) => (
            <SiteCard key={site.id} site={site} locale={locale} />
          ))}
        </div>
      )}
    </div>
  )
}
