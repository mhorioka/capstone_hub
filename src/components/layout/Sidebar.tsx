import { NavLink, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LayoutDashboard, TrendingUp, BarChart3, Target, FileText } from 'lucide-react'
import { StatusBadge } from '@/components/common/StatusBadge'
import { cn } from '@/lib/utils'
import type { SectionStatus } from '@/types/models'

interface SidebarProps {
  marketStatus: SectionStatus
  competitiveStatus: SectionStatus
  gtmStatus: SectionStatus
}

export function Sidebar({ marketStatus, competitiveStatus, gtmStatus }: SidebarProps) {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()

  const navItems = [
    {
      to: `/projects/${id}`,
      end: true,
      icon: LayoutDashboard,
      label: t('nav.dashboard'),
      status: null,
    },
    {
      to: `/projects/${id}/market`,
      end: false,
      icon: TrendingUp,
      label: t('nav.market'),
      status: marketStatus,
    },
    {
      to: `/projects/${id}/competitive`,
      end: false,
      icon: BarChart3,
      label: t('nav.competitive'),
      status: competitiveStatus,
    },
    {
      to: `/projects/${id}/gtm`,
      end: false,
      icon: Target,
      label: t('nav.gtm'),
      status: gtmStatus,
    },
    {
      to: `/projects/${id}/report`,
      end: false,
      icon: FileText,
      label: t('nav.report'),
      status: null,
    },
  ]

  return (
    <aside className="w-60 shrink-0 border-r border-slate-200 bg-white no-print">
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              )
            }
          >
            <span className="flex items-center gap-2">
              <item.icon className="h-4 w-4" />
              {item.label}
            </span>
            {item.status && <StatusBadge status={item.status} />}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
