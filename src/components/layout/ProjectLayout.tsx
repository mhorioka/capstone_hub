import { useEffect, useState } from 'react'
import { Outlet, useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { projectRepository } from '@/lib/repository'
import type { Project } from '@/types/models'
import { recomputeStatuses } from '@/types/models'
import { ProjectProvider, useProject } from '@/contexts/ProjectContext'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

// Inner component that has access to ProjectContext
function ProjectLayoutInner() {
  const { state, saveStatus } = useProject()
  const project = recomputeStatuses(state.project)

  return (
    <div className="flex min-h-screen flex-col">
      <Header saveStatus={saveStatus} />
      <div className="flex flex-1">
        <Sidebar
          marketStatus={project.marketResearch.status}
          competitiveStatus={project.competitiveAnalysis.status}
          gtmStatus={project.gtmPlan.status}
        />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function ProjectLayout() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [project, setProject] = useState<Project | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) {
      navigate('/')
      return
    }
    const result = projectRepository.getProject(id)
    if (result.ok) {
      setProject(result.data)
    } else {
      setNotFound(true)
    }
  }, [id, navigate])

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-slate-500 mb-4">{t('common.error')}</p>
            <button
              className="text-blue-600 hover:underline"
              onClick={() => navigate('/')}
            >
              {t('nav.projects')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-slate-500">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <ProjectProvider project={project}>
      <ProjectLayoutInner />
    </ProjectProvider>
  )
}
