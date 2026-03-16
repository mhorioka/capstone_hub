import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from '@/contexts/AppContext'
import { ProjectLayout } from '@/components/layout/ProjectLayout'
import { ProjectListPage } from '@/pages/ProjectListPage'
import { ProjectDashboardPage } from '@/pages/ProjectDashboardPage'
import { MarketResearchPage } from '@/pages/MarketResearchPage'
import { CompetitiveAnalysisPage } from '@/pages/CompetitiveAnalysisPage'
import { GTMPlanPage } from '@/pages/GTMPlanPage'
import { ReportPage } from '@/pages/ReportPage'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProjectListPage />} />
          <Route path="/projects/:id" element={<ProjectLayout />}>
            <Route index element={<ProjectDashboardPage />} />
            <Route path="market" element={<MarketResearchPage />} />
            <Route path="competitive" element={<CompetitiveAnalysisPage />} />
            <Route path="gtm" element={<GTMPlanPage />} />
            <Route path="report" element={<ReportPage />} />
          </Route>
          <Route
            path="*"
            element={
              <div className="flex min-h-screen items-center justify-center">
                <p className="text-slate-500">404 — Page not found</p>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
