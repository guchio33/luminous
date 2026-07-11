# ADR-0003: 技術スタックの選定

## ステータス

承認済み

## コンテキスト

Luminous は「夢ややりたいことを共有するプラットフォーム」である。
モダンで保守性の高い技術スタックを選定する必要がある。

## 決定

### フロントエンド

| カテゴリ       | 技術                           | バージョン |
| -------------- | ------------------------------ | ---------- |
| フレームワーク | Next.js (App Router)           | 16.x       |
| 言語           | TypeScript                     | 5.x        |
| スタイリング   | Tailwind CSS                   | 4.x        |
| テスト         | Vitest + React Testing Library | -          |

### バックエンド

| カテゴリ       | 技術       | バージョン |
| -------------- | ---------- | ---------- |
| フレームワーク | Hono       | 4.x        |
| 言語           | TypeScript | 5.x        |
| バリデーション | Zod        | 3.x        |
| テスト         | Vitest     | 3.x        |

### インフラ・DB

| カテゴリ          | 技術                      |
| ----------------- | ------------------------- |
| データベース      | Supabase (PostgreSQL)     |
| ホスティング (FE) | Vercel                    |
| ホスティング (BE) | Cloudflare Workers (予定) |

### 共通

| カテゴリ             | 技術                   |
| -------------------- | ---------------------- |
| パッケージマネージャ | pnpm                   |
| リンター             | ESLint 9 (Flat Config) |
| フォーマッター       | Prettier               |
| Git フック           | Husky + lint-staged    |

## 理由

### Next.js 16 (App Router)

- React Server Components によるパフォーマンス向上
- ファイルベースルーティングの直感性
- Vercel との親和性

### Hono

- 軽量かつ高速
- Web Standards 準拠（Cloudflare Workers 対応）
- TypeScript ファースト

### Tailwind CSS 4

- ユーティリティファーストによる高速開発
- デザインシステムとの統合が容易

### Supabase

- PostgreSQL の信頼性
- リアルタイム機能の組み込み
- 認証機能の提供

### Vitest

- Vite との統合による高速なテスト実行
- Jest 互換 API

## 影響

- 学習コスト: Next.js App Router、Hono の習熟が必要
- デプロイ: Vercel + Cloudflare の構成が前提

## 関連

- ADR-0001: モノレポアーキテクチャの採用
