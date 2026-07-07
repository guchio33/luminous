---
description: React カスタムフックを生成する
---

# /hook - カスタムフック生成スキル

## 概要

React のカスタムフックを生成します。
TypeScript の型定義付きで、再利用可能なロジックをカプセル化します。

## 使用方法

```
/hook useLocalStorage
/hook useDebounce
/hook useFetch
```

## 生成ルール

### ファイル配置
- `apps/web/src/hooks/` 配下に作成
- ファイル名: `useHookName.ts`
- フック名は `use` プレフィックス必須

### 基本構造

```tsx
// apps/web/src/hooks/useHookName.ts
import { useState, useEffect, useCallback } from "react";

type UseHookNameOptions = {
  // オプションの型定義
};

type UseHookNameReturn = {
  // 戻り値の型定義
};

export function useHookName(
  options?: UseHookNameOptions
): UseHookNameReturn {
  // フックの実装

  return {
    // 戻り値
  };
}
```

## よくあるパターン

### 状態管理フック
### 副作用フック
### データフェッチフック
### LocalStorage フック

## ベストプラクティス

1. フック名は必ず `use` で始める
2. 戻り値の型を明示的に定義する
3. クリーンアップ関数を適切に実装する
4. 依存配列を正しく設定する
5. SSR を考慮して `typeof window` チェックを行う
6. useCallback / useMemo で最適化する
