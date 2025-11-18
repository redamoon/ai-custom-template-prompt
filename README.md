# ai-custom-template-prompt

AI開発ツール（Cursor、Claude、Agents）向けのカスタムテンプレート管理CLIツールです。

## クイックスタート

```bash
# npxで直接実行（インストール不要）
npx ai-custom-template-prompt init
npx ai-custom-template-prompt list
npx ai-custom-template-prompt add cursor-rules
npx ai-custom-template-prompt doctor
```

## インストール

### GitHub Packages（Private）からインストール

チーム内で使用する場合：

```bash
# .npmrcファイルを作成（.npmrc.exampleを参考）
# GitHub Personal Access Tokenが必要（repo, write:packages, read:packages権限）

npm install @redamoon/ai-custom-template-prompt --registry=https://npm.pkg.github.com

# または、グローバルインストール
npm install -g @redamoon/ai-custom-template-prompt --registry=https://npm.pkg.github.com
```

### Public npmからインストール

```bash
# グローバルインストール
npm install -g ai-custom-template-prompt

# または、ローカルインストール
npm install ai-custom-template-prompt

# または、npxで直接実行（インストール不要）
npx ai-custom-template-prompt list
npx ai-custom-template-prompt init
npx ai-custom-template-prompt add cursor-rules
npx ai-custom-template-prompt doctor
```

### 開発用インストール

```bash
# リポジトリをクローン
git clone https://github.com/redamoon/ai-custom-template-prompt.git
cd ai-custom-template-prompt

# 依存関係のインストール
pnpm install
```

## 使用方法

### コマンド一覧

| コマンド | 説明 |
|---------|------|
| `init` | 初回セットアップ（対話式でテンプレートを選択） |
| `add <template>` | 指定テンプレートを追加 |
| `list` | 利用可能なテンプレート一覧を表示 |
| `doctor` | 設定チェック（テンプレートファイルの配置状況を確認） |

### 初回セットアップ（対話式）

```bash
# インストール済みの場合
ai-custom-template-prompt init

# または npxで実行
npx ai-custom-template-prompt init
```

対話式でテンプレートを選択してセットアップできます。

### テンプレートを追加

```bash
# インストール済みの場合
ai-custom-template-prompt add cursor-rules

# または npxで実行
npx ai-custom-template-prompt add cursor-rules
```

**利用可能なテンプレート名:**
- `cursor-rules` - Cursor用基本ルールファイル（常に適用）
- `cursor-manual-rules` - Manualルール（@manual-rulesで明示的に指定）
- `cursor-test-rules` - テストファイル用ルール（自動適用）
- `cursor-api-rules` - API関連コード用ルール（自動適用）
- `cursor-backend-rules` - バックエンド用ルール（ネスト: `backend/.cursor/rules/`）
- `cursor-frontend-rules` - フロントエンド用ルール（ネスト: `frontend/.cursor/rules/`）
- `cursor-server-rules` - サーバー用ルール（ネスト: `backend/server/.cursor/rules/`）
- `cursor-prompts` - Cursor用プロンプトファイル
- `claude-hooks` - Claude用カスタムフック
- `agents` - Agents設定ファイル

### テンプレート一覧を表示

```bash
# インストール済みの場合
ai-custom-template-prompt list

# または npxで実行
npx ai-custom-template-prompt list
```

### 設定チェック

```bash
# インストール済みの場合
ai-custom-template-prompt doctor

# または npxで実行
npx ai-custom-template-prompt doctor
```

プロジェクト内のテンプレートファイルの配置状況を確認できます。

## テンプレートの配置先

### プロジェクトルートのルール

- `.cursor/rules.mdc` - Cursor基本ルール（常に適用）
- `.cursor/rules/manual-rules.mdc` - Manualルール（@manual-rulesで指定）
- `.cursor/rules/test-rules.mdc` - テストファイル用ルール（自動適用）
- `.cursor/rules/api-rules.mdc` - API関連コード用ルール（自動適用）
- `.cursor/prompts.mdc` - Cursorプロンプト

### ネストされたルール（ディレクトリ別）

- `backend/.cursor/rules/backend-rules.mdc` - バックエンド用ルール
- `frontend/.cursor/rules/frontend-rules.mdc` - フロントエンド用ルール
- `backend/server/.cursor/rules/server-rules.mdc` - サーバー用ルール

### その他のテンプレート

- `ai/claude/custom-hooks.md` - Claudeフック
- `ai/agents/Agents.md` - Agents設定

### ルールの適用方法

