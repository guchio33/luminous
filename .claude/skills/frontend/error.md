---
description: Next.js と Hono のエラーハンドリングを実装する
---

# /error - エラーハンドリングスキル

## 概要

Next.js App Router と Hono API のエラーハンドリングを統一的に実装します。

## 使用方法

```
/error page           # FE エラーページ生成
/error api            # BE エラーハンドリング生成
/error all            # FE + BE 両方
```

---

## FE: Next.js App Router

### 1. error.tsx (ランタイムエラー)

```tsx
"use client";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy">
      <h1 className="text-2xl font-bold text-gold">
        エラーが発生しました
      </h1>
      <p className="mt-4 text-white/70">
        {error.message || "予期しないエラーが発生しました"}
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded bg-gold px-4 py-2 text-navy hover:bg-gold-light"
      >
        再試行
      </button>
    </div>
  );
}
```

### 2. not-found.tsx (404)

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy">
      <h1 className="text-6xl font-bold text-gold">404</h1>
      <p className="mt-4 text-xl text-white">
        ページが見つかりませんでした
      </p>
      <Link
        href="/"
        className="mt-6 rounded bg-gold px-4 py-2 text-navy hover:bg-gold-light"
      >
        ホームに戻る
      </Link>
    </div>
  );
}
```

### 3. global-error.tsx (ルートレイアウトエラー)

```tsx
"use client";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="ja">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-navy">
          <h1 className="text-2xl font-bold text-gold">
            致命的なエラーが発生しました
          </h1>
          <button
            onClick={reset}
            className="mt-6 rounded bg-gold px-4 py-2 text-navy"
          >
            再試行
          </button>
        </div>
      </body>
    </html>
  );
}
```

### 配置ルール

```
apps/web/src/app/
├── error.tsx           # ルートレベルエラー
├── not-found.tsx       # ルートレベル404
├── global-error.tsx    # ルートレイアウトエラー
└── [feature]/
    ├── error.tsx       # 機能別エラー (オプション)
    └── not-found.tsx   # 機能別404 (オプション)
```

---

## BE: Hono API

### 1. 共通エラー型 (packages/shared/)

```typescript
// packages/shared/src/types/error.ts

export type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export type ApiErrorResponse = {
  success: false;
  error: ApiError;
};

// エラーコード定義
export const ErrorCode = {
  // 認証系
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  // バリデーション系
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_INPUT: "INVALID_INPUT",
  // リソース系
  NOT_FOUND: "NOT_FOUND",
  ALREADY_EXISTS: "ALREADY_EXISTS",
  // サーバー系
  INTERNAL_ERROR: "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
```

### 2. エラーハンドリングミドルウェア

```typescript
// apps/api/src/middleware/error-handler.ts
import { Context, MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { ApiErrorResponse, ErrorCode } from "@luminous/shared";

export const errorHandler: MiddlewareHandler = async (c, next) => {
  try {
    await next();
  } catch (error) {
    return handleError(c, error);
  }
};

function handleError(c: Context, error: unknown): Response {
  // Zod バリデーションエラー
  if (error instanceof ZodError) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: "入力値が不正です",
        details: { issues: error.errors },
      },
    };
    return c.json(response, 400);
  }

  // Hono HTTPException
  if (error instanceof HTTPException) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: getErrorCode(error.status),
        message: error.message,
      },
    };
    return c.json(response, error.status);
  }

  // 予期しないエラー
  console.error("Unhandled error:", error);
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code: ErrorCode.INTERNAL_ERROR,
      message: "サーバーエラーが発生しました",
    },
  };
  return c.json(response, 500);
}

function getErrorCode(status: number): ErrorCode {
  switch (status) {
    case 400:
      return ErrorCode.INVALID_INPUT;
    case 401:
      return ErrorCode.UNAUTHORIZED;
    case 403:
      return ErrorCode.FORBIDDEN;
    case 404:
      return ErrorCode.NOT_FOUND;
    case 409:
      return ErrorCode.ALREADY_EXISTS;
    default:
      return ErrorCode.INTERNAL_ERROR;
  }
}
```

### 3. エラーをスローするユーティリティ

```typescript
// apps/api/src/utils/errors.ts
import { HTTPException } from "hono/http-exception";

export function notFound(message = "リソースが見つかりません"): never {
  throw new HTTPException(404, { message });
}

export function badRequest(message = "不正なリクエストです"): never {
  throw new HTTPException(400, { message });
}

export function unauthorized(message = "認証が必要です"): never {
  throw new HTTPException(401, { message });
}

export function forbidden(message = "アクセス権限がありません"): never {
  throw new HTTPException(403, { message });
}

export function conflict(message = "リソースが既に存在します"): never {
  throw new HTTPException(409, { message });
}
```

### 4. 使用例

```typescript
// apps/api/src/routes/users.ts
import { Hono } from "hono";
import { notFound, badRequest } from "../utils/errors";

const app = new Hono();

app.get("/:id", async (c) => {
  const id = c.req.param("id");
  const user = await findUser(id);

  if (!user) {
    notFound("ユーザーが見つかりません");
  }

  return c.json({ success: true, data: user });
});
```

---

## HTTP ステータスコード一覧

| コード | 意味 | 使用場面 |
|--------|------|----------|
| 400 | Bad Request | バリデーションエラー、不正なリクエスト |
| 401 | Unauthorized | 未認証 |
| 403 | Forbidden | 認証済みだが権限なし |
| 404 | Not Found | リソースが存在しない |
| 409 | Conflict | リソースの競合 (重複など) |
| 422 | Unprocessable Entity | セマンティックエラー |
| 500 | Internal Server Error | サーバー内部エラー |
| 503 | Service Unavailable | サービス停止中 |

---

## ベストプラクティス

1. **FE**
   - `error.tsx` は必ず `"use client"` を付ける
   - ユーザーに分かりやすいメッセージを表示
   - 再試行ボタンやホームへ戻るリンクを提供

2. **BE**
   - エラーレスポンス形式を統一する
   - 本番環境ではスタックトレースを返さない
   - エラーログを適切に記録する

3. **共通**
   - エラーコードを定義して FE/BE で共有
   - ユーザー向けメッセージと開発者向け詳細を分離
