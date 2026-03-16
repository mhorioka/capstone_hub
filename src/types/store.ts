// ============================================================
// Store — State Shape & Discriminated Union Action Types
// React Context + useReducer
// ============================================================

import type {
  Project,
  MarketOverview,
  Segment,
  ConsumerInsight,
  Barrier,
  Trend,
  Competitor,
  PositioningMap,
  SWOT,
  Persona,
  EntryStrategy,
  Initiative,
  Phase,
  KPI,
} from './models';

// ─── App-level State ─────────────────────────────────────────

export interface AppState {
  projects: Project[];
  activeProjectId: string | null;
}

export const initialAppState: AppState = {
  projects: [],
  activeProjectId: null,
};

// ─── App Actions ─────────────────────────────────────────────

export type AppAction =
  | { type: 'LOAD_PROJECTS'; payload: Project[] }
  | { type: 'CREATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: { id: string } }
  | { type: 'SET_ACTIVE_PROJECT'; payload: { id: string } };

// ─── Project-level State ─────────────────────────────────────

/** Mirrors the header/sidebar save indicator described in the UX spec:
 *  idle → (edit) → saving → saved | error */
export type SaveStatus =
  | { type: 'idle' }
  | { type: 'saving' }
  | { type: 'saved' }
  | { type: 'error'; message: string };

export interface ProjectState {
  project: Project;
  isDirty: boolean;           // true while edits are pending debounce flush
  saveStatus: SaveStatus;
}

// ─── Project Actions ─────────────────────────────────────────

export type ProjectAction =
  // ── Market Research ──────────────────────────────────────
  | { type: 'UPDATE_MARKET_OVERVIEW'; payload: Partial<MarketOverview> }
  | { type: 'ADD_SEGMENT'; payload: Segment }
  | { type: 'UPDATE_SEGMENT'; payload: { id: string; data: Partial<Segment> } }
  | { type: 'DELETE_SEGMENT'; payload: { id: string } }
  | { type: 'ADD_CONSUMER_INSIGHT'; payload: ConsumerInsight }
  | { type: 'UPDATE_CONSUMER_INSIGHT'; payload: { id: string; data: Partial<ConsumerInsight> } }
  | { type: 'DELETE_CONSUMER_INSIGHT'; payload: { id: string } }
  | { type: 'ADD_BARRIER'; payload: Barrier }
  | { type: 'UPDATE_BARRIER'; payload: { id: string; data: Partial<Barrier> } }
  | { type: 'DELETE_BARRIER'; payload: { id: string } }
  | { type: 'ADD_TREND'; payload: Trend }
  | { type: 'UPDATE_TREND'; payload: { id: string; data: Partial<Trend> } }
  | { type: 'DELETE_TREND'; payload: { id: string } }
  // ── Competitive Analysis ─────────────────────────────────
  | { type: 'ADD_COMPETITOR'; payload: Competitor }
  | { type: 'UPDATE_COMPETITOR'; payload: { id: string; data: Partial<Competitor> } }
  | { type: 'DELETE_COMPETITOR'; payload: { id: string } }
  | { type: 'UPDATE_POSITIONING_MAP'; payload: Partial<PositioningMap> }
  | { type: 'UPDATE_SWOT'; payload: Partial<SWOT> }
  | { type: 'UPDATE_DIFFERENTIATORS'; payload: { value: string } }
  // ── GTM Plan ────────────────────────────────────────────
  | { type: 'ADD_PERSONA'; payload: Persona }
  | { type: 'UPDATE_PERSONA'; payload: { id: string; data: Partial<Persona> } }
  | { type: 'DELETE_PERSONA'; payload: { id: string } }
  | { type: 'UPDATE_ENTRY_STRATEGY'; payload: Partial<EntryStrategy> }
  | { type: 'ADD_INITIATIVE'; payload: Initiative }
  | { type: 'UPDATE_INITIATIVE'; payload: { id: string; data: Partial<Initiative> } }
  | { type: 'DELETE_INITIATIVE'; payload: { id: string } }
  | { type: 'ADD_PHASE'; payload: Phase }
  | { type: 'UPDATE_PHASE'; payload: { id: string; data: Partial<Phase> } }
  | { type: 'DELETE_PHASE'; payload: { id: string } }
  | { type: 'ADD_KPI'; payload: KPI }
  | { type: 'UPDATE_KPI'; payload: { id: string; data: Partial<KPI> } }
  | { type: 'DELETE_KPI'; payload: { id: string } }
  // ── Internal (autosave lifecycle) ────────────────────────
  | { type: 'MARK_SAVING' }
  | { type: 'MARK_SAVED' }
  | { type: 'MARK_SAVE_ERROR'; payload: { message: string } };
