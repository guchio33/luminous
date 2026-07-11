# ADR-0002: TypeScript 設定の共通化

## ステータス

承認済み

## コンテキスト

モノレポ内の複数パッケージで TypeScript を使用する。
各パッケージで設定が重複・乖離することを防ぎたい。

## 決定

**tsconfig.base.json を作成し、各パッケージで継承する。**

```
luminous/
├── tsconfig.base.json    # 共通設定
├── tsconfig.json         # プロジェクト参照
├── apps/
│   ├── web/tsconfig.json # extends ../../tsconfig.base.json
│   └── api/tsconfig.json # extends ../../tsconfig.base.json
└── packages/
    └── shared/tsconfig.json
```

### 共通設定 (tsconfig.base.json)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "declaration": true,
    "declarationMap": true
  }
}
```

### パッケージ固有設定

- **web**: `jsx`, `lib: ["dom"]`, Next.js プラグイン
- **api**: `outDir`, `rootDir`, Node.js 型
- **shared**: `outDir`, `rootDir`

## 理由

1. **設定の一元管理**: 厳格さのレベルを統一
2. **保守性**: 変更時に1箇所を修正するだけ
3. **柔軟性**: パッケージ固有の設定は上書き可能

## 影響

- 新規パッケージ作成時は `extends` を設定するだけ
- 共通設定の変更は全パッケージに波及

## 関連

- ADR-0001: モノレポアーキテクチャの採用
