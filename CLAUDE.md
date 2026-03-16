# CLAUDE.md — 市場参入レポート作成支援ツール

## プロジェクト概要

EMBAキャップストーン向けの食品メーカー市場参入レポート作成支援Webアプリ。チームが市場調査・競合分析・GTMプランを構造化して入力・管理し、最終レポートを出力できるツール。

---

## Tech Stack

| レイヤー | 技術 |
|---|---|
| フレームワーク | React 19 + Vite + TypeScript |
| ルーティング | React Router v6 |
| UI | Tailwind CSS + shadcn/ui |
| データ永続化 | localStorage（MVP） |
| 状態管理 | React Context + useReducer |
| チャート | Recharts |
| i18n | react-i18next（日本語 / 英語） |

---

## コマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # TypeScript型チェック + Viteビルド
npm run lint     # ESLint
npm run preview  # ビルド成果物プレビュー
```

---

## ページ構造

```
/                          → プロジェクト一覧・作成
/projects/[id]             → プロジェクトダッシュボード（進捗サマリー）
/projects/[id]/market      → 市場調査
/projects/[id]/competitive → 競合分析
/projects/[id]/gtm         → GTMプラン
/projects/[id]/report      → レポートビュー（印刷対応）
```

---

## データモデル

```typescript
Project
  ├── MarketResearch
  │   ├── MarketOverview    // 市場規模・CAGR・市場定義
  │   ├── Segment[]         // セグメント名・規模・特徴
  │   ├── ConsumerInsight[] // インタビュー/調査メモ
  │   ├── Barrier[]         // 規制・参入障壁
  │   └── Trend[]           // 市場トレンド
  ├── CompetitiveAnalysis
  │   ├── Competitor[]      // 企業名・市場シェア・強弱・製品・価格帯
  │   ├── PositioningMap    // X/Y軸設定 + 競合プロット
  │   └── SWOT              // Strengths / Weaknesses / Opportunities / Threats
  └── GTMPlan
      ├── Persona[]         // ターゲット顧客ペルソナ
      ├── EntryStrategy     // チャネル・価格戦略
      ├── Initiative[]      // 施策（タイトル・説明・担当・期日）
      ├── Phase[]           // Phase 1/2/3 マイルストーン
      └── KPI[]             // 指標名・目標値・測定方法
```

---

## 実装ルール

### コーディング方針
- 型安全を重視。`any` は使わない
- localStorage のキーは `capstone_v1_` プレフィックスを使用
- Context はプロジェクト単位でスコープを切る
- useReducer のアクション型は discriminated union で定義する

### UI / UX
- shadcn/ui コンポーネントをベースに使用。独自スタイルはなるべく避ける
- Tailwind のカスタムクラスより utility class を優先
- デスクトップ優先（1280px以上）。レスポンシブ対応は必須ではない
- サイドバー + メインコンテンツのレイアウト固定

### i18n
- すべての表示文字列は `react-i18next` の `t()` を経由する
- 翻訳キーは `section.subsection.key` 形式（例: `market.overview.title`）
- デフォルト言語は日本語、英語に切り替え可能
- 言語設定は localStorage に保存

### データ永続化
- 自動保存: 入力変更後即時 localStorage に書き込む（debounce 300ms）
- プロジェクトIDはUUID v4を使用
- 将来のDB移行を想定し、CRUD操作はリポジトリ層に集約する

### セクション完成度
- 各セクションに `status: 'empty' | 'in_progress' | 'done'` を持たせる
- 必須フィールドが1つでも入力されたら `in_progress`
- すべての必須フィールドが埋まったら `done`

---

## Out of Scope（実装しない）

- ユーザー認証・ログイン
- リアルタイム同期編集
- AI自動生成機能
- Word/Excel形式エクスポート
- 外部データAPIとの連携

---

## 開発フェーズ

### Phase 1 — MVP（現在）
- [ ] プロジェクト管理（作成・一覧）
- [ ] 市場調査セクション（全項目）
- [ ] 競合分析セクション（競合プロファイル + SWOT）
- [ ] GTMプランセクション（施策・KPI）
- [ ] レポートビュー（印刷対応）
- [ ] localStorage永続化
- [ ] 日本語 / 英語 切り替え（react-i18next）
