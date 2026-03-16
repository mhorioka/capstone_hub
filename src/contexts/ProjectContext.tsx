import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from 'react'
import type { Project } from '@/types/models'
import { recomputeStatuses } from '@/types/models'
import type { ProjectState, ProjectAction, SaveStatus } from '@/types/store'
import { projectRepository } from '@/lib/repository'

// ─── Reducer ─────────────────────────────────────────────────

function projectReducer(state: ProjectState, action: ProjectAction): ProjectState {
  switch (action.type) {
    // ── Market Research ──────────────────────────────────────
    case 'UPDATE_MARKET_OVERVIEW':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          marketResearch: {
            ...state.project.marketResearch,
            overview: { ...state.project.marketResearch.overview, ...action.payload },
          },
        },
      }
    case 'ADD_SEGMENT':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          marketResearch: {
            ...state.project.marketResearch,
            segments: [...state.project.marketResearch.segments, action.payload],
          },
        },
      }
    case 'UPDATE_SEGMENT':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          marketResearch: {
            ...state.project.marketResearch,
            segments: state.project.marketResearch.segments.map((s) =>
              s.id === action.payload.id ? { ...s, ...action.payload.data } : s,
            ),
          },
        },
      }
    case 'DELETE_SEGMENT':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          marketResearch: {
            ...state.project.marketResearch,
            segments: state.project.marketResearch.segments.filter(
              (s) => s.id !== action.payload.id,
            ),
          },
        },
      }
    case 'ADD_CONSUMER_INSIGHT':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          marketResearch: {
            ...state.project.marketResearch,
            consumerInsights: [...state.project.marketResearch.consumerInsights, action.payload],
          },
        },
      }
    case 'UPDATE_CONSUMER_INSIGHT':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          marketResearch: {
            ...state.project.marketResearch,
            consumerInsights: state.project.marketResearch.consumerInsights.map((c) =>
              c.id === action.payload.id ? { ...c, ...action.payload.data } : c,
            ),
          },
        },
      }
    case 'DELETE_CONSUMER_INSIGHT':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          marketResearch: {
            ...state.project.marketResearch,
            consumerInsights: state.project.marketResearch.consumerInsights.filter(
              (c) => c.id !== action.payload.id,
            ),
          },
        },
      }
    case 'ADD_BARRIER':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          marketResearch: {
            ...state.project.marketResearch,
            barriers: [...state.project.marketResearch.barriers, action.payload],
          },
        },
      }
    case 'UPDATE_BARRIER':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          marketResearch: {
            ...state.project.marketResearch,
            barriers: state.project.marketResearch.barriers.map((b) =>
              b.id === action.payload.id ? { ...b, ...action.payload.data } : b,
            ),
          },
        },
      }
    case 'DELETE_BARRIER':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          marketResearch: {
            ...state.project.marketResearch,
            barriers: state.project.marketResearch.barriers.filter(
              (b) => b.id !== action.payload.id,
            ),
          },
        },
      }
    case 'ADD_TREND':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          marketResearch: {
            ...state.project.marketResearch,
            trends: [...state.project.marketResearch.trends, action.payload],
          },
        },
      }
    case 'UPDATE_TREND':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          marketResearch: {
            ...state.project.marketResearch,
            trends: state.project.marketResearch.trends.map((t) =>
              t.id === action.payload.id ? { ...t, ...action.payload.data } : t,
            ),
          },
        },
      }
    case 'DELETE_TREND':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          marketResearch: {
            ...state.project.marketResearch,
            trends: state.project.marketResearch.trends.filter((t) => t.id !== action.payload.id),
          },
        },
      }
    // ── Competitive Analysis ─────────────────────────────────
    case 'ADD_COMPETITOR':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          competitiveAnalysis: {
            ...state.project.competitiveAnalysis,
            competitors: [...state.project.competitiveAnalysis.competitors, action.payload],
          },
        },
      }
    case 'UPDATE_COMPETITOR':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          competitiveAnalysis: {
            ...state.project.competitiveAnalysis,
            competitors: state.project.competitiveAnalysis.competitors.map((c) =>
              c.id === action.payload.id ? { ...c, ...action.payload.data } : c,
            ),
          },
        },
      }
    case 'DELETE_COMPETITOR': {
      const deletedId = action.payload.id
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          competitiveAnalysis: {
            ...state.project.competitiveAnalysis,
            competitors: state.project.competitiveAnalysis.competitors.filter(
              (c) => c.id !== deletedId,
            ),
            positioningMap: {
              ...state.project.competitiveAnalysis.positioningMap,
              plots: state.project.competitiveAnalysis.positioningMap.plots.filter(
                (p) => p.competitorId !== deletedId,
              ),
            },
          },
        },
      }
    }
    case 'UPDATE_POSITIONING_MAP':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          competitiveAnalysis: {
            ...state.project.competitiveAnalysis,
            positioningMap: {
              ...state.project.competitiveAnalysis.positioningMap,
              ...action.payload,
            },
          },
        },
      }
    case 'UPDATE_SWOT':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          competitiveAnalysis: {
            ...state.project.competitiveAnalysis,
            swot: { ...state.project.competitiveAnalysis.swot, ...action.payload },
          },
        },
      }
    case 'UPDATE_DIFFERENTIATORS':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          competitiveAnalysis: {
            ...state.project.competitiveAnalysis,
            differentiators: action.payload.value,
          },
        },
      }
    // ── GTM Plan ────────────────────────────────────────────
    case 'ADD_PERSONA':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          gtmPlan: {
            ...state.project.gtmPlan,
            personas: [...state.project.gtmPlan.personas, action.payload],
          },
        },
      }
    case 'UPDATE_PERSONA':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          gtmPlan: {
            ...state.project.gtmPlan,
            personas: state.project.gtmPlan.personas.map((p) =>
              p.id === action.payload.id ? { ...p, ...action.payload.data } : p,
            ),
          },
        },
      }
    case 'DELETE_PERSONA':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          gtmPlan: {
            ...state.project.gtmPlan,
            personas: state.project.gtmPlan.personas.filter((p) => p.id !== action.payload.id),
          },
        },
      }
    case 'UPDATE_ENTRY_STRATEGY':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          gtmPlan: {
            ...state.project.gtmPlan,
            entryStrategy: { ...state.project.gtmPlan.entryStrategy, ...action.payload },
          },
        },
      }
    case 'ADD_INITIATIVE':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          gtmPlan: {
            ...state.project.gtmPlan,
            initiatives: [...state.project.gtmPlan.initiatives, action.payload],
          },
        },
      }
    case 'UPDATE_INITIATIVE':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          gtmPlan: {
            ...state.project.gtmPlan,
            initiatives: state.project.gtmPlan.initiatives.map((i) =>
              i.id === action.payload.id ? { ...i, ...action.payload.data } : i,
            ),
          },
        },
      }
    case 'DELETE_INITIATIVE':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          gtmPlan: {
            ...state.project.gtmPlan,
            initiatives: state.project.gtmPlan.initiatives.filter(
              (i) => i.id !== action.payload.id,
            ),
          },
        },
      }
    case 'ADD_PHASE':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          gtmPlan: {
            ...state.project.gtmPlan,
            phases: [...state.project.gtmPlan.phases, action.payload],
          },
        },
      }
    case 'UPDATE_PHASE':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          gtmPlan: {
            ...state.project.gtmPlan,
            phases: state.project.gtmPlan.phases.map((p) =>
              p.id === action.payload.id ? { ...p, ...action.payload.data } : p,
            ),
          },
        },
      }
    case 'DELETE_PHASE':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          gtmPlan: {
            ...state.project.gtmPlan,
            phases: state.project.gtmPlan.phases.filter((p) => p.id !== action.payload.id),
          },
        },
      }
    case 'ADD_KPI':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          gtmPlan: {
            ...state.project.gtmPlan,
            kpis: [...state.project.gtmPlan.kpis, action.payload],
          },
        },
      }
    case 'UPDATE_KPI':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          gtmPlan: {
            ...state.project.gtmPlan,
            kpis: state.project.gtmPlan.kpis.map((k) =>
              k.id === action.payload.id ? { ...k, ...action.payload.data } : k,
            ),
          },
        },
      }
    case 'DELETE_KPI':
      return {
        ...state,
        isDirty: true,
        project: {
          ...state.project,
          gtmPlan: {
            ...state.project.gtmPlan,
            kpis: state.project.gtmPlan.kpis.filter((k) => k.id !== action.payload.id),
          },
        },
      }
    // ── Lifecycle ────────────────────────────────────────────
    case 'MARK_SAVING':
      return { ...state, saveStatus: { type: 'saving' } }
    case 'MARK_SAVED':
      return { ...state, isDirty: false, saveStatus: { type: 'saved' } }
    case 'MARK_SAVE_ERROR':
      return { ...state, isDirty: false, saveStatus: { type: 'error', message: action.payload.message } }
    case 'MARK_IDLE':
      return { ...state, saveStatus: { type: 'idle' } }
    default:
      return state
  }
}

