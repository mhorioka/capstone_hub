// ============================================================
// Repository — Data Access Interface
// MVP: localStorage backend
// Future: swap implementation for DB without changing callers
// localStorage key prefix: capstone_v1_
// ============================================================

import type { Project, ProjectSummary } from '../types/models';
import { recomputeStatuses } from '../types/models';

// ─── Storage Keys ────────────────────────────────────────────

export const STORAGE_KEYS = {
  PROJECTS_INDEX: 'capstone_v1_projects_index',  // string[] of project IDs
  PROJECT: (id: string) => `capstone_v1_project_${id}`,
  LANGUAGE: 'capstone_v1_language',
} as const;

// ─── Repository Interface ─────────────────────────────────────
// All methods are synchronous for localStorage MVP.
// Returning Result<T> pattern to handle parse errors without throwing.

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export interface IProjectRepository {
  /** 全プロジェクトのサマリー一覧を取得 */
  listProjects(): Result<ProjectSummary[]>;

  /** 単一プロジェクトを取得 */
  getProject(id: string): Result<Project>;

  /** プロジェクトを新規保存 */
  saveProject(project: Project): Result<void>;

  /** プロジェクトを更新（部分更新は呼び出し元で Project を組み立てて渡す） */
  updateProject(project: Project): Result<void>;

  /** プロジェクトを削除 */
  deleteProject(id: string): Result<void>;

  /** プロジェクトが存在するか確認 */
  projectExists(id: string): boolean;
}

// ─── localStorage Implementation ─────────────────────────────

export class LocalStorageProjectRepository implements IProjectRepository {
  private getIndex(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS_INDEX);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  }

  private setIndex(ids: string[]): void {
    localStorage.setItem(STORAGE_KEYS.PROJECTS_INDEX, JSON.stringify(ids));
  }

  listProjects(): Result<ProjectSummary[]> {
    try {
      const ids = this.getIndex();
      const summaries: ProjectSummary[] = [];
      const staleIds: string[] = [];

      for (const id of ids) {
        const result = this.getProject(id);
        if (result.ok) {
          const p = result.data;
          summaries.push({
            id: p.id,
            name: p.name,
            targetMarket: p.targetMarket,
            foodCategory: p.foodCategory,
            targetDate: p.targetDate,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            marketResearchStatus: p.marketResearch.status,
            competitiveAnalysisStatus: p.competitiveAnalysis.status,
            gtmPlanStatus: p.gtmPlan.status,
          });
        } else {
          // ID is in the index but the project JSON is missing or malformed.
          // Collect it for index cleanup to prevent the index from diverging.
          staleIds.push(id);
        }
      }

      if (staleIds.length > 0) {
        this.setIndex(ids.filter((id) => !staleIds.includes(id)));
      }

      return { ok: true, data: summaries };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  }

  getProject(id: string): Result<Project> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROJECT(id));
      if (!raw) return { ok: false, error: `Project ${id} not found` };
      return { ok: true, data: JSON.parse(raw) as Project };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  }

  saveProject(project: Project): Result<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECT(project.id), JSON.stringify(project));
      const ids = this.getIndex();
      if (!ids.includes(project.id)) {
        this.setIndex([...ids, project.id]);
      }
      return { ok: true, data: undefined };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  }

  updateProject(project: Project): Result<void> {
    const updated = recomputeStatuses({ ...project, updatedAt: new Date().toISOString() });
    return this.saveProject(updated);
  }

  deleteProject(id: string): Result<void> {
    try {
      localStorage.removeItem(STORAGE_KEYS.PROJECT(id));
      this.setIndex(this.getIndex().filter((i) => i !== id));
      return { ok: true, data: undefined };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  }

  projectExists(id: string): boolean {
    return localStorage.getItem(STORAGE_KEYS.PROJECT(id)) !== null;
  }
}

// ─── Singleton ───────────────────────────────────────────────

export const projectRepository = new LocalStorageProjectRepository();
