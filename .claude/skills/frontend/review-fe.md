---
description: Next.js/React コードをレビューしてベストプラクティスに基づく改善を提案する
---

# /review-fe - フロントエンドレビュースキル

## 概要

Next.js App Router と React のコードをレビューします。
パフォーマンス、アクセシビリティ、ベストプラクティスの観点から分析します。

## 使用方法

```
/review-fe apps/web/src/app/page.tsx
/review-fe apps/web/src/components/
/review-fe apps/web/src/hooks/useFetch.ts
```

---

## レビュー観点

### 1. Server Component vs Client Component

**チェック項目**:
- [ ] デフォルトで Server Component を使用しているか
- [ ] `"use client"` は必要最小限か
- [ ] Client Component を小さく分離しているか

**NG パターン**:
```tsx
// NG: ページ全体を Client Component にしている
"use client";

export default function Page() {
  const [data, setData] = useState([]);
  // ...
}
```

**OK パターン**:
```tsx
// OK: Server Component + 部分的に Client Component
import { ClientInteractiveSection } from "./ClientInteractiveSection";

export default async function Page() {
  const data = await fetchData();
  return (
    <div>
      <h1>{data.title}</h1>
      <ClientInteractiveSection />
    </div>
  );
}
```

---

### 2. データフェッチ

**チェック項目**:
- [ ] Server Component で直接 fetch しているか
- [ ] 適切なキャッシュ戦略を使用しているか
- [ ] loading.tsx / Suspense を使用しているか

**NG パターン**:
```tsx
// NG: Client Component で useEffect フェッチ
"use client";
export default function Page() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/api/data").then(res => res.json()).then(setData);
  }, []);
}
```

**OK パターン**:
```tsx
// OK: Server Component で直接フェッチ
export default async function Page() {
  const data = await fetch("https://api.example.com/data", {
    next: { revalidate: 60 }, // 60秒キャッシュ
  });
  return <div>{data.title}</div>;
}
```

---

### 3. レンダリングパフォーマンス

**チェック項目**:
- [ ] 不要な再レンダリングがないか
- [ ] `useMemo` / `useCallback` を適切に使用しているか
- [ ] key prop が適切に設定されているか

**NG パターン**:
```tsx
// NG: レンダリングごとに新しいオブジェクト/関数を生成
<ChildComponent style={{ color: "red" }} onClick={() => handleClick()} />
```

**OK パターン**:
```tsx
// OK: 安定した参照
const style = useMemo(() => ({ color: "red" }), []);
const handleClick = useCallback(() => { /* ... */ }, []);
<ChildComponent style={style} onClick={handleClick} />
```

---

### 4. メタデータ / SEO

**チェック項目**:
- [ ] `metadata` または `generateMetadata` を export しているか
- [ ] title, description が設定されているか
- [ ] OGP タグが設定されているか

**OK パターン**:
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ページタイトル",
  description: "ページの説明",
  openGraph: {
    title: "OGタイトル",
    description: "OG説明",
    images: ["/og-image.png"],
  },
};
```

---

### 5. エラーハンドリング

**チェック項目**:
- [ ] `error.tsx` が配置されているか
- [ ] `not-found.tsx` が配置されているか
- [ ] try-catch でエラーを適切にハンドリングしているか

---

### 6. アクセシビリティ

**チェック項目**:
- [ ] セマンティックな HTML を使用しているか
- [ ] alt, aria-label が適切に設定されているか
- [ ] キーボード操作に対応しているか
- [ ] フォーカス管理が適切か

**NG パターン**:
```tsx
// NG: div でボタンを作成
<div onClick={handleClick}>クリック</div>
```

**OK パターン**:
```tsx
// OK: button 要素を使用
<button type="button" onClick={handleClick}>クリック</button>
```

---

### 7. 型安全性

**チェック項目**:
- [ ] `any` 型を使用していないか
- [ ] props の型が明示されているか
- [ ] API レスポンスの型が定義されているか

**NG パターン**:
```tsx
// NG: any 型
function Component({ data }: { data: any }) {}
```

**OK パターン**:
```tsx
// OK: 明示的な型定義
type UserData = {
  id: string;
  name: string;
};

function Component({ data }: { data: UserData }) {}
```

---

### 8. コンポーネント設計

**チェック項目**:
- [ ] 単一責任の原則に従っているか
- [ ] 再利用可能な設計か
- [ ] props が多すぎないか (5個以上は要検討)

---

### 9. Tailwind CSS

**チェック項目**:
- [ ] プロジェクトのカラースキームに従っているか
- [ ] レスポンシブ対応しているか
- [ ] ダークモード対応しているか (必要な場合)

**プロジェクトカラー**:
- 背景: `bg-navy`, `bg-navy-light`
- アクセント: `text-gold`, `text-gold-light`
- テキスト: `text-white`

---

### 10. セキュリティ

**チェック項目**:
- [ ] `dangerouslySetInnerHTML` を使用していないか
- [ ] ユーザー入力をサニタイズしているか
- [ ] 機密情報がクライアントに露出していないか

---

## レビューレポート形式

```markdown
## FE レビュー結果: [ファイル名]

### Server/Client Component
- [ ] 指摘事項

### パフォーマンス
- [ ] 指摘事項

### アクセシビリティ
- [ ] 指摘事項

### 型安全性
- [ ] 指摘事項

### セキュリティ
- [ ] 指摘事項

### 良い点
- 良い点1
```

## 重要度レベル

| レベル | 説明 | 例 |
|--------|------|-----|
| CRITICAL | 本番で問題を引き起こす | XSS脆弱性、機密情報露出 |
| HIGH | パフォーマンス/UX に影響 | 不要な Client Component、N+1 |
| MEDIUM | ベストプラクティス違反 | metadata 未設定、any 型使用 |
| LOW | 改善の余地あり | 命名、コード整理 |