- **基本ルール** (`rules.mdc`): `alwaysApply: true` で常に適用
- **Manualルール** (`manual-rules.mdc`): `@manual-rules` で明示的に指定した場合のみ適用
- **テストルール** (`test-rules.mdc`): `globs: ["**/*.test.ts"]` でテストファイルに自動適用
- **APIルール** (`api-rules.mdc`): `globs: ["**/api/**/*"]` でAPIディレクトリに自動適用
- **バックエンドルール** (`backend-rules.mdc`): `globs: ["backend/**/*"]` でバックエンドディレクトリに自動適用
- **フロントエンドルール** (`frontend-rules.mdc`): `globs: ["frontend/**/*"]` でフロントエンドディレクトリに自動適用
- **サーバールール** (`server-rules.mdc`): `globs: ["backend/server/**/*"]` でサーバーディレクトリに自動適用

### ネストされたルールの動作

Cursorは、ファイルが参照されたときに、そのファイルが含まれるディレクトリの`.cursor/rules`ディレクトリ内のルールを自動的に適用します。

例：
- `backend/api/users.ts` を開くと → `backend/.cursor/rules/backend-rules.mdc` が適用される
- `frontend/components/Button.tsx` を開くと → `frontend/.cursor/rules/frontend-rules.mdc` が適用される
- `backend/server/index.ts` を開くと → `backend/server/.cursor/rules/server-rules.mdc` が適用される

### ビルド

```bash
# TypeScriptをコンパイル
pnpm build

# ビルド後は dist/ ディレクトリに出力される
```

### ローカルでCLIをリンクして使用

```bash
# プロジェクトをグローバルにリンク
pnpm link --global

# または、別のプロジェクトからリンク
cd /path/to/your-project
pnpm link ai-custom-template-prompt

# CLIコマンドが使用可能になる
ai-custom-template-prompt list
ai-custom-template-prompt init
ai-custom-template-prompt add cursor-rules
ai-custom-template-prompt doctor
```

## 開発

### ローカル開発環境のセットアップ

```bash
# リポジトリをクローン
git clone https://github.com/redamoon/ai-custom-template-prompt.git
cd ai-custom-template-prompt

# 依存関係のインストール
pnpm install

# 開発モードで実行（tsxを使用）
pnpm dev <command>
```

### 動作確認手順

1. **依存関係のインストール**
   ```bash
   pnpm install
   ```

2. **テンプレート一覧の確認**
   ```bash
   pnpm dev list
   ```

3. **対話式セットアップのテスト**
   ```bash
   pnpm dev init
   ```

4. **単体テンプレート追加のテスト**
   ```bash
   pnpm dev add cursor-rules
   ```

5. **設定チェックのテスト**
   ```bash
   pnpm dev doctor
   ```

## テンプレートのカスタマイズ

`templates/` ディレクトリ内のファイルを編集することで、テンプレートの内容をカスタマイズできます。

- `templates/cursor/rules.mdc` - Cursor用ルール
- `templates/cursor/prompts.mdc` - Cursor用プロンプト
- `templates/claude/custom-hooks.md` - Claude用フック
- `templates/agents/Agents.md` - Agents設定

## パッケージ配布

このパッケージは以下の2つの方法で配布されます：

### 1. GitHub Packages（Private）

- **対象**: チーム内メンバーのみ
- **パッケージ名**: `@redamoon/ai-custom-template-prompt`
- **レジストリ**: `https://npm.pkg.github.com`
- **認証**: GitHub Personal Access Token（PAT）が必要

#### セットアップ手順

1. GitHub Personal Access Tokenを作成
   - 権限: `repo`, `write:packages`, `read:packages`
   - Settings → Developer settings → Personal access tokens → Tokens (classic)

2. `.npmrc`ファイルを作成
   ```ini
   @redamoon:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=YOUR_PERSONAL_ACCESS_TOKEN
   ```

3. インストール
   ```bash
   npm install @redamoon/ai-custom-template-prompt --registry=https://npm.pkg.github.com
   ```

### 2. Public npm

- **対象**: 誰でも利用可能
- **パッケージ名**: `ai-custom-template-prompt`
- **レジストリ**: `https://registry.npmjs.org`

#### インストール

```bash
npm install -g ai-custom-template-prompt
```

### 自動公開

GitHub Actionsワークフローにより、タグを作成すると自動的に両方のレジストリに公開されます：

```bash
# バージョンタグを作成
git tag v0.1.0
git push origin v0.1.0
```

#### 必要なシークレット設定

GitHubリポジトリのSettings → Secrets and variables → Actionsに以下を設定：

- `NPM_TOKEN`: npmjs.comのアクセストークン（Public npm公開用）
  - npmjs.comでログイン後、Access Tokensから作成
  - 権限: `Automation` または `Publish`

## ライセンス

MIT

