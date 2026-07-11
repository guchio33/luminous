# /pr - Pull Request 内容を生成

## 概要

現在のブランチの変更内容から PR のタイトルと本文を生成する。

## 使用方法

```
/pr [base-branch]
```

- `base-branch`: 比較対象のブランチ（デフォルト: `main`）

## 実行手順

1. **変更内容の収集**

   ```bash
   # 変更されたファイルの統計
   git diff <base-branch> --stat

   # コミット履歴
   git log <base-branch>..HEAD --oneline

   # 詳細な差分（必要に応じて）
   git diff <base-branch> --name-only
   ```

2. **PR 内容の生成**

   以下のフォーマットで出力する:

   ```markdown
   ## PR タイトル

   <type>: <簡潔な説明>

   ## PR 本文

   ## Summary

   - 変更点を箇条書きで記述
   - 主要な変更を 3-5 点程度

   ## 変更内容

   ### [カテゴリ名]

   詳細な変更内容を記述

   ## Test plan

   - [ ] テスト項目1
   - [ ] テスト項目2
   ```

3. **タイプの選択**

   | タイプ     | 用途             |
   | ---------- | ---------------- |
   | `feat`     | 新機能           |
   | `fix`      | バグ修正         |
   | `refactor` | リファクタリング |
   | `docs`     | ドキュメント     |
   | `chore`    | 設定・依存関係   |
   | `test`     | テスト追加・修正 |

## 出力例

```markdown
## PR タイトル

feat: ユーザー認証機能を追加

## PR 本文

## Summary

- JWT を使用したユーザー認証を実装
- ログイン・ログアウト API を追加
- 認証ミドルウェアを作成

## 変更内容

### API

- `POST /auth/login`: ログイン
- `POST /auth/logout`: ログアウト
- `GET /auth/me`: 現在のユーザー情報

### ミドルウェア

- `authMiddleware`: 認証必須エンドポイント用

## Test plan

- [ ] ログインが正常に動作する
- [ ] 不正なパスワードでログインが失敗する
- [ ] ログアウト後にトークンが無効になる
```

## 注意事項

- PR のタイトルは 50 文字以内を推奨
- Summary は簡潔に、詳細は「変更内容」セクションに記載
- Test plan は実際にテストすべき項目を具体的に記載
