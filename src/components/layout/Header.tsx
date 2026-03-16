import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { setLanguage, type SupportedLanguage } from '@/i18n/config'
import { cn } from '@/lib/utils'
import type { SaveStatus } from '@/types/store'

interface HeaderProps {
  saveStatus?: SaveStatus
}

export function Header({ saveStatus }: HeaderProps) {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language as SupportedLanguage

  function handleLangToggle(lang: SupportedLanguage) {
    setLanguage(lang)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white no-print">
      <div className="flex h-14 items-center justify-between px-6">
        <Link to="/" className="text-base font-semibold text-slate-900 hover:text-blue-600">
          {t('common.appName')}
        </Link>

        <div className="flex items-center gap-4">
          {/* Save status indicator */}
          {saveStatus && (
            <span
              className={cn(
                'text-xs',
                saveStatus.type === 'saving' && 'text-slate-500',
                saveStatus.type === 'saved' && 'text-green-600',
                saveStatus.type === 'error' && 'text-red-600 font-medium',
              )}
            >
              {saveStatus.type === 'saving' && t('common.saving')}
              {saveStatus.type === 'saved' && t('common.saved')}
              {saveStatus.type === 'error' && t('common.error')}
            </span>
          )}

          {/* Language toggle */}
          <div className="flex items-center rounded-md border border-slate-200 overflow-hidden">
            {(['ja', 'en'] as SupportedLanguage[]).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLangToggle(lang)}
                className={cn(
                  'px-3 py-1 text-xs font-medium transition-colors',
                  currentLang === lang
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50',
                )}
                aria-label={`Switch to ${lang === 'ja' ? '日本語' : 'English'}`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
