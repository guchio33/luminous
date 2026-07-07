---
description: 機能単位で OpenAPI + DB + API + フック + コンポーネント + ページを一括生成する
---

# /feature - 機能一括生成スキル

## 概要

CRUD 機能を持つ完全な機能セットを一括で生成します。
OpenAPI 設計から始まり、DB スキーマ、Hono API、フロントエンドまでを TDD で作成します。

## 使用方法

```
/feature users
/feature dreams
/feature comments --no-frontend
```

## 生成されるファイル構造

```
/feature users を実行した場合:

luminous/
├── docs/openapi/
│   ├── paths/users.yaml           # OpenAPI パス定義
│   └── components/schemas/
│       ├── User.yaml              # User スキーマ
│       ├── CreateUserInput.yaml   # 作成入力
│       └── UpdateUserInput.yaml   # 更新入力
├── packages/shared/
│   └── src/types/user.ts          # 共通型定義 (自動生成)
├── apps/api/
│   └── src/
│       ├── db/
│       │   ├── schema/users.sql   # DB スキーマ + RLS
│       │   └── queries/users.ts   # DB クエリ
│       ├── services/
│       │   └── userService.ts     # ビジネスロジック
│       └── routes/
│           ├── users.ts           # Hono ルート
│           └── users.test.ts      # API テスト
└── apps/web/
    └── src/
        ├── hooks/
        │   ├── useUsers.ts        # データフェッチフック
        │   └── useUsers.test.ts   # フックテスト
        ├── components/
        │   ├── UserCard.tsx       # カード UI
        │   ├── UserCard.test.tsx  # コンポーネントテスト
        │   ├── UserList.tsx       # リスト UI
        │   └── UserList.test.tsx
        └── app/users/
            ├── page.tsx           # 一覧ページ
            └── [id]/
                └── page.tsx       # 詳細ページ
```

---

## TDD フロー

`/feature users` を実行すると、以下の順序で実装:

### Step 1: OpenAPI 設計
### Step 2: 型生成
### Step 3: DB スキーマ
### Step 4: API テスト (Red)
### Step 5: API 実装 (Green)
### Step 6: フロントエンドテスト (Red)
### Step 7: フロントエンド実装 (Green)
### Step 8: E2E テスト

---

## オプション

| オプション | 説明 |
|-----------|------|
| `--no-frontend` | FE (Hook, Component, Page) を生成しない |
| `--no-api` | BE (API, Service, DB) を生成しない |
| `--no-detail` | 詳細ページを生成しない |

---

## ベストプラクティス

1. OpenAPI を最初に設計し、型を自動生成する
2. テストを先に書いてから実装する (TDD)
3. 正常系・異常系の両方をテストする
4. RLS ポリシーで認可を実装する
5. ビジネスロジックは services/ に分離する
6. FE/BE で型を共有する (packages/shared)
