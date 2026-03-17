# 市場参入レポート作成支援ツール

EMBAキャップストーン向けの市場参入レポート作成支援Webアプリです。  
食品メーカーの新規市場参入をテーマに、市場調査・競合分析・GTMプランを構造化して入力し、最終レポートまで一貫して整理できます。

## 主な機能

- プロジェクトの作成・一覧表示・削除
- プロジェクト単位のダッシュボード表示
- 市場調査セクションの入力と進捗管理
- 競合分析セクションの入力と進捗管理
- GTMプランの入力と進捗管理
- レポートビューの表示
- `localStorage` を使ったローカル保存
- 日本語 / 英語の表示切り替え

## 画面構成

```text
/                          プロジェクト一覧・新規作成
/projects/:id              プロジェクトダッシュボード
/projects/:id/market       市場調査
/projects/:id/competitive  競合分析
/projects/:id/gtm          GTMプラン
/projects/:id/report       レポートビュー
```

## 技術スタック

- React 19
- Vite
- TypeScript
- React Router
- Tailwind CSS
- shadcn/ui
- react-i18next
- Recharts

## セットアップ

前提:

- Node.js
- npm

依存関係をインストールします。

```bash
npm install
```

## 起動方法

開発サーバーを起動:

```bash
npm run dev
```

起動後、表示されたローカルURLをブラウザで開いてください。通常は `http://localhost:5173` です。

## 利用可能なコマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # TypeScript型チェック + 本番ビルド
npm run lint     # ESLint実行
npm run preview  # ビルド成果物のローカル確認
```

## データ保存

- 入力データはブラウザの `localStorage` に保存されます
- 保存先はローカル環境のみで、外部DBや認証機能は使っていません
- ブラウザストレージを削除すると、保存済みデータも消えます

## 想定ユースケース

1. 新しいプロジェクトを作成する
2. 市場調査・競合分析・GTMプランを順番に入力する
3. ダッシュボードで進捗を確認する
4. レポートビューで全体を見直す

## 補足

- MVP段階のアプリです
- リアルタイム共同編集、外部API連携、Word/Excelエクスポートは対象外です
