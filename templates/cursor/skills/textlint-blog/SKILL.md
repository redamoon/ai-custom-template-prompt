---
name: textlint-blog
description: 指定フォルダ内のMarkdownファイルに対してtextlintを実行し、技術文書の品質向上とAI生成テキスト特有の表現（AIっぽさ）を検出・修正する。
---

# Textlint for Blog Folder

## When to Use

- ブログ記事用のMarkdownファイルを編集・作成する際
- ブログ記事の品質を向上させたい際
- AI生成テキスト特有の表現を検出・修正したい際

## 対象フォルダの設定

このスキルは任意のフォルダに対して適用できます。以下の例では `blog/` を使用していますが、プロジェクトに合わせて変更してください。

- `blog/` - 一般的なブログ記事
- `articles/` - Zennの記事
- `posts/` - 投稿記事
- `content/` - コンテンツフォルダ

## Instructions

### 概要

指定フォルダ内のMarkdownファイルを編集・作成する際は、必ず以下のtextlintルールを使用してテキストの品質をチェックします。

- `textlint-rule-preset-ja-technical-writing`: 技術文書の品質向上
- `textlint-rule-preset-ai-writing`: AI生成テキスト特有の表現を検出・修正（AIっぽさをなくすため）

### ファイル編集・作成時の手順

対象フォルダ内のMarkdownファイルを編集または作成する際は、以下の手順を必ず実行してください。

1. **編集前**: 現在のファイルの内容を確認
2. **編集後**: textlintを実行してチェック
3. **エラーがある場合**: 自動修正可能なものは`textlint --fix`で修正し、手動修正が必要なものはユーザーに報告

### textlint実行コマンド

```bash
# 対象フォルダ内のファイルをチェック（パスは適宜変更）
npx textlint "<フォルダ名>/**/*.md"

# 例: blogフォルダの場合
npx textlint "blog/**/*.md"

# 例: articlesフォルダの場合
npx textlint "articles/**/*.md"

# 自動修正可能な問題を修正
npx textlint --fix "<フォルダ名>/**/*.md"
```

### 使用するtextlint設定

ブログ記事用の設定として、以下のルールを必ず適用します。

```json
{
  "rules": {
    "preset-ja-technical-writing": {
      "ja-no-mixed-period": true,
      "ja-no-weak-phrase": true,
      "ja-no-abusage": true,
      "ja-no-redundant-expression": true,
      "ja-no-successive-word": true,
      "ja-no-orthographic-variants": true,
      "max-kanji-continuous-len": {
        "max": 5
      },
      "sentence-length": {
        "max": 100
      }
    },
    "preset-ai-writing": true
  }
}
```

**重要**: `preset-ai-writing`は、AI生成テキスト特有の表現（AIっぽさ）を検出・修正するために必須です。

### ファイル編集時の自動チェック

対象フォルダ内のファイルを編集する際は、以下のように動作してください。

1. ユーザーが対象フォルダ内の`.md`ファイルを編集・作成する
2. 編集内容を反映する前に、textlintでチェックを実行
3. エラーがある場合は以下を実行
   - 自動修正可能なエラーは修正してから保存
   - 手動修正が必要なエラーはユーザーに報告し、修正案を提示
4. エラーがない場合、または修正完了後にファイルを保存

### チェック項目

#### `textlint-rule-preset-ja-technical-writing`がチェックする主な項目：

- 句読点の統一（。と.の混在）
- 弱い表現の使用（〜かもしれない、〜と思います など）
- 誤用・誤字（よくある間違い）
- 冗長な表現
- 連続する同じ単語
- 表記ゆれ
- 漢字の連続（最大5文字まで）
- 文の長さ（最大100文字）

#### `textlint-rule-preset-ai-writing`がチェックする主な項目（AIっぽさをなくすため）：

- AI生成テキスト特有の表現パターン
- 過度に丁寧すぎる表現
- 不自然な接続詞の使用
- 機械的な文章構造
- AIがよく使うフレーズや表現

### 注意事項

1. **必須実行**: 対象フォルダ内のファイルに対しては、textlintチェックを省略してはいけない
2. **自動修正**: 可能な限り自動修正を実行し、ユーザーの作業を妨げないようにする
3. **エラー報告**: 手動修正が必要なエラーは、具体的な修正案とともに報告する
4. **パフォーマンス**: チェックは非同期で実行し、ユーザーの作業フローを阻害しない
5. **AIっぽさの除去**: `preset-ai-writing`を必ず適用し、AI生成テキスト特有の表現を検出・修正する

### はてなブログのMarkdown記法ルール

対象フォルダ内のファイルがはてなブログに投稿する記事である場合、以下のスキルも参照してください。

- **`hatena-blog-markdown`**: はてなブログのMarkdown記法ルールとベストプラクティス

主なルール：
- 見出しはh3（`###`）から始める（h1、h2は使用しない）
- 見出しの階層構造を守る（h3 → h4 → h5）
- 目次記法 `[:contents]` の使い方
- フォトライフ記法、TeX数式記法など、はてなブログ独自の記法

### 例

#### 編集前のチェック

```markdown
# ブログ記事のタイトル

これはサンプルの文章です。これは長い文章で、100文字を超える可能性があります。このような場合は、textlintが警告を出します。
```

#### textlint実行後

```bash
$ npx textlint "blog/sample.md"

blog/sample.md
  3:1  error  文が長すぎます（100文字を超えています）  sentence-length
```

#### 修正後

```markdown
# ブログ記事のタイトル

これはサンプルの文章です。このような場合は、textlintが警告を出します。
```
