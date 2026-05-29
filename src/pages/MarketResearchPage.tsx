import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { useProject } from '@/contexts/ProjectContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Segment, ConsumerInsight, Barrier, BarrierType, Trend } from '@/types/models'
import { INPUT_MAX } from '@/lib/constants'

// ─── Section: Market Overview ─────────────────────────────────

function MarketOverviewSection() {
  const { t } = useTranslation()
  const { state, dispatch } = useProject()
  const overview = state.project.marketResearch.overview

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('market.overview.title')}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="market-size">{t('market.overview.marketSize')}</Label>
          <Input
            id="market-size"
            placeholder={t('market.overview.marketSizePlaceholder')}
            maxLength={INPUT_MAX.SHORT}
            value={overview.marketSize}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_MARKET_OVERVIEW', payload: { marketSize: e.target.value } })
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cagr">{t('market.overview.cagr')}</Label>
          <Input
            id="cagr"
            placeholder={t('market.overview.cagrPlaceholder')}
            maxLength={INPUT_MAX.SHORT}
            value={overview.cagr}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_MARKET_OVERVIEW', payload: { cagr: e.target.value } })
            }
          />
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="definition">{t('market.overview.definition')}</Label>
          <Textarea
            id="definition"
            placeholder={t('market.overview.definitionPlaceholder')}
            maxLength={INPUT_MAX.LONG}
            value={overview.definition}
            rows={3}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_MARKET_OVERVIEW', payload: { definition: e.target.value } })
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Section: Segments ────────────────────────────────────────

