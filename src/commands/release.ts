import { execSync } from "child_process";
import fs from "fs";
import path from "path";

type VersionType = "patch" | "minor" | "major";

function getProjectRoot(): string {
  let currentDir = process.cwd();
  
  while (currentDir !== path.dirname(currentDir)) {
    const packageJsonPath = path.join(currentDir, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  
  return process.cwd();
}

function getCurrentVersion(): string {
  const projectRoot = getProjectRoot();
  const packageJsonPath = path.join(projectRoot, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  return packageJson.version;
}

function checkGitStatus(): void {
  try {
    const status = execSync("git status --porcelain", { encoding: "utf-8" });
    if (status.trim()) {
      throw new Error(
        "作業ディレクトリに未コミットの変更があります。先にコミットしてください。"
      );
    }
  } catch (error: any) {
    if (error.status === 1 && !error.stdout) {
      // gitリポジトリではない場合
      throw new Error("このディレクトリはgitリポジトリではありません。");
    }
    throw error;
  }
}

function checkGitBranch(): void {
  try {
    const branch = execSync("git branch --show-current", { encoding: "utf-8" }).trim();
    if (branch !== "main" && branch !== "master") {
      console.warn(`⚠️  警告: 現在のブランチは "${branch}" です。main/masterブランチでの実行を推奨します。`);
    }
  } catch (error) {
    // エラーは無視（gitリポジトリでない場合など）
  }
}

function updateVersion(versionType: VersionType): string {
  const projectRoot = getProjectRoot();
  const packageJsonPath = path.join(projectRoot, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  
  const [major, minor, patch] = packageJson.version.split(".").map(Number);
  let newVersion: string;
  
  switch (versionType) {
    case "major":
      newVersion = `${major + 1}.0.0`;
      break;
    case "minor":
      newVersion = `${major}.${minor + 1}.0`;
      break;
    case "patch":
      newVersion = `${major}.${minor}.${patch + 1}`;
      break;
  }
  
  packageJson.version = newVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
  
  return newVersion;
}

function build(): void {
  console.log("🔨 ビルド中...");
  try {
    execSync("pnpm build", { stdio: "inherit" });
  } catch (error) {
    throw new Error("ビルドに失敗しました。");
  }
}

function commitAndTag(version: string): void {
  console.log("📝 コミットとタグを作成中...");
  
  const projectRoot = getProjectRoot();
  const filesToAdd: string[] = ["package.json"];
  
  // 存在するロックファイルを追加
  if (fs.existsSync(path.join(projectRoot, "package-lock.json"))) {
    filesToAdd.push("package-lock.json");
  }
  if (fs.existsSync(path.join(projectRoot, "pnpm-lock.yaml"))) {
    filesToAdd.push("pnpm-lock.yaml");
  }
  if (fs.existsSync(path.join(projectRoot, "yarn.lock"))) {
    filesToAdd.push("yarn.lock");
  }
  
  try {
    // package.jsonとロックファイルをステージング（distはnpm公開時に含まれるがgitには含めない）
    execSync(`git add ${filesToAdd.join(" ")}`, {
      stdio: "inherit",
    });
    
    // コミット
    execSync(`git commit -m "chore: release v${version}"`, {
      stdio: "inherit",
    });
    
    // タグ作成
    execSync(`git tag v${version}`, {
      stdio: "inherit",
    });
  } catch (error: any) {
    if (error.status !== 0) {
      throw new Error("コミットまたはタグの作成に失敗しました。");
    }
    throw error;
  }
}

function push(version: string): void {
  console.log("📤 リモートにpush中...");
  
  try {
    // 現在のブランチを取得
    const branch = execSync("git branch --show-current", { encoding: "utf-8" }).trim();
    
    // コミットをpush
    execSync(`git push origin ${branch}`, {
      stdio: "inherit",
    });
    
    // タグをpush
    execSync(`git push origin v${version}`, {
      stdio: "inherit",
    });
  } catch (error: any) {
    if (error.status !== 0) {
      throw new Error("pushに失敗しました。");
    }
    throw error;
  }
}

function publish(): void {
  console.log("📢 npmに公開中...");
  
  try {
    execSync("npm publish", {
      stdio: "inherit",
    });
  } catch (error: any) {
    if (error.status !== 0) {
      throw new Error("npm公開に失敗しました。");
    }
    throw error;
  }
}

export default async function release(args: string[]) {
  const versionType = (args[0] || "patch") as VersionType;
  
  if (!["patch", "minor", "major"].includes(versionType)) {
    console.error("Error: バージョンタイプは patch, minor, major のいずれかである必要があります");
    console.error("使用例: ai-custom-template-prompt release patch");
    process.exit(1);
  }
  
  try {
    const currentVersion = getCurrentVersion();
    console.log(`🚀 リリースプロセスを開始します...`);
    console.log(`現在のバージョン: v${currentVersion}`);
    console.log(`バージョンタイプ: ${versionType}`);
    
    // 1. 事前確認
    console.log("\n1️⃣  事前確認中...");
    checkGitStatus();
    checkGitBranch();
    
    // 2. バージョン更新
    console.log(`\n2️⃣  バージョンを更新中...`);
    const newVersion = updateVersion(versionType);
    console.log(`✔ バージョンを v${currentVersion} → v${newVersion} に更新しました`);
    
    // 3. ビルド
    console.log(`\n3️⃣  ビルド中...`);
    build();
    console.log("✔ ビルドが完了しました");
    
    // 4. コミットとタグ作成
    console.log(`\n4️⃣  コミットとタグを作成中...`);
    commitAndTag(newVersion);
    console.log(`✔ コミットとタグ v${newVersion} を作成しました`);
    
    // 5. push
    console.log(`\n5️⃣  リモートにpush中...`);
    push(newVersion);
    console.log("✔ pushが完了しました");
    
    // 6. npm公開
    console.log(`\n6️⃣  npmに公開中...`);
    publish();
    console.log("✔ npm公開が完了しました");
    
    console.log(`\n✅ リリースが完了しました！ v${newVersion}`);
  } catch (error: any) {
    console.error(`\n❌ エラー: ${error.message}`);
    process.exit(1);
  }
}

