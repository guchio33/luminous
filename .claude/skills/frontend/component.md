---
description: React コンポーネントを生成する
---

# /component - コンポーネント生成スキル

## 概要

Next.js App Router に対応した React コンポーネントを生成します。
TypeScript + Tailwind CSS のテンプレートを使用し、props の型定義も自動生成します。

## 使用方法

```
/component Button
/component UserCard
/component Header --client
```

## 生成ルール

### ファイル配置
- `apps/web/src/components/` 配下に作成
- コンポーネント名は PascalCase
- ファイル名: `ComponentName.tsx`

### コンポーネント構造

```tsx
// Server Component (デフォルト)
type Props = {
  // props の型定義
};

export function ComponentName({ ...props }: Props) {
  return (
    <div>
      {/* コンポーネントの内容 */}
    </div>
  );
}
```

```tsx
// Client Component (--client オプション時)
"use client";

import { useState } from "react";

type Props = {
  // props の型定義
};

export function ComponentName({ ...props }: Props) {
  return (
    <div>
      {/* コンポーネントの内容 */}
    </div>
  );
}
```

## スタイリングルール

- Tailwind CSS のユーティリティクラスを使用
- プロジェクトのカラースキームを使用:
  - 背景: `bg-navy` (#0a0e1a)
  - アクセント: `text-gold` (#d4af37)
  - テキスト: `text-white`
- 必要に応じて `className` props を受け取れるようにする

## ベストプラクティス

1. デフォルトは Server Component として作成
2. `useState`, `useEffect` などを使う場合のみ Client Component にする
3. props は明示的に型定義する
4. 再利用可能な設計を心がける
5. コンポーネントは export function で named export する
