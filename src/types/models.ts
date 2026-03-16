// ============================================================
// Domain Models — 市場参入レポート作成支援ツール
// localStorage key prefix: capstone_v1_
// All IDs: UUID v4
// ============================================================

export type SectionStatus = 'empty' | 'in_progress' | 'done';

// ─── Project ─────────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  targetMarket: string;       // 対象市場
  foodCategory: string;       // 食品カテゴリ
  targetDate: string;         // 目標期日 (ISO date)
  createdAt: string;          // ISO datetime
  updatedAt: string;          // ISO datetime
  marketResearch: MarketResearch;
  competitiveAnalysis: CompetitiveAnalysis;
  gtmPlan: GTMPlan;
}

export type ProjectSummary = Pick<
  Project,
  'id' | 'name' | 'targetMarket' | 'foodCategory' | 'targetDate' | 'createdAt' | 'updatedAt'
> & {
  marketResearchStatus: SectionStatus;
  competitiveAnalysisStatus: SectionStatus;
  gtmPlanStatus: SectionStatus;
};

// ─── Market Research ─────────────────────────────────────────

export interface MarketResearch {
  status: SectionStatus;
  overview: MarketOverview;
  segments: Segment[];
  consumerInsights: ConsumerInsight[];
  barriers: Barrier[];
  trends: Trend[];
}

export interface MarketOverview {
  marketSize: string;         // 市場規模 (例: "¥500B")
  cagr: string;               // CAGR (例: "5.2%")
  definition: string;         // 市場定義
}

export interface Segment {
  id: string;
  name: string;
  size: string;
  characteristics: string;
}

export interface ConsumerInsight {
  id: string;
  source: string;             // インタビュー/調査名
  notes: string;
  date: string;               // ISO date
}

export type BarrierType = 'regulatory' | 'cost' | 'technical' | 'other';

export interface Barrier {
  id: string;
  type: BarrierType;
  description: string;
}

export interface Trend {
  id: string;
  title: string;
  description: string;
}

// ─── Competitive Analysis ────────────────────────────────────

export interface CompetitiveAnalysis {
  status: SectionStatus;
  competitors: Competitor[];
  positioningMap: PositioningMap;
  swot: SWOT;
  differentiators: string;    // 差別化ポイント
}

export interface Competitor {
  id: string;
  name: string;
  marketShare: string;        // 例: "12%"
  strengths: string;
  weaknesses: string;
  productLines: string;
  priceRange: string;
}

export interface PositioningMap {
  xAxisLabel: string;
  yAxisLabel: string;
  plots: PositioningPlot[];
}

export interface PositioningPlot {
  competitorId: string;       // Competitor.id への参照
  x: number;                  // -100 〜 100
  y: number;                  // -100 〜 100
}

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

// ─── GTM Plan ────────────────────────────────────────────────

export interface GTMPlan {
  status: SectionStatus;
  personas: Persona[];
  entryStrategy: EntryStrategy;
  initiatives: Initiative[];
  phases: Phase[];
  kpis: KPI[];
}

export interface Persona {
  id: string;
  name: string;
  age: string;
  occupation: string;
  painPoints: string;
  goals: string;
}

export type Channel = 'retail' | 'ec' | 'b2b' | 'wholesale' | 'other';

export interface EntryStrategy {
  channels: Channel[];
  pricingStrategy: string;
}

export interface Initiative {
  id: string;
  title: string;
  description: string;
  owner: string;
  dueDate: string;            // ISO date
}

export type PhaseNumber = 1 | 2 | 3;

export interface Phase {
  id: string;
  number: PhaseNumber;
  milestone: string;
  startDate: string;          // ISO date
  endDate: string;            // ISO date
  goals: string;
}

export interface KPI {
  id: string;
  metric: string;
  target: string;
  measurementMethod: string;
}

// ─── Status Derivation ───────────────────────────────────────
// Status is stored in the model (per spec) but MUST be treated as
// derived data — always recompute via these functions before saving
// to prevent the persisted value from drifting out of sync with content.

export function computeMarketResearchStatus(mr: MarketResearch): SectionStatus {
  const hasOverview =
    mr.overview.marketSize.trim() !== '' &&
    mr.overview.cagr.trim() !== '' &&
    mr.overview.definition.trim() !== '';
  const hasSegments = mr.segments.length >= 1;
  const hasInsightsOrBarriers =
    mr.consumerInsights.length >= 1 || mr.barriers.length >= 1;
  const hasTrends = mr.trends.length >= 1;

  if (hasOverview && hasSegments && hasInsightsOrBarriers && hasTrends) return 'done';

  const anyInput =
    mr.overview.definition.trim() !== '' ||
    mr.segments.length > 0 ||
    mr.consumerInsights.length > 0 ||
    mr.barriers.length > 0 ||
    mr.trends.length > 0;

  return anyInput ? 'in_progress' : 'empty';
}

export function computeCompetitiveAnalysisStatus(ca: CompetitiveAnalysis): SectionStatus {
  const swotItemCount =
    ca.swot.strengths.length +
    ca.swot.weaknesses.length +
    ca.swot.opportunities.length +
    ca.swot.threats.length;

  const isDone =
    ca.competitors.length >= 1 &&
    ca.positioningMap.xAxisLabel.trim() !== '' &&
    ca.positioningMap.yAxisLabel.trim() !== '' &&
    swotItemCount >= 4 &&
    ca.differentiators.trim() !== '';

  if (isDone) return 'done';

  const anyInput =
    ca.competitors.length > 0 ||
    ca.positioningMap.xAxisLabel.trim() !== '' ||
    swotItemCount > 0 ||
    ca.differentiators.trim() !== '';

  return anyInput ? 'in_progress' : 'empty';
}

export function computeGTMPlanStatus(gtm: GTMPlan): SectionStatus {
  const isDone =
    gtm.personas.length >= 1 &&
    gtm.entryStrategy.channels.length >= 1 &&
    gtm.entryStrategy.pricingStrategy.trim() !== '' &&
    gtm.initiatives.length >= 1 &&
    gtm.phases.length >= 1 &&
    gtm.kpis.length >= 1;

  if (isDone) return 'done';

  const anyInput =
    gtm.personas.length > 0 ||
    gtm.entryStrategy.channels.length > 0 ||
    gtm.entryStrategy.pricingStrategy.trim() !== '' ||
    gtm.initiatives.length > 0 ||
    gtm.phases.length > 0 ||
    gtm.kpis.length > 0;

  return anyInput ? 'in_progress' : 'empty';
}

/** Recompute all section statuses from content and return a new Project.
 *  Call this in the repository before every save to keep status in sync. */
export function recomputeStatuses(project: Project): Project {
  return {
    ...project,
    marketResearch: {
      ...project.marketResearch,
      status: computeMarketResearchStatus(project.marketResearch),
    },
    competitiveAnalysis: {
      ...project.competitiveAnalysis,
      status: computeCompetitiveAnalysisStatus(project.competitiveAnalysis),
    },
    gtmPlan: {
      ...project.gtmPlan,
      status: computeGTMPlanStatus(project.gtmPlan),
    },
  };
}
