import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { TrendingUp, BarChart3, Target, Trash2 } from 'lucide-react'
import { useProject } from '@/contexts/ProjectContext'
import { useApp } from '@/contexts/AppContext'
import { recomputeStatuses } from '@/types/models'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

function statusToValue(status: string): number {
  if (status === 'done') return 100
  if (status === 'in_progress') return 50
  return 0
}

export function ProjectDashboardPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { state } = useProject()
  const { deleteProject } = useApp()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const project = recomputeStatuses(state.project)
  const totalProgress = Math.round(
    (statusToValue(project.marketResearch.status) +
      statusToValue(project.competitiveAnalysis.status) +
      statusToValue(project.gtmPlan.status)) /
      3,
  )

  function handleDelete() {
    deleteProject(project.id)
    navigate('/')
  }

  const sections = [
    {
      key: 'market',
      label: t('nav.market'),
      icon: TrendingUp,
      status: project.marketResearch.status,
      path: `/projects/${project.id}/market`,
    },
    {
      key: 'competitive',
      label: t('nav.competitive'),
      icon: BarChart3,
      status: project.competitiveAnalysis.status,
      path: `/projects/${project.id}/competitive`,
    },
    {
      key: 'gtm',
      label: t('nav.gtm'),
      icon: Target,
      status: project.gtmPlan.status,
      path: `/projects/${project.id}/gtm`,
    },
  ]

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {project.targetMarket} · {project.foodCategory}
          </p>
          {project.targetDate && (
            <p className="mt-0.5 text-xs text-slate-400">
              {new Date(project.targetDate).toLocaleDateString()}
            </p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={() => setConfirmOpen(true)}>
          <Trash2 className="h-4 w-4 text-red-500" />
          {t('common.delete')}
        </Button>
      </div>

      {/* Progress summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('project.dashboard.progress')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Progress value={totalProgress} className="flex-1" />
            <span className="text-sm font-medium text-slate-700">{totalProgress}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Section cards */}
      <div className="grid gap-4">
        {sections.map(({ key, label, icon: Icon, status, path }) => (
          <Card key={key}>
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="font-medium text-slate-900">{label}</p>
                  <StatusBadge status={status} />
                </div>
              </div>
              <Button size="sm" onClick={() => navigate(path)}>
                {t('common.edit')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t('common.confirm')}
        description={t('project.delete.confirm')}
        onConfirm={handleDelete}
      />
    </div>
  )
}
