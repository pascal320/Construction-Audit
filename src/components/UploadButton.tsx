'use client'
import { useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'

interface UploadSummary {
  siteName: string
  minuteCode: string
  entityCount: number
  issueCount: number
}

export function UploadButton({ onSuccess }: { onSuccess?: () => void }) {
  const { locale } = useLanguage()
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  async function handleFile(file: File) {
    setLoading(true)
    setToast(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Unknown error')
      const summary = data as UploadSummary
      setToast({
        type: 'success',
        message: `${summary.minuteCode} — ${summary.issueCount} ${t(locale, 'issues')} ${t(locale, 'uploadSuccess')}`,
      })
      onSuccess?.()
    } catch (err) {
      setToast({ type: 'error', message: err instanceof Error ? err.message : t(locale, 'uploadError') })
    } finally {
      setLoading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
      <Button
        size="sm"
        variant="outline"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        {loading ? t(locale, 'uploading') : t(locale, 'uploadMinutes')}
      </Button>
      {toast && (
        <div
          className={`absolute right-0 top-10 z-20 rounded-md px-4 py-2 text-sm shadow-md min-w-max ${
            toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}
