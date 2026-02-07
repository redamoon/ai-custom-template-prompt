import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// テンプレートルートを取得
function getTemplateRoot() {
  const cwdTemplatesPath = path.join(process.cwd(), "templates");
  if (fs.existsSync(cwdTemplatesPath)) {
    return cwdTemplatesPath;
  }

  // フォールバック: パッケージルートからの相対パスで探す
  // __dirname は dist/src/core/ なので、3階層上がパッケージルート
  const packageRootPath = path.join(__dirname, "..", "..", "..", "templates");
  if (fs.existsSync(packageRootPath)) {
    return packageRootPath;
  }

  // さらにフォールバック: 2階層上（開発時のsrc/core/からの参照）
  const fallbackPath = path.join(__dirname, "..", "..", "templates");
  if (fs.existsSync(fallbackPath)) {
    return fallbackPath;
  }

  throw new Error("テンプレートディレクトリが見つかりません");
}

// 動的にTemplateKeyを生成するための型
export type TemplateKey = string;

// テンプレートカテゴリの定義
export interface TemplateCategory {
  name: string;
  items: Array<{ value: TemplateKey; label: string }>;
}

// テンプレートマッピングの型
export interface TemplateMapping {
  from: string;
  to: string;
}

// 動的にテンプレートマップを生成
export function getTemplateMap(): Record<TemplateKey, TemplateMapping> {
  const templateRoot = getTemplateRoot();
  const map: Record<TemplateKey, TemplateMapping> = {};

  // Rules: templates/cursor/rules/*.mdc
  const rulesDir = path.join(templateRoot, "cursor", "rules");
  if (fs.existsSync(rulesDir)) {
    const ruleFiles = fs.readdirSync(rulesDir).filter((f) => f.endsWith(".mdc"));
    for (const file of ruleFiles) {
      const name = file.replace(".mdc", "");
      const key = `cursor-${name}`;
      map[key] = {
        from: `cursor/rules/${file}`,
        to: `.cursor/rules/${file}`,
      };
    }
  }

  // Commands: templates/cursor/commands/*.md
  const commandsDir = path.join(templateRoot, "cursor", "commands");
  if (fs.existsSync(commandsDir)) {
    const commandFiles = fs.readdirSync(commandsDir).filter((f) => f.endsWith(".md"));
    for (const file of commandFiles) {
      const name = file.replace(".md", "");
      const key = `cursor-command-${name}`;
      map[key] = {
        from: `cursor/commands/${file}`,
        to: `.cursor/commands/${file}`,
      };
    }
  }

  // Skills: templates/cursor/skills/*/SKILL.md (ディレクトリ単位)
  const skillsDir = path.join(templateRoot, "cursor", "skills");
  if (fs.existsSync(skillsDir)) {
    const skillFolders = fs.readdirSync(skillsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory());
    for (const folder of skillFolders) {
      const skillFile = path.join(skillsDir, folder.name, "SKILL.md");
      if (fs.existsSync(skillFile)) {
        const key = `cursor-skill-${folder.name}`;
        map[key] = {
          from: `cursor/skills/${folder.name}`,
          to: `.cursor/skills/${folder.name}`,
        };
      }
    }
  }

  // Agents: templates/agents/*.md
  const agentsDir = path.join(templateRoot, "agents");
  if (fs.existsSync(agentsDir)) {
    const agentFiles = fs.readdirSync(agentsDir).filter((f) => f.endsWith(".md"));
    for (const file of agentFiles) {
      const name = file.replace(".md", "");
      const key = `agent-${name.toLowerCase()}`;
      map[key] = {
        from: `agents/${file}`,
        to: name === "Agents" ? "AGENTS.md" : `${name}.md`,
      };
    }
  }

  return map;
}

// 後方互換性のためのTEMPLATE_MAP（動的に生成）
export const TEMPLATE_MAP = getTemplateMap();

export function getOptions() {
  const map = getTemplateMap();
  return Object.keys(map).map((k) => ({
    value: k as TemplateKey,
    label: k.replace(/-/g, " "),
  }));
}

// カテゴリ別にテンプレートを取得（動的にファイルから読み込み）
export function getTemplatesByCategory(): TemplateCategory[] {
  const templateRoot = getTemplateRoot();
  const categories: TemplateCategory[] = [];

  // Rules カテゴリ
  const rulesDir = path.join(templateRoot, "cursor", "rules");
  if (fs.existsSync(rulesDir)) {
    const ruleFiles = fs.readdirSync(rulesDir).filter((f) => f.endsWith(".mdc"));
    if (ruleFiles.length > 0) {
      categories.push({
        name: "Rules",
        items: ruleFiles.map((file) => {
          const name = file.replace(".mdc", "");
          return {
            value: `cursor-${name}`,
            label: file,
          };
        }),
      });
    }
  }

  // Commands カテゴリ
  const commandsDir = path.join(templateRoot, "cursor", "commands");
  if (fs.existsSync(commandsDir)) {
    const commandFiles = fs.readdirSync(commandsDir).filter((f) => f.endsWith(".md"));
    if (commandFiles.length > 0) {
      categories.push({
        name: "Commands",
        items: commandFiles.map((file) => {
          const name = file.replace(".md", "");
          return {
            value: `cursor-command-${name}`,
            label: file,
          };
        }),
      });
    }
  }

  // Skills カテゴリ
  const skillsDir = path.join(templateRoot, "cursor", "skills");
  if (fs.existsSync(skillsDir)) {
    const skillFolders = fs.readdirSync(skillsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory());
    const validSkills = skillFolders.filter((folder) => {
      const skillFile = path.join(skillsDir, folder.name, "SKILL.md");
      return fs.existsSync(skillFile);
    });
    if (validSkills.length > 0) {
      categories.push({
        name: "Skills",
        items: validSkills.map((folder) => {
          return {
            value: `cursor-skill-${folder.name}`,
            label: `${folder.name}/SKILL.md`,
          };
        }),
      });
    }
  }

  // Agents カテゴリ
  const agentsDir = path.join(templateRoot, "agents");
  if (fs.existsSync(agentsDir)) {
    const agentFiles = fs.readdirSync(agentsDir).filter((f) => f.endsWith(".md"));
    if (agentFiles.length > 0) {
      categories.push({
        name: "Agents",
        items: agentFiles.map((file) => {
          const name = file.replace(".md", "");
          return {
            value: `agent-${name.toLowerCase()}`,
            label: file,
          };
        }),
      });
    }
  }

  return categories;
}

// templates/cursor/rules/ディレクトリ内のルールファイルを動的に検出（後方互換性）
export function getAvailableRules(): Array<{ value: TemplateKey; label: string }> {
  const categories = getTemplatesByCategory();
  const rulesCategory = categories.find((c) => c.name === "Rules");
  return rulesCategory?.items || [];
}

