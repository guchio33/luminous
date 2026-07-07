---
description: Vitest + React Testing Library でテストを生成する
---

# /test - テスト生成スキル

## 概要

コンポーネントや関数のテストコードを生成します。
Vitest と React Testing Library を使用したテストを作成します。

## 使用方法

```
/test apps/web/src/components/Button.tsx
/test apps/web/src/hooks/useDebounce.ts
/test apps/api/src/routes/users.ts
```

## 生成ルール

### ファイル配置
- テスト対象と同じディレクトリに作成
- ファイル名: `ComponentName.test.tsx` または `hookName.test.ts`

### 基本構造

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ComponentName } from "./ComponentName";

describe("ComponentName", () => {
  it("正しくレンダリングされる", () => {
    render(<ComponentName />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
```

## テストパターン

- レンダリングテスト
- インタラクションテスト
- 状態変化テスト
- 非同期テスト

## ベストプラクティス

1. Arrange-Act-Assert パターンを使う
2. 実装の詳細ではなく振る舞いをテストする
3. getByRole でクエリする
4. 日本語でテスト名を記述する
