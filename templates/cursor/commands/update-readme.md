# README を更新

## 概要
`package.json`やプロジェクト構造から情報を読み取り、READMEを自動生成する。

## 手順

### 1. READMEを生成
- `ai-custom-template-prompt update-readme` コマンドを実行
- 既存のREADMEがある場合は、自動的に `README.md.backup` にバックアップされる
- 新しいREADMEが生成される

### 2. カスタムテンプレートを使用する場合
- プロジェクトルートに `.readme-template.md` または `readme-template.md` を配置
- または `templates/readme/template.md` に配置
- カスタムテンプレートがない場合は、デフォルトテンプレートが使用される

### 3. テンプレート変数
以下の変数が使用可能：

- `{{name}}` - パッケージ名
- `{{description}}` - パッケージ説明
- `{{version}}` - バージョン
- `{{repository}}` - リポジトリURL
- `{{license}}` - ライセンス
- `{{commands}}` - コマンド一覧（Markdownテーブル形式）
- `{{templates}}` - テンプレート一覧（Markdownリスト形式）
- `{{projectStructure}}` - プロジェクト構造（ツリー形式）
- `{{dependencies}}` - 依存関係一覧
- `{{devDependencies}}` - 開発依存関係一覧
- `{{keywords}}` - キーワード
- `{{author}}` - 作成者
- `{{scripts}}` - スクリプト一覧

## 実行例

```bash
# CLIコマンドとして実行
ai-custom-template-prompt update-readme

# または npxで実行
npx ai-custom-template-prompt update-readme

# または開発モードで実行
pnpm dev update-readme
```

## ベストプラクティス

- **定期的な更新**: プロジェクトの変更に合わせて定期的にREADMEを更新
- **カスタムテンプレート**: プロジェクト固有の情報を含める場合は、カスタムテンプレートを作成
- **バックアップ確認**: 生成前に既存のREADMEがバックアップされることを確認
- **手動編集**: 生成されたREADMEは必要に応じて手動で編集可能

