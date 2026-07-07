# セッション間コンテキスト

セッションをまたいで共有すべき情報を記録する。

## 現在のプロジェクト状態

| 項目 | 状態 |
|------|------|
| 環境構築 | 完了 (Next.js) |
| DB設計 | 未着手 |
| 認証機能 | 未着手 |
| 基本機能 | 未着手 |

## 既知の問題

(現在なし)

## 重要なファイルパス

```
apps/web/src/app/          # FE ページ
apps/api/src/routes/       # BE API ルート
packages/shared/           # 共通型
docs/openapi/              # OpenAPI 仕様
```

## 環境変数 (名前のみ)

```
# Supabase
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# Next.js
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## 注意事項

- `.env` ファイルは読み取り禁止
- `any` 型は使用禁止
- TDD フローに従って実装
