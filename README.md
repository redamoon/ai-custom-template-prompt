# ai-custom-template-prompt

CLI tool for managing AI custom templates (Cursor, Claude, Agents)

{{#if repository}}
## リポジトリ

git+https://github.com/redamoon/ai-custom-template-prompt

{{/if}}

## インストール

```bash
# npmでインストール
npm install ai-custom-template-prompt

# または、グローバルインストール
npm install -g ai-custom-template-prompt

# または、npxで直接実行（インストール不要）
npx ai-custom-template-prompt --help
```

## 使用方法

### コマンド一覧

| コマンド | 説明 |
|---------|------|
| `init` | 初回セットアップ（対話式でテンプレートを選択） |
| `add <template>` | 指定テンプレートを追加 |
| `list` | 利用可能なテンプレート一覧を表示 |
| `doctor` | 設定チェック（テンプレートファイルの配置状況を確認） |
| `update-readme` | READMEを自動生成 |

{{#if templates}}
### 利用可能なテンプレート

- `cursor-rules` - cursor rules (→ .cursor/rules.mdc)
- `cursor-manual-rules` - cursor manual rules (→ .cursor/rules/manual-rules.mdc)
- `cursor-test-rules` - cursor test rules (→ .cursor/rules/test-rules.mdc)
- `cursor-api-rules` - cursor api rules (→ .cursor/rules/api-rules.mdc)
- `cursor-backend-rules` - cursor backend rules (→ backend/.cursor/rules/backend-rules.mdc)
- `cursor-frontend-rules` - cursor frontend rules (→ frontend/.cursor/rules/frontend-rules.mdc)
- `cursor-server-rules` - cursor server rules (→ backend/server/.cursor/rules/server-rules.mdc)
- `cursor-commands` - cursor commands (→ .cursor/commands)
- `cursor-command-create-pr` - cursor command create pr (→ .cursor/commands/create-pr.md)
- `cursor-command-create-branch` - cursor command create branch (→ .cursor/commands/create-branch.md)
- `cursor-command-update-readme` - cursor command update readme (→ .cursor/commands/update-readme.md)
- `cursor-command-release` - cursor command release (→ .cursor/commands/release.md)
- `cursor-prompts` - cursor prompts (→ .cursor/prompts.mdc)
- `claude-hooks` - claude hooks (→ .claude/custom-hooks.md)
- `agents` - agents (→ AGENTS.md)

{{/if}}

{{#if scripts}}
## スクリプト

- `build`: `tsc`
- `dev`: `tsx bin/cli.ts`
- `prepublishOnly`: `pnpm build`

{{/if}}

{{#if dependencies}}
## 依存関係

### 本番依存関係

- `@clack/prompts`: ^0.7.0

{{/if}}

{{#if devDependencies}}
### 開発依存関係

- `@types/node`: ^20.0.0
- `tsx`: ^4.7.0
- `typescript`: ^5.3.0

{{/if}}

{{#if projectStructure}}
## プロジェクト構造

```
└── bin
    ├── cli.ts
└── src
    ├── commands
    │   ├── add.ts
    │   ├── doctor.ts
    │   ├── init.ts
    │   ├── list.ts
    │   ├── release.ts
    │   ├── update-readme.ts
    ├── core
    │   └── config.ts
    │   └── generator.ts
    │   └── readme-generator.ts
└── templates
    ├── agents
    │   ├── Agents.md
    ├── claude
    │   ├── custom-hooks.md
    ├── cursor
    │   ├── commands
    │   │   ├── create-branch.md
    │   │   ├── create-pr.md
    │   │   ├── release.md
    │   │   ├── update-readme.md
    │   ├── api-rules.mdc
    │   ├── backend-rules.mdc
    │   ├── frontend-rules.mdc
    │   ├── manual-rules.mdc
    │   ├── prompts.mdc
    │   ├── rules.mdc
    │   ├── server-rules.mdc
    │   ├── test-rules.mdc
    ├── readme
    │   └── default.md
└── package.json
└── pnpm-lock.yaml
└── README.md
└── README.md.backup
└── tsconfig.json

```

{{/if}}

{{#if keywords}}
## キーワード

cli, ai, cursor, claude, templates

{{/if}}

## ライセンス

MIT

{{#if author}}
## 作成者



{{/if}}

## バージョン

0.3.2

