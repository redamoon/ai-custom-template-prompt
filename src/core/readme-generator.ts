import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { TEMPLATE_MAP } from "./config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface PackageInfo {
  name: string;
  description: string;
  version: string;
  repository?: string | { url: string };
  license?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  keywords?: string[];
  author?: string;
}

interface ProjectStructure {
  tree: string;
}

interface TemplateInfo {
  list: string;
}

interface CommandInfo {
  table: string;
}

interface ReadmeData {
  name: string;
  description: string;
  version: string;
  repository: string;
  license: string;
  commands: string;
  templates: string;
  projectStructure: string;
  dependencies: string;
  devDependencies: string;
  keywords: string;
  author: string;
  scripts: string;
}

// プロジェクトルートを取得
function getProjectRoot(): string {
  let currentDir = process.cwd();
  
  // package.jsonがあるディレクトリを探す
  while (currentDir !== path.dirname(currentDir)) {
    const packageJsonPath = path.join(currentDir, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  
  return process.cwd();
}

// package.jsonから情報を収集
export function collectPackageInfo(): PackageInfo {
  const projectRoot = getProjectRoot();
  const packageJsonPath = path.join(projectRoot, "package.json");
  
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error("package.jsonが見つかりません");
  }
  
  const packageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, "utf-8")
  ) as PackageInfo;
  
  return packageJson;
}

