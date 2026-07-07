---
description: Next.js App Router のページを生成する
---

# /page - ページ生成スキル

## 概要

Next.js App Router 形式のページを生成します。
ディレクトリ構造、page.tsx、必要に応じて layout.tsx も作成します。

## 使用方法

```
/page timeline
/page login
/page users/[id]
/page settings --layout
```

## 生成ルール

### ファイル配置
- `apps/web/src/app/` 配下にディレクトリを作成
- 動的ルートは `[param]` 形式

### ページ構造

```tsx
// apps/web/src/app/[route]/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ページタイトル | Luminous",
  description: "ページの説明",
};

export default function PageName() {
  return (
    <main>
      {/* ページの内容 */}
    </main>
  );
}
```

### 動的ルートの場合

```tsx
// apps/web/src/app/users/[id]/page.tsx
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `User ${id} | Luminous`,
  };
}

export default async function UserPage({ params }: Props) {
  const { id } = await params;

  return (
    <main>
      <h1>User: {id}</h1>
    </main>
  );
}
```

## スタイリングルール

- Tailwind CSS を使用
- プロジェクトのカラースキーム:
  - 背景: `bg-navy` / `bg-navy-light`
  - アクセント: `text-gold` / `text-gold-light`
  - テキスト: `text-white`
- フォント: Cormorant Garamond (英語), Noto Serif JP (日本語)

## ベストプラクティス

1. 必ず metadata を設定する
2. main タグでコンテンツをラップする
3. 共通レイアウトは layout.tsx に抽出する
4. ローディング状態は loading.tsx で定義
5. エラー処理は error.tsx で定義
