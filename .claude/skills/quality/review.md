---
description: コードをレビューして問題点と改善提案を提示する (FE/BE 共通)
---

# /review - コードレビュースキル

## 概要

FE/BE 両方のコードをレビューします。
より詳細なレビューには専用スキルを使用してください。

## 専用レビュースキル

| スキル | 対象 | 配置 |
|--------|------|------|
| `/review-fe` | Next.js / React | `.claude/skills/frontend/review-fe.md` |
| `/review-be` | Hono / Supabase | `.claude/skills/backend/review-be.md` |

## 使用方法

```
/review apps/web/src/           # FE 全体
/review apps/api/src/           # BE 全体
/review-fe apps/web/src/app/    # FE 詳細レビュー
/review-be apps/api/src/routes/ # BE 詳細レビュー
```

## 共通レビュー観点

### 1. コード品質
- 可読性とメンテナンス性
- 命名規則の一貫性
- 重複コードの検出
- 単一責任の原則

### 2. TypeScript
- `any` 型の使用禁止
- 型定義の明示
- 共通型の共有 (`packages/shared/`)

### 3. セキュリティ
- 入力値のバリデーション
- 機密情報の取り扱い
- 認証・認可

### 4. テスト
- テストカバレッジ
- 正常系・異常系のテスト

## 重要度レベル

| レベル | 説明 | 例 |
|--------|------|-----|
| CRITICAL | 本番で問題を引き起こす | セキュリティ脆弱性 |
| HIGH | パフォーマンス/UX に影響 | N+1、不要な再レンダリング |
| MEDIUM | ベストプラクティス違反 | any 型、エラーハンドリング不足 |
| LOW | 改善の余地あり | 命名、コード整理 |
