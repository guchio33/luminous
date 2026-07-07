---
description: OpenAPI 3.1 仕様書を作成・更新する
---

# /openapi - OpenAPI 設計スキル

## 概要

RESTful API の設計を OpenAPI 3.1 形式で作成します。
API 実装の前に必ずこのスキルで設計を行います。

## 使用方法

```
/openapi users
/openapi auth
/openapi dreams --crud
```

## ファイル配置

```
docs/openapi/
├── openapi.yaml        # メインファイル (paths を $ref で参照)
├── paths/
│   ├── users.yaml      # /users エンドポイント
│   └── auth.yaml       # /auth エンドポイント
├── components/
│   ├── schemas/        # データスキーマ
│   ├── parameters/     # 共通パラメータ
│   └── responses/      # 共通レスポンス
└── examples/           # リクエスト/レスポンス例
```

## テンプレート

### メインファイル (openapi.yaml)

```yaml
openapi: 3.1.0
info:
  title: Luminous API
  version: 1.0.0
  description: 夢ややりたいことを共有するプラットフォームの API

servers:
  - url: http://localhost:3001
    description: 開発環境
  - url: https://api.luminous.app
    description: 本番環境

paths:
  /users:
    $ref: './paths/users.yaml#/users'
  /users/{id}:
    $ref: './paths/users.yaml#/users~1{id}'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

security:
  - bearerAuth: []
```

### パスファイル (paths/users.yaml)

```yaml
users:
  get:
    operationId: getUsers
    summary: ユーザー一覧取得
    tags:
      - users
    parameters:
      - name: limit
        in: query
        schema:
          type: integer
          default: 20
      - name: offset
        in: query
        schema:
          type: integer
          default: 0
    responses:
      '200':
        description: 成功
        content:
          application/json:
            schema:
              type: object
              properties:
                data:
                  type: array
                  items:
                    $ref: '../components/schemas/User.yaml'
                total:
                  type: integer
      '401':
        $ref: '../components/responses/Unauthorized.yaml'

  post:
    operationId: createUser
    summary: ユーザー作成
    tags:
      - users
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '../components/schemas/CreateUserInput.yaml'
    responses:
      '201':
        description: 作成成功
        content:
          application/json:
            schema:
              $ref: '../components/schemas/User.yaml'
      '400':
        $ref: '../components/responses/BadRequest.yaml'
      '409':
        $ref: '../components/responses/Conflict.yaml'
```

### スキーマ (components/schemas/User.yaml)

```yaml
type: object
required:
  - id
  - email
  - createdAt
  - updatedAt
properties:
  id:
    type: string
    format: uuid
    description: ユーザーID
  email:
    type: string
    format: email
    description: メールアドレス
  name:
    type: string
    description: 表示名
  avatarUrl:
    type: string
    format: uri
    nullable: true
    description: アバター画像URL
  createdAt:
    type: string
    format: date-time
    description: 作成日時
  updatedAt:
    type: string
    format: date-time
    description: 更新日時
```

## 設計ルール

### 命名規約

| 項目 | 規約 | 例 |
|------|------|-----|
| パス | ケバブケース、複数形 | `/users`, `/dream-comments` |
| operationId | キャメルケース | `getUsers`, `createUser` |
| スキーマ | パスカルケース | `User`, `CreateUserInput` |

### HTTP メソッド

| メソッド | 用途 | ステータス |
|---------|------|-----------|
| GET | 取得 | 200 |
| POST | 作成 | 201 |
| PUT | 全体更新 | 200 |
| PATCH | 部分更新 | 200 |
| DELETE | 削除 | 204 |

### エラーレスポンス

| ステータス | 用途 |
|-----------|------|
| 400 | バリデーションエラー |
| 401 | 認証エラー |
| 403 | 認可エラー |
| 404 | リソース不存在 |
| 409 | 競合 (重複など) |
| 500 | サーバーエラー |

## 型生成

OpenAPI から TypeScript 型を生成:

```bash
pnpm generate:types
```

内部で `openapi-typescript` を使用:

```bash
npx openapi-typescript docs/openapi/openapi.yaml -o packages/shared/src/api-types.ts
```

## ベストプラクティス

1. 実装前に必ず OpenAPI を定義する
2. スキーマは再利用可能な単位で分割する
3. 全てのエンドポイントに operationId を付ける
4. 例 (examples) を充実させる
5. 認証が必要なエンドポイントは security を指定
