# Project Requirements Document (PRD)
## 市場参入レポート作成支援ツール
### EMBA Capstone — 食品メーカー Market Entry

---

## 1. Context & Purpose

EMBAキャップストーンプロジェクトとして、食品メーカーの市場参入（Market Entry）を計画するチームが共同でレポートを作成するための支援Webアプリケーション。

**背景**:
- チームでの分担作業・情報共有が煩雑（メール/スプレッドシートでのやり取り）
- 市場調査・競合分析・GTMプランの構造化が必要
- 最終的に統一されたレポートを出力したい

**目的**: チームが構造化された形で市場参入戦略の各要素を入力・管理・共有し、最終レポートを効率的に完成させる。

---

## 2. Target Users

| ユーザー | ロール |
|---|---|
| プロジェクトリーダー | プロジェクト作成、全体管理 |
| チームメンバー | 各セクションへの情報入力・編集 |

チーム規模: 3〜6名想定

---

## 3. Core Features

### 3.1 プロジェクト管理
- プロジェクト作成（プロジェクト名、対象市場、食品カテゴリ、目標期日）
- プロジェクト一覧・選択

### 3.2 市場調査（Market Research）
- **市場概要**: 市場規模、成長率（CAGR）、市場定義
- **ターゲットセグメント**: セグメント一覧（名称・規模・特徴）
- **消費者インサイト**: インタビュー/調査結果のメモ
- **規制・参入障壁**: 法規制、コスト、技術的障壁
- **市場トレンド**: キートレンドのリスト

### 3.3 競合分析（Competitive Analysis）
- **競合プロファイル**: 企業名、市場シェア、強み・弱み、製品ライン、価格帯
- **ポジショニングマップ**: X/Y軸を自由設定し、競合を配置（ビジュアル）
- **自社SWOT分析**: Strengths / Weaknesses / Opportunities / Threats
- **差別化ポイント**: 自社の優位性の記述

### 3.4 GTMプラン（Go-to-Market Plan）
- **ターゲット顧客定義**: ペルソナ
- **参入戦略**: チャネル選択（小売/EC/B2B等）、価格戦略
- **マーケティング施策**: 施策一覧（タイトル・説明・担当・期日）
- **フェーズ計画**: Phase 1/2/3 のマイルストーン
- **KPI**: 目標指標一覧（指標名・目標値・測定方法）

### 3.5 レポートビュー
- 全セクションを1ページで閲覧できるまとめビュー
- 印刷/PDF出力対応（ブラウザ印刷）

### 3.6 ナビゲーション & UX
- サイドバーでセクション間を移動
- セクション別の完成度インジケーター（未入力/入力中/完了）
- 自動保存（入力後即時保存）
- ヘッダーの言語トグル（JA / EN）で全UI即時切り替え

---

## 4. Out of Scope（今回は対象外）

- ユーザー認証・ログイン（初版はシングルユーザー/ローカル）
- リアルタイム同期編集
- AI自動生成機能
- Word/Excel形式エクスポート
- 外部データAPIとの連携（市場データ自動取得）

---

## 5. Technical Requirements

### Tech Stack

| レイヤー | 技術 |
|---|---|
| フレームワーク | React 18 + Vite + TypeScript |
| ルーティング | React Router v6 |
| UI | Tailwind CSS + shadcn/ui |
| データ永続化 | localStorage（MVP） → 将来的にDB移行可能な設計 |
| 状態管理 | React Context + useReducer |
| チャート | Recharts（ポジショニングマップ等） |
| i18n | react-i18next（日本語 / 英語） |

### データ設計（主要エンティティ）

```
Project
  ├── MarketResearch
  │   ├── MarketOverview
  │   ├── Segment[]
  │   ├── ConsumerInsight[]
  │   ├── Barrier[]
  │   └── Trend[]
  ├── CompetitiveAnalysis
  │   ├── Competitor[]
  │   ├── PositioningMap
  │   └── SWOT
  └── GTMPlan
      ├── Persona[]
      ├── EntryStrategy
      ├── Initiative[]
      ├── Phase[]
      └── KPI[]
```

---

## 6. Page Structure

```
/                          → プロジェクト一覧・作成
/projects/[id]             → プロジェクトダッシュボード（進捗サマリー）
/projects/[id]/market      → 市場調査
/projects/[id]/competitive → 競合分析
/projects/[id]/gtm         → GTMプラン
/projects/[id]/report      → レポートビュー（印刷対応）
```

---

## 7. UI Design Principles

- **言語**: 日本語 / 英語 切り替え対応（ヘッダーのトグルで即時切り替え、設定はlocalStorageに保存）
- **レイアウト**: サイドナビ + メインコンテンツエリア
- **デザイン**: ビジネス向けのクリーンなスタイル（shadcn/ui デフォルトテーマ）
- **レスポンシブ**: デスクトップ優先（1280px以上）
- **アクセシビリティ**: 基本的なキーボード操作・コントラスト比確保

---

## 8. Non-Functional Requirements

- 初回ロード: 3秒以内
- オフライン動作: localStorage使用のためネット不要（MVP）
- データ永続化: ページリロード後もデータ保持
- ブラウザ対応: Chrome最新版（主要ターゲット）

---

## 9. Development Phases

### Phase 1 — MVP

- [ ] プロジェクト管理（作成・一覧）
- [ ] 市場調査セクション（全項目）
- [ ] 競合分析セクション（競合プロファイル + SWOT）
- [ ] GTMプランセクション（施策・KPI）
- [ ] レポートビュー（印刷対応）
- [ ] localStorage永続化
- [ ] 日本語 / 英語 切り替え（react-i18next）

### Phase 2 — 拡張（将来）

- [ ] ユーザー認証・共有URL
- [ ] データベース（Supabase/PlanetScale）
- [ ] AI支援機能（Claude API）
- [ ] ポジショニングマップ（インタラクティブ）

---

## 10. Success Criteria

- チームメンバーが3セクション（市場調査・競合分析・GTM）をすべて入力できる
- レポートビューから印刷/PDF出力できる
- ページリロード後もデータが保持されている
- 非エンジニアでも直感的に操作できるUI
