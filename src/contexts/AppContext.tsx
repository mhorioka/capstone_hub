import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { Project } from '@/types/models'
import type { AppState, AppAction } from '@/types/store'
import { initialAppState } from '@/types/store'
import { projectRepository } from '@/lib/repository'

// ─── Reducer ─────────────────────────────────────────────────

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_PROJECTS':
      return { ...state, projects: action.payload }
    case 'CREATE_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] }
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.payload.id),
        activeProjectId:
          state.activeProjectId === action.payload.id ? null : state.activeProjectId,
      }
    case 'SET_ACTIVE_PROJECT':
      return { ...state, activeProjectId: action.payload.id }
    default:
      return state
  }
}

// ─── Context ─────────────────────────────────────────────────

interface AppContextValue {
  state: AppState
  createProject: (project: Project) => void
  deleteProject: (id: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialAppState)

  // Load projects from localStorage on mount
  useEffect(() => {
    const result = projectRepository.listProjects()
    if (result.ok) {
      // listProjects returns summaries, but we need full projects for the state
      const projectResults = result.data.map((summary) => projectRepository.getProject(summary.id))
      const projects: Project[] = []
      for (const r of projectResults) {
        if (r.ok) projects.push(r.data)
      }
      dispatch({ type: 'LOAD_PROJECTS', payload: projects })
    }
  }, [])

  function createProject(project: Project) {
    const result = projectRepository.saveProject(project)
    if (result.ok) {
      dispatch({ type: 'CREATE_PROJECT', payload: project })
    }
  }

  function deleteProject(id: string) {
    const result = projectRepository.deleteProject(id)
    if (result.ok) {
      dispatch({ type: 'DELETE_PROJECT', payload: { id } })
    }
  }

  return (
    <AppContext.Provider value={{ state, createProject, deleteProject }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
