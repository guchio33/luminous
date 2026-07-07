---
description: TypeScript の型安全性をチェック・改善する
---

# /typecheck - 型安全性チェックスキル

## 概要

TypeScript の型定義を分析し、型安全性の問題を検出します。
any 型の排除、より厳密な型定義の提案、型エラーの修正をサポートします。

## 使用方法

```
/typecheck apps/web/src/hooks/
/typecheck apps/api/src/routes/
/typecheck packages/shared/
```

## チェック項目

### 1. any 型の検出
### 2. unknown vs any
### 3. 型の網羅性チェック
### 4. null/undefined の適切な処理
### 5. 関数の戻り値型
### 6. 型アサーション
### 7. Discriminated Unions

## レポート形式

```markdown
## 型安全性レポート: [ファイル名]

### HIGH - 型安全性の重大な問題
- [ ] 行XX: any 型の使用 -> 具体的な型に変更

### MEDIUM - 改善推奨
- [ ] 行XX: 暗黙的な型 -> 明示的に定義
```
