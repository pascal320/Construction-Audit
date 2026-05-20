'use client'
import { useLanguage } from '@/context/LanguageContext'
import { Button } from '@/components/ui/button'

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage()
  return (
    <div className="flex gap-1 rounded-md border p-0.5 bg-slate-100">
      <Button
        size="sm"
        variant={locale === 'pt' ? 'default' : 'ghost'}
        className="h-7 px-3 text-xs"
        onClick={() => setLocale('pt')}
      >
        PT
      </Button>
      <Button
        size="sm"
        variant={locale === 'en' ? 'default' : 'ghost'}
        className="h-7 px-3 text-xs"
        onClick={() => setLocale('en')}
      >
        EN
      </Button>
    </div>
  )
}
