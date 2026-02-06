---
name: hatena-syntax-highlight
description: はてなブログのMarkdownモードでコードブロックのシンタックスハイライトを使用する際の記法ルールとベストプラクティス。
---

# はてなブログ シンタックスハイライト スキル

## When to Use

- ブログ記事用のMarkdownファイルでコードブロックを記述する際
- はてなブログに投稿する記事でコードを表示する際
- プログラミング言語のコードをシンタックスハイライト付きで表示したい際

## 対象フォルダの設定

このスキルは任意のフォルダに対して適用できます。以下の例では `blog/` を使用していますが、プロジェクトに合わせて変更してください。

- `blog/` - 一般的なブログ記事
- `articles/` - 記事フォルダ
- `posts/` - 投稿記事
- `content/` - コンテンツフォルダ

## Instructions

### シンタックスハイライト

はてなブログでは、コードブロックのシンタックスハイライトに対応しています。

**Markdownモードでの記法：**

```perl
my $name = "Hatena";
print "Hello, $name\n";
```

上記のように、コードブロックの開始部分で言語を指定することで、その言語に応じたシンタックスハイライトが適用されます。

### 対応言語

はてなブログは500以上のファイルタイプ（プログラミング言語）に対応しています。主な言語例：

- `perl`, `python`, `ruby`, `javascript`, `typescript`, `java`, `go`, `rust`, `php`, `c`, `cpp`, `csharp`, `swift`, `kotlin`, `dart`, `elixir`, `crystal`, `nim`, `zig`, `jsx`, `tsx`, `terraform`, `hcl`, `toml`, `yaml`, `json`, `html`, `css`, `sql`, `bash`, `sh`, `zsh`, `markdown`, `dockerfile` など

### 注意事項

- コードブロックは必ず行頭から記述する
- 言語名は小文字で指定する（例：`javascript`、`typescript`）
- はてな記法のスーパーpre記法（`>||言語名||`）も使用可能だが、Markdownモードでは上記の記法を推奨

詳細は[はてなブログ ヘルプ - シンタックスハイライト](https://help.hatenablog.com/entry/markup/syntaxhighlight)を参照してください。
