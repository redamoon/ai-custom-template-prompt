# {{name}}

{{description}}

{{#if repository}}
## リポジトリ

{{repository}}

{{/if}}

## インストール

```bash
# npmでインストール
npm install {{name}}

# または、グローバルインストール
npm install -g {{name}}

# または、npxで直接実行（インストール不要）
npx {{name}} --help
```

## 使用方法

### コマンド一覧

{{commands}}

{{#if templates}}
### 利用可能なテンプレート

{{templates}}

{{/if}}

{{#if scripts}}
## スクリプト

{{scripts}}

{{/if}}

{{#if dependencies}}
## 依存関係

### 本番依存関係

{{dependencies}}

{{/if}}

{{#if devDependencies}}
### 開発依存関係

{{devDependencies}}

{{/if}}

{{#if projectStructure}}
## プロジェクト構造

```
{{projectStructure}}
```

{{/if}}

{{#if keywords}}
## キーワード

{{keywords}}

{{/if}}

## ライセンス

{{license}}

{{#if author}}
## 作成者

{{author}}

{{/if}}

## バージョン

{{version}}