// ─── Factory: create initial ProjectState from a loaded Project ─

function makeInitialState(project: Project): ProjectState {
  return {
    project,
    isDirty: false,
    saveStatus: { type: 'idle' },
  }
}

// ─── Context ─────────────────────────────────────────────────

interface ProjectContextValue {
  state: ProjectState
  dispatch: (action: ProjectAction) => void
  saveStatus: SaveStatus
}

const ProjectContext = createContext<ProjectContextValue | null>(null)

interface ProjectProviderProps {
  project: Project
  children: ReactNode
}

export function ProjectProvider({ project, children }: ProjectProviderProps) {
  const [state, dispatch] = useReducer(projectReducer, makeInitialState(project))

  // Keep a ref to always have the latest project in the autosave closure
  const projectRef = useRef<Project>(state.project)
  useEffect(() => {
    projectRef.current = recomputeStatuses(state.project)
  })

  // Autosave: debounce on project changes
  useEffect(() => {
    if (!state.isDirty) return

    const timer = setTimeout(() => {
      dispatch({ type: 'MARK_SAVING' })
      const toSave = recomputeStatuses(projectRef.current)
      const result = projectRepository.updateProject(toSave)
      if (result.ok) {
        dispatch({ type: 'MARK_SAVED' })
      } else {
        dispatch({ type: 'MARK_SAVE_ERROR', payload: { message: result.error } })
      }
    }, 300)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.project])

  // Reset saveStatus to idle 2s after 'saved'
  useEffect(() => {
    if (state.saveStatus.type !== 'saved') return
    const timer = setTimeout(() => dispatch({ type: 'MARK_IDLE' }), 2000)
    return () => clearTimeout(timer)
  }, [state.saveStatus])

  const stableDispatch = useCallback(dispatch, [])

  return (
    <ProjectContext.Provider
      value={{ state, dispatch: stableDispatch, saveStatus: state.saveStatus }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const ctx = useContext(ProjectContext)
  if (!ctx) throw new Error('useProject must be used within ProjectProvider')
  return ctx
}
