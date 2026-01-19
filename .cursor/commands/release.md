# リリースを実行

## 概要
バージョン更新、ビルド、コミット、タグ作成、push、npm公開を一式で実行する。

## 手順

### 1. 事前確認
- [ ] すべての変更がコミットされていることを確認
- [ ] テストがすべて合格していることを確認
- [ ] 変更ログやドキュメントが更新されていることを確認
- [ ] リリースするバージョン番号を決定（例: 0.2.3 → 0.2.4）

### 2. バージョン更新
- `package.json` の `version` フィールドを更新
- セマンティックバージョニングに従う:
  - **メジャー** (1.0.0): 破壊的変更
  - **マイナー** (0.1.0): 後方互換性のある新機能
  - **パッチ** (0.0.1): 後方互換性のあるバグ修正

```bash
# package.jsonを手動で編集するか、npm versionコマンドを使用
npm version patch   # パッチバージョン (0.2.3 → 0.2.4)
npm version minor   # マイナーバージョン (0.2.3 → 0.3.0)
npm version major   # メジャーバージョン (0.2.3 → 1.0.0)
```

### 3. ビルド
- プロジェクトをビルドして、最新のコードが正しくコンパイルされることを確認

```bash
pnpm build
# または
npm run build
```

### 4. テスト（オプション）
- ユニットテストや統合テストを実行

```bash
pnpm test
# または
npm test
```

### 5. コミットとタグ作成
- バージョン更新とビルド結果をコミット
- リリースタグを作成

```bash
# 変更をステージング
git add package.json package-lock.json pnpm-lock.yaml dist/

# コミット（npm versionを使用した場合は自動的にコミットされる）
git commit -m "chore: release v0.2.4"

# タグを作成
git tag v0.2.4

# または、npm versionを使用した場合は自動的にタグが作成される
```

### 6. リモートにpush
- コミットとタグをリモートリポジトリにpush

```bash
# コミットをpush
git push origin main
# または
git push origin master

# タグをpush
git push origin v0.2.4

# または、すべてのタグをpush
git push --tags
```

### 7. npm公開
- npmレジストリにパッケージを公開

```bash
# npmにログインしていることを確認
npm whoami

# 公開
npm publish

# または、特定のレジストリに公開する場合
npm publish --registry=https://registry.npmjs.org/

# GitHub Packagesに公開する場合
npm publish --registry=https://npm.pkg.github.com/
```

### 8. リリース後の確認
- [ ] npmレジストリでパッケージが正しく公開されていることを確認
- [ ] GitHubでリリースノートを作成（オプション）
- [ ] チームにリリースを通知

## 一括実行スクリプト例

```bash
#!/bin/bash
set -e

# バージョンタイプを引数から取得（patch, minor, major）
VERSION_TYPE=${1:-patch}

echo "🚀 リリースプロセスを開始します..."

# 1. バージョン更新
echo "📦 バージョンを更新中..."
npm version $VERSION_TYPE

# 2. ビルド
echo "🔨 ビルド中..."
pnpm build

# 3. コミットとタグはnpm versionで自動的に作成される

# 4. push
echo "📤 リモートにpush中..."
VERSION=$(node -p "require('./package.json').version")
git push origin main
git push origin v$VERSION

# 5. npm公開
echo "📢 npmに公開中..."
npm publish

echo "✅ リリースが完了しました！ v$VERSION"
```

## セマンティックバージョニング

### バージョン番号の形式
`MAJOR.MINOR.PATCH` (例: 1.2.3)

- **MAJOR**: 互換性のないAPI変更
- **MINOR**: 後方互換性のある機能追加
- **PATCH**: 後方互換性のあるバグ修正

### バージョン更新の判断基準

**パッチ (0.0.x)**
- バグ修正
- ドキュメントの修正
- タイポの修正

**マイナー (0.x.0)**
- 新機能の追加
- 既存機能の改善（後方互換性あり）
- 依存関係の更新

**メジャー (x.0.0)**
- APIの破壊的変更
- 大きなリファクタリング
- アーキテクチャの変更

## ベストプラクティス

- **CHANGELOGの更新**: リリース前に変更内容をCHANGELOG.mdに記録
- **リリースノート**: GitHubでリリースノートを作成して変更内容を説明
- **テストの徹底**: 公開前に必ずテストを実行
- **バックアップ**: 公開前に現在の状態をバックアップ
- **段階的公開**: まずプレリリース版（例: 1.0.0-beta.1）を公開してテスト
- **ロールバック計画**: 問題が発生した場合のロールバック手順を準備

## トラブルシューティング

### npm公開エラー: 403 Forbidden
- npmにログインしているか確認: `npm whoami`
- パッケージ名が既に使用されていないか確認
- 適切な権限があるか確認

### バージョンが既に存在するエラー
- バージョン番号を更新して再試行
- または、既存のバージョンを削除（非推奨）

### ビルドエラー
- TypeScriptのエラーを確認
- 依存関係が正しくインストールされているか確認

