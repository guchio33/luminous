---
description: Hono API ルートを生成する
---

# /hono-api - Hono API ルート生成スキル

## 概要

Hono フレームワークで API エンドポイントを生成します。
OpenAPI 仕様に基づいて、型安全な API を実装します。

## 使用方法

```
/hono-api users
/hono-api auth/login
/hono-api dreams --crud
```

## ファイル配置

```
apps/api/src/
├── index.ts              # エントリーポイント
├── routes/
│   ├── index.ts          # ルート集約
│   ├── users.ts          # /users ルート
│   └── auth.ts           # /auth ルート
├── services/
│   └── userService.ts    # ビジネスロジック
├── middleware/
│   └── auth.ts           # 認証ミドルウェア
└── db/
    └── queries/
        └── users.ts      # DB クエリ
```

## テンプレート

### エントリーポイント (index.ts)

```typescript
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { usersRoute } from "./routes/users";
import { authRoute } from "./routes/auth";

const app = new Hono();

// ミドルウェア
app.use("*", logger());
app.use("*", cors());

// ルート
app.route("/users", usersRoute);
app.route("/auth", authRoute);

// ヘルスチェック
app.get("/health", (c) => c.json({ status: "ok" }));

export default app;
```

### ルートファイル (routes/users.ts)

```typescript
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth";
import * as userService from "../services/userService";

// バリデーションスキーマ
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  password: z.string().min(8),
});

export const usersRoute = new Hono();

// GET /users - 一覧取得
usersRoute.get("/", authMiddleware, async (c) => {
  const result = await userService.getUsers();
  return c.json(result);
});

// POST /users - 作成
usersRoute.post("/", zValidator("json", createUserSchema), async (c) => {
  const input = c.req.valid("json");
  const user = await userService.createUser(input);
  return c.json(user, 201);
});
```

## ベストプラクティス

1. OpenAPI 仕様に従って実装する
2. Zod でリクエストのバリデーションを行う
3. ビジネスロジックは services/ に分離する
4. エラーは適切な HTTP ステータスコードで返す
5. 認証が必要なルートには authMiddleware を適用
6. テストでは正常系・異常系を網羅する
