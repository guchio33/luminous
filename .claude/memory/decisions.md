# 設計判断の履歴

重要な設計判断を記録し、なぜその決定をしたかを残す。

## フォーマット

```markdown
## [日付] 判断タイトル

### 背景
なぜこの判断が必要だったか

### 選択肢
1. 選択肢A - メリット/デメリット
2. 選択肢B - メリット/デメリット

### 決定
選択した内容と理由

### 影響範囲
この決定が影響するファイル・機能
```

---

## 判断履歴

### 2024-XX-XX 技術スタック選定

**背景**: プロジェクト開始時の技術選定

**決定**:
- FE: Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- BE: Hono + TypeScript
- DB: Supabase (PostgreSQL)
- API設計: OpenAPI 3.1
- テスト: Vitest + React Testing Library

**理由**:
- Next.js 16: 最新の App Router で Server Components 活用
- Hono: 軽量で高速、TypeScript ファースト
- Supabase: PostgreSQL + 認証 + RLS が一体化
- OpenAPI: FE/BE 間の型共有を自動化
