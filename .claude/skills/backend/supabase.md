---
description: Supabase スキーマ・クエリを生成する
---

# /supabase - Supabase スキーマ・クエリ生成スキル

## 概要

Supabase (PostgreSQL) のテーブルスキーマ、RLS ポリシー、クエリを生成します。

## 使用方法

```
/supabase users
/supabase dreams --rls
/supabase comments
```

## ファイル配置

```
apps/api/src/db/
├── client.ts           # Supabase クライアント
├── schema/
│   ├── users.sql       # users テーブル
│   └── dreams.sql      # dreams テーブル
├── migrations/         # マイグレーションファイル
│   └── 001_initial.sql
└── queries/
    ├── users.ts        # users クエリ
    └── dreams.ts       # dreams クエリ
```

## テンプレート

### テーブルスキーマ (schema/users.sql)

```sql
-- users テーブル
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- インデックス
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users (email);

-- RLS を有効化
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS ポリシー
CREATE POLICY "Users can view own data"
  ON public.users FOR SELECT
  USING (auth.uid() = id);
```

### クエリ (queries/users.ts)

```typescript
import { supabase } from "../client";
import type { User } from "@luminous/shared";

export async function findAll(options: { limit: number; offset: number }) {
  const { data, count, error } = await supabase
    .from("users")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(options.offset, options.offset + options.limit - 1);

  if (error) throw error;
  return { data: data as User[], total: count ?? 0 };
}
```

## RLS ポリシーパターン

| パターン | 用途 |
|---------|------|
| `auth.uid() = user_id` | 自分のデータのみ |
| `is_public = true` | 公開データは誰でも |
| `TO authenticated` | 認証済みユーザーのみ |

## ベストプラクティス

1. 必ず RLS を有効にする
2. インデックスを適切に設定する
3. 外部キー制約で整合性を保つ
4. updated_at は自動更新する
5. 型は Supabase CLI で自動生成する
