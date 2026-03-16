import { useTranslation } from 'react-i18next'
import { Printer } from 'lucide-react'
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
import { recomputeStatuses } from '@/types/models'
import { Button } from '@/components/ui/button'

const EMPTY = '（未入力）'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="print-section mb-8">
      <h2 className="mb-4 border-b border-slate-300 pb-2 text-xl font-bold text-slate-900">
        {title}
      </h2>
      {children}
    </div>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="mb-2 text-base font-semibold text-slate-700">{title}</h3>
      {children}
    </div>
  )
}

export function ReportPage() {
  const { t } = useTranslation()
  const { state } = useProject()
  const project = recomputeStatuses(state.project)
  const { marketResearch, competitiveAnalysis, gtmPlan } = project
  const now = new Date().toLocaleString()

  const positioningPlotData = competitiveAnalysis.positioningMap.plots
    .map((plot) => {
      const comp = competitiveAnalysis.competitors.find((c) => c.id === plot.competitorId)
      if (!comp) return null
      return { x: plot.x, y: plot.y, name: comp.name }
    })
    .filter(Boolean) as { x: number; y: number; name: string }[]

  const hasPositioningAxes =
    competitiveAnalysis.positioningMap.xAxisLabel && competitiveAnalysis.positioningMap.yAxisLabel

  return (
    <div className="mx-auto max-w-4xl">
      {/* Print button — hidden in print */}
      <div className="no-print mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t('report.title')}</h1>
        <Button onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          {t('report.print')}
        </Button>
      </div>

      {/* ── Project Info ── */}
      <Section title={t('report.sections.projectInfo')}>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-slate-100">
            <tr><td className="py-1.5 font-medium text-slate-600 w-40">{t('project.create.name')}</td><td className="py-1.5 text-slate-900">{project.name || EMPTY}</td></tr>
            <tr><td className="py-1.5 font-medium text-slate-600">{t('project.create.targetMarket')}</td><td className="py-1.5 text-slate-900">{project.targetMarket || EMPTY}</td></tr>
            <tr><td className="py-1.5 font-medium text-slate-600">{t('project.create.foodCategory')}</td><td className="py-1.5 text-slate-900">{project.foodCategory || EMPTY}</td></tr>
            <tr><td className="py-1.5 font-medium text-slate-600">{t('project.create.targetDate')}</td><td className="py-1.5 text-slate-900">{project.targetDate || EMPTY}</td></tr>
            <tr><td className="py-1.5 font-medium text-slate-600">{t('report.generatedAt')}</td><td className="py-1.5 text-slate-500">{now}</td></tr>
          </tbody>
        </table>
      </Section>

      {/* ── Market Research ── */}
      <Section title={t('report.sections.marketResearch')}>
        <SubSection title={t('market.overview.title')}>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              <tr><td className="py-1.5 font-medium text-slate-600 w-40">{t('market.overview.marketSize')}</td><td className="py-1.5">{marketResearch.overview.marketSize || EMPTY}</td></tr>
              <tr><td className="py-1.5 font-medium text-slate-600">{t('market.overview.cagr')}</td><td className="py-1.5">{marketResearch.overview.cagr || EMPTY}</td></tr>
              <tr><td className="py-1.5 font-medium text-slate-600">{t('market.overview.definition')}</td><td className="py-1.5 whitespace-pre-wrap">{marketResearch.overview.definition || EMPTY}</td></tr>
            </tbody>
          </table>
        </SubSection>

        <SubSection title={t('market.segments.title')}>
          {marketResearch.segments.length === 0 ? (
            <p className="text-sm text-slate-400">{EMPTY}</p>
          ) : (
            <table className="w-full text-sm border border-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-2 text-left font-medium text-slate-600">{t('market.segments.name')}</th>
                  <th className="p-2 text-left font-medium text-slate-600">{t('market.segments.size')}</th>
                  <th className="p-2 text-left font-medium text-slate-600">{t('market.segments.characteristics')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {marketResearch.segments.map((s) => (
                  <tr key={s.id}>
                    <td className="p-2">{s.name}</td>
                    <td className="p-2">{s.size}</td>
                    <td className="p-2">{s.characteristics}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </SubSection>

        <SubSection title={t('market.insights.title')}>
          {marketResearch.consumerInsights.length === 0 ? (
            <p className="text-sm text-slate-400">{EMPTY}</p>
          ) : (
            <div className="space-y-2">
              {marketResearch.consumerInsights.map((insight) => (
                <div key={insight.id} className="rounded border border-slate-200 p-3">
                  <div className="flex justify-between">
                    <p className="font-medium text-slate-900">{insight.source}</p>
                    {insight.date && <p className="text-xs text-slate-500">{insight.date}</p>}
                  </div>
                  <p className="mt-1 text-sm text-slate-700">{insight.notes}</p>
                </div>
              ))}
            </div>
          )}
        </SubSection>

        <SubSection title={t('market.barriers.title')}>
          {marketResearch.barriers.length === 0 ? (
            <p className="text-sm text-slate-400">{EMPTY}</p>
          ) : (
            <table className="w-full text-sm border border-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-2 text-left font-medium text-slate-600">{t('market.barriers.type')}</th>
                  <th className="p-2 text-left font-medium text-slate-600">{t('market.barriers.description')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {marketResearch.barriers.map((b) => (
                  <tr key={b.id}>
                    <td className="p-2">{t(`market.barriers.types.${b.type}`)}</td>
                    <td className="p-2">{b.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </SubSection>

        <SubSection title={t('market.trends.title')}>
          {marketResearch.trends.length === 0 ? (
            <p className="text-sm text-slate-400">{EMPTY}</p>
          ) : (
            <div className="space-y-2">
              {marketResearch.trends.map((trend) => (
                <div key={trend.id} className="rounded border border-slate-200 p-3">
                  <p className="font-medium text-slate-900">{trend.title}</p>
                  {trend.description && <p className="mt-1 text-sm text-slate-700">{trend.description}</p>}
                </div>
              ))}
            </div>
          )}
        </SubSection>
      </Section>

      {/* ── Competitive Analysis ── */}
      <Section title={t('report.sections.competitiveAnalysis')}>
        <SubSection title={t('competitive.competitors.title')}>
          {competitiveAnalysis.competitors.length === 0 ? (
            <p className="text-sm text-slate-400">{EMPTY}</p>
          ) : (
            <table className="w-full text-sm border border-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-2 text-left font-medium text-slate-600">{t('competitive.competitors.name')}</th>
                  <th className="p-2 text-left font-medium text-slate-600">{t('competitive.competitors.marketShare')}</th>
                  <th className="p-2 text-left font-medium text-slate-600">{t('competitive.competitors.strengths')}</th>
                  <th className="p-2 text-left font-medium text-slate-600">{t('competitive.competitors.weaknesses')}</th>
                  <th className="p-2 text-left font-medium text-slate-600">{t('competitive.competitors.priceRange')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {competitiveAnalysis.competitors.map((c) => (
                  <tr key={c.id}>
                    <td className="p-2 font-medium">{c.name}</td>
                    <td className="p-2">{c.marketShare}</td>
                    <td className="p-2">{c.strengths}</td>
                    <td className="p-2">{c.weaknesses}</td>
                    <td className="p-2">{c.priceRange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </SubSection>

        <SubSection title={t('competitive.positioningMap.title')}>
          {!hasPositioningAxes || competitiveAnalysis.competitors.length === 0 ? (
            <p className="text-sm text-slate-400">{EMPTY}</p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="x" domain={[-100, 100]} name={competitiveAnalysis.positioningMap.xAxisLabel} label={{ value: competitiveAnalysis.positioningMap.xAxisLabel, position: 'insideBottom', offset: -10 }} />
                  <YAxis type="number" dataKey="y" domain={[-100, 100]} name={competitiveAnalysis.positioningMap.yAxisLabel} label={{ value: competitiveAnalysis.positioningMap.yAxisLabel, angle: -90, position: 'insideLeft' }} />
                  <ReferenceLine x={0} stroke="#94a3b8" />
                  <ReferenceLine y={0} stroke="#94a3b8" />
                  <Tooltip />
                  <Scatter data={positioningPlotData} fill="#3b82f6">
                    <LabelList dataKey="name" position="top" style={{ fontSize: '11px' }} />
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          )}
        </SubSection>

        <SubSection title={t('competitive.swot.title')}>
          <div className="grid grid-cols-2 gap-3">
            {([
              { key: 'strengths', label: t('competitive.swot.strengths'), bg: 'bg-green-50' },
              { key: 'weaknesses', label: t('competitive.swot.weaknesses'), bg: 'bg-red-50' },
              { key: 'opportunities', label: t('competitive.swot.opportunities'), bg: 'bg-blue-50' },
              { key: 'threats', label: t('competitive.swot.threats'), bg: 'bg-amber-50' },
            ] as { key: keyof typeof competitiveAnalysis.swot; label: string; bg: string }[]).map(({ key, label, bg }) => (
              <div key={key} className={`rounded border border-slate-200 p-3 ${bg}`}>
                <p className="mb-1 text-sm font-semibold text-slate-700">{label}</p>
                {competitiveAnalysis.swot[key].length === 0 ? (
                  <p className="text-xs text-slate-400">{EMPTY}</p>
                ) : (
                  <ul className="space-y-0.5 text-sm text-slate-700">
                    {competitiveAnalysis.swot[key].map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </SubSection>

        <SubSection title={t('competitive.differentiators.title')}>
          <p className="whitespace-pre-wrap text-sm text-slate-700">
            {competitiveAnalysis.differentiators || EMPTY}
          </p>
        </SubSection>
      </Section>

      {/* ── GTM Plan ── */}
      <Section title={t('report.sections.gtmPlan')}>
        <SubSection title={t('gtm.personas.title')}>
          {gtmPlan.personas.length === 0 ? (
            <p className="text-sm text-slate-400">{EMPTY}</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {gtmPlan.personas.map((persona) => (
                <div key={persona.id} className="rounded border border-slate-200 p-3">
                  <p className="font-medium text-slate-900">{persona.name}</p>
                  {(persona.age || persona.occupation) && (
                    <p className="text-xs text-slate-500">{persona.age} · {persona.occupation}</p>
                  )}
                  {persona.painPoints && <p className="mt-1 text-xs text-slate-700"><span className="font-medium">Pain:</span> {persona.painPoints}</p>}
                  {persona.goals && <p className="text-xs text-slate-700"><span className="font-medium">Goal:</span> {persona.goals}</p>}
                </div>
              ))}
            </div>
          )}
        </SubSection>

        <SubSection title={t('gtm.entryStrategy.title')}>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-slate-600">{t('gtm.entryStrategy.channels')}: </span>
              {gtmPlan.entryStrategy.channels.length === 0
                ? EMPTY
                : gtmPlan.entryStrategy.channels
                    .map((c) => t(`gtm.entryStrategy.channelOptions.${c}`))
                    .join(' / ')}
            </div>
            <div>
              <span className="font-medium text-slate-600">{t('gtm.entryStrategy.pricingStrategy')}: </span>
              <span className="whitespace-pre-wrap text-slate-700">
                {gtmPlan.entryStrategy.pricingStrategy || EMPTY}
              </span>
            </div>
          </div>
        </SubSection>

        <SubSection title={t('gtm.initiatives.title')}>
          {gtmPlan.initiatives.length === 0 ? (
            <p className="text-sm text-slate-400">{EMPTY}</p>
          ) : (
            <table className="w-full text-sm border border-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-2 text-left font-medium text-slate-600">{t('gtm.initiatives.titleField')}</th>
                  <th className="p-2 text-left font-medium text-slate-600">{t('gtm.initiatives.description')}</th>
                  <th className="p-2 text-left font-medium text-slate-600">{t('gtm.initiatives.owner')}</th>
                  <th className="p-2 text-left font-medium text-slate-600">{t('gtm.initiatives.dueDate')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {gtmPlan.initiatives.map((init) => (
                  <tr key={init.id}>
                    <td className="p-2 font-medium">{init.title}</td>
                    <td className="p-2">{init.description}</td>
                    <td className="p-2">{init.owner}</td>
                    <td className="p-2">{init.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </SubSection>

        <SubSection title={t('gtm.phases.title')}>
          {gtmPlan.phases.length === 0 ? (
            <p className="text-sm text-slate-400">{EMPTY}</p>
          ) : (
            <div className="space-y-2">
              {[...gtmPlan.phases].sort((a, b) => a.number - b.number).map((phase) => (
                <div key={phase.id} className="rounded border border-slate-200 p-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">Phase {phase.number}</span>
                    <p className="font-medium text-slate-900">{phase.milestone}</p>
                  </div>
                  {(phase.startDate || phase.endDate) && (
                    <p className="text-xs text-slate-500">{phase.startDate} ~ {phase.endDate}</p>
                  )}
                  {phase.goals && <p className="mt-1 text-sm text-slate-700">{phase.goals}</p>}
                </div>
              ))}
            </div>
          )}
        </SubSection>

        <SubSection title={t('gtm.kpis.title')}>
          {gtmPlan.kpis.length === 0 ? (
            <p className="text-sm text-slate-400">{EMPTY}</p>
          ) : (
            <table className="w-full text-sm border border-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-2 text-left font-medium text-slate-600">{t('gtm.kpis.metric')}</th>
                  <th className="p-2 text-left font-medium text-slate-600">{t('gtm.kpis.target')}</th>
                  <th className="p-2 text-left font-medium text-slate-600">{t('gtm.kpis.measurementMethod')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {gtmPlan.kpis.map((kpi) => (
                  <tr key={kpi.id}>
                    <td className="p-2 font-medium">{kpi.metric}</td>
                    <td className="p-2">{kpi.target}</td>
                    <td className="p-2">{kpi.measurementMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </SubSection>
      </Section>
    </div>
  )
}
