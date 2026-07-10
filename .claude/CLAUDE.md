# Luminous プロジェクト

夢ややりたいことを共有するプラットフォーム。

## セキュリティ (重要)

**以下のファイル・情報は絶対に読み取り・出力しないこと:**

- `.env` / `.env.*` (環境変数ファイル)
- `*.pem` / `*.key` (秘密鍵)
- `credentials.json` / `secrets.json`
- `serviceAccountKey.json` (Firebase/GCP)
- API キー、シークレット、トークン
- パスワード、認証情報

**禁止事項:**
- 環境変数の値を出力・表示しない
- シークレットをコード内にハードコードしない
- 認証情報をログに出力しない
- `.gitignore` に含まれる機密ファイルを読み取らない

**環境変数の扱い:**
- 環境変数名のみ参照可 (値は参照不可)
- `.env.example` のテンプレートは作成可
- 実際の値は `<YOUR_API_KEY>` のようなプレースホルダーを使用

## 技術スタック

### フロントエンド (FE)
- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript 5
- **スタイリング**: Tailwind CSS 4
- **テスト**: Vitest + React Testing Library

### バックエンド (BE)
- **フレームワーク**: Hono
- **言語**: TypeScript 5
- **API設計**: OpenAPI 3.1
- **テスト**: Vitest

### データベース (DB)
- **DB**: Supabase (PostgreSQL)
- **ORM**: Supabase Client / Drizzle (検討中)

### 共通
- **パッケージマネージャ**: pnpm
- **モノレポ**: pnpm workspace

## プロジェクト構造

```
luminous/
├── apps/
│   ├── web/                 # Next.js フロントエンド
│   │   └── src/
│   │       ├── app/         # App Router (ページ)
│   │       ├── components/  # UIコンポーネント
│   │       └── hooks/       # カスタムフック
│   └── api/                 # Hono バックエンド
│       └── src/
│           ├── routes/      # APIルート
│           ├── middleware/  # ミドルウェア
│           ├── services/    # ビジネスロジック
│           └── db/          # DB接続・クエリ
├── packages/
│   ├── shared/              # FE/BE共通の型・ユーティリティ
│   └── api-client/          # OpenAPIから生成したクライアント
└── docs/
    └── openapi/             # OpenAPI仕様書
```

## コーディング規約

### コンポーネント

- デフォルトは Server Component
- `useState`, `useEffect` を使う場合のみ `"use client"` を付ける
- named export を使用 (`export function Component`)
- props は型定義を明示する

### スタイリング

