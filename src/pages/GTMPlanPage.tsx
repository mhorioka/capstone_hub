import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { useProject } from '@/contexts/ProjectContext'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Persona, Initiative, Phase, PhaseNumber, KPI, Channel } from '@/types/models'

// ─── Personas ────────────────────────────────────────────────

function PersonasSection() {
  const { t } = useTranslation()
  const { state, dispatch } = useProject()
  const personas = state.project.gtmPlan.personas
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Persona, 'id'>>({ name: '', age: '', occupation: '', painPoints: '', goals: '' })
  const [error, setError] = useState('')

  function handleAdd() {
    if (!form.name.trim()) { setError(t('common.required')); return }
    dispatch({ type: 'ADD_PERSONA', payload: { id: uuidv4(), ...form } })
    setForm({ name: '', age: '', occupation: '', painPoints: '', goals: '' })
    setAdding(false)
    setError('')
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>{t('gtm.personas.title')}</CardTitle>
        <Button size="sm" variant="outline" onClick={() => setAdding((v) => !v)}>
          <Plus className="h-4 w-4" />
          {t('gtm.personas.addPersona')}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {adding && (
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label>{t('gtm.personas.name')} <span className="text-red-500">*</span></Label>
                <Input
                  placeholder={t('gtm.personas.namePlaceholder')}
                  value={form.name}
                  onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setError('') }}
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>{t('gtm.personas.age')}</Label>
                <Input placeholder={t('gtm.personas.agePlaceholder')} value={form.age} onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('gtm.personas.occupation')}</Label>
                <Input placeholder={t('gtm.personas.occupationPlaceholder')} value={form.occupation} onChange={(e) => setForm((f) => ({ ...f, occupation: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('gtm.personas.painPoints')}</Label>
                <Textarea placeholder={t('gtm.personas.painPointsPlaceholder')} value={form.painPoints} onChange={(e) => setForm((f) => ({ ...f, painPoints: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('gtm.personas.goals')}</Label>
                <Textarea placeholder={t('gtm.personas.goalsPlaceholder')} value={form.goals} onChange={(e) => setForm((f) => ({ ...f, goals: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setAdding(false)}>{t('common.cancel')}</Button>
              <Button size="sm" onClick={handleAdd}>{t('common.add')}</Button>
            </div>
          </div>
        )}

        {personas.length === 0 && !adding && <p className="text-sm text-slate-400">{t('common.noData')}</p>}

        <div className="grid grid-cols-2 gap-3">
          {personas.map((persona) => (
            <div key={persona.id} className="rounded-md border border-slate-200 p-4">
              {editingId === persona.id ? (
                <div className="space-y-2">
                  <Input value={persona.name} onChange={(e) => dispatch({ type: 'UPDATE_PERSONA', payload: { id: persona.id, data: { name: e.target.value } } })} />
                  <Input placeholder={t('gtm.personas.agePlaceholder')} value={persona.age} onChange={(e) => dispatch({ type: 'UPDATE_PERSONA', payload: { id: persona.id, data: { age: e.target.value } } })} />
                  <Input placeholder={t('gtm.personas.occupationPlaceholder')} value={persona.occupation} onChange={(e) => dispatch({ type: 'UPDATE_PERSONA', payload: { id: persona.id, data: { occupation: e.target.value } } })} />
                  <Textarea placeholder={t('gtm.personas.painPointsPlaceholder')} value={persona.painPoints} onChange={(e) => dispatch({ type: 'UPDATE_PERSONA', payload: { id: persona.id, data: { painPoints: e.target.value } } })} />
                  <Textarea placeholder={t('gtm.personas.goalsPlaceholder')} value={persona.goals} onChange={(e) => dispatch({ type: 'UPDATE_PERSONA', payload: { id: persona.id, data: { goals: e.target.value } } })} />
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>{t('common.close')}</Button>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-slate-900">{persona.name}</p>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setEditingId(persona.id)} aria-label={t('common.edit')}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => dispatch({ type: 'DELETE_PERSONA', payload: { id: persona.id } })} aria-label={t('common.delete')}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </div>
                  </div>
                  {persona.age && <p className="text-xs text-slate-500">{persona.age} · {persona.occupation}</p>}
                  {persona.painPoints && <p className="mt-1 text-xs text-slate-600"><span className="font-medium">Pain:</span> {persona.painPoints.slice(0, 50)}{persona.painPoints.length > 50 ? '...' : ''}</p>}
                  {persona.goals && <p className="text-xs text-slate-600"><span className="font-medium">Goal:</span> {persona.goals.slice(0, 50)}{persona.goals.length > 50 ? '...' : ''}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Entry Strategy ───────────────────────────────────────────

const ALL_CHANNELS: Channel[] = ['retail', 'ec', 'b2b', 'wholesale', 'other']

function EntryStrategySection() {
  const { t } = useTranslation()
  const { state, dispatch } = useProject()
  const entryStrategy = state.project.gtmPlan.entryStrategy

  function toggleChannel(channel: Channel) {
    const channels = entryStrategy.channels.includes(channel)
      ? entryStrategy.channels.filter((c) => c !== channel)
      : [...entryStrategy.channels, channel]
    dispatch({ type: 'UPDATE_ENTRY_STRATEGY', payload: { channels } })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('gtm.entryStrategy.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="mb-2 block">{t('gtm.entryStrategy.channels')}</Label>
          <div className="flex flex-wrap gap-2">
            {ALL_CHANNELS.map((channel) => (
              <label
                key={channel}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={entryStrategy.channels.includes(channel)}
                  onChange={() => toggleChannel(channel)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                {t(`gtm.entryStrategy.channelOptions.${channel}`)}
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pricing">{t('gtm.entryStrategy.pricingStrategy')}</Label>
          <Textarea
            id="pricing"
            placeholder={t('gtm.entryStrategy.pricingStrategyPlaceholder')}
            value={entryStrategy.pricingStrategy}
            rows={3}
            onChange={(e) => dispatch({ type: 'UPDATE_ENTRY_STRATEGY', payload: { pricingStrategy: e.target.value } })}
          />
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Initiatives ──────────────────────────────────────────────

function InitiativesSection() {
  const { t } = useTranslation()
  const { state, dispatch } = useProject()
  const initiatives = state.project.gtmPlan.initiatives
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Initiative, 'id'>>({ title: '', description: '', owner: '', dueDate: '' })
  const [error, setError] = useState('')

  function handleAdd() {
    if (!form.title.trim()) { setError(t('common.required')); return }
    dispatch({ type: 'ADD_INITIATIVE', payload: { id: uuidv4(), ...form } })
    setForm({ title: '', description: '', owner: '', dueDate: '' })
    setAdding(false)
    setError('')
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>{t('gtm.initiatives.title')}</CardTitle>
        <Button size="sm" variant="outline" onClick={() => setAdding((v) => !v)}>
          <Plus className="h-4 w-4" />
          {t('gtm.initiatives.addInitiative')}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {adding && (
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label>{t('gtm.initiatives.titleField')} <span className="text-red-500">*</span></Label>
                <Input placeholder={t('gtm.initiatives.titlePlaceholder')} value={form.title} onChange={(e) => { setForm((f) => ({ ...f, title: e.target.value })); setError('') }} />
                {error && <p className="text-xs text-red-500">{error}</p>}
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>{t('gtm.initiatives.description')}</Label>
                <Textarea placeholder={t('gtm.initiatives.descriptionPlaceholder')} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('gtm.initiatives.owner')}</Label>
                <Input placeholder={t('gtm.initiatives.ownerPlaceholder')} value={form.owner} onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('gtm.initiatives.dueDate')}</Label>
                <Input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setAdding(false)}>{t('common.cancel')}</Button>
              <Button size="sm" onClick={handleAdd}>{t('common.add')}</Button>
            </div>
          </div>
        )}

        {initiatives.length === 0 && !adding && <p className="text-sm text-slate-400">{t('common.noData')}</p>}

        {initiatives.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                <th className="pb-2 font-medium">{t('gtm.initiatives.titleField')}</th>
                <th className="pb-2 font-medium">{t('gtm.initiatives.owner')}</th>
                <th className="pb-2 font-medium">{t('gtm.initiatives.dueDate')}</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {initiatives.map((init) => (
                <tr key={init.id}>
                  {editingId === init.id ? (
                    <td colSpan={4} className="py-3">
                      <div className="space-y-2">
                        <Input value={init.title} onChange={(e) => dispatch({ type: 'UPDATE_INITIATIVE', payload: { id: init.id, data: { title: e.target.value } } })} />
                        <Textarea value={init.description} onChange={(e) => dispatch({ type: 'UPDATE_INITIATIVE', payload: { id: init.id, data: { description: e.target.value } } })} />
                        <div className="flex gap-2">
                          <Input value={init.owner} placeholder={t('gtm.initiatives.ownerPlaceholder')} onChange={(e) => dispatch({ type: 'UPDATE_INITIATIVE', payload: { id: init.id, data: { owner: e.target.value } } })} />
                          <Input type="date" value={init.dueDate} onChange={(e) => dispatch({ type: 'UPDATE_INITIATIVE', payload: { id: init.id, data: { dueDate: e.target.value } } })} />
                        </div>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>{t('common.close')}</Button>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="py-2">
                        <p className="font-medium text-slate-900">{init.title}</p>
                        {init.description && <p className="text-xs text-slate-500">{init.description}</p>}
                      </td>
                      <td className="py-2 text-slate-600">{init.owner}</td>
                      <td className="py-2 text-slate-600">{init.dueDate}</td>
                      <td className="py-2">
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" onClick={() => setEditingId(init.id)} aria-label={t('common.edit')}><Pencil className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" onClick={() => dispatch({ type: 'DELETE_INITIATIVE', payload: { id: init.id } })} aria-label={t('common.delete')}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Phases ───────────────────────────────────────────────────

function PhasesSection() {
  const { t } = useTranslation()
  const { state, dispatch } = useProject()
  const phases = state.project.gtmPlan.phases
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Phase, 'id'>>({ number: 1, milestone: '', startDate: '', endDate: '', goals: '' })
  const [errors, setErrors] = useState({ milestone: '', date: '' })
  const [duplicateConfirm, setDuplicateConfirm] = useState(false)
  const [pendingPhase, setPendingPhase] = useState<Phase | null>(null)

  function validate() {
    const newErrors = {
      milestone: !form.milestone.trim() ? t('common.required') : '',
      date: form.startDate && form.endDate && form.endDate < form.startDate ? '終了日は開始日以降に設定してください' : '',
    }
    setErrors(newErrors)
    return !newErrors.milestone && !newErrors.date
  }

  function handleAdd() {
    if (!validate()) return
    const newPhase: Phase = { id: uuidv4(), ...form }
    const existingPhase = phases.find((p) => p.number === form.number)
    if (existingPhase) {
      setPendingPhase(newPhase)
      setDuplicateConfirm(true)
    } else {
      dispatch({ type: 'ADD_PHASE', payload: newPhase })
      setForm({ number: 1, milestone: '', startDate: '', endDate: '', goals: '' })
      setAdding(false)
    }
  }

  function handleDuplicateConfirm() {
    if (!pendingPhase) return
    const existingPhase = phases.find((p) => p.number === pendingPhase.number)
    if (existingPhase) dispatch({ type: 'DELETE_PHASE', payload: { id: existingPhase.id } })
    dispatch({ type: 'ADD_PHASE', payload: pendingPhase })
    setPendingPhase(null)
    setForm({ number: 1, milestone: '', startDate: '', endDate: '', goals: '' })
    setAdding(false)
  }

  const sortedPhases = [...phases].sort((a, b) => a.number - b.number)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>{t('gtm.phases.title')}</CardTitle>
        <Button size="sm" variant="outline" onClick={() => setAdding((v) => !v)}>
          <Plus className="h-4 w-4" />
          {t('gtm.phases.addPhase')}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {adding && (
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>{t('gtm.phases.phase')} <span className="text-red-500">*</span></Label>
                <select
                  className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  value={form.number}
                  onChange={(e) => setForm((f) => ({ ...f, number: Number(e.target.value) as PhaseNumber }))}
                >
                  {([1, 2, 3] as PhaseNumber[]).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>{t('gtm.phases.milestone')} <span className="text-red-500">*</span></Label>
                <Input
                  placeholder={t('gtm.phases.milestonePlaceholder')}
                  value={form.milestone}
                  onChange={(e) => { setForm((f) => ({ ...f, milestone: e.target.value })); setErrors((er) => ({ ...er, milestone: '' })) }}
                />
                {errors.milestone && <p className="text-xs text-red-500">{errors.milestone}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>{t('gtm.phases.startDate')}</Label>
                <Input type="date" value={form.startDate} onChange={(e) => { setForm((f) => ({ ...f, startDate: e.target.value })); setErrors((er) => ({ ...er, date: '' })) }} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('gtm.phases.endDate')}</Label>
                <Input type="date" value={form.endDate} onChange={(e) => { setForm((f) => ({ ...f, endDate: e.target.value })); setErrors((er) => ({ ...er, date: '' })) }} />
              </div>
              {errors.date && <p className="col-span-3 text-xs text-red-500">{errors.date}</p>}
              <div className="col-span-3 space-y-1.5">
                <Label>{t('gtm.phases.goals')}</Label>
                <Textarea placeholder={t('gtm.phases.goalsPlaceholder')} value={form.goals} onChange={(e) => setForm((f) => ({ ...f, goals: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setAdding(false)}>{t('common.cancel')}</Button>
              <Button size="sm" onClick={handleAdd}>{t('common.add')}</Button>
            </div>
          </div>
        )}

        {sortedPhases.length === 0 && !adding && <p className="text-sm text-slate-400">{t('common.noData')}</p>}

        {sortedPhases.map((phase) => (
          <div key={phase.id} className="rounded-md border border-slate-200 p-4">
            {editingId === phase.id ? (
              <div className="space-y-2">
                <Input placeholder={t('gtm.phases.milestonePlaceholder')} value={phase.milestone} onChange={(e) => dispatch({ type: 'UPDATE_PHASE', payload: { id: phase.id, data: { milestone: e.target.value } } })} />
                <div className="flex gap-2">
                  <Input type="date" value={phase.startDate} onChange={(e) => dispatch({ type: 'UPDATE_PHASE', payload: { id: phase.id, data: { startDate: e.target.value } } })} />
                  <Input type="date" value={phase.endDate} onChange={(e) => dispatch({ type: 'UPDATE_PHASE', payload: { id: phase.id, data: { endDate: e.target.value } } })} />
                </div>
                <Textarea placeholder={t('gtm.phases.goalsPlaceholder')} value={phase.goals} onChange={(e) => dispatch({ type: 'UPDATE_PHASE', payload: { id: phase.id, data: { goals: e.target.value } } })} />
                <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>{t('common.close')}</Button>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">Phase {phase.number}</span>
                    <p className="font-medium text-slate-900">{phase.milestone}</p>
                  </div>
                  {(phase.startDate || phase.endDate) && (
                    <p className="mt-1 text-xs text-slate-500">{phase.startDate} ~ {phase.endDate}</p>
                  )}
                  {phase.goals && <p className="mt-1 text-sm text-slate-600">{phase.goals}</p>}
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => setEditingId(phase.id)} aria-label={t('common.edit')}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => dispatch({ type: 'DELETE_PHASE', payload: { id: phase.id } })} aria-label={t('common.delete')}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>

      <ConfirmDialog
        open={duplicateConfirm}
        onOpenChange={setDuplicateConfirm}
        title={`Phase ${pendingPhase?.number} 重複`}
        description={`Phase ${pendingPhase?.number} は既に存在します。上書きしますか？`}
        onConfirm={handleDuplicateConfirm}
        confirmVariant="default"
      />
    </Card>
  )
}

// ─── KPIs ─────────────────────────────────────────────────────

function KPIsSection() {
  const { t } = useTranslation()
  const { state, dispatch } = useProject()
  const kpis = state.project.gtmPlan.kpis
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<KPI, 'id'>>({ metric: '', target: '', measurementMethod: '' })
  const [errors, setErrors] = useState({ metric: '', target: '' })

  function handleAdd() {
    const newErrors = {
      metric: !form.metric.trim() ? t('common.required') : '',
      target: !form.target.trim() ? t('common.required') : '',
    }
    setErrors(newErrors)
    if (newErrors.metric || newErrors.target) return

    dispatch({ type: 'ADD_KPI', payload: { id: uuidv4(), ...form } })
    setForm({ metric: '', target: '', measurementMethod: '' })
    setAdding(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>{t('gtm.kpis.title')}</CardTitle>
        <Button size="sm" variant="outline" onClick={() => setAdding((v) => !v)}>
          <Plus className="h-4 w-4" />
          {t('gtm.kpis.addKPI')}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {adding && (
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>{t('gtm.kpis.metric')} <span className="text-red-500">*</span></Label>
                <Input placeholder={t('gtm.kpis.metricPlaceholder')} value={form.metric} onChange={(e) => { setForm((f) => ({ ...f, metric: e.target.value })); setErrors((er) => ({ ...er, metric: '' })) }} />
                {errors.metric && <p className="text-xs text-red-500">{errors.metric}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>{t('gtm.kpis.target')} <span className="text-red-500">*</span></Label>
                <Input placeholder={t('gtm.kpis.targetPlaceholder')} value={form.target} onChange={(e) => { setForm((f) => ({ ...f, target: e.target.value })); setErrors((er) => ({ ...er, target: '' })) }} />
                {errors.target && <p className="text-xs text-red-500">{errors.target}</p>}
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>{t('gtm.kpis.measurementMethod')}</Label>
                <Input placeholder={t('gtm.kpis.measurementMethodPlaceholder')} value={form.measurementMethod} onChange={(e) => setForm((f) => ({ ...f, measurementMethod: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setAdding(false)}>{t('common.cancel')}</Button>
              <Button size="sm" onClick={handleAdd}>{t('common.add')}</Button>
            </div>
          </div>
        )}

        {kpis.length === 0 && !adding && <p className="text-sm text-slate-400">{t('common.noData')}</p>}

        {kpis.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                <th className="pb-2 font-medium">{t('gtm.kpis.metric')}</th>
                <th className="pb-2 font-medium">{t('gtm.kpis.target')}</th>
                <th className="pb-2 font-medium">{t('gtm.kpis.measurementMethod')}</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {kpis.map((kpi) => (
                <tr key={kpi.id}>
                  {editingId === kpi.id ? (
                    <td colSpan={4} className="py-3">
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input value={kpi.metric} onChange={(e) => dispatch({ type: 'UPDATE_KPI', payload: { id: kpi.id, data: { metric: e.target.value } } })} />
                          <Input value={kpi.target} onChange={(e) => dispatch({ type: 'UPDATE_KPI', payload: { id: kpi.id, data: { target: e.target.value } } })} />
                        </div>
                        <Input value={kpi.measurementMethod} onChange={(e) => dispatch({ type: 'UPDATE_KPI', payload: { id: kpi.id, data: { measurementMethod: e.target.value } } })} />
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>{t('common.close')}</Button>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="py-2 font-medium text-slate-900">{kpi.metric}</td>
                      <td className="py-2 text-slate-600">{kpi.target}</td>
                      <td className="py-2 text-slate-500">{kpi.measurementMethod}</td>
                      <td className="py-2">
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" onClick={() => setEditingId(kpi.id)} aria-label={t('common.edit')}><Pencil className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" onClick={() => dispatch({ type: 'DELETE_KPI', payload: { id: kpi.id } })} aria-label={t('common.delete')}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────

export function GTMPlanPage() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('gtm.title')}</h1>
      <PersonasSection />
      <EntryStrategySection />
      <InitiativesSection />
      <PhasesSection />
      <KPIsSection />
    </div>
  )
}
