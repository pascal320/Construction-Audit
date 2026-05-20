import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/context/LanguageContext'
import { LanguageToggle } from '@/components/LanguageToggle'
import { UploadButton } from '@/components/UploadButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RESSA – Construction Audit',
  description: 'Lista de Assuntos Pendentes – Construction site audit interface',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <LanguageProvider>
          <header className="border-b bg-white px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
            <div>
              <span className="font-bold text-lg text-slate-800">RESSA</span>
              <span className="ml-2 text-sm text-slate-400 hidden sm:inline">
                Construction Audit Interface
              </span>
            </div>
            <div className="flex items-center gap-3">
              <UploadButton />
              <LanguageToggle />
            </div>
          </header>
          <main className="min-h-screen bg-slate-50">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  )
}