function SegmentsSection() {
  const { t } = useTranslation()
  const { state, dispatch } = useProject()
  const segments = state.project.marketResearch.segments
  const [editingId, setEditingId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState<Omit<Segment, 'id'>>({ name: '', size: '', characteristics: '' })
  const [error, setError] = useState('')

  function handleAdd() {
    if (!form.name.trim()) {
      setError(t('common.required'))
      return
    }
    dispatch({ type: 'ADD_SEGMENT', payload: { id: uuidv4(), ...form } })
    setForm({ name: '', size: '', characteristics: '' })
    setAdding(false)
    setError('')
  }

  function handleUpdate(id: string, data: Partial<Segment>) {
    dispatch({ type: 'UPDATE_SEGMENT', payload: { id, data } })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>{t('market.segments.title')}</CardTitle>
        <Button size="sm" variant="outline" onClick={() => setAdding((v) => !v)}>
          <Plus className="h-4 w-4" />
          {t('market.segments.addSegment')}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Add form */}
        {adding && (
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="space-y-1.5">
              <Label>{t('market.segments.name')} <span className="text-red-500">*</span></Label>
              <Input
                placeholder={t('market.segments.namePlaceholder')}
                maxLength={INPUT_MAX.SHORT}
                value={form.name}
                onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setError('') }}
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>{t('market.segments.size')}</Label>
              <Input
                placeholder={t('market.segments.sizePlaceholder')}
                maxLength={INPUT_MAX.SHORT}
                value={form.size}
                onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t('market.segments.characteristics')}</Label>
              <Textarea
                placeholder={t('market.segments.characteristicsPlaceholder')}
                maxLength={INPUT_MAX.LONG}
                value={form.characteristics}
                onChange={(e) => setForm((f) => ({ ...f, characteristics: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => { setAdding(false); setError('') }}>
                {t('common.cancel')}
              </Button>
              <Button size="sm" onClick={handleAdd} disabled={!form.name.trim()}>{t('common.add')}</Button>
            </div>
          </div>
        )}

        {/* Segment list */}
        {segments.length === 0 && !adding && (
          <p className="text-sm text-slate-400">{t('common.noData')}</p>
        )}
        {segments.map((segment) => (
          <div key={segment.id} className="rounded-md border border-slate-200 p-4">
            {editingId === segment.id ? (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>{t('market.segments.name')}</Label>
                  <Input
                    maxLength={INPUT_MAX.SHORT}
                    value={segment.name}
                    onChange={(e) => handleUpdate(segment.id, { name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t('market.segments.size')}</Label>
                  <Input
                    maxLength={INPUT_MAX.SHORT}
                    value={segment.size}
                    onChange={(e) => handleUpdate(segment.id, { size: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t('market.segments.characteristics')}</Label>
                  <Textarea
                    maxLength={INPUT_MAX.LONG}
                    value={segment.characteristics}
                    onChange={(e) => handleUpdate(segment.id, { characteristics: e.target.value })}
                  />
                </div>
                <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                  {t('common.close')}
                </Button>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-slate-900">{segment.name}</p>
                  {segment.size && <p className="text-sm text-slate-500">{segment.size}</p>}
                  {segment.characteristics && (
                    <p className="mt-1 text-sm text-slate-600">{segment.characteristics}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setEditingId(segment.id)}
                    aria-label={t('common.edit')}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => dispatch({ type: 'DELETE_SEGMENT', payload: { id: segment.id } })}
                    aria-label={t('common.delete')}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ─── Section: Consumer Insights ───────────────────────────────

function ConsumerInsightsSection() {
  const { t } = useTranslation()
  const { state, dispatch } = useProject()
  const insights = state.project.marketResearch.consumerInsights
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<ConsumerInsight, 'id'>>({ source: '', notes: '', date: '' })
  const [errors, setErrors] = useState({ source: '', notes: '' })

  function handleAdd() {
    const newErrors = {
      source: !form.source.trim() ? t('common.required') : '',
      notes: !form.notes.trim() ? t('common.required') : '',
    }
    setErrors(newErrors)
    if (newErrors.source || newErrors.notes) return

    dispatch({ type: 'ADD_CONSUMER_INSIGHT', payload: { id: uuidv4(), ...form } })
    setForm({ source: '', notes: '', date: '' })
    setAdding(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>{t('market.insights.title')}</CardTitle>
        <Button size="sm" variant="outline" onClick={() => setAdding((v) => !v)}>
          <Plus className="h-4 w-4" />
          {t('market.insights.addInsight')}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {adding && (
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="space-y-1.5">
              <Label>{t('market.insights.source')} <span className="text-red-500">*</span></Label>
              <Input
                placeholder={t('market.insights.sourcePlaceholder')}
                maxLength={INPUT_MAX.SHORT}
                value={form.source}
                onChange={(e) => { setForm((f) => ({ ...f, source: e.target.value })); setErrors((er) => ({ ...er, source: '' })) }}
              />
              {errors.source && <p className="text-xs text-red-500">{errors.source}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>{t('market.insights.notes')} <span className="text-red-500">*</span></Label>
              <Textarea
                placeholder={t('market.insights.notesPlaceholder')}
                maxLength={INPUT_MAX.LONG}
                value={form.notes}
                onChange={(e) => { setForm((f) => ({ ...f, notes: e.target.value })); setErrors((er) => ({ ...er, notes: '' })) }}
              />
              {errors.notes && <p className="text-xs text-red-500">{errors.notes}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>{t('market.insights.date')}</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setAdding(false)}>{t('common.cancel')}</Button>
              <Button size="sm" onClick={handleAdd} disabled={!form.source.trim() || !form.notes.trim()}>{t('common.add')}</Button>
            </div>
          </div>
        )}

        {insights.length === 0 && !adding && (
          <p className="text-sm text-slate-400">{t('common.noData')}</p>
        )}
        {insights.map((insight) => (
          <div key={insight.id} className="rounded-md border border-slate-200 p-4">
            {editingId === insight.id ? (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>{t('market.insights.source')}</Label>
                  <Input
                    maxLength={INPUT_MAX.SHORT}
                    value={insight.source}
                    onChange={(e) => dispatch({ type: 'UPDATE_CONSUMER_INSIGHT', payload: { id: insight.id, data: { source: e.target.value } } })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t('market.insights.notes')}</Label>
                  <Textarea
                    maxLength={INPUT_MAX.LONG}
                    value={insight.notes}
                    onChange={(e) => dispatch({ type: 'UPDATE_CONSUMER_INSIGHT', payload: { id: insight.id, data: { notes: e.target.value } } })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t('market.insights.date')}</Label>
                  <Input
                    type="date"
                    value={insight.date}
                    onChange={(e) => dispatch({ type: 'UPDATE_CONSUMER_INSIGHT', payload: { id: insight.id, data: { date: e.target.value } } })}
                  />
                </div>
                <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>{t('common.close')}</Button>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-slate-900">{insight.source}</p>
                  {insight.date && <p className="text-xs text-slate-400">{insight.date}</p>}
                  <p className="mt-1 text-sm text-slate-600">{insight.notes}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => setEditingId(insight.id)} aria-label={t('common.edit')}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => dispatch({ type: 'DELETE_CONSUMER_INSIGHT', payload: { id: insight.id } })} aria-label={t('common.delete')}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ─── Section: Barriers ────────────────────────────────────────

function BarriersSection() {
  const { t } = useTranslation()
  const { state, dispatch } = useProject()
  const barriers = state.project.marketResearch.barriers
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState<Omit<Barrier, 'id'>>({ type: 'regulatory', description: '' })
  const [error, setError] = useState('')

  const barrierTypes: BarrierType[] = ['regulatory', 'cost', 'technical', 'other']

  function handleAdd() {
    if (!form.description.trim()) {
      setError(t('common.required'))
      return
    }
    dispatch({ type: 'ADD_BARRIER', payload: { id: uuidv4(), ...form } })
    setForm({ type: 'regulatory', description: '' })
    setAdding(false)
    setError('')
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>{t('market.barriers.title')}</CardTitle>
        <Button size="sm" variant="outline" onClick={() => setAdding((v) => !v)}>
          <Plus className="h-4 w-4" />
          {t('market.barriers.addBarrier')}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {adding && (
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="space-y-1.5">
              <Label>{t('market.barriers.type')} <span className="text-red-500">*</span></Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm((f) => ({ ...f, type: v as BarrierType }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {barrierTypes.map((bt) => (
                    <SelectItem key={bt} value={bt}>
                      {t(`market.barriers.types.${bt}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('market.barriers.description')} <span className="text-red-500">*</span></Label>
              <Textarea
                placeholder={t('market.barriers.descriptionPlaceholder')}
                maxLength={INPUT_MAX.LONG}
                value={form.description}
                onChange={(e) => { setForm((f) => ({ ...f, description: e.target.value })); setError('') }}
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setAdding(false)}>{t('common.cancel')}</Button>
              <Button size="sm" onClick={handleAdd} disabled={!form.description.trim()}>{t('common.add')}</Button>
            </div>
          </div>
        )}

        {barriers.length === 0 && !adding && (
          <p className="text-sm text-slate-400">{t('common.noData')}</p>
        )}
        {barriers.map((barrier) => (
          <div key={barrier.id} className="flex items-start justify-between rounded-md border border-slate-200 p-4">
            <div>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {t(`market.barriers.types.${barrier.type}`)}
              </span>
              <p className="mt-1 text-sm text-slate-700">{barrier.description}</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => dispatch({ type: 'DELETE_BARRIER', payload: { id: barrier.id } })}
              aria-label={t('common.delete')}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ─── Section: Trends ──────────────────────────────────────────

function TrendsSection() {
  const { t } = useTranslation()
  const { state, dispatch } = useProject()
  const trends = state.project.marketResearch.trends
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Trend, 'id'>>({ title: '', description: '' })
  const [error, setError] = useState('')

  function handleAdd() {
    if (!form.title.trim()) {
      setError(t('common.required'))
      return
    }
    dispatch({ type: 'ADD_TREND', payload: { id: uuidv4(), ...form } })
    setForm({ title: '', description: '' })
    setAdding(false)
    setError('')
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>{t('market.trends.title')}</CardTitle>
        <Button size="sm" variant="outline" onClick={() => setAdding((v) => !v)}>
          <Plus className="h-4 w-4" />
          {t('market.trends.addTrend')}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {adding && (
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="space-y-1.5">
              <Label>{t('market.trends.titleField')} <span className="text-red-500">*</span></Label>
              <Input
                placeholder={t('market.trends.titlePlaceholder')}
                maxLength={INPUT_MAX.SHORT}
                value={form.title}
                onChange={(e) => { setForm((f) => ({ ...f, title: e.target.value })); setError('') }}
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>{t('market.trends.description')}</Label>
              <Textarea
                placeholder={t('market.trends.descriptionPlaceholder')}
                maxLength={INPUT_MAX.LONG}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setAdding(false)}>{t('common.cancel')}</Button>
              <Button size="sm" onClick={handleAdd} disabled={!form.title.trim()}>{t('common.add')}</Button>
            </div>
          </div>
        )}

        {trends.length === 0 && !adding && (
          <p className="text-sm text-slate-400">{t('common.noData')}</p>
        )}
        {trends.map((trend) => (
          <div key={trend.id} className="rounded-md border border-slate-200 p-4">
            {editingId === trend.id ? (
              <div className="space-y-3">
                <Input
                  maxLength={INPUT_MAX.SHORT}
                  value={trend.title}
                  onChange={(e) => dispatch({ type: 'UPDATE_TREND', payload: { id: trend.id, data: { title: e.target.value } } })}
                />
                <Textarea
                  maxLength={INPUT_MAX.LONG}
                  value={trend.description}
                  onChange={(e) => dispatch({ type: 'UPDATE_TREND', payload: { id: trend.id, data: { description: e.target.value } } })}
                />
                <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>{t('common.close')}</Button>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-slate-900">{trend.title}</p>
                  {trend.description && <p className="mt-1 text-sm text-slate-600">{trend.description}</p>}
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => setEditingId(trend.id)} aria-label={t('common.edit')}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => dispatch({ type: 'DELETE_TREND', payload: { id: trend.id } })} aria-label={t('common.delete')}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────

export function MarketResearchPage() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('market.title')}</h1>
      <MarketOverviewSection />
      <SegmentsSection />
      <ConsumerInsightsSection />
      <BarriersSection />
      <TrendsSection />
    </div>
  )
}