// プロジェクト構造を分析
export function collectProjectStructure(): ProjectStructure {
  const projectRoot = getProjectRoot();
  const ignoreDirs = [
    "node_modules",
    ".git",
    "dist",
    "build",
    ".next",
    ".cache",
    ".cursor",
    ".claude",
  ];
  
  function buildTree(dir: string, prefix: string = "", isLast: boolean = true): string {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
      .filter((entry) => {
        // 無視するディレクトリをスキップ
        if (entry.isDirectory() && ignoreDirs.includes(entry.name)) {
          return false;
        }
        // ドットファイルをスキップ（.cursor, .claudeは既に除外）
        if (entry.name.startsWith(".") && entry.name !== ".cursor" && entry.name !== ".claude") {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        // ディレクトリを先に、その後ファイル
        if (a.isDirectory() !== b.isDirectory()) {
          return a.isDirectory() ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
    
    let tree = "";
    
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const isLastEntry = i === entries.length - 1;
      const currentPrefix = isLast ? "└── " : "├── ";
      const nextPrefix = isLast ? "    " : "│   ";
      
      tree += `${prefix}${currentPrefix}${entry.name}\n`;
      
      if (entry.isDirectory()) {
        const subDir = path.join(dir, entry.name);
        try {
          tree += buildTree(subDir, prefix + nextPrefix, isLastEntry);
        } catch (err) {
          // アクセス権限エラーなどは無視
        }
      }
    }
    
    return tree;
  }
  
  const tree = buildTree(projectRoot);
  return { tree };
}

// テンプレート情報を収集
export function collectTemplateInfo(): TemplateInfo {
  const templateList = Object.entries(TEMPLATE_MAP)
    .map(([key, value]) => {
      const label = key.replace(/-/g, " ");
      return `- \`${key}\` - ${label} (→ ${value.to})`;
    })
    .join("\n");
  
  return { list: templateList };
}

// CLIコマンド情報を収集
export function collectCommandInfo(): CommandInfo {
  const commands = [
    { name: "init", description: "初回セットアップ（対話式でテンプレートを選択）" },
    { name: "add <template>", description: "指定テンプレートを追加" },
    { name: "list", description: "利用可能なテンプレート一覧を表示" },
    { name: "doctor", description: "設定チェック（テンプレートファイルの配置状況を確認）" },
    { name: "update-readme", description: "READMEを自動生成" },
  ];
  
  const table = [
    "| コマンド | 説明 |",
    "|---------|------|",
    ...commands.map((cmd) => `| \`${cmd.name}\` | ${cmd.description} |`),
  ].join("\n");
  
  return { table };
}

// 依存関係をフォーマット
function formatDependencies(deps: Record<string, string> | undefined): string {
  if (!deps || Object.keys(deps).length === 0) {
    return "なし";
  }
  
  return Object.entries(deps)
    .map(([name, version]) => `- \`${name}\`: ${version}`)
    .join("\n");
}

// スクリプトをフォーマット
function formatScripts(scripts: Record<string, string> | undefined): string {
  if (!scripts || Object.keys(scripts).length === 0) {
    return "なし";
  }
  
  return Object.entries(scripts)
    .map(([name, command]) => `- \`${name}\`: \`${command}\``)
    .join("\n");
}

// リポジトリURLを取得
function getRepositoryUrl(repo: string | { url: string } | undefined): string {
  if (!repo) {
    return "";
  }
  
  if (typeof repo === "string") {
    return repo;
  }
  
  return repo.url.replace(/\.git$/, "");
}

// テンプレート変数を収集
export function collectReadmeData(): ReadmeData {
  const pkg = collectPackageInfo();
  const structure = collectProjectStructure();
  const templates = collectTemplateInfo();
  const commands = collectCommandInfo();
  
  return {
    name: pkg.name || "",
    description: pkg.description || "",
    version: pkg.version || "",
    repository: getRepositoryUrl(pkg.repository),
    license: pkg.license || "MIT",
    commands: commands.table,
    templates: templates.list,
    projectStructure: structure.tree,
    dependencies: formatDependencies(pkg.dependencies),
    devDependencies: formatDependencies(pkg.devDependencies),
    keywords: pkg.keywords?.join(", ") || "",
    author: pkg.author || "",
    scripts: formatScripts(pkg.scripts),
  };
}

// テンプレートをレンダリング
export function renderTemplate(template: string, data: ReadmeData): string {
  let rendered = template;
  
  // すべての変数を置換
  rendered = rendered.replace(/\{\{name\}\}/g, data.name);
  rendered = rendered.replace(/\{\{description\}\}/g, data.description);
  rendered = rendered.replace(/\{\{version\}\}/g, data.version);
  rendered = rendered.replace(/\{\{repository\}\}/g, data.repository);
  rendered = rendered.replace(/\{\{license\}\}/g, data.license);
  rendered = rendered.replace(/\{\{commands\}\}/g, data.commands);
  rendered = rendered.replace(/\{\{templates\}\}/g, data.templates);
  rendered = rendered.replace(/\{\{projectStructure\}\}/g, data.projectStructure);
  rendered = rendered.replace(/\{\{dependencies\}\}/g, data.dependencies);
  rendered = rendered.replace(/\{\{devDependencies\}\}/g, data.devDependencies);
  rendered = rendered.replace(/\{\{keywords\}\}/g, data.keywords);
  rendered = rendered.replace(/\{\{author\}\}/g, data.author);
  rendered = rendered.replace(/\{\{scripts\}\}/g, data.scripts);
  
  return rendered;
}

// テンプレートファイルを検索
export function findTemplateFile(): string | null {
  const projectRoot = getProjectRoot();
  
  // 1. プロジェクトルートのカスタムテンプレートを探す
  const customTemplates = [
    path.join(projectRoot, ".readme-template.md"),
    path.join(projectRoot, "readme-template.md"),
    path.join(projectRoot, "templates", "readme", "template.md"),
  ];
  
  for (const templatePath of customTemplates) {
    if (fs.existsSync(templatePath)) {
      return templatePath;
    }
  }
  
  // 2. パッケージ内のデフォルトテンプレートを探す
  let currentDir = __dirname;
  while (currentDir !== path.dirname(currentDir)) {
    const defaultTemplate = path.join(currentDir, "..", "..", "templates", "readme", "default.md");
    if (fs.existsSync(defaultTemplate)) {
      return defaultTemplate;
    }
    currentDir = path.dirname(currentDir);
  }
  
  return null;
}

// READMEを生成
export function generateReadme(): string {
  const data = collectReadmeData();
  const templatePath = findTemplateFile();
  
  if (!templatePath) {
    throw new Error("テンプレートファイルが見つかりません");
  }
  
  const template = fs.readFileSync(templatePath, "utf-8");
  return renderTemplate(template, data);
}

