import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus, FolderOpen } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { useApp } from '@/contexts/AppContext'
import { Header } from '@/components/layout/Header'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Project } from '@/types/models'
import { INPUT_MAX } from '@/lib/constants'

const EMPTY_MARKET_RESEARCH = {
  status: 'empty' as const,
  overview: { marketSize: '', cagr: '', definition: '' },
  segments: [],
  consumerInsights: [],
  barriers: [],
  trends: [],
}

const EMPTY_COMPETITIVE_ANALYSIS = {
  status: 'empty' as const,
  competitors: [],
  positioningMap: { xAxisLabel: '', yAxisLabel: '', plots: [] },
  swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
  differentiators: '',
}

const EMPTY_GTM_PLAN = {
  status: 'empty' as const,
  personas: [],
  entryStrategy: { channels: [], pricingStrategy: '' },
  initiatives: [],
  phases: [],
  kpis: [],
}

export function ProjectListPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { state, createProject } = useApp()

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', targetMarket: '', foodCategory: '', targetDate: '' })

  const isValid = form.name.trim() && form.targetMarket.trim() && form.foodCategory.trim() && form.targetDate

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return

    const now = new Date().toISOString()
    const project: Project = {
      id: uuidv4(),
      name: form.name.trim(),
      targetMarket: form.targetMarket.trim(),
      foodCategory: form.foodCategory.trim(),
      targetDate: form.targetDate,
      createdAt: now,
      updatedAt: now,
      marketResearch: EMPTY_MARKET_RESEARCH,
      competitiveAnalysis: EMPTY_COMPETITIVE_ANALYSIS,
      gtmPlan: EMPTY_GTM_PLAN,
    }

    createProject(project)
    setForm({ name: '', targetMarket: '', foodCategory: '', targetDate: '' })
    setShowForm(false)
    navigate(`/projects/${project.id}`)
  }

  // Sort by most recently updated
  const sorted = [...state.projects].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">{t('project.list.title')}</h1>
            <Button onClick={() => setShowForm((v) => !v)}>
              <Plus className="h-4 w-4" />
              {t('project.list.createNew')}
            </Button>
          </div>

          {/* Create form */}
          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t('project.create.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="proj-name">
                      {t('project.create.name')} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="proj-name"
                      placeholder={t('project.create.namePlaceholder')}
                      maxLength={INPUT_MAX.SHORT}
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="proj-market">
                      {t('project.create.targetMarket')} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="proj-market"
                      placeholder={t('project.create.targetMarketPlaceholder')}
                      maxLength={INPUT_MAX.SHORT}
                      value={form.targetMarket}
                      onChange={(e) => setForm((f) => ({ ...f, targetMarket: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="proj-category">
                      {t('project.create.foodCategory')} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="proj-category"
                      placeholder={t('project.create.foodCategoryPlaceholder')}
                      maxLength={INPUT_MAX.SHORT}
                      value={form.foodCategory}
                      onChange={(e) => setForm((f) => ({ ...f, foodCategory: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="proj-date">
                      {t('project.create.targetDate')} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="proj-date"
                      type="date"
                      value={form.targetDate}
                      onChange={(e) => setForm((f) => ({ ...f, targetDate: e.target.value }))}
                    />
                  </div>
                  <div className="col-span-2 flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false)
                        setForm({ name: '', targetMarket: '', foodCategory: '', targetDate: '' })
                      }}
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button type="submit" disabled={!isValid}>
                      {t('project.create.submit')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Project list */}
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 py-16 text-center">
              <FolderOpen className="mb-3 h-10 w-10 text-slate-400" />
              <p className="text-slate-500">{t('project.list.empty')}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {sorted.map((project) => (
                <Card
                  key={project.id}
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">{project.name}</h2>
                        <p className="mt-1 text-sm text-slate-500">
                          {project.targetMarket} · {project.foodCategory}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {t('project.list.lastUpdated')}{' '}
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <StatusBadge status={project.marketResearch.status} />
                        <StatusBadge status={project.competitiveAnalysis.status} />
                        <StatusBadge status={project.gtmPlan.status} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