- Tailwind CSS のユーティリティクラスを使用
- カラースキーム:
  - 背景: `bg-navy` (#0a0e1a), `bg-navy-light` (#1a2234)
  - アクセント: `text-gold` (#d4af37), `text-gold-light` (#f4e4bc)
  - テキスト: `text-white`
- フォント: Cormorant Garamond (英語), Noto Serif JP (日本語)

### API (Hono)

- `apps/api/src/routes/` 配下にルートを作成
- OpenAPI 仕様を先に定義してから実装
- REST 規約に従う
- エラーは適切な HTTP ステータスコードを返す
- Zod でリクエスト/レスポンスのバリデーション

### 型定義

- `any` 型は使用禁止
- 共通の型は `packages/shared/` に配置
- OpenAPI から型を自動生成
- Zod でランタイムバリデーション

## 実装フロー (TDD)

**すべての実装依頼は、粒度に関わらず以下のフローに従う。**

### フロー概要

```
依頼 → 要件整理 → [型定義 → テスト → 実装] × 各レイヤー → E2E → 完了報告
```

### 詳細フロー

#### Step 1: 要件整理
- 依頼内容から実装範囲を明確にする
- 必要なレイヤー (型定義 / API / Hook / Component / Page) を特定する

#### Step 2: 各レイヤーごとに TDD サイクル

以下の順序で、レイヤーごとに繰り返す:

1. **OpenAPI 設計** (`docs/openapi/`)
2. **型生成** (`packages/shared/`)
3. **DB スキーマ** (`apps/api/src/db/`)
4. **API 実装** (`apps/api/src/routes/`)
5. **Hook** (`apps/web/src/hooks/`)
6. **Component** (`apps/web/src/components/`)
7. **Page** (`apps/web/src/app/`)

各レイヤーで:
```
テストケース設計 → テスト作成 (Red) → 実装 (Green) → リファクタ
```

#### Step 3: テストケース設計

各レイヤーで以下を考慮:

**正常系**
- 期待通りの入力で期待通りの結果が返る
- 境界値のテスト

**異常系**
- 不正な入力に対するエラーハンドリング
- 存在しないリソースへのアクセス
- 認証/認可エラー
- ネットワークエラー

#### Step 4: E2E テスト
- ユニットテストがすべて通過した後に実施
- 実際のユーザーフローをテスト
- ブラウザでの動作を検証

#### Step 5: 完了報告
- 実装したファイル一覧
- テスト結果のサマリー
- PR 作成の準備完了を報告

### 例: 「新規登録機能を作成して」の場合

```
1. 要件整理: OpenAPI + DB + API + 画面が必要
2. OpenAPI: POST /users エンドポイントを定義
3. 型生成: openapi-typescript で型を生成
4. DB: users テーブルのスキーマ定義
5. API (Hono):
   - テスト作成 (正常系: 登録成功 / 異常系: バリデーションエラー)
   - 実装
6. Hook:
   - テスト作成
   - 実装
7. Component:
   - テスト作成
   - 実装
8. Page:
   - テスト作成
   - 実装
9. E2E テスト実行
10. 完了報告
```

### 例: 「新規登録APIを作成して」の場合

```
1. 要件整理: OpenAPI + DB + API
2. OpenAPI: POST /users エンドポイントを定義
3. 型生成
4. DB: users テーブルのスキーマ定義
5. API (Hono):
   - テスト作成 (正常系 / 異常系)
   - 実装
6. E2E テスト実行 (API のみ)
7. 完了報告
```

## コマンド

```bash
# ルート
pnpm dev           # 全アプリ起動
pnpm build         # 全アプリビルド
pnpm lint          # 全体 lint
pnpm test          # 全体テスト
pnpm test:e2e      # E2E テスト

# フロントエンド (apps/web)
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web test

# バックエンド (apps/api)
pnpm --filter api dev
pnpm --filter api build
pnpm --filter api test

# OpenAPI
pnpm generate:types   # OpenAPI から型生成
```

## スキル

スキルは `.claude/skills/` にカテゴリ別に整理:

```
.claude/skills/
├── design/      # 設計系
├── frontend/    # FE開発
├── backend/     # BE開発
└── quality/     # 品質管理
```

### 設計系 (design/)
| スキル | 説明 |
|--------|------|
| `/openapi` | OpenAPI 3.1 仕様書を作成・更新 |
| `/db-design` | DB設計 (ER図、テーブル定義) |
| `/feature` | 機能一括生成 (設計から実装まで) |

### FE開発 (frontend/)
| スキル | 説明 |
|--------|------|
| `/component` | React コンポーネント生成 |
| `/page` | Next.js ページ生成 |
| `/hook` | カスタムフック生成 |
| `/error` | エラーハンドリング (error.tsx, not-found.tsx) |
| `/review-fe` | FE コードレビュー (Next.js ベストプラクティス) |

### BE開発 (backend/)
| スキル | 説明 |
|--------|------|
| `/hono-api` | Hono API ルート生成 |
| `/hono-middleware` | Hono ミドルウェア生成 |
| `/supabase` | Supabase スキーマ・クエリ生成 |
| `/review-be` | BE コードレビュー (Hono/Supabase ベストプラクティス) |

### 品質管理 (quality/)
| スキル | 説明 |
|--------|------|
| `/review` | コードレビュー (共通) |
| `/test` | テスト生成 (Vitest) |
| `/a11y` | アクセシビリティチェック |
| `/typecheck` | 型安全性チェック |

## ハーネス構成

AI エージェント向けの開発環境整備（ハーネスエンジニアリング）。

### 構成要素

| 要素 | 配置 | 説明 |
|------|------|------|
| ルール | `.claude/CLAUDE.md` | プロジェクト規約、コーディング規約 |
| スキル | `.claude/skills/` | 再利用可能な手順書 (16個) |
| フック | `.claude/settings.json` | 自動実行トリガー (TypeCheck, Lint) |
| メモリ | `.claude/memory/` | セッション間コンテキスト |

### フィードバックループ (自動検証)

AI の出力を自動的に検証し、エラーがあれば修正を促す仕組み。

| タイミング | 仕組み | 内容 |
|-----------|--------|------|
| ファイル編集時 | Claude hooks | TypeCheck, console.log 警告 |
| コミット前 | husky + lint-staged | ESLint, Prettier |
| PR作成後 | GitHub Actions | lint, typecheck, test, build |

### メモリの使い方

```
.claude/memory/
├── progress.md    # 進捗・次のステップを記録
├── decisions.md   # 設計判断の履歴
└── context.md     # セッション間で共有すべき情報
```

**セッション終了時**: 重要な進捗を `progress.md` に記録
**設計判断時**: 理由と選択肢を `decisions.md` に記録
**新セッション開始時**: `memory/` を読んでコンテキストを把握
