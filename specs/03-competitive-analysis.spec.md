# Feature Spec: 競合分析

## Overview
競合他社のプロファイル、ポジショニング、自社 SWOT 分析、差別化ポイントを管理する。

**Route**: `/projects/[id]/competitive`

---

## サブセクション一覧

| # | サブセクション | 必須フィールド（`in_progress` 判定用） |
|---|---|---|
| 1 | 競合プロファイル | 1社以上の `name` |
| 2 | ポジショニングマップ | `xAxisLabel` + `yAxisLabel` |
| 3 | SWOT分析 | strengths / weaknesses / opportunities / threats いずれか1項目以上 |
| 4 | 差別化ポイント | `differentiators` |

---

## 1. 競合プロファイル

### 表示要件
- [ ] 競合一覧をカード/テーブルで表示する
- [ ] 各競合に表示する情報: 企業名、市場シェア、強み/弱み、製品ライン、価格帯
- [ ] 「競合を追加」ボタンを表示する

### 追加フォーム
| フィールド | 必須 |
|---|---|
| 企業名 | ✓ |
| 市場シェア | |
| 強み | |
| 弱み | |
| 製品ライン | |
| 価格帯 | |

### インタラクション
- [ ] 追加: フォーム送信 → ID 生成 → 一覧に追加 → 自動保存
- [ ] 編集: 展開/モーダル編集 → 自動保存
- [ ] 削除: 確認なしで即時削除（PositioningMap の関連プロットも同時に削除）

---

## 2. ポジショニングマップ

### 表示要件
- [ ] X軸ラベル・Y軸ラベルの入力フィールドを表示する
- [ ] 軸ラベル設定後、競合リストから各社を座標（-100〜100）で配置できる
- [ ] Recharts の ScatterChart を用いて競合の配置をビジュアル表示する
- [ ] 各プロット点に企業名ラベルを表示する

### インタラクション
- [ ] 軸ラベル変更後 300ms debounce で自動保存
- [ ] 座標は数値入力フィールドで指定（Phase 2 ではドラッグ対応を検討）
- [ ] 競合が削除された場合、対応するプロットも自動削除

### 表示ルール
- [ ] AxisLabel が未入力の場合はマップエリアを非表示またはプレースホルダー表示

---

## 3. SWOT分析

### 表示要件
- [ ] 4象限グリッド（Strengths / Weaknesses / Opportunities / Threats）を表示する
- [ ] 各象限に項目リストと「項目を追加」ボタンを表示する

### インタラクション
- [ ] 項目追加: テキスト入力 → Enter または「追加」ボタンで象限リストに追加
- [ ] 項目削除: 各項目横の削除ボタン
- [ ] 変更後 300ms debounce で自動保存

---

## 4. 差別化ポイント

### 表示要件
- [ ] テキストエリアを表示する

### インタラクション
- [ ] 入力後 300ms debounce で自動保存

---

## セクション完成度ロジック

```
status = 'empty'
  → 全サブセクションに入力なし

status = 'in_progress'
  → competitors.length > 0
    OR positioningMap.xAxisLabel !== ''
    OR swot の任意象限に1項目以上
    OR differentiators !== ''

status = 'done'
  → competitors.length >= 1
    AND positioningMap.xAxisLabel !== '' AND positioningMap.yAxisLabel !== ''
    AND (swot.strengths.length + swot.weaknesses.length +
         swot.opportunities.length + swot.threats.length) >= 4
    AND differentiators !== ''
```

---

## エラーケース

| ケース | 期待動作 |
|---|---|
| 競合名が空で追加押下 | フィールドにエラー表示、保存しない |
| PositioningMap に未登録の competitorId | プロットを無視して表示しない |
