---
description: Hono/Supabase コードをレビューしてベストプラクティスに基づく改善を提案する
---

# /review-be - バックエンドレビュースキル

## 概要

Hono API と Supabase のコードをレビューします。
セキュリティ、パフォーマンス、ベストプラクティスの観点から分析します。

## 使用方法

```
/review-be apps/api/src/routes/users.ts
/review-be apps/api/src/middleware/
/review-be apps/api/src/services/
```

---

## レビュー観点

### 1. Hono ルート設計

**チェック項目**:
- [ ] RESTful な URL 設計か
- [ ] 適切な HTTP メソッドを使用しているか
- [ ] ルートがモジュール化されているか

**NG パターン**:
```typescript
// NG: 単一ファイルに全ルートを記述
app.get("/getUsers", ...);
app.post("/createUser", ...);
```

**OK パターン**:
```typescript
// OK: モジュール化 + RESTful
// apps/api/src/routes/users.ts
const users = new Hono();
users.get("/", listUsers);        // GET /users
users.get("/:id", getUser);       // GET /users/:id
users.post("/", createUser);      // POST /users
users.put("/:id", updateUser);    // PUT /users/:id
users.delete("/:id", deleteUser); // DELETE /users/:id

export { users };
```

---

### 2. バリデーション (Zod)

**チェック項目**:
- [ ] リクエストボディをバリデーションしているか
- [ ] パスパラメータをバリデーションしているか
- [ ] クエリパラメータをバリデーションしているか

**NG パターン**:
```typescript
// NG: バリデーションなし
app.post("/users", async (c) => {
  const body = await c.req.json();
  // body をそのまま使用
});
```

**OK パターン**:
```typescript
// OK: Zod でバリデーション
import { zValidator } from "@hono/zod-validator";

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
});

app.post("/users", zValidator("json", createUserSchema), async (c) => {
  const body = c.req.valid("json");
  // バリデーション済みの body を使用
});
```

---

### 3. エラーハンドリング

**チェック項目**:
- [ ] エラーミドルウェアを使用しているか
- [ ] 適切な HTTP ステータスコードを返しているか
- [ ] エラーレスポンス形式が統一されているか

**NG パターン**:
```typescript
// NG: 生のエラーを返す
app.get("/users/:id", async (c) => {
  try {
    const user = await findUser(c.req.param("id"));
    return c.json(user);
  } catch (e) {
    return c.json({ error: e.message }, 500); // 全て500
  }
});
```

**OK パターン**:
```typescript
// OK: HTTPException を使用
import { HTTPException } from "hono/http-exception";

app.get("/users/:id", async (c) => {
  const user = await findUser(c.req.param("id"));
  if (!user) {
    throw new HTTPException(404, { message: "ユーザーが見つかりません" });
  }
  return c.json({ success: true, data: user });
});
```

---

### 4. 認証・認可

**チェック項目**:
- [ ] 認証ミドルウェアを使用しているか
- [ ] 認可 (権限チェック) を行っているか
- [ ] 機密エンドポイントが保護されているか

**OK パターン**:
```typescript
// OK: 認証ミドルウェア
import { authMiddleware } from "../middleware/auth";

const protectedRoutes = new Hono();
protectedRoutes.use("*", authMiddleware);

protectedRoutes.get("/me", async (c) => {
  const user = c.get("user"); // ミドルウェアで設定
  return c.json({ data: user });
});
```

---

### 5. Supabase クエリ

**チェック項目**:
- [ ] RLS (Row Level Security) が有効か
- [ ] N+1 クエリが発生していないか
- [ ] 適切なインデックスを使用しているか
- [ ] select で必要なカラムのみ取得しているか

**NG パターン**:
```typescript
// NG: 全カラム取得 + N+1
const { data: users } = await supabase.from("users").select("*");
for (const user of users) {
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", user.id);
}
```

**OK パターン**:
```typescript
// OK: 必要なカラムのみ + JOIN
const { data } = await supabase
  .from("users")
  .select(`
    id,
    name,
    posts (
      id,
      title,
      created_at
    )
  `)
  .order("created_at", { foreignTable: "posts", ascending: false });
```

