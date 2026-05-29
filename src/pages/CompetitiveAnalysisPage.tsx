import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  LabelList,
} from 'recharts'
import { useProject } from '@/contexts/ProjectContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Competitor } from '@/types/models'

// ─── Competitor Profiles ──────────────────────────────────────

function CompetitorSection() {
  const { t } = useTranslation()
  const { state, dispatch } = useProject()
  const competitors = state.project.competitiveAnalysis.competitors
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Competitor, 'id'>>({
    name: '', marketShare: '', strengths: '', weaknesses: '', productLines: '', priceRange: '',
  })
  const [error, setError] = useState('')

  function handleAdd() {
    if (!form.name.trim()) { setError(t('common.required')); return }
    dispatch({ type: 'ADD_COMPETITOR', payload: { id: uuidv4(), ...form } })
    setForm({ name: '', marketShare: '', strengths: '', weaknesses: '', productLines: '', priceRange: '' })
    setAdding(false)
    setError('')
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>{t('competitive.competitors.title')}</CardTitle>
        <Button size="sm" variant="outline" onClick={() => setAdding((v) => !v)}>
          <Plus className="h-4 w-4" />
          {t('competitive.competitors.addCompetitor')}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {adding && (
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label>{t('competitive.competitors.name')} <span className="text-red-500">*</span></Label>
                <Input
                  placeholder={t('competitive.competitors.namePlaceholder')}
                  value={form.name}
                  onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setError('') }}
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>{t('competitive.competitors.marketShare')}</Label>
                <Input placeholder={t('competitive.competitors.marketSharePlaceholder')} value={form.marketShare} onChange={(e) => setForm((f) => ({ ...f, marketShare: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('competitive.competitors.priceRange')}</Label>
                <Input placeholder={t('competitive.competitors.priceRangePlaceholder')} value={form.priceRange} onChange={(e) => setForm((f) => ({ ...f, priceRange: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('competitive.competitors.strengths')}</Label>
                <Textarea placeholder={t('competitive.competitors.strengthsPlaceholder')} value={form.strengths} onChange={(e) => setForm((f) => ({ ...f, strengths: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('competitive.competitors.weaknesses')}</Label>
                <Textarea placeholder={t('competitive.competitors.weaknessesPlaceholder')} value={form.weaknesses} onChange={(e) => setForm((f) => ({ ...f, weaknesses: e.target.value }))} />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>{t('competitive.competitors.productLines')}</Label>
                <Textarea placeholder={t('competitive.competitors.productLinesPlaceholder')} value={form.productLines} onChange={(e) => setForm((f) => ({ ...f, productLines: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => { setAdding(false); setError('') }}>{t('common.cancel')}</Button>
              <Button size="sm" onClick={handleAdd} disabled={!form.name.trim()}>{t('common.add')}</Button>
            </div>
          </div>
        )}

        {competitors.length === 0 && !adding && (
          <p className="text-sm text-slate-400">{t('common.noData')}</p>
        )}

        {competitors.map((comp) => (
          <div key={comp.id} className="rounded-md border border-slate-200 p-4">
            {editingId === comp.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 space-y-1.5">
                    <Label>{t('competitive.competitors.name')}</Label>
                    <Input value={comp.name} onChange={(e) => dispatch({ type: 'UPDATE_COMPETITOR', payload: { id: comp.id, data: { name: e.target.value } } })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('competitive.competitors.marketShare')}</Label>
                    <Input value={comp.marketShare} onChange={(e) => dispatch({ type: 'UPDATE_COMPETITOR', payload: { id: comp.id, data: { marketShare: e.target.value } } })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('competitive.competitors.priceRange')}</Label>
                    <Input value={comp.priceRange} onChange={(e) => dispatch({ type: 'UPDATE_COMPETITOR', payload: { id: comp.id, data: { priceRange: e.target.value } } })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('competitive.competitors.strengths')}</Label>
                    <Textarea value={comp.strengths} onChange={(e) => dispatch({ type: 'UPDATE_COMPETITOR', payload: { id: comp.id, data: { strengths: e.target.value } } })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('competitive.competitors.weaknesses')}</Label>
                    <Textarea value={comp.weaknesses} onChange={(e) => dispatch({ type: 'UPDATE_COMPETITOR', payload: { id: comp.id, data: { weaknesses: e.target.value } } })} />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label>{t('competitive.competitors.productLines')}</Label>
                    <Textarea value={comp.productLines} onChange={(e) => dispatch({ type: 'UPDATE_COMPETITOR', payload: { id: comp.id, data: { productLines: e.target.value } } })} />
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>{t('common.close')}</Button>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900">{comp.name}</p>
                    {comp.marketShare && <span className="text-xs text-slate-500">{comp.marketShare}</span>}
                  </div>
                  {comp.priceRange && <p className="text-sm text-slate-500">{comp.priceRange}</p>}
                  {comp.strengths && <p className="mt-1 text-sm text-slate-600"><span className="font-medium">S:</span> {comp.strengths}</p>}
                  {comp.weaknesses && <p className="text-sm text-slate-600"><span className="font-medium">W:</span> {comp.weaknesses}</p>}
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => setEditingId(comp.id)} aria-label={t('common.edit')}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => dispatch({ type: 'DELETE_COMPETITOR', payload: { id: comp.id } })} aria-label={t('common.delete')}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ─── Positioning Map ──────────────────────────────────────────

function PositioningMapSection() {
  const { t } = useTranslation()
  const { state, dispatch } = useProject()
  const { positioningMap, competitors } = state.project.competitiveAnalysis

  const plotData = positioningMap.plots
    .map((plot) => {
      const comp = competitors.find((c) => c.id === plot.competitorId)
      if (!comp) return null
      return { x: plot.x, y: plot.y, name: comp.name, id: comp.id }
    })
    .filter(Boolean) as { x: number; y: number; name: string; id: string }[]

  const hasAxes = positioningMap.xAxisLabel && positioningMap.yAxisLabel

  // Get or create plot for a competitor
  function getPlot(compId: string) {
    return positioningMap.plots.find((p) => p.competitorId === compId) ?? { competitorId: compId, x: 0, y: 0 }
  }

  function updatePlot(compId: string, axis: 'x' | 'y', value: number) {
    const plots = positioningMap.plots.filter((p) => p.competitorId !== compId)
    const current = getPlot(compId)
    dispatch({
      type: 'UPDATE_POSITIONING_MAP',
      payload: { plots: [...plots, { ...current, [axis]: value }] },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('competitive.positioningMap.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>{t('competitive.positioningMap.xAxisLabel')}</Label>
            <Input
              placeholder={t('competitive.positioningMap.xAxisPlaceholder')}
              value={positioningMap.xAxisLabel}
              onChange={(e) => dispatch({ type: 'UPDATE_POSITIONING_MAP', payload: { xAxisLabel: e.target.value } })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t('competitive.positioningMap.yAxisLabel')}</Label>
            <Input
              placeholder={t('competitive.positioningMap.yAxisPlaceholder')}
              value={positioningMap.yAxisLabel}
              onChange={(e) => dispatch({ type: 'UPDATE_POSITIONING_MAP', payload: { yAxisLabel: e.target.value } })}
            />
          </div>
        </div>

        {/* Competitor coordinate inputs */}
        {hasAxes && competitors.length > 0 && (
          <div className="space-y-2">
            {competitors.map((comp) => {
              const plot = getPlot(comp.id)
              return (
                <div key={comp.id} className="flex items-center gap-3">
                  <span className="w-32 truncate text-sm text-slate-700">{comp.name}</span>
                  <div className="flex items-center gap-1">
                    <Label className="text-xs">X</Label>
                    <Input
                      type="number"
                      min={-100}
                      max={100}
                      className="w-20"
                      value={plot.x}
                      onChange={(e) => updatePlot(comp.id, 'x', Number(e.target.value))}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Label className="text-xs">Y</Label>
                    <Input
                      type="number"
                      min={-100}
                      max={100}
                      className="w-20"
                      value={plot.y}
                      onChange={(e) => updatePlot(comp.id, 'y', Number(e.target.value))}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Chart */}
        {hasAxes ? (
          competitors.length === 0 ? (
            <p className="text-sm text-slate-400">{t('common.noData')}</p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="x" domain={[-100, 100]} name={positioningMap.xAxisLabel} label={{ value: positioningMap.xAxisLabel, position: 'insideBottom', offset: -10 }} />
                  <YAxis type="number" dataKey="y" domain={[-100, 100]} name={positioningMap.yAxisLabel} label={{ value: positioningMap.yAxisLabel, angle: -90, position: 'insideLeft' }} />
                  <ReferenceLine x={0} stroke="#94a3b8" />
                  <ReferenceLine y={0} stroke="#94a3b8" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(_v, name) => [_v, name]} />
                  <Scatter data={plotData} fill="#3b82f6">
                    <LabelList dataKey="name" position="top" style={{ fontSize: '11px' }} />
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          )
        ) : (
          <p className="text-sm text-slate-400">{t('competitive.positioningMap.xAxisLabel')} / {t('competitive.positioningMap.yAxisLabel')}</p>
        )}
      </CardContent>
    </Card>
  )
}

// ─── SWOT ─────────────────────────────────────────────────────

type SwotKey = 'strengths' | 'weaknesses' | 'opportunities' | 'threats'

function SwotSection() {
  const { t } = useTranslation()
  const { state, dispatch } = useProject()
  const swot = state.project.competitiveAnalysis.swot

  const quadrants: { key: SwotKey; label: string; bg: string }[] = [
    { key: 'strengths', label: t('competitive.swot.strengths'), bg: 'bg-green-50 border-green-200' },
    { key: 'weaknesses', label: t('competitive.swot.weaknesses'), bg: 'bg-red-50 border-red-200' },
    { key: 'opportunities', label: t('competitive.swot.opportunities'), bg: 'bg-blue-50 border-blue-200' },
    { key: 'threats', label: t('competitive.swot.threats'), bg: 'bg-amber-50 border-amber-200' },
  ]

  function addItem(key: SwotKey, value: string) {
    if (!value.trim()) return
    dispatch({ type: 'UPDATE_SWOT', payload: { [key]: [...swot[key], value.trim()] } })
  }

  function removeItem(key: SwotKey, index: number) {
    dispatch({ type: 'UPDATE_SWOT', payload: { [key]: swot[key].filter((_, i) => i !== index) } })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('competitive.swot.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {quadrants.map(({ key, label, bg }) => (
            <SwotQuadrant
              key={key}
              label={label}
              items={swot[key]}
              bg={bg}
              onAdd={(v) => addItem(key, v)}
              onRemove={(i) => removeItem(key, i)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function SwotQuadrant({
  label,
  items,
  bg,
  onAdd,
  onRemove,
}: {
  label: string
  items: string[]
  bg: string
  onAdd: (v: string) => void
  onRemove: (i: number) => void
}) {
  const { t } = useTranslation()
  const [input, setInput] = useState('')

  function handleAdd() {
    onAdd(input)
    setInput('')
  }

  return (
    <div className={`rounded-md border p-3 ${bg}`}>
      <p className="mb-2 text-sm font-semibold text-slate-700">{label}</p>
      <ul className="mb-2 space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-start justify-between gap-1 text-sm">
            <span className="text-slate-700">• {item}</span>
            <button
              onClick={() => onRemove(i)}
              className="shrink-0 text-slate-400 hover:text-red-500"
              aria-label={t('common.delete')}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-1">
        <Input
          className="h-7 text-xs"
          placeholder={t('competitive.swot.placeholder')}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd() } }}
        />
        <Button size="sm" className="h-7 px-2 text-xs" onClick={handleAdd} disabled={!input.trim()}>
          {t('competitive.swot.addItem')}
        </Button>
      </div>
    </div>
  )
}

// ─── Differentiators ──────────────────────────────────────────

function DifferentiatorsSection() {
  const { t } = useTranslation()
  const { state, dispatch } = useProject()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('competitive.differentiators.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder={t('competitive.differentiators.placeholder')}
          value={state.project.competitiveAnalysis.differentiators}
          rows={4}
          onChange={(e) => dispatch({ type: 'UPDATE_DIFFERENTIATORS', payload: { value: e.target.value } })}
        />
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────

export function CompetitiveAnalysisPage() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('competitive.title')}</h1>
      <CompetitorSection />
      <PositioningMapSection />
      <SwotSection />
      <DifferentiatorsSection />
    </div>
  )
}
