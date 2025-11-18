# ブランチを作成

## 概要
適切な命名規則に従った機能ブランチを作成し、開発を開始する準備をする。

## 手順

### 1. 現在のブランチを確認
- `main` または `develop` ブランチにいることを確認
- 最新の変更を取得: `git pull origin main`
- 作業中の変更がないことを確認: `git status`

### 2. ブランチ名を決定
ブランチ名は以下の命名規則に従う:

- **機能追加**: `feature/機能名` または `feat/機能名`
  - 例: `feature/user-authentication`
  - 例: `feat/add-login-form`
- **バグ修正**: `fix/修正内容` または `bugfix/修正内容`
  - 例: `fix/login-error`
  - 例: `bugfix/memory-leak`
- **ホットフィックス**: `hotfix/修正内容`
  - 例: `hotfix/security-patch`
- **リファクタリング**: `refactor/変更内容`
  - 例: `refactor/api-structure`
- **ドキュメント**: `docs/内容`
  - 例: `docs/update-readme`
- **テスト**: `test/内容`
  - 例: `test/add-unit-tests`

### 3. ブランチを作成
```bash
# mainブランチから作成
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# または developブランチから作成
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### 4. ブランチをリモートにプッシュ
```bash
# 初回プッシュ時は upstream を設定
git push -u origin feature/your-feature-name

# 以降は通常のプッシュ
git push
```

## ブランチ作成チェックリスト

- [ ] ベースブランチ（main/develop）が最新である
- [ ] ブランチ名が命名規則に従っている
- [ ] ブランチがリモートにプッシュされている
- [ ] ブランチの目的が明確である

## ベストプラクティス

- **1ブランチ1機能**: 1つのブランチで1つの機能や修正に集中
- **定期的な同期**: 定期的に main/develop ブランチとマージして最新状態を保つ
- **明確なコミット**: 小さく、意味のあるコミットを作成
- **早期のPR作成**: 早期にPRを作成してフィードバックを受ける

## ブランチの命名例

```
feature/user-profile-page
feature/add-payment-integration
fix/login-authentication-error
fix/memory-leak-in-cache
hotfix/critical-security-patch
refactor/api-response-structure
docs/update-installation-guide
test/add-user-service-tests
```

