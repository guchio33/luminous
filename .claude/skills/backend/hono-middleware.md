---
description: Hono ミドルウェアを生成する
---

# /hono-middleware - Hono ミドルウェア生成スキル

## 概要

Hono 用のカスタムミドルウェアを生成します。
認証、ログ、エラーハンドリングなどの横断的関心事を処理します。

## 使用方法

```
/hono-middleware auth
/hono-middleware rateLimit
/hono-middleware errorHandler
```

## ファイル配置

```
apps/api/src/middleware/
├── auth.ts          # 認証ミドルウェア
├── rateLimit.ts     # レートリミット
├── errorHandler.ts  # エラーハンドリング
└── validate.ts      # バリデーション
```

## テンプレート

### 認証ミドルウェア (auth.ts)

```typescript
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { supabase } from "../db/client";

type AuthEnv = {
  Variables: {
    userId: string;
    user: { id: string; email: string };
  };
};

export const authMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HTTPException(401, { message: "認証が必要です" });
  }

  const token = authHeader.split(" ")[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new HTTPException(401, { message: "無効なトークンです" });
  }

  c.set("userId", user.id);
  c.set("user", { id: user.id, email: user.email! });

  await next();
});
```

### エラーハンドリング (errorHandler.ts)

```typescript
import { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof ZodError) {
    return c.json({ error: "Validation Error", details: err.errors }, 400);
  }
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }
  return c.json({ error: "Internal Server Error" }, 500);
};
```

## ベストプラクティス

1. createMiddleware で型安全に実装する
2. HTTPException で適切なエラーを投げる
3. 環境変数で設定を外部化する
4. 本番では Redis など外部ストアを使用する
5. テストで正常系・異常系を網羅する