---

### 6. RLS ポリシー

**チェック項目**:
- [ ] テーブルに RLS が有効化されているか
- [ ] SELECT/INSERT/UPDATE/DELETE のポリシーが定義されているか
- [ ] ポリシーが適切に制限しているか

**OK パターン**:
```sql
-- RLS 有効化
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 自分の投稿のみ読み取り可能
CREATE POLICY "Users can read own posts"
ON posts FOR SELECT
USING (auth.uid() = user_id);

-- 自分の投稿のみ更新可能
CREATE POLICY "Users can update own posts"
ON posts FOR UPDATE
USING (auth.uid() = user_id);
```

---

### 7. 型安全性

**チェック項目**:
- [ ] `any` 型を使用していないか
- [ ] API レスポンス型が定義されているか
- [ ] Supabase の生成型を使用しているか

**OK パターン**:
```typescript
// OK: Supabase 生成型を使用
import type { Database } from "@luminous/shared/database.types";

type User = Database["public"]["Tables"]["users"]["Row"];

const getUser = async (id: string): Promise<User | null> => {
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();
  return data;
};
```

---

### 8. セキュリティ

**チェック項目**:
- [ ] SQL インジェクション対策がされているか
- [ ] 機密情報をログに出力していないか
- [ ] 環境変数を適切に使用しているか
- [ ] CORS 設定が適切か

**NG パターン**:
```typescript
// NG: 生の SQL に変数を埋め込む
const query = `SELECT * FROM users WHERE id = '${id}'`;
```

**OK パターン**:
```typescript
// OK: Supabase クライアント or パラメータ化クエリ
const { data } = await supabase
  .from("users")
  .eq("id", id)
  .single();
```

---

### 9. パフォーマンス

**チェック項目**:
- [ ] 不要なデータを取得していないか
- [ ] ページネーションを実装しているか
- [ ] キャッシュを活用しているか

**OK パターン**:
```typescript
// OK: ページネーション
app.get("/posts", async (c) => {
  const page = Number(c.req.query("page") || 1);
  const limit = Number(c.req.query("limit") || 20);
  const offset = (page - 1) * limit;

  const { data, count } = await supabase
    .from("posts")
    .select("id, title, created_at", { count: "exact" })
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  return c.json({
    data,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
});
```

---

### 10. ミドルウェア

**チェック項目**:
- [ ] 共通処理がミドルウェア化されているか
- [ ] ミドルウェアの順序が適切か
- [ ] エラーハンドリングミドルウェアが最後に配置されているか

**OK パターン**:
```typescript
// OK: ミドルウェアの適切な順序
const app = new Hono();

// 1. ロギング
app.use("*", logger());

// 2. CORS
app.use("*", cors());

// 3. 認証 (保護ルートのみ)
app.use("/api/*", authMiddleware);

// 4. ルート
app.route("/api/users", users);

// 5. エラーハンドリング (最後)
app.onError(errorHandler);
```

---

## レビューレポート形式

```markdown
## BE レビュー結果: [ファイル名]

### API 設計
- [ ] 指摘事項

### バリデーション
- [ ] 指摘事項

### エラーハンドリング
- [ ] 指摘事項

### 認証・認可
- [ ] 指摘事項

### Supabase / RLS
- [ ] 指摘事項

### セキュリティ
- [ ] 指摘事項

### パフォーマンス
- [ ] 指摘事項

### 良い点
- 良い点1
```

## 重要度レベル

| レベル | 説明 | 例 |
|--------|------|-----|
| CRITICAL | 本番で問題を引き起こす | SQLインジェクション、認証バイパス、RLS未設定 |
| HIGH | データ破損/漏洩リスク | バリデーション欠如、N+1 クエリ |
| MEDIUM | ベストプラクティス違反 | エラー形式不統一、any 型使用 |
| LOW | 改善の余地あり | 命名、コード整理 |
