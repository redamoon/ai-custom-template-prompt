import fs from "fs";
import path from "path";
import { getTemplateMap, TemplateKey } from "./config.js";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// テンプレートディレクトリのパスを動的に解決
// 開発モード: src/core -> プロジェクトルート -> templates
// ビルド後: dist/core -> プロジェクトルート -> templates
function getTemplateRoot() {
  // まず、process.cwd()からプロジェクトルートを探す（最も確実）
  const cwdTemplatesPath = path.join(process.cwd(), "templates");
  if (fs.existsSync(cwdTemplatesPath)) {
    return cwdTemplatesPath;
  }
  
  // 現在のファイルの場所からプロジェクトルートを推定
  let currentDir = __dirname;
  
  // dist または src ディレクトリを探す
  while (currentDir !== path.dirname(currentDir)) {
    const templatesPath = path.join(currentDir, "templates");
    if (fs.existsSync(templatesPath)) {
      return templatesPath;
    }
    // プロジェクトルートを探す（package.jsonがある場所）
    const packageJsonPath = path.join(currentDir, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      return path.join(currentDir, "templates");
    }
    currentDir = path.dirname(currentDir);
  }
  
  // フォールバック: 相対パスで探す
  const fallbackPath = path.join(__dirname, "..", "..", "templates");
  if (fs.existsSync(fallbackPath)) {
    return fallbackPath;
  }
  
  throw new Error("テンプレートディレクトリが見つかりません");
}

const templateRoot = getTemplateRoot();

export async function generate(name: TemplateKey | "all", dryRun = false) {
  const templateMap = getTemplateMap();
  
  if (dryRun) {
    console.log("🔍 [DRY RUN] 実行予定の操作:");
    console.log("");
  }
  
  if (name === "all") {
    Object.keys(templateMap).forEach((key) => {
      copy(templateMap[key], dryRun);
    });
  } else {
    const template = templateMap[name];
    if (!template) {
      console.log(`⚠️  テンプレートが見つかりません: ${name}`);
      return;
    }
    copy(template, dryRun);
  }
  
  if (dryRun) {
    console.log("");
    console.log("ℹ️  実際のファイル操作は行われませんでした。");
  }
}

function copy(def: { from: string; to: string }, dryRun = false) {
  const src = path.join(templateRoot, def.from);
  const dest = path.join(process.cwd(), def.to);

  if (!fs.existsSync(src)) {
    console.log(`(テンプレートなし) Skip: ${def.from}`);
    return;
  }

  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    if (dryRun) {
      console.log(`📁 ディレクトリを作成: ${def.to}/`);
      listDirectoryContents(src, def.to);
    } else {
      // ディレクトリの場合は再帰的にコピー
      fs.mkdirSync(dest, { recursive: true });
      copyDirectory(src, dest);
      console.log(`✔ ${def.to}/`);
    }
  } else {
    if (dryRun) {
      const destDir = path.dirname(dest);
      console.log(`📄 ファイルをコピー: ${def.to}`);
      if (destDir !== ".") {
        console.log(`   └─ ディレクトリを作成: ${destDir}/`);
      }
    } else {
      // ファイルの場合は通常通りコピー
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
      console.log(`✔ ${def.to}`);
    }
  }
}

function copyDirectory(src: string, dest: string) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function listDirectoryContents(src: string, basePath: string, indent = "   ") {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const relativePath = path.join(basePath, entry.name);

    if (entry.isDirectory()) {
      console.log(`${indent}📁 ${relativePath}/`);
      listDirectoryContents(srcPath, relativePath, indent + "   ");
    } else {
      console.log(`${indent}📄 ${relativePath}`);
    }
  }
}

